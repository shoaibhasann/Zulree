import axios from "axios";
import { getShiprocketToken } from "./token";

const shiprocketClient = axios.create({
  baseURL: "https://apiv2.shiprocket.in/v1/external",
  timeout: 15000,
});

// 🟢 Request interceptor → attach token
shiprocketClient.interceptors.request.use(
  async (config) => {
    const token = await getShiprocketToken();
    config.headers.Authorization = `Bearer ${token}`;
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔴 Response interceptor → handle expiry
shiprocketClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const newToken = await getShiprocketToken(true);
      originalRequest.headers.Authorization = `Bearer ${newToken}`;

      return shiprocketClient(originalRequest); // 🔁 retry once
    }

    return Promise.reject(error);
  }
);

export default shiprocketClient;
