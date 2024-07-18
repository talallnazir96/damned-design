import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }


  try {
    await axios.post(
      "https://www.damnedventures.com/wp-json/wp/v2/wpo_mailster",
      {
        email: email,
      },
      {
        headers: {
          Authorization: `Basic ${process.env.WP_BASIC_AUTH}`,
        },
      }
    );
    return res.status(200).json({ message: "Success" });
  } catch (error) {
    return res.status(401).json({ errorMessage: "Email already exists" });
  }

}
