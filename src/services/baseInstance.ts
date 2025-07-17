// /src/services/baseInstance.ts
import axios from "axios";
import { endpoints } from "./endpoints";

// Load environment variables
const {
  VITE_BASE_URL,
  VITE_FUNDAMENTAL_URL,
  VITE_BASIC_AUTH_USERNAME,
  VITE_BASIC_AUTH_PASSOWORD,
  VITE_FUNDAMENTAL_USERNAME,
  VITE_FUNDAMENTAL_PASSWORD,
} = import.meta.env;

// Axios instance
const baseInstance = axios.create({
  baseURL: VITE_BASE_URL,
  timeout: 120000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Create Basic Auth headers
const createBasicAuthHeader = (username: string, password: string): string =>
  `Basic ${btoa(`${username}:${password}`)}`;

const publicAuthHeader = createBasicAuthHeader(
  VITE_BASIC_AUTH_USERNAME,
  VITE_BASIC_AUTH_PASSOWORD
);
const privateAuthHeader = createBasicAuthHeader(
  VITE_FUNDAMENTAL_USERNAME,
  VITE_FUNDAMENTAL_PASSWORD
);

// Lists of endpoints
const publicEndpoints = [
  endpoints.Login,
  endpoints.sendOtp,
  endpoints.TwoFactorAuthentication,
  endpoints.forgetPassword,
  endpoints.UnblockUser,
];

const fundamentalEndpoints = [
  endpoints.getFundamentalOverview,
  endpoints.getFundamentalShareholding,
  endpoints.getFundamentalDividend,
  endpoints.getFundamentalBonus,
  endpoints.getFundamentalSplit,
  endpoints.getFundamentalBoardMeeting,
  endpoints.getFundamentalBalanceSheet,
  endpoints.getFundamentalcashflow,
  endpoints.getFundamentalAnnualPNL,
  endpoints.getFundamentalQuaterlyPNL,
  endpoints.getFundamentalNewsfeed,
  endpoints.getFundamentalRatios,
];

const pdfDownloadEndpoints = [
  endpoints.GetPNLAccountDetailsPdf,
  endpoints.ComplainceFileDownload,
  endpoints.GenerateAndDownloadInvoice,
  endpoints.GenerateClientPerformancePdf,
];

const multipartEndpoints = [endpoints.UploadUnlistedSharesVendorFile];

// Utility functions
const isEndpointMatched = (url: string | undefined, endpoints: string[]) =>
  !!url && endpoints.some((ep) => url.includes(ep));

// Request Interceptor
baseInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("tkn");
    const url = config.url;

    const isFundamental = isEndpointMatched(url, fundamentalEndpoints);
    const isPublic = isEndpointMatched(url, publicEndpoints);
    const isPdfRequest = isEndpointMatched(url, pdfDownloadEndpoints);
    const isMultipart = isEndpointMatched(url, multipartEndpoints);

    // Set baseURL and authorization
    config.baseURL = isFundamental ? VITE_FUNDAMENTAL_URL : VITE_BASE_URL;
    config.headers.Authorization = isFundamental
      ? privateAuthHeader
      : isPublic || !token
      ? publicAuthHeader
      : `Bearer ${token}`;

    if (isMultipart) {
      delete config.headers["Content-Type"];
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    // Configure PDF-specific settings
    if (isPdfRequest) {
      config.responseType = "blob";
      config.headers.Accept = "application/pdf";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
baseInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized - redirecting to login");
      // You can add redirection logic here
    }
    return Promise.reject(error);
  }
);

export default baseInstance;
