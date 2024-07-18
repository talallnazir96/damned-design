/**
 * Convert large backend api cart item data to small cart item data with essential infos
 * @param {Object} item 
 * @returns {Object} Minified item data
 */
export const getCartItemData = (item) => {
  let title = item.data.name;
  const variation = item.variation.attribute_type;
  if (variation) {
    // Turns "Ghoul - White G10" into "Ghoul"
    title = title.split(` - ${variation}`)[0];
  }

  const data = item.data;
  const discount =
  data.on_sale && data.sale_price - data.price > 0
    ? data.sale_price - data.price
    : 0;

  return {
    key: item.key,
    product_id: item.product_id,
    id: item.data.id,
    quantity: item.quantity,
    variation_id: item.variation_id,
    variation,
    title,
    img: item.data.images[0].src,
    price: item.data.price,
    regular_price: item.data.regular_price,
    sale_price: item.data.sale_price,
    discount,
  };
}