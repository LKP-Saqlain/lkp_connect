import apiService from "./apiServices";
import { endpoints } from "./endpoints";

export const apiServices = {
  getAnnualPnlData: async (payload: any) => {
    return await apiService("POST", endpoints.GetPNL, payload);
  },
  GetPNLAccountDetailsPdf: async (payload: any) => {
    return await apiService("POST", endpoints.GetPNLAccountDetailsPdf, payload);
  },
  twoFactorAuthentication: async (payload: any) => {
    return await apiService("POST", endpoints.TwoFactorAuthentication, payload);
  },
  Login: async (payload: any) => {
    return await apiService("POST", endpoints.Login, payload);
  },
  sendOtp: async (payload: any) => {
    return await apiService("POST", endpoints.sendOtp, payload);
  },
  forgetPassword: async (payload: any) => {
    return await apiService("POST", endpoints.forgetPassword, payload);
  },
  getDropDown: async (payload: any, customHeader?: any) => {
    return await apiService(
      "POST",
      endpoints.getDropDown,
      payload,
      customHeader
    );
  },
  getDormantReport: async (payload: any) => {
    return await apiService("POST", endpoints.getDormantReport, payload);
  },
  getUpcompingDormantReport: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.getUpcompingDormantReport,
      payload
    );
  },
  LastTradeDate: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.lastTradeDate,
      payload,
      {
        responseType: "blob",
      },
      155000 //api calling time
    );
  },
  GetQuaterlyPayoutGrid: async (payload: any) => {
    return await apiService("POST", endpoints.GetQuaterlyPayoutGrid, payload);
  },
  SLBMHoldingsReport: async (payload: any) => {
    return await apiService("POST", endpoints.SLBMHoldingsReport, payload);
  },
  GetCoreAlertsReport: async (payload: any) => {
    return await apiService("POST", endpoints.GetCoreAlertsReport, payload);
  },
  dashGetMenus: async (payload: any) => {
    return await apiService("POST", endpoints.getMenus, payload);
  },
  ClientCash: async (payload: any) => {
    return await apiService("POST", endpoints.ClientCash, payload);
  },
  T6Selling: async (payload: any) => {
    return await apiService("POST", endpoints.T6Selling, payload);
  },
  Last7dayBrokerage: async (payload: any) => {
    return await apiService("POST", endpoints.Last7dayBrokerage, payload);
  },
  GetClientStatusCnt: async (payload: any) => {
    return await apiService("POST", endpoints.GetClientStatusCnt, payload);
  },
  DealerPerformance: async (payload: any) => {
    return await apiService("POST", endpoints.DealerPerformance, payload);
  },
  ClientDetails: async (payload: any) => {
    return await apiService("POST", endpoints.ClientDetails, payload);
  },
  GetBirthdayList: async (payload: any) => {
    return await apiService("POST", endpoints.GetBirthdayList, payload);
  },
};
