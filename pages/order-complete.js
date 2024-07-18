import styles from "../styles/OrderComplete.module.css";
import checkoutStyles from "../styles/checkout.module.css";

import { useRouter } from "next/router";
import { useState } from "react";
import { useEffect } from "react";

import axios from "axios";
import Link from "next/link";
import Layout from "../components/Layout";
import PhoneEnabledIcon from "@material-ui/icons/PhoneEnabled";
import MarkunreadIcon from "@material-ui/icons/Markunread";

import { PaymentInputsWrapper, usePaymentInputs } from "react-payment-inputs";
import images from "react-payment-inputs/images";

import { paymentMethods } from "../utils/payment-methods";
import { createNotification } from "../functions/utils";
import { NotificationContainer } from "react-notifications";

const OrderCompletePage = () => {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [productStatus, setproductStatus] = useState(null);


  useEffect(() => {
    const order_id = router.query.order_id;
    const order_key = router.query.order_key;

    if (order_id && order_key) {
      console.log("fetching");
      axios
        .get(`/api/order-complete?order_id=${order_id}&order_key=${order_key}`)
        .then((res) => {
          console.log(res.data, "res.data");
          setData(res.data);
        })
        .catch((err) => {
          console.log(err.response);
        })
        .finally(() => {
          setIsLoading(false);
        });

    }


  }, [router]);
  console.log(data, "productData");
  axios.post("https://www.damnedventures.com/custom_api.php", {

    action: "productstatus",
    product_id: data?.line_items[0]?.product_id

  }).then(respo => setproductStatus(respo.data.status))

  console.log(productStatus, "status");
  return (
    <Layout>
      <div className={styles.orderComplete}>
        <div className={styles.orderDetails}>
          {isLoading && <p>Loading...</p>}
          {data && (
            <div>
              {data.status === "pending" ? (
                <h2>Your Order Payment Is Pending</h2>
              ) : productStatus == "1" ?
                <>
                  <h3>
                    We try to ship orders as soon as possible but it may take up to 3 working days to get your package moving
                  </h3>
                  <br />
                  <h3>
                    Pre order items are shipped as per the expected ship date mentioned in here and throughout the checkout process. If there are items with different ship dates, the order will be shipped once all the items are available
                  </h3>
                </>
                : productStatus == "0" ?
                  <h1>Thank You. Your Order #{data.number} Has Been Received and is being processed. Please check the information below to ensure everything is correct.</h1>
                  : <p>Loading...</p>}
              <table className={styles.productTable}>
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
              <table className={styles.billingTable}>
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

                {data.meta_data.find(data => data.key == "_point_discount")?.value > 0 ?
                  <tr >
                    <td>Points:</td>
                    <td>-${parseFloat(data.meta_data.find(data => data.key == "_point_discount").value).toFixed(2)}</td>
                  </tr>
                  : ""
                }
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
              <br />
              <h4>
                You will receive an email with tracking once the order is shipped but you can also check the status of your order by signing into your account or using the track order feature on the site
              </h4>
              {data.status !== "pending" && <Addresses data={data} />}
            </div>
          )}
        </div>

        {data && data.status === "pending" && (
          <div>
            <PaymentForm order_id={data.id} total={data.total} />
          </div>
        )}
      </div>
      <NotificationContainer />
    </Layout>
  );
};

const PaymentForm = ({ order_id, total }) => {
  const router = useRouter();
  const [paymentMethodField, setPaymentMethodField] = useState({
    payment_method: "nmi",
    payment_method_title: "Network Merchants (NMI)",
  });
  const {
    wrapperProps,
    getCardImageProps,
    getCardNumberProps,
    getExpiryDateProps,
    getCVCProps,
    meta: cardMeta,
  } = usePaymentInputs();
  const [cardInputFields, setCardInputFields] = useState({
    cardNumber: "",
    cardExpiry: "",
    cardCVV: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePaymentMethodChange = (id, title) => {
    setPaymentMethodField({
      payment_method: id,
      payment_method_title: title,
    });
  };

  const handleCardNumberChange = (e) => {
    const cardNumber = e.target.value;
    setCardInputFields({ ...cardInputFields, cardNumber });
  };

  const handleCardExpiryChange = (e) => {
    const cardExpiry = e.target.value;
    setCardInputFields({ ...cardInputFields, cardExpiry });
  };

  const handleCVVChange = (e) => {
    const cardCVV = e.target.value;
    setCardInputFields({ ...cardInputFields, cardCVV });
  };

  const handlePay = async (e) => {
    e.preventDefault();

    if (
      !paymentMethodField.payment_method ||
      !paymentMethodField.payment_method_title
    ) {
      createNotification("error", "Please select a payment method");
      return;
    }

    if (paymentMethodField.payment_method === "nmi") {
      if (cardMeta.error) {
        createNotification("error", cardMeta.error);
        return;
      }
      if (
        !cardInputFields.cardNumber ||
        !cardInputFields.cardExpiry ||
        !cardInputFields.cardCVV
      ) {
        createNotification("error", "Please fill out all card details");
        return;
      }
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await axios.post("/api/complete-payment", {
        order_id,
        payment_method: paymentMethodField.payment_method,
        payment_method_title: paymentMethodField.payment_method_title,
        card_input: {
          ccnumber: cardInputFields.cardNumber.replace(/\s/g, ""),
          ccexp: cardInputFields.cardExpiry.replace(/\s/g, ""),
          cvv: cardInputFields.cardCVV,
        },
      });
      const data = res.data;
      console.log(data, "eeeeee");
      router.push(data.redirectURL);
    } catch (error) {
      console.log(error);
      console.log(error.response);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handlePay}>
      <h3>Complete Payment</h3>
      <div className={styles.paymentRow}>
        {/* Radio buttons */}
        {paymentMethods &&
          paymentMethods.length > 0 &&
          paymentMethods.map((paymentMethod) => (
            <div
              key={paymentMethod.id}
              className={checkoutStyles.paymentMethod}
            >
              <input
                type="radio"
                name="payment_method"
                id={paymentMethod.id}
                value={paymentMethod.id}
                // required
                // className='mrInput'
                onChange={() =>
                  handlePaymentMethodChange(
                    paymentMethod.id,
                    paymentMethod.name
                  )
                }
                checked={paymentMethodField.payment_method === paymentMethod.id}
              />
              <label
                htmlFor={paymentMethod.id}
                className={`drinkcard-cc ${checkoutStyles.paymentMethodLabel}`}
                style={{
                  backgroundImage: `url(${paymentMethod.image})`,
                }}
              ></label>
            </div>
          ))}
      </div>
      {paymentMethodField.payment_method === "nmi" && (
        <PaymentInputsWrapper {...wrapperProps}>
          <svg {...getCardImageProps({ images })} />
          <input
            {...getCardNumberProps({
              onChange: handleCardNumberChange,
              value: cardInputFields.cardNumber,
            })}
          // value={cardInputFields.cardNumber}
          />
          <input
            {...getExpiryDateProps({
              onChange: handleCardExpiryChange,
            })}
            value={cardInputFields.cardExpiry}
          />
          <input
            {...getCVCProps({ onChange: handleCVVChange })}
            value={cardInputFields.cardCVV}
          />
        </PaymentInputsWrapper>
      )}
      <div className={styles.formRow}>
        <button
          type="submit"
          name="submit"
          className={checkoutStyles.submitBtn}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : `Pay $${total}`}
        </button>
      </div>
    </form>
  );
};

const Addresses = ({ data }) => (
  <div className={styles.addresses}>
    <div>
      <h4>Billing Address</h4>
      <p>
        {data.billing.first_name} {data.billing.last_name}
      </p>
      <p>
        {data.billing.address_1}
        {data.billing.address_2}
      </p>
      <p>
        {data.billing.city}, {data.billing.state} {data.billing.postcode}
      </p>
      <p>
        <PhoneEnabledIcon /> {data.billing.phone}
      </p>
      <p>
        <MarkunreadIcon /> {data.billing.email}
      </p>
    </div>
    <div className={styles.shipping_adress_holder}>
      <h4>Shipping Address</h4>
      <p>
        {data.shipping.first_name} {data.shipping.last_name}
      </p>
      <p>
        {data.shipping.address_1}
        {data.shipping.address_2}
      </p>
      <p>
        {data.shipping.city}, {data.shipping.state} {data.shipping.postcode}
      </p>
      <p>
        <PhoneEnabledIcon /> {data.shipping.phone}
      </p>
    </div>
  </div>
);

export default OrderCompletePage;
