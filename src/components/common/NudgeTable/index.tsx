import { useEffect, useMemo, useState } from "react";
import {
  Modal,
  ModalBody,
  ModalHeader,
  Card,
  CardBody,
  Button,
} from "reactstrap";
import { DataGrid } from "@mui/x-data-grid";
import "../../../components/common/table/style.css";
import {
  clientNotTradedColumns,
  spipRenewalColumns,
  upcomingDormantClientColumns,
  newClientAddFiveDays,
  spipSubscriptionColumns,
  // getBrokerageKycDetails,
} from "../../../helper/tableColumns.tsx";
import { Stack, TextField } from "@mui/material";
// import { useTheme } from "@mui/material/styles";
// import { useMediaQuery } from "@mui/material";

const NudgeTable = ({
  isOpen,
  onClose,
  selectedReport,
  filteredData,
  singleData,
  handleAction,
  handleDownload,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedReport: any;
  filteredData?: Record<string, any[]>;
  singleData?: any;
  handleAction?: (payload: {
    row: any;
    remarks: string;
    action: "A" | "R";
  }) => void;
  handleDownload?: (row: any) => void;
}) => {
  // const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [remarks, setRemarks] = useState<string>("");
  const [showValidation, setShowValidation] = useState(false); // for red textfield when empty

  const handleActionClick = (actionType: "A" | "R") => {
    // Validation: remarks should not be empty
    if (!remarks.trim()) {
      setShowValidation(true);
      return;
    }
    // Clear error before proceeding
    setShowValidation(false);
    // Proceed with parent callback
    handleAction?.({
      row: singleData,
      remarks: remarks.trim(),
      action: actionType,
    });

    console.log(singleData, remarks, actionType, "from nudge");

    // Optional: reset input
    setRemarks("");
  };

  useEffect(() => {
    console.log("filteredData:", filteredData);
    setShowValidation(false);
  }, [filteredData, isOpen]);

  // Get data specific to selectedReport
  const reportData = useMemo(() => {
    if (singleData && Array.isArray(singleData)) {
      return singleData;
    }
    return filteredData?.[selectedReport] || [];
  }, [filteredData, singleData, selectedReport]);

  // Select columns based on the selectedReport
  const columns = useMemo(() => {
    switch (selectedReport) {
      case "Client not traded since last 10 days":
        return clientNotTradedColumns;
      case "SPIP Renewal in next 30 days":
        return spipRenewalColumns;
      case "New Client added in last 5 days":
        return newClientAddFiveDays;
      case "Upcoming Dormant Client":
        return upcomingDormantClientColumns;
      case "SPIP Subscription in last 10 days":
        return spipSubscriptionColumns;
      // case "More details about segment":
      //   return getBrokerageKycDetails(handleDownload ?? (() => {}));

      default:
        return []; // If no predefined columns, return an empty array
    }
  }, [selectedReport]);

  const rowHeight = 40;
  const headerHeight = 56;
  const padding = 40;
  const minHeight = 200;
  const calculatedHeight = Math.min(
    Math.max(reportData.length * rowHeight + headerHeight + padding, minHeight),
    400
  );

  return (
    <Modal size="xl" isOpen={isOpen} toggle={onClose} centered>
      <ModalHeader
        className="modal-title"
        id="myExtraLargeModalLabel"
        toggle={onClose}
      >
        {selectedReport}
      </ModalHeader>
      <ModalBody>
        <Card className="main-card">
          <CardBody
            className="main-card-body"
            style={{
              overflow: "hidden",
              height: `${calculatedHeight}px`,
              width: "100%",
              overflowX: "auto",
              fontFamily: "Public Sans, sans-serif",
              padding: "10px",
            }}
          >
            <DataGrid
              rows={reportData.map((row, index) => ({ id: index, ...row }))}
              columns={columns}
              pageSizeOptions={[0, 5]}
              rowHeight={30}
              localeText={{ noRowsLabel: "No Records!" }}
              sx={{
                border: 0,
                fontFamily: '"Public Sans", sans-serif',
                "& .MuiDataGrid-columnHeader": {
                  backgroundColor: "#11395C",
                  color: "#fff",
                  fontWeight: 500,
                  fontSize: "12px",
                },
                "& .MuiDataGrid-cell": {
                  fontFamily: '"Public Sans", sans-serif',
                  fontSize: "12px",
                  color: "#000",
                  border: "1px solid #D3D3D3 !important",
                },
              }}
              getRowClassName={(params) =>
                params.indexRelativeToCurrentPage % 2 === 0
                  ? "even-row"
                  : "odd-row"
              }
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
          </CardBody>
        </Card>
        {selectedReport === "More details about segment" && (
          <div style={{ marginTop: "20px" }}>
            <Stack spacing={2} direction="column">
              <TextField
                label="Remarks"
                value={remarks}
                onChange={(e) => {
                  setRemarks(e.target.value);
                  if (e.target.value.trim()) {
                    setShowValidation(false); // live remove error
                  }
                }}
                error={showValidation && !remarks.trim()}
                fullWidth
              />
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  style={{
                    backgroundColor: "#EE4B2B",
                    borderColor: "#EE4B2B",
                    color: "#fff",
                  }}
                  onClick={() => handleActionClick("R")}
                >
                  Reject
                </Button>
                <Button
                  style={{ color: "white", backgroundColor: "#11395C" }}
                  onClick={() => {
                    handleActionClick("A");
                  }}
                >
                  Approve
                </Button>
              </Stack>
            </Stack>
          </div>
        )}
      </ModalBody>
    </Modal>
  );
};

export default NudgeTable;
