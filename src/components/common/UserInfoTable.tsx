import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import DropDown from "./customDropDown";
import {
  ClientCashColumns,
  DormantOverViewColumns,
  T6Columns,
  T6OverViewColumns,
  topBirthdays,
  DPDebitRecovery,
  dormantColumns,
  QPayoutColumns,
} from "../../pages/TradeDashboard/TradeColumns";
import {
  getClientActivityStatusColumns,
  getClientDormantStatus,
} from "../../pages/ClientDetails/ClientTableColumns";
// import { Box, Button } from "@mui/material";
import SearchAppBar from "../../components/common/SearchBar";
import "../../pages/ClientDetails/style.css";
import EmailIcon from "@mui/icons-material/Email";
import CustomModal from "./DPModal";

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
  showSearch?: any;
  handleSearchBasedOnInput?: (value: string) => void;
  handleSearchUser?: () => void;
  customHide?: any;
  searchValue?: any;
  onFilterChange?: (filter: string) => void;
  tradeCWCBData?: any;
  handleEmailSend?: (
    Payment_link: string,
    EnCAccountCode: string,
    setEmailSent: React.Dispatch<React.SetStateAction<boolean>>
  ) => void;
  emailSent?: boolean;
  emailSentStatus?: any;
  activeSubItem?: any;
  showExcel?: any;
  handleExcelDownload?: () => void;
}

const DataTable = ({
  selectedWidget,
  T6Data,
  getUserDetails,
  // handleExcel,
  // apiStatus,
  activeGroupedClients,
  inactiveGroupedClients,
  handleSearchBasedOnInput,
  handleSearchUser,
  showSearch = false,
  customHide,
  searchValue,
  onFilterChange,
  tradeCWCBData,
  emailSentStatus,
  activeSubItem,
  showExcel,
  handleExcelDownload,
}: SelectedWidgetProps) => {
  const [tradeData, setTradeData] = useState<Trade[]>([]);
  const [totalRows, setTotalRows] = useState<number>(0); // Total rows for pagination
  const [modal_center, setmodal_center] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<any>(null); // Store selected row data

  useEffect(() => {
    console.log("subItem", activeSubItem);
  }, [activeSubItem]);

  useEffect(() => {
    console.log("selectedWidgets", selectedWidget);
  }, [selectedWidget]);

  useEffect(() => {
    console.log(totalRows, tradeData);

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

  const tog_center = () => {
    setmodal_center(!modal_center);
  };

  const handleViewDetails = (row: any) => {
    // debugger;
    console.log("View Details clicked for:", row);
    // getUserDetails?.(row);
    setSelectedRow(row);
    // tog_center();
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
    } else if (selectedWidget === "clientBirthday") {
      return topBirthdays.map((column) => ({
        ...column,
      }));
    } else if (selectedWidget === "T6Overview") {
      return T6OverViewColumns.map((column) => ({
        ...column,
      }));
    } else if (selectedWidget === "dormantOverview") {
      return DormantOverViewColumns.map((column) => ({
        ...column,
      }));
    } else if (
      selectedWidget === "Total Clients" ||
      selectedWidget === "Active Clients" ||
      selectedWidget === "Inactive Clients"
      // apiStatus
    ) {
      return getClientActivityStatusColumns(handleViewDetails);
    } else if (selectedWidget === "Client Approaching  Dormant Status") {
      return getClientDormantStatus(handleViewDetails);
    } else if (activeSubItem === "Dormant Client Report") {
      return dormantColumns.map((column) => ({
        ...column,
      }));
    } else if (activeSubItem === "Quarterly Payout Recovery") {
      return QPayoutColumns.map((column) => ({
        ...column,
      }));
    } else {
      // return [];
      // Inject handleEmailSend into the column definition
      return DPDebitRecovery.map((column) => {
        if (column.field === "Email_link") {
          return {
            ...column,
            renderCell: (params: any) => {
              const emailID = params.row.Client_Mail_ID;
              const isEmailSent = emailSentStatus[params.row.BOID]; // Check status for this BOID

              if (!emailID) {
                return <span style={{ color: "gray" }}></span>; // Placeholder if no email ID
              }
              return (
                <button
                  onClick={() => {
                    // Call both functions
                    // handleEmailSend?.();
                    handleViewDetails?.(params.row);
                    setSelectedRow(params.row); // Store the selected row data
                    tog_center(); // Open the modal
                  }}
                  disabled={isEmailSent}
                  style={{
                    color: isEmailSent && "green",
                    textDecoration: isEmailSent ? "none" : "underline",
                    background: "none",
                    border: "none",
                    cursor: isEmailSent ? "default" : "pointer",
                  }}
                >
                  {isEmailSent ? (
                    "Email Sent!"
                  ) : (
                    <EmailIcon style={{ color: "#11395C" }} />
                  )}
                </button>
              );
            },
          };
        }
        return column;
      });
    }
  };

  const columns = getColumns();

  const handleSearchChange = (query: string) => {
    handleSearchBasedOnInput?.(query);
  };

  return (
    <>
      <CustomModal
        tog_center={() => setmodal_center(!modal_center)}
        modal_center={modal_center}
        setmodal_center={setmodal_center}
        getUserDetails={getUserDetails} // Pass the API call function
        row={selectedRow} // Pass the selected row data
      />
      {selectedWidget === "Clients With Cash Balance" && (
        <DropDown tradeData={setTradeData} handleValues={handleValues} />
      )}
      {/* {(selectedWidget === "Total Clients" ||
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
      )} */}
      {showSearch && (
        <SearchAppBar
          onSearchChange={handleSearchChange}
          handleSearchUser={handleSearchUser}
          searchTableValue={searchValue}
          selectedWidget={selectedWidget}
          onFilterChange={onFilterChange}
          showExcel={showExcel}
          handleExcelDownload={handleExcelDownload}
        />
      )}
      <Paper
        sx={{
          height: "70vh",
          width: "100%",
          overflowX: "auto",
          fontFamily: "Public Sans, sans-serif",
        }}
      >
        <DataGrid
          rows={
            selectedWidget === "Clients With Cash Balance"
              ? tradeCWCBData
              : selectedWidget === "Total Clients"
              ? T6Data
              : selectedWidget === "Active Clients"
              ? activeGroupedClients
              : selectedWidget === "Inactive Clients"
              ? inactiveGroupedClients
              : selectedWidget === "Client Approaching  Dormant Status"
              ? T6Data
              : T6Data
          }
          columns={columns}
          rowHeight={30}
          hideFooter={customHide ? true : false}
          getRowId={(row: any) =>
            row.clientName
              ? row.clientName
              : row.ClientName
              ? row.ClientName
              : row.BOID
              ? `${row.BOName}-${row.TotalDebit}-${Math.random()}` // this is just for when data comes repetative
              : // ? row.BOID
                row.Name
          } // Use the correct identifier for rows
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? "even-row" : "odd-row"
          }
          sx={{
            border: 0,
            fontFamily: '"Public Sans", sans-serif',
            "& .MuiDataGrid-columnHeader": {
              // textAlign: "center",
              backgroundColor: "#6C757D", // Set the header background color to grey
              color: "#fff", // Optionally set the text color to white for better contrast
              fontWeight: 500,
              fontSize: "12px",
            },
            "& .MuiDataGrid-cell": {
              fontFamily: '"Public Sans", sans-serif',
              fontSize: "11px",
              // textAlign: "center",
            },
          }}
          slotProps={{
            pagination: {
              sx: {
                "& .MuiTablePagination-toolbar": {
                  alignItems: "center",
                },
                "& .MuiTablePagination-selectLabel": {
                  fontSize: "13px",
                  marginBottom: 0,
                  fontFamily: "Public Sans",
                },
                "& .MuiInputBase-root": {
                  marginTop: 0,
                },
              },
            },
          }}
        />
      </Paper>
    </>
  );
};

export default DataTable;
