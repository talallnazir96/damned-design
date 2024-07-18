import Layout from "../components/Layout";
import SeoConfig, { SeoData } from "../components/SEOConfig";
import ForgotPasswordContent from "../components/userScreens/ForgotPassword";

export default function ForgotPassword() {
  return (
    <Layout>
      <SeoConfig passedSeoData={SeoData.forgotPassword} />
      <ForgotPasswordContent />
    </Layout>
  );
}
