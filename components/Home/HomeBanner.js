import { Col, Container, Row } from "react-bootstrap";
import Image from "next/image";
import homeBannerStyles from "./HomeBanner.module.css";
import React from "react";

function HomeBanner({ homeData }) {
  return (
    <Container fluid className={`${homeBannerStyles.homeBanner} text-center`}>
      <Row>
        <Col>
          <h1 className={`${homeBannerStyles.homeBannerTitle} textDark`}>
            {homeData?.hero_product_name}
          </h1>
          <p className={homeBannerStyles.bannerDesc}>
            {homeData?.hero_product_tagline}
          </p>
        </Col>
      </Row>
    </Container>
  );
}

export default HomeBanner;
