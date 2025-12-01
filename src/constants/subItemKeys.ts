export const SubItemKeys = {
  SPIP: "SPIP",
  SPIP_Dashboard: "SPIP Performance Dashboard",
  SPIP_Per_Summ: "Client Performance Summary",
  SPIP_SUBSCRIBE_DETAIL: "Client Subscription Details",
  SPIP_BRANCH_WISE_FEES: "Branch-Wise Fees Sharing Report",
  SPIP_CLIENT_WISE_FEES: "Client-Wise Fees Sharing Report",
  SPIP_CLIENT_DETAILS: "Client Details Report",
  SPIP_PERFORMANCE_REPORT: "SPIP Performance Report",
  RH_OVERVIEW: "Overview",
  RH_DIRECT: "Direct Channel",
  RH_INDIRECT: "Indirect Channel",
  EMPLOYEE_TARGET_REPORT: "Employee Target Report",
  RH_PARTNER: "Partner Contest Report",
  RH_ZONE_TARGET: "Zone Target Q3",
  RH_AMC_REPORT: "Client DP AMC Report",
  SPIP_CLIENT_MIS: "SPIP Client MIS",
  INDIRECT_CHANNEL_TARGET: "Indirect Channel Target",
} as const;

export type SubItemKey = (typeof SubItemKeys)[keyof typeof SubItemKeys];
