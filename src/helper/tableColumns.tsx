import { GridColDef } from "@mui/x-data-grid";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import React from "react";
import Tooltip from "@mui/material/Tooltip";
import dayjs from "dayjs";
import { Button } from "@mui/material";
// import PersonAddIcon from "@mui/icons-material/PersonAdd";
// import { FaUserPen } from "react-icons/fa6";

interface ClientRow {
  ClientCode: string;
  ClientName: string;
  LastTradeDate: string;
  ClientStatus: string;
}

export const getClientActivityStatusColumns = (
  handleViewDetails: (row: ClientRow) => void,
  user_type: string // Added user_type parameter
): GridColDef[] => {
  const baseColumns: GridColDef[] = [
    {
      disableColumnMenu: true,
      field: "ClientCode",
      headerName: "Client Code",
      align: "left",
      flex: 1,
    },
    {
      disableColumnMenu: true,
      field: "ClientName",
      headerName: "Client Name",
      flex: 2,
    },
    {
      field: "LastTradeDate",
      headerClassName: "header-wrap-custom",
      headerName: "Last Trade Date",
      flex: 1.5,
      disableColumnMenu: true,
      align: "center",
      valueGetter: (params: any) => {
        const rawDate = params;
        if (!rawDate) return null;
        const parsedDate = new Date(
          rawDate.replace(
            /(\d{2})-([A-Za-z]{3})-(\d{2})/,
            (match: any, day: any, month: any, year: any) => {
              const monthMap: any = {
                Jan: "01",
                Feb: "02",
                Mar: "03",
                Apr: "04",
                May: "05",
                Jun: "06",
                Jul: "07",
                Aug: "08",
                Sep: "09",
                Oct: "10",
                Nov: "11",
                Dec: "12",
              };
              console.log(handleViewDetails, match);
              return `20${year}-${monthMap[month]}-${day}`;
            }
          )
        );

        return parsedDate;
      },
      sortComparator: (v1, v2) => {
        if (!v1 || !v2) return 0; // Handle missing values
        return v1 - v2; // Sort in ascending order
      },
      valueFormatter: (params: any) => {
        if (!params) return "";
        return dayjs(params).format("DD-MMM-YY"); // Converts to "03-Apr-24"
      },
    },
    {
      field: "ClientStatus",
      headerName: "Status",
      flex: 0.8,
      align: "center",
      headerAlign: "center",
      disableColumnMenu: true,
    },
    {
      field: "BranchCode",
      headerName: "Branch Code",
      headerClassName: "header-wrap-custom",
      flex: 0.8,
      align: "center",
      headerAlign: "center",
      disableColumnMenu: true,
    },
    {
      field: "ActivationDate",
      headerName: "Activation Date",
      headerClassName: "header-wrap-custom",
      width: 110,
      align: "center",
      headerAlign: "center",
      disableColumnMenu: true,
      valueGetter: (params: any) => {
        const rawDate = params;
        if (!rawDate) return null;
        const parsedDate = new Date(
          rawDate.replace(
            /(\d{2})-([A-Za-z]{3})-(\d{2})/,
            (match: any, day: any, month: any, year: any) => {
              const monthMap: any = {
                Jan: "01",
                Feb: "02",
                Mar: "03",
                Apr: "04",
                May: "05",
                Jun: "06",
                Jul: "07",
                Aug: "08",
                Sep: "09",
                Oct: "10",
                Nov: "11",
                Dec: "12",
              };
              console.log(match);
              return `20${year}-${monthMap[month]}-${day}`;
            }
          )
        );

        return parsedDate;
      },
      sortComparator: (v1, v2) => {
        if (!v1 || !v2) return 0; // Handle missing values
        return v1 - v2; // Sort in ascending order
      },
      valueFormatter: (params: any) => {
        if (!params) return "";
        return dayjs(params).format("DD-MMM-YY"); // Converts to "03-Apr-24"
      },
    },
    {
      field: "MobileNo",
      headerName: "Mobile No",
      width: 110,
      align: "center",
      headerAlign: "center",
      disableColumnMenu: true,
      renderCell: (params: any) => {
        const mobile = params.value || "";
        const maskedMobile = mobile.replace(
          /^(\d{2})(\d+)(\d{2})$/,
          (_: any, prefix: any, middle: any, suffix: any) => {
            console.log(prefix, suffix, handleViewDetails); // Added only for testing purpose
            return `${prefix}${"X".repeat(middle.length)}${suffix}`;
          }
        );
        return (
          <Tooltip title={mobile} arrow placement="top">
            <span style={{ cursor: "pointer" }}>{maskedMobile}</span>
          </Tooltip>
        );
      },
    },
  ];

  // Conditionally include MTFStatus column for Employee only
  const mtfColumn: GridColDef[] =
    user_type === "Employee"
      ? [
          {
            field: "MTFStatus",
            headerName: "MTF Status",
            headerClassName: "header-wrap-custom",
            flex: 1.7,
            align: "center",
            headerAlign: "center",
            disableColumnMenu: true,
          },
        ]
      : [];

  const finalColumns: GridColDef[] = [
    ...baseColumns,
    ...mtfColumn,
    {
      field: "POAStatus",
      headerName: "POA Status",
      flex: 1,
      align: "center",
      headerAlign: "center",
      disableColumnMenu: true,
      headerClassName: "header-wrap-custom",
    },
  ];

  return finalColumns;
};

export const accNo = [
  { value: "15770340001410", label: "15770340001410" },
  { value: "57500001047915", label: "57500001047915" },
];
export const PaymentType = [
  { value: "ALL", label: "ALL" },
  { value: "NEFT", label: "NEFT" },
  { value: "RTGS", label: "RTGS" },
  { value: "IMPS", label: "IMPS" },
  { value: "OTHER", label: "OTHER" },
  { value: "UPI", label: "UPI" },
  { value: "Fund Trans", label: "Fund Trans" },
];

export const getRegulatorAnnouncement: GridColDef[] = [
  {
    field: "date",
    headerName: "Date",
    flex: 1,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "department",
    headerName: "Department",
    flex: 1,
    disableColumnMenu: true,
    headerAlign: "center",
  },
  {
    field: "subject",
    headerName: "Subject",
    flex: 3.1,
    disableColumnMenu: true,
    headerAlign: "center",
    renderCell: (params) => (
      <div style={{ padding: "0px 3px" }}>{params.value}</div>
    ),
  },
  {
    field: "lkpComments",
    headerName: "LKP Comments",
    flex: 1.1,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    // alignItems:"center"
  },
  {
    field: "circular",
    headerName: "Circular",
    flex: 1.1,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
];

export const getAccountDetails: GridColDef[] = [
  {
    field: "month",
    headerName: "Month",
    flex: 1.1,
    disableColumnMenu: true,
    headerAlign: "center",
  },
  {
    field: "directChannelDIY",
    headerName: "Direct Channel (DIY)",
    flex: 1.9,
    disableColumnMenu: true,
    headerAlign: "center",
  },
  {
    field: "DirectSalesTeam",
    headerName: "Direct Sales team",
    flex: 1.7,
    disableColumnMenu: true,
    headerAlign: "center",
  },
  {
    field: "APReferrals",
    headerName: "AP Referrals",
    flex: 1.4,
    disableColumnMenu: true,
    headerAlign: "center",
  },
  {
    field: "EmployeeReferrals",
    headerName: "Employee Referrals",
    flex: 1.8,
    disableColumnMenu: true,
    headerAlign: "center",
  },
  {
    field: "REChannel",
    headerName: "R&E Channel",
    flex: 1.5,
    disableColumnMenu: true,
    headerAlign: "center",
  },
  {
    field: "Total",
    headerName: "Total",
    flex: 1,
    disableColumnMenu: true,
    headerAlign: "center",
  },
];

export const cardDetails = [
  {
    id: 1,
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQN14vLyQvBxXJf60w_-n1dPFhqV-W6bjWwbw&s",
    title: "LKP Brochure",
    pdfUrl: " ",
  },
  {
    id: 2,
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6ibwvGamxlftRJQz6fFT3h7HH-aKKwxWmAQ&s",
    title: "SPIP Brochure",
    pdfUrl: "../../../public/JavaScript-Core.pdf",
  },
  {
    id: 3,
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQN14vLyQvBxXJf60w_-n1dPFhqV-W6bjWwbw&s",
    title: "Festival Creatives",
    pdfUrl: "",
  },
];

export const getCommChecker: GridColDef[] = [
  {
    field: "status",
    headerName: "Approve | Reject",
    headerClassName: "header-wrap-custom",
    minWidth: 150,
    flex: 1,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: "DateOfCommunication",
    headerName: "Date",
    minWidth: 110,
    flex: 0.9,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    valueGetter: (params: any) => {
      const rawDate = params;
      if (!rawDate) return null; // Handle missing data

      const parsedDate = new Date(
        rawDate.replace(
          /(\d{2})-([A-Za-z]{3})-(\d{2})/,
          (match: any, day: any, month: any, year: any) => {
            const monthMap: any = {
              Jan: "01",
              Feb: "02",
              Mar: "03",
              Apr: "04",
              May: "05",
              Jun: "06",
              Jul: "07",
              Aug: "08",
              Sep: "09",
              Oct: "10",
              Nov: "11",
              Dec: "12",
            };
            console.log(match);
            return `20${year}-${monthMap[month]}-${day}`;
          }
        )
      );

      return parsedDate;
    },
    sortComparator: (v1, v2) => {
      if (!v1 || !v2) return 0; // Handle missing values
      return v1 - v2; // Sort in ascending order
    },
    valueFormatter: (params: any) => {
      if (!params) return "";
      return dayjs(params).format("DD-MMM-YY"); // Converts to "03-Apr-24"
    },
  },
  {
    field: "TypeOfDocuments",
    headerName: "Type of Document",
    minWidth: 180,
    flex: 1.2,
    disableColumnMenu: true,
    headerAlign: "center",
  },
  {
    field: "CommunicationType",
    headerName: "Communication Type",
    minWidth: 160,
    flex: 1,
    disableColumnMenu: true,
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
  },
  {
    field: "CommunicationProof",
    headerName: "Communication Description",
    minWidth: 240,
    flex: 1.8,
    disableColumnMenu: true,
    headerAlign: "center",
  },
  {
    field: "Department",
    headerName: "Department",
    minWidth: 150,
    flex: 1,
    disableColumnMenu: true,
    headerAlign: "center",
  },
  {
    field: "CommunicationProofPath",
    headerName: "Document",
    minWidth: 150,
    flex: 1,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
];

export const getClientDormantStatus = (
  handleViewDetails: (row: ClientRow) => void
): GridColDef[] => [
  {
    field: "ctermcode",
    headerName: "Client Code",
    align: "left",
    flex: 1.2,
    disableColumnMenu: true,
  },
  {
    field: "clientName",
    headerName: "Client Name",
    flex: 2,
    disableColumnMenu: true,
  },
  {
    field: "lastTradeDate",
    headerName: "Last Trade Date",
    flex: 1.5,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
    valueGetter: (params: any) => {
      const rawDate = params;
      if (!rawDate) return null; // Handle missing data

      const parsedDate = new Date(
        rawDate.replace(
          /(\d{2})-([A-Za-z]{3})-(\d{2})/,
          (match: any, day: any, month: any, year: any) => {
            const monthMap: any = {
              Jan: "01",
              Feb: "02",
              Mar: "03",
              Apr: "04",
              May: "05",
              Jun: "06",
              Jul: "07",
              Aug: "08",
              Sep: "09",
              Oct: "10",
              Nov: "11",
              Dec: "12",
            };
            console.log(match);
            return `20${year}-${monthMap[month]}-${day}`;
          }
        )
      );

      return parsedDate;
    },
    sortComparator: (v1, v2) => {
      if (!v1 || !v2) return 0; // Handle missing values
      return v1 - v2; // Sort in ascending order
    },
    valueFormatter: (params: any) => {
      if (!params) return "";
      return dayjs(params).format("DD-MMM-YY"); // Converts to "03-Apr-24"
    },
  },

  {
    field: "mobileNo",
    headerName: "Mobile No",
    flex: 1.2,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    renderCell: (params: any) => {
      const mobile = params.value || ""; // Extract the mobile number

      // Mask all digits except the first 2 and the last 2
      const maskedMobile = mobile.replace(
        /^(\d{2})(\d+)(\d{2})$/,
        (_: any, prefix: any, middle: any, suffix: any) => {
          console.log(prefix, suffix, handleViewDetails); // Added only for testing purpose
          return `${prefix}${"X".repeat(middle.length)}${suffix}`;
        }
      );

      // Return tooltip with the masked mobile number
      return (
        <Tooltip title={mobile} arrow placement="top">
          <span style={{ cursor: "pointer" }}>{maskedMobile}</span>
        </Tooltip>
      );
    },
  },
  {
    field: "dayCount",
    headerName: "Days to Dormant",
    flex: 1.2,
    align: "right",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
  },
  {
    field: "viewDetails",
    headerName: "Action",
    width: 150,
    headerAlign: "center",
    align: "center",
    renderCell: (params: any) => (
      <Button
        onClick={() => handleViewDetails(params.row)}
        // onClick={() => console.log("rowValues", params.row)}
        variant="contained"
        color="primary"
        style={{
          padding: "2px 9px",
          backgroundColor: "#11395C",
          fontSize: "10px",
          borderRadius: "10px",
          textTransform: "capitalize",
          fontFamily: "Public Sans",
        }}
      >
        View Details
      </Button>
    ),
  },
];

export const Corecolumns: GridColDef[] = [
  { field: "clientCode", headerName: "Client Code", minWidth: 80 },
  {
    field: "alertSequenceNo",
    headerName: "Alert Sequence No",
    minWidth: 80,
    headerClassName: "header-wrap-custom",
  },
  {
    field: "virtualAccount",
    headerName: "Virtual Account",
    minWidth: 80,
    headerClassName: "header-wrap-custom",
  },
  {
    field: "lkP_AccountNumber",
    headerName: "LKP Account Number",
    minWidth: 180,
    headerClassName: "header-wrap-custom",
  },
  { field: "debitCredit", headerName: "Debit/Credit", minWidth: 80 },
  { field: "amount", headerName: "Amount", minWidth: 100 },
  { field: "client_Name", headerName: "Client Name", minWidth: 80 },
  {
    field: "client_AccountNumber",
    headerName: "Client Account Number",
    minWidth: 180,
  },
  { field: "client_Bank", headerName: "Client Bank", minWidth: 80 },
  { field: "client_IFSC", headerName: "Client IFSC", minWidth: 80 },
  { field: "chequeNo", headerName: "Cheque No", minWidth: 80 },
  {
    field: "userReferenceNumber",
    headerName: "User Reference Number",
    minWidth: 180,
  },
  { field: "payment_Type", headerName: "Payment Type", minWidth: 80 },
  { field: "valueDate", headerName: "Value Date", minWidth: 80 },
  {
    field: "transactionDescription",
    headerName: "Transaction Description",
    minWidth: 200,
  },
  {
    field: "transactionDate",
    headerName: "Transaction Date",
    minWidth: 80,
    headerClassName: "header-wrap-custom",
  },
];

export const slbmColumns: GridColDef[] = [
  {
    field: "zone",
    headerName: "Zone",
    minWidth: 60,
    flex: 0.5,
    disableColumnMenu: true,
  },
  {
    field: "branchCode",
    headerName: "Branch Code",
    minWidth: 90,
    flex: 0.6,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
  },
  {
    field: "clientCode",
    headerName: "Client Code",
    minWidth: 110,
    flex: 0.8,
    disableColumnMenu: true,
    align: "left",
  },
  {
    field: "clientName",
    headerName: "Client Name",
    minWidth: 200,
    flex: 1.5,
    disableColumnMenu: true,
  },
  {
    field: "scripName",
    headerName: "Script Name",
    minWidth: 200,
    flex: 1.2,
    disableColumnMenu: true,
  },
  {
    field: "isin",
    headerName: "ISIN",
    minWidth: 120,
    flex: 1,
    disableColumnMenu: true,
  },
  {
    field: "qtny",
    headerName: "Quantity",
    minWidth: 90,
    flex: 0.7,
    disableColumnMenu: true,
    align: "left",
  },
  {
    field: "rmName",
    headerName: "RM Name",
    minWidth: 120,
    flex: 1,
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
  },
  {
    field: "dealerName",
    headerName: "Dealer Name",
    minWidth: 120,
    flex: 1,
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
  },
  {
    field: "slbmStatus",
    headerName: "SLBM Status",
    minWidth: 110,
    flex: 0.7,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
  },
];

export const clientNotTradedColumns: GridColDef[] = [
  {
    field: "ClientCode",
    headerName: "Client Code",
    flex: 1.3,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "ClientName",
    headerName: "Client Name",
    flex: 2.2,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "BranchCode",
    headerName: "Branch Code",
    flex: 1,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "ActivationDate",
    headerName: "Activation Date",
    flex: 1.5,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    // valueFormatter: (params: any) =>
    //   new Date(params.value).toLocaleDateString("en-IN", {
    //     day: "2-digit",
    //     month: "short",
    //     year: "numeric",
    //   }),
    valueGetter: (params: any) => {
      const rawDate = params;
      if (!rawDate) return null; // Handle missing data

      const parsedDate = new Date(
        rawDate.replace(
          /(\d{2})-([A-Za-z]{3})-(\d{2})/,
          (match: any, day: any, month: any, year: any) => {
            const monthMap: any = {
              Jan: "01",
              Feb: "02",
              Mar: "03",
              Apr: "04",
              May: "05",
              Jun: "06",
              Jul: "07",
              Aug: "08",
              Sep: "09",
              Oct: "10",
              Nov: "11",
              Dec: "12",
            };
            console.log(match);
            return `20${year}-${monthMap[month]}-${day}`;
          }
        )
      );

      return parsedDate;
    },
    sortComparator: (v1, v2) => {
      if (!v1 || !v2) return 0; // Handle missing values
      return v1 - v2; // Sort in ascending order
    },
    valueFormatter: (params: any) => {
      if (!params) return "";
      return dayjs(params).format("DD-MMM-YY"); // Converts to "03-Apr-24"
    },
  },
  {
    field: "LastTradeDate",
    headerName: "Last Trade Date",
    flex: 1.5,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    valueGetter: (params: any) => {
      const rawDate = params;
      if (!rawDate) return null; // Handle missing data

      const parsedDate = new Date(
        rawDate.replace(
          /(\d{2})-([A-Za-z]{3})-(\d{2})/,
          (match: any, day: any, month: any, year: any) => {
            const monthMap: any = {
              Jan: "01",
              Feb: "02",
              Mar: "03",
              Apr: "04",
              May: "05",
              Jun: "06",
              Jul: "07",
              Aug: "08",
              Sep: "09",
              Oct: "10",
              Nov: "11",
              Dec: "12",
            };
            console.log(match);
            return `20${year}-${monthMap[month]}-${day}`;
          }
        )
      );

      return parsedDate;
    },
    sortComparator: (v1, v2) => {
      if (!v1 || !v2) return 0; // Handle missing values
      return v1 - v2; // Sort in ascending order
    },
    valueFormatter: (params: any) => {
      if (!params) return "";
      return dayjs(params).format("DD-MMM-YY"); // Converts to "03-Apr-24"
    },
  },
  {
    field: "Active",
    headerName: "Active",
    flex: 0.8,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
];

export const newClientAddFiveDays: GridColDef[] = [
  {
    field: "ClientCode",
    headerName: "Client Code",
    flex: 1,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "ClientName",
    headerName: "Client Name",
    flex: 2,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "BranchCode",
    headerName: "Branch Code",
    flex: 0.9,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "ActivationDate",
    headerName: "Activation Date",
    flex: 1.2,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    valueGetter: (params: any) => {
      const rawDate = params;
      if (!rawDate) return null; // Handle missing data

      const parsedDate = new Date(
        rawDate.replace(
          /(\d{2})-([A-Za-z]{3})-(\d{2})/,
          (match: any, day: any, month: any, year: any) => {
            const monthMap: any = {
              Jan: "01",
              Feb: "02",
              Mar: "03",
              Apr: "04",
              May: "05",
              Jun: "06",
              Jul: "07",
              Aug: "08",
              Sep: "09",
              Oct: "10",
              Nov: "11",
              Dec: "12",
            };
            console.log(match);
            return `20${year}-${monthMap[month]}-${day}`;
          }
        )
      );

      return parsedDate;
    },
    sortComparator: (v1, v2) => {
      if (!v1 || !v2) return 0; // Handle missing values
      return v1 - v2; // Sort in ascending order
    },
    valueFormatter: (params: any) => {
      if (!params) return "";
      return dayjs(params).format("DD-MMM-YY"); // Converts to "03-Apr-24"
    },
  },
  {
    field: "Active",
    headerName: "Active",
    flex: 0.5,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "LastTradeDate",
    headerName: "Last Trade Date",
    flex: 1.5,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    valueGetter: (params: any) => {
      const rawDate = params;
      if (!rawDate) return null; // Handle missing data

      const parsedDate = new Date(
        rawDate.replace(
          /(\d{2})-([A-Za-z]{3})-(\d{2})/,
          (match: any, day: any, month: any, year: any) => {
            const monthMap: any = {
              Jan: "01",
              Feb: "02",
              Mar: "03",
              Apr: "04",
              May: "05",
              Jun: "06",
              Jul: "07",
              Aug: "08",
              Sep: "09",
              Oct: "10",
              Nov: "11",
              Dec: "12",
            };
            console.log(match);
            return `20${year}-${monthMap[month]}-${day}`;
          }
        )
      );

      return parsedDate;
    },
    sortComparator: (v1, v2) => {
      if (!v1 || !v2) return 0; // Handle missing values
      return v1 - v2; // Sort in ascending order
    },
    valueFormatter: (params: any) => {
      if (!params) return "";
      return dayjs(params).format("DD-MMM-YY"); // Converts to "03-Apr-24"
    },
  },
];

export const spipRenewalColumns: GridColDef[] = [
  {
    field: "IACode",
    headerName: "IA Code",
    width: 90,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "ClientName",
    headerName: "Client Name",
    width: 250,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "Backofficecode",
    headerName: "Back Office Code",
    width: 90,
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
  },

  {
    field: "MobileNo",
    headerName: "Mobile No",
    width: 120,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
    renderCell: (params: any) => {
      const mobile = params.value || ""; // Extract the mobile number

      // Mask all digits except the first 2 and the last 2
      const maskedMobile = mobile.replace(
        /^(\d{2})(\d+)(\d{2})$/,
        (_: any, prefix: any, middle: any, suffix: any) => {
          console.log(prefix, suffix); // Added only for testing purpose
          return `${prefix}${"X".repeat(middle.length)}${suffix}`;
        }
      );

      // Return tooltip with the masked mobile number
      return (
        <Tooltip title={mobile} arrow placement="top">
          <span style={{ cursor: "pointer" }}>{maskedMobile}</span>
        </Tooltip>
      );
    },
  },

  {
    field: "Active",
    headerName: "Active",
    width: 90,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "ActivationDate",
    headerName: "Activation Date",
    width: 120,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    valueGetter: (params: any) => {
      const rawDate = params;
      if (!rawDate) return null; // Handle missing data

      const parsedDate = new Date(
        rawDate.replace(
          /(\d{2})-([A-Za-z]{3})-(\d{2})/,
          (match: any, day: any, month: any, year: any) => {
            const monthMap: any = {
              Jan: "01",
              Feb: "02",
              Mar: "03",
              Apr: "04",
              May: "05",
              Jun: "06",
              Jul: "07",
              Aug: "08",
              Sep: "09",
              Oct: "10",
              Nov: "11",
              Dec: "12",
            };
            console.log(match);
            return `20${year}-${monthMap[month]}-${day}`;
          }
        )
      );

      return parsedDate;
    },
    sortComparator: (v1, v2) => {
      if (!v1 || !v2) return 0; // Handle missing values
      return v1 - v2; // Sort in ascending order
    },
    valueFormatter: (params: any) => {
      if (!params) return "";
      return dayjs(params).format("DD-MMM-YY"); // Converts to "03-Apr-24"
    },
  },
  {
    field: "EndDate",
    headerName: "Renewal due on",
    width: 120,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    valueGetter: (params: any) => {
      const rawDate = params;
      if (!rawDate) return null; // Handle missing data

      const parsedDate = new Date(
        rawDate.replace(
          /(\d{2})-([A-Za-z]{3})-(\d{2})/,
          (match: any, day: any, month: any, year: any) => {
            const monthMap: any = {
              Jan: "01",
              Feb: "02",
              Mar: "03",
              Apr: "04",
              May: "05",
              Jun: "06",
              Jul: "07",
              Aug: "08",
              Sep: "09",
              Oct: "10",
              Nov: "11",
              Dec: "12",
            };
            console.log(match);
            return `20${year}-${monthMap[month]}-${day}`;
          }
        )
      );

      return parsedDate;
    },
    sortComparator: (v1, v2) => {
      if (!v1 || !v2) return 0; // Handle missing values
      return v1 - v2; // Sort in ascending order
    },
    valueFormatter: (params: any) => {
      if (!params) return "";
      return dayjs(params).format("DD-MMM-YY"); // Converts to "03-Apr-24"
    },
  },
  {
    field: "RMCode",
    headerName: "RM Code",
    width: 100,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
];

export const upcomingDormantClientColumns: GridColDef[] = [
  {
    field: "ClientCode",
    headerName: "Client Code",
    flex: 1.5,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "ClientName",
    headerName: "Client Name",
    flex: 2,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "LastTradeDate",
    headerName: "Last Trade Date",
    flex: 1.5,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    valueGetter: (params: any) => {
      const rawDate = params;
      if (!rawDate) return null; // Handle missing data

      const parsedDate = new Date(
        rawDate.replace(
          /(\d{2})-([A-Za-z]{3})-(\d{2})/,
          (match: any, day: any, month: any, year: any) => {
            const monthMap: any = {
              Jan: "01",
              Feb: "02",
              Mar: "03",
              Apr: "04",
              May: "05",
              Jun: "06",
              Jul: "07",
              Aug: "08",
              Sep: "09",
              Oct: "10",
              Nov: "11",
              Dec: "12",
            };
            console.log(match);
            return `20${year}-${monthMap[month]}-${day}`;
          }
        )
      );

      return parsedDate;
    },
    sortComparator: (v1, v2) => {
      if (!v1 || !v2) return 0; // Handle missing values
      return v1 - v2; // Sort in ascending order
    },
    valueFormatter: (params: any) => {
      if (!params) return "";
      return dayjs(params).format("DD-MMM-YY"); // Converts to "03-Apr-24"
    },
  },
  {
    field: "MobileNo",
    headerName: "Mobile No",
    flex: 1,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
    renderCell: (params: any) => {
      const mobile = params.value || ""; // Extract the mobile number

      // Mask all digits except the first 2 and the last 2
      const maskedMobile = mobile.replace(
        /^(\d{2})(\d+)(\d{2})$/,
        (_: any, prefix: any, middle: any, suffix: any) => {
          console.log(prefix, suffix); // Added only for testing purpose
          return `${prefix}${"X".repeat(middle.length)}${suffix}`;
        }
      );

      // Return tooltip with the masked mobile number
      return (
        <Tooltip title={mobile} arrow placement="top">
          <span style={{ cursor: "pointer" }}>{maskedMobile}</span>
        </Tooltip>
      );
    },
  },
  {
    field: "DayCount",
    headerName: "Days to Dormant",
    headerClassName: "header-wrap-custom",
    flex: 1,
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
  },
];

export const spipSubscriptionColumns: GridColDef[] = [
  {
    field: "IACode",
    headerName: "IA Code",
    // flex: 1.5,
    width: 90,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "ClientName",
    headerName: "Client Name",
    width: 200,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "Backofficecode",
    headerName: "Backoffice Code",
    // flex: 1.5,
    width: 120,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    valueGetter: (params: any) => params || "-", // Show '-' if empty
  },
  {
    field: "BranchCode",
    headerName: "Branch Code",
    // flex: 1,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "MobileNo",
    headerName: "Mobile No",
    // flex: 1.5,
    width: 110,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
    renderCell: (params) => {
      const mobile = params.value || ""; // Extract the mobile number

      // Mask all digits except the first 2 and the last 2
      const maskedMobile = mobile.replace(
        /^(\d{2})(\d+)(\d{2})$/,
        (_match: any, prefix: any, middle: any, suffix: any) =>
          `${prefix}${"X".repeat(middle.length)}${suffix}`
      );

      return (
        <Tooltip title={mobile} arrow placement="top">
          <span style={{ cursor: "pointer" }}>{maskedMobile}</span>
        </Tooltip>
      );
    },
  },
  {
    field: "EmailId",
    headerName: "Email ID",
    // flex: 2,
    width: 200,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "Active",
    headerName: "Active",
    // flex: 1,
    width: 60,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "ActivationDate",
    headerName: "Activation Date",
    // flex: 1.5,
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    align: "center",
    width: 90,
    disableColumnMenu: true,
    valueGetter: (params: any) => {
      if (!params) return "-";
      return dayjs(params, "DD-MMM-YY").toDate();
    },
    valueFormatter: (params: any) => {
      if (!params) return "-";
      return dayjs(params).format("DD-MMM-YY"); // Converts to "27-Feb-24"
    },
  },
  {
    field: "RMCode",
    headerName: "RM Code",
    // flex: 1,
    width: 80,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "Amount",
    headerName: "Amount",
    // flex: 1.5,
    width: 80,
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
    valueFormatter: (params: any) => `₹${params}`, // Format as currency
  },
];

export const ClientCashColumns: GridColDef[] = [
  {
    field: "ClientCode",
    headerName: "Client Code",
    flex: 1.2,
    minWidth: 120,
    headerAlign: "left",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "ClientName",
    headerName: "Client Name",
    flex: 2,
    minWidth: 200,
    disableColumnMenu: true,
  },
  {
    field: "LastTradeDate",
    headerName: "Last Trade Date",
    flex: 1,
    minWidth: 115,
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    align: "center",
    headerAlign: "center",
    valueGetter: (params: any) => {
      const rawDate = params;
      if (!rawDate) return null; // Handle missing data

      const parsedDate = new Date(
        rawDate.replace(
          /(\d{2})-([A-Za-z]{3})-(\d{2})/,
          (match: any, day: any, month: any, year: any) => {
            const monthMap: any = {
              Jan: "01",
              Feb: "02",
              Mar: "03",
              Apr: "04",
              May: "05",
              Jun: "06",
              Jul: "07",
              Aug: "08",
              Sep: "09",
              Oct: "10",
              Nov: "11",
              Dec: "12",
            };
            console.log(match);
            return `20${year}-${monthMap[month]}-${day}`;
          }
        )
      );

      return parsedDate;
    },
    sortComparator: (v1, v2) => {
      if (!v1 || !v2) return 0; // Handle missing values
      return v1 - v2; // Sort in ascending order
    },
    valueFormatter: (params: any) => {
      if (!params) return "";
      return dayjs(params).format("DD-MMM-YY"); // Converts to "03-Apr-24"
    },
  },
  {
    field: "Cash",
    headerName: "Ledger Balance",
    flex: 1.2,
    minWidth: 120,
    align: "right",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
    disableColumnMenu: true,
  },
  {
    field: "MobileNo",
    headerName: "Mobile No",
    flex: 1,
    minWidth: 120,
    disableColumnMenu: true,
    align: "center",
    headerAlign: "center",
    renderCell: (params: any) => {
      const mobile = params.value || ""; // Extract the mobile number

      // Mask all digits except the first 2 and the last 2
      const maskedMobile = mobile.replace(
        /^(\d{2})(\d+)(\d{2})$/,
        (_: any, prefix: any, middle: any, suffix: any) => {
          console.log(prefix, suffix); // Added only for testing purpose
          return `${prefix}${"X".repeat(middle.length)}${suffix}`;
        }
      );

      // Return tooltip with the masked mobile number
      return (
        <Tooltip title={mobile} arrow placement="top">
          <span style={{ cursor: "pointer" }}>{maskedMobile}</span>
        </Tooltip>
      );
    },
  },
  {
    field: "Brokerage_for_currentmonth",
    headerName: "Current Month Brokerage",
    flex: 1.2,
    minWidth: 140,
    align: "right",
    headerAlign: "center",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "Brokerage_for_1month",
    headerName: "Last Month Brokerage",
    flex: 1.2,
    minWidth: 140,
    align: "right",
    headerAlign: "center",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "Brokerage_for_3months",
    headerName: "3 Month Brokerage",
    flex: 1.2,
    minWidth: 140,
    align: "right",
    headerAlign: "center",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
];
export const T6Columns: GridColDef[] = [
  {
    field: "ClientCode",
    headerName: "Client Code",
    flex: 1,
    minWidth: 105,
    headerAlign: "left",
    align: "left",
    // sortable: false,
    disableColumnMenu: true,
  },
  {
    field: "ClientName",
    headerName: "Client Name",
    disableColumnMenu: true,
    flex: 2.2,
    minWidth: 220,
  },
  {
    field: "ClosingBal",
    headerName: "Closing Balance",
    flex: 1.2,
    minWidth: 120,
    align: "right",
    headerClassName: "header-wrap-custom",
    headerAlign: "center",
    disableColumnMenu: true,
    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "StockValue",
    headerName: "Stock Value",
    // flex: 1,
    width: 130,
    align: "right",
    headerAlign: "center",
    disableColumnMenu: true,
    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "G5",
    headerName: ">T5",
    width: 110,
    align: "right",
    headerAlign: "center",
    disableColumnMenu: true,
    // valueFormatter: (params: number) =>
    //   new Intl.NumberFormat("en-IN").format(params),
    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "T5",
    headerName: "T5",
    width: 100,
    align: "right",
    headerAlign: "center",
    disableColumnMenu: true,
    // valueFormatter: (params: number) =>
    //   new Intl.NumberFormat("en-IN").format(params),
    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "T4",
    headerName: "T4",
    width: 100,
    align: "right",
    headerAlign: "center",
    disableColumnMenu: true,
    // valueFormatter: (params: number) =>
    //   new Intl.NumberFormat("en-IN").format(params),
    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "T3",
    headerName: "T3",
    width: 100,
    align: "right",
    headerAlign: "center",
    disableColumnMenu: true,
    // valueFormatter: (params: number) =>
    //   new Intl.NumberFormat("en-IN").format(params),
    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "T2",
    headerName: "T2",
    width: 100,
    align: "right",
    headerAlign: "center",
    disableColumnMenu: true,
    // valueFormatter: (params: number) =>
    //   new Intl.NumberFormat("en-IN").format(params),
    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "T1",
    headerName: "T1",
    width: 100,
    align: "right",
    headerAlign: "center",
    disableColumnMenu: true,
    // valueFormatter: (params: number) =>
    //   new Intl.NumberFormat("en-IN").format(params),
    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
];

export const T6OverViewColumns: GridColDef[] = [
  {
    field: "ClientCode",
    headerName: "Client Code",
    // flex: 1,
    minWidth: 105,
    headerAlign: "left",
    align: "left",
    // sortable: false,
    disableColumnMenu: true,
  },
  {
    field: "ClientName",
    headerName: "Client Name",
    // flex: 2,
    minWidth: 220,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "ClosingBal",
    headerName: "Closing Balance",
    flex: 0.8,
    minWidth: 120,
    align: "right",
    headerAlign: "center",
    disableColumnMenu: true,
    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "StockValue",
    headerName: "Stock Value",
    // flex: 1,
    width: 100,
    align: "right",
    headerAlign: "center",
    disableColumnMenu: true,
    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "G5",
    headerName: ">T5",
    width: 80,
    align: "right",
    headerAlign: "center",
    disableColumnMenu: true,
    // valueFormatter: (params: number) =>
    //   new Intl.NumberFormat("en-IN").format(params),
    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "T5",
    headerName: "T5",
    width: 80,
    align: "right",
    headerAlign: "center",
    disableColumnMenu: true,
    // valueFormatter: (params: number) =>
    //   new Intl.NumberFormat("en-IN").format(params),
    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "T4",
    headerName: "T4",
    width: 80,
    align: "right",
    headerAlign: "center",
    disableColumnMenu: true,
    // valueFormatter: (params: number) =>
    //   new Intl.NumberFormat("en-IN").format(params),
    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "T3",
    headerName: "T3",
    width: 80,
    align: "right",
    headerAlign: "center",
    disableColumnMenu: true,
    // valueFormatter: (params: number) =>
    //   new Intl.NumberFormat("en-IN").format(params),
    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "T2",
    headerName: "T2",
    width: 80,
    align: "right",
    headerAlign: "center",
    disableColumnMenu: true,
    // valueFormatter: (params: number) =>
    //   new Intl.NumberFormat("en-IN").format(params),
    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "T1",
    headerName: "T1",
    width: 80,
    align: "right",
    headerAlign: "center",
    disableColumnMenu: true,
    // valueFormatter: (params: number) =>
    //   new Intl.NumberFormat("en-IN").format(params),
    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
];

export const DPDebitRecovery: GridColDef[] = [
  {
    field: "Email_link",
    headerName: "Send Email",
    headerClassName: "header-wrap-custom",
    minWidth: 75,
    flex: 0.3,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: "payment_link",
    headerName: "Payment\nLink",
    headerClassName: "header-wrap-custom",
    minWidth: 75,
    flex: 0.3,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
    renderCell: (params: any) => {
      const { Payment_link, EnCAccountCode } = params.row;
      if (!Payment_link || !EnCAccountCode)
        return <span>No Link Available</span>;

      const fullLink = `${Payment_link}${EnCAccountCode}`;
      const [copied, setCopied] = React.useState(false);

      const handleCopy = () => {
        navigator.clipboard
          .writeText(fullLink)
          .then(() => {
            console.log("Copied to clipboard:", fullLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
          })
          .catch((error) => {
            console.error("Failed to copy:", error);
          });
      };

      return (
        <>
          {/* <a
            href={fullLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#11395C", textDecoration: "underline" }}
          >
            Click here
          </a>{" "} */}
          {/* or{" "} */}
          {copied ? (
            <span style={{ color: "#11395C" }}>Copied!</span> // Show "Copied!" text
          ) : (
            <ContentCopyIcon
              fontSize="small"
              style={{ color: "#11395C", cursor: "pointer" }}
              onClick={handleCopy}
              titleAccess="Copy to clipboard"
            />
          )}
        </>
      );
    },
  },
  {
    field: "ClientCode",
    headerName: "Client Code",
    headerClassName: "header-wrap-custom",
    minWidth: 95,
    flex: 0.7,
    align: "left",
    headerAlign: "center",
    disableColumnMenu: true,
  },
  {
    field: "BOID",
    headerName: "BOID",
    minWidth: 160,
    flex: 1.2,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
  },
  {
    field: "BOName",
    headerName: "Client Name",
    minWidth: 200,
    flex: 1.5,
    disableColumnMenu: true,
  },
  {
    field: "Ledger_DebitAmt",
    headerName: "Ledger Debit",
    headerClassName: "header-wrap-custom",
    minWidth: 110,
    flex: 1,
    align: "right",
    headerAlign: "center",
    disableColumnMenu: true,
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },

    // below code is used when we have rounded value eg 142

    // valueFormatter: (params: any) => {
    //   const value = parseFloat(params?.value); // Safely parse the value
    //   if (isNaN(value)) {
    //     return ""; // Return an empty string for invalid values
    //   }
    //   return value % 1 === 0
    //     ? new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value)
    //     : new Intl.NumberFormat("en-IN", {
    //         minimumFractionDigits: 2,
    //         maximumFractionDigits: 2,
    //       }).format(value);
    // },
  },
  {
    field: "Holding_value",
    headerName: "Holding Value",
    headerClassName: "header-wrap-custom",
    minWidth: 120,
    flex: 1,
    align: "right",
    headerAlign: "center",
    disableColumnMenu: true,
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "Client_Mobile_No",
    headerName: "Mobile No",
    minWidth: 130,
    flex: 1,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    renderCell: (params: any) => {
      const mobile = params.value || ""; // Extract the mobile number

      // Mask all digits except the first 2 and the last 2
      const maskedMobile = mobile.replace(
        /^(\d{2})(\d+)(\d{2})$/,
        (_: any, prefix: any, middle: any, suffix: any) => {
          console.log(prefix, suffix); // Added only for testing purpose
          return `${prefix}${"X".repeat(middle.length)}${suffix}`;
        }
      );

      // Return tooltip with the masked mobile number
      return (
        <Tooltip title={mobile} arrow placement="top">
          <span style={{ cursor: "pointer" }}>{maskedMobile}</span>
        </Tooltip>
      );
    },
  },
  {
    field: "Client_Mail_ID",
    headerName: "Email ID",
    minWidth: 200,
    flex: 1.2,
    align: "left",
    headerAlign: "center",
    disableColumnMenu: true,
    renderCell: (params: any) => {
      const email = params.value || ""; // Extract the email ID

      // Mask the email if it exists
      const maskedEmail = email.replace(
        /^(.)(.*)(.@.*)$/, // Regex to capture parts of the email
        (_: any, firstChar: any, middleChars: any, domain: any) => {
          return `${firstChar}${"x".repeat(middleChars.length)}${domain}`;
        }
      );

      // Return tooltip with the original email and masked email for display
      return (
        <Tooltip title={email} arrow placement="top">
          <span style={{ cursor: "pointer" }}>{maskedEmail}</span>
        </Tooltip>
      );
    },
  },
  {
    field: "BOStatus",
    headerName: "Status",
    minWidth: 100,
    flex: 0.6,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
  },
  {
    field: "AcStatus",
    headerName: "Category",
    minWidth: 100,
    flex: 0.6,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
  },
  {
    field: "Last_Trade_date",
    headerName: "Last Trade Date",
    headerClassName: "header-wrap-custom",
    minWidth: 120,
    flex: 0.8,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
  },
];

export const terminalcol: GridColDef[] = [
  {
    field: "TerminalId",
    headerName: "Terminal Id",
    flex: 0.9,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "LoginId",
    headerName: "Terminal User",
    flex: 0.6,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
  },
  {
    field: "CertiRegNo",
    headerName: "Certificate No",
    flex: 2.3,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "MarketSegment",
    headerName: "Exchange",
    flex: 1.2,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "CertiValidityDate",
    headerName: " Validity Date",
    flex: 0.7,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "ServerName",
    headerName: "Server Name",
    flex: 0.9,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
];

export const RegisDetails: GridColDef[] = [
  {
    field: "Segment",
    headerName: "Segment",
    width: 200,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "AP Registration Number",
    headerName: "AP Registration Number",
    width: 150,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
  },
  {
    field: "Date of Registration",
    headerName: "Date of Registration",
    width: 130,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
  },
  {
    field: "Registration Office",
    headerName: "Registration Office",
    flex: 1,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
];

export const DormantOverViewColumns: GridColDef[] = [
  {
    field: "ctermcode",
    headerName: "Client Code",
    flex: 1.2,
    minWidth: 120,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "clientName",
    headerName: "Client Name",
    flex: 2.5,
    minWidth: 200,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
    renderCell: (params: any) => {
      return (
        <Tooltip title={params.row?.mobileNo} arrow placement="top">
          <span>{params.value}</span>
        </Tooltip>
      );
    },
  },
  {
    field: "dayCount",
    headerName: "Days to Dormant",
    flex: 1,
    minWidth: 110,
    align: "right",
    headerAlign: "center",
    headerClassName: "header-wrap",
    disableColumnMenu: true,
  },
  {
    field: "lastTradeDate",
    headerName: "Last Trade Date",
    flex: 1.5,
    minWidth: 130,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    valueGetter: (params: any) => {
      const rawDate = params;
      if (!rawDate) return null; // Handle missing data

      const parsedDate = new Date(
        rawDate.replace(
          /(\d{2})-([A-Za-z]{3})-(\d{2})/,
          (match: any, day: any, month: any, year: any) => {
            const monthMap: any = {
              Jan: "01",
              Feb: "02",
              Mar: "03",
              Apr: "04",
              May: "05",
              Jun: "06",
              Jul: "07",
              Aug: "08",
              Sep: "09",
              Oct: "10",
              Nov: "11",
              Dec: "12",
            };
            console.log(match);
            return `20${year}-${monthMap[month]}-${day}`;
          }
        )
      );

      return parsedDate;
    },
    sortComparator: (v1, v2) => {
      if (!v1 || !v2) return 0; // Handle missing values
      return v1 - v2; // Sort in ascending order
    },
    valueFormatter: (params: any) => {
      if (!params) return "";
      return dayjs(params).format("DD-MMM-YY"); // Converts to "03-Apr-24"
    },
  },
];

export const QPayoutColumns: GridColDef[] = [
  {
    field: "accountcode",
    headerName: "Client Code",
    minWidth: 100,
    disableColumnMenu: true,
    align: "left",
  },
  {
    field: "clientName",
    headerName: "Client Name",
    minWidth: 230,
    flex: 2,
    disableColumnMenu: true,
  },
  {
    field: "lastTradeDate",
    headerName: "Last Trade Date",
    minWidth: 10,
    align: "center",
    headerAlign: "center",
    flex: 1.2,
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    valueGetter: (params: any) => {
      const rawDate = params;
      if (!rawDate) return null; // Handle missing data

      const parsedDate = new Date(
        rawDate.replace(
          /(\d{2})-([A-Za-z]{3})-(\d{2})/,
          (match: any, day: any, month: any, year: any) => {
            const monthMap: any = {
              Jan: "01",
              Feb: "02",
              Mar: "03",
              Apr: "04",
              May: "05",
              Jun: "06",
              Jul: "07",
              Aug: "08",
              Sep: "09",
              Oct: "10",
              Nov: "11",
              Dec: "12",
            };
            console.log(match);
            return `20${year}-${monthMap[month]}-${day}`;
          }
        )
      );

      return parsedDate;
    },
    sortComparator: (v1, v2) => {
      if (!v1 || !v2) return 0; // Handle missing values
      return v1 - v2; // Sort in ascending order
    },
    valueFormatter: (params: any) => {
      if (!params) return "";
      return dayjs(params).format("DD-MMM-YY"); // Converts to "03-Apr-24"
    },
  },

  {
    field: "mobileno",
    headerName: "Mobile no.",
    minWidth: 90,
    flex: 1.2,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    renderCell: (params: any) => {
      const mobile = params.value || ""; // Extract the mobile number

      // Mask all digits except the first 2 and the last 2
      const maskedMobile = mobile.replace(
        /^(\d{2})(\d+)(\d{2})$/,
        (_: any, prefix: any, middle: any, suffix: any) => {
          console.log(prefix, suffix); // Added only for testing purpose
          return `${prefix}${"X".repeat(middle.length)}${suffix}`;
        }
      );

      // Return tooltip with the masked mobile number
      return (
        <Tooltip title={mobile} arrow placement="top">
          <span style={{ cursor: "pointer" }}>{maskedMobile}</span>
        </Tooltip>
      );
    },
  },
  {
    field: "payout_Amt",
    headerName: "Payout Amt",
    minWidth: 150,
    align: "right",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    headerAlign: "center",
    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "receipt_Amt",
    headerName: "Receipt Amt",
    minWidth: 120,
    headerClassName: "header-wrap-custom",
    align: "right",
    disableColumnMenu: true,
    headerAlign: "center",
    // valueFormatter: (params: number) =>
    //   new Intl.NumberFormat("en-IN").format(params),

    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "extra_Payin",
    headerName: "Extra Payin",
    minWidth: 120,
    align: "right",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    // valueFormatter: (params: number) =>
    //   new Intl.NumberFormat("en-IN").format(params),

    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
];

export const dormantColumns = (user_type: string): GridColDef[] => {
  const EmployeeColumns: GridColDef[] = [
    {
      field: "ctermcode",
      headerName: "Client Code",
      minWidth: 90,
      flex: 0.6,
      align: "left",
      disableColumnMenu: true,
    },
    {
      field: "clientName",
      headerName: "Client Name",
      minWidth: 170,
      flex: 1.5,
      disableColumnMenu: true,
    },
    {
      field: "lastTradeDate",
      headerName: "Last Trade Date",
      minWidth: 120,
      flex: 1,
      align: "center",
      headerAlign: "center",
      disableColumnMenu: true,
      headerClassName: "header-wrap-custom",
      valueGetter: (params: any) => {
        const rawDate = params;
        if (!rawDate) return null; // Handle missing data

        const parsedDate = new Date(
          rawDate.replace(
            /(\d{2})-([A-Za-z]{3})-(\d{2})/,
            (match: any, day: any, month: any, year: any) => {
              const monthMap: any = {
                Jan: "01",
                Feb: "02",
                Mar: "03",
                Apr: "04",
                May: "05",
                Jun: "06",
                Jul: "07",
                Aug: "08",
                Sep: "09",
                Oct: "10",
                Nov: "11",
                Dec: "12",
              };
              console.log(match);
              return `20${year}-${monthMap[month]}-${day}`;
            }
          )
        );

        return parsedDate;
      },
      sortComparator: (v1: any, v2: any) => {
        if (!v1 || !v2) return 0; // Handle missing values
        return v1 - v2; // Sort in ascending order
      },
      valueFormatter: (params: any) => {
        if (!params) return "";
        return dayjs(params).format("DD-MMM-YY"); // Converts to "03-Apr-24"
      },
    },
    {
      field: "active",
      headerName: "Active",
      minWidth: 70,
      flex: 0.4,
      align: "center",
      headerAlign: "center",
      disableColumnMenu: true,
    },
    {
      field: "branchcode",
      headerName: "Branch Code",
      headerClassName: "header-wrap-custom",
      minWidth: 90,
      flex: 0.8,
      align: "center",
      headerAlign: "center",
      disableColumnMenu: true,
    },
    {
      field: "zone",
      headerName: "Zone",
      minWidth: 80,
      flex: 0.6,
      align: "center",
      headerAlign: "center",
      disableColumnMenu: true,
    },
    {
      field: "branchtype",
      headerName: "Branch Type",
      minWidth: 110,
      headerClassName: "header-wrap-custom",
      flex: 0.8,
      align: "center",
      headerAlign: "center",
      disableColumnMenu: true,
    },
    {
      field: "activationDate",
      headerName: "Activation Date",
      minWidth: 120,
      headerClassName: "header-wrap-custom",
      disableColumnMenu: true,
      flex: 1,
      align: "center",
      headerAlign: "center",
      valueGetter: (params: any) => {
        const rawDate = params;
        if (!rawDate) return null; // Handle missing data

        const parsedDate = new Date(
          rawDate.replace(
            /(\d{2})-([A-Za-z]{3})-(\d{2})/,
            (match: any, day: any, month: any, year: any) => {
              const monthMap: any = {
                Jan: "01",
                Feb: "02",
                Mar: "03",
                Apr: "04",
                May: "05",
                Jun: "06",
                Jul: "07",
                Aug: "08",
                Sep: "09",
                Oct: "10",
                Nov: "11",
                Dec: "12",
              };
              console.log(match);
              return `20${year}-${monthMap[month]}-${day}`;
            }
          )
        );

        return parsedDate;
      },
      sortComparator: (v1: any, v2: any) => {
        if (!v1 || !v2) return 0; // Handle missing values
        return v1 - v2; // Sort in ascending order
      },
      valueFormatter: (params: any) => {
        if (!params) return "";
        return dayjs(params).format("DD-MMM-YY"); // Converts to "03-Apr-24"
      },
    },
    {
      field: "mobileNo",
      headerName: "Mobile No",
      minWidth: 120,
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params: any) => {
        const mobile = params.value || ""; // Extract the mobile number

        // Mask all digits except the first 2 and the last 2
        const maskedMobile = mobile.replace(
          /^(\d{2})(\d+)(\d{2})$/,
          (_: any, prefix: any, middle: any, suffix: any) => {
            console.log(prefix, suffix); // Added only for testing purpose
            return `${prefix}${"X".repeat(middle.length)}${suffix}`;
          }
        );

        // Return tooltip with the masked mobile number
        return (
          <Tooltip title={mobile} arrow placement="top">
            <span style={{ cursor: "pointer" }}>{maskedMobile}</span>
          </Tooltip>
        );
      },
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 220,
      flex: 1.5,
      disableColumnMenu: true,
      renderCell: (params: any) => {
        const email = params.value || ""; // Extract the email ID

        // Mask the email if it exists
        const maskedEmail = email.replace(
          /^(.)(.*)(.@.*)$/, // Regex to capture parts of the email
          (_: any, firstChar: any, middleChars: any, domain: any) => {
            return `${firstChar}${"x".repeat(middleChars.length)}${domain}`;
          }
        );

        // Return tooltip with the original email and masked email for display
        return (
          <Tooltip title={email} arrow placement="top">
            <span style={{ cursor: "pointer" }}>{maskedEmail}</span>
          </Tooltip>
        );
      },
    },

    {
      field: "brokerageGeneratedinFY1920",
      headerName: "Brok FY1920",
      minWidth: 100,
      flex: 0.7,
      align: "right",
      headerAlign: "center",
      headerClassName: "header-wrap-custom",
      disableColumnMenu: true,
    },
    {
      field: "brokerageGeneratedinFY2021",
      headerName: "Brok FY2021",
      minWidth: 100,
      flex: 0.7,
      align: "right",
      headerAlign: "center",
      headerClassName: "header-wrap-custom",
      disableColumnMenu: true,
      valueFormatter: (params: number) =>
        new Intl.NumberFormat("en-IN").format(params),
    },
    {
      field: "brokerageGeneratedinFY2122",
      headerName: "Brok FY2122",
      minWidth: 100,
      flex: 0.7,
      align: "right",
      headerAlign: "center",
      headerClassName: "header-wrap-custom",
      disableColumnMenu: true,
      valueFormatter: (params: number) =>
        new Intl.NumberFormat("en-IN").format(params),
    },
    {
      field: "brokerageGeneratedinFY2223",
      headerName: "Brok FY2223",
      minWidth: 100,
      flex: 0.7,
      align: "right",
      headerAlign: "center",
      headerClassName: "header-wrap-custom",
      disableColumnMenu: true,
      valueFormatter: (params: number) =>
        new Intl.NumberFormat("en-IN").format(params),
    },
    {
      field: "brokerageGeneratedinFY2324",
      headerName: "Brok FY2324",
      minWidth: 100,
      flex: 0.7,
      align: "right",
      headerAlign: "center",
      headerClassName: "header-wrap-custom",
      disableColumnMenu: true,
      valueFormatter: (params: number) =>
        new Intl.NumberFormat("en-IN").format(params),
    },
    {
      field: "rmname",
      headerName: "RM Name",
      minWidth: 150,
      flex: 1,
      disableColumnMenu: true,
    },
    {
      field: "rmstatus",
      headerName: "RM Status",
      minWidth: 110,
      headerClassName: "header-wrap-custom",
      flex: 0.6,
      align: "center",
      disableColumnMenu: true,
    },
    {
      field: "dealerName",
      headerName: "Dealer Name",
      minWidth: 160,
      flex: 1.2,
      disableColumnMenu: true,
    },
    {
      field: "dealerSTATUS",
      headerName: "Dealer Status",
      minWidth: 110,
      headerClassName: "header-wrap-custom",
      flex: 0.6,
      align: "center",
      disableColumnMenu: true,
    },
  ];

  const PartnerColumns: GridColDef[] = [
    {
      field: "ctermcode",
      headerName: "Client Code",
      minWidth: 90,
      flex: 0.6,
      align: "left",
      disableColumnMenu: true,
    },
    {
      field: "clientName",
      headerName: "Client Name",
      minWidth: 170,
      flex: 1.5,
      disableColumnMenu: true,
    },
    {
      field: "lastTradeDate",
      headerName: "Last Trade Date",
      minWidth: 120,
      flex: 1,
      align: "center",
      headerAlign: "center",
      disableColumnMenu: true,
      headerClassName: "header-wrap-custom",
      valueGetter: (params: any) => {
        const rawDate = params;
        if (!rawDate) return null; // Handle missing data

        const parsedDate = new Date(
          rawDate.replace(
            /(\d{2})-([A-Za-z]{3})-(\d{2})/,
            (match: any, day: any, month: any, year: any) => {
              const monthMap: any = {
                Jan: "01",
                Feb: "02",
                Mar: "03",
                Apr: "04",
                May: "05",
                Jun: "06",
                Jul: "07",
                Aug: "08",
                Sep: "09",
                Oct: "10",
                Nov: "11",
                Dec: "12",
              };
              console.log(match);
              return `20${year}-${monthMap[month]}-${day}`;
            }
          )
        );

        return parsedDate;
      },
      sortComparator: (v1: any, v2: any) => {
        if (!v1 || !v2) return 0; // Handle missing values
        return v1 - v2; // Sort in ascending order
      },
      valueFormatter: (params: any) => {
        if (!params) return "";
        return dayjs(params).format("DD-MMM-YY"); // Converts to "03-Apr-24"
      },
    },

    {
      field: "activationDate",
      headerName: "Activation Date",
      minWidth: 120,
      headerClassName: "header-wrap-custom",
      disableColumnMenu: true,
      flex: 1,
      align: "center",
      headerAlign: "center",
      valueGetter: (params: any) => {
        const rawDate = params;
        if (!rawDate) return null; // Handle missing data

        const parsedDate = new Date(
          rawDate.replace(
            /(\d{2})-([A-Za-z]{3})-(\d{2})/,
            (match: any, day: any, month: any, year: any) => {
              const monthMap: any = {
                Jan: "01",
                Feb: "02",
                Mar: "03",
                Apr: "04",
                May: "05",
                Jun: "06",
                Jul: "07",
                Aug: "08",
                Sep: "09",
                Oct: "10",
                Nov: "11",
                Dec: "12",
              };
              console.log(match);
              return `20${year}-${monthMap[month]}-${day}`;
            }
          )
        );

        return parsedDate;
      },
      sortComparator: (v1: any, v2: any) => {
        if (!v1 || !v2) return 0; // Handle missing values
        return v1 - v2; // Sort in ascending order
      },
      valueFormatter: (params: any) => {
        if (!params) return "";
        return dayjs(params).format("DD-MMM-YY"); // Converts to "03-Apr-24"
      },
    },
    {
      field: "mobileNo",
      headerName: "Mobile No",
      minWidth: 120,
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params: any) => {
        const mobile = params.value || ""; // Extract the mobile number

        // Mask all digits except the first 2 and the last 2
        const maskedMobile = mobile.replace(
          /^(\d{2})(\d+)(\d{2})$/,
          (_: any, prefix: any, middle: any, suffix: any) => {
            console.log(prefix, suffix); // Added only for testing purpose
            return `${prefix}${"X".repeat(middle.length)}${suffix}`;
          }
        );

        // Return tooltip with the masked mobile number
        return (
          <Tooltip title={mobile} arrow placement="top">
            <span style={{ cursor: "pointer" }}>{maskedMobile}</span>
          </Tooltip>
        );
      },
    },

    {
      field: "brokerageGeneratedinFY1920",
      headerName: "Brok FY1920",
      minWidth: 100,
      flex: 0.7,
      align: "right",
      headerAlign: "center",
      headerClassName: "header-wrap-custom",
      disableColumnMenu: true,
    },
    {
      field: "brokerageGeneratedinFY2021",
      headerName: "Brok FY2021",
      minWidth: 100,
      flex: 0.7,
      align: "right",
      headerAlign: "center",
      headerClassName: "header-wrap-custom",
      disableColumnMenu: true,
      valueFormatter: (params: number) =>
        new Intl.NumberFormat("en-IN").format(params),
    },
    {
      field: "brokerageGeneratedinFY2122",
      headerName: "Brok FY2122",
      minWidth: 100,
      flex: 0.7,
      align: "right",
      headerAlign: "center",
      headerClassName: "header-wrap-custom",
      disableColumnMenu: true,
      valueFormatter: (params: number) =>
        new Intl.NumberFormat("en-IN").format(params),
    },
    {
      field: "brokerageGeneratedinFY2223",
      headerName: "Brok FY2223",
      minWidth: 100,
      flex: 0.7,
      align: "right",
      headerAlign: "center",
      headerClassName: "header-wrap-custom",
      disableColumnMenu: true,
      valueFormatter: (params: number) =>
        new Intl.NumberFormat("en-IN").format(params),
    },
    {
      field: "brokerageGeneratedinFY2324",
      headerName: "Brok FY2324",
      minWidth: 100,
      flex: 0.7,
      align: "right",
      headerAlign: "center",
      headerClassName: "header-wrap-custom",
      disableColumnMenu: true,
      valueFormatter: (params: number) =>
        new Intl.NumberFormat("en-IN").format(params),
    },
  ];

  return user_type === "Employee" ? EmployeeColumns : PartnerColumns;
};

export const communicationColumns =
  (): // handleEditClick?: (row: any, editCheck: boolean) => void
  GridColDef[] => [
    {
      field: "DateOfCommunication",
      headerName: "Date of Communication",
      width: 120,
      headerClassName: "header-wrap-custom",
      align: "center",
      headerAlign: "center",
      disableColumnMenu: true,
    },
    {
      field: "TypeOfDocuments",
      headerName: "Type of Document",
      minWidth: 140,
      disableColumnMenu: true,
      headerAlign: "center",
    },
    {
      field: "CommunicationType",
      headerName: "Communication Type",
      minWidth: 150,
      disableColumnMenu: true,
      headerAlign: "center",
    },
    {
      field: "CommunicationProof",
      headerName: "Communication Description",
      minWidth: 200,
      headerAlign: "center",
      flex: 2,
      disableColumnMenu: true,
      renderCell: (params: any) => {
        const dispatchProof = params.value || "N/A";
        return (
          <Tooltip title={dispatchProof} arrow placement="top">
            <span style={{ cursor: "pointer" }}>{dispatchProof}</span>
          </Tooltip>
        );
      },
    },
    {
      field: "Department",
      headerName: "Department",
      minWidth: 100,
      disableColumnMenu: true,
      headerAlign: "center",
    },
    {
      field: "Remark",
      headerName: "Remarks",
      width: 120,
      align: "center",
      headerAlign: "center",
      disableColumnMenu: true,
    },
    {
      field: "action",
      headerName: "Action",
      width: 120,
      align: "center",
      headerAlign: "center",
      disableColumnMenu: true,
    },
  ];
export const CompliancneReport: GridColDef[] = [
  {
    field: "DateOfCommunication",
    headerName: "Date of Communication",
    width: 160,
    headerClassName: "header-wrap-custom",
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
  },
  {
    field: "TypeOfDocuments",
    headerName: "Type of Document",
    minWidth: 110,
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    headerAlign: "center",
  },
  {
    field: "CommunicationType",
    headerName: "Communication Type",
    minWidth: 120,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    headerAlign: "center",
  },
  {
    field: "CommunicationDesc",
    headerName: "Communication Description",
    minWidth: 400,
    headerAlign: "center",
    disableColumnMenu: true,
    // renderCell: (params: any) => {
    //   const dispatchProof = params.value || "N/A";
    //   return (
    //     <Tooltip title={dispatchProof} arrow placement="top">
    //       <span style={{ cursor: "pointer" }}>{dispatchProof}</span>
    //     </Tooltip>
    //   );
    // },
  },
  {
    field: "CommunicationProofPath",
    headerName: "Document",
    minWidth: 120,
    disableColumnMenu: true,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "Department",
    headerName: "Department",
    minWidth: 100,
    headerAlign: "center",
    disableColumnMenu: true,
    flex: 2,
  },
];

export const topBirthdays: GridColDef[] = [
  {
    field: "Code",
    headerName: "Client Code",
    flex: 2,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "Name",
    headerName: "Client Name",
    flex: 2,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "MobileNumber",
    headerName: "Mobile No",
    flex: 1.5,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
    renderCell: (params: any) => {
      const mobile = params.value || ""; // Extract the mobile number

      // Mask all digits except the first 2 and the last 2
      const maskedMobile = mobile.replace(
        /^(\d{2})(\d+)(\d{2})$/,
        (_: any, prefix: any, middle: any, suffix: any) => {
          console.log(prefix, suffix); // Added only for testing purpose
          return `${prefix}${"X".repeat(middle.length)}${suffix}`;
        }
      );

      // Return tooltip with the masked mobile number
      return (
        <Tooltip title={mobile} arrow placement="top">
          <span style={{ cursor: "pointer" }}>{maskedMobile}</span>
        </Tooltip>
      );
    },
  },
  {
    field: "Date",
    headerName: "Date Of Birth",
    flex: 1,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
    renderCell: () => {
      const currentDate = new Date();
      const day = String(currentDate.getDate()).padStart(2, "0"); // Ensure 2 digits for day
      const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Ensure 2 digits for month
      const year = currentDate.getFullYear(); // Get the full year
      const formattedDate = `${day}/${month}/${year}`; // Format as dd/mm/yyyy
      return <div>{formattedDate}</div>; // Render the formatted date
    },
  },
];

export const cyptoWidgets = [
  // {
  //   id: 1,
  //   label: "Reasearch Calls",
  //   color: "primary",
  // },
  {
    id: 2,

    label: "Clients With Ledger Balance",
  },
  { id: 3, label: "Clients Ageing Report" },
  // { id: 4, label: "MTF Open Position" },
];

export const TradeCapsules = [
  { id: 1, label: "All" },
  { id: 2, label: "Equity Cash" },
  { id: 3, label: "Equity F&O" },
  { id: 4, label: "Currency F&O" },
  { id: 5, label: "Commodity F&O" },
];

export const ClientDetailsCapsule = [
  { id: 1, label: "Upcoming Dormant Client" },
  { id: 2, label: "Active Clients", count: 150 },
  { id: 3, label: "Inactive Clients", count: 200 },
  { id: 4, label: "Total Clients", count: 100 },
];

export const DPDebitCapsules = [
  { id: 2, label: "Active Clients" },
  { id: 3, label: "Inactive Clients" },
  { id: 4, label: "Total Clients" },
];

export const ODCapsules = [
  { id: 1, label: "Backoffice Report" },
  { id: 2, label: "Template" },
];

export const ClientInfoCapsules = [
  { id: 1, label: "Equity", status: "Active" },
  { id: 2, label: "F & O", status: "Active" },
  { id: 3, label: "Currency", status: "Active" },
  { id: 4, label: "Commodity", status: "Inactive" },
  { id: 5, label: "MTF", status: "Active" },
  { id: 6, label: "SLBM", status: "Inactive" },
];

export const BrokSlabItems = [
  {
    id: 1,
    label: "Equity Delivery",
    subvalue: "0.5% of Turnover",
    subvalueKey: "Equity_Delivery",
  },
  {
    id: 2,
    label: "Equity Intraday",
    subvalue: "0.5% of Turnover",
    subvalueKey: "Equity_Intraday",
  },
  {
    id: 3,
    label: "Equity Futures",
    subvalue: "0.5% of Turnover",
    subvalueKey: "Equity_Futures",
  },
  {
    id: 4,
    label: "Equity Options",
    subvalue: "₹ 50 per lot",
    subvalueKey: "Equity_Options",
  },
  {
    id: 5,
    label: "Currency Futures",
    subvalue: "0.5% of Turnover",
    subvalueKey: "Currency_Futures",
  },
  {
    id: 6,
    label: "Currency Options",
    subvalue: "₹ 50 per lot",
    subvalueKey: "Currency_Options",
  },
  {
    id: 7,
    label: "Commodity Futures",
    subvalue: "0.5% of Turnover",
    subvalueKey: "Commodity_Futures",
  },
  {
    id: 8,
    label: "Commodity Options",
    subvalue: "₹ 50 per lot",
    subvalueKey: "Commodity_Options",
  },
];

export const BrokSlabItemsPennypal = [
  { id: 1, label: "Equity Delivery", subvalue: "0.5% of Turnover" },
  { id: 2, label: "Equity Intraday", subvalue: "0.5% of Turnover" },
  { id: 3, label: "Equity Futures", subvalue: "0.5% of Turnover" },
  { id: 4, label: "Equity Options", subvalue: "₹ 50 per lot" },
];

export const LastTradeDates = [
  { id: 1, label: "Equity", status: "1-Jan-24" },
  { id: 2, label: "F&O", status: "1-Jan-24" },
  { id: 3, label: "Currency", status: "Inactive" },
  { id: 4, label: "Commodity", status: "Inactive" },
  { id: 5, label: "MTF", status: "1-Jan-24" },
  { id: 6, label: "SLBM", status: "Inactive" },
];

export const DPSchemes = [
  { id: 1, label: "Equity", status: "1-Jan-24" },
  { id: 2, label: "F&O", status: "1-Jan-24" },
];

export const EkycWidgets = [
  {
    id: 1,
    icon: "ri-money-dollar-circle-fill",
    label: "Total Investedddd",
    counter: 2390.68,
    badge: "ri-arrow-up-s-fill",
    badgeColor: "success",
    percentage: "6.24",
    decimal: 2,
    prefix: "$",
    separator: ",",
    color: "primary",
  },
  {
    id: 2,
    icon: "ri-arrow-up-circle-fill",
    label: "Total Change",
    counter: 19523.25,
    badge: "ri-arrow-up-s-fill",
    badgeColor: "success",
    percentage: "3.67",
    decimal: 2,
    prefix: "$",
    separator: ",",
    color: "secondary",
  },
];

export const buttonOptions = [
  { label: "7 Days", variant: "outlined" },
  { label: "15 Days", variant: "outlined" },
  { label: "1 Month", variant: "outlined" },
  { label: "3 Months", variant: "contained" },
  { label: "6 Months", variant: "contained" },
  { label: "12 Months", variant: "contained" },
];

export const CommunicationMenu = [
  { value: "Email", label: "Email" },
  { value: "Physical", label: "Physical" },
];

export const department = [
  { value: "IT", label: "IT" },
  { value: "Account", label: "Account" },
  { value: "RMS", label: "RMS" },
];

export const TypeOfDocuments = [
  { value: "Circular", label: "Circular" },
  { value: "SEBI", label: "SEBI" },
];

export const InfoCapsules = [
  {
    main: "NSE",
  },
  {
    main: "BSE",
  },
  {
    main: "MCX",
  },
];

export const CashFlowHeader = [
  {
    title: "Cash from Operating Activity",
    isSubpoint: false,
    order: 0,
    shortKey: "CFO_A",
  },
  {
    title: "Profit Before Tax",
    isSubpoint: true,
    parent: "Cash from Operating Activity",
    shortKey: "PBT_A",
  },
  {
    title: "Interest",
    isSubpoint: true,
    parent: "Cash from Operating Activity",
    shortKey: "INT_A",
  },
  {
    title: "Tax",
    isSubpoint: true,
    parent: "Cash from Operating Activity",
    shortKey: "TAX_A",
  },
  {
    title: "Cash from Investing Activity",
    isSubpoint: false,
    order: 1,
    shortKey: "CFI_A",
  },
  {
    title: "Cash from Financing Activity",
    isSubpoint: false,
    order: 2,
    shortKey: "CFA_A",
  },
  {
    title: "Net Cash Flow",
    isSubpoint: false,
    order: 3,
    shortKey: "NCF_A",
  },
  {
    title: "Cash Plus Cash Equivalent: Begin Of Year",
    isSubpoint: true,
    parent: "Net Cash Flow",
    shortKey: "CashAndCashEquivalentBeginOfYear_A",
  },
  {
    title: "Cash Plus Cash Equivalent: End Of Year",
    isSubpoint: true,
    parent: "Net Cash Flow",
    shortKey: "CashAndCashEquivalentEndOfYear_A",
  },
];

export const BalanceSheetHeader = [
  {
    title: "Total ShareHolders Funds",
    shortKey: "TotalShareHoldersFunds_A",
  },
  {
    title: "Minority Interest Liability",
    shortKey: "LiabilityMinorityInterest_A",
  },
  {
    title: "Total Non Current Liabilities",
    shortKey: "TotalNonCurrentLiabilities_A",
  },
  {
    title: "Total Capital Liabilities",
    shortKey: "CL_A",
  },
  {
    title: "Fixed Assets",
    shortKey: "FixedAssets_A",
  },
  {
    title: "Total Non Current Assets",
    shortKey: "TotalNonCurrentAssets_A",
  },
  {
    title: "Total Current Assets",
    shortKey: "CA_A",
  },
  {
    title: "Total Assets",
    shortKey: "TA_A",
  },
  {
    title: "Contingent Liabilities plus Commitments",
    shortKey: "ContingentLiabilities_A",
  },
  {
    title: "Bonus Equity Share Capital",
    shortKey: "",
  },
  {
    title: "Non Current Investments Unquoted BookValue",
    shortKey: "NonCurrentInvestments_A",
  },
  {
    title: "Current Investments Unquoted BookValue",
    shortKey: "CurrentInvestments_A",
  },
];

export const FundamentalQuarterlyPNLHeader = [
  {
    title: "Total Revenue",
    isSubpoint: false,
    order: 0,
    shortKey: "TOTAL_SR_Q",
  },
  {
    title: "Operating Revenue",
    isSubpoint: true,
    parent: "Total Revenue",
    shortKey: "OperatingIncome_Q",
  },
  {
    title: "Other Income",
    isSubpoint: true,
    parent: "Total Revenue",
    shortKey: "OI_Q",
  },
  {
    title: "Operating Expenses",
    isSubpoint: false,
    order: 1,
    shortKey: "OEXPNS_Q",
  },
  {
    title: "Operating Profit",
    isSubpoint: false,
    order: 2,
    shortKey: "OP_Q",
  },
  {
    title: "Operating Profit Margin %",
    isSubpoint: false,
    order: 3,
    shortKey: "NETPCT_Q",
  },
  {
    title: "Depreciation",
    isSubpoint: false,
    order: 4,
    shortKey: "DEP_Q",
  },
  {
    title: "Interest",
    isSubpoint: false,
    order: 5,
    shortKey: "INT_Q",
  },
  {
    title: "Profit Before Tax",
    isSubpoint: false,
    order: 6,
    shortKey: "PBT_Q",
  },
  {
    title: "Tax",
    isSubpoint: false,
    order: 7,
    shortKey: "TAX_Q",
  },
  {
    title: "Net Profit",
    isSubpoint: false,
    order: 8,
    shortKey: "NP_Q",
  },
  {
    title: "Basic EPS",
    isSubpoint: false,
    order: 9,
    shortKey: "EPS_Q",
  },
  {
    title: "Net Profit TTM",
    isSubpoint: false,
    order: 10,
    shortKey: "NP_Q_GROWTH",
  },
  {
    title: "Basic EPS TTM",
    isSubpoint: false,
    order: 11,
    shortKey: "OP4Q_Q",
  },
];

export const FundamentalAnnualPNLHeader = [
  {
    title: "Total Revenue",
    shortKey: "RevenueFromOperationsNet_A",
    isSubpoint: false,
  },
  {
    title: "Operating Revenues",
    shortKey: "TotalOperatingRevenues_A",
    isSubpoint: true,
    parent: "Total Revenue",
  },
  {
    title: "Other Income",
    shortKey: "OI_A",
    isSubpoint: true,
    parent: "Total Revenue",
  },

  { title: "Operating Expenses", shortKey: "OEXPNS_A", isSubpoint: false },
  { title: "Operating Profit", shortKey: "EBIDT_A", isSubpoint: false },
  {
    title: "Operating Profit Margin %",
    shortKey: "OPMPCT_A",
    isSubpoint: false,
  },

  { title: "Total Expenses", shortKey: "TotalExpenses_A", isSubpoint: false },
  {
    title: "Other Expenses",
    shortKey: "OtherExpenses_A",
    isSubpoint: true,
    parent: "Total Expenses",
  },
  {
    title: "Employee Expenses",
    shortKey: "EmployeeBenefitExpenses_A",
    isSubpoint: true,
    parent: "Total Expenses",
  },
  {
    title: "Cost Of Power Purchased",
    shortKey: "CostOfPowerPurchased_A",
    isSubpoint: true,
    parent: "Total Expenses",
  },
  {
    title: "Cost Of Fuel",
    shortKey: "CostOfFuel_A",
    isSubpoint: true,
    parent: "Total Expenses",
  },

  { title: "EBIDT", shortKey: "EBIDT_A", isSubpoint: false },
  { title: "EBIDT margin %", shortKey: "EBIDTPCT_A", isSubpoint: false },
  { title: "Interest", shortKey: "INT_A", isSubpoint: false },
  { title: "Depreciation", shortKey: "DEP_A", isSubpoint: false },
  { title: "Profit Before Tax", shortKey: "PBT_A", isSubpoint: false },
  { title: "Tax", shortKey: "TAX_A", isSubpoint: false },

  {
    title: "PAT Before ExtraOrdinary Items",
    shortKey: "PAT_A",
    isSubpoint: false,
  },
  { title: "Net Profit", shortKey: "NP_A", isSubpoint: false },
  { title: "Net Profit Margin %", shortKey: "NETPCT_A", isSubpoint: false },
  { title: "Basic EPS", shortKey: "BasicEPS_A", isSubpoint: false },
];

export const FundamentalRatiosHeader = [
  {
    title: "Book Value Per Share",
    shortKey: "BVSH_A",
  },
  {
    title: "RoA %",
    shortKey: "ROA_A",
  },
  {
    title: "ROE %",
    shortKey: "ROE_A",
  },
  {
    title: "ROCE %",
    shortKey: "ROCE_A",
  },
  {
    title: "Total Debt to Total Equity",
    shortKey: "DEBT_CE_A",
  },
];
export const RegionalHead: GridColDef[] = [
  {
    field: "branch",
    headerName: "Branch",
    flex: 1.1,
    minWidth: 120,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
  },
  {
    field: "ClientCode",
    headerName: "Client Code",
    flex: 1.1,
    minWidth: 120,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
  },
  {
    field: "ClientName",
    headerName: "Client Name",
    flex: 2,
    minWidth: 200,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
  },
  {
    field: "ClientType",
    headerName: "Client Type",
    flex: 1,
    minWidth: 120,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "segment",
    headerName: "Segment",
    flex: 1,
    minWidth: 120,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "existingPlan",
    headerName: "Existing Plan",
    flex: 1.2,
    minWidth: 130,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "proposedPlan",
    headerName: "Proposed Plan",
    flex: 1.2,
    minWidth: 130,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "remark",
    headerName: "Remark",
    flex: 1.5,
    minWidth: 160,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
  },
];

export const BrokerageModificationStatus: GridColDef[] = [
  {
    field: "zone",
    headerName: "Zone",
    flex: 1.1,
    minWidth: 120,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
  },
  ...RegionalHead,
  {
    field: "status",
    headerName: "Status",
    flex: 1.1,
    minWidth: 120,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
  },
];
export const BrokerageKyc: GridColDef[] = [
  {
    field: "zone",
    headerName: "Zone",
    flex: 1.1,
    minWidth: 120,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
  },
  ...RegionalHead,
];
