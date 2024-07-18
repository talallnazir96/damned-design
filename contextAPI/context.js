import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { initialState, reducer } from "./reducer";
import axios from "axios";
import jwt from "jsonwebtoken";
import {
  CLEAR_CART,
  REMOVE_ITEM,
  TOGGLE_AMOUNT,
  GET_TOTALS,
  DIRECT_CHECKOUT,
  ADD_TO_CART,
  SET_IS_CART_UPDATING,
  SET_CART,
  SET_CART_KEY,
  APPLY_POINTS,
} from "./types/cartTypes";
import { SET_CURRENT_USER, AUTH_TOKEN } from "./types/authTypes";
import {
  addProductToLocalStorage,
  removeProductFromLocalStorage,
  increaseProductAmountInLocalStorage,
  decreaseProductAmountInLocalStorage,
  clearCartFromLocalStorage,
  getCartKeyFromLocalStorage,
  setCartKeyToLocalStorage,
  getCartHashFromLocalStorage,
  setCartHashToLocalStorage,
  getProductsFromLocalStorage,
} from "../functions/localStorage";
import {
  getAuthTokenFromLocalStorage,
  logout,
  getUserFromLocalStorage,
  decodeJWTToken,
  getAuthTokenFromCookie,
} from "../functions/general";
import { getCartItemData } from "../functions/cart-utils";
// import CoCartAPI from "@cocart/cocart-rest-api";
import { createNotification } from "../functions/utils";
import { WP_URL } from "../utils/config";
import { useRouter } from "next/router";
import { Spinner } from "react-bootstrap";

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [authIsLoading, setAuthIsLoading] = useState(true);
  // const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const router = useRouter();
  // useEffect(() => {
  //   if (localStorage.getItem("cart")) {
  //     setCart(localStorage.getItem("cart"));
  //   } else {
  //     debugger
  //     localStorage.setItem("cart", []);
  //     // setCart(localStorage.setItem("cart"));
  //   }
  // }, []);
  const clearCart = async () => {
    let cart;
    if (localStorage.getItem("cart")) {
       cart = JSON.parse(localStorage.getItem("cart"));
    }
    const endpoint = `${WP_URL}/wp-json/wp/v2/empty_cart`;

    const finalData = cart?.map((elem) => ({
      product_id: elem.variationId,
      quantity: elem.quantity,
    }));

    const response = await axios.post(endpoint, finalData);

    if ((await response.data.type) === "success") {
      localStorage.setItem("cart", []);
      setCart([]);
      // window.location.reload();
    }
  };
  const addToCart = async (
    img,
    orderType,
    shippingDate,
    remainingStock,
    variationId,
    productName,
    quantity,
    price,
    variation,
    points
  ) => {
    const obj = {
      img: img,
      shippingDate: shippingDate,
      orderType: orderType,
      remainingStock: remainingStock,
      variationId: variationId,
      productName: productName,
      quantity: quantity,
      price: price,
      variation: variation,
      points: points,
    };
    let cart;
    console.log("mmm", obj);
    if (localStorage.getItem("cart")) {
      cart = JSON.parse(localStorage.getItem("cart"));
    } else {
      localStorage.setItem("cart", []);
      cart = [];
    }
    const endpoint = `${WP_URL}/wp-json/wp/v2/decrease_stock`;
    try {
      const isExist = cart.filter(
        (item) =>
          item.variationId === obj.variationId &&
          item.variation === obj.variation
      );
      if (isExist.length > 0) {
        const index = cart.findIndex((obj) => {
          return obj.variationId === isExist[0].variationId;
        });
        if (index !== -1) {
          cart[index].quantity = isExist[0].quantity + 1;
          if (orderType !== "pre-order") {
            const response = await axios.post(endpoint, {
              product_id: parseInt(isExist[0].variationId),
              quantity: 1,
            });
            if ((await response.data.type) === "success") {
              localStorage.setItem("cart", JSON.stringify(cart));
              createNotification("success", "item is added to cart");
            } else {
              createNotification(
                await response.data.type,
                await response.data.message
              );
            }
          }

          if (orderType === "pre-order") {
            // cart.push(obj);
            localStorage.setItem("cart", JSON.stringify(cart));
            createNotification("success", "item is added to cart");
          }
        }
        setCart(cart);
        localStorage.setItem("cartExpireTime", Date.now() + 9000000);
      } else {
        if (orderType !== "pre-order") {
          const response = await axios.post(endpoint, {
            product_id: parseInt(obj.variationId),
            quantity: 1,
          });

          if ((await response.data.type) === "success") {
            cart.push(obj);
            localStorage.setItem("cart", JSON.stringify(cart));
            createNotification("success", "Item is added to cart");
          } else {
            createNotification(
              await response.data.type,
              await response.data.message
            );
          }
        }
        if (orderType === "pre-order") {
          cart.push(obj);
          localStorage.setItem("cart", JSON.stringify(cart));
          createNotification("success", "Item is added to cart");
        }
        setCart(cart);
        localStorage.setItem("cartExpireTime", Date.now() +9000000);
      }
    } catch (error) {
      createNotification("error", `Issues occurred in ${error.message}`);
    }
  };
  const removeFromCart = async (
    img,
    orderType,
    shippingDate,
    remainingStock,
    variationId,
    productName,
    quantity,
    price,
    variation,
    points
  ) => {
    loader(true);
    const cart = JSON.parse(localStorage.getItem("cart"));
    const cartItem = {
      img: img,
      shippingDate: shippingDate,
      orderType: orderType,
      remainingStock: remainingStock,
      variationId: variationId,
      productName: productName,
      quantity: quantity,
      price: price,
      variation: variation,
      points: points,
    };
    // const cartItem = { id: 2, qty: 1, name: "jawad", price: 200 };
    const endpoint = `${WP_URL}/wp-json/wp/v2/increase_stock`;
    try {
      const isExist = cart.filter(
        (item) =>
          item.variationId == cartItem.variationId &&
          item.variation == cartItem.variation
      );
      if (isExist.length > 0) {
        const findItem = cart.findIndex((cartItem) => {
          return cartItem.variationId === isExist[0].variationId;
        });
        if (cart[findItem].quantity > 1) {
          if (orderType !== "pre-order") {
            const response = await axios.post(endpoint, {
              product_id: parseInt(cart[findItem].variationId),
              quantity: 1,
            });
            if ((await response.data.type) === "success") {
              cart[findItem].quantity = isExist[0].quantity - 1;
              localStorage.setItem("cart", JSON.stringify(cart));
              createNotification(
                "success",
                "item quantity is decreased from cart"
              );
            } else {
              createNotification(
                await response.data.type,
                await response.data.message
              );
            }
          }

          if (orderType === "pre-order" && remainingStock == 0) {
            cart[findItem].quantity = isExist[0].quantity - 1;
            localStorage.setItem("cart", JSON.stringify(cart));
            createNotification(
              "success",
              "item quantity is decreased from cart"
            );
          }
        } else {
          if (cart[findItem].quantity === 1) {
            // only splice array when item is found
            if (orderType !== "pre-order") {
              const response = await axios.post(endpoint, {
                product_id: parseInt(cart[findItem].variationId),
                quantity: 1,
              });
              if ((await response.data.type) === "success") {
                cart.splice(cart[findItem], 1); // 2nd parameter means remove one item only
                localStorage.setItem("cart", JSON.stringify(cart));
                createNotification("success", "item is removed from cart");
              } else {
                createNotification(
                  await response.data.type,
                  await response.data.message
                );
              }
            }
            if (orderType === "pre-order" && remainingStock == 0) {
              cart.splice(cart[findItem], 1); // 2nd parameter means remove one item only
              localStorage.setItem("cart", JSON.stringify(cart));
              createNotification("success", "item is removed from cart");
            }
          }
        }
        setCart(cart);
        localStorage.setItem("cartExpireTime", Date.now() + 9000000);
        loader(false);
      }
    } catch (error) {
      createNotification("error", `issues occurred in ${error.message}`);
    }
  };

  const getCartSubtotal = (cart) => {
    let subPrice = 0;
    cart?.map((item) => (subPrice += item.quantity * item.price));

    return subPrice;
  };

  const axiosConfig = useMemo(() => {
    if (!state.authToken) {
      return {};
    }
    return {
      headers: {
        Authorization: `Bearer ${state.authToken}`,
      },
    };
  }, [state.authToken]);
  // const CoCart = useMemo(
  //   () =>
  //     new CoCartAPI({
  //       url: WP_URL,
  //       axiosConfig,
  //     }),
  //   [state.authToken]
  // );
  // Authendication
  const setAuthInContext = (userData) => {
    // getting mrAuthToken form Cookie and then assiging it to "authTokenFromLocal" variable
    // we can also get 'auth-token' from localStorage but for now we are using Cookie for sessions expires feature
    let authTokenFromLocal = getAuthTokenFromCookie();
    let userFromLocal = getUserFromLocalStorage();
    if (userFromLocal == null) {
      userFromLocal = userData ? userData : null;
    }
    const userPayload = decodeJWTToken(authTokenFromLocal);
    let userId = userPayload ? userPayload.data.user.id : null;
    dispatch({ type: AUTH_TOKEN, payload: authTokenFromLocal });
    let userObj = {
      id: userId,
      ...userFromLocal,
    };
    dispatch({
      type: SET_CURRENT_USER,
      payload: userObj.id ? userObj : null,
    });
    setAuthIsLoading(false);
  };

  const logoutUser = () => {
    logout();
    router.push("/login");
  };

  // Add cart key to query is no currentUser
  const getCartKeyParam = (key = "") => {
    if (state.currentUser) return "";
    const cart_key = state.cart_key || getCartKeyFromLocalStorage() || key;
    return cart_key ? `cart_key=${cart_key}` : "";
  };

  // const setCartInContext = useCallback(async () => {
  //   if (authIsLoading) return;

  //   try {
  //     const res = await CoCart.get(`cart?${getCartKeyParam()}`);
  //     const cart = res.data;
  //     console.log("Updating Cart Context", cart);
  //     dispatch({ type: SET_CART, payload: cart });

  //     const cart_key = cart.cart_key;
  //     setCartKeyToLocalStorage(cart_key);
  //     setCartHashToLocalStorage(cart.cart_hash);
  //     dispatch({ type: SET_CART_KEY, payload: cart_key });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }, [CoCart, authIsLoading]);

  // Cart actions starts here
  // const addToCart = async (item) => {
  //   dispatch({ type: SET_IS_CART_UPDATING, payload: true });
  //   // Store in local storage if not authenticated
  //   const itemData = {
  //     ...item,
  //     id: String(item.id),
  //   };
  //   // try {
  //   //   const res = await axios.post(
  //   //     `${WP_URL}/wp-json/cocart/v2/cart/add-item?id=34604&${getCartKeyParam()}`,
  //   //     itemData,
  //   //     axiosConfig
  //   //   );
  //   //   let cart_hash = getCartHashFromLocalStorage();
  //   //   if (!cart_hash) {
  //   //     cart_hash = res.data.cart_hash;
  //   //     setCartHashToLocalStorage(cart_hash);
  //   //   }
  //   //   const cart_key = getCartKeyParam(res.data.cart_key);
  //   //   const cartRes = await CoCart.get(
  //   //     `cart?${cart_key}&&cart_hash=${cart_hash}`
  //   //   );
  //   //   dispatch({ type: SET_CART, payload: cartRes.data });
  //   // } catch (error) {
  //   //   console.log(error);
  //   //   // Invalid request, for 4xx and 5xx statuses
  //   //   console.log("Response Status:", error.response.status);
  //   //   console.log("Response Headers:", error.response.headers);
  //   //   console.log("Response Data:", error.response.data);
  //   // } finally {
  //   //   dispatch({ type: SET_IS_CART_UPDATING, payload: false });
  //   // }
  // };
  // const clearCart = () => {
  //   dispatch({ type: CLEAR_CART });
  // };
  // const removeItem = async (item_key) => {
  //   // Store in local storage if not authenticated
  //   setIsCardUpdating(true);
  //   // try {
  //   //   const res = await CoCart.delete(
  //   //     `cart/item/${item_key}?${getCartKeyParam()}`
  //   //   );
  //   //   console.log("responseinto");
  //   //   const cartRes = await CoCart.get(`cart?${getCartKeyParam()}`);
  //   //   console.log(cartRes, "responseinto");
  //   //   dispatch({ type: SET_CART, payload: cartRes.data });
  //   // } catch (error) {
  //   //   console.log(error);
  //   //   // Invalid request, for 4xx and 5xx statuses
  //   //   console.log("Response Status:", error.response.status);
  //   //   console.log("Response Headers:", error.response.headers);
  //   //   console.log("Response Data:", error.response.data);
  //   // }
  //   setIsCardUpdating(false);
  // };
  const updateItemQuantity = async (item_key, quantity) => {
    console.log("Updating item...", item_key, quantity);
    // Store in local storage if not authenticated
    setIsCardUpdating(true);
    // try {
    //   const res = await axios.post(
    //     `${WP_URL}/wp-json/cocart/v2/cart/item/${item_key}?${getCartKeyParam()}`,
    //     { quantity: quantity, refresh_totals: true },
    //     axiosConfig
    //   );
    //   const cartRes = await CoCart.get(`cart?${getCartKeyParam()}`);
    //   console.log(cartRes, "cartResponse");

    //   dispatch({ type: SET_CART, payload: res.data });
    //   console.log("cartResponse");
    // } catch (error) {
    //   console.log(error, "error");
    //   // Invalid request, for 4xx and 5xx statuses
    //   console.log("Response Status:", error.response.status);
    //   console.log("Response Headers:", error.response.headers);
    //   console.log("Response Data:", error.response.data);
    // }
    setIsCardUpdating(false);
  };

  const applyCoupon = async (coupon) => {
    setIsCardUpdating(true);
    // try {
    //   const res = await axios.post(
    //     `${WP_URL}/wp-json/cocart/v1/coupon?${getCartKeyParam(state)}`,
    //     { coupon },
    //     axiosConfig
    //   );
    //   createNotification(res.data.message);

    //   const cartRes = await CoCart.get(`cart?${getCartKeyParam()}`);
    //   console.log(cartRes, "coupoun");
    //   dispatch({ type: SET_CART, payload: cartRes.data });
    // } catch (error) {
    //   console.log("Response Status:", error.response.status);
    //   console.log("Response Headers:", error.response.headers);
    //   console.log("Response Data:", error.response.data);
    // } finally {
    //   setIsCardUpdating(false);
    // }
  };

  const removeCoupon = async (coupon) => {
    setIsCardUpdating(true);
    // try {
    //   const res = await axios.delete(
    //     `${WP_URL}/wp-json/cocart/v1/coupon?${getCartKeyParam(state)}`,
    //     { data: { coupon }, ...axiosConfig }
    //   );
    //   createNotification(res.data.message);

    //   const cartRes = await CoCart.get(`cart?${getCartKeyParam()}`);
    //   dispatch({ type: SET_CART, payload: cartRes.data });
    // } catch (error) {
    //   console.log("Response Status:", error.response.status);
    //   console.log("Response Headers:", error.response.headers);
    //   console.log("Response Data:", error.response.data);
    // } finally {
    //   setIsCardUpdating(false);
    // }
  };

  const applyPoints = async (point) => {
    setIsCardUpdating(true);
    console.log(point, "into context");
    let authTokenFromLocal = getAuthTokenFromCookie();
    const userPayload = decodeJWTToken(authTokenFromLocal);
    let userId = userPayload ? userPayload.data.user.id : null;
    try {
      const res = await axios.post(
        `https://www.damnedventures.com/custom_api.php`,
        {
          action: "updatepoints",
          user_id: userId,
          points: point,
        }
      );
      createNotification(res.data.message);

      const cartRes = await axios.post(
        "https://www.damnedventures.com/custom_api.php",
        {
          action: "getpoints",
          user_id: userId,
        }
      );
      console.log(cartRes, "ffffffff");
      dispatch({ type: APPLY_POINTS, payload: cartRes.data });
    } catch (error) {
      console.log("Response Status:", error?.response?.status);
      console.log("Response Headers:", error?.response?.headers);
      console.log("Response Data:", error?.response?.data);
    } finally {
      setIsCardUpdating(false);
    }
  };

  const removePoints = async (point) => {
    setIsCardUpdating(true);
    let authTokenFromLocal = getAuthTokenFromCookie();
    const userPayload = decodeJWTToken(authTokenFromLocal);
    let userId = userPayload ? userPayload.data.user.id : null;
    try {
      const res = await axios.post(
        `https://www.damnedventures.com/custom_api.php`,
        {
          action: "deletepoints",
          user_id: userId,
        }
      );
      // createNotification(res.data.message);

      // const cartRes = await CoCart.get(`cart?${getCartKeyParam()}`);
      // dispatch({ type: SET_CART, payload: cartRes.data });
      return res;
    } catch (error) {
      console.log("Response Status:", error);
    } finally {
      setIsCardUpdating(false);
    }
  };

  const setIsCardUpdating = (isCardUpdating) => {
    dispatch({ type: SET_IS_CART_UPDATING, payload: isCardUpdating });
  };

  const applyCountryRegion = async (country, region = "") => {
    setIsCardUpdating(true);

    // try {
    //   await axios.post(
    //     `${WP_URL}/wp-json/cocart/v1/calculate/shipping?${getCartKeyParam()}`,
    //     { country, state: region, return_methods: true },
    //     axiosConfig
    //   );
    //   await setCartInContext();
    // } catch (error) {
    //   console.log("Response Status:", error.response.status);
    //   console.log("Response Headers:", error.response.headers);
    //   console.log("Response Data:", error.response.data);
    // } finally {
    //   setIsCardUpdating(false);
    // }
  };

  const applyShippingMethod = async (method_key) => {
    setIsCardUpdating(true);
    // try {
    //   await axios.post(
    //     `${WP_URL}/wp-json/cocart/v1/shipping-methods?${getCartKeyParam()}`,
    //     { key: method_key },
    //     axiosConfig
    //   );
    //   await setCartInContext();
    // } catch (error) {
    //   console.log("Response Status:", error.response.status);
    //   console.log("Response Headers:", error.response.headers);
    //   console.log("Response Data:", error.response.data);
    // } finally {
    //   setIsCardUpdating(false);
    // }
  };

  // Cart actions ends here
  // useEffect(() => {
  //   // dispatch({ type: GET_TOTALS });
  // }, [state.cart]);

  // useEffect(() => {}, [state.isCartUpdating]);

  useEffect(() => {
    setAuthInContext();
  }, []);

  // useEffect(() => {
  //   setCartInContext();
  // }, [setCartInContext]);
  const loader = (status) => {
    status ? (
      <Spinner
        as="span"
        animation="grow"
        size="sm"
        role="status"
        aria-hidden="true"
      />
    ) : (
      <></>
    );
  };
  return (
    <AppContext.Provider
      value={{
        ...state,
        clearCart,
        // removeItem,
        removeFromCart,
        updateItemQuantity,
        addToCart,
        setAuthInContext,
        logoutUser,
        applyCoupon,
        removeCoupon,
        // CoCart,
        setIsCardUpdating,
        // setCartInContext,
        cart,
        setCart,
        getCartSubtotal,
        applyCountryRegion,
        applyShippingMethod,
        applyPoints,
        removePoints,
        loader,
        clearCart,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
// custom hook
export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
