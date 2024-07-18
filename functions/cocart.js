import { FeedbackSharp } from "@material-ui/icons";

/**
 *
 * @param {String} value - The value to be trimmed of minor units
 * @param {Cart} cart
 * @returns {Number} - Removes the minor units from the end of value and converts to an integer
 */
export const removeMinorUnits = (value, cart) => {
  if (value?.length < cart?.currency?.currency_minor_unit) {
    return parseInt(value);
  }
  const integerPart = value?.slice(0, -cart?.currency?.currency_minor_unit);
  const floatPart = value?.slice(integerPart.length);

  return parseFloat(`${integerPart}.${floatPart}`);
};

export const getItemPrice = (item, cart) => {
  const price = removeMinorUnits(item.price, cart);
  return price.toFixed(2);
};

// export const getCartSubtotal = (cart) => {
//   const subtotal = cart.totals.subtotal;
//   return removeMinorUnits(subtotal, cart).toFixed(2);
// };

export const getCartTotal = (cart, redeemPoints, insurance) => {
  console.log(cart, redeemPoints, "hhvhvhvhvhvhvhv");
  let total = removeMinorUnits(cart?.totals?.total, cart);
  console.log(total, "ddd");

  console.log(
    cart?.fees["route-shipping-protection"]?.fee / 100,
    "fees of cart"
  );
  const chosenShippingMethod = cart
    ? cart.shipping.packages.default?.chosen_method
    : "";
  if (total <= 0) return 0;
  if (!chosenShippingMethod) {
    console.log(cart, "not in cart");
    return total.toFixed(2);
  } else {
    const shippingCost = removeMinorUnits(
      cart.shipping?.packages.default.rates[chosenShippingMethod].cost,
      cart
    );
    if (redeemPoints > 0) {
      total = (total - redeemPoints / 15).toFixed(2);
    } else {
      total = total.toFixed(2);
    }
    if (insurance?.insurance_selected === "true") {
      // console.log(total,insurance.insurance_price,typeof total, typeof insurance.insurance_price, 'totalllllll1');
      if (cart?.fees["route-shipping-protection"]?.fee / 100 > 0) {
        total = Number(total) + insurance?.insurance_price;
        console.log(
          cart?.fees["route-shipping-protection"]?.fee / 100,
          "nenomeghulgayehespanejotere"
        );
        return (
          total -
          cart?.fees["route-shipping-protection"]?.fee / 100
        ).toFixed(2);
      } else {
        total = Number(total) + insurance?.insurance_price;
        return total.toFixed(2);
      }
    } else {
      if (cart?.fees["route-shipping-protection"]?.fee / 100 > 0) {
        return (
          total -
          cart?.fees["route-shipping-protection"]?.fee / 100
        ).toFixed(2);
      }
      return total;
    }
  }
};

// Get shipping methods from cart
export const getShippingMethods = (cart) => {
  const methods = cart.shipping.packages.default.rates;
  return methods;
};

export const getSelectedShippingMethod = (cart) => {
  const chosen_method_key = cart.shipping.packages.default.chosen_method;
  const methods = getShippingMethods();
  const chosen_method = methods[chosen_method_key];
  return chosen_method;
};

export const getCartKeyParamsIfNaN = (cart_key) => {
  if (isNaN(cart_key)) {
    return "cart_key=" + cart_key;
  } else {
    return "";
  }
};
