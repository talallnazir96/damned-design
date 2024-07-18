import { getCartKeyFromLocalStorage } from "../functions/general";
import { AUTH_TOKEN, SET_CURRENT_USER } from "./types/authTypes";
import {
  INCREASE_AMOUNT,
  DECREASE_AMOUNT,
  CLEAR_CART,
  REMOVE_ITEM,
  TOGGLE_AMOUNT,
  GET_TOTALS,
  DIRECT_CHECKOUT,
  ADD_TO_CART,
  APPLY_COUPON,
  SET_CART,
  SET_CART_KEY,
  SET_IS_CART_UPDATING,
  APPLY_POINTS

} from "./types/cartTypes";


export const initialState = {
  authToken: null,
  currentUser: null,
  cart: null,
  // quantity: 0,
  // discount: 0,
  // subtotal: 0,
  // total: 0,
  // directCheckout: false,
  coupon: null,
  isCartUpdating: false,
  cart_key: "",
  points: 0
};
export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_TOKEN:
      return {
        ...state,
        authToken: action.payload ? action.payload : null,
      };
    case SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload ? action.payload : null,
      };
    case SET_CART_KEY:
      return {
        ...state,
        cart_key: action.payload,
      }
    case SET_CART:
      return {
        ...state,
        cart: action.payload,
      };
    case SET_IS_CART_UPDATING:
      return {
        ...state,
        isCartUpdating: action.payload,
      }
    case ADD_TO_CART:
      // check if product is already in cart
      const itemInCart = state.cart.find(
        (item) => item.id === action.payload.id
      );
      // if product is already in cart
      if (itemInCart) {
        const newCart = state.cart.map((item) => {
          if (item.id === action.payload.id) {
            return action.payload
          }
          return item
        });
        return {
          ...state,
          cart: newCart
        };
      } else {
        return {
          ...state,
          cart: [...state.cart, action.payload],
        };
      }
    case INCREASE_AMOUNT:
      let tempCart = state.cart.map((item) => {
        if (item.id === action.payload.id) {
          return { ...item, amount: item.amount + 1 };
        }
        return item;
      });
      return { ...state, cart: tempCart };
    case DECREASE_AMOUNT:
      let tempCart2 = [];
      if (action.payload.amount === 1) {
        tempCart2 = state.cart.filter((item) => {
          return item.id !== action.payload.id;
        });
      } else {
        tempCart2 = state.cart.map((item) => {
          if (item.id === action.payload.id) {
            return { ...item, amount: item.amount - 1 };
          }
          return item;
        });
      }
      return { ...state, cart: tempCart2 };
    case CLEAR_CART:
      return { ...state, cart: [], amount: 0, total: 0 };
    case REMOVE_ITEM:
      const filteredItems = state.cart.filter(
        (item) => item.id !== action.payload
      );
      return { ...state, cart: filteredItems };
    case GET_TOTALS:
      let { total, quantity, discount } = state.cart.reduce(
        (accumulator, item) => {
          accumulator.total = accumulator.total + item.price * item.quantity;
          accumulator.quantity += item.quantity;
          accumulator.discount += item.discount * item.quantity;
          return accumulator;
        },
        {
          total: 0,
          quantity: 0,
          discount: 0,
        }
      );

      total = parseFloat(total.toFixed(2));

      return { ...state, total, quantity, discount };
    case APPLY_COUPON:
      if (action.payload) {
        const coupon = action.payload;
        const amount = coupon.amount;
        return { ...state, coupon, discount: (state.total * amount) / 100 };
      } else {
        return { ...state, coupon: null, discount: 0 };
      }
    // case APPLY_POINTS:
    //   if (action.payload) {

    //     console.log(action.payload, "payload action");
    //     const points = action.payload;
    //     const amount = points / 15;
    //     return { ...state, points, discount: (state.total * amount) / 100 }
    //   }
    //   else {
    //     return { ...state, points: 0, discount: 0 };
    //   }
    default:
      return state;
  }
};
