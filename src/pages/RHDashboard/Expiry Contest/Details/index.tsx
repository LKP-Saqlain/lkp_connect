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
import {
  employeesContestHistory,
  employeesContestProgress,
  RHexpiryContestHistory,
  RHtodaysContestProgress,
} from "../../../../helper/tableColumns";
import { monthOptions, symbolOptions } from "../../../../helper/method";
import { exportToExcel } from "../../../../utils";

const Details = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { user_id, accessCode, accessType } = useSelector(
    (state: RootState) => state.AuthUser?.data?.data
  );

  const [view, setView] = useState<"TODAY" | "HISTORY">("TODAY");
  const [selectedZone, setSelectedZone] = useState(accessCode);
  const [lastDate, setLastDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("ALL");
  const [symbol, setSymbol] = useState("ALL");

  const [zoneData, setZoneData] = useState<any[]>([]);
  const [employeeData, setEmployeeData] = useState<any[]>([]);
  // const [filteredData, setFilteredData] = useState<any[]>([]);

  /* ================= EFFECT ================= */

  useEffect(() => {
    if (view === "TODAY") {
      fetchToday();
      const interval = setInterval(fetchToday, 10 * 60 * 1000);
      return () => clearInterval(interval);
    } else {
      fetchHistory();
    }
  }, [view, selectedZone, selectedMonth, symbol]);

  // useEffect(() => {
  //   if (!zoneData) return;

  //   if (symbol === "ALL") {
  //     setFilteredData(zoneData);
  //   } else {
  //     const data = zoneData.filter((item) => item.index === symbol);
  //     setFilteredData(data);
  //   }
  // }, [symbol, zoneData]);

  /* ================= TODAY ================= */

  const fetchToday = () => {
    const payload = {
      user_id,
      zone: accessType === "ALL" ? selectedZone : accessCode,
    };
    if (payload.zone === "all") return;
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
      month: selectedMonth,
      symbol: symbol,
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

  const handleExcelExport = (tableType: "ZONE" | "EMPLOYEE") => {
    let columns: any[] = [];
    let fileName = "";
    let data: any[] = [];

    if (tableType === "ZONE") {
      columns =
        view === "TODAY" ? RHtodaysContestProgress : RHexpiryContestHistory;

      fileName =
        view === "TODAY" ? "RH_Today_Contest" : "RH_Expiry_Contest_History";

      data = zoneData;
    }

    if (tableType === "EMPLOYEE") {
      columns =
        view === "TODAY" ? employeesContestProgress : employeesContestHistory; // change if you have employeesContestHistory

      fileName =
        view === "TODAY"
          ? "Employee_Today_Contest"
          : "Employee_Contest_History";

      data = employeeData;
    }

    if (!data.length) return;
    console.log(data, columns, fileName, "exportToExcel");

    exportToExcel(data, columns, fileName);
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
              onClick={() => {
                setSelectedMonth("ALL");
                setView("HISTORY");
              }}
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
      {view === "HISTORY" && (
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6 className="mb-0">Zone Contest Progress</h6>
          <div className="d-flex  align-items-end gap-2">
            <div>
              <label className="form-label mb-1" style={{ fontSize: "12px" }}>
                Select Symbol
              </label>
              <select
                className="form-select form-select-sm"
                style={{ width: "140px" }}
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
              >
                {symbolOptions.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>{" "}
            <div>
              <label className="form-label mb-1" style={{ fontSize: "12px" }}>
                Select Month
              </label>
              <select
                className="form-select form-select-sm"
                style={{ width: "140px" }}
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                {monthOptions.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>{" "}
            </div>{" "}
            <div>
              {zoneData.length > 0 && (
                <Button
                  size="small"
                  sx={{
                    textTransform: "none",
                    backgroundColor: "#11395C",
                    color: "#fff",
                  }}
                  onClick={() => handleExcelExport("ZONE")}
                >
                  Excel <DownloadIcon sx={{ fontSize: "1rem" }} />
                </Button>
              )}{" "}
            </div>
          </div>
        </div>
      )}
      {zoneData.length > 0 ? (
        <>
          <DataTable
            activeMenu={
              view === "TODAY"
                ? "RHtodaysContestProgress"
                : "RHexpiryContestHistory"
            }
            // T6Data={view === "HISTORY" ? filteredData : zoneData}
            T6Data={zoneData}
            selectedWidget="Criteria and Rewards"
            // customHide
          />

          <div className="d-flex justify-content-between align-items-center my-2">
            <h6 className="mb-0">Employee&apos;s Contest Progress</h6>

            {employeeData.length > 0 && (
              <Button
                size="small"
                sx={{
                  textTransform: "none",
                  backgroundColor: "#11395C",
                  color: "#fff",
                }}
                onClick={() => handleExcelExport("EMPLOYEE")}
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
            T6Data={employeeData}
            selectedWidget="Criteria and Rewards"
            // customHide
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
