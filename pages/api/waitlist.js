import axios from "axios";
import { WP_URL } from "../../utils/config";

export default async function handler(req, res) {
  if (req.method == "POST") {
    const body = req.body;
    const endpoint =
      `${WP_URL}/wp-json/wp/v2/waitlistingInsert`;
    try {
      const response = await axios.post(endpoint, body);
      const data = await response.data;
      res.status(200).json({ data: data });
    } catch (error) {
      res.status(400).json(error);
    }
    return;
  }
  if (req.method == "GET") {
    const { email } = req.query;
    const endpoint = `${WP_URL}/wp-json/wp/v2/waitlistingByEmail?email=${email}`;
    try {
      const response = await axios.get(endpoint);
      const data = await response.data;
      res.status(200).json({ data: data });
    } catch (error) {
      res.status(400).json(error);
    }
    return;
  }
}
