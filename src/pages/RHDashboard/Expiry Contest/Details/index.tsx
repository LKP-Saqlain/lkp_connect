import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import DownloadIcon from "@mui/icons-material/Download";

import { apiServices } from "../../../../services";
import { hideLoader, showLoader } from "../../../../redux/slices/loaderSlice";
import { RootState, AppDispatch } from "../../../../redux/store";

import DataTable from "../../../../components/common/UserInfoTable";
import ComDropDown from "../../../../components/common/Dropdown/commonDropdown";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { employeesContestProgress } from "../../../../helper/tableColumns";

const Details = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { user_id, accessCode, accessType } = useSelector(
    (state: RootState) => state.AuthUser?.data?.data
  );

  const [view, setView] = useState<"TODAY" | "HISTORY">("TODAY");
  const [selectedZone, setSelectedZone] = useState(accessCode);
  const [lastDate, setLastDate] = useState("");

  const [zoneData, setZoneData] = useState<any[]>([]);
  const [employeeData, setEmployeeData] = useState<any[]>([]);

  /* ================= EFFECT ================= */

  useEffect(() => {
    if (view === "TODAY") {
      fetchToday();
      const interval = setInterval(fetchToday, 10 * 60 * 1000);
      return () => clearInterval(interval);
    } else {
      fetchHistory();
    }
  }, [view, selectedZone]);

  /* ================= TODAY ================= */

  const fetchToday = () => {
    const payload = {
      user_id,
      zone: accessType === "ALL" ? selectedZone : accessCode,
    };
    console.log(payload, accessCode, accessType, "redux");

    dispatch(showLoader("Fetching data..."));

    apiServices
      .GetZoneExpiryDashBoardData(payload)
      .then((res: any) => {
        const raw = res?.data?.data || {};

        const zoneSummary = (raw.zoneSummary || []).map(
          (item: any, i: number) => ({ id: i + 1, ...item })
        );

        const empWise = (raw.empWiseData || []).map((item: any, i: number) => ({
          id: i + 1,
          ...item,
        }));

        setLastDate(zoneSummary[0]?.UpdatedOn || "-");
        setZoneData(zoneSummary);
        setEmployeeData(empWise);
      })
      .finally(() => dispatch(hideLoader()));
  };

  /* ================= HISTORY ================= */

  const fetchHistory = () => {
    const payload = {
      user_id,
      zone: accessType === "ALL" ? selectedZone : accessCode,
      month: "ALL",
    };

    dispatch(showLoader("Fetching history..."));

    apiServices
      .GetZoneExpiryHistDashBoardData(payload)
      .then((res: any) => {
        const raw = res?.data?.data || {};

        const zoneSummary = (raw.zoneSummary || []).map(
          (item: any, i: number) => ({ id: i + 1, ...item })
        );

        const empWise = (raw.empWiseData || []).map((item: any, i: number) => ({
          id: i + 1,
          ...item,
        }));

        setLastDate(zoneSummary[0]?.UpdatedOn || "-");
        setZoneData(zoneSummary);
        setEmployeeData(empWise);
      })
      .finally(() => dispatch(hideLoader()));
  };

  /* ================= EXCEL ================= */

  const exportToExcel = () => {
    const orderedData = employeeData.map((row) => {
      const obj: any = {};
      employeesContestProgress.forEach((col: any) => {
        obj[col.headerName] = row[col.field];
      });
      return obj;
    });

    const sheet = XLSX.utils.json_to_sheet(orderedData);
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, "Employee Report");

    const buffer = XLSX.write(book, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buffer]), "Expiry_contest_report.xlsx");
  };
  const handleZoneChange = (zone: any) => {
    console.log("Selected zone:", zone);
    setSelectedZone(zone?.value || "all"); // update selected zone value here
  };
  return (
    <>
      {/* HEADER */}
      {accessType !== "EMPLOYEE" && (
        <ComDropDown onZoneChange={handleZoneChange} />
      )}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="my-2">
            {view === "TODAY"
              ? "Today’s Contest Progress"
              : "Historical Contest Progress"}
          </h4>

          {view === "TODAY" && zoneData.length > 0 && (
            <>
              <div style={{ fontSize: "1rem" }}>
                Last updated on <strong>{lastDate}</strong>
              </div>
              <div style={{ fontSize: ".8rem", color: "#dc3545" }}>
                Data is refreshed every 10 minutes during market hours.
              </div>
            </>
          )}
        </div>

        <div className="d-flex gap-2 align-items-center">
          {/* ZONE DROPDOWN */}

          {view === "TODAY" ? (
            <Button
              size="small"
              variant="outlined"
              sx={{ textTransform: "none", borderRadius: "16px" }}
              onClick={() => setView("HISTORY")}
            >
              View History
            </Button>
          ) : (
            <Button
              size="small"
              variant="outlined"
              sx={{ textTransform: "none", borderRadius: "16px" }}
              onClick={() => setView("TODAY")}
            >
              Back to Today
            </Button>
          )}

          {view === "TODAY" && zoneData.length > 0 && (
            <Button
              size="small"
              variant="outlined"
              sx={{ textTransform: "none", borderRadius: "16px" }}
              onClick={fetchToday}
            >
              Refresh <RefreshIcon sx={{ fontSize: "1rem" }} />
            </Button>
          )}
        </div>
      </div>

      {/* TABLES */}
      {zoneData.length > 0 ? (
        <>
          <h6 className="mb-2">Zone Contest Progress</h6>
          <DataTable
            activeMenu={
              view === "TODAY"
                ? "RHtodaysContestProgress"
                : "RHexpiryContestHistory"
            }
            T6Data={zoneData}
            selectedWidget="Criteria and Rewards"
            customHide
          />

          <div className="d-flex justify-content-between align-items-center my-4">
            <h6 className="mb-0">Employee&apos;s Contest Progress</h6>

            {employeeData.length > 0 && (
              <Button
                size="small"
                sx={{
                  textTransform: "none",
                  backgroundColor: "#11395C",
                  color: "#fff",
                }}
                onClick={exportToExcel}
              >
                Excel <DownloadIcon sx={{ fontSize: "1rem" }} />
              </Button>
            )}
          </div>

          <DataTable
            activeMenu={
              view === "TODAY"
                ? "employeesContestProgress"
                : "employeesContestHistory"
            }
            // activeMenu="employeesContestProgress" employeesContestHistory
            T6Data={employeeData}
            customHide
          />
        </>
      ) : (
        <span className="fs-5">
          {view === "TODAY"
            ? "There’s no expiry today. You can explore previous expiry contest details in the Historical tab"
            : "No historical data available."}
        </span>
      )}
    </>
  );
};

export default Details;
