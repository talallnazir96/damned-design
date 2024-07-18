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
import Menu from "../../components/Dashboard/Menu";
import Link from "next/link";
import ProtectedArea from "../../components/ProtectedArea";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useGlobalContext } from "../../contextAPI/context";
import PointsTable from "../../components/Points/PointsTable";

function Points() {
  const { currentUser, authToken } = useGlobalContext();
  const [points, setPoints] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allData, setAllData] = useState([]);
  const [totalVal, setTotal] = useState();
  // const [getUserPoint, setUserPoint] = useState([]);
  // const [event, setEvent] = useState([]);
  // const [date, setDate] = useState([]);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      if (authToken) {
        const response = await axios.get(
          `https://www.damnedventures.com/wp-json/mo/v1/UserPoints/${currentUser.id}`
        );
        console.log("respose", response);
        const dataVal = Object.assign([], response.data);
        setAllData(dataVal);
        const totalPoints = dataVal.reduce(
          (previousValue, currentValue) =>
            previousValue + Number(currentValue.points),
          0
        );
        setTotal(totalPoints);
        setOrders(data);
        setPoints(getPoints(data));
        setLoading(false);
        setError(null);
      } else {
        setError("No user found");
        setLoading(false);
      }
    } catch (error) {
      setError(error.response?.data.message);
      // setError("errorrr");
      setLoading(false);
    }
  };

  const getPoints = (data) => {
    if (data && data.length > 0) {
      return data.reduce((acc, curr) => {
        let meta = curr.meta_data;
        if (meta && meta.length > 0) {
          let point = meta.find((item) => item.key === "_wc_points_earned");
          if (point) {
            return acc + parseInt(acc.points);
          }
        }
        return acc;
      }, 0);
    }
    return 0;
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <Layout>
      <div className={dashboardStyles.dashboard}>
        <h1>Points</h1>
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
            <BreadcrumbItem active>Points</BreadcrumbItem>
          </Breadcrumb>
        </div>
        <Container className={dashboardStyles.container}>
          <Row>
            <Col sm={12} md={5} lg={4} className={dashboardStyles.leftCol}>
              <Menu />
            </Col>
            <Col sm={12} md={7} lg={8}>
              <div className={dashboardStyles.rightCol}>
                <h2>My Points</h2>
                {loading && (
                  <div className={dashboardStyles.skeleton}>
                    <Skeleton count={1} />
                  </div>
                )}
                {error && <p className="alert alert-danger">{error}</p>}
                {!loading && !error && orders && (
                  <div className="mt-3">
                    <p>
                      You have <b>{totalVal}</b> Points
                    </p>
                  </div>
                )}
                {allData?.length && <PointsTable dataAll={allData} />}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </Layout>
  );
}

export default ProtectedArea(Points);
