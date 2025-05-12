import { showError } from "@/lib/toast-utils";
import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "69420",
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    showError(error);
    if (error.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userInfo");
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    throw error;
  }
);

export default instance;
