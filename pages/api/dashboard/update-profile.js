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
  
  if (req.method === "POST") {
    const { data } = req.body;
    let endpoint = `${WP_URL}/wp-json/wc/v3/customers/${customer}?consumer_key=${process.env.WP_CONSUMER_KEY}&consumer_secret=${process.env.WP_CONSUMER_SECRET}`;
    try {
      const response = await axios.post(endpoint, data);
      const customerData = await response.data;
      res.status(200).json({
        message: "Profile updated successfuly",
        data: customerData,
      });
    } catch (error) {

      res.status(400).json({
        message: "There was an error in updating profile",
        data: error,
      });
    }
  }
}
