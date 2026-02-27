import axios, { InternalAxiosRequestConfig } from "axios";
import { getDecryptedValue } from "../utils/loocalEncrypt";
import {
  fundamentalEndpoints,
  mtfSegmentActivationEndpoint,
  multipartEndpoints,
  mutualFundEndpoints,
  newDomainEndpoints,
  pdfDownloadEndpoints,
  publicEndpoints,
} from "./fetchendpoints";

const {
  VITE_BASE_URL,
  VITE_FUNDAMENTAL_URL,
  VITE_BASIC_AUTH_USERNAME,
  VITE_BASIC_AUTH_PASSOWORD,
  VITE_FUNDAMENTAL_USERNAME,
  VITE_FUNDAMENTAL_PASSWORD,
  VITE_NEW_DOMAIN_BASE_URL,
} = import.meta.env;

const baseInstance = axios.create({
  baseURL: VITE_BASE_URL,
  timeout: 120000,
});

const createBasicAuthHeader = (username: string, password: string): string =>
  `Basic ${btoa(`${username}:${password}`)}`;

const AUTH_HEADERS = {
  PUBLIC: createBasicAuthHeader(
    VITE_BASIC_AUTH_USERNAME,
    VITE_BASIC_AUTH_PASSOWORD
  ),
  FUNDAMENTAL: createBasicAuthHeader(
    VITE_FUNDAMENTAL_USERNAME,
    VITE_FUNDAMENTAL_PASSWORD
  ),
};

const isEndpointMatched = (
  url: string | undefined,
  endpoints: string[]
): boolean => Boolean(url && endpoints.some((ep) => url.includes(ep)));

const getRequestContext = (url?: string) => ({
  isFundamental: isEndpointMatched(url, fundamentalEndpoints),
  isPublic: isEndpointMatched(url, publicEndpoints),
  isPdf: isEndpointMatched(url, pdfDownloadEndpoints),
  isMultipart: isEndpointMatched(url, multipartEndpoints),
  isMutualFund: isEndpointMatched(url, mutualFundEndpoints),
  isNewDomain: isEndpointMatched(url, newDomainEndpoints),
  isMtfSegmentActivation: isEndpointMatched(url, mtfSegmentActivationEndpoint),
});

const resolveBaseURL = (context: ReturnType<typeof getRequestContext>) => {
  if (context.isFundamental) return VITE_FUNDAMENTAL_URL;
  if (context.isNewDomain) return VITE_NEW_DOMAIN_BASE_URL;
  return VITE_BASE_URL;
};

const resolveAuthHeader = (context: ReturnType<typeof getRequestContext>) => {
  const token = localStorage.getItem("tkn");
  const mfToken = getDecryptedValue("mfToken");
  const mtfToken = getDecryptedValue("mtfToken");

  if (context.isFundamental) {
    return AUTH_HEADERS.FUNDAMENTAL;
  }
  if (context.isMutualFund && mfToken) {
    return `Bearer ${mfToken}`;
  }
  if (context.isMtfSegmentActivation && mtfToken) {
    return `Bearer ${mtfToken}`;
  }
  if (context.isPublic || !token) {
    return AUTH_HEADERS.PUBLIC;
  }
  return `Bearer ${token}`;
};

baseInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const context = getRequestContext(config.url);
    /* Base URL */
    config.baseURL = resolveBaseURL(context);
    /* Authorization */
    config.headers.set("Authorization", resolveAuthHeader(context));
    /* Content-Type */
    if (context.isMultipart) {
      config.headers.delete("Content-Type");
    } else {
      config.headers.set("Content-Type", "application/json");
    }
    /* PDF handling */
    if (context.isPdf) {
      config.responseType = "blob";
      config.headers.set("Accept", "application/pdf");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

baseInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized - redirecting to login");
      // centralized logout / redirect logic can be placed here
    }
    return Promise.reject(error);
  }
);

export default baseInstance;
