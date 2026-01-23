// axiosInstance.js
import axios from 'axios';
import config from '../config';
import { getToken } from "../util/Cookies";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: config.API_BASE_URL, // Replace with your API URL
});

// Set up an interceptor to inject the token into headers
axiosInstance.interceptors.request.use( (config) => {

    const token = getToken(); // Access the token from your auth slice or context

    if (token) {

      config.headers['Authorization'] = token;

    } else if (config.data instanceof FormData) {

      config.headers['Content-Type'] = 'multipart/form-data';

    } else if (!config.headers['Content-Type']) {

      config.headers['Content-Type'] = 'application/json';

    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
