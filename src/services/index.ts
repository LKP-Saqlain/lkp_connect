import apiService from "./apiServices";
import { endpoints } from "./endpoints";

export const apiServices = {
  getAnnualPnlData: async (payload: any) => {
    return await apiService("POST", endpoints.GetPNL, payload);
  },
  getPnlData: async (payload: any) => {
    return await apiService("POST", endpoints.GetPNLStatement, payload);
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
  ChangePassword: async (payload: any) => {
    return await apiService("POST", endpoints.ChangePassword, payload);
  },

  UnblockUser: async (payload: any) => {
    return await apiService("POST", endpoints.UnblockUser, payload);
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
    return await apiService(
      "POST",
      endpoints.DealerPerformance,
      payload,
      {},
      155000
    );
  },
  ClientDetails: async (payload: any) => {
    return await apiService("POST", endpoints.ClientDetails, payload);
  },
  GetBirthdayList: async (payload: any) => {
    return await apiService("POST", endpoints.GetBirthdayList, payload);
  },
  ClientDashboard: async (payload: any) => {
    return await apiService("POST", endpoints.ClientDashboard, payload);
  },
  ClientSegmentBrok: async (payload: any) => {
    return await apiService("POST", endpoints.ClientSegmentBrok, payload);
  },
  DPDebitRecovery: async (payload: any) => {
    return await apiService("POST", endpoints.DPDebitRecovery, payload);
  },
  DPEmail: async (payload: any) => {
    return await apiService("POST", endpoints.DPEmail, payload);
  },
  Fundamental: async (payload: any) => {
    return await apiService("POST", endpoints.getFundamentalRecord, payload);
  },
  getFundamentalDividend: async (payload: any) => {
    return await apiService("POST", endpoints.getFundamentalDividend, payload);
  },
  getFundamentalBonus: async (payload: any) => {
    return await apiService("POST", endpoints.getFundamentalBonus, payload);
  },
  getFundamentalRatios: async (payload: any) => {
    return await apiService("POST", endpoints.getFundamentalRatios, payload);
  },
  getFundamentalcashflow: async (payload: any) => {
    return await apiService("POST", endpoints.getFundamentalcashflow, payload);
  },
  getFundamentalBoardMeeting: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.getFundamentalBoardMeeting,
      payload
    );
  },
  getFundamentalSplit: async (payload: any) => {
    return await apiService("POST", endpoints.getFundamentalSplit, payload);
  },
  getFundamentalShareholding: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.getFundamentalShareholding,
      payload
    );
  },
  getFundamentalBalanceSheet: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.getFundamentalBalanceSheet,
      payload
    );
  },
  getFundamentalAnnualPNL: async (payload: any) => {
    return await apiService("POST", endpoints.getFundamentalAnnualPNL, payload);
  },
  getFundamentalQuaterlyPNL: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.getFundamentalQuaterlyPNL,
      payload
    );
  },
  ComplainceReport: async (payload: any) => {
    return await apiService("POST", endpoints.ComplainceReport, payload);
  },
  Compliance: async (payload: any) => {
    return await apiService("POST", endpoints.ComplianceData, payload);
  },
  ComplianceDownload: async (payload: any) => {
    return await apiService("POST", endpoints.ComplainceFileDownload, payload, {
      responseType: "blob",
    });
  },
  ComplainceFileUpload: async (payload: any) => {
    return await apiService("POST", endpoints.ComplainceFileUpload, payload);
  },
  DashboardNudge: async (payload: any) => {
    return await apiService("POST", endpoints.DashboardNudge, payload);
  },
  GetAPDashboard: async (payload: any) => {
    return await apiService("POST", endpoints.GetAPDashboard, payload);
  },
};
