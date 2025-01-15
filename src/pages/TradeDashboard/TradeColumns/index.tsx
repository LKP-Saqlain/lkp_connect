import { GridColDef } from "@mui/x-data-grid";
import Tooltip from "@mui/material/Tooltip";
import "../style.css";
// import { useMemo, useState } from "react";

export const ClientCashColumns: GridColDef[] = [
  {
    field: "ClientCode",
    headerName: "Client Code",
    flex: 1.5, // Use flex for responsive column width
    minWidth: 150, // Ensure minimum width for proper readability
    headerAlign: "center",
    align: "left",
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: "ClientName",
    headerName: "Client Name",
    flex: 4, // Allocate more space for the client name
    minWidth: 200,
  },
  {
    field: "LastTradeDate",
    headerName: "Last TR Date",
    flex: 1,
    minWidth: 100,
    sortable: false,
    disableColumnMenu: true,
    align: "center",
  },
  {
    field: "Cash",
    headerName: "Cash",
    flex: 1.2,
    minWidth: 120,
    align: "right",
    headerAlign: "center",
    valueFormatter: (params: number) =>
      new Intl.NumberFormat("en-IN").format(params),
    sortable: false,
    disableColumnMenu: true,
  },

  {
    field: "MobileNo",
    headerName: "Mobile No",
    flex: 1,
    minWidth: 120,
    renderCell: (params: any) => {
      const mobile = params.value || ""; // Extract the mobile number
      // Mask all except first 2 digits
      const maskedMobile = mobile.replace(
        /^(\d{2})(\d+)/,
        (_: any, prefix: any, rest: any) => {
          console.log(prefix); //addded only for testing purpose
          // return `${prefix}${"X".repeat(rest.length)}`;
          // console.log(handleViewDetails);

          return `${"X".repeat(rest.length)}`;
        }
      );

      // Return tooltip with the masked mobile number
      return (
        <Tooltip title={mobile} arrow placement="top">
          <span style={{ cursor: "pointer" }}>{maskedMobile}</span>
        </Tooltip>
      );
    },
    sortable: false,
    disableColumnMenu: true,
    align: "center",
  },
  {
    field: "Brokerage_for_currentmonth",
    headerName: "Current Month",
    flex: 1.2,
    minWidth: 120,
    align: "right",
    headerAlign: "center",
    valueFormatter: (params: number) =>
      new Intl.NumberFormat("en-IN").format(params),
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: "Brokerage_for_1month",
    align: "right",
    headerAlign: "center",
    headerName: "Last Month",
    flex: 1.2,
    minWidth: 120,
    valueFormatter: (params: number) =>
      new Intl.NumberFormat("en-IN").format(params),
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: "Brokerage_for_3months",
    headerName: "3 Month",
    align: "right",
    headerAlign: "center",
    flex: 1.2,
    minWidth: 120,
    valueFormatter: (params: number) =>
      new Intl.NumberFormat("en-IN").format(params),
    sortable: false,
    disableColumnMenu: true,
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
    sortable: false,
    disableColumnMenu: true,
  },
  { field: "ClientName", headerName: "Client Name", flex: 2.2, minWidth: 220 },
  {
    field: "ClosingBal",
    headerName: "Closing Balance",
    flex: 1.2,
    minWidth: 120,
    align: "right",
    headerAlign: "center",
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
    valueFormatter: (params: number) =>
      new Intl.NumberFormat("en-IN").format(params),
  },
  {
    field: "G5",
    headerName: ">T5",
    flex: 1,
    minWidth: 95,
    align: "right",
    headerAlign: "center",
    valueFormatter: (params: number) =>
      new Intl.NumberFormat("en-IN").format(params),
  },
  {
    field: "T5",
    headerName: "T5",
    flex: 1,
    minWidth: 95,
    align: "right",
    headerAlign: "center",
    valueFormatter: (params: number) =>
      new Intl.NumberFormat("en-IN").format(params),
  },
  {
    field: "T4",
    headerName: "T4",
    flex: 0.9,
    minWidth: 80,
    align: "right",
    headerAlign: "center",
    valueFormatter: (params: number) =>
      new Intl.NumberFormat("en-IN").format(params),
  },
  {
    field: "T3",
    headerName: "T3",
    flex: 0.9,
    minWidth: 80,
    align: "right",
    headerAlign: "center",
    valueFormatter: (params: number) =>
      new Intl.NumberFormat("en-IN").format(params),
  },
  {
    field: "T2",
    headerName: "T2",
    flex: 0.9,
    minWidth: 80,
    align: "right",
    headerAlign: "center",
    valueFormatter: (params: number) =>
      new Intl.NumberFormat("en-IN").format(params),
  },
  {
    field: "T1",
    headerName: "T1",
    flex: 0.9,
    minWidth: 80,
    align: "right",
    headerAlign: "center",
    valueFormatter: (params: number) =>
      new Intl.NumberFormat("en-IN").format(params),
  },
];

export const T6OverViewColumns: GridColDef[] = [
  {
    field: "ClientCode",
    headerName: "Client Code",
    flex: 2,
    headerAlign: "center",
    align: "left",
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
  },
  {
    field: "T5",
    headerName: "T5",
    flex: 1,
    align: "right",
    headerAlign: "center",
    valueFormatter: (params: number) =>
      new Intl.NumberFormat("en-IN").format(params),
  },
];

export const DPDebitRecovery: GridColDef[] = [
  { field: "BOID", headerName: "BOID", width: 140 },
  { field: "BOName", headerName: "Name of Client", width: 200 },
  {
    field: "Ledger_DebitAmt",
    headerName: "Ledger Debit",
    width: 150,
    align: "right",
    headerAlign: "center",
  },
  {
    field: "TotalDebit",
    headerName: "Total Debit",
    width: 150,
    align: "right",
    headerAlign: "center",
  },
  {
    field: "Holding_value",
    headerName: "Holding Value",
    width: 150,
    align: "right",
    headerAlign: "center",
  },
  {
    field: "Client_Mobile_No",
    headerName: "Mobile No",
    headerAlign: "center",
    flex: 1,
    minWidth: 120,
    renderCell: (params: any) => {
      const mobile = params.value || ""; // Extract the mobile number
      // Mask all except first 2 digits
      const maskedMobile = mobile.replace(
        /^(\d{2})(\d+)/,
        (_: any, prefix: any, rest: any) => {
          console.log(prefix); //addded only for testing purpose
          // return `${prefix}${"X".repeat(rest.length)}`;
          // console.log(handleViewDetails);

          return `${"X".repeat(rest.length)}`;
        }
      );

      // Return tooltip with the masked mobile number
      return (
        <Tooltip title={mobile} arrow placement="top">
          <span style={{ cursor: "pointer" }}>{maskedMobile}</span>
        </Tooltip>
      );
    },
    sortable: false,
    disableColumnMenu: true,
    align: "center",
  },
  {
    field: "payment_link",
    headerName: "Payment Link",
    width: 300,
    align: "center",
    headerAlign: "center",
    renderCell: (params: any) => {
      const { Payment_link, EnCAccountCode } = params.row;
      if (!Payment_link || !EnCAccountCode)
        return <span>No Link Available</span>;

      const fullLink = `${Payment_link}${EnCAccountCode}`;
      return (
        <a
          href={fullLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "blue", textDecoration: "underline" }}
        >
          Click here
        </a>
      );
    },
  },
  {
    field: "Email_link",
    headerName: "Email Link",
    width: 180,
    align: "center",
    headerAlign: "center",
  },
];

export const DormantOverViewColumns: GridColDef[] = [
  {
    field: "ctermcode",
    headerName: "Client Code",
    flex: 3, // Adjusts proportionally to the screen size
    // minWidth: 150, // Ensures a minimum width for usability
    headerAlign: "center",
    align: "left",
    // renderCell: (params) => (
    //   <div style={{ textAlign: "left", lineHeight: "1.2" }}>
    //     <div>{params.row.clientName}</div>
    //     <div>{params.row.ctermcode}</div>
    //   </div>
    // ),
  },
  {
    field: "clientName",
    headerName: "Client Name",
    flex: 3, // Adjusts proportionally to the screen size
    // minWidth: 150, // Ensures a minimum width for usability
    headerAlign: "center",
    align: "left",
    // renderCell: (params) => (
    //   <div style={{ textAlign: "left", lineHeight: "1.2" }}>
    //     <div>{params.row.clientName}</div>
    //     <div>{params.row.ctermcode}</div>
    //   </div>
    // ),
  },
  {
    field: "dayCount",
    headerName: "Days to Dormant",
    flex: 2, // Smaller relative to "Client"
    // minWidth: 80, // Minimum width to avoid being too narrow
    align: "right",
    headerAlign: "center",
    headerClassName: "header-wrap",
  },
  {
    field: "lastTradeDate",
    headerName: "Last Trade Date",
    flex: 1,
    // minWidth: 150,
    headerAlign: "center",
    align: "center", // Optional: Align data as needed
  },
];

export const topBirthdays: GridColDef[] = [
  {
    field: "Code",
    headerName: "Client Code",
    flex: 2,
    headerAlign: "center",
    align: "left",
    // renderCell: (params) => (
    //   <div style={{ textAlign: "left", lineHeight: "1.2" }}>
    //     <div>{params.row.Name}</div>
    //     <div>{params.row.Code}</div>
    //   </div>
    // ),
  },
  {
    field: "Name",
    headerName: "Client Name",
    flex: 2,
    headerAlign: "center",
    align: "left",
    // renderCell: (params) => (
    //   <div style={{ textAlign: "left", lineHeight: "1.2" }}>
    //     <div>{params.row.Name}</div>
    //     <div>{params.row.Code}</div>
    //   </div>
    // ),
  },
  {
    field: "MobileNumber",
    headerName: "Mobile No",
    flex: 1.5,
    align: "center",
    headerAlign: "center",
    renderCell: (params: any) => {
      const mobile = params.value || ""; // Extract the mobile number
      // Mask all except first 2 digits
      const maskedMobile = mobile.replace(
        /^(\d{2})(\d+)/,
        (_: any, prefix: any, rest: any) => {
          console.log(prefix); //addded only for testing purpose
          // return `${prefix}${"X".repeat(rest.length)}`;
          // console.log(handleViewDetails);

          return `${"X".repeat(rest.length)}`;
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
