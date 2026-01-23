import { decodeToken } from "react-jwt";
import { removeToken } from "./Cookies";

export const checkAndRemoveExpiredToken = (token) => {
  if (token === null || token === undefined) return false;

  try {
    const decoded = decodeToken(token);
    const currentTime = Date.now() / 1000; // in seconds
    if (decoded.exp && decoded.exp < currentTime) {
      // Token expired
      removeToken(); // delete cookie
      return false;
    }
    return true; // valid token

  } catch (e) {
    // Invalid token format
    removeToken();
    return false;
  }
};

export const fetchUserRole = (token) => {
  if (token === null || token === undefined) return false;
  try {
    const decoded = decodeToken(token);
    return decoded.user_role;

  } catch (e) {
    // Invalid token format
    removeToken();
    return false;
  }
};