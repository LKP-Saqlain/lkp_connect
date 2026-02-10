import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

import { apiServices } from "../../../services";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { RootState, AppDispatch } from "../../../redux/store";
import DataTable from "../../../components/common/UserInfoTable";
import { monthOptions } from "../../../helper/method";

const Details = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );
  const [selectedMonth, setSelectedMonth] = useState("ALL");
  const [detailsView, setDetailsView] = useState<"TODAY" | "HISTORY">("TODAY");
  const [lastDate, setLastDate] = useState("");
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetchTodayData();
    const interval = setInterval(fetchTodayData, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [detailsView]);

  useEffect(() => {
    if (detailsView === "HISTORY") {
      fetchHistoryData();
    }
  }, [selectedMonth, detailsView]);

  const fetchTodayData = () => {
    const payload = {
      user_id: user_id,
      //   user_id: "EMP-5299",
    };
    dispatch(showLoader("Fetching Client Code..."));
    apiServices
      .GetDealerExpiryDashBoardData(payload)
      .then((response: any) => {
        const rawData = response?.data?.data || [];
        const formattedData = rawData.map((item: any, index: number) => ({
          id: index + 1,
          ...item,
        }));
        let lastUpdatedDate = formattedData[0]?.UpdatedOn;
        setLastDate(lastUpdatedDate);
        setData(formattedData);
      })
      .catch((error: any) => {
        console.error("PhysicalClientInfo Error:", error);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  const fetchHistoryData = () => {
    const payload = {
      user_id: user_id,
      //   user_id: "EMP-5299",
      month: selectedMonth,
    };
    dispatch(showLoader("Fetching Client Code..."));
    apiServices
      .GetDealerExpiryHistDashBoardData(payload)
      .then((response: any) => {
        const rawData = response?.data?.data || [];
        const formattedData = rawData.map((item: any, index: number) => ({
          id: index + 1,
          ...item,
        }));
        let lastUpdatedDate = formattedData[0]?.UpdatedOn;
        setLastDate(lastUpdatedDate);
        setData(formattedData);
      })
      .catch((error: any) => {
        console.error("PhysicalClientInfo Error:", error);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  return (
    <>
      {/* Header Row */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4 className="my-2">
            {detailsView === "TODAY"
              ? "Today’s Contest Progress"
              : "Historical Contest Progress"}
          </h4>

          {detailsView === "TODAY" && data.length > 0 && (
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

        <div className="d-flex gap-2">
          {detailsView === "TODAY" ? (
            <Button
              size="small"
              variant="outlined"
              sx={{
                textTransform: "none",
                borderRadius: "16px",
                fontSize: "0.9rem",
                padding: "2px 8px",
                color: "#11395C",
                marginBottom: "11px",
              }}
              onClick={() => {
                setDetailsView("HISTORY");
                setSelectedMonth("ALL");
                fetchHistoryData();
              }}
            >
              View History
            </Button>
          ) : (
            <Button
              size="small"
              variant="outlined"
              sx={{
                textTransform: "none",
                borderRadius: "16px",
                fontSize: "0.9rem",
                padding: "2px 8px",
                color: "#11395C",
                marginBottom: "11px",
              }}
              onClick={() => {
                setDetailsView("TODAY");
                fetchTodayData();
              }}
            >
              Back to Today
            </Button>
          )}
          {detailsView === "TODAY" && data.length > 0 && (
            <Button
              size="small"
              variant="outlined"
              sx={{
                textTransform: "none",
                borderRadius: "16px",
                fontSize: "0.9rem",
                padding: "2px 8px",
                color: "#11395C",
                marginBottom: "11px",
              }}
              onClick={fetchTodayData}
            >
              Refresh <RefreshIcon sx={{ fontSize: "1rem" }} />
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      {detailsView === "HISTORY" && (
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6 className="mb-0">Zone Contest Progress</h6>

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
          </select>
        </div>
      )}

      {data.length > 0 ? (
        <DataTable
          activeMenu={
            detailsView === "TODAY"
              ? "todaysContestProgress"
              : "expiryContestHistory"
          }
          T6Data={data}
          customHide
          selectedWidget={detailsView === "TODAY" ? "Criteria and Rewards" : ""}
        />
      ) : (
        <span className="fs-5">
          {detailsView === "TODAY"
            ? "There’s no expiry today. You can explore previous expiry contest details in the Historical tab"
            : "No historical data available."}
        </span>
      )}
    </>
  );
};

export default Details;
