import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      toast.error("No internet connection. Please check your network.");
      return Promise.reject(error);
    }

    // Don't redirect for /auth/me — a 401 there just means not logged in
    const isAuthCheck = error.config?.url?.includes("/auth/me");
    if (error.response.status === 401 && !isAuthCheck) {
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
