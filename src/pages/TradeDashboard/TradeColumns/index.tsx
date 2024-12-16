import { GridColDef } from "@mui/x-data-grid";
import Tooltip from "@mui/material/Tooltip";

export const ClientCashColumns: GridColDef[] = [
  {
    field: "ClientCode",
    headerName: "Client Code",
    width: 150,
    headerAlign: "center",
    align: "center",
  },
  { field: "ClientName", headerName: "Client Name", width: 150 },
  { field: "LastTradeDate", headerName: "Last Trade Date", width: 150 },
  {
    field: "Cash",
    headerName: "Cash",
    width: 150,
    align: "right",
    headerAlign: "center",
    valueFormatter: (params: number) =>
      new Intl.NumberFormat("en-IN").format(params),
  },
  {
    field: "MobileNo",
    headerName: "Mobile No",
    width: 120,
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
    field: "Brokerage_for_currentmonth",
    headerName: "Currnet Month",
    width: 120,
  },
  { field: "Brokerage_for_1month", headerName: "Last Month", width: 120 },
  { field: "Brokerage_for_3months", headerName: "1 Month", width: 120 },
];
export const T6Columns: GridColDef[] = [
  {
    field: "ClientCode",
    headerName: "Client Code",
    width: 105,
    headerAlign: "center",
    align: "center",
  },
  { field: "ClientName", headerName: "Client Name", width: 180 },
  {
    field: "ClosingBal",
    headerName: "Closing Balance",
    width: 120,
    align: "right",
    headerAlign: "center",
    valueFormatter: (params: number) =>
      new Intl.NumberFormat("en-IN").format(params),
  },
  {
    field: "StockValue",
    headerName: "Stock Value",
    width: 95,
    align: "right",
    headerAlign: "center",
    valueFormatter: (params: number) =>
      new Intl.NumberFormat("en-IN").format(params),
  },
  {
    field: "G5",
    headerName: ">T5",
    width: 95,
    align: "right",
    headerAlign: "center",
    valueFormatter: (params: number) =>
      new Intl.NumberFormat("en-IN").format(params),
  },
  {
    field: "T5",
    headerName: "T5",
    width: 95,
    align: "right",
    headerAlign: "center",
    valueFormatter: (params: number) =>
      new Intl.NumberFormat("en-IN").format(params),
  },
  {
    field: "T4",
    headerName: "T4",
    width: 80,
    align: "right",
    headerAlign: "center",
    valueFormatter: (params: number) =>
      new Intl.NumberFormat("en-IN").format(params),
  },
  {
    field: "T3",
    headerName: "T3",
    width: 80,
    align: "right",
    headerAlign: "center",
    valueFormatter: (params: number) =>
      new Intl.NumberFormat("en-IN").format(params),
  },
  {
    field: "T2",
    headerName: "T2",
    width: 80,
    align: "right",
    headerAlign: "center",
    valueFormatter: (params: number) =>
      new Intl.NumberFormat("en-IN").format(params),
  },
  {
    field: "T1",
    headerName: "T1",
    width: 80,
    align: "right",
    headerAlign: "center",
    valueFormatter: (params: number) =>
      new Intl.NumberFormat("en-IN").format(params),
  },
];

export const T6OverViewColumns: GridColDef[] = [
  {
    field: "ClientCode",
    headerName: "Client",
    width: 180,
    headerAlign: "center",
    // align: "center",
    renderCell: (params) => (
      <div style={{ textAlign: "left", lineHeight: "1.2" }}>
        <div>{params.row.ClientName}</div>
        <div>{params.row.ClientCode}</div>
      </div>
    ),
  },
  {
    field: "T5",
    headerName: "T5",
    width: 90,
    align: "right",
    headerAlign: "center",
    valueFormatter: (params: number) =>
      new Intl.NumberFormat("en-IN").format(params),
  },
];
export const DormantOverViewColumns: GridColDef[] = [
  {
    field: "ctermcode",
    headerName: "Client",
    width: 125,
    headerAlign: "center",
    // align: "center",
    renderCell: (params) => (
      <div style={{ textAlign: "left", lineHeight: "1.2" }}>
        <div>{params.row.clientName}</div>
        <div>{params.row.ctermcode}</div>
      </div>
    ),
  },
  {
    field: "dayCount",
    headerName: "Days to Dormant",
    width: 80,
    align: "center",
  },
  { field: "lastTradeDate", headerName: "Last Trade Date", width: 200 },
];

export const topBirthdays: GridColDef[] = [
  {
    field: "Name",
    headerName: "Client",
    width: 140,
    headerAlign: "center",
    // align: "center",
    renderCell: (params) => (
      <div style={{ textAlign: "left", lineHeight: "1.2" }}>
        <div>{params.row.Name}</div>
        <div>{params.row.Code}</div>
      </div>
    ),
  },
  {
    field: "MobileNumber",
    headerName: "MobileNo",
    width: 90,
    align: "center",
  },
  {
    field: "Date",
    headerName: "Date",
    width: 100,
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
