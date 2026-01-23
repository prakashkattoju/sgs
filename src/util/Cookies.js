// utils/cookie.js
import Cookies from "js-cookie";

export const setToken = (token) => {
  // Set token in cookie; you can add options like expires, secure, etc.
  //console.log("Set Token ", token);
  Cookies.set("authToken", token, { expires: 7 });
};

export const getToken = () => {
  const token = Cookies.get("authToken");
  //console.log("get Token is called", token);
  return token;
};

export const removeToken = () => {
  Cookies.remove("authToken");
};

