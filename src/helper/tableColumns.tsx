import { GridColDef } from "@mui/x-data-grid";
// import ContentCopyIcon from "@mui/icons-material/ContentCopy";
// import React, { useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
// import { Button } from "@mui/material";
// import PersonAddIcon from "@mui/icons-material/PersonAdd";
// import { FaUserPen } from "react-icons/fa6";
// import ViewListIcon from "@mui/icons-material/ViewList";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CopyToClipboardCell from "./copyToClipBoardCell";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import { capitalizeEachWord } from "../utils";

interface ClientRow {
  ClientCode: string;
  ClientName: string;
  LastTradeDate: string;
  ClientStatus: string;
}
dayjs.extend(customParseFormat);
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
      minWidth: 100, // Reasonable on all screens
    },
    {
      disableColumnMenu: true,
      field: "ClientName",
      headerName: "Client Name",
      flex: 2,
      minWidth: 160, // Names can be long; ensure space
    },
    {
      field: "LastTradeDate",
      headerClassName: "header-wrap-custom",
      headerName: "Last Trade Date",
      flex: 1.5,
      minWidth: 120, // Date format requires a bit more space
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
      minWidth: 80,
      align: "center",
      headerAlign: "center",
      disableColumnMenu: true,
    },
    {
      field: "BranchCode",
      headerName: "Branch Code",
      headerClassName: "header-wrap-custom",
      flex: 0.8,
      minWidth: 80,
      align: "center",
      headerAlign: "center",
      disableColumnMenu: true,
    },

    {
      field: "MobileNo",
      headerName: "Mobile No",
      flex: 1,
      minWidth: 120,
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
            flex: 1,
            minWidth: 70, // Increased to prevent overlap on smaller devices
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
      minWidth: 70, // Slightly wider for better label display
      align: "center",
      headerAlign: "center",
      disableColumnMenu: true,
      headerClassName: "header-wrap-custom",
    },
    {
      field: "viewDetails",
      headerName: "Details",
      minWidth: 80, // Use minWidth instead of fixed width for better responsiveness
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => (
        // <Button
        //   onClick={() => handleViewDetails(params.row)}
        //   variant="contained"
        //   color="primary"
        //   style={{
        //     padding: "1px 9px",
        //     backgroundColor: "#11395C",
        //     fontSize: "5px",
        //     borderRadius: "18px",
        //   }}
        // >
        <Tooltip title={"View Details"} arrow placement="top">
          <OpenInNewIcon
            style={{ cursor: "pointer", color: "#11395C" }}
            onClick={() => handleViewDetails(params.row)}
          />
        </Tooltip>
        // </Button>
      ),
    },
    // {
    //   field: "ActivationDate",
    //   headerName: "Activation Date",
    //   headerClassName: "header-wrap-custom",
    //   flex: 1.2,
    //   minWidth: 110,
    //   align: "center",
    //   headerAlign: "center",
    //   disableColumnMenu: true,
    //   valueGetter: (params: any) => {
    //     const rawDate = params;
    //     if (!rawDate) return null;
    //     const parsedDate = new Date(
    //       rawDate.replace(
    //         /(\d{2})-([A-Za-z]{3})-(\d{2})/,
    //         (match: any, day: any, month: any, year: any) => {
    //           const monthMap: any = {
    //             Jan: "01",
    //             Feb: "02",
    //             Mar: "03",
    //             Apr: "04",
    //             May: "05",
    //             Jun: "06",
    //             Jul: "07",
    //             Aug: "08",
    //             Sep: "09",
    //             Oct: "10",
    //             Nov: "11",
    //             Dec: "12",
    //           };
    //           console.log(match);
    //           return `20${year}-${monthMap[month]}-${day}`;
    //         }
    //       )
    //     );
    //     return parsedDate;
    //   },
    //   sortComparator: (v1, v2) => {
    //     if (!v1 || !v2) return 0; // Handle missing values
    //     return v1 - v2; // Sort in ascending order
    //   },
    //   valueFormatter: (params: any) => {
    //     if (!params) return "";
    //     return dayjs(params).format("DD-MMM-YY"); // Converts to "03-Apr-24"
    //   },
    // },
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
    field: "Dates",
    headerName: "Date",
    flex: 1,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "Department",
    headerName: "Department",
    flex: 0.8,
    disableColumnMenu: true,
    headerAlign: "center",
  },
  {
    field: "Subject",
    headerName: "Subject",
    flex: 1.5,
    disableColumnMenu: true,
    headerAlign: "center",
    // renderCell: (params) => (
    //   <div style={{ padding: "0px 3px" }}>{params.value}</div>
    // ),
  },
  {
    field: "LKPComments",
    headerName: "LKP Comments",
    flex: 3,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    // alignItems:"center"
  },
  {
    field: "action",
    headerName: "Action",
    width: 120,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
  },
  {
    field: "CircularFilePath",
    headerName: "Circular",
    flex: 0.8,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
];
export const getMarketingMaterials: GridColDef[] = [
  {
    field: "UploadImages",
    headerName: "Image",
    headerClassName: "header-wrap-custom",
    flex: 0.7,
    minWidth: 90,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    renderCell: (params: any) => {
      const fullPath = params.row.UploadImages;
      const fileName = fullPath?.split(/[/\\]/).pop();

      return <span>{fileName}</span>;
    },
  },
  {
    field: "Description",
    headerName: "Description",
    headerClassName: "header-wrap-custom",
    flex: 1,
    minWidth: 90,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "UploadDocuments",
    headerName: "Document name",
    headerClassName: "header-wrap-custom",
    flex: 1,
    minWidth: 90,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    renderCell: (params: any) => {
      const fullPath = params.row.UploadDocuments;
      const fileName = fullPath?.split(/[/\\]/).pop();
      return <span>{fileName}</span>;
    },
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
    minWidth: 120,
    flex: 1,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: "DateOfCommunication",
    headerName: "Date",
    minWidth: 100,
    flex: 1,
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
    minWidth: 120,
    flex: 1,
    disableColumnMenu: true,
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
  },
  {
    field: "CommunicationType",
    headerName: "Communication Type",
    minWidth: 120,
    flex: 1,
    disableColumnMenu: true,
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
  },
  {
    field: "CommunicationProof",
    headerName: "Communication Description",
    minWidth: 240,
    flex: 2,
    disableColumnMenu: true,
    headerAlign: "center",
  },
  {
    field: "Department",
    headerName: "Department",
    minWidth: 100,
    flex: 1,
    disableColumnMenu: true,
    headerAlign: "center",
  },
  {
    field: "CommunicationProofPath",
    headerName: "Document",
    minWidth: 100,
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
    flex: 1,
    minWidth: 120,
    disableColumnMenu: true,
  },
  {
    field: "clientName",
    headerName: "Client Name",
    flex: 2,
    minWidth: 160,
    disableColumnMenu: true,
  },
  {
    field: "lastTradeDate",
    headerName: "Last Trade Date",
    flex: 1.5,
    minWidth: 140,
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
    minWidth: 140,
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
    flex: 1,
    minWidth: 120,
    align: "right",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
  },
  {
    field: "viewDetails",
    headerName: "Details",
    width: 130,
    minWidth: 120,
    headerAlign: "center",
    align: "center",
    renderCell: (params: any) => (
      <>
        {/* <Button
          onClick={() => handleViewDetails(params.row)}
          // onClick={() => console.log("rowValues", params.row)}
          variant="contained"
          color="primary"
          style={{
            padding: "1px 9px",
            backgroundColor: "#11395C",
            fontSize: "5px",
            borderRadius: "18px",
          }}
        > */}
        <Tooltip title={"View Details"} arrow placement="top">
          <OpenInNewIcon
            style={{ cursor: "pointer", color: "#11395C" }}
            onClick={() => handleViewDetails(params.row)}
          />
        </Tooltip>
        {/* </Button> */}
      </>
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
    renderCell: (params: any) => {
      return (
        <Tooltip title={params.row?.mobileNo} arrow placement="top">
          <span>{params.value}</span>
        </Tooltip>
      );
    },
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
    align: "right",
    valueFormatter: (params: number) =>
      new Intl.NumberFormat("en-IN").format(params),
  },
  {
    field: "rmName",
    headerName: "RM Name",
    minWidth: 260,
    flex: 1,
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    renderCell: (params: any) => {
      return (
        <Tooltip title={params.row?.rmMobileNo} arrow placement="top">
          <span>{params.value}</span>
        </Tooltip>
      );
    },
  },
  {
    field: "dealerName",
    headerName: "Dealer Name",
    minWidth: 260,
    flex: 1,
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    renderCell: (params: any) => {
      return (
        <Tooltip title={params.row?.dealerMobileNo} arrow placement="top">
          <span>{params.value}</span>
        </Tooltip>
      );
    },
  },
  {
    field: "apName",
    headerName: "AP Name",
    minWidth: 260,
    flex: 1,
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    renderCell: (params: any) => {
      return (
        <Tooltip title={params.row?.apMobileNo} arrow placement="top">
          <span>{params.value}</span>
        </Tooltip>
      );
    },
  },
  {
    field: "slbmStatus",
    headerName: "SLBM Status",
    align: "center",
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
    flex: 1,
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
    headerName: "Start Date",
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
    width: 100,
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
    // valueFormatter: (params: any) => `₹${params}`, // Format as currency
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
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
    minWidth: 100,
    headerAlign: "left",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "ClientName",
    headerName: "Client Name",
    flex: 2,
    minWidth: 150,
    disableColumnMenu: true,
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
    flex: 1.2,
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
    field: "G5",
    headerName: ">T5",
    flex: 1,
    minWidth: 80,
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
    flex: 1,
    minWidth: 80,
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
    flex: 1,
    minWidth: 80,
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
    flex: 1,
    minWidth: 80,
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
    flex: 1,
    minWidth: 80,
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
    flex: 1,
    minWidth: 80,
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
      return <CopyToClipboardCell fullLink={fullLink} field={"payment"} />;
    },
  },
  // {
  //   field: "dpMandate_Link",
  //   headerName: "Mandate\nLink",
  //   headerClassName: "header-wrap-custom",
  //   minWidth: 75,
  //   flex: 0.3,
  //   align: "center",
  //   headerAlign: "center",
  //   disableColumnMenu: true,
  //   renderCell: (params: any) => {
  //     const { Payment_link, EnCAccountCode } = params.row;
  //     if (!Payment_link || !EnCAccountCode)
  //       return <span>No Link Available</span>;

  //     const fullLink = `${Payment_link}${EnCAccountCode}`;
  //     return (
  //       <CopyToClipboardCell
  //         fullLink={fullLink}
  //         field={"dpMandate"}
  //         selectedRow={params?.row}
  //       />
  //     );
  //   },
  // },
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
    headerName: "Total DP Debit",
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
    minWidth: 100,
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
  //   label: "Research Calls",
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
export const AmcMembership = [
  { id: 1, label: "Lifetime Membership" },
  { id: 2, label: "Non-Lifetime Membership" },
  { id: 3, label: "Contest Earned" },
];
export const pledgeCapsules = [
  { id: 1, label: "Pledge Request" },
  // { id: 2, label: "Template" },
];

export const partnerContestCapsules = [
  { id: 1, label: "Contest Rewards" },
  { id: 2, label: "Broking Revenue" },
  { id: 3, label: "Client Achieve" },
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
export const TypeOfDepartment = [
  { value: "IT", label: "IT" },
  { value: "Account", label: "Account" },
  { value: "RMS", label: "RMS" },
];
export const TypeOfExclusionClient = [
  { value: "Branch", label: "Branch" },
  { value: "Client", label: "Client" },
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
    shortKey: "SR_A",
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
    field: "branchcode",
    headerName: "Branch",
    minWidth: 70,
    flex: 0.6,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "clientcode",
    headerName: "Client Code",
    flex: 0.6,
    minWidth: 100,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
  },
  {
    field: "clientName",
    headerName: "Client Name",
    flex: 1.5,
    minWidth: 180,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
  },
  {
    field: "segment",
    headerName: "Segment",
    flex: 1,
    minWidth: 120,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
  },
  {
    field: "existingPlan",
    headerName: "Existing Plan",
    flex: 1.5,
    minWidth: 200,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
  },
  {
    field: "proposedPlan",
    headerName: "Proposed Plan",
    flex: 1.2,
    minWidth: 130,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
  },
  {
    field: "consentfilename",
    headerName: "Download",
    // flex: 1,
    // minWidth: 50,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "remark",
    headerName: "Action",
    flex: 1,
    minWidth: 100,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
    sortable: false,
  },
];

export const BrokerageModificationStatus: GridColDef[] = [
  ...RegionalHead.filter(
    (col) => col.field !== "remark" && col.field !== "consentfilename"
  ),
  {
    field: "status",
    headerName: "Status",
    flex: 1,
    minWidth: 180,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
    renderCell: (params: any) => {
      const status = params.value?.toLowerCase() || "";

      let backgroundColor = "#cfd8dc"; // Default neutral
      let color = "#263238";
      let border = "1px solid #b0bec5";

      if (status.includes("approved")) {
        backgroundColor = "#a5d6a7"; // Light green
        color = "#1b5e20";
        border = "1px solid #81c784";
      } else if (status.includes("pending")) {
        backgroundColor = "#FFF4E5"; // Soft peach / beige
        color = "#FF9800"; // Warm orange (not too saturated)
        border = "1px solid #FFB74D"; // Light orange border
      } else if (status.includes("rejected") || status.includes("reject")) {
        backgroundColor = "#ef9a9a"; // Light red
        color = "#b71c1c";
        border = "1px solid #e57373";
      }

      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "100%",
            fontFamily: "Public Sans",
          }}
        >
          <div
            style={{
              backgroundColor,
              color,
              border,
              borderRadius: "999px",
              padding: "3px 6px",
              fontSize: "11px",
              fontWeight: 600,
              // textTransform: "capitalize",
              whiteSpace: "nowrap",
              display: "inline-block",
              textAlign: "center",
              minWidth: "160px",
              lineHeight: "1",
            }}
          >
            {params.value}
          </div>
        </div>
      );
    },
  },
  {
    field: "reason",
    headerName: "Remarks",
    minWidth: 100,
    flex: 1,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "kycApproveStatusDate",
    headerName: "Date approved by KYC",
    minWidth: 200,
    flex: 1,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    renderCell: (params: any) => {
      const kycDate = params.row.kycApproveStatusDate;
      console.log(kycDate, "params");
      if (kycDate === "0001-01-01 00:00") {
        return <span>-</span>;
      }
    },
  },
];
export const BrokerageKyc: GridColDef[] = [
  {
    field: "More Details",
    headerName: "",
    minWidth: 60,
    flex: 0.5,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "zone",
    headerName: "Zone",
    minWidth: 60,
    flex: 0.5,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "branchcode",
    headerName: "Branch",
    minWidth: 70,
    flex: 0.6,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "clientcode",
    headerName: "Client Code",
    flex: 0.6,
    minWidth: 100,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
  },
  {
    field: "clientName",
    headerName: "Client Name",
    flex: 1.5,
    minWidth: 180,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
  },

  {
    field: "segment",
    headerName: "Segment",
    flex: 1,
    minWidth: 120,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
  },
];

export const getBrokerageKycDetails = (
  handleDownload: (row: any) => void
): GridColDef[] => {
  return [
    ...RegionalHead.filter(
      (col) =>
        col.field !== "branchcode" &&
        col.field !== "remark" &&
        col.field !== "consentfilename"
    ),
    {
      field: "consentfilename",
      headerName: "Download",
      disableColumnMenu: true,
      headerAlign: "center",
      align: "center",
      renderCell: (params: any) => {
        const fileName = params.row?.consentfilename;

        return fileName ? (
          <button
            onClick={() => handleDownload(params.row)}
            style={{
              color: "#11395C",
              textDecoration: "underline",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            <span title="Download">
              <DownloadForOfflineIcon />
            </span>
          </button>
        ) : (
          "╶─"
        );
      },
    },
    {
      field: "kycApproveStatusDate",
      headerName: "Date approved by RH",
      flex: 1,
      minWidth: 180,
      disableColumnMenu: true,
      headerAlign: "center",
      align: "left",
      sortable: false,
    },
  ];
};

// export const BrokerageKyc: GridColDef[] = [
//   {
//     field: "zone",
//     headerName: "Zone",
//     minWidth: 60,
//     flex: 0.5,
//     disableColumnMenu: true,
//     headerAlign: "center",
//     align: "center",
//   },
//   ...RegionalHead,
//   {
//     field: "kycApproveStatusDate",
//     headerName: "Date approved by RH",
//     flex: 1,
//     minWidth: 180,
//     disableColumnMenu: true,
//     headerAlign: "center",
//     align: "left",
//     sortable: false,
//   },
// ];

export const PreProofUploadColumns: GridColDef[] = [
  {
    field: "file_upload",
    headerName: "Upload",
    width: 80,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: "clientCode",
    headerName: "ClientCode",
    width: 100,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "tradeDate",
    headerName: "Order Date Time",
    width: 100,
    disableColumnMenu: true,
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    align: "center",
  },
  {
    field: "buySell",
    headerName: "Buy Sell",
    width: 70,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },

  {
    field: "symbolSeries",
    headerName: "Symbol / Series",
    width: 160,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
    renderCell: (params: any) => {
      const symbol = (params.row?.symbol || "").trim();
      const series = (params.row?.series || "").trim();
      return `${symbol} / ${series}`;
    },
  },
  {
    field: "expiryDate",
    headerName: "Expiry Date",
    headerClassName: "header-wrap-custom",
    width: 100,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },

  // {
  //   field: "symbolSeries", // this is a virtual column, not from the API
  //   headerName: "Symbol / Series",
  //   width: 160,
  //   disableColumnMenu: true,
  //   headerAlign: "center",
  //   align: "center",
  //   valueGetter: (params: any) => {
  //     const symbol = (params.symbol || "").trim();
  //     const series = (params.series || "").trim();
  //     return `${symbol} / ${series}`;
  //   },
  // },
  {
    field: "instrumentType",
    headerName: "Instrument Type",
    width: 90,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "strikeprice",
    headerName: "Strike Price",
    headerClassName: "header-wrap-custom",
    width: 60,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
  },
  {
    field: "qty",
    headerName: "Quantity",
    width: 90,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
  },

  {
    field: "tradeOrderNumber",
    flex: 2,
    headerName: "Order Number",
    headerClassName: "header-wrap-custom",
    width: 160,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
];

export const preTradeColumns: GridColDef[] = [
  {
    field: "Uploaded_Document",
    headerName: "View Document",
    headerClassName: "header-wrap-custom",
    flex: 1,
    minWidth: 90,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "status",
    headerName: "Status",
    width: 100,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "clientCode",
    headerName: "ClientCode",
    width: 100,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "tradeDate",
    headerName: "Order Date",
    width: 100,
    disableColumnMenu: true,
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    align: "center",
  },
  {
    field: "buySell",
    headerName: "Buy Sell",
    width: 70,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "symbolSeries",
    headerName: "Symbol / Series",
    width: 160,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
    renderCell: (params: any) => {
      const symbol = (params.row?.symbol || "").trim();
      const series = (params.row?.series || "").trim();
      return `${symbol} / ${series}`;
    },
  },
  {
    field: "expiryDate",
    headerName: "Expiry Date",
    headerClassName: "header-wrap-custom",
    width: 100,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "instrumentType",
    headerName: "Instrument Type",
    width: 90,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "strikeprice",
    headerName: "Strike Price",
    headerClassName: "header-wrap-custom",
    width: 60,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
  },
  {
    field: "qty",
    headerName: "Quantity",
    width: 72,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
  },
  {
    field: "tradeOrderNumber",
    // flex: 2,
    headerName: "Order Number",
    headerClassName: "header-wrap-custom",
    width: 160,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "dealerName",
    headerName: "Dealer Name",
    width: 140,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "dealerID",
    headerName: "Dealer ID",
    width: 80,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
  },

  {
    field: "remarks",
    headerName: "Remark",
    width: 160,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
];

export const PreTradeApprovalColumns: GridColDef[] = [
  {
    field: "Uploaded_Document",
    headerName: "View Document",
    headerClassName: "header-wrap-custom",
    flex: 1,
    minWidth: 90,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "Actions",
    headerName: "Actions",
    headerClassName: "header-wrap-custom",
    // flex: 1,
    minWidth: 120,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "clientCode",
    headerName: "ClientCode",
    width: 100,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "tradeDate",
    headerName: "Order Date",
    width: 100,
    disableColumnMenu: true,
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    align: "center",
  },
  {
    field: "buySell",
    headerName: "Buy Sell",
    width: 70,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "symbolSeries",
    headerName: "Symbol / Series",
    width: 160,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
    renderCell: (params: any) => {
      const symbol = (params.row?.symbol || "").trim();
      const series = (params.row?.series || "").trim();
      return `${symbol} / ${series}`;
    },
  },
  {
    field: "expiryDate",
    headerName: "Expiry Date",
    headerClassName: "header-wrap-custom",
    width: 100,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "instrumentType",
    headerName: "Instrument Type",
    width: 90,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "strikeprice",
    headerName: "Strike Price",
    headerClassName: "header-wrap-custom",
    width: 60,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
  },
  {
    field: "qty",
    headerName: "Quantity",
    width: 72,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
  },
  {
    field: "tradeOrderNumber",
    // flex: 2,
    headerName: "Order Number",
    headerClassName: "header-wrap-custom",
    width: 160,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "dealername",
    headerName: "Dealer Name",
    width: 140,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "dealerID",
    headerName: "Dealer ID",
    width: 80,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
  },

  {
    field: "remarks",
    headerName: "Remark",
    width: 160,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
];
export const clientTradingPatternSummarizedColumns: GridColDef[] = [
  {
    field: "client_Zone",
    headerName: "Zone",
    flex: 0.5,
    minWidth: 60,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "client_Branch",
    headerName: "Branch Code",
    flex: 0.7,
    minWidth: 70,
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "branch_Type",
    headerName: "Branch Type",
    flex: 0.8,
    minWidth: 120,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "client_ID",
    headerName: "Client Code",
    flex: 0.8,
    minWidth: 90,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    renderCell: (params: any) => {
      const name = params.row?.rM_Name || "N/A";
      const mobile = params.row?.rM_Mobile || "N/A";
      return (
        <Tooltip
          title={
            <>
              <div>RM Name: {name}</div>
              <div>Mobile No: {mobile}</div>
            </>
          }
          arrow
          placement="top"
        >
          <span>{params.value}</span>
        </Tooltip>
      );
    },
  },
  {
    field: "client_Name",
    headerName: "Client Name",
    flex: 1.5,
    minWidth: 200,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "online_Total_Brokerage",
    headerName: "Online Total Brok",
    flex: 1,
    minWidth: 80,
    headerAlign: "center",
    align: "right",
    headerClassName: "header-wrap-custom",
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
    field: "offline_Total_Brokerage",
    headerName: "Offline Total Brok",
    flex: 1,
    minWidth: 80,
    headerAlign: "center",
    align: "right",
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
    field: "cnT_Total_Brokerage",
    headerName: "CNT Total Brok",
    flex: 1,
    minWidth: 80,
    headerAlign: "center",
    align: "right",
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
    field: "online_Last_Trade_Date",
    headerName: "Online Last Trade Date",
    flex: 1,
    minWidth: 90,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
  },
  {
    field: "offline_Last_Trade_Date",
    headerName: "Offline Last Trade Date",
    flex: 1,
    minWidth: 90,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
  },
  {
    field: "cnT_Last_Trade_Date",
    headerName: "CNT Last Trade Date",
    flex: 1,
    minWidth: 90,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
  },
  {
    field: "activeStatus",
    headerName: "Active Status",
    flex: 0.8,
    minWidth: 70,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
  },
];

export const clientTradingPatternDetailedColumns: GridColDef[] = [
  {
    field: "client_Zone",
    headerName: "Zone",
    flex: 0.5,
    minWidth: 60,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "client_Branch",
    headerName: "Branch Code",
    flex: 0.7,
    minWidth: 70,
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "branch_Type",
    headerName: "Branch Type",
    flex: 0.8,
    minWidth: 120,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "client_ID",
    headerName: "Client Code",
    flex: 0.8,
    minWidth: 90,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    renderCell: (params: any) => {
      const name = params.row?.rM_Name || "N/A";
      const mobile = params.row?.rM_Mobile || "N/A";

      return (
        <Tooltip
          title={
            <>
              <div>RM Name: {name}</div>
              <div>Mobile No: {mobile}</div>
            </>
          }
          arrow
          placement="top"
        >
          <span>{params.value}</span>
        </Tooltip>
      );
    },
  },
  {
    field: "client_Name",
    headerName: "Client Name",
    flex: 1.3,
    minWidth: 240,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "online_CM_Brokerage",
    headerName: "Online CM Brok",
    flex: 1,
    minWidth: 75,
    headerAlign: "center",
    align: "right",
    headerClassName: "header-wrap-custom",
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
    field: "offline_CM_Brokerage",
    headerName: "Offline CM Brok",
    flex: 1,
    minWidth: 90,
    headerAlign: "center",
    align: "right",
    headerClassName: "header-wrap-custom",
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
    field: "cnT_CM_Brokerage",
    headerName: "CNT CM Brok",
    flex: 1,
    minWidth: 90,
    headerAlign: "center",
    align: "right",
    headerClassName: "header-wrap-custom",
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
    field: "online_FUT_Brokerage",
    headerName: "Online Futures Brok",
    flex: 1.2,
    minWidth: 80,
    headerAlign: "center",
    align: "right",
    headerClassName: "header-wrap-custom",
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
    field: "offline_FUT_Brokerage",
    headerName: "Offline Futures Brok",
    flex: 1.2,
    minWidth: 90,
    headerAlign: "center",
    align: "right",
    headerClassName: "header-wrap-custom",
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
    field: "cnT_FUT_Brokerage",
    headerName: "CNT Futures Brok",
    flex: 1.1,
    minWidth: 90,
    headerAlign: "center",
    align: "right",
    headerClassName: "header-wrap-custom",
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
    field: "online_OPT_Brokerage",
    headerName: "Online Options Brok",
    flex: 1.2,
    minWidth: 90,
    headerAlign: "center",
    align: "right",
    headerClassName: "header-wrap-custom",
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
    field: "offline_OPT_Brokerage",
    headerName: "Offline Options Brok",
    flex: 1.2,
    minWidth: 90,
    headerAlign: "center",
    align: "right",
    headerClassName: "header-wrap-custom",
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
    field: "cnT_OPT_Brokerage",
    headerName: "CNT Options Brok",
    flex: 1.1,
    minWidth: 90,
    headerAlign: "center",
    align: "right",
    headerClassName: "header-wrap-custom",
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
    field: "online_Last_Trade_Date",
    headerName: "Online Last Trade Date",
    flex: 1,
    minWidth: 90,
    headerAlign: "center",
    align: "center",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
  },
  {
    field: "offline_Last_Trade_Date",
    headerName: "Offline Last Trade Date",
    flex: 1,
    minWidth: 90,
    headerAlign: "center",
    align: "center",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
  },
  {
    field: "cnT_Last_Trade_Date",
    headerName: "CNT Last Trade Date",
    flex: 1,
    minWidth: 90,
    headerAlign: "center",
    align: "center",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
  },
  {
    field: "activeStatus",
    headerName: "Active Status",
    flex: 0.8,
    minWidth: 80,
    headerAlign: "center",
    align: "center",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
  },
];

export const ctclUserWiseColumns: GridColDef[] = [
  {
    field: "zone",
    headerName: "Zone",
    flex: 0.8,
    minWidth: 60,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "branchCode",
    headerName: "Branch Code",
    flex: 1,
    minWidth: 100,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "branch_Type",
    headerName: "Branch Type",
    flex: 0.8,
    minWidth: 120,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "CTCLLoginID",
    headerName: "CTCL Login ID",
    flex: 1,
    minWidth: 90,
    headerAlign: "center",
    align: "center",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
  },
  {
    field: "CTCLUserName",
    headerName: "CTCL User Name",
    flex: 1.5,
    minWidth: 210,
    headerAlign: "center",
    align: "left",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
  },

  {
    field: "turnover",
    headerName: "Turnover (Cr.)",
    flex: 1,
    minWidth: 120,
    type: "number",
    headerAlign: "center",
    align: "right",
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
    field: "grossBrokerage",
    headerName: "Gross Brokerage",
    flex: 1,
    minWidth: 100,
    type: "number",
    headerAlign: "center",
    align: "right",
    headerClassName: "header-wrap-custom",
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
    field: "netBrokerage",
    headerName: "Net Brokerage",
    flex: 1,
    minWidth: 100,
    type: "number",
    headerAlign: "center",
    align: "right",
    headerClassName: "header-wrap-custom",
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
    field: "last_Trade_Date",
    headerName: "Last Trade Date",
    flex: 1,
    minWidth: 100,
    headerAlign: "center",
    align: "center",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
  },
];
export const ctclUserWiseDetailedColumns: GridColDef[] = [
  {
    field: "zone",
    headerName: "Zone",
    flex: 0.8,
    minWidth: 60,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "branchCode",
    headerName: "Branch Code",
    flex: 1,
    minWidth: 100,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "branch_Type",
    headerName: "Branch Type",
    flex: 0.8,
    minWidth: 120,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "CTCLLoginID",
    headerName: "CTCL Login ID",
    flex: 1,
    minWidth: 90,
    headerAlign: "center",
    align: "center",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
  },
  {
    field: "CTCLUserName",
    headerName: "CTCL User Name",
    flex: 1.5,
    minWidth: 210,
    headerAlign: "center",
    align: "left",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
  },
  {
    field: "exchangeSegment",
    headerName: "Exchange / Segment",
    flex: 1.2,
    minWidth: 90,
    headerAlign: "center",
    align: "center",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
  },
  {
    field: "turnover",
    headerName: "Turnover (Cr.)",
    flex: 1,
    minWidth: 120,
    type: "number",
    headerAlign: "center",
    align: "right",
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
    field: "grossBrokerage",
    headerName: "Gross Brokerage",
    flex: 1,
    minWidth: 100,
    type: "number",
    headerAlign: "center",
    align: "right",
    headerClassName: "header-wrap-custom",
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
    field: "netBrokerage",
    headerName: "Net Brokerage",
    flex: 1,
    minWidth: 100,
    type: "number",
    headerAlign: "center",
    align: "right",
    headerClassName: "header-wrap-custom",
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
    field: "last_Trade_Date",
    headerName: "Last Trade Date",
    flex: 1,
    minWidth: 100,
    headerAlign: "center",
    align: "center",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
  },
];

export const quotes = [
  {
    text: "Price is what you pay. Value is what you get.",
    author: "Warren Buffett",
  },
  {
    text: "In investing, what is comfortable is rarely profitable.",
    author: "Robert Arnott",
  },
  {
    text: "The stock market is filled with individuals who know the price of everything, but the value of nothing.",
    author: "Philip Fisher",
  },
  {
    text: "Know what you own, and know why you own it.",
    author: "Peter Lynch",
  },
  {
    text: "An investment in knowledge pays the best interest.",
    author: "Benjamin Franklin",
  },
  {
    text: "The four most dangerous words in investing are: 'This time it's different.'",
    author: "Sir John Templeton",
  },
  {
    text: "Time is your friend; impulse is your enemy.",
    author: "John C. Bogle",
  },
  {
    text: "Wide diversification is only required when investors do not understand what they are doing.",
    author: "Warren Buffett",
  },
  {
    text: "Financial freedom is available to those who learn about it and work for it.",
    author: "Robert Kiyosaki",
  },
  {
    text: "Behind every stock is a company. Find out what it's doing.",
    author: "Peter Lynch",
  },
  // {
  //   text: `Please wait, we are processing your request...`,
  //   author: "",
  // },
  {
    text: "Risk comes from not knowing what you are doing.",
    author: "Warren Buffett",
  },
  // {
  //   text: `Please wait, we are processing your request...`,
  //   author: "",
  // },
  {
    text: "Stay hungry, stay foolish.",
    author: "Steve Jobs",
  },
  // {
  //   text: `Please wait, we are processing your request...`,
  //   author: "",
  // },
  {
    text: "The best way to predict the future is to create it.",
    author: "Peter Drucker",
  },
  // {
  //   text: `Please wait, we are processing your request...`,
  //   author: "",
  // },
  {
    text: "When something is important enough, you do it even if the odds are not in your favor.",
    author: "Elon Musk",
  },
  // {
  //   text: `Please wait, we are processing your request...`,
  //   author: "",
  // },
  {
    text: "Success is not in what you have, but who you are.",
    author: "Bo Bennett",
  },
  // {
  //   text: `Please wait, we are processing your request...`,
  //   author: "",
  // },
  {
    text: "Your time is limited, so don’t waste it living someone else’s life.",
    author: "Steve Jobs",
  },
  // {
  //   text: `Please wait, we are processing your request...`,
  //   author: "",
  // },
  {
    text: "I find that the harder I work, the more luck I seem to have.",
    author: "Thomas Jefferson",
  },
  // {
  //   text: `Please wait, we are processing your request...`,
  //   author: "",
  // },
  {
    text: "Don't be afraid to give up the good to go for the great.",
    author: "John D. Rockefeller",
  },
  // {
  //   text: `Please wait, we are processing your request...`,
  //   author: "",
  // },
  {
    text: "Opportunities don't happen. You create them.",
    author: "Chris Grosser",
  },
  // {
  //   text: `Please wait, we are processing your request...`,
  //   author: "",
  // },
  {
    text: "Success usually comes to those who are too busy to be looking for it.",
    author: "Henry David Thoreau",
  },
];
export const simpleQuote = [
  {
    text: `Please wait`,
    author: "",
  },
];

export const spipPerformanceReportColumns: GridColDef[] = [
  {
    field: "quarterMonth",
    headerName: "Month",
    width: 100,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "clientCode",
    headerName: "Client Code",
    width: 100,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "clientName",
    headerName: "Client Name",
    width: 200,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
  },
  {
    field: "status",
    headerName: "Status",
    width: 90,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "scripCode",
    headerName: "Scrip Name",
    width: 120,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "securityName",
    headerName: "Security Name",
    width: 220,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "buyQty",
    headerName: "Buy Qty",
    width: 70,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
  },
  {
    field: "buyRate",
    headerName: "Buy Rate",
    width: 80,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    valueFormatter: (params: any) => {
      const value = Number(params);
      return isNaN(value)
        ? "-"
        : new Intl.NumberFormat("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(value);
    },
  },
  {
    field: "buyValue",
    headerName: "Buy Value",
    width: 90,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "sellQty",
    headerName: "Sell Qty",
    width: 70,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
  },
  {
    field: "sellRate",
    headerName: "Sell Rate",
    width: 80,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    valueFormatter: (params: any) => {
      const value = Number(params);
      return isNaN(value)
        ? "-"
        : new Intl.NumberFormat("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(value);
    },
  },
  {
    field: "sellValue",
    headerName: "Sell Value",
    width: 90,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "openQty",
    headerName: "Open Qty",
    width: 80,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    valueFormatter: (params: any) => {
      const value = Number(params);
      return isNaN(value)
        ? "-"
        : new Intl.NumberFormat("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(value);
    },
  },
  {
    field: "marketRate",
    headerName: "Market Rate",
    width: 100,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    valueFormatter: (params: any) => {
      const value = Number(params);
      return isNaN(value)
        ? "-"
        : new Intl.NumberFormat("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(value);
    },
  },
  {
    field: "marketValue",
    headerName: "Market Value",
    width: 100,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    valueFormatter: (params: any) => {
      const value = Number(params);
      return isNaN(value)
        ? "-"
        : new Intl.NumberFormat("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(value);
    },
  },
  {
    field: "profitLoss",
    headerName: "Profit / Loss",
    width: 100,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "profitLoss_Perc",
    headerName: "P/L %",
    width: 90,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
  },
];

export const SPIPOverallPerformanceReport: GridColDef[] = [
  {
    field: "reportMonth",
    headerName: "Report Months",
    width: 130,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "clientCode",
    headerName: "Client Code",
    width: 110,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "clientName",
    headerName: "Client Name",
    minWidth: 150,
    flex: 1,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
  },
  {
    field: "investmentAmt",
    headerName: "Investment Amount",
    width: 150,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    valueFormatter: (params: any) => {
      const value = Number(params);
      return isNaN(value)
        ? "-"
        : new Intl.NumberFormat("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(value);
    },
  },
  {
    field: "openPosition",
    headerName: "Open Position Amount",
    width: 170,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    valueFormatter: (params: any) => {
      const value = Number(params);
      return isNaN(value)
        ? "-"
        : new Intl.NumberFormat("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(value);
    },
  },
  {
    field: "profitLoss",
    headerName: "Profit & Loss (Rs)",
    width: 150,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    valueFormatter: (params: any) => {
      const value = Number(params);
      return isNaN(value)
        ? "-"
        : new Intl.NumberFormat("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(value);
    },
  },
  {
    field: "profitloss_Perc",
    headerName: "Profit & Loss (%)",
    width: 130,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    valueFormatter: (params: any) => {
      const value = Number(params);
      return isNaN(value) ? "-" : `${value.toFixed(2)}%`;
    },
  },
];

export const spipSubSciptionDetailColumns: GridColDef[] = [
  {
    field: "branchCode",
    headerName: "Branch Code",
    width: 70,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "clientCode",
    headerName: "Client Code",
    width: 90,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "clientName",
    headerName: "Client Name",
    flex: 1, // Make this responsive
    minWidth: 250,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
    renderCell: (params) => (
      <div
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          width: "100%",
        }}
        title={params.value}
      >
        {params.value}
      </div>
    ),
  },
  {
    field: "productName",
    headerName: "Product",
    width: 70,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "invoiceMonth",
    headerName: "Payment Month",
    headerClassName: "header-wrap-custom",
    width: 80,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "duration",
    headerName: "Duration (Month)",
    headerClassName: "header-wrap-custom",
    width: 80,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
  },
  {
    field: "amount",
    headerName: "Amount",
    width: 90,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    valueFormatter: (params: any) => {
      const value = Number(params);
      return isNaN(value)
        ? "-"
        : new Intl.NumberFormat("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(value);
    },
  },
  {
    field: "startMonth",
    headerName: "Start Month",
    width: 100,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "endMonth",
    headerName: "End Month",
    width: 100,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "invoiceDownload",
    headerName: "Invoice Download",
    width: 80,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    headerClassName: "header-wrap-custom",
  },
];

export const ZONEWiseCommissionReport: GridColDef[] = [
  {
    field: "crocode",
    headerName: "ZONE",
    // flex: 1,
    width: 80,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "branchcode",
    headerName: "Partner Code",
    width: 70,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    // flex: 1,
  },
  {
    field: "branchname",
    headerName: "Partner Name",
    minWidth: 180,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
    flex: 2,
  },
  {
    field: "dtoftran",
    headerName: "Month",
    width: 70,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    // flex: 1,
  },
  {
    field: "totalFees",
    headerName: "Total Fees",
    headerClassName: "header-wrap-custom",
    width: 100,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    // flex: 1,
    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "gst",
    headerName: "GST",
    width: 100,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    // flex: 1,
    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "feeswithoutGST",
    headerName: "Fees without GST",
    width: 90,
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    headerAlign: "center",
    align: "right",
    // flex: 1,
    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "totalCommission",
    headerName: "Total Commission",
    headerClassName: "header-wrap-custom",
    width: 100,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    // flex: 1,
    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "monthlyCommission",
    headerName: "Monthly Commission",
    headerClassName: "header-wrap-custom",
    width: 100,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    // flex: 1,
    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "tds",
    headerName: "TDS",
    width: 100,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    flex: 1,
    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "commissionReleased",
    headerName: "Commission Released",
    headerClassName: "header-wrap-custom",
    width: 120,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    // flex: 1,
    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "balanceCommission",
    headerName: "Balance Commission",
    headerClassName: "header-wrap-custom",
    width: 120,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    // flex: 1,
    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
];

export const ClientWiseCommissonReport: GridColDef[] = [
  {
    field: "clientcode",
    headerName: "Client Code",
    flex: 1,
    minWidth: 120,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "clientName",
    headerName: "Client Name",
    flex: 1.5,
    minWidth: 160,
    headerAlign: "center",
    align: "left",
  },
  {
    field: "crocode",
    headerName: "ZONE",
    flex: 1,
    minWidth: 110,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "branchcode",
    headerName: "Partner Code",
    flex: 1,
    minWidth: 130,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "branchname",
    headerName: "Partner Name",
    flex: 1.5,
    minWidth: 160,
    headerAlign: "center",
    align: "left",
  },
  {
    field: "dtoftran",
    headerName: "Month",
    flex: 1,
    minWidth: 120,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "totalFees",
    headerName: "Total Fees (₹)",
    flex: 1.2,
    minWidth: 140,
    headerAlign: "center",
    align: "right",
  },
  {
    field: "gst",
    headerName: "GST (₹)",
    flex: 1,
    minWidth: 100,
    headerAlign: "center",
    align: "right",
  },
  {
    field: "feeswithoutGST",
    headerName: "Fees w/o GST (₹)",
    flex: 1.2,
    minWidth: 140,
    headerAlign: "center",
    align: "right",
  },
  {
    field: "totalCommission",
    headerName: "Total Commission (₹)",
    flex: 1.5,
    minWidth: 160,
    headerAlign: "center",
    align: "right",
  },
  {
    field: "monthlyCommission",
    headerName: "Monthly Commission (₹)",
    flex: 1.5,
    minWidth: 170,
    headerAlign: "center",
    align: "right",
  },
  {
    field: "tds",
    headerName: "TDS (₹)",
    flex: 1,
    minWidth: 100,
    headerAlign: "center",
    align: "right",
  },
  {
    field: "commissionReleased",
    headerName: "Commission Released (₹)",
    flex: 1.5,
    minWidth: 170,
    headerAlign: "center",
    align: "right",
  },
  {
    field: "balanceCommission",
    headerName: "Balance Commission (₹)",
    flex: 1.5,
    minWidth: 170,
    headerAlign: "center",
    align: "right",
  },
];

export const spipClientDetails: GridColDef[] = [
  {
    field: "iaCode",
    headerName: "Client Code",
    flex: 1,
    minWidth: 120,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "clientName",
    headerName: "Client Name",
    flex: 2,
    minWidth: 180,
    headerAlign: "center",
    align: "left",
  },
  {
    field: "backofficecode",
    headerName: "Backoffice Code",
    flex: 1,
    minWidth: 130,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "branchCode",
    headerName: "Branch Code",
    flex: 1,
    minWidth: 120,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "pan",
    headerName: "PAN",
    flex: 1,
    minWidth: 120,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "mobileNo",
    headerName: "Mobile No.",
    flex: 1.2,
    minWidth: 140,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "emailId",
    headerName: "Email ID",
    flex: 1.8,
    minWidth: 200,
    headerAlign: "center",
    align: "left",
  },
  {
    field: "active",
    headerName: "Status",
    flex: 0.8,
    minWidth: 100,
    headerAlign: "center",
    align: "center",
    // renderCell: ({ value }) => (
    //   <span
    //     style={{
    //       color: value === "Yes" ? "green" : "red",
    //       fontWeight: 600,
    //     }}
    //   >
    //     {value}
    //   </span>
    // ),
  },
  {
    field: "activationDate",
    headerName: "Activation Date",
    flex: 1.2,
    minWidth: 140,
    headerAlign: "center",
    align: "center",
    // valueFormatter: ({ value }) =>
    //   value ? new Date(value).toLocaleDateString("en-GB") : "-",
  },
  {
    field: "rmCode",
    headerName: "Introducer",
    flex: 1.5,
    minWidth: 160,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "address",
    headerName: "Address",
    flex: 2,
    minWidth: 220,
    headerAlign: "center",
    align: "left",
  },
  {
    field: "startDate",
    headerName: "Start Date",
    flex: 1,
    minWidth: 130,
    headerAlign: "center",
    align: "center",
    // valueFormatter: ({ value }) =>
    //   value ? new Date(value).toLocaleDateString("en-GB") : "-",
  },
  {
    field: "endDate",
    headerName: "End Date",
    flex: 1,
    minWidth: 130,
    headerAlign: "center",
    align: "center",
    // valueFormatter: ({ value }) =>
    //   value ? new Date(value).toLocaleDateString("en-GB") : "-",
  },
  {
    field: "expiryStatus",
    headerName: "Expiry Status",
    flex: 1.2,
    minWidth: 140,
    headerAlign: "center",
    align: "center",
    // renderCell: ({ value }) => (
    //   <span
    //     style={{
    //       color: value === "Expired" ? "red" : "green",
    //       fontWeight: 600,
    //     }}
    //   >
    //     {value}
    //   </span>
    // ),
  },
];

export const getApproverOneDetails: GridColDef[] = [
  {
    field: "dealSheetB64",
    headerName: "Deal Sheet",
    headerClassName: "header-wrap-custom",
    minWidth: 50,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
    sortable: false,

    renderCell: (params) => {
      const base64Data = params.value;
      const today = new Date();

      const dd = String(today.getDate()).padStart(2, "0");
      const mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
      const yy = String(today.getFullYear()).slice(-2);

      const filename = `Deal_Sheet_${dd}-${mm}-${yy}.pdf`;

      const handleDownload = () => {
        const link = document.createElement("a");
        link.href = `data:application/pdf;base64,${base64Data}`;
        link.download = filename;
        link.click();
      };

      return (
        <button
          onClick={handleDownload}
          style={{
            color: "#11395C",
            textDecoration: "underline",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          <DownloadForOfflineIcon />
        </button>
      );
    },
  },
  {
    field: "Action",
    headerName: "Approve | Reject",
    headerClassName: "header-wrap-custom",
    minWidth: 120,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: "transactionDate",
    headerName: "Transaction Date",
    minWidth: 100,
    align: "center",
    disableColumnMenu: true,
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
  },
  {
    field: "clientName",
    headerName: "Client Name",
    minWidth: 150,
    disableColumnMenu: true,
    headerAlign: "center",
  },
  {
    field: "clientCategory",
    headerName: "Client Category",
    minWidth: 100,
    headerClassName: "header-wrap-custom",
    align: "center",
    disableColumnMenu: true,
    headerAlign: "center",
  },
  {
    field: "rmCode",
    headerName: "RM Code",
    minWidth: 60,
    align: "center",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    headerAlign: "center",
  },
  {
    field: "rmName",
    headerName: "RM Name",
    minWidth: 160,
    disableColumnMenu: true,
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
  },
  {
    field: "nameOfSecurities",
    headerName: "Name of Securities",
    headerClassName: "header-wrap-custom",
    minWidth: 130,
    disableColumnMenu: true,
    headerAlign: "center",
  },
  {
    field: "noOfShares",
    headerName: "No of Shares",
    minWidth: 70,
    disableColumnMenu: true,
    align: "right",
    headerClassName: "header-wrap-custom",
    headerAlign: "center",
  },
  {
    field: "clientRate",
    headerName: "Client Rate",
    minWidth: 70,
    align: "right",
    disableColumnMenu: true,
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
    field: "vendorRate",
    headerName: "Vendor Rate",
    minWidth: 70,
    align: "right",
    disableColumnMenu: true,
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
    field: "lkpCommissionPerShare",
    headerName: "Commision Per Share",
    headerClassName: "header-wrap-custom",
    minWidth: 100,
    align: "right",
    disableColumnMenu: true,
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
    field: "brokerageInclusiveGST",
    headerName: "Commision Inclusive GST",
    headerClassName: "header-wrap-custom",
    minWidth: 100,
    align: "right",
    disableColumnMenu: true,
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
    field: "gst",
    headerName: "GST",
    minWidth: 70,
    align: "right",
    disableColumnMenu: true,
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
    field: "brokerageExclusiveGST",
    headerClassName: "header-wrap-custom",
    headerName: "Commision Exclusive GST",
    minWidth: 100,
    align: "right",
    disableColumnMenu: true,
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
    field: "sbCode",
    headerName: "SB Code",
    width: 100,
    align: "right",
    disableColumnMenu: true,
    headerAlign: "center",
  },
  {
    field: "sbRate",
    headerName: "SB Rate",
    minWidth: 70,
    align: "right",
    disableColumnMenu: true,
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
    field: "sbCommission",
    headerName: "SB Commission",
    minWidth: 100,
    align: "right",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
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
    field: "netBrokerage",
    headerName: "Net Commision",
    headerClassName: "header-wrap-custom",
    minWidth: 100,
    align: "right",
    disableColumnMenu: true,
    headerAlign: "center",
    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
];

export const getApproverTwoDetails: GridColDef[] = [
  {
    field: "dealSheetB64",
    headerName: "Deal Sheet",
    headerClassName: "header-wrap-custom",
    minWidth: 50,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
    sortable: false,

    renderCell: (params) => {
      const base64Data = params.value;
      const today = new Date();

      const dd = String(today.getDate()).padStart(2, "0");
      const mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
      const yy = String(today.getFullYear()).slice(-2);

      const filename = `Deal_Sheet_${dd}-${mm}-${yy}.pdf`;

      const handleDownload = () => {
        const link = document.createElement("a");
        link.href = `data:application/pdf;base64,${base64Data}`;
        link.download = filename;
        link.click();
      };

      return (
        <button
          onClick={handleDownload}
          style={{
            color: "#11395C",
            textDecoration: "underline",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          <DownloadForOfflineIcon />
        </button>
      );
    },
  },
  {
    field: "Action",
    headerName: "Approve | Reject",
    headerClassName: "header-wrap-custom",
    minWidth: 120,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: "approver1",
    headerName: "Approver Code",
    minWidth: 100,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    headerClassName: "header-wrap-custom",
  },
  {
    field: "approver1_Remarks",
    headerName: "Approver One Remarks",
    headerClassName: "header-wrap-custom",
    minWidth: 120,
    disableColumnMenu: true,
    headerAlign: "center",
  },
  {
    field: "vendorName",
    headerName: "Vendor Name",
    minWidth: 250,
    disableColumnMenu: true,
    headerAlign: "center",
  },
  ...getApproverOneDetails.filter(
    (col) => col.field !== "Action" && col.field !== "dealSheetB64"
  ),
];

export const unListedTradeColumns: GridColDef[] = [
  {
    field: "action",
    headerName: "Actions",
    headerClassName: "header-wrap-custom",
    // flex: 1,
    width: 90,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "rmCode",
    headerName: "RM Code",
    width: 80,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "transactionDate",
    headerName: "Transaction Date",
    width: 130,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "clientName",
    headerName: "Client Name",
    flex: 1,
    minWidth: 160,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "nameOfSecurities",
    headerName: "Securities Name",
    width: 120,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "noOfShares",
    headerName: "No. of Shares",
    headerClassName: "header-wrap-custom",
    width: 70,
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
  },
  {
    field: "clientRate",
    headerName: "Client Rate",
    headerClassName: "header-wrap-custom",
    width: 70,
    headerAlign: "center",
    align: "right",
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
    field: "vendorRate",
    headerName: "Vendor Rate",
    headerClassName: "header-wrap-custom",
    width: 70,
    headerAlign: "center",
    align: "right",
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
    field: "lkpCommissionPerShare",
    headerName: "LKP Commission/Share",
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    width: 100,
  },
  {
    field: "brokerageInclusiveGST",
    headerName: "Brokerage (Incl. GST)",
    width: 100,
    headerClassName: "header-wrap-custom",
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
    // valueFormatter: (params: any) => {
    //   const value = parseFloat(params); // Convert the value to a number
    //   return new Intl.NumberFormat("en-IN", {
    //     minimumFractionDigits: 2,
    //     maximumFractionDigits: 2,
    //   }).format(value);
    // },
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "gst",
    headerName: "GST",
    width: 90,
    headerAlign: "center",
    align: "right",
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
    field: "brokerageExclusiveGST",
    headerName: "Brokerage (Excl. GST)",
    width: 100,
    headerClassName: "header-wrap-custom",
    headerAlign: "center",
    align: "right",
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
    field: "sbRate",
    headerName: "SubBroker Rate",
    width: 90,
    headerClassName: "header-wrap-custom",
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
  },
  {
    field: "sbCode",
    headerName: "SubBroker Code",
    width: 90,
    headerClassName: "header-wrap-custom",
    headerAlign: "center",
    align: "right",
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
    field: "sbCommission",
    headerName: "SubBroker Commission",
    width: 100,
    headerClassName: "header-wrap-custom",
    headerAlign: "center",
    align: "right",
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
    field: "netBrokerage",
    headerName: "Net Brokerage",
    width: 90,
    headerClassName: "header-wrap-custom",
    headerAlign: "center",
    align: "right",
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
    field: "remarks",
    headerName: "Remark",
    // flex: 0.8,
    minWidth: 200,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
  },
  {
    field: "status",
    headerName: "Status",
    // flex: 0.8,
    minWidth: 200,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
  },
];

export const ClientPledgeRequest: GridColDef[] = [
  {
    disableColumnMenu: true,
    field: "clientCode",
    headerName: "Client Code",
    align: "left",
    flex: 1,
    minWidth: 100, // Reasonable on all screens
  },
  {
    disableColumnMenu: true,
    field: "clientName",
    headerName: "Client Name",
    flex: 2,
    minWidth: 160, // Names can be long; ensure space
  },
  {
    field: "mobileNo",
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
    field: "clientStatus",
    headerName: "Status",
    flex: 0.8,
    minWidth: 80,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
  },
  {
    field: "poaStatus",
    headerName: "POA Status",
    flex: 1,
    minWidth: 70, // Slightly wider for better label display
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
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
    field: "holdingValue",
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
  // {
  //   field: "ledgerReport",
  //   headerName: "Client Report with Ledger",
  //   headerClassName: "header-wrap-custom",
  //   minWidth: 120,
  //   flex: 1,
  //   align: "right",
  //   headerAlign: "center",
  //   disableColumnMenu: true,
  //   // valueFormatter: (params: any) => {
  //   //   const value = parseFloat(params);
  //   //   return new Intl.NumberFormat("en-IN", {
  //   //     minimumFractionDigits: 2,
  //   //     maximumFractionDigits: 2,
  //   //   }).format(value);
  //   // },
  // },
  // {
  //   field: "pledgeReport",
  //   headerName: "Client Report with Pledge",
  //   headerClassName: "header-wrap-custom",
  //   minWidth: 120,
  //   flex: 1,
  //   align: "right",
  //   headerAlign: "center",
  //   disableColumnMenu: true,
  //   // valueFormatter: (params: any) => {
  //   //   const value = parseFloat(params);
  //   //   return new Intl.NumberFormat("en-IN", {
  //   //     minimumFractionDigits: 2,
  //   //     maximumFractionDigits: 2,
  //   //   }).format(value);
  //   // },
  // },
  // {
  //   field: "freeHolding Value",
  //   headerName: "Free Holding Value",
  //   headerClassName: "header-wrap-custom",
  //   minWidth: 120,
  //   flex: 1,
  //   align: "right",
  //   headerAlign: "center",
  //   disableColumnMenu: true,
  //   // valueFormatter: (params: any) => {
  //   //   const value = parseFloat(params);
  //   //   return new Intl.NumberFormat("en-IN", {
  //   //     minimumFractionDigits: 2,
  //   //     maximumFractionDigits: 2,
  //   //   }).format(value);
  //   // },
  // },
  {
    field: "encryptedCode",
    headerName: "Pledge Request",
    headerClassName: "header-wrap-custom",
    // flex: 1,
    width: 90,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
];

export const clientAPBrokerageColumns: GridColDef[] = [
  {
    field: "clientCode",
    headerName: "Client Code",
    width: 120,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "clientName",
    headerName: "Client Name",
    minWidth: 200,
    flex: 1,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  // {
  //   field: "monthYr",
  //   headerName: "Month",
  //   width: 110,
  //   headerAlign: "center",
  //   align: "center",
  //   disableColumnMenu: true,
  // },
  {
    field: "grossBrokerage",
    headerName: "Gross Brokerage",
    width: 140,
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  // {
  //   field: "sbBrokerage",
  //   headerName: "Sub-Broker Brokerage",
  //   width: 160,
  //   headerAlign: "center",
  //   align: "right",
  //   disableColumnMenu: true,
  //   valueFormatter: (params: any) => {
  //     const value = parseFloat(params);
  //     return new Intl.NumberFormat("en-IN", {
  //       minimumFractionDigits: 2,
  //       maximumFractionDigits: 2,
  //     }).format(value);
  //   },
  // },
  // {
  //   field: "netBrokerage",
  //   headerName: "Net Brokerage",
  //   width: 140,
  //   headerAlign: "center",
  //   align: "right",
  //   disableColumnMenu: true,
  //   valueFormatter: (params: any) => {
  //     const value = parseFloat(params);
  //     return new Intl.NumberFormat("en-IN", {
  //       minimumFractionDigits: 2,
  //       maximumFractionDigits: 2,
  //     }).format(value);
  //   },
  // },
  {
    field: "contribution",
    headerName: "Contribution %",
    width: 140,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    // valueFormatter: (params: any) => {
    //   return `${params} %`;
    // },
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      if (isNaN(value)) return "0%";
      return (
        new Intl.NumberFormat("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(value) + "%"
      );
    },
  },
];

export const APContestAchievedClients: GridColDef[] = [
  {
    field: "clientCode",
    headerName: "Client Code",
    width: 130,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "clientName",
    headerName: "Client Name",
    minWidth: 200,
    flex: 1,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "activationDate",
    headerName: "Activation Date",
    width: 150,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "lastTradeDate",
    headerName: "Last Trade Date",
    width: 150,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
];
export const EmpBrokerageAchieved: GridColDef[] = [
  {
    field: "clientCode",
    headerName: "Client Code",
    width: 130,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "clientName",
    headerName: "Client Name",
    minWidth: 200,
    flex: 1,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "grossBrokerage",
    headerName: "Gross Brokerage",
    width: 150,
    headerAlign: "center",
    align: "right",
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
    field: "netToLKPBrokerage",
    headerName: "Net To LKP Brokerage",
    width: 150,
    headerAlign: "center",
    align: "right",
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
    field: "slbM_GrossBrokerage",
    headerName: "SLBM Gross Brokerage",
    width: 150,
    headerAlign: "center",
    align: "right",
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
    field: "slbM_NetToLKPBrokerage",
    headerName: "SLBM Net To LKP Brokerage",
    width: 150,
    headerAlign: "center",
    align: "right",
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
export const EmpNonBrokerageAchieved: GridColDef[] = [
  {
    field: "empCode",
    headerName: "Employee Code",
    width: 130,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "monthYr",
    headerName: "Month-Year",
    width: 120,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },

  {
    field: "insurance_Gross",
    headerName: "Insurance Gross",
    width: 150,
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
  },
  {
    field: "insurance_NetToLKP",
    headerName: "Insurance Net To LKP",
    width: 170,
    headerAlign: "center",
    align: "right",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
  },
  {
    field: "loanRevenue",
    headerName: "Loan Revenue",
    width: 140,
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
  },
  {
    field: "mfRevenue",
    headerName: "MF Revenue",
    width: 130,
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
  },
  {
    field: "liquiLoansRev",
    headerName: "Liquid Loans Revenue",
    width: 180,
    headerAlign: "center",
    align: "right",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
  },
  {
    field: "spipRev",
    headerName: "SPIP Revenue",
    width: 130,
    headerAlign: "center",
    align: "right",
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
    field: "trilogyRev",
    headerName: "Trilogy Revenue",
    width: 140,
    headerAlign: "center",
    align: "right",
    disableColumnMenu: true,
  },
];
export const ClientExclusionColumns: GridColDef[] = [
  {
    field: "zone",
    headerName: "Zone",
    minWidth: 80,
    flex: 0.7,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "type",
    headerName: "Type",
    minWidth: 80,
    flex: 0.7,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "code",
    headerName: "Client Code",
    minWidth: 150,
    flex: 1,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  // {
  //   field: "excludeFrom",
  //   headerName: "Exclude From",
  //   minWidth: 140,
  //   flex: 1,
  //   headerAlign: "center",
  //   align: "center",
  //   disableColumnMenu: true,
  // },
  {
    field: "remarks",
    headerName: "Remarks",
    minWidth: 200,
    flex: 2.5,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "createdBy",
    headerName: "Created By",
    minWidth: 130,
    flex: 1,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "createdOn",
    headerName: "Created On",
    minWidth: 130,
    flex: 1,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,

    valueFormatter: (params: any) => {
      if (!params) return "-";
      return dayjs(params).format("DD-MMM-YY"); // Converts to "27-Feb-24"
    },
  },
  {
    field: "action",
    headerName: "Action",
    minWidth: 80,
    flex: 0.5,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
    sortable: false,
    filterable: false,
  },
];

export const RHTopClientsColumns: GridColDef[] = [
  {
    field: "clientCode",
    headerName: "Client Code",
    minWidth: 100,
    flex: 0.7,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "clientName",
    headerName: "Client Name",
    minWidth: 150,
    flex: 1,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
  },
  {
    field: "revenue",
    headerName: "Revenue",
    minWidth: 100,
    flex: 0.7,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "tradeDate",
    headerName: "Last Trade Date",
    minWidth: 130,
    flex: 0.8,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    // valueFormatter: (params) =>
    //   params.value ? new Date(params.value).toLocaleDateString("en-GB") : "-",
  },
  {
    field: "rmName",
    headerName: "RM Name",
    minWidth: 150,
    flex: 1,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
  },
];
export const ThirdParty: GridColDef[] = [
  {
    field: "ledgerCode",
    headerName: "Ledger Code",
    minWidth: 70,
    flex: 0.4,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
  },
  {
    field: "companyName",
    headerName: "Company Name",
    minWidth: 180,
    flex: 1.2,
    headerAlign: "center",
    align: "center",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
  },
  {
    field: "sacNumber",
    headerName: "SAC Number",
    minWidth: 75,
    flex: 0.5,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
  },
  {
    field: "state",
    headerName: "State",
    minWidth: 120,
    flex: 0.8,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "gstStateCode",
    headerName: "GST State Code",
    minWidth: 60,
    flex: 0.3,
    headerAlign: "center",
    align: "center",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
  },
  {
    field: "gstNumber",
    headerName: "GST Number",
    minWidth: 150,
    flex: 1.2,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },

  {
    field: "pan",
    headerName: "PAN Number",
    minWidth: 120,
    flex: 0.8,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
  },
  {
    field: "emailId",
    headerName: "Email ID",
    minWidth: 180,
    flex: 1.2,
    headerAlign: "center",
    align: "center",
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
    field: "mobileNo",
    headerName: "Mobile Number",
    minWidth: 120,
    flex: 0.8,
    headerAlign: "center",
    align: "center",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
  },
  {
    field: "address1",
    headerName: "Address 1",
    minWidth: 180,
    flex: 1,
    headerAlign: "center",
    align: "left",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
  },
  {
    field: "address2",
    headerName: "Address 2",
    minWidth: 180,
    flex: 1,
    headerAlign: "center",
    align: "left",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
  },
  {
    field: "address3",
    headerName: "Address 3",
    minWidth: 180,
    flex: 1,
    headerAlign: "center",
    align: "left",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
  },
  {
    field: "action",
    headerName: "Action",
    minWidth: 120,
    flex: 0.8,
    headerAlign: "center",
    align: "center",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
  },
];

export const ThirdPartyStatusReport: GridColDef[] = [
  // Spread in all columns except the one with field "action"
  ...ThirdParty.filter((col) => col.field !== "action"),

  {
    field: "approvalStatus",
    headerName: "Status",
    flex: 1,
    minWidth: 180,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
    renderCell: (params: any) => {
      const status = params.value?.toLowerCase() || "";

      let backgroundColor = "#cfd8dc"; // Default neutral
      let color = "#263238";
      let border = "1px solid #b0bec5";

      if (status.includes("approved")) {
        backgroundColor = "#a5d6a7"; // Light green
        color = "#1b5e20";
        border = "1px solid #81c784";
      } else if (status.includes("pending")) {
        backgroundColor = "#FFF4E5"; // Soft peach / beige
        color = "#FF9800"; // Warm orange (not too saturated)
        border = "1px solid #FFB74D"; // Light orange border
      } else if (status.includes("rejected") || status.includes("reject")) {
        backgroundColor = "#ef9a9a"; // Light red
        color = "#b71c1c";
        border = "1px solid #e57373";
      }

      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "100%",
            fontFamily: "Public Sans",
          }}
        >
          <div
            style={{
              backgroundColor,
              color,
              border,
              borderRadius: "999px",
              padding: "3px 6px",
              fontSize: "11px",
              fontWeight: 600,
              // textTransform: "capitalize",
              whiteSpace: "nowrap",
              display: "inline-block",
              textAlign: "center",
              minWidth: "160px",
              lineHeight: "1",
            }}
          >
            {params.value}
          </div>
        </div>
      );
    },
  },
];

export const TpInvoiceUploadColumns: GridColDef[] = [
  {
    field: "invoiceNumber",
    headerName: "Invoice Number",
    minWidth: 130,
    flex: 1,
    headerAlign: "center",
    align: "center", // Code → Center
    disableColumnMenu: true,
  },
  {
    field: "invoiceDate",
    headerName: "Invoice Date",
    minWidth: 110,
    flex: 1,
    headerAlign: "center",
    align: "center", // Date → Center
    disableColumnMenu: true,

    valueFormatter: (params: any) => {
      if (!params) return "-";
      return dayjs(params).format("DD-MMM-YY"); // Converts to "27-Feb-24"
    },
  },
  {
    field: "companyName",
    headerName: "Company Name",
    minWidth: 200,
    flex: 2,
    headerAlign: "center",
    align: "left", // Text → Left
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
  },
  {
    field: "partyName",
    headerName: "Party Name",
    minWidth: 200,
    flex: 2,
    headerAlign: "center",
    align: "left", // Text → Left
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
  },
  {
    field: "gstNumber",
    headerName: "GST Number",
    minWidth: 160,
    flex: 1.5,
    headerAlign: "center",
    align: "center", // Code → Center
    disableColumnMenu: true,
  },
  {
    field: "forMonth",
    headerName: "For Month",
    minWidth: 100,
    flex: 1,
    headerAlign: "center",
    align: "center", // Date → Center
    disableColumnMenu: true,
  },
  {
    field: "product",
    headerName: "Product",
    minWidth: 150,
    flex: 1.5,
    headerAlign: "center",
    align: "left", // Text → Left
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
  },

  {
    field: "p_State",
    headerName: "Party State",
    minWidth: 140,
    flex: 1.2,
    headerAlign: "center",
    align: "left", // Text → Left
    disableColumnMenu: true,
  },
  {
    field: "baseAmount",
    headerName: "Base Amount",
    minWidth: 110,
    flex: 1,
    headerAlign: "center",
    align: "right", // Number → Right
    type: "number",
    disableColumnMenu: true,
  },
  {
    field: "sgst",
    headerName: "SGST",
    minWidth: 80,
    flex: 0.8,
    headerAlign: "center",
    align: "right", // Number → Right
    type: "number",
    disableColumnMenu: true,
  },
  {
    field: "cgst",
    headerName: "CGST",
    minWidth: 80,
    flex: 0.8,
    headerAlign: "center",
    align: "right", // Number → Right
    type: "number",
    disableColumnMenu: true,
  },
  {
    field: "igst",
    headerName: "IGST",
    minWidth: 80,
    flex: 0.8,
    headerAlign: "center",
    align: "right", // Number → Right
    type: "number",
    disableColumnMenu: true,
  },
  {
    field: "totalAmount",
    headerName: "Total Amount",
    minWidth: 120,
    flex: 1.2,
    headerAlign: "center",
    align: "right", // Number → Right
    type: "number",
    disableColumnMenu: true,
  },
];
export const TpInvoiceVerifyColumns: GridColDef[] = [
  ...TpInvoiceUploadColumns,
  {
    field: "createdOn",
    headerName: "Created On",
    minWidth: 160,
    flex: 1,
    headerAlign: "center",
    align: "center",
    type: "number",
    disableColumnMenu: true,
  },
  {
    field: "action",
    headerName: "Action",
    width: 100,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
  },
  {
    field: "delete",
    headerName: "Delete",
    width: 70,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
  },
];
export const TpInvoiceMailsColumns: GridColDef[] = [
  ...TpInvoiceUploadColumns,
  {
    field: "generate",
    headerName: "Generate Invoice",
    width: 120,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
  },
];
export const TpInvoiceReportColumns: GridColDef[] = [
  ...TpInvoiceUploadColumns,
  {
    field: "verificationStatus",
    headerName: "Status",
    minWidth: 160,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    renderCell: (params: any) => {
      const status = params.value?.toLowerCase() || "";

      let backgroundColor = "#cfd8dc"; // Default neutral
      let color = "#263238";
      let border = "1px solid #b0bec5";

      if (status.includes("approved")) {
        backgroundColor = "#a5d6a7"; // Light green
        color = "#1b5e20";
        border = "1px solid #81c784";
      } else if (status.includes("pending")) {
        backgroundColor = "#FFF4E5"; // Soft peach / beige
        color = "#FF9800"; // Warm orange (not too saturated)
        border = "1px solid #FFB74D"; // Light orange border
      } else if (status.includes("rejected") || status.includes("reject")) {
        backgroundColor = "#ef9a9a"; // Light red
        color = "#b71c1c";
        border = "1px solid #e57373";
      }

      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "100%",
            fontFamily: "Public Sans",
          }}
        >
          <div
            style={{
              backgroundColor,
              color,
              border,
              borderRadius: "999px",
              padding: "3px 6px",
              fontSize: "11px",
              fontWeight: 600,
              // textTransform: "capitalize",
              whiteSpace: "nowrap",
              display: "inline-block",
              textAlign: "center",
              minWidth: "110px",
              lineHeight: "1",
            }}
          >
            {params.value}
          </div>
        </div>
      );
    },
  },
];
export const VendorMasterColumns: GridColDef[] = [
  {
    field: "vendorId",
    headerName: "Vendor ID",
    minWidth: 100,
    flex: 0.6,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  // {
  //   field: "vendorCode",
  //   headerName: "Vendor Code",
  //   minWidth: 120,
  //   flex: 0.7,
  //   disableColumnMenu: true,
  //   headerAlign: "center",
  //   align: "center",
  // },
  {
    field: "vendorName",
    headerName: "Vendor Name",
    minWidth: 200,
    flex: 1,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
  },
  {
    field: "address1",
    headerName: "Address",
    minWidth: 300,
    flex: 1.2,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    renderCell: (params: any) => {
      const address1 = (params.row?.address1 || "").trim();
      const address2 = (params.row?.address2 || "").trim();
      const address3 = (params.row?.address3 || "").trim();
      return `${address1}  ${address2} ${address3}`;
    },
  },
  {
    field: "city",
    headerName: "City",
    minWidth: 100,
    flex: 0.6,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "state",
    headerName: "State",
    minWidth: 100,
    flex: 0.6,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "pincode",
    headerName: "Pin Code",
    minWidth: 100,
    flex: 0.6,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "teleNo",
    headerName: "Tele No",
    minWidth: 120,
    flex: 0.7,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "mobileNo",
    headerName: "Mobile No",
    minWidth: 130,
    flex: 0.8,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "emailID",
    headerName: "Email ID",
    minWidth: 180,
    flex: 1,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "panNo",
    headerName: "PAN No",
    minWidth: 140,
    flex: 0.9,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "gstNo",
    headerName: "GST No",
    minWidth: 140,
    flex: 0.9,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "msmeFlag",
    headerName: "MSME Flag",
    minWidth: 110,
    flex: 0.6,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    // valueFormatter: ({ value }) => (value ? "Yes" : "No"),
  },
  {
    field: "msmeType",
    headerName: "MSME Type",
    minWidth: 130,
    flex: 0.8,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "actions",
    headerName: "Actions",
    minWidth: 120,
    flex: 0.6,
    sortable: false,
    filterable: false,
    headerAlign: "center",
    align: "center",
    // renderCell: (params) => (
    //   <div>
    //     <IconButton
    //       onClick={() => {
    //         console.log("Edit", params.row);
    //       }}
    //     >
    //       <EditIcon fontSize="small" />
    //     </IconButton>
    //     <IconButton
    //       onClick={() => {
    //         console.log("Delete", params.row);
    //       }}
    //     >
    //       <DeleteIcon fontSize="small" />
    //     </IconButton>
    //   </div>
    // ),
  },
  {
    field: "accRemark",
    headerName: "Remark",
    minWidth: 160,
    flex: 0.6,
    sortable: false,
    filterable: false,
    headerAlign: "center",
    align: "center",
    headerClassName: "header-wrap-custom",
  },
];

export const VendorMasterApprovalColumns: GridColDef[] = [
  {
    field: "vendorId",
    headerName: "Vendor ID",
    minWidth: 100,
    flex: 0.6,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  // {
  //   field: "vendorCode",
  //   headerName: "Vendor Code",
  //   minWidth: 120,
  //   flex: 0.7,
  //   disableColumnMenu: true,
  //   headerAlign: "center",
  //   align: "center",
  // },
  {
    field: "vendorName",
    headerName: "Vendor Name",
    minWidth: 200,
    flex: 1,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
  },
  {
    field: "address1",
    headerName: "Address",
    minWidth: 400,
    flex: 1.2,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    renderCell: (params: any) => {
      const address1 = (params.row?.address1 || "").trim();
      const address2 = (params.row?.address2 || "").trim();
      const address3 = (params.row?.address3 || "").trim();
      return `${address1}  ${address2} ${address3}`;
    },
  },
  {
    field: "city",
    headerName: "City",
    minWidth: 100,
    flex: 0.6,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "state",
    headerName: "State",
    minWidth: 100,
    flex: 0.6,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "pincode",
    headerName: "Pin Code",
    minWidth: 100,
    flex: 0.6,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "teleNo",
    headerName: "Telephone No",
    minWidth: 120,
    flex: 0.7,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "mobileNo",
    headerName: "Mobile No",
    minWidth: 130,
    flex: 0.8,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "emailID",
    headerName: "Email ID",
    minWidth: 180,
    flex: 0.8,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "panNo",
    headerName: "PAN No",
    minWidth: 140,
    flex: 0.9,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "gstNo",
    headerName: "GST No",
    minWidth: 140,
    flex: 0.9,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "msmeFlag",
    headerName: "MSME Flag",
    minWidth: 110,
    flex: 0.6,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    // valueFormatter: ({ value }) => (value ? "Yes" : "No"),
  },
  {
    field: "msmeType",
    headerName: "MSME Type",
    minWidth: 130,
    flex: 0.8,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  // {
  //   field: "tdsPath",
  //   headerName: "TDS Document",
  //   minWidth: 120,
  //   flex: 0.6,
  //   sortable: false,
  //   filterable: false,
  //   headerAlign: "center",
  //   align: "center",
  // },
  {
    field: "msmePath",
    headerName: "MSME Document",
    minWidth: 120,
    flex: 0.6,
    sortable: false,
    filterable: false,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "bankDoc",
    headerName: "Bank Document",
    minWidth: 120,
    flex: 0.6,
    sortable: false,
    filterable: false,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "panDocument",
    headerName: "Pan Document",
    minWidth: 120,
    flex: 0.6,
    sortable: false,
    filterable: false,
    headerAlign: "center",
    align: "center",
  },

  {
    field: "actions",
    headerName: "Actions",
    minWidth: 120,
    flex: 0.6,
    sortable: false,
    filterable: false,
    headerAlign: "center",
    align: "center",
    headerClassName: "header-wrap-custom",
  },
  {
    field: "accRemark",
    headerName: "Remark",
    minWidth: 160,
    flex: 0.6,
    sortable: false,
    filterable: false,
    headerAlign: "center",
    align: "center",
    headerClassName: "header-wrap-custom",
  },
];

export const getAPContestReportColumns: GridColDef[] = [
  {
    field: "apCode",
    headerName: "AP Code",
    flex: 1,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    headerClassName: "header-wrap-custom",
  },
  {
    field: "apName",
    headerName: "AP Name",
    flex: 2,
    disableColumnMenu: true,
    headerAlign: "center",
  },
  // {
  //   field: "qtarget",
  //   headerName: "Revenue Target",
  //   flex: 1.2,
  //   disableColumnMenu: true,
  //   headerAlign: "center",
  //   align: "right",
  //   headerClassName: "header-wrap-custom",
  //   valueFormatter: (params: any) =>
  //     new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
  //       params
  //     ),
  // },
  {
    field: "brokerageAchieved",
    headerName: "Revenue Achieved",
    flex: 1.3,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    headerClassName: "header-wrap-custom",
    valueFormatter: (params: any) =>
      new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
        params
      ),
  },
  // {
  //   field: "brokerageAchievedPerc",
  //   headerName: "Revenue Achievement (%)",
  //   flex: 1.4,
  //   disableColumnMenu: true,
  //   headerAlign: "center",
  //   align: "center",
  //   headerClassName: "header-wrap-custom",
  //   valueFormatter: (params: any) => {
  //     return `${params} %`;
  //   },
  //   // valueGetter: (params: any) => `${params.achievementPercentage ?? 0}%`,
  // },
  // {
  //   field: "newClientCount",
  //   headerName: " Clients Target",
  //   flex: 1,
  //   disableColumnMenu: true,
  //   headerAlign: "center",
  //   align: "center",
  //   headerClassName: "header-wrap-custom",
  // },
  {
    field: "clientsAchieved",
    headerName: "Clients Achieved",
    flex: 1,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    headerClassName: "header-wrap-custom",
  },
  // {
  //   field: "clientsAchievedPerc",
  //   headerName: "Client Achievement (%)",
  //   flex: 1.4,
  //   disableColumnMenu: true,
  //   headerAlign: "center",
  //   align: "center",
  //   headerClassName: "header-wrap-custom",
  //   valueFormatter: (params: any) => {
  //     return `${params} %`;
  //   },
  // },
  // {
  //   field: "prize",
  //   headerName: "Prize",
  //   flex: 1.5,
  //   disableColumnMenu: true,
  //   headerAlign: "center",
  //   align: "center",
  // },
];

export const clientUnpledgeReport: GridColDef[] = [
  {
    field: "ClientCode",
    headerName: "Client Code",
    width: 120,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "ClientName",
    headerName: "Client Name",
    flex: 1,
    minWidth: 160,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
  },
  {
    field: "ISIN",
    headerName: "ISIN",
    width: 160,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "Symbol",
    headerName: "Scrip Name",
    flex: 1,
    minWidth: 200,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "Quantity",
    headerName: "Quantity",
    width: 120,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
  },
  // {
  //   field: "RequestedBy",
  //   headerName: "Requested By",
  //   width: 140,
  //   disableColumnMenu: true,
  //   headerAlign: "center",
  //   align: "center",
  // },
  {
    field: "RequestedDate",
    headerName: "Requested Date",
    width: 160,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => {
      if (!params.value) return ""; // safety check
      const date = new Date(params.value);
      return date
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        .replace(/ /g, "-");
    },
  },
];
export const EmployeeTargetReportColumns: GridColDef[] = [
  {
    field: "empCode",
    headerName: "Emp Code",
    minWidth: 100,
    flex: 1,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "empName",
    headerName: "Emp Name",
    minWidth: 130,
    flex: 1,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
  },
  {
    field: "brokingRevnTarget",
    headerName: "Broking Revenue Target",
    minWidth: 120,
    flex: 1,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    valueFormatter: (params: any) =>
      new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(
        params
      ),
  },
  {
    field: "brokingRevnAchieved",
    headerName: "Broking Revenue Achieved",
    minWidth: 120,
    flex: 1,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    valueFormatter: (params: any) =>
      new Intl.NumberFormat("en-IN", {
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
      }).format(params),
  },
  {
    field: "nonBrokingRevnTarget",
    headerName: "Non-Broking Revenue Target",
    minWidth: 120,
    flex: 1,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    valueFormatter: (params: any) =>
      new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(
        params
      ),
  },
  {
    field: "nonBrokingRevnAchieved",
    headerName: "Non-Broking Revenue Achieved",
    minWidth: 120,
    flex: 1,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    valueFormatter: (params: any) =>
      new Intl.NumberFormat("en-IN", {
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
      }).format(params),
  },
  {
    field: "totalRevnTarget",
    headerName: "Total Revenue Target",
    minWidth: 120,
    flex: 1,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    valueFormatter: (params: any) =>
      new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
        params
      ),
  },
  {
    field: "totalRevnAchieved",
    headerName: "Total Revenue Achieved",
    minWidth: 120,
    flex: 1,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    valueFormatter: (params: any) =>
      new Intl.NumberFormat("en-IN", {
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
      }).format(params),
  },
  {
    field: "perRevAch",
    headerName: " % Revenue Achieved ",
    minWidth: 120,
    flex: 1,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    renderCell: (params: any) => {
      const value1 = params.row?.totalRevnAchieved || 0;
      const value2 = params.row?.totalRevnTarget || 0;

      // Convert to numbers
      const num1 = parseFloat(value1) || 0;
      const num2 = parseFloat(value2) || 0;

      // Calculate percentage safely (avoid division by zero)
      const percentage = num2 !== 0 ? (num1 / num2) * 100 : 0;

      // Optionally round to 2 decimals
      const percentageRounded = Math.round(percentage * 100) / 100;

      console.log("percentageRounded", percentageRounded);
      return `${percentageRounded}%`;
    },
    valueFormatter: (params: any) =>
      new Intl.NumberFormat("en-IN", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      }).format(params),
  },
  {
    field: "targetMF",
    headerName: "Target MF AUM",
    minWidth: 110,
    flex: 1,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    valueFormatter: (params: any) =>
      new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(
        params
      ),
  },
  {
    field: "achievedMF",
    headerName: "Achieved MF AUM",
    minWidth: 100,
    flex: 1,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    // valueFormatter: (params: any) =>
    //   new Intl.NumberFormat("en-IN", {
    //     maximumFractionDigits: 2,
    //     minimumFractionDigits: 2,
    //   }).format(params),
    valueFormatter: (params: any) =>
      new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(
        params
      ),
  },
  {
    field: "freshCashTarget",
    headerName: "Fresh Cash Margin Target",
    minWidth: 120,
    flex: 1,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    valueFormatter: (params: any) =>
      new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(
        params
      ),
  },
  {
    field: "freshCashAchieved",
    headerName: "Fresh Cash Margin Achieved",
    minWidth: 120,
    flex: 1,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    valueFormatter: (params: any) =>
      new Intl.NumberFormat("en-IN", {
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
      }).format(params),
  },
  {
    field: "newAccountCount",
    headerName: "New Account Target",
    minWidth: 80,
    flex: 1,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "newClientsAchieved",
    headerName: "New Clients Achieved",
    minWidth: 80,
    flex: 1,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "reactivationCount",
    headerName: "Reactivation Target",
    minWidth: 80,
    flex: 1,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "reactivatedClientsAchieved",
    headerName: "Reactivated Clients Achieved",
    minWidth: 100,
    flex: 1,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "spipClientsTarget",
    headerName: "SPIP Clients Target",
    minWidth: 100,
    flex: 1,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "spipClientsAchieved",
    headerName: "SPIP Clients Achieved",
    minWidth: 100,
    flex: 1,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "insurancePremTarget",
    headerName: "Insurance Premium Target",
    minWidth: 120,
    flex: 1,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    valueFormatter: (params: number) =>
      new Intl.NumberFormat("en-IN").format(params),
  },
  {
    field: "insurancePremAchieved",
    headerName: "Insurance Premium Achieved",
    minWidth: 120,
    flex: 1,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    valueFormatter: (params: number) =>
      new Intl.NumberFormat("en-IN").format(params),
  },
];
export const MutualFundList: GridColDef[] = [
  {
    field: "fundName",
    headerName: "Fund Name",
    disableColumnMenu: true,
    flex: 3, // larger space since names are long
    minWidth: 200,
  },
  {
    field: "aumCr",
    headerName: "AUM (Cr)",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 120,
  },
  {
    field: "minSIP",
    headerName: "Min SIP (₹)",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 120,
  },
  {
    field: "minLumpSum",
    headerName: "Min Lump Sum (₹)",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 150,
  },
  {
    field: "returns",
    headerName: "Returns (%)",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 100,
  },
];
export const MutualFundOrder: GridColDef[] = [
  {
    field: "fundName",
    headerName: "Fund Name",
    disableColumnMenu: true,
    flex: 3, // larger space since names are long
    minWidth: 200,
  },
  {
    field: "aumCr",
    headerName: "Status",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 120,
  },
  {
    field: "minSIP",
    headerName: "Order Date",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 120,
  },
  {
    field: "minLumpSum",
    headerName: "Folio Number",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 150,
  },
  {
    field: "returns",
    headerName: "Amount",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 100,
  },
  {
    field: "",
    headerName: "Remarks",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 100,
  },
];

export const MutualFundName: GridColDef[] = [
  {
    field: "fundName",
    headerName: "Fund Name",
    disableColumnMenu: true,
    flex: 3, // larger space since names are long
    minWidth: 200,
  },
];
export const OrderTransaction: GridColDef[] = [
  {
    field: "security",
    headerName: "Fund Name",
    disableColumnMenu: true,
    flex: 3, // larger space since names are long
    minWidth: 200,
  },
  {
    field: "transactionPrice",
    headerName: "Transaction Price",
    disableColumnMenu: true,
    flex: 2, // larger space since names are long
    minWidth: 200,
    headerAlign: "right",
    align: "right",
    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "quantity",
    headerName: "Quantity",
    disableColumnMenu: true,
    flex: 2, // larger space since names are long
    minWidth: 200,
    headerAlign: "right",
    align: "right",
  },
];
export const OrderOngoingSip: GridColDef[] = [
  {
    field: "reedosName",
    headerName: "Fund Name",
    disableColumnMenu: true,
    flex: 3, // larger space since names are long
    minWidth: 200,
  },
  {
    field: "amount",
    headerName: "Amount",
    disableColumnMenu: true,
    flex: 2, // larger space since names are long
    minWidth: 200,
  },
  {
    field: "startDate",
    headerName: "SIP Date",
    disableColumnMenu: true,
    flex: 2, // larger space since names are long
    minWidth: 200,
  },
];
export const OrderUpcomingSip: GridColDef[] = [
  {
    field: "reedosName",
    headerName: "Fund Name",
    disableColumnMenu: true,
    flex: 3, // larger space since names are long
    minWidth: 200,
  },
  {
    field: "amount",
    headerName: "Amount",
    disableColumnMenu: true,
    flex: 2, // larger space since names are long
    minWidth: 200,
  },
  {
    field: "startDate",
    headerName: "Due Date",
    disableColumnMenu: true,
    flex: 2, // larger space since names are long
    minWidth: 200,
  },
];
export const MfPortfolio: GridColDef[] = [
  {
    field: "reedosName",
    headerName: "Fund Name",
    disableColumnMenu: true,
    flex: 3, // larger space since names are long
    minWidth: 200,
  },
  {
    field: "physicalQuantity",
    headerName: "Mode",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 120,
    align: "right",
    headerAlign: "right",
    valueFormatter: (params: any) => {
      if (params > 0) return "Physical";
      else return "Demat";
    },
  },

  {
    field: "folioNumber",
    headerName: "Folio Number",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 120,
    align: "right",
    headerAlign: "right",
  },
  {
    field: "investedAmount",
    headerName: "Invested Amount",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 120,
    align: "right",
    headerAlign: "right",
    renderCell: (params: any) => {
      const value = params.value;
      return value?.toLocaleString("en-IN");
    },
  },

  {
    field: "currentValue",
    headerName: "Current Amount",
    disableColumnMenu: true,
    flex: 1, // larger space since names are long
    minWidth: 120,
    align: "right",
    headerAlign: "right",
    renderCell: (params: any) => {
      const value = params.value;
      return value?.toLocaleString("en-IN");
    },
  },
  {
    field: "xirr",
    headerName: "XIRR Returns",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 60,
    align: "right",
    headerAlign: "right",
  },
  {
    field: "action",
    headerName: "Action",
    disableColumnMenu: true,
    flex: 2,
    minWidth: 150,
    align: "center",
    headerAlign: "center",
  },
];

export const MandateColumns: GridColDef[] = [
  {
    field: "mandateId",
    headerName: "Mandate ID",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 150,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "clientName",
    headerName: "Client Name",
    disableColumnMenu: true,
    flex: 2,
    minWidth: 200,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "clientCode",
    headerName: "Client Code",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 150,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "amount",
    headerName: "Amount",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 120,
    headerAlign: "right",
    align: "center",
    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "status",
    headerName: "Status",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 280,
    headerAlign: "center",
  },
  {
    field: "mandateType",
    headerName: "Mandate Type",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 150,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "collectionType",
    headerName: "Collection Type",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 150,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "bankName",
    headerName: "Bank Name",
    disableColumnMenu: true,
    flex: 2,
    minWidth: 200,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "bankAccNo",
    headerName: "Bank A/C No",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 180,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "bankBranch",
    headerName: "Bank Branch",
    disableColumnMenu: true,
    flex: 2,
    minWidth: 250,
    headerAlign: "center",
  },
  {
    field: "umrnNo",
    headerName: "UMRN No",
    disableColumnMenu: true,
    flex: 2,
    minWidth: 220,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "regnDate",
    headerName: "Regn Date",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 180,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "approvedDate",
    headerName: "Approved Date",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 180,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "uploadDate",
    headerName: "Upload Date",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 180,
    headerAlign: "center",
    align: "center",
  },
];

export const NFOList: GridColDef[] = [
  {
    field: "schemeName",
    headerName: "Fund Name",
    disableColumnMenu: true,
    flex: 4,
    minWidth: 250,
    renderCell: (params) => (
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <img
          src={params.row.amcIcon}
          alt={params.row.amcName}
          style={{ width: "32px", height: "32px", objectFit: "contain" }}
        />
        <div style={{ fontWeight: 500 }}>{params.row.schemeName}</div>
      </div>
    ),
  },
  {
    field: "nfoFaceValue",
    headerName: "NAV",
    disableColumnMenu: true,
    flex: 0.5,
    minWidth: 70,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => (
      <div>₹{Number(params.row.nfoFaceValue).toFixed(2)}</div>
    ),
  },
  {
    field: "launchDate",
    headerName: "Launch Date",
    disableColumnMenu: true,
    flex: 1,
    headerAlign: "center",
    align: "center",
    minWidth: 80,
    valueFormatter: (params: any) => {
      if (!params) return "-";
      return dayjs(params).format("DD-MMM-YY"); // Converts to "27-Feb-24"
    },
  },
  {
    field: "closingDate",
    headerName: "Closing Date",
    disableColumnMenu: true,
    flex: 1,
    headerAlign: "center",
    align: "center",
    minWidth: 80,
    valueFormatter: (params: any) => {
      if (!params) return "-";
      return dayjs(params).format("DD-MMM-YY"); // Converts to "27-Feb-24"
    },
  },
];

export const getRecommendationListColumns = (
  selectedReturnPeriod: string
): GridColDef[] => [
  {
    field: "schemeName",
    headerName: "Fund Name",
    disableColumnMenu: true,
    flex: 3,
    minWidth: 250,
    renderCell: (params) => (
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <img
          src={params.row.amcIcon}
          alt="AMC"
          style={{ width: "32px", height: "32px", objectFit: "contain" }}
        />
        <div style={{ fontWeight: 500 }}>{params.row.schemeName}</div>
      </div>
    ),
  },
  {
    field: "category",
    headerName: "Category",
    flex: 1.5,
    minWidth: 160,
    disableColumnMenu: true,
    renderCell: (params) => (
      <span style={{ fontSize: "13px" }}>
        {params.row.category?.split("|")[1]?.trim() || "-"}
      </span>
    ),
  },
  {
    field: "sipMinimum",
    headerName: "Min. SIP",
    align: "center",
    headerAlign: "center",
    flex: 1,
    minWidth: 100,
    disableColumnMenu: true,
    renderCell: (params) => (
      <span>₹{Number(params.row.sipMinimum || 0).toLocaleString()}</span>
    ),
  },
  {
    field: "aum",
    headerName: "AUM (Cr)",
    align: "center",
    headerAlign: "center",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 100,
    renderCell: (params) => (
      <span>₹{Number(params.row.aum || 0).toLocaleString()}</span>
    ),
  },
  {
    field: "investmentAmount",
    headerName: "Min. Lump",
    align: "center",
    headerAlign: "center",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 120,
    renderCell: (params) => (
      <span>₹{Number(params.row.investmentAmount || 0).toLocaleString()}</span>
    ),
  },
  {
    field: selectedReturnPeriod, // 👈 dynamic field
    headerName: "Returns",
    align: "center",
    headerAlign: "center",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 100,
    renderCell: (params) => {
      const val = parseFloat(params.row[selectedReturnPeriod]);
      const isNegative = val < 0;
      return (
        <span style={{ color: isNegative ? "red" : "green" }}>
          {isNegative ? "-" : ""}
          {Math.abs(val).toFixed(2)}%
        </span>
      );
    },
  },
];

export const MutualFundOrderColumns: GridColDef[] = [
  {
    field: "schemeName",
    headerName: "Fund Name",
    disableColumnMenu: true,
    flex: 2,
    minWidth: 230,
    renderCell: (params) => (
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <img
          src={params.row.logo}
          alt={params.row.logo}
          style={{ width: "32px", height: "32px", objectFit: "contain" }}
        />
        <div style={{ fontWeight: 500 }}>{params.row.schemeName}</div>
      </div>
    ),
  },
  {
    field: "transType",
    headerName: "Transaction Type",
    disableColumnMenu: true,
    flex: 0.7,
    minWidth: 60,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => capitalizeEachWord(params.value),
  },
  {
    field: "successFlag",
    headerName: "Status",
    disableColumnMenu: true,
    flex: 0.7,
    minWidth: 60,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => capitalizeEachWord(params.value),
  },
  {
    field: "startDate",
    headerName: "Order Date",
    disableColumnMenu: true,
    flex: 0.7,
    minWidth: 60,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      const rawDate = params.value;

      if (params.row.transType === "LUMPSUMP") {
        // Fix common formatting issues
        const cleanedDate = rawDate
          ?.replace(/\s+/g, " ") // normalize spaces
          .replace(/(\d)(AM|PM)$/i, "$1 $2") // add space before AM/PM if missing
          .trim();

        return dayjs(cleanedDate, "MMM D YYYY h:mma").isValid()
          ? dayjs(cleanedDate, "MMM D YYYY h:mma").format("DD-MMM-YYYY")
          : "Invalid Date";
      } else if (params.row.transType === "XSIP") {
        const parsed = dayjs(rawDate, "DD/MM/YYYY", true); // strict parsing
        const formattedDate = parsed.isValid()
          ? parsed.format("DD-MMM-YYYY")
          : "Invalid Date";

        return formattedDate;
      }
    },
  },
  // {
  //   field: "clientCode",
  //   headerName: "Folio Number",
  //   disableColumnMenu: true,
  //   flex: 1,
  //   minWidth: 150,
  // },
  {
    field: "amount",
    headerName: "Amount",
    disableColumnMenu: true,
    flex: 0.7,
    minWidth: 80,

    headerAlign: "center",
    align: "center",
  },
  {
    field: "remarks",
    headerName: "Remarks",
    disableColumnMenu: true,
    flex: 2,
    minWidth: 210,
    headerAlign: "center",
    align: "left",
    renderCell: (params) => capitalizeEachWord(params.value),
  },
  // {
  //   field: "memberCode",
  //   headerName: "Member Code",
  //   disableColumnMenu: true,
  //   flex: 1,
  //   minWidth: 150,
  //   headerAlign: "center",
  //   align: "center",
  // },
];

export const dpDebitMandateColumns: GridColDef[] = [
  {
    field: "RequestDate",
    headerName: "Request Date",
    flex: 1,
    minWidth: 150,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "umn",
    headerName: "UMN",
    flex: 1.5,
    minWidth: 320,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
  },
  {
    field: "mandateType",
    headerName: "Mandate Type",
    flex: 1,
    minWidth: 120,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "amount",
    headerName: "Amount",

    flex: 0.8,
    minWidth: 100,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "right",
    // valueFormatter: (params: any) =>
    //   params.value ? `₹ ${Number(params.value).toLocaleString("en-IN")}` : "",
  },
  {
    field: "frequency",
    headerName: "Frequency",
    flex: 1,
    minWidth: 120,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "upi",
    headerName: "UPI ID",
    flex: 1.5,
    minWidth: 200,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
  },
  {
    field: "mandateStatus",
    headerName: "Mandate Status",
    flex: 1.2,
    minWidth: 150,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "statusDesc",
    headerName: "Status Description",
    flex: 2,
    minWidth: 250,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
  },
  {
    field: "Action",
    headerName: "Action",
    flex: 2,
    minWidth: 150,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
];

export const ClientMandateReport: GridColDef[] = [
  {
    field: "clientCode",
    headerName: "Client Code",
    minWidth: 130,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "clientName",
    headerName: "Client Name",
    minWidth: 200,
    headerAlign: "center",
    disableColumnMenu: true,
    flex: 1,
  },
  {
    field: "branchcode",
    headerName: "Branch Code",
    minWidth: 120,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "zone",
    headerName: "Zone",
    minWidth: 100,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "boid",
    headerName: "BOID",
    minWidth: 200,
    headerAlign: "center",
    disableColumnMenu: true,
    flex: 1,
  },
  {
    field: "dpDebit",
    headerName: "DP Debit",
    minWidth: 120,
    headerAlign: "center",
    align: "right",
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
    field: "mandateAmount",
    headerName: "Mandate Amount",
    minWidth: 140,
    headerAlign: "center",
    align: "right",
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
    field: "umn",
    headerName: "UMN",
    minWidth: 250,
    headerAlign: "center",
    disableColumnMenu: true,
    flex: 1,
  },
  {
    field: "referenceNumber",
    headerName: "Reference No.",
    minWidth: 150,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "nextRecurDate",
    headerName: "Next Recur Date",
    minWidth: 150,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    // Optional: format DD/MM/YYYY
    // valueFormatter: (params) => {
    //   const v = params.value?.toString();
    //   if (v?.length === 8) {
    //     return `${v.substring(0, 2)}/${v.substring(2, 4)}/${v.substring(4)}`;
    //   }
    //   return v || "N/A";
    // },
  },
];

export const AmcLifeMembership: GridColDef[] = [
  {
    field: "trading_Code",
    headerName: "Client Code",
    flex: 1,
    minWidth: 100,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
  },
  {
    field: "dP_ID",
    headerName: "BOID",
    flex: 1,
    minWidth: 150,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
  },
  {
    field: "primary_Holder",
    headerName: "Primary Holder Name",
    flex: 1,
    minWidth: 180,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
  },
  {
    field: "primaryHolder_phn",
    headerName: "Mobile No.",
    flex: 1,
    minWidth: 120,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    headerClassName: "header-wrap-custom",
    renderCell: (params: any) => {
      const mobile = params.value || ""; // Extract the mobile number

      // Mask all digits except the first 2 and the last 2
      const maskedMobile = mobile.replace(
        /^(\d{2})(\d+)(\d{2})$/,
        (_: any, prefix: any, middle: any, suffix: any) => {
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
  {
    field: "status",
    headerName: "Status",
    flex: 1,
    minWidth: 120,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    headerClassName: "header-wrap-custom",
  },
  {
    field: "branchType",
    headerName: "Branch Type",
    flex: 1,
    minWidth: 130,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    headerClassName: "header-wrap-custom",
  },
  {
    field: "bsdA_Flag",
    headerName: "BSDA",
    flex: 1,
    minWidth: 130,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    headerClassName: "header-wrap-custom",
    renderCell: (params) => (params.value ? params.value : "—"),
  },

  {
    field: "dealerName",
    headerName: "Dealer Name",
    flex: 1,
    minWidth: 160,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
    headerClassName: "header-wrap-custom",
    valueGetter: (params: any) => {
      return params || "-";
    },
  },

  {
    field: "rmname",
    headerName: "RM Name",
    flex: 1,
    minWidth: 150,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
    headerClassName: "header-wrap-custom",
  },

  {
    field: "secondary_Holder_Name",
    headerName: "Second Holder Name",
    flex: 1,
    minWidth: 180,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
    headerClassName: "header-wrap-custom",
    valueGetter: (params: any) => {
      return params || "-";
    },
  },
  {
    field: "third_Holder_Name",
    headerName: "Third Holder Name",
    flex: 1,
    minWidth: 180,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
    headerClassName: "header-wrap-custom",
    valueGetter: (params: any) => {
      return params || "-";
    },
  },
  {
    field: "branch_code",
    headerName: "Branch Code",
    flex: 1,
    minWidth: 100,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "zone",
    headerName: "Zone",
    flex: 1,
    minWidth: 70,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "module_Description",
    headerName: "Scheme Name",
    flex: 1,
    minWidth: 180,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    headerClassName: "header-wrap-custom",
  },
  // {
  //   field: "module_Modified_date",
  //   headerName: "Module Modified Date",
  //   flex: 1,
  //   minWidth: 150,
  //   disableColumnMenu: true,
  //   headerAlign: "center",
  //   align: "center",
  //   headerClassName: "header-wrap-custom",
  //   valueGetter: (params: any) => {
  //     const rawDate = params;
  //     if (!rawDate) return null; // Handle missing data

  //     const parsedDate = new Date(
  //       rawDate.replace(
  //         /(\d{2})-([A-Za-z]{3})-(\d{2})/,
  //         (match: any, day: any, month: any, year: any) => {
  //           const monthMap: any = {
  //             Jan: "01",
  //             Feb: "02",
  //             Mar: "03",
  //             Apr: "04",
  //             May: "05",
  //             Jun: "06",
  //             Jul: "07",
  //             Aug: "08",
  //             Sep: "09",
  //             Oct: "10",
  //             Nov: "11",
  //             Dec: "12",
  //           };
  //           console.log(match);
  //           return `20${year}-${monthMap[month]}-${day}`;
  //         }
  //       )
  //     );

  //     return parsedDate;
  //   },
  //   sortComparator: (v1: any, v2: any) => {
  //     if (!v1 || !v2) return 0; // Handle missing values
  //     return v1 - v2; // Sort in ascending order
  //   },
  //   valueFormatter: (params: any) => {
  //     if (!params) return "";
  //     return dayjs(params).format("DD-MMM-YY"); // Converts to "03-Apr-24"
  //   },
  // },
];
export const AmcNonLifeMembership: GridColDef[] = [
  {
    field: "schemeStatus",
    headerName: "Activate",
    flex: 1,
    minWidth: 100,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "AMC_Link",
    headerName: "AMC Link",
    headerClassName: "header-wrap-custom",
    minWidth: 75,
    flex: 0.3,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
    renderCell: (params: any) => {
      const { dP_ID } = params.row;
      // if (!Payment_link || !EnCAccountCode)
      //   return (
      //     <Tooltip title={"No Link Available"} arrow placement="top">
      //       <span>No Link Available</span>
      //     </Tooltip>
      //   );
      if (params?.row?.schemeStatus === "Submitted") return <span>—</span>;

      const fullLink = `${dP_ID}`;
      console.log(
        params?.row?.schemeStatus,
        "Payment_link,  <CopyToClipboardCellEnCAccountCode",
        fullLink
      );
      return (
        <CopyToClipboardCell
          fullLink={fullLink}
          field={"AMC"}
          selectedRow={params?.row}
        />
      );
    },
  },
  ...AmcLifeMembership,
];

export const AmcContest: GridColDef[] = [
  {
    field: "trading_Code",
    headerName: "Client Code",
    flex: 1,
    minWidth: 100,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "dp_Id",
    headerName: "BOID",
    flex: 1,
    minWidth: 160,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "primary_Holder",
    headerName: "Primary Holder Name",
    flex: 1,
    minWidth: 180,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
    headerClassName: "header-wrap-custom",
  },
  {
    field: "primaryHolder_phn",
    headerName: "Mobile No.",
    flex: 1,
    minWidth: 120,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    headerClassName: "header-wrap-custom",
    renderCell: (params: any) => {
      const mobile = params.value || "";
      const maskedMobile = mobile.replace(
        /^(\d{2})(\d+)(\d{2})$/,
        (_: any, prefix: any, middle: any, suffix: any) => {
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
  {
    field: "status",
    headerName: "Status",
    flex: 1,
    minWidth: 120,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    headerClassName: "header-wrap-custom",
  },
  {
    field: "branchType",
    headerName: "Branch Type",
    flex: 1,
    minWidth: 130,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    headerClassName: "header-wrap-custom",
  },

  {
    field: "dealerName",
    headerName: "Dealer Name",
    flex: 1,
    minWidth: 160,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
    headerClassName: "header-wrap-custom",
    valueGetter: (params: any) => {
      return params || "-";
    },
  },

  {
    field: "rmname",
    headerName: "RM Name",
    flex: 1,
    minWidth: 150,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
    headerClassName: "header-wrap-custom",
  },

  {
    field: "secondary_Holder_Name",
    headerName: "Secondary Holder Name",
    flex: 1,
    minWidth: 180,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
    headerClassName: "header-wrap-custom",
  },
  {
    field: "third_Holder_Name",
    headerName: "Third Holder Name",
    flex: 1,
    minWidth: 160,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
    headerClassName: "header-wrap-custom",
  },
  {
    field: "branch_code",
    headerName: "Branch Code",
    flex: 1,
    minWidth: 80,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    headerClassName: "header-wrap-custom",
  },
  {
    field: "zone",
    headerName: "Zone",
    flex: 1,
    minWidth: 80,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  // {
  //   field: "bal_Amount",
  //   headerName: "Balance Amount",
  //   flex: 1,
  //   minWidth: 120,
  //   disableColumnMenu: true,
  //   headerAlign: "center",
  //   align: "right",
  //   headerClassName: "header-wrap-custom",
  //   valueFormatter: (params: any) => {
  //     const value = parseFloat(params); // Convert the value to a number
  //     return new Intl.NumberFormat("en-IN", {
  //       minimumFractionDigits: 2,
  //       maximumFractionDigits: 2,
  //     }).format(value);
  //   },
  // },

  // {
  //   field: "module_No",
  //   headerName: "Module No",
  //   flex: 1,
  //   minWidth: 80,
  //   disableColumnMenu: true,
  //   headerAlign: "center",
  //   headerClassName: "header-wrap-custom",
  //   align: "center",
  // },
  // {
  //   field: "module_Description",
  //   headerName: "Scheme",
  //   flex: 1,
  //   minWidth: 160,
  //   disableColumnMenu: true,
  //   headerAlign: "center",
  //   align: "center",
  //   headerClassName: "header-wrap-custom",
  // },
  {
    field: "module_Narr",
    headerName: "Scheme Name",
    flex: 1,
    minWidth: 150,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "schemeStatus",
    headerName: "Scheme Status ",
    flex: 1,
    minWidth: 150,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    headerClassName: "header-wrap-custom",
  },
];

export const AmcLedgerReport: GridColDef[] = [
  {
    field: "tradingCode",
    headerName: "Trading Code",
    flex: 1,
    minWidth: 120,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "boid",
    headerName: "BO ID",
    flex: 1,
    minWidth: 120,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "clientName",
    headerName: "Client Name",
    flex: 1.5,
    minWidth: 180,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "left",
  },
  {
    field: "paymentAmount",
    headerName: "Payment Amount (₹)",
    type: "number",
    align: "center",
    headerAlign: "center",
    flex: 1,
    minWidth: 150,
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
    field: "createdDate",
    headerName: "Created Date",
    flex: 1.2,
    minWidth: 160,
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
    sortComparator: (v1: any, v2: any) => {
      if (!v1 || !v2) return 0; // Handle missing values
      return v1 - v2; // Sort in ascending order
    },
    valueFormatter: (params: any) => {
      if (!params) return "";
      return dayjs(params).format("DD-MMM-YY"); // Converts to "03-Apr-24"
    },
  },
];

export const clientMISColumns: GridColDef[] = [
  {
    field: "zoneCode",
    headerName: "Zone Code",
    headerClassName: "header-wrap-custom",
    minWidth: 70,
    flex: 0.6,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "clientCode",
    headerName: "Client Code",
    headerClassName: "header-wrap-custom",
    minWidth: 90,
    flex: 0.6,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "raCode",
    headerName: "RA Code",
    minWidth: 85,
    flex: 0.5,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "clientName",
    headerName: "Client Name",
    minWidth: 220,
    flex: 1,
    align: "left",
    headerAlign: "center",
  },
  {
    field: "partnerName",
    headerName: "Partner Name",
    minWidth: 220,
    flex: 1,
    align: "left",
    headerAlign: "center",
  },
  {
    field: "partnerCode",
    headerName: "Partner Code",
    headerClassName: "header-wrap-custom",
    minWidth: 70,
    flex: 0.6,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "totalSPIPIRevenue",
    headerName: "Total SPIP Revenue",
    headerClassName: "header-wrap-custom",
    minWidth: 100,
    flex: 1,
    align: "right",
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
    field: "partnerShare",
    headerName: "Partner Share",
    headerClassName: "header-wrap-custom",
    minWidth: 80,
    flex: 0.8,
    align: "right",
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
    field: "lkpShare",
    headerName: "LKP Share",
    headerClassName: "header-wrap-custom",
    minWidth: 90,
    flex: 0.8,
    align: "right",
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
    field: "totalBrokRevenue",
    headerName: "Total Brokerage Revenue",
    headerClassName: "header-wrap-custom",
    minWidth: 100,
    flex: 1.2,
    align: "right",
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
    field: "partnerbrokShare",
    headerName: "Partner Brok. Share",
    headerClassName: "header-wrap-custom",
    minWidth: 80,
    flex: 1,
    align: "right",
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
    field: "lkpbroshare",
    headerName: "LKP Brok. Share",
    headerClassName: "header-wrap-custom",
    minWidth: 80,
    flex: 1,
    align: "right",
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
    field: "email",
    headerName: "Email ID",
    minWidth: 200,
    flex: 1.2,
    align: "left",
    headerAlign: "center",
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
    field: "cmobileno",
    headerName: "Mobile No",
    minWidth: 140,
    flex: 0.8,
    align: "center",
    headerAlign: "center",
    renderCell: (params: any) => {
      const mobile = params.value || "";
      const maskedMobile = mobile.replace(
        /^(\d{2})(\d+)(\d{2})$/,
        (_: any, prefix: any, middle: any, suffix: any) => {
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
  {
    field: "rmName",
    headerName: "RM Name",
    minWidth: 160,
    flex: 1,
    align: "left",
    headerAlign: "center",
  },
];

export const shortfallColumns: GridColDef[] = [
  {
    field: "clientCode",
    headerName: "Client Code",
    headerClassName: "header-wrap-custom",
    flex: 1,
    minWidth: 80,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "clientName",
    headerName: "Client Name",
    flex: 1.5,
    minWidth: 250,
    align: "left",
    headerAlign: "center",
  },
  {
    field: "mtfCashCollateralA",
    headerName: "MTF Cash Collateral (A)",
    headerClassName: "header-wrap-custom",
    flex: 1,
    minWidth: 100,
    align: "right",
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
    field: "mtfShareCollateralB",
    headerName: "MTF Share Collateral (B)",
    headerClassName: "header-wrap-custom",
    flex: 1,
    minWidth: 100,
    align: "right",
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
    field: "netMarginReqC",
    headerName: "Net Margin Req (C)",
    flex: 1,
    align: "right",
    headerAlign: "center",
    minWidth: 110,
    headerClassName: "header-wrap-custom",
    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "mtmLossD",
    headerName: "MTM Loss (D)",
    flex: 1,
    align: "right",
    headerAlign: "center",
    minWidth: 100,
    headerClassName: "header-wrap-custom",
    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "marginShortExcess",
    headerName: "Margin Short/Excess",
    flex: 1,
    align: "right",
    headerAlign: "center",
    minWidth: 95,
    headerClassName: "header-wrap-custom",
    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "totalFundedAmountE",
    headerName: "Total Funded Amt (E)",
    flex: 1,
    align: "right",
    headerAlign: "center",
    minWidth: 110,
    headerClassName: "header-wrap-custom",
    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "grp1LedgerF",
    headerName: "Grp1 Ledger (F)",
    flex: 1,
    align: "right",
    headerAlign: "center",
    minWidth: 110,
    headerClassName: "header-wrap-custom",
    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "mtfShareMarketValue",
    headerName: "MTF Share Market Value",
    flex: 1.2,
    align: "right",
    headerAlign: "center",
    minWidth: 110,
    headerClassName: "header-wrap-custom",
    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "maxAmountLimit",
    headerName: "Max Amount Limit",
    flex: 1,
    align: "right",
    headerAlign: "center",
    minWidth: 120,
    headerClassName: "header-wrap-custom",
    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "maxScripAmount",
    headerName: "Max Scrip Amount",
    flex: 1,
    align: "right",
    headerAlign: "center",
    minWidth: 80,
    headerClassName: "header-wrap-custom",
    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    field: "interestPercent",
    headerName: "Interest %",
    flex: 0.8,
    align: "center",
    headerAlign: "center",
    minWidth: 80,
    headerClassName: "header-wrap-custom",
    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
  },
];

export const ageingColumns: GridColDef[] = [
  {
    field: "zone",
    headerName: "Zone",
    headerClassName: "header-wrap-custom",
    flex: 0.6,
    minWidth: 60,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "branchcode",
    headerName: "Branch Code",
    headerClassName: "header-wrap-custom",
    flex: 0.8,
    minWidth: 60,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "branchType",
    headerName: "Branch Type",
    headerClassName: "header-wrap-custom",
    flex: 0.8,
    minWidth: 80,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "clientcode",
    headerName: "Client Code",
    headerClassName: "header-wrap-custom",
    flex: 0.8,
    minWidth: 90,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "clientname",
    headerName: "Client Name",
    flex: 1.4,
    minWidth: 220,
    align: "left",
    headerAlign: "center",
  },
  {
    field: "rmCode",
    headerName: "RM Code",
    flex: 0.6,
    minWidth: 60,
    headerClassName: "header-wrap-custom",
    align: "center",
    headerAlign: "center",
  },
  {
    field: "rmName",
    headerName: "RM Name",
    flex: 1.2,
    minWidth: 240,
    align: "left",
    headerAlign: "center",
  },
  {
    field: "dealerCode",
    headerName: "Dealer Code",
    headerClassName: "header-wrap-custom",
    flex: 0.8,
    minWidth: 60,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "dealerName",
    headerName: "Dealer Name",
    flex: 1.2,
    minWidth: 200,
    align: "left",
    headerAlign: "center",
  },
  {
    field: "nseScrip",
    headerName: "NSE Scrip",
    flex: 0.8,
    minWidth: 120,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "bseScrip",
    headerName: "BSE Scrip",
    flex: 0.8,
    minWidth: 120,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "isin",
    headerName: "ISIN",
    flex: 1.2,
    minWidth: 180,
    align: "left",
    headerAlign: "center",
  },
  {
    field: "fundingAmount",
    headerName: "Funding Amount",
    flex: 1,
    minWidth: 140,
    align: "right",
    headerAlign: "center",
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return isNaN(value)
        ? "-"
        : new Intl.NumberFormat("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(value);
    },
  },
  {
    field: "marketRate",
    headerName: "Market Rate",
    flex: 1,
    minWidth: 120,
    align: "right",
    headerAlign: "center",
    valueFormatter: (params: any) => {
      const value = parseFloat(params);
      return isNaN(value)
        ? "-"
        : new Intl.NumberFormat("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(value);
    },
  },
  {
    field: "varPerc",
    headerName: "VAR %",
    flex: 0.6,
    minWidth: 90,
    align: "right",
    headerAlign: "center",
    valueFormatter: (params: any) => `${parseFloat(params).toFixed(2)}%`,
  },
  {
    field: "elmPerc",
    headerName: "ELM %",
    flex: 0.6,
    minWidth: 90,
    align: "right",
    headerAlign: "center",
    valueFormatter: (params: any) => `${parseFloat(params).toFixed(2)}%`,
  },
  {
    field: "marginPerc",
    headerName: "Margin %",
    flex: 0.6,
    minWidth: 90,
    align: "right",
    headerAlign: "center",
    valueFormatter: (params: any) => `${parseFloat(params).toFixed(2)}%`,
  },
  {
    field: "tradeDATE",
    headerName: "Trade Date",
    flex: 0.8,
    minWidth: 130,
    align: "center",
    headerAlign: "center",
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
    field: "days",
    headerName: "Days",
    flex: 0.5,
    minWidth: 80,
    align: "right",
    headerAlign: "center",
  },
];

export const vendorApprovalColumns: GridColDef[] = [
  {
    field: "vendorName",
    headerName: "Vendor Name",
    headerClassName: "header-wrap-custom",
    flex: 1.5,
    minWidth: 200,
    align: "left",
    headerAlign: "center",
  },
  {
    field: "city",
    headerName: "City",
    headerClassName: "header-wrap-custom",
    flex: 1,
    minWidth: 120,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "state",
    headerName: "State",
    headerClassName: "header-wrap-custom",
    flex: 1,
    minWidth: 120,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "mobileNo",
    headerName: "Mobile No",
    headerClassName: "header-wrap-custom",
    flex: 1,
    minWidth: 120,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "emailID",
    headerName: "Email ID",
    headerClassName: "header-wrap-custom",
    flex: 1.5,
    minWidth: 200,
    align: "left",
    headerAlign: "center",
  },
  {
    field: "bankName",
    headerName: "Bank Name",
    headerClassName: "header-wrap-custom",
    flex: 1.2,
    minWidth: 200,
    align: "left",
    headerAlign: "center",
  },
  {
    field: "bankActNo",
    headerName: "A/C No",
    headerClassName: "header-wrap-custom",
    flex: 1,
    minWidth: 150,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "ifscCode",
    headerName: "IFSC Code",
    headerClassName: "header-wrap-custom",
    flex: 1,
    minWidth: 120,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "tdsFlag",
    headerName: "TDS Flag",
    headerClassName: "header-wrap-custom",
    flex: 0.8,
    minWidth: 100,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => (params.value ? "Yes" : "No"),
  },
  {
    field: "msmeFlag",
    headerName: "MSME Flag",
    headerClassName: "header-wrap-custom",
    flex: 0.8,
    minWidth: 100,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => (params.value ? "Yes" : "No"),
  },
  {
    field: "accApproval",
    headerName: "Approval Status",
    headerClassName: "header-wrap-custom",
    flex: 1,
    minWidth: 120,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "accRemark",
    headerName: "Account Remark",
    headerClassName: "header-wrap-custom",
    flex: 1.5,
    minWidth: 200,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "createdDate",
    headerName: "Created Date",
    headerClassName: "header-wrap-custom",
    flex: 1,
    minWidth: 150,
    align: "center",
    headerAlign: "center",
  },
];

export const t6SellingReportColumns: GridColDef[] = [
  {
    field: "zone",
    headerName: "Zone",
    headerClassName: "header-wrap-custom",
    // flex: 0.8,
    minWidth: 60,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => (params.value ? params.value : "—"),
  },
  {
    field: "branchCode",
    headerName: "Branch Code",
    headerClassName: "header-wrap-custom",
    // flex: 1,
    minWidth: 70,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => (params.value ? params.value : "—"),
  },
  {
    field: "branchType",
    headerName: "Branch Type",
    // flex: 1,
    align: "center",
    headerAlign: "center",
    minWidth: 70,
    headerClassName: "header-wrap-custom",
    renderCell: (params) => (params.value ? params.value : "—"),
  },
  {
    field: "clientCode",
    headerName: "Client Code",
    // flex: 1,
    align: "center",
    headerAlign: "center",
    minWidth: 100,
    headerClassName: "header-wrap-custom",
    renderCell: (params) => (params.value ? params.value : "—"),
  },
  {
    field: "clientName",
    headerName: "Client Name",
    flex: 1.5,
    align: "left",
    headerAlign: "center",
    minWidth: 200,
    headerClassName: "header-wrap-custom",
    renderCell: (params) => (params.value ? params.value : "—"),
  },
  {
    field: "exchange",
    headerName: "Exchange",
    headerClassName: "header-wrap-custom",
    flex: 0.8,
    minWidth: 75,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => (params.value ? params.value : "—"),
  },

  {
    field: "symbolSeries",
    headerName: "Symbol / Series",
    width: 160,
    align: "left",
    headerAlign: "center",
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
    renderCell: (params: any) => {
      const symbol = (params.row?.symbol || "").trim();
      const series = (params.row?.series || "").trim();
      return `${symbol} / ${series}`;
    },
  },
  {
    field: "rate",
    headerName: "Rate",
    // flex: 1,
    align: "right",
    headerAlign: "center",
    minWidth: 70,
    headerClassName: "header-wrap-custom",
    renderCell: (params) => {
      const value = params.value;

      // Handle empty/null/undefined
      if (value === null || value === undefined || value === "") {
        return "—";
      }

      // Format the number with Indian locale and 2 decimal places
      const formattedValue = new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(Number(value));

      return formattedValue;
    },
  },
  {
    field: "qty",
    headerName: "Quantity",
    // flex: 1,
    align: "right",
    headerAlign: "center",
    minWidth: 70,
    headerClassName: "header-wrap-custom",
    renderCell: (params) => {
      const value = params.value;

      // Handle empty/null/undefined
      if (value === null || value === undefined || value === "") {
        return "—";
      }

      // Format the number with Indian locale and 2 decimal places
      const formattedValue = new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(Number(value));

      return formattedValue;
    },
  },

  {
    field: "rMcode",
    headerName: "RM Name & Code",
    flex: 1.5,
    align: "left",
    headerAlign: "center",
    minWidth: 180,
    headerClassName: "header-wrap-custom",
    renderCell: (params: any) => {
      const rmName = (params.row?.rmName || "").trim();
      const rmCode = (params.row?.rMcode || "").trim();

      if (!rmName && !rmCode) return "—";
      if (!rmName) return rmCode;
      if (!rmCode) return rmName;

      return `${rmName} - (${rmCode})`;
    },
  },
  {
    field: "dealercode",
    headerName: "Dealer Name & Code",
    flex: 1,
    align: "center",
    headerAlign: "center",
    minWidth: 150,
    headerClassName: "header-wrap-custom",
    renderCell: (params: any) => {
      const dealerName = (params.row?.dealerName || "").trim();
      const dealercode = (params.row?.dealercode || "").trim();

      if (!dealerName && !dealercode) return "—";
      if (!dealerName) return dealercode;
      if (!dealerName) return dealerName;

      return `${dealerName} - (${dealercode})`;
    },
  },
];

export const regMasterColumns: GridColDef[] = [
  {
    field: "exchange",
    headerName: "Exchange",
    flex: 1,
    minWidth: 120,
    align: "center",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    renderCell: (params) => params.value || "—",
  },
  {
    field: "scripcode",
    headerName: "Scrip Code",
    flex: 1,
    minWidth: 120,
    align: "center",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    renderCell: (params) => params.value || "—",
  },
  {
    field: "symbol",
    headerName: "Symbol",
    flex: 1.2,
    minWidth: 160,
    align: "left",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    renderCell: (params) => params.value || "—",
  },
  {
    field: "gsm",
    headerName: "GSM",
    flex: 1,
    minWidth: 100,
    align: "right",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    renderCell: (params) => params.value || "—",
  },
  {
    field: "irp",
    headerName: "IRP",
    flex: 1,
    minWidth: 100,
    align: "right",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    renderCell: (params) => params.value || "—",
  },
];
