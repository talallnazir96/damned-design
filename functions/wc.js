import WooCommerceAPI from "woocommerce-api";
import { WP_URL } from "../utils/config";

export const WooCommerce = new WooCommerceAPI({
  url: WP_URL,
  consumerKey: process.env.WP_CONSUMER_KEY,
  consumerSecret: process.env.WP_CONSUMER_SECRET,
  wpAPI: true,
  version: "wc/v3",
});
