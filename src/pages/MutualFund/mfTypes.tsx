// mfTypes.ts
import Discover from "./Main/Discover";
import highReturnsImg from "../../assets/images/MF/high_returns.png";
import TaxSavingImg from "../../assets/images/MF/Tax_saving.png";
import sip100Img from "../../assets/images/MF/SIP With 101.png";
import sip500Img from "../../assets/images/MF/SIP With 501.png";
import nfoImg from "../../assets/images/MF/NFO.png";
// import Watchlist from "./Watchlist";
import Portfolio from "./Main/Portfolio";
import Report from "./Main/Report";
import Order from "./Main/Order";
import * as Yup from "yup";
import dayjs from "dayjs";

export const holderSchema = Yup.object().shape({
  pan: Yup.string()
    .length(10, "PAN must be 10 characters")
    .matches(/^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/, "Invalid PAN format")
    .required("PAN is required"),

  mobile: Yup.string()
    .matches(/^[6-9]\d{9}$/, "Invalid mobile number")
    .required("Mobile is required"),

  firstName: Yup.string().required("First name required"),
  lastName: Yup.string().required("Last name required"),

  dob: Yup.date()
    .required("Date of birth is required")
    .max(new Date(), "Future date not allowed")
    .test(
      "age",
      "You must be at least 18 years old",
      (value) => value && dayjs().diff(value, "year") >= 18,
    ),

  gender: Yup.string().required("Gender is required"),

  email: Yup.string().email("Invalid email").required("Email is required"),

  address1: Yup.string()
    // .max(40, "Address 1 Limit is 40 characters")
    .required("Address 1 is required"),
  address2: Yup.string(),
  // .max(40, "Address 2 Limit is 40 characters"),
  address3: Yup.string(),
  // .max(40, "Address 3 Limit is 40 characters"),
  country: Yup.string().required("Country required"),
  state: Yup.string().required("State required"),
  city: Yup.string().required("City required"),
  pincode: Yup.string()
    .matches(/^\d{6}$/, "Invalid pincode")
    .required("Pincode required"),
  // incomeSlab: Yup.string().required(),
  // sourceWealth: Yup.string().required(),
  occupation: Yup.string().required(),
  // pepStatus: Yup.string().required(),
  // kraAddressType: Yup.string().required(),
  taxResident: Yup.string().required(),
  // placeOfBirth: Yup.string().required(),
  // countryOfBirth: Yup.string().required(),
});

export const optionalBankSchema = Yup.object()
  .nullable()
  .test("optional-bank-validation", "", function (value) {
    if (!value) return true;

    const hasAnyValue = Object.entries(value).some(
      ([key, val]) => key !== "isVerified" && Boolean(val),
    );

    if (!hasAnyValue) return true;

    return bankSchema.isValidSync(value, { abortEarly: false });
  });

export const bankSchema = Yup.object({
  bankAccNo: Yup.string()
    .required("Account number required")
    .matches(/^\d{9,18}$/, "Invalid account number"),

  reBankAccNo: Yup.string()
    .oneOf([Yup.ref("bankAccNo")], "Account numbers must match")
    .required("Re-enter account number"),

  ifscCode: Yup.string()
    .required("IFSC required")
    .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC"),

  accountType: Yup.string().required("Select account type"),

  bankName: Yup.string().required("Bank name is required"),

  micrCode: Yup.string().notRequired(), // ✅ optional
});

export const holderBankSchema = Yup.object().shape({
  banks: Yup.array()
    .of(bankSchema)
    .test(
      "bank-2-condition",
      "If any field in Bank 2 is filled, all fields must be filled",
      function (banks?: any[]) {
        if (!banks) return false; // banks is undefined → invalid

        const bank1 = banks[0];
        const bank2 = banks[1];

        // BANK 1 must always be fully filled
        const bank1Filled = Object.values(bank1).every((v) => v !== "");
        if (!bank1Filled) return false;

        // BANK 2 empty → okay
        const bank2AllEmpty = Object.values(bank2).every((v) => v === "");
        if (bank2AllEmpty) return true;

        // BANK 2 partially filled → require all
        const bank2AllFilled = Object.values(bank2).every((v) => v !== "");
        return bank2AllFilled;
      },
    ),
});

export interface TabItem {
  label: string;
  content?: React.ReactNode; // optional so you can define labels first and add content later
}

export interface BasicTabsProps {
  tabs?: TabItem[];
  heading?: string; // optional heading
  content?: string;
  onTabChange?: string;
  customCase?: string;
  onSearchClick?: () => void;
}

export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export interface MutualFundProps {
  rows?: any;
  selectedLabel?: string;
  onSelectFund?: (schemeCode: string) => void;
  onRedeemClick?: (row: any) => void;
  onInvestMoreClick?: (row: any) => void;
}

export interface MutualFundModalProps {
  isOpen: boolean;
  toggle: () => void;
  modalType: "oneTime" | "sip" | "redeem" | null;
  title?: any;
  bseSchemeCode?: string;
  hasToken?: string;
  selectedType?: string;
  onOrderSuccess?: any;
  onBack?: any;
  redeemFolioNumber?: string;
}

export interface BankDetail {
  id: number;
  name: string;
  account: string;
  ifsc: string;
  code: string;
  logo?: string | null;
  paymentMode: string;
  bankName?: any;
  bankAccountNumber?: any;
}

export interface PortfolioRecord {
  id: number;
  userMasterID: number;
  reedosName: string;
  reedosCode: string;
  accountId: number;
  folioNumber: string;
  assetClassId: number;
  balanceQuantity: number;
  investedAmount: number;
  currentValue: number;
  unrealizedProfitLoss: number;
  totalGain: number;
  weightage: number;
  absRet: number;
  noOfDays: number;
  ltp: number;
  avgPrice: number;
  xirr: string | null;
  totalXIRR: string | null;
  physicalQuantity: number;
  // add any other fields you need
}

export interface MandateDetail {
  amount: string;
  mandateId: string;
  status: string;
  [key: string]: any;
}

export interface NestedModalProps {
  isOpen: boolean;
  toggle: () => void;
  title?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  selectedType?: string;
  onConfirm?: (selectedMandate: MandateDetail | null) => void;
  banks: any;
  clientNo: string;
  amount: number | string;
  selectedPaymentType: string | null;
  upiId?: string;
  redeemFolioNumber?: string;
  dateSelected: number | null;
  bseSchemeCode: string | undefined;
  selectedBank: any;
  onBack?: any;
  onOrderSuccess?: any;
}

export interface PortfolioSummary {
  instrumentType: string;
  instrumentTypeId: number;
  sequenceId: number;
  investmentTypeID: number;
  investedAmount: number;
  currentValue: number;
  dividendReinvested: number;
  dividendPaid: number;
  unrealizedProfitLoss: number;
  totalGain: number;
  weightage: number;
  absRet: number;
  avgDays: number;
  interestAmount: number;
  maturityValue: number;
  colorCode: string;
  masterTableID: number;
  xirr: string;
  totalXIRR: string;
}

export interface upComingSIP {
  id: number;
  userMasterID: number;
  reedosName: string;
  accountId: number;
  sipRegsNo: string;
  startDate: string;
  endDate: string;
  amount: number;
  investedAmount: number;
  currentValue: number;
  unrealizedProfitLoss: number;
  totalGain: number;
  xirr: string | null;
  totalXIRR: string | null;
  // ... add other fields if needed
}

export interface TransactionRecord {
  assetClassId: number;
  folioNumber: string;
  security: string;
  isin: string;
  transactionDate: string;
  action: string;
  quantity: number;
  transactionPrice: number;
  netPrice: number;
  brokerage: number;
  amount: number;
  tranId: number;
  accountID: number;
  cumulativeQuantity: number;
  clientName: string;
  status: any;
  bankName: string;
  bankAccNo: any;
  mandateId: number;
  regnDate: string;

  // add more fields as per your response if required
}

export const tabList = [
  { label: "Mandates" },
  { label: "Upcoming SIP" },
  { label: "Ongoing SIP" },
  { label: "Transaction" },
];

export const mainMenuC = [
  { id: 1, label: "equity" },
  { id: 2, label: "debt" },
  { id: 3, label: "hybrid" },
  { id: 4, label: "solution" },
  { id: 5, label: "others" },
];

export const MfCardRecoLabel = [
  { id: "1", label: "High Returns", icon: highReturnsImg, ProductId: 9 },
  { id: "2", label: "Tax Savings", icon: TaxSavingImg, ProductId: 20 },
  { id: "3", label: "SIP with 100", icon: sip100Img, ProductId: 19 },
  { id: "4", label: "SIP with 500", icon: sip500Img, ProductId: 17 },
];
export const MfCardPassLabel = [
  {
    id: "1",
    label: "NFO",
    icon: nfoImg,
  },
  // { id: "2", label: "Tax Savings", icon: <PaidRoundedIcon /> },
];
export const popularTabList = [
  { label: "Large Cap" },
  { label: "ELSS" },
  { label: "Small Cap" },
  { label: "Mid Cap" },
  // { label: "Others" },
];

export const returnPeriodsTabs = [
  { label: "1W", value: "oneWeek" },
  { label: "1M", value: "oneMonth" },
  { label: "3M", value: "threeMonth" },
  { label: "6M", value: "sixMonth" },
  { label: "1Y", value: "oneYear" },
  { label: "3Y", value: "threeYear" },
  { label: "5Y", value: "fiveYear" },
];

export const assetClassTabList = [
  { label: "Equity" },
  { label: "Debt" },
  { label: "Hybrid" },
  { label: "Solution" },
  { label: "Others" },
];

export const mainMenu = [
  {
    id: 1,
    label: "Discover",
    content: (props: any) => <Discover {...props} />,
  },
  {
    id: 3,
    label: "Portfolio",
    content: (props: any) => <Portfolio {...props} />,
  },
  { id: 4, label: "Report", content: (props: any) => <Report {...props} /> },
  { id: 5, label: "Order", content: (props: any) => <Order {...props} /> },
];

export const paymentOptions = [
  {
    id: "upi",
    name: "UPI",
    description: "Paytm, Gpay, BHIM, Bank UPI Apps …",
    icon: "data:image/jpeg;base64,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",
  },
  {
    id: "netbanking",
    name: "Net Banking",
    description: "",
    icon: "data:image/png;base64,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", // Replace with better icon if needed
  },
];

export const holdingTypeOptions = [
  { label: "Single", value: "SI" },
  { label: "Joint", value: "JO" },
  { label: "Anyone or Survivor", value: "AS" },
];
export const holdingCountOptions = [
  { count: 1, label: "Primary Holder" },
  { count: 2, label: "Second Holder" },
  { count: 3, label: "Third Holder" },
];
export const genderOptions = [
  { value: "M", label: "Male" },
  { value: "F", label: "Female" },
  { value: "O", label: "Other" },
];
export const DuoOptions = [
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
];
export const Country = [{ value: "INDIA", label: "India" }];

export const taxOptions = [
  { value: "01", label: "Individual" },
  // { value: "02", label: "On behalf of minor" },
  // { value: "03", label: "HUF" },
  // { value: "04", label: "Company" },
  // { value: "05", label: "AOP" },
  // { value: "06", label: "Partnership Firm" },
  // { value: "07", label: "Body Corporate" },
  // { value: "08", label: "Trust" },
  // { value: "09", label: "Society" },
  // { value: "10", label: "Others" },
  // { value: "11", label: "NRI-Others" },
  // { value: "12", label: "DFI" },
  // { value: "13", label: "Sole Proprietorship" },
  // { value: "21", label: "NRE" },
  // { value: "22", label: "OCB" },
  // { value: "23", label: "FII" },
  // { value: "24", label: "NRO" },
  // { value: "25", label: "Overseas Corp. Body - Others" },
  // { value: "26", label: "NRI Child" },
  // { value: "27", label: "NRI - HUF (NRO)" },
  // { value: "28", label: "NRI - Minor (NRO)" },
  // { value: "29", label: "NRI - HUF (NRE)" },
  // { value: "31", label: "Provident Fund" },
  // { value: "32", label: "Super Annuation Fund" },
  // { value: "33", label: "Gratuity Fund" },
  // { value: "34", label: "Pension Fund" },
  // { value: "36", label: "Mutual Funds FOF Schemes" },
  // { value: "37", label: "NPS Trust" },
  // { value: "38", label: "Global Development Network" },
];

export const occupationOptions = [
  { value: "01", label: "Business" },
  { value: "02", label: "Services" },
  { value: "03", label: "Professional" },
  { value: "04", label: "Agriculture" },
  { value: "05", label: "Retired" },
  { value: "06", label: "Housewife" },
  { value: "07", label: "Student" },
];

export const accountTypeOptions = [
  { value: "SB", label: "Savings Bank" },
  // { value: "CB", label: "Current Bank" },
  // { value: "NE", label: "NRE Account" },
  // { value: "NO", label: "NRO Account" },
];

export const panExemptCategoryOptions = [
  { value: "01", label: "SIKKIM Resident" },
  { value: "02", label: "Transactions carried out on behalf of STATE GOVT" },
  { value: "03", label: "Transactions carried out on behalf of CENTRAL GOVT" },
  { value: "04", label: "COURT APPOINTED OFFICIALS" },
  {
    value: "05",
    label: "UN Entity/Multilateral agency exempt from paying tax in India",
  },
  { value: "06", label: "Official Liquidator" },
  { value: "07", label: "Court Receiver" },
  {
    value: "08",
    label: "Investment in Mutual Funds Upto Rs. 50,000/- p.a. including SIP",
  },
];

export const bankOptions = [
  { label: "ICICI Bank", value: "ICI" },
  { label: "State Bank of India", value: "SBI" },
  { label: "Axis Bank", value: "UTI" },
  { label: "HDFC Bank", value: "HDF" },
  { label: "Kotak Mahindra Bank", value: "162" },
  { label: "AU Small Finance Bank", value: "AUB" },
  { label: "Bandhan Bank", value: "BDN" },
  { label: "Bank of Baroda - Retail", value: "BBR" },
  { label: "Bank of Baroda - Corporate", value: "BBC" },
  { label: "Bank of India", value: "BOI" },
  { label: "Canara Bank", value: "CNB" },
  { label: "Capital Bank", value: "CPB" },
  { label: "City Union Bank", value: "CUB" },
  { label: "Cosmos Bank", value: "COB" },
  { label: "Deutsche Bank", value: "DBK" },
  { label: "HSBC", value: "HSB" },
  { label: "IDBI Bank", value: "IDB" },
  { label: "IDFC Bank", value: "IDN" },
  { label: "Indian Overseas Bank", value: "IOB" },
  { label: "IndusInd Bank", value: "IDS" },
  { label: "Jana Small Finance Bank", value: "JNB" },
  { label: "Karur Vysya Bank Limited", value: "KVB" },
  { label: "Kerala Gramin Bank", value: "KGB" },
  { label: "Punjab and Sind Bank", value: "PSB" },
  { label: "Punjab National Bank", value: "PNB" },
  { label: "Ratnakar Bank", value: "RBL" },
  { label: "Saraswat Bank", value: "SWB" },
  { label: "SBM Bank", value: "SOM" },
  { label: "Shivalik Small Finance Bank Ltd.", value: "SHB" },
  { label: "South Indian Bank", value: "SIB" },
  { label: "Standard Chartered Bank", value: "SCB" },
  { label: "Surat Bank", value: "SUR" },
  { label: "Sutex Bank", value: "SUT" },
  { label: "UCO Bank", value: "UCO" },
  { label: "Ujjivan Bank", value: "UJV" },
  { label: "Union Bank of India", value: "UBI" },
  { label: "UPI (ICICI Bank Gateway)", value: "IC4" },
  { label: "Utkarsh Bank", value: "UTK" },
  { label: "Yes Bank", value: "YBK" },
];

export const normalizeKycData = (data: any, ckycFlag: boolean) => {
  if (ckycFlag) {
    // CKYC true
    const details =
      data?.clsDownloadCKYCDataResponse?.download_response?.personal_details;

    return {
      firstName: details?.first_name || "",
      middleName: details?.middle_name || "",
      lastName: details?.last_name || "",
      pan: details?.pan || "",
      dob: details?.dob ? dayjs(details.dob, "DD-MM-YYYY") : null,
      email: details?.email || "",
      gender:
        details?.gender === "M"
          ? "Male"
          : details?.gender === "F"
            ? "Female"
            : "",
      address1: details?.perm_line1 || "",
      address2: details?.perm_line2 || "",
      address3: details?.perm_line3 || "",
      city: details?.perm_city || "",
      state: getStateValue(details?.perm_state),
      country: getCountryValue(details?.perm_country),
      pincode: details?.perm_pin || "",
    };
  } else {
    // CKYC false
    const client = data?.[0] || {};

    return {
      firstName: client?.firstName || "",
      middleName: client?.middlename || "",
      lastName: client?.lastname || "",
      pan: client?.panno || "",
      // dob: client?.dob || "",
      email: client?.email || "",
      address1: client?.address1 || "",
      address2: client?.address2 || "",
      address3: client?.address3 || "",
      city: client?.city || "",
      state: getStateValue(client?.state),
      country: getCountryValue(client?.country),
      pincode: client?.pinCode || "",
    };
  }
};

export const States = [
  { value: "AN", label: "Andaman & Nicobar Islands" },
  { value: "AR", label: "Arunachal Pradesh" },
  { value: "AP", label: "Andhra Pradesh" },
  { value: "AS", label: "Assam" },
  { value: "BH", label: "Bihar" },
  { value: "CH", label: "Chandigarh" },
  { value: "CG", label: "Chhattisgarh" },
  { value: "GA", label: "Goa" },
  { value: "GU", label: "Gujarat" },
  { value: "HA", label: "Haryana" },
  { value: "HP", label: "Himachal Pradesh" },
  { value: "JM", label: "Jammu & Kashmir" },
  { value: "JK", label: "Jharkhand" },
  { value: "KA", label: "Karnataka" },
  { value: "KE", label: "Kerala" },
  { value: "MP", label: "Madhya Pradesh" },
  { value: "MA", label: "Maharashtra" },
  { value: "MN", label: "Manipur" },
  { value: "ME", label: "Meghalaya" },
  { value: "MI", label: "Mizoram" },
  { value: "NA", label: "Nagaland" },
  { value: "ND", label: "New Delhi" },
  { value: "OR", label: "Orissa" },
  { value: "PO", label: "Pondicherry" },
  { value: "PU", label: "Punjab" },
  { value: "RA", label: "Rajasthan" },
  { value: "SI", label: "Sikkim" },
  { value: "TG", label: "Telengana" },
  { value: "TN", label: "Tamil Nadu" },
  { value: "TR", label: "Tripura" },
  { value: "UP", label: "Uttar Pradesh" },
  { value: "UC", label: "Uttaranchal" },
  { value: "WB", label: "West Bengal" },
  { value: "DN", label: "Dadra and Nagar Haveli" },
  { value: "DD", label: "Daman and Diu" },
  { value: "LD", label: "Lakshadweep" },
  { value: "OH", label: "Others" },
];

const getStateValue = (state: string) => {
  if (!state) return "";

  const found = States.find(
    (s) =>
      s.label.toLowerCase() === state.toLowerCase() ||
      s.value.toLowerCase() === state.toLowerCase(),
  );

  return found ? found.value : "";
};

const getCountryValue = (country: string) => {
  if (!country) return "";
  return country.toUpperCase() === "INDIA" ? "INDIA" : country;
};
