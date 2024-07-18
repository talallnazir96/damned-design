import Layout from "../components/Layout";
import SeoConfig, { SeoData } from "../components/SEOConfig";
import LoginContent from "../components/userScreens/Login";

export default function Login() {
  return (
    <Layout>
      <SeoConfig passedSeoData={SeoData.login} />
      <LoginContent />
    </Layout>
  );
}
