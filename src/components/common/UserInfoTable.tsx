import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import DropDown from "./customDropDown";
import {
  ClientCashColumns,
  DormantOverViewColumns,
  T6Columns,
  AmcZoneReportDirect,
  AmcZoneReportIndirect,
  DPTransactionColumns,
  T6OverViewColumns,
  topBirthdays,
  DPDebitRecovery,
  dormantColumns,
  QPayoutColumns,
  communicationColumns,
  CompliancneReport,
  getClientActivityStatusColumns,
  getClientDormantStatus,
  // getAccountDetails,
  getCommChecker,
  getRegulatorAnnouncement,
  getMarketingMaterials,
  terminalcol,
  RegisDetails,
  RegionalHead,
  BrokerageModificationStatus,
  BrokerageKyc,
  slbmColumns,
  PreProofUploadColumns,
  preTradeColumns,
  PreTradeApprovalColumns,
  clientTradingPatternSummarizedColumns,
  clientTradingPatternDetailedColumns,
  ctclUserWiseColumns,
  ctclUserWiseDetailedColumns,
  spipPerformanceReportColumns,
  SPIPOverallPerformanceReport,
  spipSubSciptionDetailColumns,
  ZONEWiseCommissionReport,
  spipClientDetails,
  ClientWiseCommissonReport,
  getApproverOneDetails,
  getApproverTwoDetails,
  unListedTradeColumns,
  ClientPledgeRequest,
  clientAPBrokerageColumns,
  APContestAchievedClients,
  EmpBrokerageAchieved,
  EmpNonBrokerageAchieved,
  ClientExclusionColumns,
  ThirdParty,
  VendorMasterColumns,
  VendorMasterApprovalColumns,
  ThirdPartyStatusReport,
  TpInvoiceUploadColumns,
  TpInvoiceVerifyColumns,
  TpInvoiceMailsColumns,
  TpInvoiceReportColumns,
  RHTopClientsColumns,
  getAPContestReportColumns,
  clientUnpledgeReport,
  EmployeeTargetReportColumns,
  dpDebitMandateColumns,
  ClientMandateReport,
  AmcLifeMembership,
  AmcNonLifeMembership,
  AmcContest,
  AmcLedgerReport,
  clientMISColumns,
  shortfallColumns,
  ageingColumns,
  vendorApprovalColumns,
  t6SellingReportColumns,
  regMasterColumns,
  APTopClientsFields,
  pledgeReportColumns,
} from "../../helper/tableColumns.tsx";
// import { Box, Button } from "@mui/material";
import SearchAppBar from "../../components/common/SearchBar";
import "../../pages/ClientDetails/style.css";
import EmailIcon from "@mui/icons-material/Email";
import CustomModal from "./DPModal";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import CancelIcon from "@mui/icons-material/Cancel";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Tooltip from "@mui/material/Tooltip";
import { Button, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { RootState } from "../../redux/store.ts";
import { useSelector } from "react-redux";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import UploadFileIcon from "@mui/icons-material/UploadFile";
// import { useNavigate } from "react-router-dom";

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
  checkboxSelection?: boolean;
  disableRowSelectionOnClick?: boolean;
  setShowDocument?: any;
  fileExtension?: any;
  reportType?: string;
  onRowSelectionModelChange?: any;
  handleVerifyDetails?: any;
  isBankVerified?: any;
  setIsNudgeTableOpen?: any;
  setSegmentRow?: any;
  setIsBankVerified?: any;
  beneficiaryName?: any;
  handleUpdate?: (data: any) => void;
  onViewAmcDetails?: (row: any) => void;
  handleMTFRow?: (row: any) => void;
  openNudgeTable?: () => void;
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
  checkboxSelection,
  disableRowSelectionOnClick,
  onRowSelectionModelChange,
  setShowDocument,
  fileExtension,
  reportType,
  handleVerifyDetails,
  isBankVerified,
  setIsBankVerified,
  handleUpdate,
  setIsNudgeTableOpen,
  setSegmentRow,
  onViewAmcDetails,
  beneficiaryName,
  handleMTFRow,
  openNudgeTable,
}: SelectedWidgetProps) => {
  const [tradeData, setTradeData] = useState<Trade[]>([]);
  const [totalRows, setTotalRows] = useState<number>(0); // Total rows for pagination
  const [modal_center, setmodal_center] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<any>(null); // Store selected row data
  const [action, setAction] = useState<
    "approve" | "reject" | "delete" | undefined
  >();
  const [customLedgerData, setCustomLedgerData] = useState([]);
  // const [screenHeight, setScreenHeight] = useState(window.innerHeight);
  const [filteredLedgerDataDropDown, setFilteredLedgerDataDropDown] = useState<
    any[]
  >([]);

  const [showSearchCustom, setShowSearchCustom] = useState(showSearch);
  // const navigate = useNavigate();
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
    setShowDocument?.(false);
  };
  const HandleApprovalModal = (actionType: "approve" | "reject" | "delete") => {
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
                      setAction("delete");
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
    }
    // else if (activeSubItem === "Referal Entry Status") {
    //   return getAccountDetails.map((column) => ({
    //     ...column,
    //   }));
    // }
    else if (activeSubItem === "RH Approval") {
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
        if (column.field === "consentfilename") {
          return {
            ...column,
            renderCell: (params: any) => {
              const fileName = params.row?.consentfilename;

              return fileName ? (
                <button
                  onClick={() => handleDownload(params.row)}
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
              ) : (
                "╶─"
              );
            },
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
        if (column.field === "More Details") {
          return {
            ...column,
            renderCell: (params: any) => (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div
                  onClick={() => {
                    setSegmentRow(params.row);
                    setIsNudgeTableOpen(true);
                    console.log(
                      params.row,
                      "selectedrow More Details",
                      setSegmentRow
                    );
                  }}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    marginRight: 5,
                  }}
                >
                  <Tooltip title="More details" arrow placement="top">
                    <ControlPointIcon />
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
    } else if (activeSubItem === "SLBM Client Holding") {
      return slbmColumns.map((column) => ({
        ...column,
      }));
    } else if (activeSubItem === "Registration Table") {
      return RegisDetails.map((column) => ({
        ...column,
      }));
    } else if (activeSubItem === "Marketing Material") {
      return getMarketingMaterials.map((column) => {
        if (column.field === "action") {
          return {
            ...column,
            renderCell: (params: any) => {
              const isDeleted = params.row.isDeleted;

              const handleEdit = () => {
                handleEditClick?.(params.row, true);
                console.log("handleEdit row", params);
              };

              const handleDelete = () => {
                setAction("delete");
                handleDeleteEntry?.(params.row);
                setSelectedRow(params.row);
                tog_center();
                console.log("handleDelete row", params);
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

                  {isDeleted ? (
                    <span
                      style={{
                        color: "red",
                        marginLeft: "10px",
                        cursor: "not-allowed",
                      }}
                    >
                      Deleted
                    </span>
                  ) : (
                    <Tooltip title="Delete" arrow placement="top">
                      <IconButton
                        sx={{ p: 0, ml: 1 }}
                        color="primary"
                        onClick={handleDelete}
                      >
                        <DeleteIcon
                          fontSize="small"
                          sx={{ color: "#11395C" }}
                        />
                      </IconButton>
                    </Tooltip>
                  )}
                </>
              );
            },
          };
        }

        // Return other columns unchanged
        return column;
      });
    } else if (activeMenu === "Regulatory Announcement") {
      return getRegulatorAnnouncement
        .filter((column) => column.field !== "action")
        .map((column) => {
          if (column.field === "CircularFilePath") {
            return {
              ...column,
              renderCell: (params: any) => (
                <Tooltip title="Download" arrow placement="top">
                  <DownloadForOfflineIcon
                    onClick={() => handleDownload(params.row)}
                    sx={{ color: "#11395C", cursor: "pointer" }}
                  />
                </Tooltip>
              ),
            };
          }
          return column;
        });
    } else if (activeSubItem === "Regulatory Announcement") {
      return getRegulatorAnnouncement.map((column) => {
        if (column.field === "CircularFilePath") {
          return {
            ...column,
            renderCell: (params: any) => {
              return (
                <Tooltip title="Download" arrow placement="top">
                  <DownloadForOfflineIcon
                    onClick={() => handleDownload(params.row)}
                    sx={{ color: "#11395C", cursor: "pointer" }}
                  />
                </Tooltip>
              );
            },
          };
        }
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
                      setAction("delete");
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
                    <Tooltip title="Approve" arrow placement="top">
                      <CheckCircleIcon style={{ color: "green" }} />
                    </Tooltip>
                    {/* <span>Approve</span> */}
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
                    <Tooltip title="Reject" arrow placement="top">
                      <CancelIcon style={{ color: "red" }} />
                    </Tooltip>
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
    } else if (activeSubItem === "Client Trading Pattern Report") {
      const selectedColumn =
        reportType === "summarized"
          ? clientTradingPatternSummarizedColumns
          : reportType === "detailed"
          ? clientTradingPatternDetailedColumns
          : [];
      return (
        selectedColumn &&
        selectedColumn.map((column) => ({
          ...column,
        }))
      );
    } else if (activeSubItem === "CTCL Wise Activity Report") {
      const selectedColumn =
        reportType === "summarized"
          ? ctclUserWiseColumns
          : reportType === "detailed"
          ? ctclUserWiseDetailedColumns
          : [];
      return (
        selectedColumn &&
        selectedColumn.map((column) => ({
          ...column,
        }))
      );
    } else if (activeSubItem === "SPIP Performance Dashboard") {
      return spipPerformanceReportColumns.map((column) => ({
        ...column,
      }));
    } else if (activeSubItem === "Client Performance Summary") {
      return SPIPOverallPerformanceReport.map((column) => ({
        ...column,
      }));
    } else if (activeSubItem === "Client Subscription Details") {
      // return spipSubSciptionDetailColumns.map((column) => ({
      //   ...column,
      // }));
      return spipSubSciptionDetailColumns.map((column) => {
        if (column.field === "invoiceDownload") {
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
    } else if (activeSubItem === "Branch-Wise Fees Sharing Report") {
      return ZONEWiseCommissionReport.map((column) => ({
        ...column,
      }));
    } else if (activeSubItem === "Client-Wise Fees Sharing Report") {
      return ClientWiseCommissonReport.map((column) => ({
        ...column,
      }));
    } else if (
      activeSubItem === "Client Details Report" ||
      selectedWidget === "Client Details Report"
    ) {
      // return spipClientDetails.map((column) => ({
      //   ...column,
      // }));
      return spipClientDetails.map((column) => {
        if (column.field === "expiryStatus") {
          return {
            ...column,
            renderCell: (params: any) => {
              const status = params.row.expiryStatus;

              if (status === "E") {
                return (
                  <div
                    onClick={() =>
                      window.open("https://spip.lkp.net.in/Products", "_blank")
                    }
                    style={{
                      backgroundColor: "#11395C",
                      color: "white",
                      borderRadius: "8px",
                      // padding: "0px 2px",
                      cursor: "pointer",
                      display: "inline-block",
                      textAlign: "center",
                      userSelect: "none",
                      fontSize: "9px",
                      width: "110px",
                      // margin: "2px",
                    }}
                  >
                    Subscription Expire
                  </div>
                );
              } else if (status === "A") {
                return (
                  <div
                    style={{
                      backgroundColor: "#4CAF50",
                      color: "white",
                      borderRadius: "8px",
                      padding: "0px 4px",
                      cursor: "default",
                      display: "inline-block",
                      textAlign: "center",
                      userSelect: "none",
                      opacity: 0.85, // optional for "disabled" look
                      fontSize: "9px",
                      width: "110px",
                      // margin: "2px",
                    }}
                  >
                    Ongoing
                  </div>
                );
              } else {
                return null;
              }
            },
          };
        }
        return column;
      });
    } else if (activeSubItem === "Unlisted Shares Approval 1") {
      return getApproverOneDetails.map((column) => {
        if (column.field === "Action") {
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
                      setSelectedRow(params.row.rowID);
                      HandleApprovalModal("approve");
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <Tooltip title="Approve" arrow placement="top">
                      <CheckCircleIcon style={{ color: "green" }} />
                    </Tooltip>
                    {/* <span>Approve</span> */}
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
                      setSelectedRow(params.row.rowID);
                      HandleApprovalModal("reject");
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <Tooltip title="Reject" arrow placement="top">
                      <CancelIcon style={{ color: "red" }} />
                    </Tooltip>
                  </div>
                </div>
              );
            },
          };
        }
        // Return unchanged column if not the 'status' or 'document' field
        return column;
      });
    } else if (activeSubItem === "Unlisted Shares Approval 2") {
      return getApproverTwoDetails.map((column) => {
        if (column.field === "Action") {
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
                      setSelectedRow(params.row.rowID);
                      HandleApprovalModal("approve");
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <Tooltip title="Approve" arrow placement="top">
                      <CheckCircleIcon style={{ color: "green" }} />
                    </Tooltip>
                    {/* <span>Approve</span> */}
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
                      setSelectedRow(params.row.rowID);
                      HandleApprovalModal("reject");
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <Tooltip title="Reject" arrow placement="top">
                      <CancelIcon style={{ color: "red" }} />
                    </Tooltip>
                  </div>
                </div>
              );
            },
          };
        }
        // Return unchanged column if not the 'status' or 'document' field
        return column;
      });
    } else if (
      activeSubItem === "Unlisted Shares Entry" ||
      activeSubItem === "Unlisted Shares Status"
    ) {
      return unListedTradeColumns
        .filter((column) => {
          if (
            activeSubItem === "Unlisted Shares Status" &&
            column.field === "action"
          ) {
            return false;
          }
          return true;
        })
        .map((column) => {
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
                        setAction("delete");
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
          } else if (column.field === "status") {
            return {
              ...column,
              renderCell: (params: any) => {
                const status = params.value?.toLowerCase() || "";

                let backgroundColor = "#cfd8dc";
                let color = "#263238";
                let border = "1px solid #b0bec5";

                if (status.includes("approved")) {
                  backgroundColor = "#a5d6a7";
                  color = "#1b5e20";
                  border = "1px solid #81c784";
                } else if (status.includes("pending with approver 2")) {
                  backgroundColor = "#FFF4E5";
                  color = "#FF9800";
                  border = "1px solid #FFB74D";
                } else if (status.includes("pending")) {
                  backgroundColor = "#FFF4E5";
                  color = "#FF9800";
                  border = "1px solid #FFB74D";
                } else if (
                  status.includes("rejected") ||
                  status.includes("reject")
                ) {
                  backgroundColor = "#ef9a9a";
                  color = "#b71c1c";
                  border = "1px solid #e57373";
                }

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
                        backgroundColor,
                        color,
                        border,
                        borderRadius: "999px",
                        padding: "3px 6px",
                        fontSize: "11px",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                        textAlign: "center",
                        minWidth: "160px",
                        lineHeight: "1",
                      }}
                    >
                      {params.value}
                    </div>
                  </div>
                );
              },
            };
          }

          // Return other columns unchanged
          return column;
        });
    } else if (activeMenu === "Client Request") {
      return ClientPledgeRequest.map((column) => {
        if (column.field === "encryptedCode") {
          return {
            ...column,
            renderCell: (params: any) => {
              return (
                <div
                  onClick={() => {
                    handleDownload(params.row);
                  }}
                >
                  <OpenInNewIcon
                    style={{ color: "#11395C", cursor: "pointer" }}
                  />
                </div>
              );
            },
          };
        }
        // Return unchanged column if not the 'status' or 'document' field
        return column;
      });
    } else if (activeMenu === "AP Contest Achieved Brokerage") {
      return clientAPBrokerageColumns.map((column) => ({
        ...column,
      }));
    } else if (activeMenu === "LeaderBoard") {
      return APTopClientsFields.map((column) => ({
        ...column,
      }));
    } else if (
      activeMenu === "AP Contest Achieved Clients" ||
      activeMenu === "Employee Clients Achieved"
    ) {
      return APContestAchievedClients.map((column) => ({
        ...column,
      }));
    } else if (activeMenu === "Employee Brokerage Achieved") {
      return EmpBrokerageAchieved.map((column) => ({
        ...column,
      }));
    } else if (selectedWidget === "Lifetime Membership") {
      return AmcLifeMembership.map((column) => ({
        ...column,
      }));
    } else if (selectedWidget === "Contest Earned") {
      return AmcContest.map((column) => ({
        ...column,
      }));
    } else if (selectedWidget === "Non-Lifetime Membership") {
      return AmcNonLifeMembership.map((column) => {
        if (column.field === "schemeStatus") {
          return {
            ...column,
            renderCell: (params: any) => {
              const status = params?.row?.schemeStatus;

              return (
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <div
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      marginRight: 5,
                    }}
                  >
                    {status === "Submitted" ? (
                      // 🚫 Not clickable
                      <span
                        style={{
                          color: "#003366",
                          fontWeight: 600,
                          cursor: "default",
                        }}
                      >
                        {status}
                      </span>
                    ) : status === "eSign Pending" ? (
                      // ✅ Clickable eSign Pending
                      <Tooltip title="eSign Pending" arrow placement="top">
                        <span
                          onClick={() => {
                            console.log(
                              "Clicked eSign Pending row:",
                              params.row
                            );
                            if (onViewAmcDetails) onViewAmcDetails(params.row);
                          }}
                          style={{
                            cursor: "pointer",
                            color: "#11395C",
                            textDecoration: "underline",
                            fontWeight: 600,
                          }}
                        >
                          {status}
                        </span>
                      </Tooltip>
                    ) : (
                      // Default: show OpenInNew icon for other statuses
                      <Tooltip
                        title="Lifetime AMC scheme"
                        arrow
                        placement="top"
                      >
                        <OpenInNewIcon
                          style={{ cursor: "pointer", color: "#11395C" }}
                          onClick={() => {
                            console.log("Clicked row:", params.row);
                            if (onViewAmcDetails) onViewAmcDetails(params.row);
                          }}
                        />
                      </Tooltip>
                    )}
                  </div>
                </div>
              );
            },
          };
        }

        return column;
      });
    } else if (activeMenu === "Employee Non-Brokerage Achieved") {
      return EmpNonBrokerageAchieved.map((column) => ({
        ...column,
      }));
    } else if (activeSubItem === "Client Exclusion") {
      return ClientExclusionColumns.map((column) => {
        if (column.field === "action") {
          return {
            ...column,
            renderCell: (params: any) => {
              const isDeleted = params.row.isDeleted;

              const handleDelete = () => {
                if (!isDeleted) {
                  setAction("delete");
                  handleDeleteEntry?.(params.row);
                  setSelectedRow(params.row);
                  tog_center();
                }
              };

              return (
                <>
                  <Tooltip
                    title={isDeleted ? "Already deleted" : "Delete"}
                    arrow
                    placement="top"
                  >
                    <span>
                      <IconButton
                        sx={{ p: 0, ml: 1 }}
                        color="primary"
                        onClick={handleDelete}
                        disabled={isDeleted}
                      >
                        <DeleteIcon
                          fontSize="small"
                          sx={{ color: isDeleted ? "red" : "#11395C" }}
                        />
                      </IconButton>
                    </span>
                  </Tooltip>
                </>
              );
            },
          };
        }
        return column;
      });
    } else if (activeSubItem === "RHDashboardTop10Clients") {
      return RHTopClientsColumns.map((column) => ({
        ...column,
      }));
    } else if (activeSubItem === "DP AMC Ledger Debit") {
      return AmcLedgerReport.map((column) => ({
        ...column,
      }));
    } else if (activeSubItem === "Third Party Vendor Master") {
      return ThirdParty.map((column) => {
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
                      setAction("delete");
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
    } else if (activeSubItem === "Third Party Vendor Approval") {
      return ThirdParty.map((column) => {
        if (column.field === "action") {
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
                      setSelectedRow(params.row.rowId);
                      HandleApprovalModal("approve");
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <Tooltip title="Approve" arrow placement="top">
                      <CheckCircleIcon style={{ color: "green" }} />
                    </Tooltip>
                    {/* <span>Approve</span> */}
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
                      setSelectedRow(params.row.rowId);
                      HandleApprovalModal("reject");
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <Tooltip title="Reject" arrow placement="top">
                      <CancelIcon style={{ color: "red" }} />
                    </Tooltip>
                  </div>
                </div>
              );
            },
          };
        }
        return column;
      });
    } else if (activeSubItem === "Status Report") {
      return ThirdPartyStatusReport.map((column) => ({
        ...column,
      }));
    } else if (activeSubItem === "Vendor Creation") {
      return VendorMasterColumns.map((column) => {
        if (column.field === "actions") {
          return {
            ...column,
            renderCell: (params: any) => {
              const isDeleted = params.row.isDeleted;
              const isApproved = params.row.accApproval === "A";

              // ✅ If approved, hide the entire actions (no edit/delete)
              if (isApproved) {
                return <span style={{ color: "gray" }}>--</span>;
              }

              const handleEdit = () => {
                setSelectedRow(params.row);
                handleEditClick?.(params.row, true);
              };

              const handleDelete = () => {
                setAction("delete");
                handleDeleteEntry?.(params.row);
                setSelectedRow(params.row);
                tog_center();
              };

              return (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <Tooltip title="Edit" arrow placement="top">
                    <IconButton
                      sx={{ p: 0 }}
                      color="primary"
                      onClick={handleEdit}
                    >
                      <EditIcon fontSize="small" sx={{ color: "#11395C" }} />
                    </IconButton>
                  </Tooltip>

                  {isDeleted ? (
                    <span
                      style={{
                        color: "red",
                        fontSize: "0.85rem",
                        cursor: "default",
                      }}
                    >
                      Deleted
                    </span>
                  ) : (
                    <Tooltip title="Delete" arrow placement="top">
                      <IconButton
                        sx={{ p: 0 }}
                        color="primary"
                        onClick={handleDelete}
                      >
                        <DeleteIcon
                          fontSize="small"
                          sx={{ color: "#11395C" }}
                        />
                      </IconButton>
                    </Tooltip>
                  )}
                </div>
              );
            },
          };
        }

        return column;
      });
    } else if (activeSubItem === "Vendor Approval") {
      // return VendorMasterColumns.map((column) => ({
      //   ...column,
      // }));
      return VendorMasterApprovalColumns.map((column) => {
        if (column.field === "actions") {
          return {
            ...column,
            renderCell: (params: any) => {
              // ✅ Check condition
              if (params.row.accApproval === "A") {
                // Already approved — no actions
                return <span style={{ color: "gray" }}>--</span>;
              }

              // ✅ Show Approve / Reject only if not approved
              return (
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <div
                    onClick={() => {
                      console.log("rowTest", params.row);
                      setSelectedRow(params.row);
                      HandleApprovalModal("approve");
                      console.log(params.row.vendorId, "selectedrow approve");
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
                      setSelectedRow(params.row);
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
              );
            },
          };
        }
        if (column.field === "accRemark") {
          return {
            ...column,
            renderCell: (params: any) => {
              if (params.row.accApproval === "A" || "R") {
                return (
                  <span style={{ color: "#11395C", fontWeight: 500 }}>
                    {params.row.accRemark || "--"}
                  </span>
                );
              }
              return <span>--</span>;
            },
          };
        }

        if (column.field === "tdsPath") {
          return {
            ...column,
            renderCell: (params: any) => {
              const hasTdsPath =
                params.row?.tdsPath && params.row.tdsPath.trim() !== "";

              if (!hasTdsPath) {
                return <span>--</span>;
              }
              return (
                <button
                  onClick={() => {
                    handleDownload(params.row, "TDS"); // This will trigger the download function
                  }}
                  style={{
                    color: "#11395C",
                    textDecoration: "underline",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <Tooltip title="Download File" arrow placement="top">
                    <DownloadForOfflineIcon />
                  </Tooltip>
                </button>
              );
            },
          };
        }
        if (column.field === "msmePath") {
          return {
            ...column,
            renderCell: (params: any) => {
              return (
                <button
                  onClick={() => {
                    handleDownload(params.row, "MSME"); // This will trigger the download function
                  }}
                  style={{
                    color: "#11395C",
                    textDecoration: "underline",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <Tooltip title="Download File" arrow placement="top">
                    <DownloadForOfflineIcon />
                  </Tooltip>
                </button>
              );
            },
          };
        }
        if (column.field === "bankDoc") {
          return {
            ...column,
            renderCell: (params: any) => {
              return (
                <button
                  onClick={() => {
                    handleDownload(params.row, "BANK"); // This will trigger the download function
                  }}
                  style={{
                    color: "#11395C",
                    textDecoration: "underline",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <Tooltip title="Download File" arrow placement="top">
                    <DownloadForOfflineIcon />
                  </Tooltip>
                </button>
              );
            },
          };
        }
        if (column.field === "panDocument") {
          return {
            ...column,
            renderCell: (params: any) => {
              return (
                <button
                  onClick={() => {
                    handleDownload(params.row, "PAN"); // This will trigger the download function
                  }}
                  style={{
                    color: "#11395C",
                    textDecoration: "underline",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <Tooltip title="Download File" arrow placement="top">
                    <DownloadForOfflineIcon />
                  </Tooltip>
                </button>
              );
            },
          };
        }

        return column;
      });
    } else if (activeSubItem === "Third Party Invoice Upload") {
      return TpInvoiceUploadColumns.map((column) => ({
        ...column,
      }));
    } else if (activeSubItem === "Third Party Invoice Verify") {
      return TpInvoiceVerifyColumns.map((column) => {
        if (column.field === "action") {
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
                      setSelectedRow(params.row.rowId);
                      HandleApprovalModal("approve");
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <Tooltip title="Approve" arrow placement="top">
                      <CheckCircleIcon style={{ color: "green" }} />
                    </Tooltip>
                    {/* <span>Approve</span> */}
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
                      setSelectedRow(params.row.rowId);
                      HandleApprovalModal("reject");
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <Tooltip title="Reject" arrow placement="top">
                      <CancelIcon style={{ color: "red" }} />
                    </Tooltip>
                  </div>
                </div>
              );
            },
          };
        }
        if (column.field === "delete") {
          return {
            ...column,
            renderCell: (params: any) => {
              const isDeleted = params.row.isDeleted;

              const handleDelete = () => {
                if (!isDeleted) {
                  handleDeleteEntry?.(params.row);
                  setSelectedRow(params.row);
                  tog_center();
                }
              };

              return (
                <>
                  <Tooltip
                    title={isDeleted ? "Already deleted" : "Delete"}
                    arrow
                    placement="top"
                  >
                    <span>
                      <IconButton
                        sx={{ p: 0, ml: 1 }}
                        color="primary"
                        onClick={() => {
                          setAction("delete");
                          handleDelete();
                        }}
                        disabled={isDeleted}
                      >
                        <DeleteIcon
                          fontSize="small"
                          sx={{ color: isDeleted ? "red" : "#11395C" }}
                        />
                      </IconButton>
                    </span>
                  </Tooltip>
                </>
              );
            },
          };
        }
        return column;
      });
    } else if (activeSubItem === "Third Party Invoice Mail") {
      return TpInvoiceMailsColumns.map((column) => {
        if (column.field === "generate")
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
        return column;
      });
    } else if (activeSubItem === "Third Party Invoice Report") {
      return TpInvoiceReportColumns.map((column) => ({ ...column }));
    } else if (activeSubItem === "Employee Target Report") {
      return EmployeeTargetReportColumns.map((column) => ({ ...column }));
    } else if (activeSubItem === "RHDashboardTop10Clients") {
      return RHTopClientsColumns.map((column) => ({
        ...column,
      }));
    } else if (activeSubItem === "RHDashboardTop10Clients") {
      return RHTopClientsColumns.map((column) => ({
        ...column,
      }));
    } else if (activeSubItem === "Partner Contest Report") {
      return getAPContestReportColumns.map((column) => {
        if (column.field === "apCode") {
          return {
            ...column,
            renderCell: (params: any) => {
              const handleClick = () => {
                setSelectedRow(params.row);
                tog_center();
              };

              return (
                <span
                  style={{
                    color: "#1976d2",
                    cursor: "pointer",
                    // textDecoration: "underline",
                  }}
                  onClick={handleClick}
                >
                  {params.value}
                </span>
              );
            },
          };
        }
        return column;
      });
    } else if (activeSubItem === "Unpledge Report") {
      return clientUnpledgeReport.map((column) => ({
        ...column,
      }));
    } else if (activeSubItem === "mandateCall") {
      return dpDebitMandateColumns.map((column) => {
        if (column.field === "Action") {
          return {
            ...column,
            renderCell: (params: any) => {
              return (
                <div style={{ display: "flex", gap: "6px" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      borderRadius: "8px",
                      textTransform: "none",
                      fontSize: "10px",
                      height: "18px",
                      padding: "2px 4px",
                      marginTop: "4px",
                    }}
                    onClick={() => {
                      console.log("Update clicked", params.row);
                      handleUpdate?.(params.row);
                    }}
                  >
                    Update
                  </Button>

                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    sx={{
                      borderRadius: "8px",
                      textTransform: "none",
                      fontSize: "10px",
                      height: "19px",
                      padding: "2px 4px",
                      marginTop: "4px",
                    }}
                    onClick={() => {
                      console.log("Revoke clicked", params.row);
                      setSelectedRow(params.row);
                      tog_center();
                    }}
                  >
                    Revoke
                  </Button>
                </div>
              );
            },
          };
        }
        return column;
      });
    } else if (activeSubItem === "Dp Debit Collection") {
      return ClientMandateReport.map((column) => ({
        ...column,
      }));
    } else if (activeSubItem === "SPIP Client MIS") {
      return clientMISColumns.map((column) => ({
        ...column,
      }));
    } else if (activeSubItem === "MTF Stock Ageing Report") {
      return shortfallColumns.map((column) => ({
        ...column,
      }));
    } else if (activeSubItem === "MTF Ageing Report") {
      return ageingColumns.map((column) => {
        if (column.field === "clientcode") {
          return {
            ...column,
            renderCell: (params: any) => {
              return (
                <span
                  style={{
                    color: "#1976d2",
                    cursor: "pointer",
                    // textDecoration: "underline",
                  }}
                  onClick={() => {
                    handleMTFRow?.(params?.row);
                    openNudgeTable?.();
                  }}
                >
                  {params.value}
                </span>
              );
            },
          };
        }
        return column;
      });
    } else if (activeSubItem === "Vendor Details Report") {
      return vendorApprovalColumns.map((column) => ({
        ...column,
      }));
    } else if (activeSubItem === "T6 Selling Report") {
      return t6SellingReportColumns.map((column) => ({
        ...column,
      }));
    } else if (activeSubItem === "REG Master Records") {
      return regMasterColumns.map((column) => ({
        ...column,
      }));
    } else if (activeSubItem === "Client DP AMC Report direct") {
      return AmcZoneReportDirect.map((column) => {
        if (column.field === "submitted") {
          return {
            ...column,
            renderCell: (params: any) => {
              // Otherwise, show the download button
              return (
                <button
                  onClick={() => {
                    handleDownload(params.row, column.field); // trigger download
                  }}
                  style={{
                    color: "#11395C",
                    textDecoration: "underline",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {params.row.submitted}
                </button>
              );
            },
          };
        }
        if (column.field === "completed") {
          return {
            ...column,
            renderCell: (params: any) => {
              // Otherwise, show the download button
              return (
                <button
                  onClick={() => {
                    handleDownload(params.row, column.field); // trigger download
                  }}
                  style={{
                    color: "#11395C",
                    textDecoration: "underline",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {params.row.completed}
                </button>
              );
            },
          };
        }
        // Return unchanged column if not the 'status' or 'document' field
        return column;
      });
    } else if (activeSubItem === "Client DP AMC Report indirect") {
      return AmcZoneReportIndirect.map((column) => {
        if (column.field === "submitted") {
          return {
            ...column,
            renderCell: (params: any) => {
              // Otherwise, show the download button
              return (
                <button
                  onClick={() => {
                    handleDownload(params.row, column.field); // trigger download
                  }}
                  style={{
                    color: "#11395C",
                    textDecoration: "underline",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {params.row.submitted}
                </button>
              );
            },
          };
        }
        if (column.field === "completed") {
          return {
            ...column,
            renderCell: (params: any) => {
              // Otherwise, show the download button
              return (
                <button
                  onClick={() => {
                    handleDownload(params.row, column.field); // trigger download
                  }}
                  style={{
                    color: "#11395C",
                    textDecoration: "underline",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {params.row.completed}
                </button>
              );
            },
          };
        }
        // Return unchanged column if not the 'status' or 'document' field
        return column;
      });
    } else if (activeSubItem === "DP AMC Transaction") {
      return DPTransactionColumns.map((column) => {
        if (column.field === "downloadAMC") {
          return {
            ...column,
            renderCell: (params: any) => {
              const status = params.row?.schemeStatus;

              // Show dash if EsignPending or null/undefined
              if (status === "Submitted" || status === "Completed") {
                // Otherwise, show the download button
                return (
                  <button
                    onClick={() => {
                      handleDownload(params.row); // trigger download
                      console.log(
                        "DP AMC Transaction row",
                        params.row.schemeStatus
                      );
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
              } else {
                return <>—</>;
              }
            },
          };
        }
        // Return unchanged column if not the 'status' or 'document' field
        return column;
      });
    } else if (activeSubItem === "Pledge Request Report") {
      return pledgeReportColumns.map((column) => ({
        ...column,
      }));
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

  useEffect(() => {
    console.log("childData", customLedgerData, selectedWidget);
  }, [customLedgerData, selectedWidget]);

  let Msg = "";

  const deleteItems = [
    "Regulatory Announcement",
    "Unlisted Shares Entry",
    "Communication Retrival Entry",
    "Marketing Material",
    "Client Exclusion",
    "Third Party Vendor Master",
    "Third Party Invoice Verify", // delete message also for this
    "Vendor Creation",
  ];

  const actionItems = [
    "Communication Retrival Checker",
    "KYC Approval",
    "RH Approval",
    "Unlisted Shares Approval 1",
    "Unlisted Shares Approval 2",
    "Third Party Vendor Approval",
    "Third Party Invoice Verify", // approve/reject message also for this
    "Vendor Approval",
  ];

  if (activeSubItem === "RMS Allocation") {
    Msg = "";
  } else if (activeSubItem === "Third Party Invoice Verify") {
    if (action === "delete") {
      Msg = "Are you sure want to delete this entry";
    } else if (action === "approve" || action === "reject") {
      Msg = `Are you sure want to ${action} this entry`;
    } else {
      Msg = "";
    }
  } else if (deleteItems.includes(activeSubItem)) {
    Msg = "Are you sure want to delete this entry";
  } else if (actionItems.includes(activeSubItem)) {
    Msg = `Are you sure want to ${action} this entry`;
  } else if (activeSubItem === "Pre Trade Approval" && !showDocument) {
    Msg = `Are you sure want to ${action} this entry`;
  } else if (activeSubItem === "mandateCall") {
    Msg = "Are you sure want to Revoke?";
  } else if (
    activeSubItem === "Pre Trade Proof Upload" ||
    activeSubItem === "Pre Trade Report" ||
    (activeSubItem === "Unlisted Shares Approval 1" && action === "approve") ||
    (activeSubItem === "Pre Trade Approval" && showDocument)
  ) {
    Msg = "";
  } else {
    Msg = "Are you sure you want to send the email?";
  }
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
        Msg={Msg}
        activeSubItem={activeSubItem}
        isUploadMode={activeSubItem === "Pre Trade Proof Upload" ? true : false}
        isDropUpload={
          activeSubItem === "Unlisted Shares Approval 1" && action === "approve"
        }
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
        isPartnerContest={
          activeSubItem === "Partner Contest Report" ? true : false
        }
        handleVerifyDetails={handleVerifyDetails}
        isBankVerified={isBankVerified}
        beneficiaryName={beneficiaryName}
        setIsBankVerified={setIsBankVerified}
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
          height: selectedWidget === "Client Details Report" ? "200px" : "72vh",
          // height: `${calculatedHeight}px`,
          width: "100%",
          overflowX: "auto",
          fontFamily: "Public Sans, sans-serif",
        }}
      >
        <DataGrid
          disableRowSelectionOnClick={disableRowSelectionOnClick}
          checkboxSelection={checkboxSelection}
          onRowSelectionModelChange={onRowSelectionModelChange}
          rows={
            selectedWidget === "Clients With Ledger Balance"
              ? filteredLedgerDataDropDown.length > 0
                ? filteredLedgerDataDropDown
                : commonLedgerData
              : selectedWidget === "Total Clients"
              ? T6Data
              : // : selectedWidget === "Active Clients"
              // ? activeGroupedClients
              // : selectedWidget === "Inactive Clients"
              // ? inactiveGroupedClients
              selectedWidget === "Active Clients" &&
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
              : row.id
              ? row.id
              : row.rowId
              ? row.rowId
              : row.ClientCode
              ? row.ClientCode
              : row.clientCode
              ? row.clientCode
              : row.ctermcode
              ? row.ctermcode
              : row.RowId
              ? row.RowId
              : row.dummyId
              ? row.dummyId
              : row.RowID
              ? row.RowID
              : row.ClientName
              ? row.ClientName
              : row.clientName
              ? row.clientName
              : row.BOID
              ? `${row.BOName}-${row.TotalDebit}-${Math.random()}`
              : row.Name
          }
          // Use the correct identifier for rows
          getRowClassName={(params) => {
            if (customCss) {
              if (params.row.isDuplicate) return "duplicate-row";
            }
            return params.indexRelativeToCurrentPage % 2 === 0
              ? "even-row"
              : "odd-row";
          }}
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
            ...(customCss && {
              "& .duplicate-row": {
                backgroundColor: "#ffadb0 !important", // light red
              },
            }),
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
