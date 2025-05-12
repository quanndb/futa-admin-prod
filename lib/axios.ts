import axios from "axios";

// Create an Axios instance with default configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://api.busgo.vn/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("authToken");

    // If token exists, add it to the headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle unauthorized errors (401)
    if (error.response && error.response.status === 401) {
      // Clear localStorage and redirect to login
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
