import axios from "axios";
import { WooCommerce } from "../../functions/wc";
import { WP_URL } from "../../utils/config";
require("dotenv").config();

export default async function handler(req, res) {
  const { couponCode } = req.query;

  const couponsEndpoint = `${WP_URL}/wp-json/wc/v3/coupons?code=${couponCode}&consumer_key=${process.env.WP_CONSUMER_KEY}&consumer_secret=${process.env.WP_CONSUMER_SECRET}`;

  try {
    const response = await axios.get(couponsEndpoint);

    const coupons = response.data;

    if (coupons.length > 0) {
      const coupon = coupons[0];
      return res.status(200).json({ ...coupon });
    } else {
      return res.status(404).json({ error: "Coupon not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
}
