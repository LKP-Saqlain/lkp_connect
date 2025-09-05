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
  GetEmpContestAchievedSummary: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetEmpContestAchievedSummary,
      payload
    );
  },
  GetAPContestAchievedBrokerage: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetAPContestAchievedBrokerage,
      payload
    );
  },
  GetAPContestAchievedClients: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetAPContestAchievedClients,
      payload
    );
  },
  GetAPContestAchievedSummary: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetAPContestAchievedSummary,
      payload
    );
  },
  GetEmpContestAchievedBrokerage: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetEmpContestAchievedBrokerage,
      payload
    );
  },
  GetEmpContestAchievedClients: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetEmpContestAchievedClients,
      payload
    );
  },
  GetEmpContestAchievedNonBrokerage: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetEmpContestAchievedNonBrokerage,
      payload
    );
  },
  SLBMHoldingsUpload: async (payload: any) => {
    return await apiService("POST", endpoints.SLBMHoldingsUpload, payload);
  },
  GenerateClientPerformancePdf: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GenerateClientPerformancePdf,
      payload
    );
  },
  GetExcludeOptions: async (payload: any) => {
    return await apiService("POST", endpoints.GetExcludeOptions, payload);
  },
  GetClientExclusionList: async (payload: any) => {
    return await apiService("POST", endpoints.GetClientExclusionList, payload);
  },
  InsertClientExclusionEntry: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.InsertClientExclusionEntry,
      payload
    );
  },
  DeleteClientExclusionEntry: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.DeleteClientExclusionEntry,
      payload
    );
  },
  GetWebPortalDetails: async (payload: any) => {
    return await apiService("POST", endpoints.GetWebPortalDetails, payload);
  },
  ViewThirdPartyMaster: async (payload: any) => {
    return await apiService("POST", endpoints.ViewThirdPartyMaster, payload);
  },
  InsertThirdPartyMasterRecord: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.InsertThirdPartyMasterRecord,
      payload
    );
  },
  DeleteThirdPartyMasterRecord: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.DeleteThirdPartyMasterRecord,
      payload
    );
  },
  UpdateThirdPartyMasterRecord: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.UpdateThirdPartyMasterRecord,
      payload
    );
  },
  ThirdPartyApproverView: async (payload: any) => {
    return await apiService("POST", endpoints.ThirdPartyApproverView, payload);
  },
  ThirdPartyApproverAction: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.ThirdPartyApproverAction,
      payload
    );
  },
  TPInvoiceStaging: async (payload: any) => {
    return await apiService("POST", endpoints.TPInvoiceStaging, payload);
  },
  UnstageTPInvoice: async (payload: any) => {
    return await apiService("POST", endpoints.UnstageTPInvoice, payload);
  },
  TPInvoiceUpload: async (payload: any) => {
    return await apiService("POST", endpoints.TPInvoiceUpload, payload);
  },
  GetUnverifiedTPInvoices: async (payload: any) => {
    return await apiService("POST", endpoints.GetUnverifiedTPInvoices, payload);
  },
  HandleTPInvoiceApproval: async (payload: any) => {
    return await apiService("POST", endpoints.HandleTPInvoiceApproval, payload);
  },
  DeleteTPInvoiceRecord: async (payload: any) => {
    return await apiService("POST", endpoints.DeleteTPInvoiceRecord, payload);
  },
  GetReadyToSendTPInvoices: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetReadyToSendTPInvoices,
      payload
    );
  },
  GenerateTPInvoice: async (payload: any) => {
    return await apiService("POST", endpoints.GenerateTPInvoice, payload);
  },
  SendTPInvoiceBulkEmail: async (payload: any) => {
    return await apiService("POST", endpoints.SendTPInvoiceBulkEmail, payload);
  },
  GetTPInvoiceRecordList: async (payload: any) => {
    return await apiService("POST", endpoints.GetTPInvoiceRecordList, payload);
  },
  GetBrokRevReport: async (payload: any) => {
    return await apiService("POST", endpoints.GetBrokRevReport, payload);
  },
  GetTradedClientReport: async (payload: any) => {
    return await apiService("POST", endpoints.GetTradedClientReport, payload);
  },
  GetRevenueTradedClientReport: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetRevenueTradedClientReport,
      payload
    );
  },
  GetDeliverySegmentReport: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetDeliverySegmentReport,
      payload
    );
  },
  GetIntradaySegmentReport: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetIntradaySegmentReport,
      payload
    );
  },
  GetFuturesRevenue: async (payload: any) => {
    return await apiService("POST", endpoints.GetFuturesRevenue, payload);
  },
  GetOptionsRevenue: async (payload: any) => {
    return await apiService("POST", endpoints.GetOptionsRevenue, payload);
  },
  GetCommodityFuturesReport: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetCommodityFuturesReport,
      payload
    );
  },
  GetCommodityOptionsReport: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetCommodityOptionsReport,
      payload
    );
  },
  GetMonthlyClient: async (payload: any) => {
    return await apiService("POST", endpoints.GetMonthlyClient, payload);
  },
  GetBrokRevenue: async (payload: any) => {
    return await apiService("POST", endpoints.GetBrokRevenue, payload);
  },
  GetTradeplaced: async (payload: any) => {
    return await apiService("POST", endpoints.GetTradeplaced, payload);
  },
  GetTradedClient: async (payload: any) => {
    return await apiService("POST", endpoints.GetTradedClient, payload);
  },
  GetRevTradedClient: async (payload: any) => {
    return await apiService("POST", endpoints.GetRevTradedClient, payload);
  },

  VerifyBankDetails: async (payload: any) => {
    return await apiService("POST", endpoints.VerifyBankDetails, payload);
  },
  FetchPinLocation: async (payload: any) => {
    return await apiService("POST", endpoints.FetchPinLocation, payload);
  },
  SaveVendorDetails: async (payload: any) => {
    return await apiService("POST", endpoints.SaveVendorDetails, payload);
  },
  ViewVendorDetails: async (payload: any) => {
    return await apiService("POST", endpoints.ViewVendorDetails, payload);
  },
  DeleteVendorDetails: async (payload: any) => {
    return await apiService("POST", endpoints.DeleteVendorDetails, payload);
  },
  UpdateVendorDetails: async (payload: any) => {
    return await apiService("POST", endpoints.UpdateVendorDetails, payload);
  },
  UpdateAccountApproval: async (payload: any) => {
    return await apiService("POST", endpoints.UpdateAccountApproval, payload);
  },

  GetAPContestReport: async (payload: any) => {
    return await apiService("POST", endpoints.GetAPContestReport, payload);
  },
  GetUnlistedVendorDropdown: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.GetUnlistedVendorDropdown,
      payload
    );
  },
  GetClientAccessLink: async (payload: any) => {
    return await apiService("POST", endpoints.GetClientAccessLink, payload);
  },
  MergeIntoOdinFile: async (payload: any) => {
    return await apiService("POST", endpoints.MergeIntoOdinFile, payload);
  },
  MergeIntoSymphonyFile: async (payload: any) => {
    return await apiService("POST", endpoints.MergeIntoSymphonyFile, payload);
  },
  GetUnPledgeReport: async (payload: any) => {
    return await apiService("POST", endpoints.GetUnPledgeReport, payload);
  },
  UploadCollateralFiles: async (payload: any) => {
    return await apiService("POST", endpoints.UploadCollateralFiles, payload);
  },
  MF_SchemeDetails: async (payload: any) => {
    return await apiService("POST", endpoints.MF_SchemeDetails, payload);
  },
  MFLogin: async (payload: any) => {
    return await apiService("POST", endpoints.MFLogin, payload);
  },
  BSEStar_MfMandateStatus: async (payload: any) => {
    return await apiService("POST", endpoints.BSEStar_MfMandateStatus, payload);
  },
  MF_OngoingSIP: async (payload: any) => {
    return await apiService("POST", endpoints.MF_OngoingSIP, payload);
  },
  MF_PortfolioStatementReport: async (payload: any) => {
    return await apiService(
      "POST",
      endpoints.MF_PortfolioStatementReport,
      payload
    );
  },
  MF_TransactionReport: async (payload: any) => {
    return await apiService("POST", endpoints.MF_TransactionReport, payload);
  },
};
