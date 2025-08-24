// src/setupAxios.js
import axios from "axios";
import Cookies from "js-cookie";

axios.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
