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
  RegisDetails,
  RegionalHead,
  BrokerageModificationStatus,
  BrokerageKyc,
  slbmColumns,
  PreProofUploadColumns,
  preTradeColumns,
  PreTradeApprovalColumns,
} from "../../helper/tableColumns.tsx";
// import { Box, Button } from "@mui/material";
import SearchAppBar from "../../components/common/SearchBar";
import "../../pages/ClientDetails/style.css";
import EmailIcon from "@mui/icons-material/Email";
import CustomModal from "./DPModal";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Tooltip from "@mui/material/Tooltip";
import { Button, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { RootState } from "../../redux/store.ts";
import { useSelector } from "react-redux";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import UploadFileIcon from "@mui/icons-material/UploadFile";

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
  activeMenu?: any;
  onFileUpload?: (selectedRow: string, file: File, remark: string) => void;
  getUserBrokergageModificationDetails?: any;
  previewUrl?: any;
  setSetShowImg?: any;
  showDocument?: boolean;
  setShowDocument?: any;
  fileExtension?: any;
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
  activeMenu,
  onFileUpload,
  getUserBrokergageModificationDetails,
  previewUrl,
  setSetShowImg,
  showDocument,
  setShowDocument,
  fileExtension,
}: SelectedWidgetProps) => {
  const [tradeData, setTradeData] = useState<Trade[]>([]);
  const [totalRows, setTotalRows] = useState<number>(0); // Total rows for pagination
  const [modal_center, setmodal_center] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<any>(null); // Store selected row data
  const [action, setAction] = useState<"approve" | "reject">("approve");
  const [customLedgerData, setCustomLedgerData] = useState([]);
  // const [screenHeight, setScreenHeight] = useState(window.innerHeight);
  const [filteredLedgerDataDropDown, setFilteredLedgerDataDropDown] = useState<
    any[]
  >([]);

  const [showSearchCustom, setShowSearchCustom] = useState(showSearch);

  const { user_type } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data || {}
  );

  console.log("userType", user_type);

  // useEffect(() => {
  //   const handleResize = () => setScreenHeight(window.innerHeight);
  //   window.addEventListener("resize", handleResize);
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

  useEffect(() => {
    console.log(
      "subItem and selectedWidgets",
      activeSubItem,
      selectedWidget,
      "previewUrl-->",
      typeof previewUrl
    );
    setCustomLedgerData([]);
  }, [activeSubItem, selectedWidget, previewUrl]);

  useEffect(() => {
    console.log(totalRows, tradeData);

    if (selectedWidget !== "Clients With Ledger Balance") {
      setTradeData([]);
    }
  }, [selectedWidget]);

  const handleValues = (data: Trade[], responseStatus: any) => {
    const totalCount = data && data.flat().length;
    console.log("Received dropdown data:", data, totalCount, responseStatus);
    const slicedData = data && data.slice(0, totalCount);
    setTradeData(slicedData);
    setTotalRows(totalCount);
    setShowSearchCustom(responseStatus);
  };

  const tog_center = () => {
    setmodal_center(!modal_center);
    setShowDocument(false);
  };
  const HandleApprovalModal = (actionType: "approve" | "reject") => {
    console.log("TestactionType", actionType);

    setAction(actionType);
    tog_center();
  };

  const handleViewDetails = (row: any) => {
    // debugger;
    console.log("View Details clicked for:", row);
    getUserBrokergageModificationDetails?.(row);
    setSelectedRow(row);
    // tog_center();
  };

  // const handleDpDebitDetails = (row: any) => {
  //   console.log(row);
  //   // getUserDetails?.(row);
  // };

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
                    // handleDpDebitDetails?.(params.row);
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
                  <DownloadForOfflineIcon />
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
      return getClientActivityStatusColumns(handleViewDetails, user_type);
    } else if (selectedWidget === "Upcoming Dormant Client") {
      return getClientDormantStatus(handleViewDetails);
    } else if (activeSubItem === "Referal Entry Status") {
      return getAccountDetails.map((column) => ({
        ...column,
      }));
    } else if (activeSubItem === "RH Approval") {
      return RegionalHead.map((column) => {
        if (column.field === "remark") {
          return {
            ...column,
            renderCell: (params: any) => (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div
                  onClick={() => {
                    console.log("rowTest", params.row.rowId);
                    setSelectedRow(params.row.rowId);
                    // HandleApprovalModal("approve", params);
                    HandleApprovalModal("approve");
                    console.log(params.row.dummyId, "selectedrow approve");
                  }}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    marginRight: 5,
                  }}
                >
                  <Tooltip title="Approve" arrow placement="top">
                    <CheckCircleIcon
                      style={{ color: "green", marginLeft: 4 }}
                    />
                  </Tooltip>
                </div>
                <div style={{ fontSize: 20, color: "gray" }}>|</div>
                <div
                  onClick={() => {
                    setSelectedRow(params.row.rowId);
                    HandleApprovalModal("reject");
                    // HandleApprovalModal("reject", params);
                  }}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    marginLeft: 5,
                  }}
                >
                  <Tooltip title="Reject" arrow placement="top">
                    <CancelIcon style={{ color: "red", marginLeft: 4 }} />
                  </Tooltip>
                </div>
              </div>
            ),
          };
        }
        return column;
      });
    } else if (activeSubItem === "Brokerage Modification Status") {
      return BrokerageModificationStatus.map((column) => ({
        ...column,
      }));
    } else if (activeSubItem === "KYC Approval") {
      return BrokerageKyc.map((column) => {
        if (column.field === "remark") {
          return {
            ...column,
            renderCell: (params: any) => (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div
                  onClick={() => {
                    setSelectedRow(params.row.rowId);
                    HandleApprovalModal("approve");
                    // HandleApprovalModal("approve", params);
                    console.log(params.row.rowId, "selectedrow approve");
                  }}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    marginRight: 5,
                  }}
                >
                  <Tooltip title="Approve" arrow placement="top">
                    <CheckCircleIcon
                      style={{ color: "green", marginLeft: 4 }}
                    />
                  </Tooltip>
                </div>
                <div style={{ fontSize: 20, color: "gray" }}>|</div>
                <div
                  onClick={() => {
                    setSelectedRow(params.row.rowId);
                    HandleApprovalModal("reject");
                  }}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    marginLeft: 5,
                  }}
                >
                  <Tooltip title="Reject" arrow placement="top">
                    <CancelIcon style={{ color: "red", marginLeft: 4 }} />
                  </Tooltip>
                </div>
              </div>
            ),
          };
        }
        return column;
      });
    } else if (activeSubItem === "Terminal") {
      return terminalcol.map((column) => ({
        ...column,
      }));
    } else if (activeSubItem === "SLBM ClientHolding") {
      return slbmColumns.map((column) => ({
        ...column,
      }));
    } else if (activeSubItem === "Registration Table") {
      return RegisDetails.map((column) => ({
        ...column,
      }));
    } else if (activeMenu === "Regulatory Announcement") {
      return getRegulatorAnnouncement.map((column) => {
        if (column.field === "CircularFilePath") {
          return {
            ...column,
            renderCell: (params: any) => {
              return (
                <button
                  onClick={
                    () => handleDownload(params.row)
                    // console.log("count6", params.row.CircularFilePath)
                  }
                  style={{
                    color: "white",
                    // textDecoration: "underline",
                    background: "#11395C",
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
        if (column.field === "LKPComments") {
          return {
            ...column,
            renderCell: () => {
              return (
                <button
                  onClick={() => setmodal_center(!modal_center)}
                  style={{
                    color: "white",
                    // textDecoration: "underline",
                    background: "#11395C",
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
                      setSelectedRow(params.row.RowId);
                      HandleApprovalModal("approve");
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
                      setSelectedRow(params.row.RowId);
                      HandleApprovalModal("reject");
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
      return dormantColumns(user_type);
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
      return getClientActivityStatusColumns(handleViewDetails, user_type);
    } else if (activeSubItem === "Pre Trade Proof Upload") {
      return PreProofUploadColumns.map((column) => {
        if (column.field === "file_upload") {
          return {
            ...column,
            renderCell: (params: any) => {
              return (
                <div>
                  <Button
                    onClick={() => {
                      setSelectedRow(params.row);
                      tog_center();
                    }}
                    sx={{
                      padding: "1px 18px",
                    }}
                  >
                    <Tooltip title={"Upload File"} arrow placement="top">
                      <UploadFileIcon
                        style={{ cursor: "pointer", color: "#11395C" }}
                      />
                    </Tooltip>
                  </Button>
                </div>
              );
            },
          };
        }
        return column;
      });
    } else if (activeSubItem === "Pre Trade Report") {
      return preTradeColumns.map((column) => {
        if (column.field === "Uploaded_Document") {
          return {
            ...column,
            renderCell: (params: any) => {
              return (
                <button
                  onClick={() => {
                    handleDownload(params.row);
                    tog_center();
                  }}
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
          };
        } else if (column.field === "status") {
          return {
            ...column,
            renderCell: (params: any) => {
              const getStatusStyles = (status: string) => {
                switch (status.toLowerCase()) {
                  case "approved":
                    return {
                      backgroundColor: "#a5d6a7", // light green
                      color: "#1b5e20",
                      border: "1px solid #81c784",
                    };
                  case "pending":
                    return {
                      backgroundColor: "#fff59d", // light yellow
                      color: "#ff6f00",
                      border: "1px solid #ffe082",
                    };
                  case "rejected":
                    return {
                      backgroundColor: "#ef9a9a", // light red
                      color: "#b71c1c",
                      border: "1px solid #e57373",
                    };
                  default:
                    return {
                      backgroundColor: "#cfd8dc",
                      color: "#263238",
                      border: "1px solid #b0bec5", // neutral border
                    };
                }
              };

              const statusStyles = getStatusStyles(params.row.status);

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
                      ...statusStyles,
                      borderRadius: "999px",
                      padding: "3px 16px",
                      fontSize: "10px",
                      fontWeight: 600,
                      textTransform: "capitalize",
                      whiteSpace: "nowrap",
                      display: "inline-block",
                      textAlign: "center",
                      minWidth: "50px",
                      lineHeight: "1",
                    }}
                  >
                    {params.row.status}
                  </div>
                </div>
              );
            },
          };
        }
        return column;
      });
    } else if (activeSubItem === "Pre Trade Approval") {
      return PreTradeApprovalColumns.map((column) => {
        if (column.field === "Uploaded_Document") {
          return {
            ...column,
            renderCell: (params: any) => {
              return (
                <button
                  onClick={() => {
                    handleDownload(params.row);
                    tog_center();
                  }}
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
          };
        }
        if (column.field === "Actions") {
          return {
            ...column,
            renderCell: (params: any) => (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div
                  onClick={() => {
                    HandleApprovalModal("approve");
                    setSelectedRow(params.row.rowID);
                    console.log(params.row.dummyId, "selectedrow approve");
                  }}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    marginRight: 5,
                  }}
                >
                  <Tooltip title="Approve" arrow placement="top">
                    <CheckCircleIcon
                      style={{ color: "#116E11", marginLeft: 4 }}
                    />
                  </Tooltip>
                </div>
                <div style={{ fontSize: 20, color: "gray" }}>|</div>
                <div
                  onClick={() => {
                    HandleApprovalModal("reject");
                    setSelectedRow(params.row.rowID);
                  }}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    marginLeft: 5,
                  }}
                >
                  <Tooltip title="Reject" arrow placement="top">
                    <CancelIcon style={{ color: "#FF2400", marginLeft: 4 }} />
                  </Tooltip>
                </div>
              </div>
            ),
          };
        }
        return column;
      });
    } else {
      return [];
    }
  };

  const columns = getColumns();

  const handleSearchChange = (query: string) => {
    handleSearchBasedOnInput?.(query);

    if (selectedWidget === "Clients With Ledger Balance") {
      const filtered = commonLedgerData.filter((item: any) =>
        item.ClientName?.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredLedgerDataDropDown(filtered);
      console.log(query, "query", selectedWidget, filtered);
    }
  };

  const commonLedgerData =
    Array.isArray(customLedgerData) && customLedgerData.length > 0
      ? customLedgerData
      : Array.isArray(tradeCWCBData) && tradeCWCBData.length > 0
      ? tradeCWCBData
      : [];
  let rowName =
    selectedWidget === "Clients With Ledger Balance"
      ? commonLedgerData
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
      : T6Data;
  console.log("rowName from userinfo", rowName);

  // const rowHeight = 200;
  // const headerHeight = 80;
  // const padding = 60;
  // const minHeight = activeMenu === "Regulatory Announcement" ? 800 : 200;
  // papper height
  // const OFFSET = 120;
  // const fullAvailableHeight = screenHeight - OFFSET;
  // const calculatedHeight = Math.min(
  //   Math.max(
  //     rowName && rowName.length * rowHeight + headerHeight + padding,
  //     minHeight
  //   ),
  //   fullAvailableHeight
  // );
  useEffect(() => {
    console.log("childData", customLedgerData, selectedWidget);
  }, [customLedgerData, selectedWidget]);

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
          activeSubItem === "RMS Allocation"
            ? ""
            : activeSubItem === "Communication Retrival Entry"
            ? "Are you sure want to delete this entry"
            : activeSubItem === "Communication Retrival Checker"
            ? `Are you sure want to ${action} this entry`
            : activeSubItem === "KYC Approval"
            ? `Are you sure want to ${action} this entry`
            : activeSubItem === "RH Approval"
            ? `Are you sure want to ${action} this entry`
            : activeSubItem === "Pre Trade Approval" && !showDocument
            ? `Are you sure want to ${action} this entry`
            : activeMenu === "Regulatory Announcement"
            ? "Lorem Id malesuada blandit cursus sollicitudin amet nequene quenequ eneque egestas montes.clicked Regulator Announcements check console "
            : activeSubItem === "Pre Trade Proof Upload"
            ? ""
            : activeSubItem === "Pre Trade Report"
            ? ""
            : activeSubItem === "Pre Trade Approval" && showDocument
            ? ""
            : "Are you sure you want to send the email?"
        }
        activeSubItem={activeSubItem}
        isUploadMode={activeSubItem === "Pre Trade Proof Upload" ? true : false}
        handleFileUpload={(selectedRow, file, remark) => {
          console.log("Uploading file:", selectedRow, file);
          if (typeof onFileUpload === "function") {
            onFileUpload(selectedRow, file, remark);
          } else {
            console.warn("onFileUpload is not defined");
          }
        }}
        setShowImg={
          activeSubItem === "Pre Trade Report"
            ? true
            : activeSubItem === "Pre Trade Approval" && showDocument
            ? true
            : false
        }
        previewUrl={previewUrl}
        setSetShowImg={setSetShowImg}
        showDocument={showDocument}
        fileExtension={fileExtension}
      />
      {selectedWidget === "Clients With Ledger Balance" && (
        <DropDown
          tradeData={setTradeData}
          handleValues={handleValues}
          setCustomLedgerData={setCustomLedgerData}
        />
      )}
      {(showSearch || showSearchCustom) && (
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
          height: "72vh",
          // height: `${calculatedHeight}px`,
          width: "100%",
          overflowX: "auto",
          fontFamily: "Public Sans, sans-serif",
        }}
      >
        <DataGrid
          disableRowSelectionOnClick
          rows={
            selectedWidget === "Clients With Ledger Balance"
              ? filteredLedgerDataDropDown.length > 0
                ? filteredLedgerDataDropDown
                : commonLedgerData
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
            row.rowID
              ? row.rowID
              : row.rowId
              ? row.rowId
              : row.clientName
              ? row.clientName
              : row.ClientName
              ? row.ClientName
              : row.RowId
              ? row.RowId
              : row.id
              ? row.id
              : row.dummyId
              ? row.dummyId
              : row.RowID
              ? row.RowID
              : row.BOID
              ? `${row.BOName}-${row.TotalDebit}-${Math.random()}`
              : row.Name
          }
          // Use the correct identifier for rows
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
