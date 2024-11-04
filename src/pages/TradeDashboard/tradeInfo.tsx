import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import DropDown from "../../components/common/customDropDown";
import { ClientCashColumns, T6Columns } from "./TradeColumns";

interface Trade {
  id: string;
  date: string;
  category: string;
  scriptName: string;
  rr: string; // Risk-Reward ratio
  timeFrame: string;
  status: string;
  analyst: string;
}

interface SelectedWidgetProps {
  selectedWidget: string;
  T6Data: any;
}

const DataTable = ({ selectedWidget, T6Data }: SelectedWidgetProps) => {
  const [tradeData, setTradeData] = useState<Trade[]>([]);
  // const [page, setPage] = useState<number>(0); // For pagination
  // const [pageSize, setPageSize] = useState<number>(100); // Set page size
  const [totalRows, setTotalRows] = useState<number>(0); // Total rows for pagination

  // Define columns for the DataGrid dynamically

  useEffect(() => {
    console.log(totalRows);

    if (selectedWidget !== "Clients With Cash Balance") {
      setTradeData([]);
    }
  }, [selectedWidget]);

  const handleValues = (data: Trade[]) => {
    const totalCount = data && data.flat().length;
    console.log("Received dropdown data:", data, totalCount);
    const slicedData = data && data.slice(0, totalCount);
    setTradeData(slicedData);
    setTotalRows(totalCount);
  };
  return (
    <>
      {selectedWidget === "Clients With Cash Balance" && (
        <DropDown tradeData={setTradeData} handleValues={handleValues} />
      )}
      <Paper
        sx={{
          height: 450,
          width: "100%",
          overflowX: "auto",
          fontFamily: "Public Sans, sans-serif",
        }}
      >
        <DataGrid
          rows={
            selectedWidget === "Clients With Cash Balance" ? tradeData : T6Data
          }
          columns={
            selectedWidget === "Clients With Cash Balance"
              ? ClientCashColumns
              : T6Columns
          }
          getRowId={(row: any) => row.ClientName} // Use the correct identifier for rows
          sx={{
            border: 0,
            fontFamily: '"Public Sans", sans-serif',
            "& .MuiDataGrid-columnHeader": {
              fontWeight: 500,
              fontSize: "15px",
            },
            "& .MuiDataGrid-cell": {
              fontFamily: '"Public Sans", sans-serif',
            },
          }}
        />
      </Paper>
    </>
  );
};

export default DataTable;
