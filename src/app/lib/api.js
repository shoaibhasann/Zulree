import axios from "axios";


const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000",
  withCredentials: true,
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
      console.warn("Unauthorized request");
    }
    return Promise.reject(error);
  }
);

export default api;
