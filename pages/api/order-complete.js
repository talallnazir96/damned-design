import axios from "axios";
import { generateSezzleToken } from "../../functions/sezzle";
import { WP_URL } from "../../utils/config";

export default async function hanlder(req, res) {
  if (req.method !== "GET") {
    return res.status(400).send({ errorMessage: "Only GET requests allowed" });
  }
  const order_id = req.query.order_id;
  const order_key = req.query.order_key;

  if (!order_id || !order_key) {
    return res
      .status(400)
      .json({ errorMessage: "Missing order_id or order_key" });
  }

  try {
    const order = await axios.get(
      `${WP_URL}/wp-json/wc/v3/orders/${order_id}?consumer_key=${process.env.WP_CONSUMER_KEY}&consumer_secret=${process.env.WP_CONSUMER_SECRET}`
    );
    const orderData = order.data;
    console.log(orderData, "orderData");

    if (orderData.order_key !== order_key) {
      return res.status(404).json({ errorMessage: "Order not found" });
    }

    if (orderData.status === "pending") {
      // if payment_method = sezzle. Check if order is paid.
      // If paid, and order is pending, mark order as paid (processing)
      if (orderData.payment_method === "sezzlepay") {
        console.log(orderData.meta_data)
        const sezzleOrderUuid = orderData.meta_data.find(
          (meta) => meta.key === "sezzle_order_uuid"
        );
        if (!sezzleOrderUuid) {
          return res
            .status(500)
            .json({ errorMessage: "Sezzle UUID not found" });
        }
        const sezzleToken = await generateSezzleToken();
        const sezzleOrder = await axios.get(
          `https://sandbox.gateway.sezzle.com/v2/order/${sezzleOrderUuid.value}`,
          {
            headers: {
              Authorization: `Bearer ${sezzleToken}`,
            },
          }
        );
        const sezzleOrderData = sezzleOrder.data;
        if (sezzleOrderData.checkout_status === "completed") {
          const orderUpdateData = {
            set_paid: true,
          };
          const orderUpdatedRes = await axios.put(
            `${WP_URL}/wp-json/wc/v3/orders/${order_id}?consumer_key=${process.env.WP_CONSUMER_KEY}&consumer_secret=${process.env.WP_CONSUMER_SECRET}`,
            orderUpdateData
          );
          // console.log("Order updated: ", orderUpdatedRes.data);
          return res.status(200).json(orderUpdatedRes.data);
        } else {
          return res.json(orderData);
        }
      }
    }

    return res.status(200).json(orderData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errorMessage: "Something went wrong" });
  }
}
