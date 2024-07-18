import { createNotification } from "./utils";
// function to store product id in local storage for last viewed product
// Maximum storage capacity is 4 products
export const addToLastViewed = async (pId, pData) => {
  const lastViewed = JSON.parse(localStorage.getItem("lastViewed")) || [];
  const productId = pId;
  // check if product id is already in local storage then dont add it again
  const isAlready = lastViewed.find((p) => {
    if (p && p.id == productId) {
      return p;
    }
  });
  if (isAlready) {
    return;
  } else {
    const product = {
      id: pData?.id,
      name: pData?.name,
      price: pData?.price,
      images: pData?.images,
      price_html: pData?.price_html,
      url_slug: pData?.slug,
      category: pData.categories[0].slug,
    };
    const newLastViewed = [...lastViewed, product];
    if (newLastViewed.length > 4) {
      newLastViewed.shift();
    }
    localStorage.setItem("lastViewed", JSON.stringify(newLastViewed));
  }
};

// function to retrive all 4 products from local storage
export const getLastViewedProducts = () => {
  const lastViewed = JSON.parse(localStorage.getItem("lastViewed")) || [];
  // const productIds = lastViewed.map(product => product.id)
  // return productIds
  return lastViewed;
};

// function to store product data to local storage for cart/checkout feature

export const addProductToLocalStorage = (pData) => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  // const productId = pId
  // check if product id is already in local storage then dont add it again
  const item = cart.find((p) => p && p.key == pData.key);
  if (item) {
    item.quantity += pData.quantity;
    return;
  } else {
    cart.push(pData);
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  createNotification("success", "Product added to cart");
};

// function to retrive all products from local storage
export const getProductsFromLocalStorage = () => {
  if (localStorage && localStorage.getItem("cart")) {
    // const ids = JSON.parse(localStorage.getItem('cart'))
    // ids &&
    //     ids.length > 0 &&
    //     ids.map((id, idx) => {
    //         console.log(id)
    //         // fetch product data from woocomerce api against id
    //     })
    // return ids
    return JSON.parse(localStorage.getItem("cart"));
  } else {
    return [];
  }
  // const cart = JSON.parse(localStorage.getItem('cart')) || []
  // return cart
};

export const clearCartFromLocalStorage = () => {
  if (localStorage && localStorage.getItem("cart")) {
    localStorage.removeItem("cart");
  }
}

// function to remove product from local storage
export const removeProductFromLocalStorage = (pId) => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const newCart = cart.filter((item) => {
    return item.id !== pId;
  });
  localStorage.setItem("cart", JSON.stringify(newCart));
};

// function to increase product amount in local storage
export const increaseProductAmountInLocalStorage = (pId) => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const tempCart = cart.map((item) => {
    if (item.id === pId) {
      return { ...item, amount: item.amount + 1 };
    }
    return item;
  });
  localStorage.setItem("cart", JSON.stringify(tempCart));
};

// function to decrease product amount in local storage
export const decreaseProductAmountInLocalStorage = (pId, amount) => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  let tempCart = [];
  if (amount === 1) {
    tempCart = cart.filter((item) => {
      return item.id !== pId;
    });
  } else {
    tempCart = cart.map((item) => {
      if (item.id === pId) {
        return { ...item, amount: item.amount - 1 };
      }
      return item;
    });
  }
  localStorage.setItem("cart", JSON.stringify(tempCart));
};
// function to check if product is already in local storage
export const isProductInLocalStorage = (pId) => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const isAlready = cart.find((p) => {
    if (p && p.id == pId) {
      return p;
    }
  });
  return isAlready;
};

// function to add wishlist product to local storage
export const addProductToWishlist = (pId, pData, boolState) => {
  // console.log(pId, pData, boolState)
  if (boolState === true) {
    const wishlist = JSON.parse(localStorage.getItem("mrWishlist")) || [];
    // const productId = pId
    // check if product id is already in local storage then dont add it again
    const isAlready = isProductInWishlist(pId);
    if (isAlready) {
      // alert('This product in already in the cart')
      // createNotification(
      //     'warning',
      //     'This product in already in the wishlist'
      // )
      removeProductFromWishlist(pId);
      return;
    } else {
      const product = {
        id: pData.id,
        name: pData.name,
        price: pData.price,
        images: pData.images,
      };
      const newWishlist = [...wishlist, product];
      localStorage.setItem("mrWishlist", JSON.stringify(newWishlist));
      // createNotification('success', 'Product added to wishlist')
    }
  } else {
    removeProductFromWishlist(pId);
  }
};

// function to remove wishlist product from local storage
export const removeProductFromWishlist = (pId) => {
  const wishlist = JSON.parse(localStorage.getItem("mrWishlist")) || [];
  const newWishlist = wishlist.filter((item) => {
    return item.id != pId;
  });
  localStorage.setItem("mrWishlist", JSON.stringify(newWishlist));
};

// function to check if product is already in mrWishlist
export const isProductInWishlist = (pId) => {
  const wishlist = JSON.parse(localStorage.getItem("mrWishlist")) || [];
  const isAlready = wishlist.find((p) => {
    if (p && p.id == pId) {
      return p;
    }
  });
  return isAlready ? true : false;
};

// function to retrive all products from mrWishlist
export const getProductsFromWishlist = () => {
  const wishlist = JSON.parse(localStorage.getItem("mrWishlist")) || [];
  return wishlist;
};


// function to get cart_key from localstroage
export const getCartKeyFromLocalStorage = () => {
  if (localStorage && localStorage.getItem("cart_key")) {
    return JSON.parse(localStorage.getItem("cart_key"));
  } else {
    return "";
  }
}

export const setCartKeyToLocalStorage = (cart_key) => {
  if (localStorage) {
    localStorage.setItem("cart_key", JSON.stringify(cart_key));
  }
}

export const setCartHashToLocalStorage = (cart_key) => {
  if (localStorage) {
    localStorage.setItem("cart_hash", JSON.stringify(cart_key));
  }
}

export const getCartHashFromLocalStorage = () => {
  if (localStorage && localStorage.getItem("cart_hash")) {
    return JSON.parse(localStorage.getItem("cart_hash"));
  } else {
    return "";
  }
}