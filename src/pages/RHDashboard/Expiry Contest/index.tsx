import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import { RootState, AppDispatch } from "../../../redux/store";
import { apiServices } from "../../../services";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import RefreshIcon from "@mui/icons-material/Refresh";
import DownloadIcon from "@mui/icons-material/Download";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import DataTable from "../../../components/common/UserInfoTable";
import {
  expiryContestCriteriaRows,
  RHexpiryContestRewardRows,
} from "../../../helper/commmon";
import ComDropDown from "../../../components/common/Dropdown/commonDropdown";
import { Button } from "@mui/material";
import { employeesContestProgress } from "../../../helper/tableColumns";

const Expiry = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user_id, zoneName, accessType } = useSelector(
    (state: RootState) => state.AuthUser?.data?.data
  );
  const [employeeData, setEmployeeData] = useState([]);
  const [zoneData, setZoneData] = useState([]);
  const [selectedZone, setSelectedZone] = useState<string>(zoneName);
  const [lastDate, setLastDate] = useState("");

  useEffect(() => {
    handleExpiryData();
    const intervalId = setInterval(() => {
      handleExpiryData();
    }, 15 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [selectedZone]);

  const handleExpiryData = () => {
    const payload = {
      user_id: user_id,
      zone: selectedZone ?? zoneName,
    };
    dispatch(showLoader("Fetching Client Code..."));
    apiServices
      .GetZoneExpiryDashBoardData(payload)
      .then((response: any) => {
        const rawData = response?.data?.data || {};

        console.log("expiry Response:", rawData);

        const zoneSummary = (rawData.zoneSummary || []).map(
          (item: any, index: number) => ({
            id: index + 1,
            ...item,
          })
        );

        const empWiseData = (rawData.empWiseData || []).map(
          (item: any, index: number) => ({
            id: index + 1,
            ...item,
          })
        );
        let lastUpdatedDate = zoneSummary[0]?.UpdatedOn;
        setLastDate(lastUpdatedDate);
        setZoneData(zoneSummary);
        setEmployeeData(empWiseData);
      })

      .catch((error: any) => {
        console.error("PhysicalClientInfo Error:", error);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  const exportToExcel = (data: any[], fileName: string) => {
    const orderedData = data.map((row) => {
      const orderedRow: any = {};
      employeesContestProgress.forEach((col: any) => {
        orderedRow[col.headerName as string] = row[col.field as string];
      });
      return orderedRow;
    });

    const worksheet = XLSX.utils.json_to_sheet(orderedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employee Report");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `${fileName}.xlsx`);
  };

  const handleZoneChange = (zone: any) => {
    console.log("Selected zone:", zone);
    setSelectedZone(zone?.value || "all"); // update selected zone value here
  };

  return (
    <div className="page-content page-view">
      <div className="container-fluid">
        {accessType === "ALL" && (
          <Card style={{ marginTop: "2rem", padding: "1rem" }}>
            <ComDropDown onZoneChange={handleZoneChange} />
          </Card>
        )}
        <Row className="row-font">
          <Col lg={12}>
            <Card
              style={{
                minHeight: "80vh",
                borderRadius: "15px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
              }}
            >
              <CardHeader
                style={{
                  borderRadius: "15px 15px 0 0",
                  backgroundColor: "#fff",
                  padding: "0.6rem 1rem",
                }}
              >
                <div className="d-flex align-items-center justify-content-between">
                  <h5 className="mb-0">Expiry Day Contest</h5>
                  <div>
                    <span>Last Updated on: {lastDate}</span>
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{
                        textTransform: "none",
                        borderRadius: "16px",
                        fontSize: "0.8rem",
                        padding: "2px 8px",
                        color: "#11395C",
                        ml: 2,
                      }}
                      onClick={handleExpiryData}
                    >
                      Refresh <RefreshIcon sx={{ fontSize: "1.1rem" }} />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardBody>
                {/* Contest Criteria & Rewards */}
                <h6 className="card-title mb-3">
                  Contest Criteria and Rewards
                </h6>

                <Row className="mb-4">
                  {/* Criteria Table */}
                  <Col lg={6} md={12}>
                    <DataTable
                      activeMenu={"expiryContestCriteria"}
                      T6Data={expiryContestCriteriaRows}
                      selectedWidget="Criteria and Rewards"
                      customHide={true}
                    />
                  </Col>

                  {/* Rewards Table */}
                  <Col lg={6} md={12}>
                    <DataTable
                      activeMenu={"RHexpiryContestReward"}
                      T6Data={RHexpiryContestRewardRows}
                      selectedWidget="Criteria and Rewards"
                      customHide={true}
                    />
                  </Col>
                </Row>

                {/* Today's Contest Progress */}
                <h6 className="card-title mb-3">Zone Contest Progress</h6>

                <DataTable
                  activeMenu={"RHtodaysContestProgress"}
                  T6Data={zoneData}
                  selectedWidget="Criteria and Rewards"
                  customHide={true}
                />
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    margin: "2rem 0",
                  }}
                >
                  {/* Center title */}
                  <h6
                    className="card-title mb-0"
                    style={{
                      position: "absolute",
                      left: "50%",
                      transform: "translateX(-50%)",
                      lineHeight: "1.2",
                    }}
                  >
                    Employee&apos;s Contest Progress
                  </h6>

                  {/* Right-aligned button */}
                  {/* {employeeData.length > 0 && ( */}
                  <div style={{ marginLeft: "auto" }}>
                    <Button
                      sx={{
                        textTransform: "none",
                        backgroundColor: "#11395C",
                        color: "#FFF",
                        height: "28px",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                      onClick={() =>
                        exportToExcel(employeeData, "Expiry_contest_report")
                      }
                    >
                      Excel <DownloadIcon sx={{ fontSize: "1rem" }} />
                    </Button>
                  </div>
                  {/* )} */}
                </div>

                <DataTable
                  activeMenu={"employeesContestProgress"}
                  T6Data={employeeData}
                  selectedWidget="Criteria and Rewards"
                  customHide={true}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Expiry;
