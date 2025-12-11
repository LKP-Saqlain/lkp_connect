import { Col, Modal, ModalBody, ModalHeader } from "reactstrap";
import "./modal.css";
import { Button, Box } from "@mui/material";
import CountUp from "react-countup";
import { useEffect, useState } from "react";
import NudgeTable from "../NudgeTable";
import { IoWarningOutline } from "react-icons/io5";

const boxColors = [
  "#E2F8ED",
  "#FFECE7",
  "#E9EBEC",
  "#E8EBFF",
  "#FEE8E9",
  "#DAF7FE",
];

const borderColors = [
  "#cbdfd5",
  "#e5d4cf",
  "#d1d3d4",
  "#d0d3e5",
  "#e4d0d1",
  "#c4dee4",
];

const Nudge = ({
  modal_animationZoom,
  tog_animationZoom,
  dashBoardNudgeData,
  sideBarNudge,
}: any) => {
  const [reportData, setReportData] = useState<
    { rt: string; cc: number; lw?: number }[]
  >([]);
  const [isNudgeTableOpen, setIsNudgeTableOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  // const [filteredData, setFilteredData] = useState<any[]>([]); // used only to store all the data in single array (ARRAY OF ARRAY'S)
  const [filteredData, setFilteredData] = useState<Record<string, any[]>>({});

  useEffect(() => {
    console.log("datass", dashBoardNudgeData);

    const NudgeData = dashBoardNudgeData ? dashBoardNudgeData : sideBarNudge;
    if (NudgeData) {
      const extractedData: {
        rt: string;
        cc: number;
        lw: number;
      }[] = [];

      Object.keys(NudgeData).forEach((tableKey) => {
        NudgeData[tableKey].forEach((entry: any) => {
          if (
            entry.rt &&
            (entry.cc !== undefined ||
              entry.cw !== undefined ||
              entry.rt === "Brokerage Last week vs Current week")
          ) {
            extractedData.push({
              rt: entry.rt,
              cc: entry.cc ?? entry.cw ?? 0,
              lw:
                entry.rt === "Brokerage Last week vs Current week"
                  ? entry.lw
                  : 0,
            });
          }
        });
      });

      setReportData(extractedData);
    }
  }, [dashBoardNudgeData, sideBarNudge]);

  useEffect(() => {
    if (!dashBoardNudgeData) return;

    const groupedData: Record<string, any[]> = {};

    Object.values(dashBoardNudgeData).forEach((table: any) => {
      if (Array.isArray(table)) {
        // Extract rt from the first valid item if available
        const firstItem = table[0];
        const reportType = firstItem?.rt;

        if (reportType === "Brokerage Last week vs Current week") return;

        // Initialize empty array for the report type (even if table is empty)
        if (reportType && !groupedData[reportType]) {
          groupedData[reportType] = [];
        }

        // Check if 0th index has `cc` with a number value
        const shouldSkipFirst = typeof firstItem?.cc === "number";

        table.forEach((item, index) => {
          if (shouldSkipFirst && index === 0) return; // Skip 0th index if cc is a number

          if (item.rt) {
            groupedData[item.rt].push(item);
          }
        });
      }
    });

    setFilteredData(groupedData);
    console.log("Filtered Data:", groupedData);
  }, [dashBoardNudgeData]);

  useEffect(() => {
    if (!sideBarNudge) return;

    const groupedData: Record<string, any[]> = {};

    Object.values(sideBarNudge).forEach((table: any) => {
      if (Array.isArray(table)) {
        // Extract rt from the first valid item if available
        const firstItem = table[0];
        const reportType = firstItem?.rt;

        if (reportType === "Brokerage Last week vs Current week") return;

        // Initialize empty array for the report type (even if table is empty)
        if (reportType && !groupedData[reportType]) {
          groupedData[reportType] = [];
        }

        // Check if 0th index has `cc` with a number value
        const shouldSkipFirst = typeof firstItem?.cc === "number";

        table.forEach((item, index) => {
          if (shouldSkipFirst && index === 0) return; // Skip 0th index if cc is a number

          if (item.rt) {
            groupedData[item.rt].push(item);
          }
        });
      }
    });

    setFilteredData(groupedData);
    console.log("Filtered Data:", groupedData);
  }, [sideBarNudge]);

  const openNudgeTable = (reportName: any) => {
    console.log("reportName", reportName);
    setSelectedReport(reportName);
    setIsNudgeTableOpen(true);
  };

  const closeNudgeTable = () => {
    setIsNudgeTableOpen(false);
    // tog_animationZoom(); // Reopen Nudge modal when closing NudgeTable
  };

  function formatIndianNumber(value: number): string {
    return `${value.toLocaleString("en-IN")}`;
  }

  return (
    <Col lg={12}>
      <Modal
        id="flipModal"
        isOpen={modal_animationZoom}
        toggle={tog_animationZoom}
        modalClassName="zoomIn"
        centered
        style={{
          fontFamily: "Public Sans",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
        contentClassName="custom-modal-content"
      >
        <ModalHeader
          className="modal-title"
          id="flipModalLabel"
          toggle={tog_animationZoom}
          style={{ backgroundColor: "#11395C" }}
        >
          <span style={{ color: "#fff" }}>Actionable Insights</span>
        </ModalHeader>
        <ModalBody
          className="modal-body-custom"
          style={{
            backgroundColor: "#f0f0f0",
            padding: "16px",
            maxWidth: "95vw",
            width: "100%",
          }}
        >
          <Box display="flex" flexWrap="wrap" justifyContent="center" gap={2}>
            {reportData.map((report, index) => (
              <Box
                key={index}
                sx={{
                  backgroundColor: boxColors[index % boxColors.length],
                  borderRadius: 1,
                  padding: 2,
                  flex: "1 1 300px",
                  maxWidth: "100%",
                  cursor: "pointer",
                  border: `2px dashed ${
                    borderColors[index % borderColors.length]
                  }`,
                  boxShadow: "0 8px 8px rgba(0, 0, 0, 0.2)",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <h5 className="fs-15">
                    {report.rt}{" "}
                    {report.cc === 0 && (
                      <IoWarningOutline
                        style={{
                          fontSize: "24px",
                          animation: "blink 1s infinite",
                          color: "#D32F2F",
                        }}
                      />
                    )}
                  </h5>
                  {report.rt === "Brokerage Last week vs Current week" ? (
                    <Box
                      sx={{
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: "#333",
                      }}
                    >
                      <CountUp
                        start={0}
                        end={report.lw ?? 0}
                        formattingFn={formatIndianNumber}
                        style={{
                          fontSize: "24px",
                          fontWeight: "bold",
                        }}
                      />
                      <span className="fs-15"> {"  vs  "}</span>
                      <CountUp
                        start={0}
                        end={report.cc} //this is Current week brokerage
                        formattingFn={formatIndianNumber}
                        style={{
                          fontSize: "24px",
                          fontWeight: "bold",
                        }}
                      />
                    </Box>
                  ) : (
                    <Button
                      sx={{
                        textTransform: "capitalize",
                        fontSize: "12px",
                        alignSelf: "flex-start",
                        fontFamily: "Public Sans",
                      }}
                      onClick={() => openNudgeTable(report.rt)}
                    >
                      View Details
                    </Button>
                  )}
                </Box>

                {report.rt !== "Brokerage Last week vs Current week" && (
                  <Box>
                    <CountUp
                      start={0}
                      end={report.cc}
                      separator=","
                      style={{ fontSize: "24px", fontWeight: "bold" }}
                    />
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </ModalBody>
        <div className="modal-footer">
          <Button
            variant="outlined"
            sx={{
              backgroundColor: "#11395C",
              color: "#fff",
              fontFamily: "Public Sans",
            }}
            onClick={tog_animationZoom}
          >
            Close
          </Button>
        </div>
      </Modal>
      <NudgeTable
        isOpen={isNudgeTableOpen}
        onClose={closeNudgeTable}
        selectedReport={selectedReport}
        filteredData={filteredData}
      />
    </Col>
  );
};

export default Nudge;
