import { GridColDef } from "@mui/x-data-grid";
import Tooltip from "@mui/material/Tooltip";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import React from "react";

// import { useMemo, useState } from "react";

export const ClientCashColumns: GridColDef[] = [
  {
    field: "ClientCode",
    headerName: "Client Code",
    flex: 1.5, // Use flex for responsive column width
    minWidth: 120, // Ensure minimum width for proper readability
    headerAlign: "left",
    align: "left",
    // sortable: false,
    disableColumnMenu: true,
  },
  {
    field: "ClientName",
    headerName: "Client Name",
    flex: 4, // Allocate more space for the client name
    minWidth: 200,
    disableColumnMenu: true,
  },
  {
    field: "LastTradeDate",
    headerName: "Last Trade Date",
    flex: 1,
    minWidth: 115,
    // sortable: false,
    disableColumnMenu: true,
    align: "center",
  },
  {
    field: "Cash",
    headerName: "Ledger Balance",
    flex: 1.2,
    minWidth: 120,
    align: "right",
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

    // sortable: false,
    disableColumnMenu: true,
  },

  {
    field: "MobileNo",
    headerName: "Mobile No",
    flex: 1,
    minWidth: 120,
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
    // sortable: false,
    disableColumnMenu: true,
    align: "center",
  },
  {
    field: "Brokerage_for_currentmonth",
    headerName: "Current Month Brokerage",
    flex: 1.2,
    minWidth: 120,
    align: "right",
    headerAlign: "center",
    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
    // sortable: false,
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
  },
  {
    field: "Brokerage_for_1month",
    align: "right",
    headerAlign: "center",
    headerName: "Last Month Brokerage",
    flex: 1.2,
    minWidth: 120,
    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
    // sortable: false,
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
  },
  {
    field: "Brokerage_for_3months",
    headerName: "3 Month Brokerage",
    align: "right",
    headerAlign: "center",
    flex: 1.2,
    minWidth: 120,
    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
    // sortable: false,
    disableColumnMenu: true,
    headerClassName: "header-wrap-custom",
  },
];
export const T6Columns: GridColDef[] = [
  {
    field: "ClientCode",
    headerName: "Client Code",
    flex: 1,
    minWidth: 105,
    headerAlign: "center",
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
    headerAlign: "center",
    disableColumnMenu: true,
    valueFormatter: (params: number) =>
      new Intl.NumberFormat("en-IN").format(params),
  },
  {
    field: "StockValue",
    headerName: "Stock Value",
    flex: 1,
    minWidth: 100,
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
    minWidth: 95,
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
    flex: 0.9,
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
    flex: 0.9,
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
    flex: 0.9,
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
    flex: 0.9,
    minWidth: 110,
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
    flex: 2,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
    // renderCell: (params) => (
    //   <div style={{ textAlign: "left", lineHeight: "1.2" }}>
    //     <div>{params.row.ClientName}</div>
    //     <div>{params.row.ClientCode}</div>
    //   </div>
    // ),
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
    field: "T5",
    headerName: "T5",
    flex: 1,
    align: "right",
    headerAlign: "center",
    disableColumnMenu: true,
    valueFormatter: (params: number) =>
      new Intl.NumberFormat("en-IN").format(params),
  },
];

export const DPDebitRecovery: GridColDef[] = [
  {
    field: "Email_link",
    headerName: "Send Email",
    headerClassName: "header-wrap-custom",
    width: 75,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: "payment_link",
    headerName: "Payment\nLink",
    headerClassName: "header-wrap-custom",
    width: 105,
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
    width: 85,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
  },
  {
    field: "BOID",
    headerName: "BOID",
    width: 140,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
  },
  {
    field: "BOName",
    headerName: "Client Name",
    width: 200,
    disableColumnMenu: true,
  },
  {
    field: "Ledger_DebitAmt",
    headerName: "Ledger Debit",
    headerClassName: "header-wrap-custom",
    width: 95,
    align: "right",
    headerAlign: "center",
    disableColumnMenu: true,

    // used to show .00 (fraction values)
    valueFormatter: (params: any) => {
      const value = parseFloat(params); // Convert the value to a number
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
    field: "Client_Mobile_No",
    headerName: "Mobile No",
    headerAlign: "center",
    flex: 1,
    minWidth: 120,
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
    // sortable: false,
    disableColumnMenu: true,
    align: "center",
  },
  {
    field: "Client_Mail_ID",
    headerName: "Email ID",
    minWidth: 190,
    flex: 1,
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
    width: 110,
    align: "center",
    disableColumnMenu: true,
    headerAlign: "center",
  },
  {
    field: "AcStatus",
    headerName: "Category",
    width: 110,
    align: "center",
    disableColumnMenu: true,
    headerAlign: "center",
  },
  {
    field: "Last_Trade_date",
    headerName: "Last Trade Date",
    headerClassName: "header-wrap-custom",
    width: 110,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
  },
];

export const DormantOverViewColumns: GridColDef[] = [
  {
    field: "ctermcode",
    headerName: "Client Code",
    flex: 3,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "clientName",
    headerName: "Client Name",
    flex: 3,
    headerAlign: "center",
    align: "left",
    disableColumnMenu: true,
  },
  {
    field: "dayCount",
    headerName: "Days to Dormant",
    flex: 1, // Smaller relative to "Client"
    // minWidth: 80, // Minimum width to avoid being too narrow
    align: "right",
    headerAlign: "center",
    headerClassName: "header-wrap",
    disableColumnMenu: true,
  },
  {
    field: "lastTradeDate",
    headerName: "Last Trade Date",
    flex: 1,
    // minWidth: 150,
    headerAlign: "center",
    disableColumnMenu: true,
    align: "center", // Optional: Align data as needed
  },
];

export const QPayoutColumns: GridColDef[] = [
  {
    field: "accountcode",
    headerName: "Client Code",
    minWidth: 100,
    disableColumnMenu: true,
  },
  {
    field: "clientName",
    headerName: "Client Name",
    minWidth: 100,
    flex: 2,
    disableColumnMenu: true,
  },
  { field: "rm", headerName: "RM", minWidth: 140, disableColumnMenu: true },
  {
    field: "branchcode",
    headerName: "Branch Code",
    minWidth: 100,
    flex: 1,
    disableColumnMenu: true,
  },
  {
    field: "zone",
    headerName: "Zone",
    minWidth: 100,
    disableColumnMenu: true,
  },
  {
    field: "payout_Amt",
    headerName: "Payout Amt",
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
    field: "receipt_Amt",
    headerName: "Receipt Amt",
    minWidth: 100,
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
    minWidth: 100,
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

export const dormantColumns: GridColDef[] = [
  {
    field: "ctermcode",
    headerName: "Client Code",
    flex: 2,
    minWidth: 100,
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
    headerClassName: "header-wrap-custom",
    flex: 2,
    minWidth: 90,
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "active",
    headerName: "Active",
    width: 70,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
  },
  {
    field: "rmname",
    headerName: "RM Name",
    minWidth: 140,
    disableColumnMenu: true,
  },
  {
    field: "rmstatus",
    headerName: "RM Status",
    width: 100,
    headerClassName: "header-wrap-custom",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "dealerName",
    headerName: "Dealer Name",
    minWidth: 180,
    disableColumnMenu: true,
  },
  {
    field: "dealerSTATUS",
    headerName: "Dealer Status",
    width: 100,
    headerClassName: "header-wrap-custom",
    align: "center",
    disableColumnMenu: true,
  },
  {
    field: "branchcode",
    headerName: "BR Code",
    minWidth: 70,
    align: "right",
    headerAlign: "center",
    disableColumnMenu: true,
  },
  {
    field: "zone",
    headerName: "Zone",
    minWidth: 60,
    align: "right",
    headerAlign: "center",
    disableColumnMenu: true,
  },
  {
    field: "branchtype",
    headerName: "Branch Type",
    width: 100,
    headerClassName: "header-wrap-custom",
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
  },
  {
    field: "activationDate",
    headerName: "Activation Date",
    width: 115,
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "mobileNo",
    headerName: "Mobile No",
    minWidth: 90,
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
    minWidth: 210,
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
  // {
  //   field: "brokerageGeneratedinFY1920",
  //   headerName: "Brok FY1920",
  //   width: 100,
  //   align: "right",
  //   headerAlign: "center",
  //   headerClassName: "header-wrap-custom",
  //   disableColumnMenu: true,
  // },
  {
    field: "brokerageGeneratedinFY2021",
    headerName: "Brok FY2021",
    width: 100,
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
    width: 100,
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
    width: 100,
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
    width: 100,
    align: "right",
    headerAlign: "center",
    headerClassName: "header-wrap-custom",
    disableColumnMenu: true,
    valueFormatter: (params: number) =>
      new Intl.NumberFormat("en-IN").format(params),
  },
];
export const communicationColumns =
  (): // handleEditClick?: (row: any, editCheck: boolean) => void
  GridColDef[] => [
    {
      field: "action",
      headerName: "Action",
      width: 120,
      align: "center",
      headerAlign: "center",
      disableColumnMenu: true,
    },
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
      minWidth: 180,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "CommunicationType",
      headerName: "Communication Type",
      minWidth: 180,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "CommunicationProof",
      headerName: "Communication Description",
      minWidth: 200,
      headerAlign: "center",
      flex: 2,
      align: "center",
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
      minWidth: 140,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
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
    minWidth: 140,
    disableColumnMenu: true,
  },
  {
    field: "CommunicationType",
    headerName: "Communication Type",
    minWidth: 150,
    disableColumnMenu: true,
  },
  {
    field: "CommunicationDesc",
    headerName: "Communication Description",
    minWidth: 300,

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
    minWidth: 150,
    disableColumnMenu: true,
  },
  {
    field: "Department",
    headerName: "Department",
    minWidth: 100,
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
