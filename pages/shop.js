import React from "react";
import Banner from "../components/Products/Banner";
import Content from "../components/Products/Content";
import Layout from "../components/Layout";
import SeoConfig, { SeoData } from "../components/SEOConfig";

function Shop() {
  return (
    <Layout>
      <SeoConfig passedSeoData={SeoData.shop} />
      <Banner text="All Products" page="Shop" />
      <Content />
    </Layout>
  );
}

export default Shop;
