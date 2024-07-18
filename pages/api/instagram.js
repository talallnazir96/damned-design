import axios from "axios";
require("dotenv").config();
export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(400).send({ message: "Only GET requests allowed", data: [] });
    return;
  } else {
    const endpoint = `https://www.damnedventures.com/wp-json/instagram/v1`;
    try {
      const response = await axios.get(endpoint);
      const { status, data } = await response;
      if (status == 200) {
        res.status(200).send(data);
      } else {
        res.status(400).send({ message: 'Error' });
      }
    } catch (error) {
      res.status(400).json({ message: error, data: [] });
    }
  }
}
