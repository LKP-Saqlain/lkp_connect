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

    // Helper function to check if the request is for a fundamental API
    const isFundamentalAPI = [
      endpoints.getFundamentalRecord,
      endpoints.getFundamentalShareholding,
      endpoints.getFundamentalDividend,
      endpoints.getFundamentalBonus,
      endpoints.getFundamentalSplit,
      endpoints.getFundamentalBoardMeeting,
      endpoints.getFundamentalBalanceSheet,
      endpoints.getFundamentalcashflow,
      endpoints.getFundamentalAnnualPNL,
      endpoints.getFundamentalQuaterlyPNL,
    ].some((endpoint) => config.url?.includes(endpoint));

    // Helper function to check if the request is for a PDF download
    const isPdfRequest = [
      endpoints.GetPNLAccountDetailsPdf,
      endpoints.ComplainceFileDownload,
    ].some((endpoint) => config.url?.includes(endpoint));

    // Check if it's a public endpoint
    const isPublicEndpoint = publicEndpoints.some((endpoint) =>
      config.url?.includes(endpoint)
    );

    // Set base URL & Authorization based on request type
    if (isFundamentalAPI) {
      config.baseURL = FUNDAMENTAL_URL;
      config.headers.Authorization = PrivateLoginauthHeader;
    } else {
      config.baseURL = BASE_URL;
      config.headers.Authorization =
        isPublicEndpoint || !token ? LoginauthHeader : `Bearer ${token}`;
    }

    // Configure response type & headers for PDF downloads
    if (isPdfRequest) {
      config.responseType = "blob";
      config.headers["Accept"] = "application/pdf";
    }

    return config;
  },
  (error) => Promise.reject(error) // Handle request error
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
