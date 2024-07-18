import cookie from "cookie";
import jwt from "jsonwebtoken";

// functiont to get cookies from Request Headers
export const parseCookies = (req) => {
  return cookie.parse(req ? req.headers.cookie || "" : document.cookie);
};
// function to get auth-token from local storage
export const getAuthTokenFromLocalStorage = () => {
  let authToken = JSON.parse(localStorage.getItem("mrAuthToken"));
  ;
  if (authToken) return authToken;
  return null;
};
// function to get mrAuthToken from cookie with js
export const getAuthTokenFromCookie = () => {
  ;
  if (typeof window !== "undefined") {
    const cookies = parseCookies();
    return cookies["mrAuthToken"];
  }
  return null;
};

// function to get auth-token from cookie or local storage
export const getAuthToken = () => {
  if (typeof window !== "undefined") {
    const authToken = getAuthTokenFromCookie();
    if (authToken) return authToken;
    return getAuthTokenFromLocalStorage();
  }
  return null;
};

// function Notification(data, condition) {
//   if (condition === "success") {
//     toast.success(data, {
//       position: "top-right",
//       autoClose: 3000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//       progress: undefined,
//     });
//   } else {
//     toast.error(data, {
//       position: "top-right",
//       autoClose: 3000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//       progress: undefined,
//     });
//   }
// }
// logout function
export const logout = () => {
  localStorage.removeItem("mrAuthToken");
  localStorage.removeItem("user");
  document.cookie = `mrAuthToken= ; expires = ${new Date().now}`;
};
// function to get User details from Local Storage
export const getUserFromLocalStorage = () => {
  let user = localStorage.getItem("user");
  if (user) return JSON.parse(user);
  return null;
};
// function to convert ISO Date to String
export const isoDateToDateString = (isoDate) => {
  return new Date(isoDate).toDateString();
};

// function to verify JWT Token
export const verifyJWTToken = (token) => {
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_AUTH_SECRET_KEY);
    return decoded;
  } catch (err) {
    return null;
  }
};

// function to get Decode JWT Token
export const decodeJWTToken = (token) => {
  if (!token) return null;
  try {
    let decoded = jwt.decode(token, { complete: true });
    return decoded ? decoded.payload : null;
  } catch (err) {
    return null;
  }
};

/**
 * Decodes auth header from request and returns user object
 * @param {Request} req
 * @returns {null | Object} User
 */
export const getUserFromRequest = (req) => {
  const { authorization } = req.headers;
  if (!authorization) return null;
  const token = authorization ? authorization.split(" ")[1] : null;
  if (!token) return null;
  const decoded = verifyJWTToken(token);
  if (!decoded) return null;
  return decoded.data?.user || null;
};
