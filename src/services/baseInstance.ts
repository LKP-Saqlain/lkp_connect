// /src/services/baseInstance.ts
import axios from "axios";
import { endpoints } from "./endpoints";

// Create an Axios instance
const baseInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 10000, // Timeout for the requests
  headers: {
    "Content-Type": "application/json",
  },
});

const username = "admin";
const password = "admin";
const credentials = `${username}:${password}`;
const encodedCredentials = btoa(credentials); // Base64 encode
const LoginauthHeader = `Basic ${encodedCredentials}`;

const publicEndpoints = [
  endpoints.Login,
  endpoints.sendOtp,
  endpoints.TwoFactorAuthentication,
  endpoints.forgetPassword,
];

// Add a request interceptor
baseInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("tkn");
    // Check if the request URL matches one of the public endpoints
    const isPublicEndpoint = publicEndpoints.some((endpoint) =>
      config.url?.includes(endpoint)
    );

    // Use `LoginauthHeader` for public endpoints or `Bearer` token for others
    if (isPublicEndpoint || !token) {
      config.headers.Authorization = LoginauthHeader;
    } else {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;

    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    //   // config.headers.Authorization = LoginauthHeader;
    // }
    // return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
baseInstance.interceptors.response.use(
  (response) => {
    // Any status code in the range of 2xx causes this function to trigger
    return response;
  },
  (error) => {
    // Handle response error (e.g., display a notification or logout)
    if (error.response && error.response.status === 401) {
      // Redirect to login or show a message
      console.error("Unauthorized - redirecting to login");
    }
    return Promise.reject(error);
  }
);

export default baseInstance;
