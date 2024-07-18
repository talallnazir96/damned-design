import axios from "axios";
import { SITE_URL, WP_URL } from "../../utils/config";
import { generateSezzleToken } from "../../functions/sezzle";

const NMI_SECURITY_KEY = process.env.NMI_SECURITY_KEY;

if (!NMI_SECURITY_KEY) {
  throw new Error("NMI_SECURITY_KEY is not defined in environment variables");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(400).send({ errorMessage: "Only POST requests allowed" });
  }

  const { order_id, payment_method, payment_method_title, card_input } =
    req.body;

  if (!order_id) {
    return res.status(400).json({ errorMessage: "Missing order_id" });
  }

  if (!payment_method) {
    return res.status(400).json({ errorMessage: "Missing payment_method" });
  }

  if (!payment_method_title) {
    return res
      .status(400)
      .json({ errorMessage: "Missing payment_method_title" });
  }

  if (payment_method === "nmi" && !card_input) {
    return res.status(400).json({ errorMessage: "Missing card_input" });
  }

  const orderRes = await axios.get(
    `${WP_URL}/wp-json/wc/v3/orders/${order_id}?consumer_key=${process.env.WP_CONSUMER_KEY}&consumer_secret=${process.env.WP_CONSUMER_SECRET}`
  );

  const order = orderRes.data;

  if (order.status !== "pending") {
    return res.status(400).json({ errorMessage: "Order is not pending" });
  }

  const orderUpdateData = {
    payment_method,
    payment_method_title,
  };

  const amount = parseFloat(order.total);
  console.log(amount, order, "order details");


  if (payment_method === "nmi") {
    try {
      // nmi - Create order after payment is done
      const paymentData = {
        security_key: NMI_SECURITY_KEY,
        type: "sale",
        ccnumber: card_input.ccnumber,
        ccexp: card_input.ccexp,
        cvv: card_input.cvv,
        amount: amount.toFixed(2),
      };
      console.log(paymentData);
      const nmiPaymentEndpoint = "https://secure.nmi.com/api/transact.php";
      const nmiPaymentRes = await axios.post(
        nmiPaymentEndpoint,
        new URLSearchParams(paymentData).toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const nmiPaymentResData = new URLSearchParams(nmiPaymentRes.data);

      const nmiPaymentResponse = nmiPaymentResData.get("response");
      if (
        nmiPaymentResponse !== "1" ||
        nmiPaymentResData.get("cvvresponse") !== "M" ||
        nmiPaymentResData.get("response_code") !== "100"
      ) {
        return res.status(400).json({
          error: nmiPaymentResData.get("responsetext"),
        });
      }

      // Set order as truely paid and processing
      orderUpdateData.transaction_id = nmiPaymentResData.get("transactionid");
      orderUpdateData.set_paid = true;

      const orderUpdatedRes = await axios.put(
        `${WP_URL}/wp-json/wc/v3/orders/${order_id}?consumer_key=${process.env.WP_CONSUMER_KEY}&consumer_secret=${process.env.WP_CONSUMER_SECRET}`,
        orderUpdateData
      );

      return res.status(200).json({
        message: "Success",
        payment_method,
        redirectURL: `/order-complete?order_id=${order_id}&order_key=${orderUpdatedRes.data.order_key}`,
      });
    } catch (error) {
      console.log(error);
    }
  } else if (payment_method === "sezzlepay") {
    try {
      // Sezzle (2 part)
      const order_amount = {
        amount_in_cents: parseInt(amount * 100),
        currency: "USD",
      };

      // 2. Generate Sezzle token (Bearer authentication)
      const sezzleBearerToken = await generateSezzleToken();

      // 3. Create Sezzle Session
      const sezzleCreateSessionData = {
        cancel_url: {
          href: `${SITE_URL}/order-complete?order_id=${order_id}&order_key=${orderRes.data.order_key}`,
          method: "GET",
        },
        complete_url: {
          href: `${SITE_URL}/order-complete?order_id=${order_id}&order_key=${orderRes.data.order_key}`,
          method: "GET",
        },
        order: {
          intent: "CAPTURE",
          reference_id: String(order_id),
          description: `Damned Designs Order ${order_id}`,
          order_amount,
        },
      };
      const sezzleSessionCreateEndpoint =
        "https://sandbox.gateway.sezzle.com/v2/session";

      const sezzleSessionRes = await axios.post(
        sezzleSessionCreateEndpoint,
        sezzleCreateSessionData,
        {
          headers: {
            Authorization: `Bearer ${sezzleBearerToken}`,
          },
        }
      );
      const sezzleSession = sezzleSessionRes.data;

      // TODO: add sezzle order uuid into metadata
      orderUpdateData.meta_data = [
        {
          key: "sezzle_order_uuid",
          value: sezzleSession.order.uuid,
        },
      ];

      const orderUpdateRes = await axios.put(
        `${WP_URL}/wp-json/wc/v3/orders/${order_id}?consumer_key=${process.env.WP_CONSUMER_KEY}&consumer_secret=${process.env.WP_CONSUMER_SECRET}`,
        orderUpdateData
      );

      // On client side - Redirect to Sezzle
      return res.status(200).json({
        message: "Pending",
        payment_method: payment_method,
        redirectURL: sezzleSession.order.checkout_url,
      });
    } catch (error) {
      console.log(error);
    }
  } else {
    return res.status(400).json({ errorMessage: "Unknown payment method" });
  }
}
