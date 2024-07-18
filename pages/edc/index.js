import React from "react";
import Banner from "../../components/Products/Banner";
import Content from "../../components/Products/Content";
import Layout from "../../components/Layout";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import SeoConfig, { SeoData } from "../../components/SEOConfig";
import { WP_URL } from "../../utils/config";
import Preloader from "../../components/Preloader";

function EDC() {
  const [edcHeader, setEdcHeader] = React.useState(null);
  const getEdcHeaderData = async () => {
    let result = await axios.get(
      `${WP_URL}/wp-json/wp/v2/categories`
    );
    if (result?.data) {
      const headerText = result.data
        .find((x) => x.slug === "edc")
        .description.split("</small>")[0]
        .slice(7);
      setEdcHeader(headerText);
    }
  };

  React.useEffect(() => {
    getEdcHeaderData();
  }, []);
  return edcHeader ? (
    <Layout>
      <SeoConfig passedSeoData={SeoData.edc} />
      <Banner text={edcHeader} page="EDC" />
      <Content category="edc" />
    </Layout>
  ) : (
    <Preloader/>
  );
}

export default EDC;
