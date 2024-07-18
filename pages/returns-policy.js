import Link from "next/link";
import React from "react";
import {
  Col,
  Container,
  Row,
  Breadcrumb,
  BreadcrumbItem,
} from "react-bootstrap";
import Layout from "../components/Layout";
import SeoConfig, { SeoData } from "../components/SEOConfig";
import shippingStyles from "../styles/shipping.module.css";

function ReturnsPolicy() {
  return (
    <Layout>
      <SeoConfig passedSeoData={SeoData.returnPolicy} />
      <Container className={shippingStyles.container}>
        <Row className="mt-3 mb-3">
          <Col className={shippingStyles.breadCol}>
            {/* breadcrumb */}
            <Breadcrumb>
              <BreadcrumbItem>
                <Link href="/">
                  <a className="textDark">Home</a>
                </Link>
              </BreadcrumbItem>
              <BreadcrumbItem active>Returns Policy</BreadcrumbItem>
            </Breadcrumb>
          </Col>
        </Row>
        <Row>
          <Col className={shippingStyles.shipInfoText}>
            <p>
              <strong>Return &amp; Refund Policy</strong>
            </p>
            <p>
              Thanks for shopping at Damned Designs.
              <br />
              Since most of our products are sold on pre order, we only exchange
              or refund in case there are manufacturing defects.
            </p>
            <p>
              <strong>Returns</strong>
              <br />
              You have 3 calendar days to reach out to us from the date you
              received it with proof of the defects. If the product can be
              restored to perfect condition by replacing a part, we will ship
              out the necessary part to you. Right to accept the return lies
              solely with us.
            </p>
            <p>
              If a return is authorized, you can choose to receive a replacement
              (if available )or a refund.
              <br />
              Your item must be unused and in the same condition that you
              received it and in it&#8217;s original packaging.
              <br />
              Once we receive your item, we will inspect it and notify you that
              we have received your returned
              <br />
              item. We will immediately notify you on the status of your refund
              after inspecting the item.
              <br />
              If your return is approved, we will initiate a refund to your
              credit card (or original method of
              <br />
              payment). If a replacement is requested, it will be shipped out
              immediately.
              <br />
              You will receive the credit within a certain amount of days,
              depending on your card issuer&#8217;s policies.
            </p>
            <p>
              <strong>Shipping</strong>
              <br />
              Since we pride ourselves in the quality of our products, we will
              send you a pre paid return label to return your defected product.
              Original shipping charges will be returned as well (unless there
              were multiple items on the order)
            </p>
            <p>
              <strong>Contact Us</strong>
              <br />
              If you have any questions on how to return your item to us,
              contact us at sales@damneddesigns.com or via the contact form or
              social media accounts.
            </p>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}

export default ReturnsPolicy;
