// src/utils/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // adjust port to match backend
});

// Automatically attach JWT if present
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optionally handle 401 globally
axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Auth expired, logging out...");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/"; // force reload or redirect
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;





// // src/utils/axiosInstance.js
// import axios from "axios";

// // === ✅ BASE CONFIGURATION ===
// const axiosInstance = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
//   timeout: 15000, // 15s safety timeout
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // === ✅ REQUEST INTERCEPTOR ===
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) config.headers.Authorization = `Bearer ${token}`;
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // === ✅ RESPONSE INTERCEPTOR ===
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const status = error.response?.status;

//     // Handle 401: Auth expired or invalid
//     if (status === 401) {
//       console.warn("⚠️ Session expired — redirecting to login.");
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//       window.location.href = "/login";
//     }

//     // Handle 500+ server issues gracefully
//     if (status >= 500) {
//       console.error("💥 Server error:", error.response?.data || error.message);
//     }

//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;
