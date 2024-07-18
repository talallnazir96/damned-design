import axios from "axios";
import { WP_URL } from "../../utils/config";
require("dotenv").config();

// get all products from WP WooCommerce API with authendication
export default async function handler(req, res) {
  const { categoryId, searchTerm, page } = req.query;
  let categoriesEndpoint = `${
    WP_URL
  }/wp-json/wc/v3/products?consumer_key=${
    process.env.WP_CONSUMER_KEY
  }&consumer_secret=${process.env.WP_CONSUMER_SECRET}&status=publish${
    categoryId != "null" ? `&category=${categoryId}` : "" // if categoryId is not null, add categoryId to the query
  }`;
  
  // if searchTerm is not null, add searchTerm to the query
  if (searchTerm != "null" && searchTerm != undefined) {
    categoriesEndpoint = `${WP_URL}/wp-json/wc/v3/products?consumer_key=${process.env.WP_CONSUMER_KEY}&consumer_secret=${process.env.WP_CONSUMER_SECRET}&status=publish&search=${searchTerm}`;
  }
  categoriesEndpoint += `&per_page=10&page=${page}`;
  try {
    const response = await axios.get(categoriesEndpoint);
    const total_products = parseInt(response.headers['x-wp-total']);
    const total_pages = parseInt(response.headers['x-wp-totalpages']);
    const products = await response.data;
    res.status(200).json({ data: products, total_pages: total_pages, total_products: total_products});
  } catch (error) {
    res.status(400).json(error);
  }
}
