import Layout from "../../../../components/Layout";
import React, { useState } from "react";
import {
  Col,
  Container,
  Row,
  BreadcrumbItem,
  Breadcrumb,
} from "react-bootstrap";
import dashboardStyles from "../.././Dashboard.module.css";
import orderSingleStyles from "./order.module.css";
import orderStyles from "../../../../styles/orderConfirmation.module.css";
import Menu from "../../../../components/Dashboard/Menu";
import Link from "next/link";
import { useGlobalContext } from "../../../../contextAPI/context";
import ProtectedArea from "../../../../components/ProtectedArea";
import axios from "axios";
import {
  getAuthTokenFromLocalStorage,
  isoDateToDateString,
  parseCookies,
  decodeJWTToken,
} from "../../../../functions/general";
import PhoneEnabledIcon from "@material-ui/icons/PhoneEnabled";
import MarkunreadIcon from "@material-ui/icons/Markunread";
import WarningIcon from "@material-ui/icons/Warning";
import orderCompleteStyles from "../../../../styles/OrderComplete.module.css";

import { WP_URL } from "../../../../utils/config";

function SingleOrder({ id, data, messageFromServer }) {
  const currency = data && data.currency_symbol ? data.currency_symbol : "$";
  // calculate subtotal from order items

  const subtotal =
    data && data.line_items
      ? data.line_items.reduce((acc, item) => {
        return acc + parseInt(item.subtotal);
      }, 0)
      : 0;

  return (
    <Layout>
      {data && (
        <div className={dashboardStyles.dashboard}>
          <h1>View Order</h1>
          <div className={dashboardStyles.breadcrumb}>
            <Breadcrumb>
              <BreadcrumbItem>
                <Link href="/">
                  <a>Home</a>
                </Link>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <Link href="/dashboard">
                  <a>Dashboard</a>
                </Link>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <Link href="/dashboard/orders">
                  <a>Orders</a>
                </Link>
              </BreadcrumbItem>
              <BreadcrumbItem active>View Order</BreadcrumbItem>
            </Breadcrumb>
          </div>
          <Container className={dashboardStyles.container}>
            <Row>
              <Col sm={12} md={5} lg={4} className={dashboardStyles.leftCol}>
                <Menu />
              </Col>
              {data && (
                <Col sm={12} md={7} lg={8} >
                  <div className={dashboardStyles.rightCol}>

                    <p>
                      Order <mark>#{data.number}</mark> was placed on{" "}
                      <mark>{isoDateToDateString(data.date_created)}</mark> and is
                      currently{" "}
                      <mark>
                        {" "}
                        {data.status == "completed" ? "Shipped" : data.status}
                      </mark>{" "}
                      {data.status === "pending" && (
                        <Link
                          href={`/order-complete?order_id=${data.id}&order_key=${data.order_key}`}
                        >
                          Complete Payment
                        </Link>
                      )}
                      .
                    </p>
                    <div className={orderSingleStyles.uspsDiv}></div>
                    <h2>Order details</h2>
                    <table className={orderCompleteStyles.productTable}>
                      <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Price</th>
                      </tr>
                      {data.line_items.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <Link href={`/product/${item.product_id}`}>
                              {item.name}
                            </Link>
                          </td>
                          <td>{item.quantity}</td>
                          <td>${item.subtotal}</td>
                        </tr>
                      ))}
                    </table>
                    <table className={orderCompleteStyles.billingTable}>
                      <tr>
                        <td>Subtotal:</td>
                        <td>
                          $
                          {data.line_items
                            .reduce(
                              (subtotal, item) =>
                                subtotal + parseFloat(item.subtotal),
                              0.0
                            )
                            .toFixed(2)}
                        </td>
                      </tr>
                      {data.coupon_lines.map((coupon) => (
                        <tr key={coupon.id}>
                          <td>Coupon: {coupon.code}</td>
                          <td>-${parseFloat(coupon.discount).toFixed(2)}</td>
                        </tr>
                      ))}
                      <tr>
                        <td>Shipping:</td>
                        <td>
                          ${data.shipping_lines[0].total} via{" "}
                          {data.shipping_lines[0].method_title}
                        </td>
                      </tr>
                      <tr>
                        <td>Payment Method:</td>
                        <td>{data.payment_method_title}</td>
                      </tr>
                      <tr>
                        <td>Total:</td>
                        <td>${data.total}</td>
                      </tr>
                    </table>

                    <Row>
                      <Col className={orderSingleStyles.billing_adress}>
                        <h2 className="mb-2">Billing address</h2>
                        {data && data.billing && (
                          <div className={orderSingleStyles.address}>
                            <p>
                              {data.billing.first_name} {data.billing.last_name}
                            </p>
                            <p>
                              {data.billing.address_1}, {data.billing.address_2}
                            </p>
                            <p>
                              {data.billing.city}, {data.billing.state}{" "}
                              {data.billing.postcode}
                            </p>
                            {data.billing.phone && (
                              <p>
                                <PhoneEnabledIcon />{" "}
                                <span>{data.billing.phone}</span>
                              </p>
                            )}
                            {data.billing.email && (
                              <p>
                                <MarkunreadIcon />{" "}
                                <span>{data.billing.email}</span>
                              </p>
                            )}
                          </div>
                        )}
                      </Col>

                      <Col className={orderSingleStyles.billing_adress}>
                        <h2 className="mb-2">Shipping address</h2>
                        {data && data.shipping && (
                          <div className={orderSingleStyles.address}>
                            <p>
                              {data.shipping.first_name} {data.shipping.last_name}
                            </p>
                            <p>
                              {data.shipping.address_1}, {data.shipping.address_2}
                            </p>
                            <p>
                              {data.shipping.city}, {data.shipping.state}{" "}
                              {data.shipping.postcode}
                            </p>
                            {data.shipping.phone && (
                              <p>
                                <PhoneEnabledIcon />{" "}
                                <span>{data.shipping.phone}</span>
                              </p>
                            )}
                            {data.shipping.email && (
                              <p>
                                <MarkunreadIcon />{" "}
                                <span>{data.shipping.email}</span>
                              </p>
                            )}
                          </div>
                        )}
                      </Col>

                    </Row>
                  </div>
                </Col>
              )}
            </Row>
          </Container>
        </div>
      )}
      {!data && messageFromServer && (
        <div className={dashboardStyles.dashboard}>
          <Container>
            <Row>
              <Col>
                <div className="text-center">
                  <WarningIcon
                    style={{
                      fill: "var(--clr-accent-2)",
                      fontSize: "40px",
                    }}
                  />
                </div>
                <h1 className="text-center mb-4">There was an error</h1>
                <h5
                  className="alert alert-danger text-center"
                  dangerouslySetInnerHTML={{
                    __html: messageFromServer,
                  }}
                ></h5>
              </Col>
            </Row>
          </Container>
        </div>
      )}
    </Layout>
  );
}

export const getServerSideProps = async (context) => {
  console.log(context, "contexxxx");
  const { query, req } = context;
  const cookies = parseCookies(req);
  const accessToken = cookies["mrAuthToken"];
  const userPayload = decodeJWTToken(accessToken);
  let userId = userPayload ? userPayload.data.user.id : null;
  let data = null;
  if (userId) {
    try {
      const response = await axios.get(
        `${WP_URL}/wp-json/wc/v3/orders?consumer_key=${process.env.WP_CONSUMER_KEY}&consumer_secret=${process.env.WP_CONSUMER_SECRET}&customer=${userId}`
      );
      const orders = await response.data;
      if (orders && orders.length > 0) {
        // find if this user has actualy placed this order
        const order = orders.find((order) => order.id == query.id);
        if (order) {
          // this user has purchased this order, so we can show it
          // actual code to get order details goes here
          try {
            const order = await axios.get(
              `${WP_URL}/wp-json/wc/v3/orders/${query.id}?consumer_key=${process.env.WP_CONSUMER_KEY}&consumer_secret=${process.env.WP_CONSUMER_SECRET}`
            );
            data = await order.data;
          } catch (error) {
            // console.log('error', error.response)
            return {
              props: {
                id: query.id,
                data: null,
                messageFromServer: `There was an error in loading order details, please try again later.`,
              },
            };
          }
          return {
            props: {
              id: query.id,
              data,
            },
          };
        } else {
          // this user hasn't purchased this order, so we can't show it
          return {
            props: {
              id: query.id,
              data: null,
              messageFromServer: `You are not authorized to view this order.`,
            },
          };
        }
      }
    } catch (error) {
      // there was an error in making api call at "Orders" endpoint, so showing error message
      return {
        props: {
          id: query.id,
          data: null,
          messageFromServer: `There was an error in loading order details, please try again later.`,
        },
      };
    }
  } else {
    return {
      props: {
        id: query.id,
        data: null,
        messageFromServer: `Your session has expired. Please <a href='/login'>login</a> again.`,
      },
    };
  }
};

export default ProtectedArea(SingleOrder);
