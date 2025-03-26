// /src/services/baseInstance.ts
import axios from "axios";
import { endpoints } from "./endpoints";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const FUNDAMENTAL_URL = import.meta.env.VITE_FUNDAMENTAL_URL;

// Create an Axios instance
const baseInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 120000, // Timeout for the requests
  headers: {
    "Content-Type": "application/json",
  },
});

const username = "admin";
const password = "admin";
const credentials = `${username}:${password}`;
const encodedCredentials = btoa(credentials); // Base64 encode
const LoginauthHeader = `Basic ${encodedCredentials}`;

const privateUsername = "WP19T48LKP";
const privatePassword = "Int@ll@ct#1948";
const privateCredentials = `${privateUsername}:${privatePassword}`;
const encodedprivateCredentials = btoa(privateCredentials); // Base64 encode
const PrivateLoginauthHeader = `Basic ${encodedprivateCredentials}`;

const publicEndpoints = [
  endpoints.Login,
  endpoints.sendOtp,
  endpoints.TwoFactorAuthentication,
  endpoints.forgetPassword,
  endpoints.UnblockUser,
];

// Add a request interceptor
baseInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("tkn");
    // Check if the request URL matches one of the public endpoints
    const isPublicEndpoint = publicEndpoints.some((endpoint) =>
      config.url?.includes(endpoint)
    );

    // if (config.url?.includes("/Fundamental/fundamental/INE009A01021")) {
    //   config.baseURL = FUNDAMENTAL_URL;
    // } else {
    //   config.baseURL = BASE_URL;
    // }

    // // Use `LoginauthHeader` for public endpoints or `Bearer` token for others
    // if (isPublicEndpoint || !token) {
    //   config.headers.Authorization = LoginauthHeader;
    // } else {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    if (
      config.url?.includes("/Fundamental/fundamental/INE467B01029") ||
      config.url?.includes("/Fundamental/Shareholding/INE467B01029") ||
      config.url?.includes(endpoints.getFundamentalBalanceSheet)
    ) {
      config.baseURL = FUNDAMENTAL_URL;
      config.headers.Authorization = PrivateLoginauthHeader; // Use private credentials
    } else {
      config.baseURL = BASE_URL;
      config.headers.Authorization =
        isPublicEndpoint || !token ? LoginauthHeader : `Bearer ${token}`;
    }

    if (
      config.url?.includes(endpoints.GetPNLAccountDetailsPdf) ||
      config.url?.includes(endpoints.ComplainceFileDownload)
    ) {
      config.responseType = "blob"; // Set responseType to blob for PDF
      config.headers["Accept"] = "application/pdf";
    }

    return config;
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
