// API service for making requests to the backend
import axios from "axios";
import { getCurrentUserToken } from "./firebase";

// Base API URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  withCredentials: true,
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to attach auth token to every request
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await getCurrentUserToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error("Error getting auth token:", error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common error cases
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 errors (unauthorized)
    if (error.response && error.response.status === 401) {
      // Dispatch logout action if needed or redirect to login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API endpoints
const authAPI = {
  verifyToken: () => api.get("/auth/verify"),
  register: () => api.post("/auth/register"),
};

// User API endpoints
const userAPI = {
  getProfile: () => api.get("/users/profile"),
  updateProfile: (data) => api.put("/users/profile", data),
};

export { api, authAPI, userAPI };
