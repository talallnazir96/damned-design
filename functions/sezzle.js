import axios from "axios";

export const generateSezzleToken = async () => {
  const sezzleBearerRes = await axios.post(
    "https://sandbox.gateway.sezzle.com/v2/authentication",
    {
      private_key: process.env.SEZZLE_TEST_PRIVATE_KEY,
      public_key: process.env.SEZZLE_TEST_PUBLIC_KEY,
    }
  );
  return sezzleBearerRes.data.token;
}