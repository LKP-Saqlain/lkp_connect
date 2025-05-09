import { useEffect, useMemo } from "react";
import { Modal, ModalBody, ModalHeader, Card, CardBody } from "reactstrap";
import { DataGrid } from "@mui/x-data-grid";
import "../../../components/common/table/style.css";
import {
  clientNotTradedColumns,
  spipRenewalColumns,
  upcomingDormantClientColumns,
  newClientAddFiveDays,
  spipSubscriptionColumns,
} from "../../../helper/tableColumns.tsx";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";

const NudgeTable = ({
  isOpen,
  onClose,
  selectedReport,
  filteredData,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedReport: any;
  filteredData: Record<string, any[]>;
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    console.log("filteredData:", filteredData);
  }, [filteredData]);

  // Get data specific to selectedReport
  const reportData = useMemo(() => {
    return filteredData[selectedReport] || [];
  }, [filteredData, selectedReport]);

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
    <Modal
      size="xl"
      isOpen={isOpen}
      toggle={onClose}
      style={{
        maxWidth: "895px",
        width: "90%",
        marginTop: "30px",
        marginLeft: !isMobile ? "275px" : "0px",
      }}
    >
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
      </ModalBody>
    </Modal>
  );
};

export default NudgeTable;
