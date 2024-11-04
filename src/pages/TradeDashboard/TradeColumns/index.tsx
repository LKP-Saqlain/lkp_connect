import { GridColDef } from "@mui/x-data-grid";

export const ClientCashColumns: GridColDef[] = [
  { field: "ClientCode", headerName: "Client Code", width: 150 },
  { field: "ClientName", headerName: "Client Name", width: 150 },
  { field: "LastTradeDate", headerName: "Last Trade Date", width: 150 },
  { field: "Cash", headerName: "Cash", width: 150 },
];
export const T6Columns: GridColDef[] = [
  { field: "ClientCode", headerName: "Client Code", width: 150 },
  { field: "ClientName", headerName: "Client Name", width: 150 },
  { field: "ClosingBal", headerName: "Closing Balance", width: 150 },
  { field: "T1", headerName: "T1", width: 150 },
  { field: "T2", headerName: "T2", width: 150 },
  { field: "T3", headerName: "T3", width: 150 },
  { field: "T4", headerName: "T4", width: 150 },
  { field: "T5", headerName: "T5", width: 150 },
  { field: "G5", headerName: "G5", width: 150 },
  { field: "StockValue", headerName: "Stock Value", width: 150 },
];
