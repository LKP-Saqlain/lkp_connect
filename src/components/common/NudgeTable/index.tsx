import { useEffect, useMemo } from "react";
import { Modal, ModalBody, ModalHeader, Card, CardBody } from "reactstrap";
import { DataGrid } from "@mui/x-data-grid";
import "../../../components/common/table/style.css";
import newClientColumns, {
  clientNotTradedColumns,
  spipRenewalColumns,
  upcomingDormantClientColumns,
} from "../../../helper/tableColumns";

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
      case "Upcoming Dormant Client":
        return upcomingDormantClientColumns;
      case "New Client added in last 5 days":
        return newClientColumns;
      default:
        return []; // If no predefined columns, return an empty array
    }
  }, [selectedReport]);

  return (
    <Modal
      size="xl"
      isOpen={isOpen}
      toggle={onClose}
      style={{ maxWidth: "895px", width: "90%", margin: "40px 0px 0px 245px" }}
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
              height: "70vh",
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
              localeText={{ noRowsLabel: "No Data!" }}
              sx={{
                border: 0,
                fontFamily: '"Public Sans", sans-serif',
                "& .MuiDataGrid-columnHeader": {
                  backgroundColor: "#6C757D",
                  color: "#fff",
                  fontWeight: 500,
                  fontSize: "12px",
                },
                "& .MuiDataGrid-cell": {
                  fontFamily: '"Public Sans", sans-serif',
                  fontSize: "11px",
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
