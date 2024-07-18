import axios from "axios";
import { getCartKeyParamsIfNaN } from "../../functions/cocart";
import { SITE_URL, WP_URL } from "../../utils/config";
import {
  isShippingInvalid,
  isBillingInvalid,
} from "../../functions/check-address";
import { generateSezzleToken } from "../../functions/sezzle";
require("dotenv").config();

// get all products from WP WooCommerce API with authendication

const NMI_SECURITY_KEY = process.env.NMI_SECURITY_KEY;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res
      .status(400)
      .send({ errorMessage: "Only POST requests allowed", data: [] });
    return;
  }
  try {
    // If auth header is present, cart_key wont be used
    const cart_key = req.body.cart_key;
    const auth_header = req.headers.authorization;
    const cartKeyParam = !auth_header && getCartKeyParamsIfNaN(cart_key);

    // If no cart_key and no auth_header, return error
    if (!cartKeyParam && !auth_header)
      return res
        .status(400)
        .json({ error: "cart_key or authorization header required" });

    const {
      shipping,
      billing,
      payment_method,
      payment_method_title,
      card_input,
    } = req.body;

    const shippingError = isShippingInvalid(shipping);
    const billlingError = isBillingInvalid(billing);

    if (shippingError || billlingError)
      return res
        .status(400)
        .json({ errorMessage: shippingError || billlingError });

    if (payment_method === "nmi" && !card_input)
      return res.status(400).json({
        errorMessage: "card_input is required for the provided payment_method",
      });

    console.log("Getting cart");
    // Get cart with cart_key token from WP WooCommerce API

    const getCartEndpoint = `${WP_URL}/wp-json/cocart/v1/get-cart?consumer_key=${process.env.WP_CONSUMER_KEY}&consumer_secret=${process.env.WP_CONSUMER_SECRET}&${cartKeyParam}`;
    const clearCartEndpoint = `${WP_URL}/wp-json/cocart/v2/cart/clear?consumer_key=${process.env.WP_CONSUMER_KEY}&consumer_secret=${process.env.WP_CONSUMER_SECRET}&${cartKeyParam}`;
    console.log(getCartEndpoint);
    const cartRes = await axios.get(getCartEndpoint, {
      headers: auth_header ? { Authorization: auth_header } : {},
    });
    const cart = cartRes.data;
    console.log(cart, "gettingCart fdkfnkfn");

    const line_items = cart.items.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
      variation_id: item.variation_id,
    }));

    const shippingMethod = Object.values(cart.shipping_methods).find(
      (s) => s.chosen_method
    );

    const shipping_lines = [
      {
        method_id: shippingMethod.key,
        method_title: shippingMethod.label,
        total: shippingMethod.cost,
      },
    ];

    const coupon_lines = cart.coupons.map((coupon) => ({
      code: coupon.coupon,
    }));
    console.log(coupon_lines, "couponLines");

    // Place order with WP WooCommerce API with set_paid: false
    const createOrderEndpoint = `${WP_URL}/wp-json/wc/v3/orders?consumer_key=${process.env.WP_CONSUMER_KEY}&consumer_secret=${process.env.WP_CONSUMER_SECRET}`;

    const orderData = {
      set_paid: false,
      billing,
      shipping,
      line_items,
      shipping_lines,
      payment_method,
      payment_method_title,
      coupon_lines,
    };

    // If cart_key provided is a number (is a customer_id), use it as the customer_id
    if (!isNaN(cart.cart_key)) {
      orderData.customer_id = parseInt(cart.cart_key);
    } else {
      const email = billing.email;
      if (!email) throw new Error("Email is required");
      const customerEndpoint = `${WP_URL}/wp-json/wc/v3/customers?consumer_key=${process.env.WP_CONSUMER_KEY}&consumer_secret=${process.env.WP_CONSUMER_SECRET}&email=${email}`;

      const customerRes = await axios.get(customerEndpoint);

      if (customerRes.data.length > 0) {
        const customerId = customerRes.data[0].id;
        orderData.customer_id = customerId;
      }
      // This cart key would be used to authorize orders for guest users
      orderData.meta_data = [
        {
          key: "cart_key",
          value: cart.cart_key,
        },
      ];
    }
    const amount =
      parseFloat(cart.totals.total.substr(1)) + parseFloat(shippingMethod.cost);

    if (amount > 0 && (!payment_method || !payment_method_title)) {
      return res.status(400).json({
        errorMessage: "payment_method or payment_method_title are required",
      });
    }
    console.log(amount, "finalamount");

    // Process payment
    if (amount === 0) {
      orderData.set_paid = true;

      const orderRes = await axios.post(createOrderEndpoint, orderData);
      console.log(orderRes);
      const orderId = orderRes.data.id;

      return res.status(200).json({
        message: "Success",
        payment_method,
        redirectURL: `/order-complete?order_id=${orderId}&order_key=${orderRes.data.order_key}`,
      });
    }
    if (payment_method === "nmi") {
      console.log(orderData, "👽👽👽");

      // nmi - Create order after payment is done
      const paymentData = {
        security_key: NMI_SECURITY_KEY,
        type: "sale",
        ccnumber: card_input.ccnumber,
        ccexp: card_input.ccexp,
        cvv: card_input.cvv,
        amount: amount.toFixed(2),
      };
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
      console.log(paymentData, orderData.customer_id, "payment");
      const pointData = await axios.post(
        "https://www.damnedventures.com/custom_api.php",
        {
          action: "getpoints",
          user_id: orderData.customer_id,
        }
      );
      console.log(pointData.data.points, "poinsData");
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
      orderData.transaction_id = nmiPaymentResData.get("transactionid");
      orderData.set_paid = true;

      const orderRes = await axios.post(createOrderEndpoint, orderData);

      const orderId = orderRes.data.id;
      console.log(orderId, orderRes, amount, "🧛‍♂️🧛‍♂️🧛‍♂️🧛‍♂️");
      await axios
        .post("https://www.damnedventures.com/custom_api.php", {
          action: "pricechange",
          order_id: orderId,
          point_discount: pointData.data.points
            ? pointData.data.points / 15
            : 0,
          total_price:
            orderRes.data.total -
            (pointData.data.points ? pointData.data.points / 15 : 0),
        })
        .then((res) => console.log(res, "post meta"));
      const cartRes = await axios.post(clearCartEndpoint, {
        headers: auth_header ? { Authorization: auth_header } : {},
      });
      await axios.post("https://www.damnedventures.com/custom_api.php", {
        action: "redeempoints",
        user_id: orderData.customer_id,
        rppoints: pointData.data.points,
      });
      await axios.post(`https://www.damnedventures.com/custom_api.php`, {
        action: "deletepoints",
        user_id: orderData.customer_id,
      });

      console.log("Cart clear", cartRes.data);

      return res.status(200).json({
        message: "Success",
        payment_method,
        redirectURL: `/order-complete?order_id=${orderId}&order_key=${orderRes.data.order_key}`,
      });
    } else if (payment_method === "sezzlepay") {
      // Sezzle (3 part)
      // 1. Create order with set_paid: false
      const orderRes = await axios.post(createOrderEndpoint, orderData);
      console.log("Order", orderRes.data);

      const orderId = String(orderRes.data.id);
      const order_amount = {
        amount_in_cents: parseInt(amount * 100),
        currency: "USD",
      };
      console.log("Order amount:", order_amount);

      // 2. Generate Sezzle token (Bearer authentication)
      const sezzleBearerToken = await generateSezzleToken();

      // 3. Create Sezzle Session
      const sezzleCreateSessionData = {
        cancel_url: {
          href: `${SITE_URL}/order-complete?order_id=${orderId}&order_key=${orderRes.data.order_key}`,
          method: "GET",
        },
        complete_url: {
          href: `${SITE_URL}/order-complete?order_id=${orderId}&order_key=${orderRes.data.order_key}`,
          method: "GET",
        },
        order: {
          intent: "CAPTURE",
          reference_id: orderId,
          description: `Damned Designs Order ${orderId}`,
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
      console.log(sezzleSession);

      // TODO: add sezzle order uuid into metadata
      const orderUpdateData = {
        meta_data: [
          {
            key: "sezzle_order_uuid",
            value: sezzleSession.order.uuid,
          },
        ],
      };

      const orderUpdateRes = await axios.put(
        `${WP_URL}/wp-json/wc/v3/orders/${orderId}?consumer_key=${process.env.WP_CONSUMER_KEY}&consumer_secret=${process.env.WP_CONSUMER_SECRET}`,
        orderUpdateData
      );
      console.log("Order meta_data updated: ", orderUpdateRes.data.meta_data);

      const cartRes = await axios.post(clearCartEndpoint, {
        headers: auth_header ? { Authorization: auth_header } : {},
      });
      console.log("Cart clear", cartRes.data);
      // On client side - Redirect to Sezzle
      return res.status(200).json({
        message: "Pending",
        payment_method: payment_method,
        redirectURL: sezzleSession.order.checkout_url,
      });
    }
  } catch (error) {
    console.log(error.response);
    return res.status(500).json({
      errorMessage: "Something went wrong",
    });
  }
}
