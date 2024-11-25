import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import DropDown from "./customDropDown";
import {
  ClientCashColumns,
  T6Columns,
} from "../../pages/TradeDashboard/TradeColumns";
import {
  getClientActivityStatusColumns,
  getClientDormantStatus,
} from "../../pages/ClientDetails/ClientTableColumns";
import { Box, Button } from "@mui/material";

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
  selectedWidget?: string;
  T6Data?: any;
  getUserDetails?: (value: any) => void;
  handleExcel?: (value: any) => void;
  apiStatus?: boolean;
  activeGroupedClients?: any;
  inactiveGroupedClients?: any;
}

const DataTable = ({
  selectedWidget,
  T6Data,
  getUserDetails,
  handleExcel,
  apiStatus,
  activeGroupedClients,
  inactiveGroupedClients,
}: SelectedWidgetProps) => {
  const [tradeData, setTradeData] = useState<Trade[]>([]);
  const [totalRows, setTotalRows] = useState<number>(0); // Total rows for pagination

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

  const handleViewDetails = (row: any) => {
    console.log("View Details clicked for:", row);
    getUserDetails?.(row);
  };
  const getColumns = () => {
    if (selectedWidget === "Clients With Cash Balance") {
      return ClientCashColumns.map((column) => ({
        ...column,
        // sortable: false,
        // filterable: false,
      }));
    } else if (selectedWidget === "T6 Selling") {
      return T6Columns.map((column) => ({
        ...column,
        // sortable: false,
        // filterable: false,
      }));
    } else if (
      // selectedWidget === "Total Clients" ||
      // selectedWidget === "Active Clients" ||
      // selectedWidget === "Inactive Clients"
      apiStatus
    ) {
      return getClientActivityStatusColumns(handleViewDetails);
    } else if (selectedWidget === "Client Approaching  Dormant Status") {
      return getClientDormantStatus(handleViewDetails);
    } else {
      return [];
    }
  };

  const columns = getColumns();

  return (
    <>
      {selectedWidget === "Clients With Cash Balance" && (
        <DropDown tradeData={setTradeData} handleValues={handleValues} />
      )}
      {(selectedWidget === "Total Clients" ||
        selectedWidget === "Active Clients" ||
        selectedWidget === "Inactive Clients" ||
        selectedWidget === "T6 Selling") && (
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="outlined"
            className="btn-font"
            sx={{
              bgcolor: "#11395C",
              color: "#fff",
              borderRadius: "7px",
              fontFamily: "Public Sans",
              borderColor: "#ABC4DA",
              textTransform: "capitalize",
              // marginBottom: "2",
              // ml: 1,
            }}
            onClick={handleExcel}
          >
            Download Excel
          </Button>
        </Box>
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
            selectedWidget === "Clients With Cash Balance"
              ? tradeData
              : selectedWidget === "Total Clients"
              ? T6Data
              : selectedWidget === "Active Clients"
              ? activeGroupedClients
              : selectedWidget === "Inactive Clients"
              ? inactiveGroupedClients
              : T6Data
          }
          columns={columns}
          rowHeight={30}
          getRowId={(row: any) => row.ClientName} // Use the correct identifier for rows
          sx={{
            border: 0,
            fontFamily: '"Public Sans", sans-serif',
            "& .MuiDataGrid-columnHeader": {
              // textAlign: "center",
              fontWeight: 500,
              fontSize: "12px",
            },
            "& .MuiDataGrid-cell": {
              fontFamily: '"Public Sans", sans-serif',
              fontSize: "10px",
              // textAlign: "center",
            },
          }}
        />
      </Paper>
    </>
  );
};

export default DataTable;
