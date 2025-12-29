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

  // endpoints.ViewVendorDetailsReport,   //revert
  endpoints.GetslbmOverview,
  endpoints.GetOverviewBrokRevReport,
  endpoints.GetOverviewUniqueTradedClients,
  endpoints.GetAMCZoneReport,
  endpoints.GetDPAMCZoneReportDetails,
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
  //DP AMC
  endpoints.GetClientModuleDataForAmc,
  endpoints.GetClientDPContest,
  endpoints.GetClientModuleDetails,
  endpoints.GetAMCActivationStatus,
  endpoints.SendDPAMCEmail,
  endpoints.GetDPAMCPaymentResponse,
  endpoints.SendFirstHolderSignature,
  endpoints.SendSecondHolderSignature,
  endpoints.SendThirdHolderSignature,
  endpoints.SendFinalSignedMail,

  // Employeee contest
  endpoints.GetEmpContestAchievedBrokerage,
  endpoints.GetEmpContestAchievedNonBrokerage,
  endpoints.GetEmpContestAchievedClients,
  endpoints.GetEMPContestTargetDetails,
  endpoints.GetEmpContestAchievedSummary,

  //KYC Dashboard
  //RH Approval
  endpoints.GetBrokerageRHStatus, //done
  endpoints.UpdateBrokerageRHStatus, //done no change
  //KYC Approval
  endpoints.GetBrokerageKycStatusNew, //done
  endpoints.GetBrokerageKycDetailsStatus, //done
  endpoints.GetTechExcelApiResponseNew, //Keeping TechExcel as it is
  endpoints.UpdateBrokerageKycStatusNew, //done no change

  //Brokerage modification status
  endpoints.GetBrokerageModificationStatus,

  //Client Pledge Request
  endpoints.GetClientPledgeDetails,

  //Upload SLBM Holding
  endpoints.SLBMHoldingsUploadOdin,

  //Client Details Popup API's
  endpoints.ClientDashboard,
  endpoints.ClientSegmentBrok,
  endpoints.GetClientWiseBrokerage,
  endpoints.GetBrokerageDetails,
  //Brokerage Slab API's
  endpoints.GetBrokerageModificationValidity,
  endpoints.GetBrokerageModificationHistory,

  //Unlisted API's
  endpoints.ViewUnlistedSharesRecord,
  endpoints.InsertUnlistedSharesRecord,
  endpoints.UpdateUnlistedSharesRecord,
  endpoints.DeleteUnlistedSharesRecord,
  //Approver 1
  endpoints.Approver1ViewUnlisted,
  endpoints.GetUnlistedVendorDropdown,
  endpoints.ApproverActionUnlistedShares, //action submit API use for both 1 and 2
  endpoints.Approver2ViewUnlisted, //
  endpoints.UploadUnlistedSharesVendorFile,

  //Account - Third Party
  endpoints.ViewThirdPartyMaster,
  endpoints.UpdateThirdPartyMasterRecord,
  endpoints.InsertThirdPartyMasterRecord,
  endpoints.DeleteThirdPartyMasterRecord,
  endpoints.ThirdPartyApproverView, //Need to check this api once getting response
  endpoints.ThirdPartyApproverAction, //Need to check this api once getting response

  //Third Party Innvoice
  endpoints.TPInvoiceStaging, //Upload file also columns has change from my end
  endpoints.TPInvoiceUpload,
  endpoints.GetTPInvoiceRecordList,
  endpoints.DeleteTPInvoiceRecord,
  endpoints.GetUnverifiedTPInvoices,
  endpoints.HandleTPInvoiceApproval,
  endpoints.GetReadyToSendTPInvoices,
  endpoints.GenerateTPInvoice,
  endpoints.SendTPInvoiceBulkEmail,

  //Master
  endpoints.GetExcludeOptions,
  endpoints.GetClientExclusionList,
  endpoints.InsertClientExclusionEntry,
  endpoints.DeleteClientExclusionEntry,

  //PreTrade
  endpoints.GetAllRecords,
  endpoints.UploadTradeFile, //uncomment this after confirmation from sayali
  endpoints.GetPreTradeReport,
  endpoints.GetPendingApproveStatus,
  endpoints.SavePreTradeApproveStatus,

  //ACCOUNT -> Vendor Creation
  endpoints.ViewVendorDetails,
  endpoints.ViewAccountVendorDetails,
  endpoints.ViewVendorDetailsReport,
  endpoints.SaveVendorDetails,
  endpoints.UpdateVendorDetails,
  endpoints.DeleteVendorDetails,
  endpoints.UploadTdsfile,
  endpoints.VerifyBankDetails,
  endpoints.UpdateAccountApproval,

  //RMS-->REG MASTER
  endpoints.ViewREGMasterdata,
  endpoints.REGNSEFileUpload,
  endpoints.REGBSEFileUpload,
  endpoints.GetFileuploadDetails,

  endpoints.ViewT6SellingReport,
  endpoints.T6NSESellingFileUpload,
  endpoints.T6BSESellingFileUpload,

  endpoints.ViewMTFAgeingReport,
  endpoints.MTFAgeingFileUpload,
  endpoints.MTFStockAgeingFileUpload,

  endpoints.ViewMTFStockAgeingReport,
  endpoints.GetMTFShortfallData,
  endpoints.MergeIntoOdinFile,
  endpoints.MergeIntoSymphonyFile,

  //SPIP
  endpoints.SPIPClientPerformanceSummary,
  endpoints.SPIPClientPerformanceDashboard,
  endpoints.SPIPsubScriptionDetail,
  endpoints.SPIPFeesSharingReport, //this api is used for both client-wise and branch-wise report
  endpoints.SPIPB2BClientDetails,
  endpoints.GenerateClientPerformancePdf,
  endpoints.GetClientMISDetails,

  //Compliance
  endpoints.ViewComplianceData,
  endpoints.InsertComplianceData,
  endpoints.DeleteComplianceData,
  endpoints.UpdateComplianceData,
  endpoints.GetComplianceReport,
  // endpoints.ComplainceReport,
  endpoints.ApproveComplianceData,
  endpoints.getDropDown,
];
