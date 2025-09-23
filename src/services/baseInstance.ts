// /src/services/baseInstance.ts
import axios from "axios";
import { endpoints } from "./endpoints";
import { getDecryptedValue } from "../utils/loocalEncrypt";

// Load environment variables
const {
  VITE_BASE_URL,
  VITE_FUNDAMENTAL_URL,
  VITE_BASIC_AUTH_USERNAME,
  VITE_BASIC_AUTH_PASSOWORD,
  VITE_FUNDAMENTAL_USERNAME,
  VITE_FUNDAMENTAL_PASSWORD,
  // VITE_MF_USERNAME,
  // VITE_MF_PASSWORD,
  // VITE_MF_SECRETKEY,
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

// const mfAuthHeader = createBasicAuthHeader(
//   VITE_MF_USERNAME,
//   VITE_MF_PASSWORD
//   // VITE_MF_SECRETKEY
// );

// Lists of endpoints
const publicEndpoints = [
  endpoints.Login,
  endpoints.sendOtp,
  endpoints.TwoFactorAuthentication,
  endpoints.forgetPassword,
  endpoints.UnblockUser,
  endpoints.GetDpClientDetails,
  endpoints.checkUpi,
  endpoints.CreateUpiMandate,
  endpoints.GetMandateCallBackDetails,
  endpoints.UpdateUpiMandate,
  endpoints.RevokeUpiMandate,
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
  endpoints.GenerateTPInvoice,
];

const multipartEndpoints = [
  endpoints.UploadUnlistedSharesVendorFile,
  endpoints.TPInvoiceStaging,
  endpoints.MergeIntoOdinFile,
  endpoints.MergeIntoSymphonyFile,
];

const mutualFundEndpoints = [
  endpoints.MF_SchemeDetails,
  endpoints.BSEStar_MfMandateStatus,
  endpoints.MF_OngoingSIP,
  endpoints.MF_PortfolioStatementReport,
  endpoints.MF_TransactionReport,
  endpoints.MF_NFODetails,
  endpoints.ClientProfile,
  endpoints.MF_BasketDetialedList,
  endpoints.VerifyUpi,
  endpoints.MF_FundOverView,
  endpoints.BSEStar_SinglePayment,
  endpoints.BSEStar_MfOrderEntry,
  endpoints.BSEStar_XSIPOrderEntry,
  endpoints.BSEStar_MfMandateStatus,
  endpoints.BSEStar_MfMandateEntry,
  endpoints.MF_TodayOrders,
  endpoints.EnachEmailToClient,
  endpoints.SinglePaymentEmail,
];

// Utility functions
const isEndpointMatched = (url: string | undefined, endpoints: string[]) =>
  !!url && endpoints.some((ep) => url.includes(ep));

// Request Interceptor
baseInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("tkn");
    const mfToken = getDecryptedValue("mfToken");
    // const mfToken = localStorage.getItem("mfToken");
    // const mfToken =
    //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VyX3R5cGUiOiJWZW5kb3IiLCJMb2dpbmlkIjoibWlsbGljZW50IiwiU2VjcmV0S2V5IjoibXRpdnNtJkdEeTYkNDA5Z3U2N0AzaGRZbWIiLCJFbmNyeXB0aW9uS2V5IjoibWlsbHNtQEdEeTYkNDA5Z3U2NyYzaGRZIiwiQ2xpZW50Q29kZSI6Ijk4OTAzIiwiZXhwIjoxNzU3MDY5MDI3LCJpc3MiOiJodHRwczovL2xvY2FsaG9zdDo3MTk0IiwiYXVkIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NzE5NCJ9.X5sTEa5BpL5P1qgjON917rB7VK3TRst40ZHCKMPlVxs";
    const url = config.url;

    const isFundamental = isEndpointMatched(url, fundamentalEndpoints);
    const isPublic = isEndpointMatched(url, publicEndpoints);
    const isPdfRequest = isEndpointMatched(url, pdfDownloadEndpoints);
    const isMultipart = isEndpointMatched(url, multipartEndpoints);
    const isMutualFund = isEndpointMatched(url, mutualFundEndpoints);

    // Set baseURL and authorization
    config.baseURL = isFundamental ? VITE_FUNDAMENTAL_URL : VITE_BASE_URL;
    config.headers.Authorization = isFundamental
      ? privateAuthHeader
      : isMutualFund
      ? `Bearer ${mfToken}`
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
