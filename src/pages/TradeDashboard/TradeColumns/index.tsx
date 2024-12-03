import { GridColDef } from "@mui/x-data-grid";

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
  },
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
  },
  {
    field: "StockValue",
    headerName: "Stock Value",
    width: 95,
    align: "right",
    headerAlign: "center",
  },
  {
    field: "G5",
    headerName: ">T5",
    width: 95,
    align: "right",
    headerAlign: "center",
  },
  {
    field: "T5",
    headerName: "T5",
    width: 95,
    align: "right",
    headerAlign: "center",
  },
  {
    field: "T4",
    headerName: "T4",
    width: 80,
    align: "right",
    headerAlign: "center",
  },
  {
    field: "T3",
    headerName: "T3",
    width: 80,
    align: "right",
    headerAlign: "center",
  },
  {
    field: "T2",
    headerName: "T2",
    width: 80,
    align: "right",
    headerAlign: "center",
  },
  {
    field: "T1",
    headerName: "T1",
    width: 80,
    align: "right",
    headerAlign: "center",
  },
];

export const T6OverViewColumns: GridColDef[] = [
  {
    field: "ClientCode",
    headerName: "Client",
    width: 200,
    headerAlign: "center",
    // align: "center",
    renderCell: (params) => (
      <div style={{ textAlign: "center", lineHeight: "1.2" }}>
        <div>{params.row.ClientCode}</div>
        <div>{params.row.ClientName}</div>
      </div>
    ),
  },
  {
    field: "T5",
    headerName: "T5",
    width: 100,
    align: "right",
    headerAlign: "center",
  },
];
