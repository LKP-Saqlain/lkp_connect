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
  communicationColumns,
  CompliancneReport,
  getClientActivityStatusColumns,
  getClientDormantStatus,
  getAccountDetails,
  getCommChecker,
  getRegulatorAnnouncement,
  terminalcol,
} from "../../helper/tableColumns.tsx";
// import { Box, Button } from "@mui/material";
import SearchAppBar from "../../components/common/SearchBar";
import "../../pages/ClientDetails/style.css";
import EmailIcon from "@mui/icons-material/Email";
import CustomModal from "./DPModal";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Tooltip from "@mui/material/Tooltip";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

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
  handleEditClick?: (data: any, editCheck: boolean) => void;
  handleDeleteClick?: (data: any) => void;
  handleApproval?: any;
  handleDownload?: any;
  totalCount?: any;
  activeClient?: any;
  inactiveClient?: any;
  totalLedgerDebitAmt?: any;
  dormantCount?: any;
  getRowHeight?: any;
  customCss?: boolean;
}

const DataTable = ({
  getRowHeight,
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
  handleEditClick,
  handleApproval,
  handleDownload,
  totalCount,
  activeClient,
  inactiveClient,
  handleDeleteClick,
  totalLedgerDebitAmt,
  dormantCount,
  customCss,
}: SelectedWidgetProps) => {
  const [tradeData, setTradeData] = useState<Trade[]>([]);
  const [totalRows, setTotalRows] = useState<number>(0); // Total rows for pagination
  const [modal_center, setmodal_center] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<any>(null); // Store selected row data
  const [action, setAction] = useState<"approve" | "reject">("approve");

  useEffect(() => {
    console.log("subItem and selectedWidgets", activeSubItem, selectedWidget);
  }, [activeSubItem, selectedWidget]);

  useEffect(() => {
    console.log(totalRows, tradeData);

    if (selectedWidget !== "Clients With Ledger Balance") {
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
  const HandleApprovalModal = (actionType: "approve" | "reject") => {
    setAction(actionType);
    tog_center();
  };

  const handleViewDetails = (row: any) => {
    // debugger;
    console.log("View Details clicked for:", row);
    // getUserDetails?.(row);
    setSelectedRow(row);
    // tog_center();
  };

  const handleDeleteEntry = (row: any) => {
    handleDeleteClick?.(row);
  };

  const getColumns = () => {
    if (selectedWidget === "Clients With Ledger Balance") {
      return ClientCashColumns.map((column) => ({
        ...column,
        // sortable: false,
        // filterable: false,
      }));
    } else if (selectedWidget === "Clients Ageing Report") {
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
    } else if (activeSubItem === "DP Debit Recovery") {
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
                    color: isEmailSent && "#11395C",
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
    } else if (activeSubItem === "Communication Retrival Entry") {
      // This section is where the delete functionality will be added
      return communicationColumns().map((column) => {
        if (column.field === "action") {
          return {
            ...column,
            renderCell: (params: any) => {
              const isDeleted = params.row.isDeleted; // Add condition based on your row data

              const handleEdit = () => {
                handleEditClick?.(params.row, true); // Call edit function for Communication Retrieval Entry
              };

              return (
                <>
                  <Tooltip title="Edit" arrow placement="top">
                    <IconButton
                      sx={{ p: 0 }}
                      color="primary"
                      onClick={handleEdit}
                    >
                      <EditIcon fontSize="small" sx={{ color: "#11395C" }} />
                    </IconButton>
                  </Tooltip>
                  <button
                    onClick={() => {
                      handleDeleteEntry(params.row); // Call delete function for Communication Retrieval Entry
                      setSelectedRow(params.row); // Store the selected row for confirmation
                      tog_center(); // Open the modal for deletion confirmation
                    }}
                    disabled={isDeleted}
                    style={{
                      color: isDeleted ? "red" : "#11395C",
                      textDecoration: isDeleted ? "none" : "underline",
                      background: "none",
                      border: "none",
                      cursor: isDeleted ? "default" : "pointer",
                      marginLeft: "10px",
                    }}
                  >
                    {isDeleted ? (
                      "Deleted"
                    ) : (
                      <Tooltip title="Delete" arrow placement="top">
                        <IconButton
                          sx={{ p: 0 }}
                          color="primary"
                          onClick={() => handleDeleteEntry?.(params.row)}
                        >
                          <DeleteIcon
                            fontSize="small"
                            sx={{ color: "#11395C" }}
                          />
                        </IconButton>
                      </Tooltip>
                    )}
                  </button>
                </>
              );
            },
          };
        }
        return column;
      });
    } else if (activeSubItem === "Communication Retrival Report") {
      return CompliancneReport.map((column) => {
        if (column.field === "CommunicationProofPath") {
          return {
            ...column,
            renderCell: (params: any) => {
              return (
                <button
                  onClick={() => {
                    handleDownload(params.row); // This will trigger the download function
                  }}
                  style={{
                    color: "#11395C",
                    textDecoration: "underline",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Download
                </button>
              );
            },
          };
        }
        return column;
      });
    } else if (
      selectedWidget === "Total Clients" ||
      selectedWidget === "Active Clients" ||
      selectedWidget === "Inactive Clients"
      // apiStatus
    ) {
      return getClientActivityStatusColumns(handleViewDetails);
    } else if (selectedWidget === "Upcoming Dormant Client") {
      return getClientDormantStatus(handleViewDetails);
    } else if (activeSubItem === "Referal Entry Status") {
      return getAccountDetails.map((column) => ({
        ...column,
      }));
    } else if (activeSubItem === "KRA PAN STATUS") {
      return terminalcol.map((column) => ({
        ...column,
      }));
    } else if (activeSubItem === "UCCCode MATCH") {
      return getRegulatorAnnouncement.map((column) => {
        if (column.field === "circular") {
          return {
            ...column,
            renderCell: (params: any) => {
              return (
                <button
                  onClick={() => console.log(params.row.circular)}
                  style={{
                    color: "white",
                    // textDecoration: "underline",
                    background: "#11395c",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: "10px",
                    width: "90px",
                  }}
                >
                  Download
                </button>
              );
            },
          };
        }
        if (column.field === "lkpComments") {
          return {
            ...column,
            renderCell: () => {
              return (
                <button
                  onClick={() => setmodal_center(!modal_center)}
                  style={{
                    color: "white",
                    // textDecoration: "underline",
                    background: "#11395c",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: "10px",
                    width: "90px",
                  }}
                >
                  View
                </button>
              );
            },
          };
        }
        return column;
      });
    } else if (activeSubItem === "Communication Retrival Checker") {
      return getCommChecker.map((column) => {
        if (column.field === "status") {
          return {
            ...column,
            renderCell: (params: any) => {
              return (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  <div
                    onClick={() => {
                      HandleApprovalModal("approve");
                      setSelectedRow(params.row.RowId);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <span>Approve</span>
                    <CheckCircleIcon style={{ color: "green" }} />
                  </div>
                  <div
                    style={{
                      fontSize: "20px",
                      color: "gray",
                      margin: "0 5px 0 5px",
                    }}
                  >
                    |
                  </div>
                  <div
                    onClick={() => {
                      HandleApprovalModal("reject");
                      setSelectedRow(params.row.RowId);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <span>Reject</span>
                    <CancelIcon style={{ color: "red" }} />
                  </div>
                </div>
              );
            },
          };
        }
        if (column.field === "CommunicationProofPath") {
          return {
            ...column,
            renderCell: (params: any) => {
              return (
                <button
                  onClick={() => {
                    handleDownload(params.row);
                  }}
                  style={{
                    color: "#11395C",
                    textDecoration: "underline",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Download
                </button>
              );
            },
          };
        }

        // Return unchanged column if not the 'status' or 'document' field
        return column;
      });
    } else if (activeSubItem === "Dormant Client Report") {
      return dormantColumns.map((column) => ({
        ...column,
      }));
    } else if (activeSubItem === "Quarterly Payout Recovery") {
      return QPayoutColumns.map((column) => ({
        ...column,
      }));
    } else if (
      selectedWidget === "Total Clients" ||
      selectedWidget === "Active Clients" ||
      selectedWidget === "Inactive Clients"
      // apiStatus
    ) {
      return getClientActivityStatusColumns(handleViewDetails);
    } else {
      return [];
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
        action={action}
        handleApproval={handleApproval}
        Msg={
          activeSubItem === "Communication Retrival Entry"
            ? "Are you sure want to delete this entry"
            : activeSubItem === "Communication Retrival Checker"
            ? `Are you sure want to ${action} this entry`
            : activeSubItem === "UCCCode MATCH"
            ? "Lorem Id malesuada blandit cursus sollicitudin amet nequene quenequ eneque egestas montes.clicked Regulator Announcements check console "
            : "Are you sure you want to send the email?"
        }
        activeSubItem={activeSubItem}
      />
      {selectedWidget === "Clients With Ledger Balance" && (
        <DropDown tradeData={setTradeData} handleValues={handleValues} />
      )}
      {/* {(selectedWidget === "Total Clients" ||
        selectedWidget === "Active Clients" ||
        selectedWidget === "Inactive Clients" ||
        selectedWidget === "Clients Ageing Report") && (
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
          totalCount={totalCount}
          activeClient={activeClient}
          inactiveClient={inactiveClient}
          totalLedgerDebitAmt={totalLedgerDebitAmt}
          activeSubItem={activeSubItem}
          dormantCount={dormantCount}
        />
      )}
      <Paper
        sx={{
          height: "75vh",
          width: "100%",
          overflowX: "auto",
          fontFamily: "Public Sans, sans-serif",
        }}
      >
        <DataGrid
          disableRowSelectionOnClick
          rows={
            selectedWidget === "Clients With Ledger Balance"
              ? tradeCWCBData
              : selectedWidget === "Total Clients"
              ? T6Data
              : selectedWidget === "Active Clients"
              ? activeGroupedClients
              : selectedWidget === "Inactive Clients"
              ? inactiveGroupedClients
              : selectedWidget === "Active Clients" &&
                activeSubItem === "DP Debit Recovery"
              ? activeGroupedClients
              : selectedWidget === "Inactive Clients" &&
                activeSubItem === "DP Debit Recovery"
              ? inactiveGroupedClients
              : selectedWidget === "Upcoming Dormant Client"
              ? T6Data
              : T6Data
          }
          localeText={{ noRowsLabel: "No Records!" }}
          columns={columns}
          rowHeight={30}
          hideFooter={customHide ? true : false}
          getRowId={(row: any) =>
            row.clientName
              ? row.clientName
              : row.ClientName
              ? row.ClientName
              : row.RowId
              ? row.RowId
              : row.id
              ? row.id
              : row.RowId
              ? row.RowId
              : row.dummyId
              ? row.dummyId
              : row.BOID
              ? `${row.BOName}-${row.TotalDebit}-${Math.random()}` // this is just for when data comes repetative
              : // ? row.BOID
                row.Name
          } // Use the correct identifier for rows
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? "even-row" : "odd-row"
          }
          getRowHeight={getRowHeight}
          sx={{
            border: 0,
            fontFamily: '"Public Sans", sans-serif',
            "& .MuiDataGrid-columnHeader": {
              // textAlign: "center",
              backgroundColor: "#11395C", // Set the header background color to grey
              color: "#fff", // Optionally set the text color to white for better contrast
              fontWeight: 500,
              fontSize: "12px",
            },
            "& .MuiDataGrid-cell": {
              fontFamily: '"Public Sans", sans-serif',
              fontSize: "12px",
              // alignItems: "center",
              alignContent: customCss ? "center" : "",
              color: "#000",
              border: "1px solid #D3D3D3 !important",
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
