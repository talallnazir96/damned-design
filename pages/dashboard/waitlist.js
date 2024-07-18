import Layout from "../../components/Layout";
import React, { useState, useEffect } from "react";
import {
  Col,
  Container,
  Row,
  BreadcrumbItem,
  Breadcrumb,
} from "react-bootstrap";
import dashboardStyles from "./Dashboard.module.css";
import orderStyles from "./orders.module.css";
import Menu from "../../components/Dashboard/Menu";
import Link from "next/link";
import ProtectedArea from "../../components/ProtectedArea";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useGlobalContext } from "../../contextAPI/context";
import { useCallback } from "react";

function Waitlist() {
  const { currentUser } = useGlobalContext();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchWaitList = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/waitlist?email=${currentUser?.user_email}`
      );
      console.log(response.data.data);
      setItems(response.data.data);
      setLoading(false);
      setError(null);
    } catch (error) {
      setLoading(false);
      setError("Error fetching waitlist");
    }
  }, [currentUser?.user_email]);

  useEffect(() => {
    fetchWaitList();
  }, [fetchWaitList]);
  console.log("items", items);

  return (
    <Layout>
      <div className={dashboardStyles.dashboard}>
        <h1>WaitList</h1>
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
            <BreadcrumbItem active>WaitList</BreadcrumbItem>
          </Breadcrumb>
        </div>
        <Container className={dashboardStyles.container}>
          <Row>
            <Col sm={12} md={5} lg={4} className={dashboardStyles.leftCol}>
              <Menu />
            </Col>
            <Col sm={12} md={7} lg={8}>
              <div className={dashboardStyles.rightCol}>
                <h2>Your WaitList</h2>

                {loading && (
                  <div className={dashboardStyles.skeleton}>
                    <Skeleton count={5} height={20} />
                  </div>
                )}
                {!loading && items.length == 0 && (
                  <div>
                    <p>
                      You have not yet joined the waitlist for any products.
                    </p>
                    <Link href="/shop">Visit shop now!</Link>
                  </div>
                )}
                {!loading && items && items.length > 0 && (
                  <div>
                    <table className={orderStyles.table}>
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Variation</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map &&
                          items.map((item, index) => (
                            <tr key={index}>
                              <td>
                                <Link href={`/product/${item.product[0].id}`}>
                                  <a>{item.product[0].post_title}</a>
                                </Link>
                              </td>
                              <td>{item.variation}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </Layout>
  );
}

export default ProtectedArea(Waitlist);
