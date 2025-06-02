import axios from "axios";

const axiosClient = axios.create({
  // baseURL: import.meta.env.VITE_HOTEL_BASE_API_URL,
  baseURL: "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Access-Control-Allow-Origin": "*",
  },
  timeout: 10000,
  // withCredentials: true,
});

// - - - Interceptor for Reequest
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// - - - Interceptors for Response
axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error) {
      if (error.response) {
        // * * * Handle specific error responses
        switch (error.response.status) {
          case 401:
            console.error("Unauthorized access - redirect to login?");
            break;
          case 403:
            console.error("Forbidden - No permission to access this resource.");
            break;
          case 404:
            console.error("Resource not found.");
            break;
          case 500:
            console.error("Internal server error.");
            break;
          default:
            console.error("An unexpected error occurred.");
        }
      }
      // * * * For Debugging purposes
      console.error("API Error:", error);
    } else {
      console.error("An unknown error occurred.");
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
