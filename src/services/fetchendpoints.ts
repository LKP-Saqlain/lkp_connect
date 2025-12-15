import { endpoints } from "./endpoints";

export const publicEndpoints = [
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
  endpoints.CollectMandatePayment,
  endpoints.PreDebitMandateNotify,
  endpoints.ExecuteUpiMandate,
  endpoints.GetClientModuleDataForAmc,
  endpoints.GetClientModuleDetails,
  endpoints.ActivateAMC,
  endpoints.SendDPAMCEmail,
  endpoints.GetDPAMCPaymentResponse,
  endpoints.SendFirstHolderSignature,
  endpoints.SendSecondHolderSignature,
  endpoints.SendThirdHolderSignature,
  endpoints.DownloadSignedPdf,
  endpoints.SendFinalSignedMail,
  endpoints.GetAMCActivationStatus,
];

export const fundamentalEndpoints = [
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

export const pdfDownloadEndpoints = [
  endpoints.GetPNLAccountDetailsPdf,
  endpoints.ComplainceFileDownload,
  endpoints.GenerateAndDownloadInvoice,
  endpoints.GenerateClientPerformancePdf,
  endpoints.GenerateTPInvoice,
  endpoints.DPAMCDownloadFile,
];

export const multipartEndpoints = [
  endpoints.UploadUnlistedSharesVendorFile,
  endpoints.TPInvoiceStaging,
  endpoints.MergeIntoOdinFile,
  endpoints.MergeIntoSymphonyFile,
  endpoints.SLBMHoldingsUploadOdin,
  endpoints.MTFStockAgeingFileUpload,
  endpoints.MTFAgeingFileUpload,
  endpoints.T6BSESellingFileUpload,
  endpoints.T6NSESellingFileUpload,
  endpoints.REGNSEFileUpload,
  endpoints.REGBSEFileUpload,
];

export const mutualFundEndpoints = [
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
  endpoints.VerifyClientCode,
];

export const newDomainEndpoints = [
  endpoints.getUpcompingDormantReport, //y
  endpoints.T6Selling, //y
  endpoints.GetAPContestReport,
  endpoints.GetAPContestAchievedSummary,
  endpoints.GetAPContestDashboard,
  endpoints.GetAPTop10ClientBrokerage,
  endpoints.GetAPContestAchievedBrokerage,
  endpoints.GetAPContestAchievedClients,
  endpoints.GetAPGrossBrokeragePerQuarter,
  endpoints.ClientDetails,
  endpoints.FetchPinLocation,
  // endpoints.InsertThirdPartyMasterRecord,
  // endpoints.UpdateThirdPartyMasterRecord,
  // endpoints.DeleteThirdPartyMasterRecord,
  endpoints.GetActiveClients,
  endpoints.GetUniqueTradedClient,
  endpoints.UpcomingDormantAccount,
  endpoints.ClientCash,
  endpoints.GetClientStatusCnt, //
  endpoints.Last7dayBrokerage, //
  endpoints.DPDebitRecovery, //
  endpoints.DealerPerformance,
  //
  endpoints.ScripSearch, //Pending
  endpoints.SLBMHoldingsReport,
  endpoints.GetEmpContestReport,
  endpoints.GetAPContestTargetDetails,

  endpoints.APContestLeaderboard,
  endpoints.getDormantReport, //1
  // endpoints.ViewUnlistedSharesRecord,

  //from new sheeets
  endpoints.GetAPContestAchievedBrokerage,
  endpoints.GetAPContestAchievedClients,
  // endpoints.DashboardNudge,
  endpoints.GetPledgeReport,

  //RH DASHBOARD/OVERVIEW
  endpoints.GetMonthlyClient,
  endpoints.GetBrokRevenue,
  endpoints.GetTradeplaced,
  endpoints.GetTradedClient,
  endpoints.GetRevTradedClient,

  // endpoints.InsertUnlistedSharesRecord,  //revert
  // endpoints.UpdateUnlistedSharesRecord,//revert
  // endpoints.DeleteUnlistedSharesRecord,//revert
  // endpoints.Approver1ViewUnlisted,//revert
  // endpoints.Approver2ViewUnlisted, //revert
  // endpoints.ViewVendorDetails, //revert

  // endpoints.ViewVendorDetailsReport,   //revert
  // endpoints.ViewThirdPartyMaster, //revert
  // endpoints.ThirdPartyApproverView,  //revert
  endpoints.GetslbmOverview,
  endpoints.GetOverviewBrokRevReport,
  endpoints.GetOverviewUniqueTradedClients,
  endpoints.GetAMCZoneReport,
  endpoints.GetZoneTargetdata,
  endpoints.GetPNLAccountDetailsPdf,
  endpoints.GetQuaterlyPayoutGrid,
  // endpoints.lastTradeDate,
  // endpoints.GetCoreAlertsReport,
  //11/12/2025

  // endpoints.GetQuaterlyPayoutGrid, //   columns n all binding is fully pending
  endpoints.GetUnPledgeReport,
  endpoints.CTCLActivityReport,
  endpoints.DetailedCTCLActivityReport,
  endpoints.TradingPatternReport,
  endpoints.DetailedTradingPatternReport,
  endpoints.GetNewAccountAdded,
  endpoints.GetNewAccountAddedOverview,
  endpoints.GetDeliverySegmentOverview,
  endpoints.GetFuturesRevenueOverview,
  endpoints.GetOptionsRevenueOverview,
  endpoints.GetCommodity_FuturesOverview,
  endpoints.GetCommodity_OptionsOverview,
  endpoints.GetDPTransactionDetails,

  //Marketing Materials
  endpoints.ViewMarketingMaterials,
  endpoints.DeleteMarketingMaterials,
  endpoints.getInUpMarketMaterial,
  //reg announcement
  endpoints.viewRegAnnoucement,
  endpoints.DeleteRegulatoryAnnoucement,
  endpoints.getInUpRegAnnoucement, //insert update RegulatoryAnnoucement

  //back office
  endpoints.GetClientAccessLink,
  // endpoints.GetClientModuleDataForAmc,
];
