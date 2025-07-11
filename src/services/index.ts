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
  GetAPRevenue: async (payload: any) => {
    return await apiService("POST", endpoints.GetAPRevenue, payload);
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
  GetBrokerageDetails: async (payload: any) => {
    return await apiService("POST", endpoints.GetBrokerageDetails, payload);
  },
  GetBrokeragePlans: async (payload: any) => {
    return await apiService("POST", endpoints.GetBrokeragePlans, payload);
  },
  UpdateClientBrokerageModification: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.UpdateClientBrokerageModification,
      payload
    );
  },
  GetBrokerageModificationHistory: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetBrokerageModificationHistory,
      payload
    );
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
  getFundamentalOverview: async (isin: string) => {
    return await apiService(
      "POST",
      `${endpoints.getFundamentalOverview}/${isin}`,
      {}
    );
  },
  getFundamentalDividend: async (isin: string) => {
    return await apiService(
      "POST",
      `${endpoints.getFundamentalDividend}/${isin}`,
      {}
    );
  },
  getFundamentalBonus: async (isin: string) => {
    return await apiService(
      "POST",
      `${endpoints.getFundamentalBonus}/${isin}`,
      {}
    );
  },
  getFundamentalRatios: async (isin: string) => {
    return await apiService(
      "POST",
      `${endpoints.getFundamentalRatios}/${isin}`,
      {}
    );
  },
  getFundamentalNewsfeed: async (isin: string) => {
    return await apiService(
      "POST",
      `${endpoints.getFundamentalNewsfeed}/${isin}`,
      {}
    );
  },
  getFundamentalcashflow: async (isin: string) => {
    return await apiService(
      "POST",
      `${endpoints.getFundamentalcashflow}/${isin}`,
      {}
    );
  },
  getFundamentalBoardMeeting: async (isin: string) => {
    return await apiService(
      "POST",
      `${endpoints.getFundamentalBoardMeeting}/${isin}`,
      {}
    );
  },
  getFundamentalSplit: async (isin: string) => {
    return await apiService(
      "POST",
      `${endpoints.getFundamentalSplit}/${isin}`,
      {}
    );
  },

  getFundamentalShareholding: async (isin: string) => {
    return await apiService(
      "POST",
      `${endpoints.getFundamentalShareholding}/${isin}`, // This dynamically appends ISIN
      {}
    );
  },

  getFundamentalBalanceSheet: async (isin: string) => {
    return await apiService(
      "POST",
      `${endpoints.getFundamentalBalanceSheet}/${isin}`,
      {}
    );
  },
  getFundamentalAnnualPNL: async (isin: string) => {
    return await apiService(
      "POST",
      `${endpoints.getFundamentalAnnualPNL}/${isin}`,
      {}
    );
  },
  getFundamentalQuaterlyPNL: async (isin: string) => {
    return await apiService(
      "POST",
      `${endpoints.getFundamentalQuaterlyPNL}/${isin}`,
      {}
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
  ViewMarketingMaterials: async (payload: any) => {
    return await apiService("POST", endpoints.ViewMarketingMaterials, payload);
  },
  getInUpMarketMaterial: async (payload: any) => {
    return await apiService("POST", endpoints.getInUpMarketMaterial, payload);
  },
  DeleteMarketingMaterials: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.DeleteMarketingMaterials,
      payload
    );
  },
  getInUpRegAnnoucement: async (payload: any) => {
    return await apiService("POST", endpoints.getInUpRegAnnoucement, payload);
  },
  viewRegAnnoucement: async (payload: any) => {
    return await apiService("POST", endpoints.viewRegAnnoucement, payload);
  },
  DeleteRegulatoryAnnoucement: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.DeleteRegulatoryAnnoucement,
      payload
    );
  },
  GetAPDashboard: async (payload: any) => {
    return await apiService("POST", endpoints.GetAPDashboard, payload);
  },
  ScripSearch: async () => {
    return await apiService("GET", endpoints.ScripSearch);
  },

  UploadTradeFile: async (payload: any) => {
    return await apiService("POST", endpoints.UploadTradeFile, payload);
  },
  GetAllRecords: async (payload: any) => {
    return await apiService("POST", endpoints.GetAllRecords, payload);
  },
  GetPreTradeReport: async (payload: any) => {
    return await apiService("POST", endpoints.GetPreTradeReport, payload);
  },
  GetPendingApproveStatus: async (payload: any) => {
    return await apiService("POST", endpoints.GetPendingApproveStatus, payload);
  },
  SavePreTradeApproveStatus: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.SavePreTradeApproveStatus,
      payload
    );
  },
  GetBrokerageModificationStatus: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetBrokerageModificationStatus,
      payload
    );
  },
  GetBrokerageKycStatus: async (payload: any) => {
    return await apiService("POST", endpoints.GetBrokerageKycStatus, payload);
  },
  UpdateBrokerageKycStatus: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.UpdateBrokerageKycStatus,
      payload
    );
  },
  GetBrokerageRHStatus: async (payload: any) => {
    return await apiService("POST", endpoints.GetBrokerageRHStatus, payload);
  },
  UpdateBrokerageRHStatus: async (payload: any) => {
    return await apiService("POST", endpoints.UpdateBrokerageRHStatus, payload);
  },
  GetTechExcelApiResponse: async (payload: any) => {
    return await apiService("POST", endpoints.GetTechExcelApiResponse, payload);
  },
  GetBrokerageModificationValidity: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetBrokerageModificationValidity,
      payload
    );
  },
  GetClientWiseBrokerage: async (payload: any) => {
    return await apiService("POST", endpoints.GetClientWiseBrokerage, payload);
  },
  CTCLActivityReport: async (payload: any) => {
    return await apiService("POST", endpoints.CTCLActivityReport, payload);
  },
  DetailedCTCLActivityReport: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.DetailedCTCLActivityReport,
      payload
    );
  },
  TradingPatternReport: async (payload: any) => {
    return await apiService("POST", endpoints.TradingPatternReport, payload);
  },
  DetailedTradingPatternReport: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.DetailedTradingPatternReport,
      payload
    );
  },
  SPIPClientPerformanceDashboard: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.SPIPClientPerformanceDashboard,
      payload
    );
  },
  SPIPClientPerformanceSummary: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.SPIPClientPerformanceSummary,
      payload
    );
  },
  SPIPsubScriptionDetail: async (payload: any) => {
    return await apiService("POST", endpoints.SPIPsubScriptionDetail, payload);
  },
  SPIPFeesSharingReport: async (payload: any) => {
    return await apiService("POST", endpoints.SPIPFeesSharingReport, payload);
  },
  SPIPB2BClientDetails: async (payload: any) => {
    return await apiService("POST", endpoints.SPIPB2BClientDetails, payload);
  },
  FillQuarterName: async (payload: any) => {
    return await apiService("POST", endpoints.FillQuarterName, payload);
  },
  GenerateAndDownloadInvoice: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GenerateAndDownloadInvoice,
      payload
    );
  },
  EKycSSOLogin: async (payload: any) => {
    return await apiService("POST", endpoints.EKycSSOLogin, payload);
  },
  Approver1ViewUnlisted: async (payload: any) => {
    return await apiService("POST", endpoints.Approver1ViewUnlisted, payload);
  },
  Approver2ViewUnlisted: async (payload: any) => {
    return await apiService("POST", endpoints.Approver2ViewUnlisted, payload);
  },
  ApproverActionUnlistedShares: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.ApproverActionUnlistedShares,
      payload
    );
  },
  UploadUnlistedSharesVendorFile: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.UploadUnlistedSharesVendorFile,
      payload
    );
  },
  ViewUnlistedSharesRecord: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.ViewUnlistedSharesRecord,
      payload
    );
  },
  InsertUnlistedSharesRecord: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.InsertUnlistedSharesRecord,
      payload
    );
  },
  UpdateUnlistedSharesRecord: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.UpdateUnlistedSharesRecord,
      payload
    );
  },
  DeleteUnlistedSharesRecord: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.DeleteUnlistedSharesRecord,
      payload
    );
  },
  GetAPContestTargetDetails: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetAPContestTargetDetails,
      payload
    );
  },
  GetEMPContestTargetDetails: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetEMPContestTargetDetails,
      payload
    );
  },
  GetB2BCommissionSummary: async (payload: any) => {
    return await apiService("POST", endpoints.GetB2BCommissionSummary, payload);
  },
  GetNewClientCount: async (payload: any) => {
    return await apiService("POST", endpoints.GetNewClientCount, payload);
  },
  GetUniqueSubclientCount: async (payload: any) => {
    return await apiService("POST", endpoints.GetUniqueSubclientCount, payload);
  },
  GetClientActiveInactiveCount: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetClientActiveInactiveCount,
      payload
    );
  },
  GetCommissionRevenueSummary: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetCommissionRevenueSummary,
      payload
    );
  },
  GetClientPledgeDetails: async (payload: any) => {
    return await apiService("POST", endpoints.GetClientPledgeDetails, payload);
  },
  GetEmpContestAchievedDetails: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetEmpContestAchievedDetails,
      payload
    );
  },
};
