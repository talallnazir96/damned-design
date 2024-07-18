import axios from "axios";
import moment from "moment/moment";
import { useRouter } from "next/router";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Footer from "../../components/Footer";
import Nav from "../../components/Nav";

const OrderDetails = () => {
  const router = useRouter();
  const orderId = router.query;
  const date = new Date();
  console.log(orderId);
  const [orderData, setOrderData] = useState();

  useEffect(() => {
    async function getOrderDetails() {
      const orderId = router.query;

      if (orderId != "undefined") {
        const response = await axios.get(
          `https://www.damnedventures.com/wp-json/wp/v2/order_data/?order_id=${orderId.id}`
        );
        setOrderData(response.data);
      }
    }
    getOrderDetails();
  }, [orderId, router.query]);
  return (
    <>
      <Nav />
      <section className="h-100 h-custom" style={{ backgroundColor: "#eee" }}>
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-lg-8 col-xl-6">
              <div
                className="card border-top border-bottom border-3"
                style={{ borderColor: "#37a27" }}
              >
                <div className="card-body p-5">
                  <p className="lead fw-bold mb-5">Purchase Receipt</p>

                  <div className="row">
                    <div className="col mb-3">
                      <p className="small text-muted mb-1">Date</p>
                      <p>{moment(date).format("DD MMMM YYYY")}</p>
                    </div>
                    <div className="col mb-3">
                      <p className="small text-muted mb-1">Order No.</p>
                      <p>{orderId.id}</p>
                    </div>
                  </div>

                  <div
                    className="mx-n5 px-1 py-4"
                    style={{ backgroundColor: "#f2f2f2" }}
                  >
                    <div className="row">
                      <div className="col-md-8 col-lg-9">
                        <p className="mb-0">Shipping</p>
                      </div>
                      <div className="col-md-4 col-lg-3">
                        <p className="mb-0">
                          ${parseFloat(orderData?.shipping_total).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-8 col-lg-9">
                        <p className="mb-0">Order Status</p>
                      </div>
                      <div className="col-md-4 col-lg-3">
                        <p className="mb-0">{orderData?.status}</p>
                      </div>
                    </div>
                  </div>

                  <div className="row my-4">
                    <div className="col-md-6">
                      <p className="lead fw-bold mb-0">Total</p>
                    </div>
                    <div className="col-md-6">
                      <p className="lead fw-bold mb-0 text-end">
                        ${parseFloat(orderData?.total).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default OrderDetails;
