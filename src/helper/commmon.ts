export const ButtonsLabel = [
  { id: "1", label: "Daily" },
  { id: "2", label: "Weekly" },
  { id: "3", label: "Monthly" },
  { id: "4", label: "Yearly" },
  { id: "5", label: "Last 7 Days" },
  { id: "6", label: "Till Date" },
];
export const RegulatorAnnouncements = [
  {
    dummyId: 1,
    date: "2023-01-10",
    department: "KYC",
    subject:
      "acus. Id malesuada blandit cursus sollicitudin amet neque egestas malesuada montes. Netus ipsum ultrices in sed vel blandit euismod commodo. Aliquet eget purus varius nisi nibh.",
    lkpComments: "View",
    circular: "https://example.com/download/circular1.pdf",
    modalText:
      "Lorem ipsum dolor sit amet consectetur. Tempor egeit amet consectetur. Tempor egeit amet consectetur. Tempor egeit amet consectetur. Tempor eget porttitor aliquet lacus. Id malesuada blandit cursus sollicitudin amet neque egestas malesuada montes. Netus ipsum ultrices in sed vel blandit euismod commodo. Aliquet eget purus varius ",
  },
  {
    dummyId: 3,
    date: "2023-01-10",
    department: "Compliance",
    subject:
      "Lorem ipsum dolor sit atus ipsum ultrices in sed vel blandit euismod commodo. Aliquet eget purus varius nisi nibh.",
    lkpComments: "View",
    circular: "https://example.com/download/circular3.pdf",
    modalText:
      "Lnsectetur. Tempor egeit amet consectetur. Tempor egeit amet consectetur. Tempor eget porttitor aliquet lacus. Id malesuada blandit cursus sollicitudin amet neque egestas malesuada montes. Netus ipsum ultrices in sed vel blandit euismod commodo. Aliquet eget purus varius ",
  },
];

export const dummyClientPlanData = [
  {
    dummyId: 1,
    zone: "West",
    status: "Pending",
    branch: "Mumbai",
    ClientCode: "CL001",
    ClientName: "Rohit Sharma",
    ClientType: "Direct",
    segment: "Equity",
    existingPlan: "Plan A",
    proposedPlan: "Plan B",
  },
];
export const monthlyDataT = [];

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

export const mutualFundRows = [
  {
    id: 1,
    fundName: "Axis Bluechip Fund",
    minSIP: 100,
    minLumpSum: 5000,
    aumCr: 32000,
    returns: 143332.5,
  },
  {
    id: 2,
    fundName: "SBI Small Cap Fund",
    minSIP: 500,
    minLumpSum: 5000,
    aumCr: 15000,
    returns: 18.2,
  },
  {
    id: 3,
    fundName: "HDFC Top 100 Fund",
    minSIP: 100,
    minLumpSum: 5000,
    aumCr: 42000,
    returns: 11.8,
  },
  {
    id: 4,
    fundName: "ICICI Prudential Equity & Debt Fund",
    minSIP: 500,
    minLumpSum: 5000,
    aumCr: 28000,
    returns: 13.4,
  },
  {
    id: 5,
    fundName: "Kotak Flexicap Fund",
    minSIP: 100,
    minLumpSum: 5000,
    aumCr: 19000,
    returns: 14.1,
  },
  {
    id: 6,
    fundName: "Nippon India Growth Fund",
    minSIP: 100,
    minLumpSum: 5000,
    aumCr: 22000,
    returns: 16.7,
  },
  {
    id: 7,
    fundName: "UTI Nifty Index Fund",
    minSIP: 100,
    minLumpSum: 1000,
    aumCr: 10500,
    returns: 10.2,
  },
  {
    id: 8,
    fundName: "Mirae Asset Large Cap Fund",
    minSIP: 1000,
    minLumpSum: 5000,
    aumCr: 36000,
    returns: 13.6,
  },
  {
    id: 9,
    fundName: "Parag Parikh Flexi Cap Fund",
    minSIP: 1000,
    minLumpSum: 1000,
    aumCr: 27000,
    returns: 15.9,
  },
  {
    id: 10,
    fundName: "Canara Robeco Bluechip Equity Fund",
    minSIP: 1000,
    minLumpSum: 5000,
    aumCr: 9500,
    returns: 12.9,
  },
  {
    id: 11,
    fundName: "Axis Midcap Fund",
    minSIP: 500,
    minLumpSum: 5000,
    aumCr: 18000,
    returns: 17.4,
  },
  {
    id: 12,
    fundName: "SBI Magnum Multicap Fund",
    minSIP: 100,
    minLumpSum: 5000,
    aumCr: 12000,
    returns: 13.1,
  },
  {
    id: 13,
    fundName: "ICICI Prudential Value Discovery Fund",
    minSIP: 100,
    minLumpSum: 5000,
    aumCr: 21000,
    returns: 12.7,
  },
  {
    id: 14,
    fundName: "Franklin India Smaller Companies Fund",
    minSIP: 500,
    minLumpSum: 5000,
    aumCr: 8000,
    returns: 19.5,
  },
  {
    id: 15,
    fundName: "Aditya Birla Sun Life Tax Relief 96",
    minSIP: 500,
    minLumpSum: 500,
    aumCr: 9200,
    returns: 14.8,
  },
  {
    id: 16,
    fundName: "DSP Midcap Fund",
    minSIP: 500,
    minLumpSum: 5000,
    aumCr: 10000,
    returns: 16.3,
  },
  {
    id: 17,
    fundName: "Motilal Oswal Nasdaq 100 FOF",
    minSIP: 500,
    minLumpSum: 500,
    aumCr: 4200,
    returns: 20.2,
  },
  {
    id: 18,
    fundName: "Edelweiss Balanced Advantage Fund",
    minSIP: 500,
    minLumpSum: 5000,
    aumCr: 8500,
    returns: 9.8,
  },
  {
    id: 19,
    fundName: "Tata Digital India Fund",
    minSIP: 500,
    minLumpSum: 5000,
    aumCr: 7500,
    returns: 21.4,
  },
  {
    id: 20,
    fundName: "Invesco India Growth Opportunities Fund",
    minSIP: 1000,
    minLumpSum: 1000,
    aumCr: 6400,
    returns: 15.2,
  },
];
export const getNextPaymentDateString = (day: string | number) => {
  const today = new Date();
  const selectedDay = Number(day);

  // Move to next month
  const nextMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    selectedDay
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
