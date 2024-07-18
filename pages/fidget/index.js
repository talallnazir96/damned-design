import React from "react";
import Banner from "../../components/Products/Banner";
import Content from "../../components/Products/Content";
import Layout from "../../components/Layout";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import SeoConfig, { SeoData } from "../../components/SEOConfig";
import { WP_URL } from "../../utils/config";
import Preloader from "../../components/Preloader";
function Fidget() {
  const [fidgetHeader, setFidgetHeader] = React.useState(null);
  const getFidgetHeaderData = async () => {
    let result = await axios.get(`${WP_URL}/wp-json/wp/v2/categories`);
    if (result?.data) {
      const headerText = result.data
        .find((x) => x.slug === "fidget")
        .description.split("</small>")[0]
        .slice(7);
      setFidgetHeader(headerText);
    }
  };

  React.useEffect(() => {
    getFidgetHeaderData();
  }, []);

  return fidgetHeader ? (
    <Layout>
      <SeoConfig passedSeoData={SeoData.knives} />
      <Banner text={fidgetHeader} page="Fidget" />
      <Content category="fidget" />
    </Layout>
  ) : (
    <Preloader />
  );
}

export default Fidget;
