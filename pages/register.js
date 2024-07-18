import Layout from "../components/Layout";
import SeoConfig, { SeoData } from "../components/SEOConfig";
import RegisterContent from "../components/userScreens/Register";

export default function Register() {
  return (
    <Layout>
      <SeoConfig passedSeoData={SeoData.register} />
      <RegisterContent />
    </Layout>
  );
}
