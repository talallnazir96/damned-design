import Image from "next/image";
import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import productStyles from "./Product.module.css";
import contentStyles from "../../../components/Products/Content.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import { Spinner } from "react-bootstrap";
// require('dotenv').config()
import { getReadableDate } from "../../../functions/getReadableDate";
import {
  addToLastViewed,
  getLastViewedProducts,
  addProductToWishlist,
  isProductInWishlist,
} from "../../../functions/localStorage";
import { useGlobalContext } from "../../../contextAPI/context";
import { NotificationContainer } from "react-notifications";
import { createNotification } from "../../../functions/utils";
import {
  Box,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Select,
} from "@material-ui/core";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import { format, fromUnixTime } from "date-fns";
import {
  OutOfStockRibbon,
  PreOrderRibbon,
  PreOrderWarningRibbon,
  SaleRibbon,
} from "../../../components/Ribbon";
import { WP_URL } from "../../../utils/config";
import Preloader from "../../../components/Preloader";

function Product({ id, data, variations, images }) {
  const { state, directCheckout, addToCart } = useGlobalContext();
  const [lastViewedProducts, setLastViewedProducts] = useState([]);
  const [favorite, setFavorite] = useState(
    typeof window !== "undefined" ? isProductInWishlist(id) : false
  );
  const [isAvailable, setAvailable] = useState(true);
  // const [configrationOptions, setConfigrationOptions] = useState([])
  // const [variationsState, setVariationsState] = useState([])
  const [variationDetails, setVariationDetails] = useState({
    id: "",
    title: "",
    variation: "",
    price: "",
    regular_price: "",
    amount: 1,
    shipsByDate: "",
    discount: 0,
    isOnSale: false,
    sale_price: "",
    isInCart: false,
    // isInWishlist: false,
    stock_quantity: 0,
    isInStock: true,
    isFreeShipping: false,
    meta: [],
  });
  const [variationStockStatus, setVariationStockStatus] = useState(null);
  const [points, setPoints] = useState(null);
  const router = useRouter();
  // const {id} = router.query
  const [showFloatingMenu, setShowFloatingMenu] = useState(false);

  useEffect(() => {
    setLastViewedProducts(getLastViewedProducts());
    addToLastViewed(id, data);
    setFavorite(isProductInWishlist(id));

    // Show Floating Menu

    window.addEventListener("scroll", () => {
      const bottom =
        Math.ceil(window.innerHeight + window.scrollY) >=
        document.documentElement.scrollHeight;
      if (window.pageYOffset > 300 && !bottom) {
        setShowFloatingMenu(true);
      } else {
        setShowFloatingMenu(false);
      }
    });
    // debugging
    // console.log('Id', id)
    // console.log('Data', data)
    // console.log('Variations', variations)
  }, [id]);

  const handleVariationChange = (
    varId,
    varLabel,
    varPrice,
    varRegularPrice,
    isVarOnSale,
    varSalePrice,
    varStockStatus,
    stockMetaData
  ) => {
    setVariationDetails((prevValue) => ({
      ...prevValue,
      id: varId,
      variation: varLabel,
      price: varPrice,
      regular_price: varRegularPrice,
      isOnSale: isVarOnSale,
      sale_price: varSalePrice,
      stock_quantity: Number(
        stockMetaData.find((item) => item.key == "wcwl_stock_level").value
      ),
      meta: stockMetaData,
    }));
    setVariationStockStatus(varStockStatus);
    // setPoints(meta.find(item => item.key == '_ywpo_preorder_price').value)
    setPoints(varPrice);
    if (varStockStatus == "instock") {
      setAvailable(true);
    } else {
      setAvailable(false);
    }
  };
  const handleAddToCart = (btn) => {
    // if user click on quick buy
    if (btn == "quickBuy") {
      directCheckout(true);
    }
    // check if product is a type of variation
    if (data.type == "variable") {
      // check if variations are available
      if (variations && variations.length > 0) {
        // check if variation is selected
        if (variationDetails.id == "") {
          // alert('Please select a variation')
          createNotification("warning", "Please select a variation");
          return;
        }
        // check if variation is in stock
        if (variationStockStatus == "outofstock") {
          // alert('This variation is out of stock')
          createNotification("error", "This variation is out of stock");
          return;
        }
        // this variation is in stock and can be added to cart
        // setting up object to pass to state
        // calculate discount
        // const discount =
        //   variationDetails.isOnSale &&
        //   variationDetails.sale_price - variationDetails.price > 0
        //     ? variationDetails.sale_price - variationDetails.price
        //     : 0;
        const newItem = {
          product_id: data.id,
          variation_id: variationDetails.id,
          quantity: 1,
          // shipsByDate: "",
          // discount: discount,
          isInStock: true,
          // isFreeShipping: false,
        };
        // add to cart
        addToCart(newItem);
        if (btn == "quickBuy") {
          setTimeout(() => {
            router.push("/checkout");
          }, 1500);
        }
      } else {
        // no variations available for this product so add to cart as a simple product
        // setting up object to pass to state
        // calculate discount
        // const discount =
        //   data.on_sale && data.sale_price - data.price > 0
        //     ? data.sale_price - data.price
        //     : 0;
        const newItem = {
          product_id: data.id,

          quantity: 1,
          // shipsByDate: "",
          // discount: discount,
          isInStock: true,
          // isFreeShipping: false,
        };
        // add to cart
        addToCart(newItem);
        if (btn == "quickBuy") {
          setTimeout(() => {
            router.push("/checkout");
          }, 1500);
        }
      }
    } else {
      // this product is not a type of variation so add to cart as a simple product
      // check if product is in stock
      if (data.stock_status == "instock") {
        // setting up object to pass to state
        // calculate discount
        const discount =
          data.on_sale && data.sale_price - data.price > 0
            ? data.sale_price - data.price
            : 0;
        const newItem = {
          id: data.id,
          title: data.name,
          variation: "",
          variationId: "",
          price: data.price,
          amount: 1,
          shipsByDate: "",
          discount: discount,
          isInCart: true,
          // isInWishlist: false,
          isInStock: true,
          // isFreeShipping: false,
          img: data.images[0].src,
        };
        // add to cart
        addToCart(newItem);
        if (btn == "quickBuy") {
          router.push("/checkout");
        }
      } else {
        // alert('This product is out of stock')
        createNotification("error", "This product is out of stock");
        return;
      }
    }
  };

  // useEffect(() => {
  //     if (data) {
  //         const {attributes, variations} = data
  //         const configrations = attributes.find(attribute => {
  //             return (
  //                 attribute.name == 'Configuration' ||
  //                 attribute.name == 'configuration'
  //             )
  //         })
  //         if (configrations) {
  //             setConfigrationOptions(configrations.options)
  //         }
  //     }
  // }, [id])

  // function to handle add to wishlist

  const findPreOrderStatus = (itemMetaData) => {
    return !!Number(itemMetaData.find((item) => item.key == "preorder").value);
  };

  const findIfWaitlistEnabled = (itemMetaData) => {
    return itemMetaData.find((item) => item.key == "wcwl_options").value;
  };
  const findPreOrderShipsByDate = (itemMetaData) => {
    // console.log({ itemMetaData })
    if (!itemMetaData.find((item) => item.key == "_ywpo_for_sale_date")) return;
    return Number(
      itemMetaData.find((item) => item.key == "_ywpo_for_sale_date").value
    );
  };

  const handleFavourite = () => {
    setFavorite(!favorite);
    addProductToWishlist(id, data, !favorite);
  };
  return data ? (
    <div>
      {showFloatingMenu && (
        <FloatingProductMenu
          isAvailable={isAvailable}
          variationStockStatus={variationStockStatus}
          handleAddToCart={handleAddToCart}
          variations={variations}
          variationDetails={variationDetails}
          handleVariationChange={handleVariationChange}
          productId={data.id}
        />
      )}
      <Layout>
        <section className={productStyles.product}>
          <div style={{ width: "100%" }}>
            {findPreOrderStatus(data.meta_data) ? (
              <PreOrderWarningRibbon />
            ) : (
              ""
            )}
            <Row>
              <Col
                xs={12}
                md={6}
                className={productStyles.productImageContainer}
              >
                {/* {
                                        findPreOrderStatus(data.meta_data) ? <PreOrderRibbon /> : ''
                                    } */}
                {data.on_sale ? <SaleRibbon /> : ""}
                {variationStockStatus == "outofstock" ? (
                  <OutOfStockRibbon />
                ) : (
                  ""
                )}
                {data.images && data.images.length > 0 ? (
                  <img
                    src={data.images[0].src}
                    alt={data.name}
                    className={"productImage"}
                    layout="fill"
                  />
                ) : (
                  <img
                    src="/images/products/image-1.png"
                    alt="Image 1"
                    layout="fill"
                    className={"productImage"}
                  />
                )}
              </Col>
              <Col
                xs={12}
                md={6}
                style={{
                  padding: "1rem 1.4rem",
                }}
              >
                <div className={productStyles.productConfigandButtonWrapper}>
                  <Box className={`mt-2 ${productStyles.productInfoContainer}`}>
                    <Box sm={8}>
                      <h2 className={productStyles.productTitle}>
                        {data.name ? data.name : "Product Name"}
                      </h2>
                    </Box>
                    <Col sm={4}></Col>
                  </Box>

                  <div className={productStyles.configurationWrapper}>
                    <div className={`${productStyles.radioContainer}`}>
                      {variations &&
                        variations.length > 0 &&
                        variations.map((variation, index) => {
                          return (
                            <div key={index} className="form-check">
                              <input
                                type="radio"
                                className="form-check-input"
                                name="exampleRadios"
                                id={variation.id}
                                checked={
                                  variationDetails.id
                                    ? variation.id == variationDetails.id
                                    : false
                                }
                                value={variation.id}
                                onChange={() =>
                                  handleVariationChange(
                                    variation.id,
                                    variation.attributes[0].option,
                                    variation.price,
                                    variation.regular_price,
                                    variation.on_sale,
                                    variation.sale_price,
                                    variation.stock_status,
                                    variation.meta_data
                                  )
                                }
                              />
                              <label
                                className="form-check-label"
                                style={{
                                  cursor: "pointer",
                                }}
                                htmlFor={variation.id}
                              >
                                {variation.attributes[0].option}{" "}
                                {
                                  <strike
                                    className={productStyles.strikethroughPrice}
                                  >
                                    {variation.on_sale ? (
                                      <>${variation.regular_price}</>
                                    ) : (
                                      ""
                                    )}
                                  </strike>
                                }
                                {" - $"}
                                {variation.sale_price || variation.price}
                              </label>
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  <div className={productStyles.stockInfoWrapper}>
                    {variationStockStatus !== null &&
                      (variationStockStatus == "outofstock" ? (
                        <>
                          <p className={productStyles.outOfStock}>
                            Out of Stock
                          </p>
                          <WaitlistForm
                            productId={id}
                            variationId={variationDetails.variation}
                          />
                        </>
                      ) : variationDetails.meta &&
                        findPreOrderShipsByDate(variationDetails.meta) ? (
                        <div
                          className={
                            productStyles.preorderShippingDateContainer
                          }
                        >
                          <p className={productStyles.shipsByText}>
                            Ships by:{" "}
                          </p>
                          <p className={productStyles.shipsByDate}>
                            {getReadableDate(
                              findPreOrderShipsByDate(variationDetails.meta)
                            )}
                            {/* {format(new Date(fromUnixTime(findPreOrderShipsByDate(variationDetails.meta))), 'PPP')} */}
                          </p>
                        </div>
                      ) : variationDetails.stock_quantity &&
                        variationDetails.stock_quantity < 5 ? (
                        <p className={productStyles.lowStockText}>
                          {`Only ${variationDetails.stock_quantity} left in stock.`}
                        </p>
                      ) : (
                        <p className={productStyles.shipsBy}>In Stock</p>
                      ))}

                    {points && isAvailable && (
                      <p className={`${productStyles.inStock}`}>
                        Earn {points} Points on purchase!
                      </p>
                    )}
                  </div>
                  {isAvailable ? (
                    <div className={productStyles.buttonsContainer}>
                      <button
                        disabled={
                          variationStockStatus !== null &&
                          variationStockStatus == "outofstock"
                        }
                        className={`${productStyles.buttonStyles} ${productStyles.btnYellow} ${productStyles.buttonStyles}`}
                        onClick={() => handleAddToCart("preorder")}
                      >
                        <ShoppingCartIcon fontSize="small" />
                        Add to Cart
                      </button>
                      <button
                        className={`${productStyles.buttonStyles} ${productStyles.btnOrange}`}
                        onClick={() => handleAddToCart("quickBuy")}
                      >
                        {variationDetails.meta &&
                        variationDetails.meta[18] &&
                        variationDetails.meta[18].value
                          ? "Pre-Order Now"
                          : "Buy Now"}
                      </button>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </Col>
            </Row>
            {/* Row 2 */}
            {data.description && (
              <Row className={productStyles.row2}>
                <Col
                  xs={12}
                  md={6}
                  className={productStyles.descriptionCol}
                  style={{ padding: "20px !important" }}
                >
                  <div className={productStyles.description}>
                    <h3 className="displayNoneAtMobile">Description</h3>
                    <Divider
                      style={{
                        backgroundColor: "#fff",
                      }}
                    />
                    <div
                      className={`${productStyles.descriptionDiv} displayNoneAtDesktop`}
                    >
                      <h4 className="text-decoration-underline">Description</h4>
                    </div>
                    <div
                      className={productStyles.descriptionDiv2}
                      dangerouslySetInnerHTML={{
                        __html: `${data.description}`,
                      }}
                    ></div>
                  </div>
                </Col>
                <Col
                  xs={12}
                  md={6}
                  className={productStyles.productImageContainer}
                >
                  {images && images.description_image && (
                    <img
                      src={images.description_image}
                      alt={data.name}
                      layout="fill"
                      className="productImage"
                    />
                  )}
                </Col>
              </Row>
            )}
            {/* Row 3 */}
            {images && images.specs_image && (
              <Row className={productStyles.row3}>
                <Col
                  xs={12}
                  md={6}
                  className={productStyles.productImageContainer}
                >
                  <img
                    src={images.specs_image}
                    alt={data.name}
                    layout="fill"
                    className="productImage"
                  />
                </Col>
                <Col xs={12} md={6} className={productStyles.specsCol}>
                  {data["meta_data"] &&
                    data["meta_data"].length > 0 &&
                    data["meta_data"].map((item, index) => {
                      if (item.key === "specs") {
                        return (
                          <div
                            key={index}
                            className={productStyles.specsListItem}
                            dangerouslySetInnerHTML={{
                              __html: `${item.value}`,
                            }}
                          ></div>
                        );
                      }
                    })}
                </Col>
              </Row>
            )}
          </div>
          <Container fluid className={productStyles.lastViewed}>
            <h3 className={productStyles.lastViewedHeading}>
              Recently Viewed Products
            </h3>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-evenly",
              }}
            >
              {lastViewedProducts.map(
                (product) =>
                  product !== null && (
                    <div
                      className={contentStyles.lastViewContent}
                      key={product.id}
                    >
                      <div className={contentStyles.product}>
                        <Link href={`/product/${product.id}`}>
                          <a>
                            {product.images && product.images.length > 0 && (
                              <div className={contentStyles.image}>
                                <img
                                  src={product.images[0].src}
                                  width={445}
                                  height={334}
                                  alt={product.name}
                                />
                              </div>
                            )}
                          </a>
                        </Link>
                        <div className={contentStyles.productInfo}>
                          <p className={contentStyles.productTitle}>
                            {product.name}
                          </p>
                          {/* {product.stock_status === 'outofstock' && (
                                                            <PreOrderRibbon />
                                                        )} */}
                          {product.price_html ? (
                            <>
                              {product.stock_status === "outofstock" ? (
                                <s>
                                  <div
                                    className={contentStyles.productPrice}
                                    dangerouslySetInnerHTML={{
                                      __html: product.price_html,
                                    }}
                                  ></div>
                                </s>
                              ) : (
                                <div
                                  className={contentStyles.productPrice}
                                  dangerouslySetInnerHTML={{
                                    __html: product.price_html,
                                  }}
                                ></div>
                              )}
                            </>
                          ) : (
                            <p className={contentStyles.productPrice}>
                              {product.price ? `$${product.price}` : "$0"}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
              )}
            </div>
          </Container>
          <NotificationContainer />
        </section>
      </Layout>
    </div>
  ) : (
    <Preloader />
  );
}

const FloatingProductMenu = ({
  isAvailable,
  variationStockStatus,
  handleAddToCart,
  variations,
  variationDetails,
  handleVariationChange,
  productId,
}) => {
  // For Waitlist Form
  // TODO : Make Waitlist Menu Modular
  const [isOnWaitlist, setIsOnWaitlist] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [joining, setJoining] = useState(false);
  const handleWaitlistEmailChange = (e) => {
    setWaitlistEmail(e.target.value);
  };
  const handleWaitlisSubmit = async (e) => {
    e.preventDefault();
    setJoining(true);
    try {
      const res = await axios.post(`/api/waitlist`, {
        product_id: variationDetails.productId,
        variation_id: variationDetails.variationId,
        email: waitlistEmail,
      });
      // console.log(res.data)
      createNotification(
        "success",
        "You will be notified when product is available."
      );
      setJoining(false);
      setWaitlistEmail("");
    } catch (err) {
      // console.log(err)
      setJoining(false);
      createNotification(
        "error",
        "Something went wrong while joining waitlist!!!"
      );
    }
  };

  const handleDropdownVariationChange = (event) => {
    const variationId = event.currentTarget.value;
    if (variationId) {
      const selectedVariation = variations.find(
        (singleVariation) => singleVariation.id == variationId
      );
      handleVariationChange(
        selectedVariation.id,
        selectedVariation.attributes[0].option,
        selectedVariation.price,
        selectedVariation.regular_price,
        selectedVariation.on_sale,
        selectedVariation.sale_price,
        selectedVariation.stock_status,
        selectedVariation.meta_data
      );
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        zIndex: 100,
        bottom: 0,
        left: 0,
        width: "100%",
        backgroundColor: "#111",
        padding: ".8rem 1rem",
      }}
    >
      <div className={productStyles.floatingMenuWrapper}>
        <select
          defaultValue={variationDetails.id}
          // onChange={handleChange}
          className={productStyles.floatingSelectStyles}
          onChange={handleDropdownVariationChange}
        >
          <option className={productStyles.floatingOptionsStyles} value="">
            Choose an option
          </option>

          {variations &&
            variations.length > 0 &&
            variations.map((variation, index) => {
              return (
                <option
                  className={productStyles.floatingOptionsStyles}
                  key={index}
                  value={variation.id}
                >
                  {variation.attributes[0].option}- ${variation.price}
                  {variation.stock_status === "outofstock"
                    ? "      - (sold out)"
                    : ""}
                </option>
              );
            })}
        </select>
        {variationStockStatus !== null &&
        variationStockStatus == "outofstock" ? (
          <form
            onSubmit={handleWaitlisSubmit}
            className={productStyles.floatingWaitlistFormWrapper}
          >
            <input
              type="email"
              placeholder="Email Address"
              name="email"
              value={waitlistEmail}
              onChange={handleWaitlistEmailChange}
              className={productStyles.floatingWaitlistEmailInput}
              required
            />
            <button
              className={productStyles.joinWaitlistButton}
              type="submit"
              disabled={joining}
            >
              {joining ? "Joining..." : "JOIN WAITLIST"}
            </button>
          </form>
        ) : (
          <div className={productStyles.floatingButtonsContainer}>
            {/* Show Join Waitlist Form if variant is out of stock */}
            <button
              disabled={
                variationDetails.id &&
                !isAvailable &&
                variationStockStatus !== null &&
                variationStockStatus == "outofstock"
              }
              className={`${productStyles.buttonStyles} ${productStyles.btnYellow}`}
              onClick={() => handleAddToCart("preorder")}
            >
              {variationDetails.id &&
              !isAvailable &&
              variationStockStatus !== null &&
              variationStockStatus == "outofstock" ? (
                "Out of Stock"
              ) : (
                <>
                  <ShoppingCartIcon fontSize="small" />
                  <>Add to cart</>
                </>
              )}
            </button>
            <button
              className={`${productStyles.buttonStyles} ${productStyles.btnOrange}`}
              disabled={
                variationDetails.id &&
                !isAvailable &&
                variationStockStatus !== null &&
                variationStockStatus == "outofstock"
              }
              onClick={() => handleAddToCart("quickBuy")}
            >
              {variationDetails.id &&
              !isAvailable &&
              variationStockStatus !== null &&
              variationStockStatus == "outofstock"
                ? "Please Join Waitlist"
                : "Buy Now"}
            </button>
          </div>
        )}
      </div>
    </Box>
  );
};

const WaitlistForm = ({ productId, variationId }) => {
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [joining, setJoining] = useState(false);
  const [errorInJoiningWaitlist, setErrorInJoiningWaitlist] = useState(false);
  const [successInJoiningWaitlist, setSuccessInJoiningWaitlist] =
    useState(false);
  const handleWaitlistEmailChange = (e) => {
    setWaitlistEmail(e.target.value);
  };
  const handleWaitlisSubmit = async (e) => {
    e.preventDefault();
    setJoining(true);
    setSuccessInJoiningWaitlist(false);
    setErrorInJoiningWaitlist(false);
    try {
      const res = await axios.post(`/api/waitlist`, {
        product_id: productId,
        variation_id: variationId,
        email: waitlistEmail,
      });
      // console.log(res.data)
      setSuccessInJoiningWaitlist(true);
      setErrorInJoiningWaitlist(false);
      setJoining(false);
      setWaitlistEmail("");
    } catch (err) {
      // console.log(err)
      setErrorInJoiningWaitlist(true);
      setSuccessInJoiningWaitlist(false);
      setJoining(false);
    }
  };

  return (
    <>
      <Form onSubmit={handleWaitlisSubmit} className="mb-3">
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>
            <span>
              Join the waitlist to be emailed when this product becomes
              available
            </span>
          </Form.Label>
          <div className={productStyles.waitlistFormWrapper}>
            <Form.Control
              className={productStyles.waitlistEmailField}
              type="email"
              placeholder="Email Address"
              name="email"
              value={waitlistEmail}
              onChange={handleWaitlistEmailChange}
              size="lg"
              required
            />
            <Button
              size="lg"
              variant="danger"
              type="submit"
              // className='w-100'
              disabled={joining}
            >
              {joining ? "Processing..." : "JOIN WAITLIST"}
            </Button>
          </div>
          <Form.Text className="text-muted">
            {`We'll never share your email with anyone else.`}
          </Form.Text>
        </Form.Group>

        {errorInJoiningWaitlist && (
          <div className="text-danger mt-3">
            <p>
              There was an error in joining the waitlist. Please try again
              later.
            </p>
          </div>
        )}
        {successInJoiningWaitlist && (
          <div className="text-success mt-3">
            <p>
              You have successfully joined the waitlist. You will be emailed
              when this product is available.
            </p>
          </div>
        )}
      </Form>
    </>
  );
};

export const getServerSideProps = async ({ query }) => {
  let data = null;
  let variations = null;
  let images = null;
  try {
    const product = await axios.get(
      `${WP_URL}/wp-json/wc/v3/products/${query.id}?consumer_key=${process.env.WP_CONSUMER_KEY}&consumer_secret=${process.env.WP_CONSUMER_SECRET}`
    );
    // const product = await axios.get(
    //     `https://jsonplaceholder.typicode.com/todos/${query.id}`
    // )
    data = await product.data;
  } catch (error) {
    // console.log('error', error)
  }
  try {
    const productVariations = await axios.get(
      `${WP_URL}/wp-json/wc/v3/products/${query.id}/variations?consumer_key=${process.env.WP_CONSUMER_KEY}&consumer_secret=${process.env.WP_CONSUMER_SECRET}&order=asc&orderby=id&status=publish`
    );
    // const product = await axios.get(
    //     `https://jsonplaceholder.typicode.com/todos/${query.id}`
    // )
    variations = await productVariations.data;
  } catch (error) {
    // console.log('error', error)
  }
  try {
    const productImages = await axios.get(
      `${WP_URL}/wp-json/wp/v2/productImg?product_id=${query.id}`
    );
    // const product = await axios.get(
    //     `https://jsonplaceholder.typicode.com/todos/${query.id}`
    // )
    images = await productImages.data;
  } catch (error) {
    // console.log('error', error)
  }

  return {
    props: {
      id: query.id,
      data,
      variations,
      images,
    },
  };
};

export default Product;
