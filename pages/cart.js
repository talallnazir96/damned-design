import React from "react";
import Layout from "../components/Layout";
import SeoConfig, { SeoData } from "../components/SEOConfig";

function cart() {
  return (
    <Layout>
      <SeoConfig passedSeoData={SeoData.cart} />
      <div>
        <h1>Cart</h1>
      </div>
    </Layout>
  );
}

export default cart;
