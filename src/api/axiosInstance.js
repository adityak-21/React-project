import axios from "axios";
import { getAccessToken } from "./AuthApi";

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL || "http://localhost:8000/api/v1",
});

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
