// mfTypes.ts
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
export interface TabItem {
  label: string;
  content?: React.ReactNode; // optional so you can define labels first and add content later
}

export interface BasicTabsProps {
  tabs?: TabItem[];
  heading?: string; // optional heading
  content?: string;
}

export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export const mainMenuC = [
  { id: 1, label: "equity" },
  { id: 2, label: "debt" },
  { id: 3, label: "hybrid" },
  { id: 4, label: "solution" },
  { id: 5, label: "others" },
];

export const MfCardRecoLabel = [
  { id: "1", label: "High Returns", icon: <PaidRoundedIcon /> },
  { id: "2", label: "Tax Savings", icon: <PaidRoundedIcon /> },
  { id: "3", label: "SIP with 100", icon: <PaidRoundedIcon /> },
  { id: "4", label: "SIP with 500", icon: <PaidRoundedIcon /> },
];
export const MfCardPassLabel = [
  { id: "1", label: "High Returns", icon: <PaidRoundedIcon /> },
  { id: "2", label: "Tax Savings", icon: <PaidRoundedIcon /> },
];

export const mutualFundCards = {
  equity: [
    {
      id: 1,
      fundName: "DSP Top 100 Equity Fund - Regular Growth",
      category: "Equity",
      subCategory: "Large Cap Fund",
      minSIP: 100,
      aumCr: 15000,
      minLumpSum: 200000,
      oneWeekReturn: 2.48,
      logo: "https://example.com/dsp-logo.png",
    },
    {
      id: 2,
      fundName: "SBI Small Cap Fund - Direct Plan",
      category: "Equity",
      subCategory: "Small Cap Fund",
      minSIP: 500,
      aumCr: 8000,
      minLumpSum: 5000,
      oneWeekReturn: 3.12,
      logo: "https://example.com/sbi-logo.png",
    },
    {
      id: 3,
      fundName: "HDFC Midcap Opportunities Fund",
      category: "Equity",
      subCategory: "Mid Cap Fund",
      minSIP: 500,
      aumCr: 22000,
      minLumpSum: 10000,
      oneWeekReturn: 1.85,
      logo: "https://example.com/hdfc-logo.png",
    },
  ],

  debt: [
    {
      id: 4,
      fundName: "ICICI Prudential Corporate Bond Fund",
      category: "Debt",
      subCategory: "Corporate Bond",
      minSIP: 1000,
      aumCr: 18000,
      minLumpSum: 5000,
      oneWeekReturn: 0.42,
      logo: "https://example.com/icici-logo.png",
    },
    {
      id: 5,
      fundName: "HDFC Short Term Debt Fund",
      category: "Debt",
      subCategory: "Short Duration",
      minSIP: 500,
      aumCr: 9000,
      minLumpSum: 10000,
      oneWeekReturn: 0.28,
      logo: "https://example.com/hdfc-logo.png",
    },
  ],

  hybrid: [
    {
      id: 6,
      fundName: "HDFC Balanced Advantage Fund",
      category: "Hybrid",
      subCategory: "Balanced Advantage",
      minSIP: 1000,
      aumCr: 35000,
      minLumpSum: 10000,
      oneWeekReturn: 1.75,
      logo: "https://example.com/hdfc-logo.png",
    },
    {
      id: 7,
      fundName: "ICICI Prudential Equity & Debt Fund",
      category: "Hybrid",
      subCategory: "Aggressive Hybrid",
      minSIP: 500,
      aumCr: 12000,
      minLumpSum: 5000,
      oneWeekReturn: 1.25,
      logo: "https://example.com/icici-logo.png",
    },
  ],

  solution: [
    {
      id: 8,
      fundName: "UTI Retirement Benefit Fund",
      category: "Solution",
      subCategory: "Retirement",
      minSIP: 500,
      aumCr: 2000,
      minLumpSum: 5000,
      oneWeekReturn: 0.95,
      logo: "https://example.com/uti-logo.png",
    },
    {
      id: 9,
      fundName: "HDFC Children’s Gift Fund",
      category: "Solution",
      subCategory: "Children",
      minSIP: 1000,
      aumCr: 3500,
      minLumpSum: 5000,
      oneWeekReturn: 1.12,
      logo: "https://example.com/hdfc-logo.png",
    },
  ],

  others: [
    {
      id: 10,
      fundName: "Nippon India Gold Savings Fund",
      category: "Others",
      subCategory: "Commodity - Gold",
      minSIP: 100,
      aumCr: 6000,
      minLumpSum: 1000,
      oneWeekReturn: 0.75,
      logo: "https://example.com/nippon-logo.png",
    },
    {
      id: 11,
      fundName: "Motilal Oswal Nasdaq 100 Fund of Fund",
      category: "Others",
      subCategory: "International",
      minSIP: 500,
      aumCr: 4500,
      minLumpSum: 5000,
      oneWeekReturn: 2.95,
      logo: "https://example.com/motilal-logo.png",
    },
  ],
};
