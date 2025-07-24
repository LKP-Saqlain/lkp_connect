export const SubItemKeys = {
  SPIP: "SPIP",
  SPIP_Dashboard: "SPIP Performance Dashboard",
  SPIP_Per_Summ: "Client Performance Summary",
  SPIP_SUBSCRIBE_DETAIL: "Client Subscription Details",
  SPIP_BRANCH_WISE_FEES: "Branch-Wise Fees Sharing Report",
  SPIP_CLIENT_WISE_FEES: "Client-Wise Fees Sharing Report",
  SPIP_CLIENT_DETAILS: "Client Details Report",
  SPIP_PERFORMANCE_REPORT: "SPIP Performance Report",
  RH_OVERVIEW: "UCCCode MATCH",
} as const;

export type SubItemKey = (typeof SubItemKeys)[keyof typeof SubItemKeys];
