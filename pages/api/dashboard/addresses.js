import axios from "axios";
import { getUserFromRequest } from "../../../functions/general";
import { WP_URL } from "../../../utils/config";
require("dotenv").config();

export default async function handler(req, res) {
  const user = getUserFromRequest(req);
  if (!user) {
    return res.status(400).json({ errorMessage: "User not authenticated" });
  }
  const customer = user.id;

  if (req.method === "GET") {
    let endpoint = `${WP_URL}/wp-json/wc/v3/customers/${customer}?consumer_key=${process.env.WP_CONSUMER_KEY}&consumer_secret=${process.env.WP_CONSUMER_SECRET}`;
    try {
      const response = await axios.get(endpoint);
      const customerData = await response.data;
      res.status(200).json({ message: "Success", data: customerData });
    } catch (error) {
      res.status(400).json({
        message: "There was an error in loading data",
        data: error,
      });
    }
  }
  if (req.method === "POST") {
    const { address } = req.body;
    let endpoint = `${WP_URL}/wp-json/wc/v3/customers/${customer}?consumer_key=${process.env.WP_CONSUMER_KEY}&consumer_secret=${process.env.WP_CONSUMER_SECRET}`;
    try {
      const response = await axios.post(endpoint, address);
      const customerData = await response.data;
      // console.log('customerData', customerData)
      res.status(200).json({
        message: "Address updated successfuly",
        data: customerData,
      });
    } catch (error) {
      res.status(400).json({
        message: "There was an error in updating address",
        data: error,
      });
    }
  }
}
