import React from "react";
import Banner from "../../components/Products/Banner";
import Content from "../../components/Products/Content";
import Layout from "../../components/Layout";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import { NextSeo } from "next-seo";
import SeoConfig, { SeoData } from "../../components/SEOConfig";
import { WP_URL } from "../../utils/config";
import Preloader from "../../components/Preloader";

function Knives() {
  const [knifeHeader, setKnifeHeader] = React.useState(null);
  const getKnifeHeaderData = async () => {
    let result = await axios.get(
      `${WP_URL}/wp-json/wp/v2/categories`
    );
    if (result?.data) {
      const headerText = result.data
        .find((x) => x.slug === "knives")
        .description.split("</small>")[0]
        .slice(7);
      setKnifeHeader(headerText);
    }
  };
  React.useEffect(() => {
    getKnifeHeaderData();
  }, []);
  return knifeHeader ? (
    <Layout>
      <SeoConfig passedSeoData={SeoData.knives} />
      <NextSeo />
      <Banner text={knifeHeader} page="Knives" />
      <Content category="knives" />
    </Layout>
  ) : (
    <Preloader/>
  );
}

export default Knives;
