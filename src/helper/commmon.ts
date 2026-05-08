import { apiServices } from "../services";

export const ButtonsLabel = [
  { id: "1", label: "Daily" },
  { id: "2", label: "Weekly" },
  { id: "3", label: "Monthly" },
  { id: "4", label: "Yearly" },
  { id: "5", label: "Last 7 Days" },
  { id: "6", label: "Till Date" },
];

export const getNextPaymentDateString = (day: string | number) => {
  const today = new Date();
  const selectedDay = Number(day);

  // Move to next month
  const nextMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    selectedDay,
  );

  const month = nextMonth.toLocaleString("default", { month: "long" }); // e.g., "October"
  const year = nextMonth.getFullYear();

  return `${selectedDay}${getDaySuffix(selectedDay)} ${month}, ${year} `;
};

const getDaySuffix = (day: number) => {
  if (day >= 11 && day <= 13) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

export const formatTime = (totalSeconds: number) => {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
};

export const formatDateTime = (dateStr: string) => {
  const date = new Date(dateStr);

  const day = String(date.getDate()).padStart(2, "0");

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[date.getMonth()];

  const year = String(date.getFullYear()).slice(-2); // last 2 digits

  const time = date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return `${day}-${month}-${year} ${time}`;
};

export const relationshipOptions = [
  { label: "Aunt", value: "01" },
  { label: "Brother-In-Law", value: "02" },
  { label: "Brother", value: "03" },
  { label: "Daughter", value: "04" },
  { label: "Daughter-In-Law", value: "05" },
  { label: "Father", value: "06" },
  { label: "Father-In-Law", value: "07" },
  { label: "Grand Daughter", value: "08" },
  { label: "Grand Father", value: "09" },
  { label: "Grand Mother", value: "10" },
  { label: "Grand Son", value: "11" },
  { label: "Mother-In-Law", value: "12" },
  { label: "Mother", value: "13" },
  { label: "Nephew", value: "14" },
  { label: "Niece", value: "15" },
  { label: "Sister", value: "16" },
  { label: "Sister-In-Law", value: "17" },
  { label: "Son", value: "18" },
  { label: "Son-In-Law", value: "19" },
  { label: "Spouse", value: "20" },
  { label: "Uncle", value: "21" },
  { label: "Others", value: "22" },
  { label: "Court Appointed Legal Guardian", value: "23" },
];

export const idTypes = [
  { label: "PAN", value: "1" },
  { label: "Aadhaar", value: "2" },
  { label: "Driving Licence", value: "3" },
  { label: "Passport Number", value: "4" },
];

export const minorOptions = [
  { label: "Yes", value: "Y" },
  { label: "No", value: "N" },
];

export const ELOG_STATUS_LIST = [
  { code: "100", message: "Only Primary Holder Elog Approved." },
  { code: "111", message: "All Holders Elog Approved." },
  {
    code: "101",
    message: "Only Primary Holder and Third Holder Elog Approved.",
  },
  { code: "110", message: "Primary Holder and Second Holder Elog Approved." },
  {
    code: "011",
    message: "Only Secondary Holder and Third Holder Elog Approved.",
  },
  { code: "010", message: "Only Secondary Elog Approved." },
  { code: "001", message: "Only Third Elog Approved." },
  { code: "000", message: "All Holder Elog not approved." },
];

// rows
export const expiryContestCriteriaRows = [
  {
    id: 1,
    da: "Tuesday",
    inde: "Nifty",
    Instumen: "Nifty 50",
  },
  {
    id: 2,
    da: "Thursday",
    inde: "Sensex",
    Instumen: "Sensex",
  },
];

export const combinedDataBySource = [
  {
    data: [
      {
        dummyId: 152,
        month: "Mumbai",
        directChannelDIY: 100,
        DirectSalesTeam: 500,
        APReferrals: 1000,
        EmployeeReferrals: 30,
        REChannel: 25,
        Total: 1655,
        datatype: "weekly",
      },

      {
        dummyId: 157,
        month: "Lucknow",
        directChannelDIY: 85,
        DirectSalesTeam: 400,
        APReferrals: 800,
        EmployeeReferrals: 25,
        REChannel: 20,
        Total: 1330,
        datatype: "monthly",
      },
    ],
    customFlag: "table-1",
  },
  {
    data: [
      {
        dummyId: 1,
        month: "Sep-24",
        directChannelDIY: 111,
        DirectSalesTeam: 352,
        APReferrals: 951,
        EmployeeReferrals: 15,
        REChannel: 25,
        Total: 1454,
        datatype: "weekly",
      },

      {
        dummyId: 21,
        month: "Feb-24",
        directChannelDIY: 81,
        DirectSalesTeam: 361,
        APReferrals: 1053,
        EmployeeReferrals: 27,
        REChannel: 24,
        Total: 1546,
        datatype: "monthly",
      },
      {
        dummyId: 22,
        month: "Apr-24",
        directChannelDIY: 115,
        DirectSalesTeam: 453,
        APReferrals: 1127,
        EmployeeReferrals: 29,
        REChannel: 22,
        Total: 1746,
        datatype: "yearly",
      },
      {
        dummyId: 23,
        month: "Jul-24",
        directChannelDIY: 85,
        DirectSalesTeam: 378,
        APReferrals: 1067,
        EmployeeReferrals: 17,
        REChannel: 25,
        Total: 1572,
        datatype: "Daily",
      },
    ],
    customFlag: "table-2",
  },
  {
    data: [
      {
        dummyId: 24,
        month: "Nov-23",
        directChannelDIY: 104,
        DirectSalesTeam: 352,
        APReferrals: 975,
        EmployeeReferrals: 31,
        REChannel: 16,
        Total: 1578,
        datatype: "tilldate",
      },

      {
        dummyId: 73,
        month: "Jul-24",
        directChannelDIY: 104,
        DirectSalesTeam: 426,
        APReferrals: 1088,
        EmployeeReferrals: 30,
        REChannel: 22,
        Total: 1670,
        datatype: "last7days",
      },
    ],
    customFlag: "table-3",
  },
  {
    data: [
      {
        dummyId: 42,
        month: "Aug-23",
        directChannelDIY: 116,
        DirectSalesTeam: 402,
        APReferrals: 1102,
        EmployeeReferrals: 20,
        REChannel: 21,
        Total: 1641,
        datatype: "yearly",
      },

      {
        dummyId: 484,
        month: "May-24",
        directChannelDIY: 107,
        DirectSalesTeam: 390,
        APReferrals: 1123,
        EmployeeReferrals: 32,
        REChannel: 27,
        Total: 1679,
        datatype: "monthly",
      },
    ],
    customFlag: "table-7",
  },
];

export const expiryContestRewardRows = [
  {
    id: 1,
    noOfLots: 100,
    minBrok: 5000,
    uniqueClients: 5,
    giftVoucher: 500,
  },
  {
    id: 2,
    noOfLots: 200,
    minBrok: 10000,
    uniqueClients: 10,
    giftVoucher: 1000,
  },
];
export const RHexpiryContestRewardRows = [
  {
    id: 1,
    criteria: "Employee",
    noOfLots: 100,
    minBrok: 5000,
    uniqueClients: 5,
    giftVoucher: 500,
  },
  {
    id: 2,
    criteria: "Employee",
    noOfLots: 200,
    minBrok: 10000,
    uniqueClients: 10,
    giftVoucher: 1000,
  },
  {
    id: 3,
    criteria: "Zone",
    noOfLots: 500,
    minBrok: 50000,
    uniqueClients: 20,
    giftVoucher: 2000,
  },
];

export const partnerOnboardingTabs = ["Summary", "Details"];

export const SEGMENTS_DATA = [
  {
    title: "NSE",
    exchange: "NSE",
    items: [
      { label: "NSE Cash", value: "nse_cash", amount: 5000 },
      { label: "NSE FO", value: "nse_fo", amount: 5000 },
      { label: "NSE Currency", value: "nse_currency", amount: 5000 },
      { label: "NSE Commodity", value: "nse_commodity", amount: 500 },
    ],
  },
  {
    title: "BSE",
    exchange: "BSE",
    items: [
      { label: "BSE Cash", value: "bse_cash", amount: 4000 },
      { label: "BSE FO", value: "bse_fo", amount: 4000 },
      { label: "BSE Currency", value: "bse_currency", amount: 4000 },
      { label: "BSE Commodity", value: "bse_commodity", amount: 4000 },
    ],
  },
  {
    title: "MCX",
    exchange: "MCX",
    items: [{ label: "MCX Commodity", value: "mcx_commodity", amount: 2000 }],
  },
  {
    title: "SLBM",
    exchange: "SLBM",
    items: [{ label: "SLBM", value: "slbm", amount: 0 }],
  },
  {
    title: "Security Deposit",
    exchange: "Security Deposit",
    items: [
      { label: "Terminal", value: "terminal", amount: 100000 },
      { label: "Without Terminal", value: "without_terminal", amount: 50000 },
    ],
  },
];

export const ParOnbPartnerSharingData = [
  {
    id: 1,
    segment: "Equity Cash",
    ApShare: "70%",
    LkpShare: "30%",
    minRentation: "0.5",
  },
  {
    id: 2,
    segment: "Equity F&O",
    ApShare: "60%",
    LkpShare: "40%",
    minRentation: "0.5",
  },
  {
    id: 3,
    segment: "Currency",
    ApShare: "50%",
    LkpShare: "50%",
    minRentation: "0.5",
  },
  {
    id: 4,
    segment: "Commodity",
    ApShare: "40%",
    LkpShare: "60%",
    minRentation: "0.5",
  },
  {
    id: 5,
    segment: "Security Deposit",
    ApShare: "30%",
    LkpShare: "70%",
    minRentation: "0.5",
  },
];

export const documentList = [
  {
    category: "NSE",
    fileName: "NSE_Tradingmem&AuthpersonAgree.html",
    label: "Trading member & Authorised Person Agreement",
    path: "...",
    lkpApi: "EsignLKP_NSE",
    payloadType: "sourceFile",
    esignId: 1,
  },

  {
    category: "BSE",
    fileName: "BSE_ApplicationForApRegistartion.html",
    label: "Application for AP Registration",
    path: "\\\\172.17.100.60\\d$\\FileUpload\\PartnerOnBoarding\\Templates\\BSE",
    lkpApi: "Esign_BSELKP_Single",
    payloadType: "template",
    esignId: 2,
  },
  {
    category: "BSE",
    fileName: "BSE_Annexure2(b)(i).html",
    label:
      "Declaration/Confirmation/Undertaking & Recommendation from Member BSE Limited",
    path: "\\\\172.17.100.60\\d$\\FileUpload\\PartnerOnBoarding\\Templates\\BSE",
    lkpApi: "Esign_BSELKP_Single",
    payloadType: "template",
    esignId: 3,
  },
  {
    category: "BSE",
    fileName: "BSE_Annexure2(b)(iii).html",
    label:
      "Application for AP registration (member Covering Letter) should be on LKP letterhead",
    path: "\\\\172.17.100.60\\d$\\FileUpload\\PartnerOnBoarding\\Templates\\BSE",
    lkpApi: "Esign_BSELKP_Single",
    payloadType: "template",
    esignId: 4,
  },
  {
    category: "BSE",
    fileName: "BSE_Annexure2(c).html",
    label: "Agreement between members & AP",
    path: "\\\\172.17.100.60\\d$\\FileUpload\\PartnerOnBoarding\\Templates\\BSE",
    lkpApi: "EsignLKP_BSE", // sourceFile type
    payloadType: "sourceFile",
    esignId: 5,
  },

  {
    category: "MCX",
    fileName: "MCX_Annexure-A.html",
    label: "Undertaking (for Digitally signed Applications for Registration)",
    path: "\\\\172.17.100.60\\d$\\FileUpload\\PartnerOnBoarding\\Templates\\MCX",
    lkpApi: "Esign_MCX_LKP_Single",
    payloadType: "template",
    esignId: 6,
  },
  {
    category: "MCX",
    fileName: "MCX_Ap-6.html",
    label: "Member & Authorised Person Agreement",
    path: "\\\\172.17.100.60\\d$\\FileUpload\\PartnerOnBoarding\\Templates\\MCX",
    lkpApi: "EsignLKP_MCX",
    payloadType: "sourceFile",
    esignId: 7,
  },

  // ================= AGREEMENT =================
  {
    category: "AGREEMENT",
    fileName: "BA_Commercial.html",
    label: "Business agreement between LKP and AP",
    path: "\\\\172.17.100.60\\d$\\FileUpload\\PartnerOnBoarding\\Templates",
    lkpApi: "EsignLKp_BusinessAssociatemerge",
    payloadType: "sourceFile",
    esignId: 8,
  },
];

export const kycDocNameMap = {
  1: "pan",
  2: "residence",
  3: "office",
  4: "education",
  6: "gst",
  14: "other",
};

export const KYC_ESIGN_MAP: Record<number, number> = {
  1: 9,
  2: 10,
  3: 11,
  4: 12,
  6: 13,
  14: 14,
};
export const PartnerSideMenu: Record<string, string> = {
  "Ops Level 1 Approval": "OpsApprove1View",
  "Compliance Approval": "ComplView",
  "Ops Level 2 Approval": "OpsApprove2View",
  "Business Approval": "BusinessView",
  "Management Approval": "ManagementView",
  "Lkp Esign": "HeadView",
};

export const approvalConfig: Record<string, any> = {
  "Ops Level 1 Approval": {
    viewType: "OpsApprove1ViewDetails",
    approveApi: apiServices.OpsApproveLevel1,
    statusKey: "opsApproverStatus1",
    remarkKey: "opsApproverRemark1",
    hasSection: true,
    //  Tabs user can SEE but not approve
    hideApprovalForTabs: [],
    //  Tabs that should be SKIPPED in Next flow
    skipTabsInFlow: [
      "Partner Sharing",
      "Payment",
      "E-signed",
      "Exchange Certificate",
    ],
  },

  "Compliance Approval": {
    viewType: "ComplViewDetails",
    approveApi: apiServices.ComplianceApprove,
    statusKey: "complianceApproverStatus",
    remarkKey: "complianceApproverRemark",
    hasSection: true,
    hideApprovalForTabs: [],
    skipTabsInFlow: [
      "Partner Sharing",
      "Payment",
      "E-signed",
      "Exchange Certificate",
    ],
  },

  "Ops Level 2 Approval": {
    viewType: "OpsApprove2ViewDetails",
    approveApi: apiServices.OpsApproveLevel2,
    statusKey: "opsApproverStatus2",
    remarkKey: "opsApproverRemark2",
    hasSection: true,
    hideApprovalForTabs: [
      "Business Profile",
      "Personal Details",
      "KYC Document",
      "Infrastructure details",
      "Segments",
      "Action",
    ],
    skipTabsInFlow: ["E-signed", "Exchange Certificate"],
  },

  "Business Approval": {
    viewType: "BusinessViewDetails",
    approveApi: apiServices.BusinessApprove,
    statusKey: "businessApproverStatus",
    remarkKey: "businessApproverRemark",
    hasSection: true,
    hideApprovalForTabs: [
      "Business Profile",
      "Personal Details",
      "KYC Document",
      "Infrastructure details",
      "Segments",
      "Action",
    ],
    skipTabsInFlow: ["E-signed", "Exchange Certificate"],
  },

  "Management Approval": {
    viewType: "ManagementViewDetails",
    approveApi: apiServices.ManagmentApprove,
    statusKey: "managmentApproverStatus",
    remarkKey: "managmentApproverRemark",
    hasSection: false,
    hideApprovalForTabs: [
      "Business Profile",
      "Personal Details",
      "KYC Document",
      "Infrastructure details",
      "Segments",
      "Action",
    ],
    skipTabsInFlow: ["E-signed", "Exchange Certificate"],
  },

  "Lkp Esign": {
    viewType: "HeadViewDetails",
    approveApi: apiServices.HeadApprove,
    statusKey: "headApproverStatus",
    remarkKey: null,
    hasSection: false,
    hideApprovalForTabs: [
      "Business Profile",
      "Personal Details",
      "KYC Document",
      "Infrastructure details",
      "Segments",
      "Action",
      "Partner Sharing",
      "Payment",
    ],
    skipTabsInFlow: [],
  },
};
