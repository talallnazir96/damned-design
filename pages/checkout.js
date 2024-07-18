/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
// import React from "react";

React.useLayoutEffect = React.useEffect;
import {
  Breadcrumb,
  BreadcrumbItem,
  Col,
  Container,
  Row,
  Spinner,
  Modal,
  Button,
} from "react-bootstrap";
import Layout from "../components/Layout";
import { useGlobalContext } from "../contextAPI/context";
import checkoutStyles from "../styles/checkout.module.css";
import { FaMinusCircle, FaPlusCircle, FaTrash } from "react-icons/fa";
import orderStyles from "../styles/orderConfirmation.module.css";
import axios from "axios";

import GooglePlacesAutocomplete from "react-google-places-autocomplete";

import {
  CountryDropdown,
  CountryRegionData,
  RegionDropdown,
} from "react-country-region-selector";
import { NotificationContainer } from "react-notifications";
import { accessCookie, createNotification } from "../functions/utils";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import SeoConfig, { SeoData } from "../components/SEOConfig";
import { TermsAndConditionContent } from "./terms-conditions";
import { PrivacyPolicyContent } from "./privacy-policy";
import { FastField, useFormik } from "formik";
import Preloader from "../components/Preloader";
import {
  ArrowDownwardSharp,
  ChevronRightSharp,
  Clear,
} from "@material-ui/icons";
import { useQuery } from "react-query";
import routeapp from "../utils/route-widget-stable.min";
// const routeapp =  import("../utils/route-widget-stable.min.js")
import Countdown from "react-countdown";
import { useMemo } from "react";
import { PaymentInputsWrapper, usePaymentInputs } from "react-payment-inputs";
import images from "react-payment-inputs/images";
import { SITE_URL, US_STATES, US_STATES_ARRAY, WP_URL } from "../utils/config";
import { useRouter } from "next/router";
import { paymentMethods } from "../utils/payment-methods";
import { getSezzleDatesFormated } from "../utils/dates";
import { decodeJWTToken, getAuthTokenFromCookie } from "../functions/general";
import dynamic from "next/dynamic";
import Script from "next/script";
import ProtectedArea from "../components/ProtectedArea";
import { getItemPrice } from "../functions/cocart";
import OrderDetails from "./orderDetails/[id]";
const Checkout = () => {
  <Script
    type="text/javascript"
    src="https://route-cdn.s3.amazonaws.com/route-widget-shopify/route-widget-static.min.js"
  ></Script>;
  async function paymentFunction(response, billing_address) {
    if ((await response.data) && response.data.error) {
      createNotification("error", response.data.error.message);
      setProcessingForm(false);
    } else {
      const userData = JSON.parse(localStorage.getItem("user"));
      const product_data = cart.map((item) => {
        return {
          isPreOrder: item.orderType === "" ? false : true,
          product_id: "",
          variation_id: item.variationId,
          quantity: item.quantity,
        };
      });
      const dataToSend = {
        product_data: product_data,
        shipping_address: {
          // first_name: formFields.firstName,
          first_name: billing_address.first_name,
          // last_name: formFields.lastName,
          last_name: billing_address.last_name,

          // email: formFields.email,
          email: billing_address.email,
          // phone: formFields.phone,
          phone: billing_address.phone,

          company: "",
          address_1: formFields.address1,
          address_2: formFields.address2,
          postcode: formFields.zipcode,

          country: country,
          state: region,
          city: formFields.city,
        },
        billing_address: billing_address,

        customer_id: userData && userData.ID ? +userData.ID : 0,
        payment_method:
          selectedPaymentMethod === "Sezzle_Pay" ? "sezzlepay" : "nmi",
        payment_method_title:
          selectedPaymentMethod === "Sezzle_Pay" ? "Sezzle" : "NMI",
        coupon_code: couponDetails?.data.data.code
          ? couponDetails?.data.data.code
          : "",
        shipping_method: shippingDetails.rate_id,
        shipping_method_title: shippingDetails.title,
        shipping_cost: shippingDetails.cost,
        isPackageProtection: insuranceValue ? true : false,
        package_protection: insuranceValue ? packageProtectionData : null,
      };

      if (
        response &&
        response?.data &&
        response.data.address &&
        response.data.address.verifications.delivery.success
      ) {
        let latestCart = cart.filter((item) => item.orderType);

        if (selectedPaymentMethod !== "NMI_Payment") {
          try {
            const response = await axios.post(
              `https://www.damnedventures.com/wp-json/wp/v2/placeorder_api`,
              dataToSend
            );
            const data = await response.data;
            setOrderId(data.order_id);
            if (await data.payment_response.redirect) {
              
              await axios.post(
                `https://www.damnedventures.com/wp-json/wp/v2/status_update/`,
                {
                  order_id: orderId,
                  order_status:
                    latestCart.length > 0
                      ? "wc-ywpo-pre-ordered"
                      : "wc-processing",
                }
              );
              const data = await response.data;
              localStorage.setItem("cart", []);
              router.push(data.payment_response.redirect);
            }
            setProcessingForm(false);
          } catch (error) {
            
            await axios.post(
              `https://www.damnedventures.com/wp-json/wp/v2/status_update/`,
              {
                order_id: orderId,
                order_status:
                  latestCart.length > 0 ? "wc-ywpo-pre-ordered" : "wc-pending",
              }
            );
            createNotification("error", "Payment failed. Please try again");
            setProcessingForm(false);
          } finally {
            setProcessingForm(false);
          }
        }
        if (selectedPaymentMethod === "NMI_Payment") {
          try {
            const response = await axios.post(
              `https://www.damnedventures.com/wp-json/wp/v2/placeorder_api`,
              dataToSend
            );
            const data = await response.data;

            if (await data) {
              dataToSend["order_amount"] = total;
              dataToSend["order_id"] = data.order_id;
              dataToSend["ccnumber"] = cardInputFields.cardNumber;
              dataToSend["ccexp"] = cardInputFields.cardExpiry
                .split(" ")
                .join("");
              dataToSend["cvv"] = cardInputFields.cardCVV;
              dataToSend["customer_ip"] = "65.192.14.10";
              setOrderId(data.order_id);
              try {
                const response = await axios.post(
                  `https://www.damnedventures.com/wp-json/wp/v2/nmi_payment`,
                  dataToSend
                );
                const paymentResponse = response.data;
                if ((paymentResponse.responsetext) === "SUCCESS") {
                  
                  await axios.post(
                    `https://www.damnedventures.com/wp-json/wp/v2/status_update/`,
                    {
                      order_id: paymentResponse.orderid,
                      order_status:
                        latestCart.length > 0
                          ? "wc-ywpo-pre-ordered"
                          : "wc-processing",
                    }
                  );
                  localStorage.setItem("cart", []);
                  createNotification("success", "Payment done successfully");
                  router.push(`/orderDetails/${paymentResponse.orderid}`);
                }

                setProcessingForm(false);
              } catch (error) {
                
                await axios.post(
                  `https://www.damnedventures.com/wp-json/wp/v2/status_update/`,
                  {
                    order_id: orderId,
                    order_status:
                      latestCart.length > 0
                        ? "wc-ywpo-pre-ordered"
                        : "wc-pending",
                  }
                );
                createNotification("error", "Payment failed. Please try again");
                setProcessingForm(false);
              } finally {
                setProcessingForm(false);
              }
            }
            setProcessingForm(false);
          } catch (error) {
            createNotification("error", "Payment failed. Please try again");
            setProcessingForm(false);
          } finally {
            setProcessingForm(false);
          }
        }
      } else {
        setProcessingForm(false);
      }
    }
  }
  const [orderId, setOrderId] = useState();
  useEffect(() => {
    const script = document.createElement("script");

    script.src =
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyBBjVdHfGlltxxKS1RL909FzonPC3ELIo0&callback=initMap&libraries=places&v=weekly";
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);
  function autoFillForm(data) {
    const formObj = {};
    data.map((place) => {
      place.types.map((type) => {
        if (type === "street_number") {
          formObj["street_number"] = place.long_name;
        }
        if (type === "route") {
          formObj["route"] = place.long_name;
        }
        if (type === "neighborhood") {
          formObj["neighborhood"] = place.long_name;
        }

        if (type === "locality") {
          formObj["locality"] = place.long_name;
        }
        if (type === "postal_code") {
          formObj["postal_code"] = place.long_name;
        }
        if (type === "route") {
          formObj["route"] = place.long_name;
        }
        if (type === "administrative_area_level_2") {
          formObj["city"] = place.long_name;
        }

        if (type === "administrative_area_level_1") {
          formObj["region"] = place.short_name;
        }

        if (type === "country") {
          formObj["country"] = place.short_name;
        }
      });
    });
    const {
      street_number,
      route,
      neighborhood,
      locality,
      city,
      region,
      country,
      postal_code,
    } = formObj;
    let firstName = formFields.firstName;
    let lastName = formFields.lastName;
    let email = formFields.email;
    let phoneNumber = formFields.phone;
    console.log(formFields, "formfields");

    setFormFields({
      // ...formFields,
      // firstName: firstName,
      // lastName: lastName,
      // phone: phoneNumber,
      // email: email,
      address1: `${street_number ? `${street_number}, ` : ""}${
        route ? route : ""
      }`,
      address2: `${neighborhood ? `${neighborhood}, ` : ""}${
        locality ? locality : ""
      }`,
      city: city,
      country: country,
      zipcode: postal_code,
    });
    //  await setCountryRegionBilling({ ...countryRegionBilling, country: country });

    // await setCountryRegionBilling({ ...countryRegionBilling, region: region });
    setCountryRegionBilling({ country: country, region: region });

    setCountry(country);
    setRegion(region);
  }
  // useEffect(() => {
  function initMap() {
    // [START maps_places_autocomplete_creation]
    const center = { lat: 50.064192, lng: -130.605469 };
    // Create a bounding box with sides ~10km away from the center point
    const defaultBounds = {
      north: center.lat + 0.1,
      south: center.lat - 0.1,
      east: center.lng + 0.1,
      west: center.lng - 0.1,
    };
    const input = document.getElementById("pac-input");
    const options = {
      bounds: defaultBounds,
      fields: ["address_components", "geometry", "icon", "name"],
      strictBounds: false,
      types: ["geocode"],
    };
    const autocomplete = new google.maps.places.Autocomplete(input, options);
    const southwest = { lat: 5.6108, lng: 136.589326 };
    const northeast = { lat: 61.179287, lng: 2.64325 };
    const newBounds = new google.maps.LatLngBounds(southwest, northeast);

    autocomplete.setBounds(newBounds);
    console.log("qwerty", formFields);
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      autoFillForm(place.address_components);
    });
  }
  if (typeof window !== "undefined") {
    // Client-side-only code
    window.initMap = initMap;
  }
  // }, []);

  const router = useRouter();
  const [billToAnotherAddress, setBillToAnotherAddress] = useState(false);
  const [total, setTotal] = useState(0);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState("NMI_Payment");
  const [processingForm, setProcessingForm] = useState(false);
  const [loadingCustomerInitially, setLoadingCustomerInitially] =
    useState(false);

  const [errorCustomerInitially, setErrorCustomerInitially] = useState(false);
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [customerDetails, setCustomerDetails] = useState({});

  const [paymentMethodField, setPaymentMethodField] = useState({
    // Default option is Card
    payment_method: "nmi",
    payment_method_title: "Network Merchants (NMI)",
  });
  const [couponCode, setCouponCode] = useState("");

  const [cart, setCart] = useState([]);
  const [user, setUser] = useState([]);
  const [cartExpireTime, setCartExpireTime] = useState(Date.now());

  const [itemToDelete, setItemToDelete] = useState(null);
  const [point, setPoint] = useState(0);
  const [pointValues, setPointValues] = useState("");
  const [toggle, settoggle] = useState(false);
  const [pointstatus, setpointstatus] = useState("");
  const [spinnerStatus, setspinnerStatus] = useState(false);
  const [insuranceValue, setInsuranceValue] = useState(true);
  const [couponDetails, setCouponDetails] = useState(null);
  let authTokenFromLocal = getAuthTokenFromCookie();
  const userPayload = decodeJWTToken(authTokenFromLocal);
  let userId = userPayload ? userPayload.data.user.id : null;
  const [countryRegionBilling, setCountryRegionBilling] = useState({
    country: "",
    region: "",
  });
  const [showTOSScreen, setShowTOSScreen] = useState(false);
  const [showPrivacyPolicy, setShowshowPrivacyPolicy] = useState(false);
  const [countryRegionShipping, setCountryRegionShipping] = useState({
    country: "",
    region: "",
  });

  const [shippingMethod, setShippingMethod] = useState("");
  const [packageProtectionFee, setPackageProtectionFee] = useState(0);
  const [shippingDetails, setShippingDetails] = useState({});

  const {
    // cart,
    removeItem,
    updateItemQuantity,
    directCheckout,
    authToken,
    currentUser,
    applyCoupon,
    removeCoupon,
    isCartUpdating,
    applyCountryRegion,
    getCartSubtotal,
    applyShippingMethod,
    applyPoints,
    removePoints,
    addToCart,
    clearCart,
    removeFromCart,
  } = useGlobalContext();
  useEffect(() => {
    if (localStorage.getItem("cart")) {
      setCart(JSON.parse(localStorage.getItem("cart")));
    }
    setUser(JSON.parse(localStorage.getItem("user")));
    setCartExpireTime(JSON.parse(localStorage.getItem("cartExpireTime")));
    setspinnerStatus(true);
  }, [addToCart, removeFromCart]);
  const paymentMethodUnavailable = useMemo(() => {
    return (
      !!paymentMethodField.payment_method &&
      paymentMethodField.payment_method !== "nmi" &&
      paymentMethodField.payment_method !== "sezzlepay"
    );
  }, [paymentMethodField]);

  const {
    wrapperProps,
    getCardImageProps,
    getCardNumberProps,
    getExpiryDateProps,
    getCVCProps,
    meta,
  } = usePaymentInputs();

  const [formFields, setFormFields] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address1: "",
    address2: "",
    city: "",
    zipcode: "",
    // Billing address
    billing_firstName: "",
    billing_lastName: "",
    billing_phone: "",
    billing_email: "",
    billing_address1: "",
    billing_address2: "",
    billing_city: "",
    billing_zipcode: "",
    // payment_method: '',
    // payment_method_title: '',
    terms: false,
  });
  const [cardInputFields, setCardInputFields] = useState({
    cardNumber: "",
    cardExpiry: "",
    cardCVV: "",
  });
  const [packageProtectionData, setPackageProtectionData] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("cart")) {
      routeapp.get_quote(
        "17ccdbf6-6cb5-4717-9714-ae97e6079aab",
        getCartSubtotal(JSON.parse(localStorage.getItem("cart"))),
        "USD",
        (e) => {
          setPackageProtectionFee(e.insurance_price);
          setPackageProtectionData(e);
        }
      );
    }
    // packageProtectionRouteOrder();
  }, [cart, getCartSubtotal]);
  async function packageProtectionRouteOrder() {
    const response = await axios.post(
      "https://api.route.com/v1/orders",
      {
        source_order_id: 1234,
        subtotal: 35.79,
        taxes: 2.59,
        currency: "USD",
        insurance_selected: true,
        customer_details: {
          first_name: "John",
          last_name: "Doe",
          email: "john.doe@email.com",
        },
        shipping_details: {
          first_name: "John",
          last_name: "Doe",
          street_address1: "1234 N 5678 W",
          street_address2: "",
          city: "Lehi",
          province: "Utah",
          country_code: "US",
          zip: 84043,
        },
        line_items: [
          {
            source_product_id: 1234567,
            sku: 1234,
            name: "Mauve Linen Tote Bag",
            price: 12.34,
            quantity: 1,
            image_url: "https://exampleimageurl.com",
            upc: 1234,
          },
        ],
        source_created_on: "2012-03-13T16:09:55-04:00",
        source_updated_on: "2012-03-13T16:09:55-04:00",
      },
      {
        headers: {
          token: "2deba873-affc-416c-9794-c6f1a74ccdab",
        },
      }
    );
    console.log(response, "data");
  }
  useEffect(() => {
    if (localStorage.getItem("cartExpireTime") <= Date.now()) {
      localStorage.setItem("cart", []);
    }
  }, [cart, getCartSubtotal]);
  useEffect(() => {
    setTotal(
      parseFloat(
        `${
          insuranceValue
            ? getCartSubtotal(cart) +
              8 +
              packageProtectionFee -
              (couponDetails ? couponDetails?.data.data.amount : 0)
            : getCartSubtotal(cart) +
              8 +
              0 -
              (couponDetails ? couponDetails?.data.data.amount : 0)
        }`
      ).toFixed(2)
    );
  }, [
    cart,
    couponDetails,
    getCartSubtotal,
    insuranceValue,
    packageProtectionFee,
  ]);
  useEffect(() => {}, [countryRegionBilling]);
  const handleInsuranceChange = () => {
    setInsuranceValue((prev) => !prev);

    routeapp.on_insured_change(() => console.log("eeee", e));
  };
  useEffect(() => {
    async function getUserData() {
      try {
        const response = await axios.get(
          "https://www.damnedventures.com/wp-json/wp/v2/shipping"
        );
        setShippingDetails(
          response.data.filter((item) => item.title !== "Free shipping")[0]
        );
      } catch (error) {}
    }
    getUserData();
  }, []);

  const handleApplyPoint = async (value) => {
    const point = value;
    if (point > pointValues) point = pointValues;

    try {
      applyPoints(point);
      settoggle(!toggle);
      // console.log("await response == ", res);
    } catch (error) {
      setFieldError("Point", "Invalid point");
    }
  };
  const handleDeleteItemModalClose = () => {
    setItemToDelete(null);
    // console.log("setting to null");
  };

  useEffect(() => {
    // console.log(itemToDelete);
  }, [itemToDelete]);

  const handlePaymentMethodChange = (payId, payName) => {
    setPaymentMethodField({
      payment_method: payId,
      payment_method_title: payName,
    });
  };
  const selectCountryBilling = (country) => {
    setCountryRegionBilling({
      ...countryRegionBilling,
      country: country,
    });
  };

  const selectRegionBilling = (region) => {
    setCountryRegionBilling({
      ...countryRegionBilling,
      region: region,
    });
  };
  const selectCountryShipping = (country) => {
    setCountryRegionShipping({
      country: country,
      region: "",
    });
    applyCountryRegion(country);
  };

  const selectRegionShipping = (region) => {
    // console.log(region);
    setCountryRegionShipping({
      ...countryRegionShipping,
      region: region,
    });

    applyCountryRegion(countryRegionShipping.country);
  };

  const handleShippingMethodChange = (shippingMethod) => {
    setShippingMethod(shippingMethod);
    applyShippingMethod(shippingMethod);
  };

  const handleFormFieldChange = (e) => {
    setFormFields({
      ...formFields,
      [e.target.name]: e.target.value,
    });

    if (e.target.name === "terms") {
      if (e.target.checked) {
        setFormFields({
          ...formFields,
          terms: true,
        });
      } else {
        setFormFields({
          ...formFields,
          terms: false,
        });
      }
    }
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

  const handleIncreaseAmount = async (item) => {
    if (item.quantity.value === item.quantity.max_purchase) {
      return createNotification(
        "error",
        "You have hit the maximum purchase quantity for this item"
      );
    }
    updateItemQuantity(item.item_key, item.quantity.value + 1);
  };

  const handleRemoveCoupon = (coupon) => {
    removeCoupon(coupon);
    setValues({ couponCode: "" });
  };
  const handleRemovePoint = async (point) => {
    removePoints(point);
    settoggle(!toggle);
    // setValues({ point: 0 });
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setProcessingForm(false);
    setFormFields({ ...formFields });
    // submit form only if terms are accepted and all fields are filled and cart is not empty

    if (e.target.firstName.value == "") {
      createNotification("error", "Please enter your first name");
      return;
    }
    if (e.target.lastName.value == "") {
      createNotification("error", "Please enter your last name");
      return;
    }
    if (e.target.email.value == "") {
      createNotification("error", "Please enter your email");
      return;
    }
    if (e.target.phone.value == "") {
      createNotification("error", "Please enter your phone number");
      return;
    }
    if (!formFields.address1) {
      createNotification("error", "Please enter your address");
      return;
    }
    if (!formFields.city) {
      createNotification("error", "Please enter your city");
      return;
    }
    if (!formFields.zipcode) {
      createNotification("error", "Please enter your zipcode");
      return;
    }
    if (total > 0) {
      if (selectedPaymentMethod === "") {
        createNotification("error", "Please select a payment method");
        return;
      }
      if (
        selectedPaymentMethod === "NMI_Payment" &&
        (meta.error ||
          !cardInputFields.cardNumber ||
          !cardInputFields.cardExpiry ||
          !cardInputFields.cardCVV)
      ) {
        createNotification("error", "Errors in card input. Please fix them");
        return;
      }
    }
    if (!formFields.terms) {
      createNotification("error", "Please accept our terms and conditions");
      return;
    }
    if (cart.length === 0) {
      createNotification("error", "Your cart is empty");
      return;
    }
    setProcessingForm(true);
    const billing_address = {};
    if (billToAnotherAddress) {
      billing_address = {
        first_name: e.target.firstName.value,
        last_name: e.target.lastName.value,
        company: "",
        phone: e.target.phone.value,
        email: e.target.email.value,
        address_1: formFields.billing_address1,
        address_2: formFields.billing_address2,
        city: formFields.billing_city,
        postcode: formFields.billing_zipcode,
        country: country,
        state: region,
      };
    } else {
      billing_address = {
        first_name: e.target.firstName.value,
        last_name: e.target.lastName.value,
        company: "",
        email: e.target.email.value,
        phone: e.target.phone.value,
        address_1: formFields.address1,
        address_2: formFields.address2,
        postcode: formFields.zipcode,

        country: country,
        state: region,
        city: formFields.city,
      };
    }
    const response = await axios
      .post("https://www.damnedventures.com/wp-json/wp/v2/easy_post_data", {
        address: {
          street1: formFields.address1,
          street2: formFields.address2,
          city: formFields.city,
          state: region,
          zip: formFields.zipcode,
          country: country,
          company: "EasyPost",
          phone: "",
        },
        verify_strict: false,
        enableUspsCass: false,
      })
      .then(async function (response) {
        paymentFunction(response, billing_address);

        // api call to get customer details
        const getCustomerDetails = async () => {
          setLoadingCustomerInitially(true);
          setErrorCustomerInitially(false);
          try {
            const customer = cart.customer;
            setCustomerDetails(customer);
            setFormFields({
              ...formFields,
              firstName: customer.billing_address.billing_first_name,
              lastName: customer.billing_address.billing_last_name,
              email: customer.billing_address.billing_email,
              phone: customer.billing_address.billing_phone,
              address1: customer.billing_address.billing_billing_address_1,
              address2: customer.billing_address.billing_address_2,
              city: customer.billing_address.billing_city,
              zipcode: customer.billing_address.billing_postcode,
              country: customer.billing_address.billing_country,
              region: customer.billing_address.billing_state,
            });
            setCountryRegionBilling({
              country: customer.billing_address.country,
              region: customer.billing_address.state,
            });

            setLoadingCustomerInitially(false);
            setErrorCustomerInitially(false);
          } catch (error) {
            setLoadingCustomerInitially(false);
            setProcessingForm(true);
          }
        };
      })
      .catch(async function (error) {
        createNotification("error", "Error");
        setProcessingForm(true);
      });
  };

  useEffect(() => {
    if (currentUser && currentUser.id && cart && cart.item_count > 0) {
      getCustomerDetails();
    }
  }, [currentUser]);

  useEffect(() => {
    setspinnerStatus(true);
  }, [toggle]);
  return (
    <Layout>
      <SeoConfig passedSeoData={SeoData.checkout} />
      <div className={checkoutStyles.checkoutWrapper}>
        <Breadcrumb>
          <BreadcrumbItem>
            <Link href="/">
              <a className="textDark">Home</a>
            </Link>
          </BreadcrumbItem>
          <BreadcrumbItem active>Checkout</BreadcrumbItem>
        </Breadcrumb>
        {!isCartUpdating &&
          !spinnerStatus &&
          cart?.length !== 0 &&
          pointstatus == "false" &&
          cart?.coupons?.length == 0 && (
            <div className={checkoutStyles.coupon_holder}>
              {pointValues > 0 ? (
                <>
                  <div className={checkoutStyles.coupon_text_holder}>
                    Use <strong>{pointValues}</strong> Points for a{" "}
                    <strong>${(pointValues / 15).toFixed(2)}</strong> discount
                    on this order!
                  </div>
                  <button
                    className={checkoutStyles.coupon_button_holder}
                    onClick={() => {
                      let points = prompt(
                        "How many points would you like to apply?"
                      );
                      if (points > pointValues) points = pointValues;
                      if (points !== null && points !== "" && points > 0) {
                        setspinnerStatus(true);
                        handleApplyPoint(points);
                        // setPoint(points)
                        // localStorage.setItem("points", points)

                        // axios
                        //   .post(
                        //     "https://www.damnedventures.com/custom_api.php",
                        //     {
                        //       action: "status",
                        //       user_id: userId,
                        //       status: "true",
                        //     }
                        //   )
                        //   .then((res) => console.log("resssssssss", res));
                        setspinnerStatus(false);
                        // localStorage.setItem("pointStatus", true)
                      }

                      // setPointStatus(true)
                      // applyPoints(point)
                    }}
                  >
                    APPLY DISCOUNT
                  </button>
                </>
              ) : (
                <>
                  <div className={checkoutStyles.coupon_text_holder}>
                    <strong>You have no points!</strong>
                  </div>
                </>
              )}
            </div>
          )}
        {!accessCookie("mrAuthToken") && (
          <div className={checkoutStyles.loginNoticeContainer}>
            <p className={checkoutStyles.firstLoginLink}>
              Returning customer?{" "}
              <Link href="/login">
                <a>Click here to login</a>
              </Link>
            </p>
            <p className={checkoutStyles.firstLoginLink}>
              For faster checkout, login or register using your social account.{" "}
              <Link href="/login">
                <a>Click here to login</a>
              </Link>
            </p>
          </div>
        )}
        {cart.length > 0 && (
          <div className={checkoutStyles.warningAlert}>
            <Countdown
              date={cartExpireTime}
              renderer={CartExpiresText}
              onComplete={() => clearCart()}
            />
          </div>
        )}
        {couponDetails &&
          couponDetails?.data.data.amount &&
          couponDetails?.data.data.amount !== 0 && (
            <h2 className="text-center mb-2">Coupon is Applied</h2>
          )}

        {/* {cart && cart.removed_items.length > 0 && (
          <div className={checkoutStyles.warningAlert}>
            Sorry{" "}
            <Link href={`/product/${cart.removed_items[0].id}`} passHref>
              <a className={checkoutStyles.warningLink}>
                {cart.removed_items[0].name}
              </a>
            </Link>{" "}
            was removed from your cart because you didn&apos;t checkout before
            the expiration time.
          </div>
        )} */}
        {cart && cart.notices?.error && cart.notices.error[0] && (
          <div
            className={checkoutStyles.warningAlert}
            dangerouslySetInnerHTML={{
              __html: cart.notices.error[0]
                .replace(`${WP_URL}/shop`, SITE_URL)
                .replace(/<\/a>/, "")
                .replace(/<a.*>/, ""),
            }}
          />
        )}
        {cart && cart.length === 0 && (
          <Container>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <div sm={12} style={{ margin: "auto" }}>
                <h4>Your shopping cart is empty</h4>
                <Link href="/shop" passHref>
                  <button className={checkoutStyles.emptyCartBtn}>
                    <ShoppingCartIcon /> <span>Start Shopping!</span>
                  </button>
                </Link>
              </div>
            </div>
          </Container>
        )}
        {cart && cart.length > 0 && (
          <Container
            style={
              {
                // maxWidth: '768px'
              }
            }
            className={checkoutStyles.checkoutDetails}
          >
            <Row className={checkoutStyles.checkoutDetailsRow}>
              <Col sm={12} md={6} className={checkoutStyles.checkoutColLeft}>
                {/* {(isCartUpdating || spinnerStatus) && (
                  <Preloader innerComponent />
                  // <div className={checkoutStyles.checkoutLoadingOverlay}>
                  //   <Spinner
                  //     animation="grow"
                  //     role="status"
                  //     aria-label="reloading cart"
                  //   />
                  // </div>
                )} */}
                <div className={checkoutStyles.checkoutColLeftInner}>
                  <h3 className="mt-2">Your Order</h3>
                  <div className={orderStyles.orderTable}>
                    <div className={orderStyles.orderTableHeader}>
                      <h5 className={orderStyles.orderH}>Product</h5>
                      <h5 className={orderStyles.orderH}>Total</h5>
                    </div>
                    <div
                      className={`${orderStyles.orderRow} ${checkoutStyles.orderRowUl}`}
                    >
                      {cart &&
                        cart.length > 0 &&
                        cart?.map((item, itemIdx) => (
                          <>
                            <div
                              className={checkoutStyles.productItem}
                              key={
                                item && item.variationId ? item.variationId : 0
                              }
                            >
                              <div className={checkoutStyles.productItemLeft}>
                                <div
                                  className={
                                    checkoutStyles.productItemLeftImgWrapper
                                  }
                                >
                                  <img
                                    src={item?.img}
                                    alt={item?.productName}
                                  />
                                </div>
                                <div
                                  className={checkoutStyles.productItemLeftInfo}
                                >
                                  <p className={`${checkoutStyles.pnamePara}`}>
                                    <span>
                                      {item && item?.productName
                                        ? item?.productName
                                        : "productName"}
                                    </span>
                                  </p>
                                  <p className={`${checkoutStyles.pnamePara}`}>
                                    <span>
                                      {/* {item.meta.variation.Configuration ||
                                      item.meta.variation.Type ||
                                      item.meta.variation.Metal} */}
                                      {item && item?.variation
                                        ? item?.variation
                                        : "variation"}
                                    </span>
                                  </p>

                                  <div className={checkoutStyles.amountsDiv}>
                                    {/* increase amount */}
                                    <button
                                      className={checkoutStyles.amountBtn}
                                      onClick={() => {
                                        // handleIncreaseAmount(item);
                                        removeFromCart(
                                          item.img,
                                          item.orderType !== ""
                                            ? item.orderType
                                            : "",
                                          item.shippingDate !== ""
                                            ? item.shippingDate
                                            : "",
                                          item.remainingStock,

                                          item.variationId,
                                          item.productName,
                                          item.quantity,
                                          item.price,
                                          item.variation,
                                          item.points
                                        );
                                      }}
                                      title="Increase amount"
                                      disabled={
                                        item &&
                                        item?.quantity.value === item &&
                                        item?.quantity.max_purchase
                                      }
                                    >
                                      <FaMinusCircle />
                                    </button>
                                    {item && item?.quantity && item?.quantity}
                                    <button
                                      className={checkoutStyles.amountBtn}
                                      onClick={() => {
                                        // if (
                                        //   item &&
                                        //   item?.quantity.value === item &&
                                        //   item?.quantity.min_purchase
                                        // ) {
                                        //   return handleDeleteItemModalShow(
                                        //     item && item.item_key
                                        //   );
                                        // }
                                        addToCart(
                                          item.img,
                                          item.orderType !== ""
                                            ? item.orderType
                                            : "",
                                          item.shippingDate !== ""
                                            ? item.shippingDate
                                            : "",
                                          item.remainingStock,
                                          item.variationId,
                                          item.productName,
                                          item.quantity,
                                          item.price,
                                          item.variation,
                                          item.points
                                        );
                                      }}
                                      title="Decrease amount"
                                      // disabled={
                                      //   item &&
                                      //   item?.quantity.value === item &&
                                      //   item?.quantity.min_purchase - 1
                                      // }
                                    >
                                      <FaPlusCircle />
                                    </button>
                                  </div>
                                </div>
                              </div>
                              <div className={checkoutStyles.productItemRight}>
                                <div
                                  className={
                                    checkoutStyles.productItemRightLeft
                                  }
                                >
                                  <FaTrash color="red" className="me-3" />

                                  <div
                                    className={
                                      checkoutStyles.productItemRightRight
                                    }
                                  >
                                    <p
                                      className={checkoutStyles.ppriceParaAmnt}
                                    >
                                      $
                                      {parseFloat(
                                        item && item?.price ? item.price : 0
                                      ).toFixed(2)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div>
                              {item.shippingDate !== "" ? (
                                <p>
                                  <span className="text-danger">Ship on:</span>{" "}
                                  {item.shippingDate}
                                </p>
                              ) : (
                                ""
                              )}
                            </div>
                          </>
                        ))}
                      <Modal
                        style={{ top: "100px" }}
                        show={!!itemToDelete}
                        onHide={handleDeleteItemModalClose}
                      >
                        <Modal.Header closeButton>
                          <Modal.Title>Remove Item</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          Are you sure you want to remove this item from Cart?
                        </Modal.Body>
                        <Modal.Footer>
                          <Button
                            variant="secondary"
                            onClick={handleDeleteItemModalClose}
                          >
                            Close
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => {
                              handleDeleteItemModalClose();
                              removeItem(itemToDelete);
                            }}
                          >
                            Delete
                          </Button>
                        </Modal.Footer>
                      </Modal>
                    </div>
                    <form
                      onSubmit={handleSubmit(async (data) => {
                        setCouponDetails(null);
                        const response = await axios.get(
                          "https://www.damnedventures.com/wp-json/wp/v2/apply_coupon",
                          {
                            params: {
                              coupon: data.couponCode,
                            },
                          }
                        );
                        // console.log("rrr", response);
                        if (response.data.type === "success") {
                          setCouponDetails(response);
                        }
                        if (response.data.type === "error") {
                          setCouponDetails(response);
                        }
                      })}
                      className={orderStyles.applyCouponForm}
                    >
                      <div className={orderStyles.applyCoupon}>
                        <input
                          name="couponCode"
                          className={` ${orderStyles.couponField} mrInput`}
                          placeholder="Have coupon?"
                          {...register("couponCode", { required: true })}
                        />

                        <button
                          className={orderStyles.couponButton}
                          type="submit"
                        >
                          Apply Coupon
                        </button>
                      </div>
                      {errors.couponCode && (
                        <small className="text-danger">
                          Coupon should be at-least one character
                        </small>
                      )}
                      {couponDetails?.data.type === "error" && (
                        <small className="text-danger">
                          Coupon code incorrect!
                        </small>
                      )}
                      {couponDetails?.data.type === "success" && (
                        <>
                          <small className="text-success">
                            Coupon is applied with discount of $
                            {parseFloat(
                              couponDetails?.data.data.amount
                            ).toFixed(2)}
                          </small>

                          <div className={orderStyles.finalOrderInfo}>
                            <p className={orderStyles.orderH}>Discount:</p>
                            <p>
                              $
                              {parseFloat(
                                couponDetails?.data.data.amount
                              ).toFixed(2)}
                            </p>
                          </div>
                        </>
                      )}
                    </form>

                    <div className={orderStyles.finalOrderInfo}>
                      <p className={orderStyles.orderH}>Subtotal:</p>
                      <p>${parseFloat(getCartSubtotal(cart)).toFixed(2)}</p>
                    </div>
                    <div className={orderStyles.finalOrderInfo}>
                      <p className={orderStyles.orderH}>Shipping</p>
                      <p>
                        {shippingDetails.title}: $
                        {parseFloat(shippingDetails.cost).toFixed(2)}
                      </p>
                    </div>

                    {/* {!!cart.coupons.length &&
                      cart.coupons.map((coupon) => (
                        <div
                          className={orderStyles.finalOrderInfo}
                          key={coupon.coupon}
                        >
                          <p className={orderStyles.orderH}>
                            Coupon: <b>{coupon.coupon}</b>
                            <button
                              className={orderStyles.clearCouponButton}
                              title="Remove coupon"
                              onClick={() => handleRemoveCoupon(coupon.coupon)}
                            >
                              <Clear fontSize=".8rem" />
                            </button>
                          </p>
                          <div className={orderStyles.couponInfoRight}>
                            <span>{coupon.saving_html}</span>
                          </div>
                        </div>
                      ))} */}
                    {!isCartUpdating &&
                      !spinnerStatus &&
                      pointstatus == "true" && (
                        <div className={orderStyles.finalOrderInfo}>
                          <p className={orderStyles.orderH}>
                            Points redemption:
                          </p>
                          <p>
                            -$
                            {(cart.totals.total > 0 ? point / 15 : 0).toFixed(
                              2
                            )}{" "}
                            <img
                              onClick={async () => {
                                setspinnerStatus(true);
                                //  setPointStatus(false);
                                // settoggle(prev => !prev)
                                // await removePoints(point)
                                handleRemovePoint(point);
                                setspinnerStatus(false);
                                // localStorage.setItem("points", 0)

                                // setPoint(0)
                              }}
                              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAilBMVEX/AAD/////oKD/MzP/CQn//Pz/6en/wMD/urr/tbX/BAT/RUX/rKz/YWH/QUH/ior/8fH/pqb/qqr/9fX/3d3/1dX/eHj/Z2f/cXH/Gxv/8/P/sbH/zMz/FRX/gYH/mpr/lZX/KCj/UlL/yMj/Ojr/TU3/JCT/a2v/RET/hob/XFz/4eH/WFj/Ly/KNXz8AAAEx0lEQVR4nO3d21riMBQF4BRoFTkVSpGTgFLFEXn/1xsOMwgNO0mbNklxres9mfxaW5qEbzOvkPhxu1ZsBvOomKmxAsaIHjusjLzXwgJmV4Bw+VGK75iFvlFbGJfoO2RmW7gs17fPxrcqHJUOZKyrR9QTmgDuifaENSNAxp5tCWNDQMYGloSJMSHTeGhoCGfmgGxsRfhkUKjxS8wvXJsEspUF4diosG5B+GpUyIbGhUOzQPZoXDg3LOwZF7YNC3M/Lyoj3Ny9sAMhhBBmFja6rSz5nFRM2BtOfc/PkiioCT8luSUc5VxZ6VdF2Mw7puijoEvCdt4hPRHRIaHG6/g+gwoINdfhu84L9X6F9OqPO8KHvAP+S+i8MMg74HlGrgvzjnfO590LiVsNhGQgJANh7kCYNRCSgTB3IMwaCMncv7BZlrB1e9zcJ06IGT0u6qwhDiGU/Ct5iHElAz9Nxu3bxzVvCvtGDyEUlz9TNWFIXCcVyMdcRRjYnqZW+M1wThjKNhAcTywVbmxPUTOv6R2FtNDcabyy0pcIn21PUD9ioW97egVkLhSaPaxWTvpCoem96zIiFor2KKuS3y6k3hiqFLHQ9InDMtIWCr0X2/PTTyAWrmzPTzvvnlhIbVBWJ+kXKO6TN3lUoCLhdtn590Mz32UqK/zXwG6845s9hF9sEv401q11mupeqKMbmpsrUWGvii/6jc32FoZYTfTjWe9fFLBvo97iS2kWh8qO0jP3WEkuLf7k/zT7c+KoknwFty77P5anR2zYls68d5pE1JdWrk5jTpvSSun8tYXJz0cIX/x7rF9UipcSdsqVBoStq4Vm0ZPm+j4uqkyuxlzYFb6kLn7q3B3jTvTRlY3UB8t3q8L011fppbp0Jf0WU1OuNCHkqqkdgQn3KKb+aBtc5bdFIf+EpRZ61Cv5bTTha3nJQv7AM3WZptdp6YuPH3NrUcgfJqX2dfjT7dS8+b0V4SKuw8KA2KSEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEUElItKu6HyHVo8QtId9bhWqZvOQqqX4t6VZBnje3KPziqldEJd8fZ0lUprtsel7NopBN09WvVCXX9y2hKgPlMU0IF6liuut1uh0S3eJIvdKEMNXXlLo/HrK+rhSMeX3/CsTt80oXsviiNCSvvHRlJBz18scWUl3AjAnZ7FwpvOexy9Zrc0nbyJ97dCxrgGhAyJJZGHl++CBsj3bMrnmsXL9JK5PBqbIjrTQhPEy9Jbw+y6w0JLQYCCH8FcKdbYM4BQjlt3arKUDodq/1SQFC6i3HjfBvZdmFdANcF8K/WWcXRkqNwm1lWIDQ6T/EhGsenEfo8mXKLxTlEYp7KlvNJJLPXkUoboxtM3x35HxCr2dbQqSlMnklIdlP3HK49bv8wtDJj9+xfOLKQieJakBVoRe5dqG+bBVnriqUrK0bz1j+qM8s9IKxbdY534pXaEah521XXdu2fXaLDL6Mwn2m60HNZvoPgfL1ecpfsDef7iumWj0AAAAASUVORK5CYII="
                              style={{ height: 12, width: 12 }}
                            />
                          </p>
                        </div>
                      )}
                    {}
                    {/* {insurance.insurance_selected === "true" &&
                      <div className={orderStyles.finalOrderInfo}>


                        <p className={orderStyles.orderH}>Route Shipping Protection</p>
                        <p>${insurance.insurance_price.toFixed(2)}</p>
                      </div>} */}
                    {/* {cart.shipping.packages.default ? (
                      <div className={orderStyles.finalOrderInfo}>
                        <p className={orderStyles.orderH}>Shipping:</p>
                        {(() => {
                          const methods = Object.values(
                            getShippingMethods(cart)
                          );
                          if (methods.length === 1) {
                            return <p>{methods[0].html}</p>;
                          } else if (methods.length > 1) {
                            return (
                              <fieldset id="shipping-method">
                                {methods.map((method) => (
                                  <p
                                    key={method.key}
                                    className={orderStyles.chooseShippingMethod}
                                  >
                                    <span>{method.html}</span>
                                    <input
                                      checked={method.key === shippingMethod}
                                      type="radio"
                                      value={shippingMethod}
                                      name="shipping-method"
                                      onChange={() => {}}
                                      onClick={() =>
                                        handleShippingMethodChange(method.key)
                                      }
                                    />
                                  </p>
                                ))}
                              </fieldset>
                            );
                          }
                        })()}
                      </div>
                    ) : (
                      <div className={orderStyles.finalOrderInfo}>
                        <b>
                          No shipping methods available, Please select another
                          shipping address
                        </b>
                      </div>
                    )} */}
                    {/* <div className={checkoutStyles.checkoutColLeftInner}>
                  {(isCartUpdating || spinnerStatus) && (

                    <div className={checkoutStyles.checkoutLoadingOverlay}>
                      <Spinner
                        animation="grow"
                        role="status"
                        aria-label="reloading cart"
                      />
                    </div>
                  )}
                  </div> */}
                    {
                      <div
                        id="RouteWidget"
                        className={checkoutStyles.RouteWidgetHide}
                        data-default-checked={insuranceValue}
                      ></div>
                    }

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                      className={checkoutStyles.rwContents}
                    >
                      <div className={checkoutStyles.rwContents}>
                        <div className={checkoutStyles.rwLeft}>
                          <img
                            className="rw-route-logo"
                            src="images/RoutePlusGray.svg"
                          />
                        </div>
                        <div className={checkoutStyles.rwCenter}>
                          <div className={checkoutStyles.rwTextTop}>
                            Package Protection
                          </div>
                          <div
                            id="RouteWidget"
                            data-default-checked="false"
                          ></div>
                          <div className={checkoutStyles.rwTextBottom}>
                            from Damage, Loss &amp; Theft for{" "}
                            <strong>${packageProtectionFee}</strong>
                          </div>
                        </div>
                        <div className={checkoutStyles.rwRight}>
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              id={checkoutStyles.flexSwitchCheckChecked}
                              type="checkbox"
                              value={insuranceValue}
                              checked={insuranceValue}
                              onChange={() => {
                                setInsuranceValue((prev) => !prev);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <span>
                          {insuranceValue === true
                            ? "$" + parseFloat(packageProtectionFee).toFixed(2)
                            : "$ 0.00"}
                        </span>
                      </div>
                    </div>
                    {/* <div class="route-div"></div>
                     */}

                    <div
                      className={`${orderStyles.finalOrderInfo} ${orderStyles.boldText}`}
                    >
                      <p
                        className={`${orderStyles.orderH} ${orderStyles.boldText}`}
                      >
                        Total:
                      </p>
                      <p>${total}</p>
                    </div>
                  </div>
                </div>
              </Col>
              <Col sm={12} md={6} className={checkoutStyles.checkoutColRight}>
                <div className={checkoutStyles.checkoutColRightInner}>
                  <h3 className={checkoutStyles.titleBox}>Ship to</h3>
                  {loadingCustomerInitially && (
                    <div className={checkoutStyles.loader}>
                      <Skeleton count={9} height={55} className="mb-2" />
                    </div>
                  )}
                  {!loadingCustomerInitially && !errorCustomerInitially && (
                    <form
                      onSubmit={handleFormSubmit}
                      className={checkoutStyles.formWrapper}
                    >
                      <div className={checkoutStyles.formFieldsGrid}>
                        <div className={checkoutStyles.inputWrapper}>
                          <input
                            type="text"
                            placeholder="First Name *"
                            name="firstName"
                            id="firstName"
                            className="mrInput"
                            onChange={handleFormFieldChange}
                            value={formFields.firstName}
                          />
                        </div>
                        <div className={checkoutStyles.inputWrapper}>
                          <input
                            type="text"
                            placeholder="Last Name *"
                            name="lastName"
                            id="lastName"
                            className="mrInput"
                            onChange={handleFormFieldChange}
                            value={formFields.lastName}
                          />
                        </div>

                        <div className={checkoutStyles.inputWrapper}>
                          <input
                            type="tel"
                            placeholder="Phone *"
                            name="phone"
                            id="phone"
                            className="mrInput"
                            onChange={handleFormFieldChange}
                            value={formFields.phone}
                          />
                        </div>
                        <div className={checkoutStyles.inputWrapper}>
                          <input
                            type="email"
                            placeholder="Email Address *"
                            name="email"
                            id="email"
                            className="mrInput"
                            onChange={handleFormFieldChange}
                            value={formFields.email}
                          />
                        </div>
                        <div className={checkoutStyles.inputWrapper}>
                          <input
                            id="pac-input"
                            className="mrInput"
                            type="text"
                            placeholder="Street Address"
                          />
                        </div>
                        {/* Country Region Library */}
                        {/* {!isCountriesLoading && listOfCountriesRegions && (
                          <>
                            <div
                              className={`${checkoutStyles.inputWrapper} ${checkoutStyles.selectWrapper}`}
                            >
                              <select
                                id="shipping-country-select"
                                className="mrInput dropdownStyles"
                                value={countryRegionShipping.country || ""}
                                onChange={(e) =>
                                  selectCountryShipping(e.target.value)
                                }
                              >
                                <option disabled selcted value="" key={"none"}>
                                  -- Country --
                                </option>
                                {Object.keys(
                                  listOfCountriesRegions.countries
                                ).map((countryCode) => (
                                  <option key={countryCode} value={countryCode}>
                                    {
                                      listOfCountriesRegions.countries[
                                        countryCode
                                      ]
                                    }
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div
                              className={`${checkoutStyles.inputWrapper} ${checkoutStyles.selectWrapper}`}
                            >
                              {countryRegionShipping.country &&
                                (listOfCountriesRegions.states[
                                  countryRegionShipping.country
                                ] &&
                                listOfCountriesRegions.states[
                                  countryRegionShipping.country
                                ]?.length !== 0 ? (
                                  <select
                                    className="mrInput dropdownStyles"
                                    id="shipping-state-select"
                                    value={countryRegionShipping.region || ""}
                                    onChange={(e) =>
                                      selectRegionShipping(e.target.value)
                                    }
                                    style={{ width: "100%" }}
                                  >
                                    <option
                                      disabled
                                      selcted
                                      value=""
                                      key={"none"}
                                    >
                                      -- Select Region --
                                    </option>
                                    {Object.keys(
                                      listOfCountriesRegions.states[
                                        countryRegionShipping.country
                                      ]
                                    ).map((stateCode) => (
                                      <option key={stateCode} value={stateCode}>
                                        {
                                          listOfCountriesRegions.states[
                                            countryRegionShipping.country
                                          ][stateCode]
                                        }
                                      </option>
                                    ))}
                                  </select>
                                ) : (
                                  <input
                                    styles={checkoutStyles.city}
                                    value={countryRegionShipping.region}
                                    className="mrInput"
                                    onChange={(e) =>
                                      setCountryRegionShipping((state) => ({
                                        ...state,
                                        region: e.target.value,
                                      }))
                                    }
                                    placeholder="State *"
                                  />
                                ))}
                            </div>
                          </>
                        )} */}

                        {/* <div className={checkoutStyles.inputWrapper}>
                          <input
                            type="text"
                            placeholder="Street Address *"
                            name="address1"
                            id="address1"
                            className="mrInput"
                            onChange={handleFormFieldChange}
                            value={formFields.address1}
                          />
                        </div> */}
                        <div className={checkoutStyles.inputWrapper}>
                          <input
                            type="text"
                            placeholder="Address 2"
                            name="address2"
                            id="address2"
                            // required
                            className="mrInput"
                            onChange={handleFormFieldChange}
                            value={formFields.address2}
                          />
                        </div>

                        <div className={checkoutStyles.inputWrapper}>
                          <input
                            type="text"
                            placeholder="City *"
                            name="city"
                            id="city"
                            className="mrInput"
                            onChange={handleFormFieldChange}
                            value={formFields.city}
                          />
                        </div>
                        <div className={checkoutStyles.inputWrapper}>
                          <input
                            type="text"
                            placeholder="ZIP Code *"
                            name="zipcode"
                            id="zipcode"
                            className="mrInput"
                            onChange={handleFormFieldChange}
                            value={formFields.zipcode}
                          />
                        </div>

                        <div
                          className={`${checkoutStyles.inputWrapper} ${checkoutStyles.selectWrapper}`}
                        >
                          {/* country dropdown */}
                          <CountryDropdown
                            value={countryRegionBilling.country}
                            valueType="short"
                            onChange={(val) => {
                              selectCountryBilling(val);
                              setCountry(val);
                            }}
                            name="billing_country"
                            id="billing_country"
                            classes="mrInput dropdownStyles"
                          />
                        </div>
                        <div
                          className={`${checkoutStyles.inputWrapper} ${checkoutStyles.selectWrapper}`}
                        >
                          {/* states dropdown */}
                          <RegionDropdown
                            country={countryRegionBilling.country}
                            value={countryRegionBilling.region}
                            countryValueType="short"
                            defaultOptionLabel="State*"
                            valueType={"short"}
                            onChange={(val) => {
                              selectRegionBilling(val);
                              setRegion(val);
                            }}
                            name="billing_state"
                            id="billing_state"
                            classes="mrInput dropdownStyles"
                          />
                        </div>
                      </div>
                      <div
                        className={`${checkoutStyles.formRow} ${checkoutStyles.shipToElse}`}
                      >
                        <li
                          onClick={() =>
                            setBillToAnotherAddress(!billToAnotherAddress)
                          }
                          className={checkoutStyles.shipToElseBtn}
                        >
                          Different Billing Address?
                          <div style={{ float: "right" }}>
                            <ChevronRightSharp
                              style={{
                                transform: billToAnotherAddress
                                  ? "rotate(-90deg)"
                                  : "rotate(90deg)",
                              }}
                            />
                          </div>
                        </li>
                      </div>
                      {billToAnotherAddress && (
                        <>
                          <div className={checkoutStyles.formFieldsGrid}>
                            <div className={checkoutStyles.inputWrapper}>
                              <input
                                type="text"
                                placeholder="First Name *"
                                name="billing_firstName"
                                id="billing_firstName"
                                className="mrInput"
                                onChange={handleFormFieldChange}
                                // value={formFields.billing_firstName}
                                defaultValue={formFields.firstName}
                              />
                            </div>
                            <div className={checkoutStyles.inputWrapper}>
                              <input
                                type="text"
                                placeholder="Last Name *"
                                name="billing_lastName"
                                id="billing_lastName"
                                className="mrInput"
                                onChange={handleFormFieldChange}
                                // value={formFields.billing_lastName}
                                defaultValue={formFields.lastName}
                              />
                            </div>

                            <div className={checkoutStyles.inputWrapper}>
                              <input
                                type="tel"
                                placeholder="Phone *"
                                name="billing_phone"
                                id="billing_phone"
                                className="mrInput"
                                onChange={handleFormFieldChange}
                                // value={formFields.billing_phone}
                                defaultValue={formFields.phone}
                              />
                            </div>
                            <div className={checkoutStyles.inputWrapper}>
                              <input
                                type="email"
                                placeholder="Email Address *"
                                name="billing_email"
                                id="billing_email"
                                className="mrInput"
                                onChange={handleFormFieldChange}
                                defaultValue={formFields.email}
                                // value={formFields.billing_email}
                              />
                            </div>

                            <div
                              className={`${checkoutStyles.inputWrapper} ${checkoutStyles.selectWrapper}`}
                            >
                              {/* country dropdown */}
                              <CountryDropdown
                                value={countryRegionBilling.country}
                                valueType="short"
                                onChange={(val) => {
                                  selectCountryBilling(val);
                                  setCountry(val);
                                }}
                                name="billing_country"
                                id="billing_country"
                                classes="mrInput dropdownStyles"
                                // defaultValue={formFields.phone}
                              />
                            </div>
                            <div
                              className={`${checkoutStyles.inputWrapper} ${checkoutStyles.selectWrapper}`}
                            >
                              {/* states dropdown */}
                              <RegionDropdown
                                country={countryRegionBilling.country}
                                value={countryRegionBilling.region}
                                // defaultValue={countryRegionBilling.region}
                                countryValueType="short"
                                defaultOptionLabel="State*"
                                valueType="short"
                                onChange={(val) => selectRegionBilling(val)}
                                name="billing_state"
                                id="billing_state"
                                classes="mrInput dropdownStyles"
                              />
                            </div>

                            <div className={checkoutStyles.inputWrapper}>
                              <input
                                type="text"
                                placeholder="Street Address *"
                                name="billing_address1"
                                id="billing_address1"
                                className="mrInput "
                                onChange={handleFormFieldChange}
                                // value={formFields.billing_address1}
                                defaultValue={formFields.address1}
                              />
                            </div>
                            <div className={checkoutStyles.inputWrapper}>
                              <input
                                type="text"
                                placeholder="Address 2 *"
                                name="billing_address2"
                                id="billing_address2"
                                // required
                                className="mrInput"
                                onChange={handleFormFieldChange}
                                defaultValue={formFields.address2}
                                // value={formFields.billing_address2}
                              />
                            </div>

                            <div className={checkoutStyles.inputWrapper}>
                              <input
                                type="text"
                                placeholder="City *"
                                name="billing_city"
                                id="billing_city"
                                className="mrInput"
                                onChange={handleFormFieldChange}
                                defaultValue={formFields.city}
                                // value={formFields.billing_city}
                              />
                            </div>
                            <div className={checkoutStyles.inputWrapper}>
                              <input
                                type="text"
                                placeholder="ZIP Code *"
                                name="billing_zipcode"
                                id="billing_zipcode"
                                className="mrInput"
                                onChange={handleFormFieldChange}
                                // value={formFields.billing_zipcode}
                                defaultValue={formFields.zipcode}
                              />
                            </div>
                          </div>
                        </>
                      )}
                      <div
                        className={`${checkoutStyles.formRow} ${checkoutStyles.formRowPayment}`}
                      >
                        {/* Radio buttons */}
                        {/* {!!parseFloat(cartTotal) &&
                          paymentMethods &&
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
                                checked={
                                  paymentMethodField.payment_method ===
                                  paymentMethod.id
                                }
                              />
                              <label
                                htmlFor={paymentMethod.id}
                                className={`drinkcard-cc ${checkoutStyles.paymentMethodLabel}`}
                                style={{
                                  backgroundImage: `url(${paymentMethod.image})`,
                                  backgroundSize: "contain",
                                  backgroundPosition: "center",
                                  backgroundRepeat: "no-repeat",
                                }}
                              ></label>
                            </div>
                          ))} */}
                      </div>
                      {/* <input
                        type="radio"
                        name="payment_method"
                        value="NMI_Payment"
                        onChange={(e) => {
                          setSelectedPaymentMethod(
                            e.target.checked === true ? "NMI_Payment" : "N/A"
                          );
                        }}
                      /> */}
                      <div className="cursor-pointer">
                        <label
                          htmlFor="NMI_Payment"
                          onClick={() =>
                            setSelectedPaymentMethod("NMI_Payment")
                          }
                        >
                          <div className="d-flex" style={{ cursor: "pointer" }}>
                            <img
                              style={{ width: "30px", height: "22px" }}
                              src="https://www.damneddesigns.com/wp-content/plugins/woocommerce/assets/images/icons/credit-cards/visa.svg"
                              alt="Visa"
                            />
                            <img
                              style={{ width: "30px", height: "22px" }}
                              src="https://www.damneddesigns.com/wp-content/plugins/woocommerce/assets/images/icons/credit-cards/mastercard.svg"
                              alt="Mastercard"
                            />
                            <img
                              style={{ width: "30px", height: "22px" }}
                              src="https://www.damneddesigns.com/wp-content/plugins/woocommerce/assets/images/icons/credit-cards/amex.svg"
                              alt="Amex"
                            />
                            <img
                              style={{ width: "30px", height: "22px" }}
                              src="https://www.damneddesigns.com/wp-content/plugins/woocommerce/assets/images/icons/credit-cards/discover.svg"
                              alt="Discover"
                            />
                            <img
                              style={{ width: "30px", height: "22px" }}
                              src="https://www.damneddesigns.com/wp-content/plugins/woocommerce/assets/images/icons/credit-cards/diners.svg"
                              alt="Diners Club"
                            />
                            <img
                              style={{ width: "30px", height: "22px" }}
                              src="https://www.damneddesigns.com/wp-content/plugins/woocommerce/assets/images/icons/credit-cards/jcb.svg"
                              alt="JCB"
                            />
                            <img
                              style={{ width: "30px", height: "22px" }}
                              src="https://www.damneddesigns.com/wp-content/plugins/woocommerce/assets/images/icons/credit-cards/maestro.svg"
                              alt="Maestro"
                            />
                          </div>
                        </label>
                      </div>
                      {/* {paymentMethodField.payment_method === "nmi" && ( */}
                      {selectedPaymentMethod === "NMI_Payment" && (
                        <div className={`${checkoutStyles.cardInputForm} mt-3`}>
                          <div className={checkoutStyles.cardNumber}>
                            <input
                              className={checkoutStyles.cardNumberInput}
                              {...getCardNumberProps({
                                onChange: handleCardNumberChange,
                                value: cardInputFields.cardNumber,
                              })}
                              value={cardInputFields.cardNumber}
                            />
                            <svg
                              {...getCardImageProps({ images })}
                              width="3em"
                              height="2em"
                            />
                          </div>

                          <div className={checkoutStyles.cardExpCVV}>
                            <input
                              className={checkoutStyles.cardExp}
                              {...getExpiryDateProps({
                                onChange: handleCardExpiryChange,
                              })}
                              value={cardInputFields.cardExpiry}
                            />
                            <input
                              className={checkoutStyles.cardCVV}
                              {...getCVCProps({ onChange: handleCVVChange })}
                              value={cardInputFields.cardCVV}
                            />
                          </div>
                        </div>
                      )}
                      <div>
                        {meta.isTouched && meta.error && (
                          <span className="text-danger">
                            Error: {meta.error}
                          </span>
                        )}
                      </div>
                      {/* <input
                        type="radio"
                        name="payment_method"
                        value="Sezzle_Pay"
                        onChange={(e) => {
                          setSelectedPaymentMethod(
                            e.target.checked === true ? "Sezzle_Pay" : "N/A"
                          );
                        }}
                      /> */}
                      <label
                        className="my-3"
                        onClick={() => setSelectedPaymentMethod("Sezzle_Pay")}
                      >
                        <img
                          className="w-100"
                          src="https://d34uoa9py2cgca.cloudfront.net/branding/sezzle-logos/png/sezzle-logo-sm-100w.png"
                          style={{ cursor: "pointer" }}
                        />
                      </label>
                      {/* {paymentMethodField.payment_method === "sezzlepay" && ( */}
                      {selectedPaymentMethod === "Sezzle_Pay" && (
                        <div
                          className={`${checkoutStyles.sezzleBreakdown} w-50`}
                        >
                          <small className="text-center">
                            4 interest-free payments over 6 weeks
                          </small>
                          <img
                            src="/images/sezzle-cost-breakdown.png"
                            className="mt-2 w-100"
                            alt="Sezzle cost breakdown"
                          />
                          <div className="d-flex justify-content-around">
                            <div className="d-flex flex-column align-items-center">
                              <small>
                                {"$"}
                                {(total / 4).toFixed(2)}
                              </small>
                              <small>today</small>
                            </div>
                            <div className="d-flex flex-column align-items-center">
                              <small>
                                {"$"}
                                {(total / 4).toFixed(2)}
                              </small>
                              <small>Dec 1</small>
                            </div>
                            <div className="d-flex flex-column align-items-center">
                              <small>
                                {"$"}
                                {(total / 4).toFixed(2)}
                              </small>
                              <small>Dec 15</small>
                            </div>
                            <div className="d-flex flex-column align-items-center">
                              <small>
                                {"$"}
                                {(total / 4).toFixed(2)}
                              </small>
                              <small>Dec 29</small>
                            </div>
                          </div>
                        </div>
                      )}
                      <br />
                      {/* <input
                        type="radio"
                        name="payment_method"
                        disabled
                        value="cryptoPay"
                        onChange={(e) => {
                          setSelectedPaymentMethod(
                            e.target.checked === true ? "cryptoPay" : "N/A"
                          );
                        }}
                      /> */}
                      <label
                        htmlFor="cryptoPay"
                        className="mb-3 d-flex align-items-center cursor-pointer"
                        onClick={() => setSelectedPaymentMethod("cryptoPay")}
                      >
                        <img
                          src="https://www.damneddesigns.com/wp-content/plugins/crypto-com-pay-checkout-for-woocommerce//assets/icon.svg"
                          style={{ width: "70px", cursor: "pointer" }}
                        />
                        {selectedPaymentMethod === "cryptoPay" && (
                          <span className="ms-2">(Coming Soon)</span>
                        )}
                      </label>
                      {/* <br /> */}
                      {/* <input
                        type="radio"
                        name="payment_method"
                        disabled
                        value="coinbase"
                        onChange={(e) => {
                          setSelectedPaymentMethod(
                            e.target.checked === true ? "coinbase" : "N/A"
                          );
                        }}
                      /> */}
                      <label
                        htmlFor="coinbase"
                        className="my-3 d-flex align-items-center cursor-pointer"
                        onClick={() => setSelectedPaymentMethod("coinbase")}
                      >
                        <img
                          src="https://www.damneddesigns.com/wp-content/plugins/coinbase-commerce/assets/images/ethereum.png"
                          style={{ width: "100px", cursor: "pointer" }}
                        />

                        {selectedPaymentMethod === "coinbase" && (
                          <span className="ms-2">(Coming Soon)</span>
                        )}
                      </label>
                      {paymentMethodUnavailable && (
                        <div
                          className={checkoutStyles.paymentMethodUnavailable}
                        >
                          <p>
                            <b>
                              Sorry, this payment method is currently
                              unavailable.
                            </b>
                          </p>
                        </div>
                      )}
                      {showTOSScreen && (
                        <div className={checkoutStyles.TOSContainer}>
                          <TermsAndConditionContent />
                        </div>
                      )}
                      {showPrivacyPolicy && (
                        <div className={checkoutStyles.TOSContainer}>
                          <PrivacyPolicyContent />
                        </div>
                      )}
                      <div
                        className={checkoutStyles.formRow}
                        style={{ margin: "12px 0" }}
                      >
                        {/* checkbox */}
                        <div className={checkoutStyles.checkboxWrapper}>
                          <input
                            type="checkbox"
                            name="terms"
                            id="terms"
                            // required
                            onChange={handleFormFieldChange}
                            defaultValue={formFields.terms}
                          />
                          <div className={checkoutStyles.termsWrapper}>
                            <label htmlFor="terms">
                              {`I agree to the site's  `}
                              <span
                                onClick={() => setShowTOSScreen(!showTOSScreen)}
                                className={
                                  checkoutStyles.termsAndConditionsText
                                }
                              >
                                terms and conditions
                              </span>

                              {" & "}

                              <span
                                onClick={() =>
                                  setShowshowPrivacyPolicy(!showPrivacyPolicy)
                                }
                                className={
                                  checkoutStyles.termsAndConditionsText
                                }
                              >
                                privacy policy
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className={checkoutStyles.formRow}>
                        <button
                          type="submit"
                          name="submit"
                          className={checkoutStyles.submitBtn}
                          disabled={
                            processingForm ||
                            isCartUpdating ||
                            paymentMethodUnavailable
                          }
                        >
                          {processingForm ? "Processing..." : "Pay $" + total}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </Col>
            </Row>
          </Container>
        )}
      </div>
      <NotificationContainer />
    </Layout>
  );
};

const CartExpiresText = ({ minutes, seconds, completed }) => {
  if (completed) {
    localStorage.setItem("cart", []);
    return "Item Expired";
  } else {
    return (
      <span>
        Please checkout within {minutes} Minutes {seconds} Seconds to guarantee
        that your item does not expire.
      </span>
    );
  }
};

export default Checkout;
