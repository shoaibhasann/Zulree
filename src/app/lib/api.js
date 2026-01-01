import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "",
  withCredentials: true, // 🔥 MOST IMPORTANT (cookies)
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

/**
 * Optional: Response interceptor
 * Central place to handle auth errors
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 / 403 handling (optional but recommended)
    if (error?.response?.status === 401) {
      // You can optionally:
      // window.location.href = "/admin/login";
      console.warn("Unauthorized request");
    }
    return Promise.reject(error);
  }
);

export default api;
