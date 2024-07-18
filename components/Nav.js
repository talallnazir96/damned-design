/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import navStyles from "../styles/Nav.module.css";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { useGlobalContext } from "../contextAPI/context";
import PersonIcon from "@material-ui/icons/Person";
import { useDetectClickOutside } from "react-detect-click-outside";
import { getCartSubtotal, getItemPrice } from "../functions/cocart";
import {
  Delete,
  DeleteForeverOutlined,
  DeleteForeverRounded,
  DeleteOutline,
} from "@material-ui/icons";
import {
  decodeJWTToken,
  getAuthTokenFromCookie,
  logout,
} from "../functions/general";
import Preloader from "./Preloader";
import { accessCookie } from "../functions/utils";
import { useRouter } from "next/router";

const Nav = () => {
  const { cart, authToken, isCartUpdating, getCartSubtotal } =
    useGlobalContext();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearchPopup, setShowSearchPopup] = useState(false);
  const [hasCardUpdated, setHasCardUpdated] = useState(false);
  const router = useRouter();
  const quantity = cart && cart.item_count;
  let authTokenFromLocal = getAuthTokenFromCookie();
  const userPayload = decodeJWTToken(authTokenFromLocal);
  // let userLoggedIn = accessCookie("mrAuthToken") ? true : false;
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 992) {
        setShowMobileMenu(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    let nav = document.querySelector(`.${navStyles.nav}`);
    const handleScrollForNav = () => {
      if (window.scrollY > 50) {
        nav.classList.add(navStyles.navScrolled);
      } else {
        nav.classList.remove(navStyles.navScrolled);
      }
    };
    window.addEventListener("scroll", handleScrollForNav);
    return () => {
      window.removeEventListener("scroll", handleScrollForNav);
    };
  }, []);

  const handleSearchPopup = () => {
    setShowSearchPopup(!showSearchPopup);
  };
  useEffect(() => {
    if (isCartUpdating) {
      setHasCardUpdated(true);
    }
  }, [isCartUpdating]);
  const [myCart, updateMyCart] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  useEffect(() => {
    if (localStorage.getItem("cart")) {
      updateMyCart(JSON.parse(localStorage.getItem("cart")));
    }
    setUserDetails(JSON.parse(localStorage.getItem("user")));
  }, [cart]);

  return (
    <nav className={`${navStyles.nav}`}>
      {/* Adding 3 columns */}
      <Container style={{ maxWidth: "1500px" }}>
        <Row>
          <Col className={navStyles.leftCol}>
            <div className={navStyles.shop}>
              <li className={navStyles.navLink}>Shop</li>

              <ul className={navStyles.shopDropdown}>
                <li>
                  <Link href="/knives">
                    <a className={navStyles.navLink}>Knives</a>
                  </Link>
                </li>
                <li>
                  <Link href="/edc">
                    <a className={navStyles.navLink}>EDC</a>
                  </Link>
                </li>
                <li>
                  <Link href="/fidget">
                    <a className={navStyles.navLink}>Fidget</a>
                  </Link>
                </li>
                <li>
                  <Link href="/shop">
                    <a className={navStyles.navLink}>All products</a>
                  </Link>
                </li>
              </ul>
            </div>

            <form action="/search" className={navStyles.searchWrapper}>
              <input
                type="text"
                name="s"
                placeholder="Search products"
                required
              />
              <img
                className={navStyles.searchIcon}
                src="/images/search-icon.png"
                alt=""
              />
            </form>
          </Col>
          <Col className={navStyles.middleCol}>
            <Link href="/">
              <a className={navStyles.logoImg}>
                <img src="/logo.svg" alt="logo" height={75} width={75} />
              </a>
            </Link>
          </Col>
          <Col className={navStyles.rightCol}>
            <div className={navStyles.account}>
              <li className={navStyles.displayNoneAtMobile}>
                <UserIcon />
              </li>

              <ul className={navStyles.accountDropdown}>
                <li>
                  <Link href="/dashboard">
                    <a className={navStyles.navLink}>Dashboard</a>
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/orders">
                    <a className={navStyles.navLink}>Orders</a>
                  </Link>
                </li>
                {userDetails?.ID ? (
                  <li>
                    <Link href="/login">
                      <a
                        onClick={() => {
                          logout();
                        }}
                        className={navStyles.navLink}
                      >
                        Logout
                      </a>
                    </Link>
                  </li>
                ) : (
                  <li>
                    <Link href="/login">
                      <a className={navStyles.navLink}>Login</a>
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            <div
              className={`${navStyles.displayNoneAtDesktop} mr1`}
              onClick={handleSearchPopup}
            >
              <li>
                <img src="/images/mobile-search-icon.png" alt="Search" />
              </li>
            </div>
            <div className={navStyles.infoWrapper}>
              <li
                className={`${navStyles.navLink} ${navStyles.displayNoneAtMobile}`}
              >
                Info
              </li>
              <InfoDropDown />
            </div>
            <div className={navStyles.cart}>
              <li className={navStyles.navLink}>
                <div className="position-relative">
                  <CartIcon
                    className={hasCardUpdated && navStyles.cartIconPulse}
                    style={{ stroke: quantity > 0 ? "#e28700" : "#fff" }}
                  />
                  {myCart?.length > 0 && (
                    <span
                      style={{
                        fontSize: "10px",
                      }}
                      className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                    >
                      {myCart.length}
                    </span>
                  )}
                </div>

                {quantity > 0 && (
                  <span
                    className={`${hasCardUpdated && navStyles.cartIconPulse} ${
                      navStyles.quantity
                    }`}
                  >
                    {quantity}
                  </span>
                )}
              </li>
              <MiniCart />
            </div>
            <button
              className={`${navStyles.displayNoneAtDesktop} eventBtn`}
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <img
                src="/images/hambor.png"
                alt="Menu"
                className={navStyles.hamborIcon}
              />
            </button>
          </Col>
        </Row>
      </Container>
      {showMobileMenu && (
        <MobileMenu
          showMobileMenu={showMobileMenu}
          setShowMobileMenu={setShowMobileMenu}
        />
      )}
      {showSearchPopup && <MobileSearchPopup />}
    </nav>
  );
};
// Mobile Menu
const MobileMenu = ({ showMobileMenu, setShowMobileMenu }) => {
  const { authToken } = useGlobalContext();
  return (
    <div className={navStyles.mobileMenu}>
      <Row>
        <Col
          xs={6}
          className="d-flex align-items-center justify-content-flex-start"
        >
          <Link href="/">
            <a>
              <img
                src="/images/logo.png"
                alt="logo"
                className={navStyles.mobileLogo}
              />
            </a>
          </Link>
        </Col>
        <Col xs={6} className="d-flex align-items-center justify-content-end">
          <button
            className="eventBtn"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <img src="/images/close-icon.png" alt="close" />
          </button>
        </Col>
      </Row>
      <Row className="d-flex flex-column align-items-center justify-content-center">
        <Col sm={12} className={navStyles.mobileMenuSubCol}>
          <li>
            <Link href="/shop">
              <a className={navStyles.navLink}>SHOP</a>
            </Link>
          </li>
          <li>
            <hr id={navStyles.shopHr} />
          </li>
          <li>
            <Link href="/knives">
              <a>knives</a>
            </Link>
          </li>
          <li>
            <Link href="/edc">
              <a>EDC</a>
            </Link>
          </li>
          <li>
            <Link href="/fidget">
              <a>Fidget</a>
            </Link>
          </li>
        </Col>
        <Col sm={12} className={navStyles.mobileMenuSubCol}>
          <li style={{ marginTop: "20px" }}>
            {/* <Link href='/info'> */}
            <p className={navStyles.navLink}>INFO</p>
            {/* </Link> */}
          </li>
          <li>
            <hr id={navStyles.infoHr} />
          </li>
          <li>
            <Link href="/contact">
              <a>Contact us</a>
            </Link>
          </li>
          <li>
            <Link href="/shipping-information">
              <a>Ship info/track order</a>
            </Link>
          </li>
        </Col>
        <Col sm={12} className={navStyles.mobileMenuSubCol}>
          <li style={{ marginTop: "20px" }}>
            <Link href={`${authToken ? "/dashboard" : "/login"}`}>
              <a className={navStyles.navLink}>
                {authToken ? (
                  <div className="d-flex align-items-center justify-content-center">
                    <PersonIcon />
                    <span style={{ marginLeft: "5px" }}>My Account</span>
                  </div>
                ) : (
                  "LOGIN"
                )}
              </a>
            </Link>
          </li>
          <li>
            <hr id={navStyles.loginHr} />
          </li>
        </Col>
      </Row>
    </div>
  );
};

const MiniCart = () => {
  const {
    cart,
    removeItem,
    isCartUpdating,
    getCartSubtotal,
    removeFromCart,
    loader,
  } = useGlobalContext();
  const [myCart, updateMyCart] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("cart")) {
      updateMyCart(JSON.parse(localStorage.getItem("cart")));
    } else {
      localStorage.setItem("cart", []);
    }
  }, [cart]);

  return (
    <div className={navStyles.cartDropdown}>
      {isCartUpdating && (
        // <div className={navStyles.cartLoadingOverlay}>
        //   <Spinner animation="grow" role="status" aria-label="reloading cart" />
        // </div>

        <Preloader innerComponent />
      )}
      <div
        className={navStyles.cartDropdownBody}
        style={{
          overflow: "auto",
          maxHeight: "80vh",
        }}
      >
        <>
          {myCart && myCart.length > 0
            ? myCart.map((item, itemIdx) => {
                return (
                  <div key={item.item_key} className={navStyles.cartItem}>
                    <div className={navStyles.cartDropdownBodyItem}>
                      <img
                        src={item.img}
                        alt={item.title}
                        width={111}
                        height={70}
                      />
                    </div>
                    <div className={navStyles.cartInfoRight}>
                      <div className={navStyles.cartDropdownBodyItemInfo}>
                        <div style={{ marginTop: "-5px", width: "150px" }}>
                          <span>
                            <span
                              className={navStyles.cartDropdownBodyItemInfoName}
                            >
                              {item.productName}
                              <small>{` (${item.variation})`}</small>
                            </span>
                          </span>
                        </div>
                        <div>
                          <div
                            className={navStyles.cartDropdownBodyItemQuantity}
                          >
                            <span>{item.quantity}</span>
                            <span> x </span>
                            <span
                              className={
                                navStyles.cartDropdownBodyItemInfoPrice
                              }
                            >
                              {/* ${getItemPrice(item, cart)} */}
                              {item.price}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className={navStyles.cartDropdownBodyItemInfo}>
                        <div className={navStyles.cartDropdownBodyItemInfoLeft}>
                          <li
                            className={navStyles.cartDropdownBodyItemInfoName2}
                          >
                            {item.meta?.variation && (
                              <span>
                                <span
                                  className={
                                    navStyles.cartDropdownBodyItemInfoName2
                                  }
                                >
                                  {/* {item.meta.variation.Configuration ||
                                  item.meta.variation.Type ||
                                  item.meta.variation.Metal} */}
                                  {item.variation}
                                </span>
                              </span>
                            )}
                          </li>
                          <li
                            onClick={() => {
                              removeFromCart(
                                item.img,
                                item.orderType !== "" ? item.orderType : "",
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
                            style={{ color: "red", cursor: "pointer" }}
                          >
                            <DeleteForeverRounded fontSize="small" />
                          </li>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            : "No items in cart"}
        </>
      </div>
      <div className={navStyles.cartDropdownFooter}>
        <div className={navStyles.cartDropdownFooterTop}>
          <span>Subtotal (excl shipping): </span>
          <span>${myCart?.length > 0 ? getCartSubtotal(myCart) : 0}</span>
        </div>
        <div className={navStyles.cartDropdownFooterBottom}>
          <Link href="/checkout">
            <li className={navStyles.checkout}>
              <a>Checkout</a>
            </li>
          </Link>
        </div>
      </div>
    </div>
  );
};
// Mobile Search Popup
const MobileSearchPopup = () => {
  return (
    <div className={navStyles.mobileSearchPopup}>
      <form action="/search" className={navStyles.searchWrapper}>
        <input type="text" name="s" placeholder="Search products" required />
        <img
          className={navStyles.searchIcon}
          src="/images/search-icon.png"
          alt=""
        />
      </form>
    </div>
  );
};
// Info dropdown
const InfoDropDown = () => {
  return (
    <div className={navStyles.infoDropDownWrapper}>
      <li>
        <Link href="/contact">
          <a>Contact</a>
        </Link>
      </li>
      <li>
        <Link href="/shipping-information">
          <a>Ship Info/ Track Order</a>
        </Link>
      </li>
    </div>
  );
};

const CartIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="feather feather-shopping-cart"
    {...props}
  >
    <circle cx={9} cy={21} r={1} />
    <circle cx={20} cy={21} r={1} />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const UserIcon = (props) => (
  // <svg
  //   xmlns="http://www.w3.org/2000/svg"
  //   fill="none"
  //   viewBox="0 0 24 24"
  //   strokeWidth={1.5}
  //   stroke="#fff"
  //   className={navStyles.userIcon}
  // >
  //   <path
  //     strokeLinecap="round"
  //     strokeLinejoin="round"
  //     d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
  //   />
  // </svg>
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth={0}
    viewBox="0 0 1024 1024"
    className={navStyles.userIcon}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M858.5 763.6a374 374 0 0 0-80.6-119.5 375.63 375.63 0 0 0-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-.4.2-.8.3-1.2.5-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 0 0-80.6 119.5A371.7 371.7 0 0 0 136 901.8a8 8 0 0 0 8 8.2h60c4.4 0 7.9-3.5 8-7.8 2-77.2 33-149.5 87.8-204.3 56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c.1 4.4 3.6 7.8 8 7.8h60a8 8 0 0 0 8-8.2c-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z" />
  </svg>
);

export default Nav;
