import apiService from "./apiServices";
import { endpoints } from "./endpoints";

export const apiServices = {
  getAnnualPnlData: async (payload: any) => {
    return await apiService("POST", endpoints.GetPNL, payload);
  },
  twoFactorAuthentication: async (payload: any) => {
    return await apiService("POST", endpoints.TwoFactorAuthentication, payload);
  },
  Login: async (payload: any) => {
    return await apiService("POST", endpoints.Login, payload);
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
};
