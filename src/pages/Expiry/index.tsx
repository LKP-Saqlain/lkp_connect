import { useEffect, useState } from "react";
import { Tabs, Tab, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import { RootState, AppDispatch } from "../../redux/store";
import { apiServices } from "../../services";
import { hideLoader, showLoader } from "../../redux/slices/loaderSlice";
import RefreshIcon from "@mui/icons-material/Refresh";

import DataTable from "../../components/common/UserInfoTable";
import {
  expiryContestCriteriaRows,
  expiryContestRewardRows,
} from "../../helper/commmon";

const Expiry = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );
  const [detailsView, setDetailsView] = useState<"TODAY" | "HISTORY">("TODAY");
  const tabs = ["Contest Criteria & Rewards", "Details"];
  const [tabValue, setTabValue] = useState<string>(
    "Contest Criteria & Rewards"
  );

  const [data, setData] = useState<any[]>([]);
  const [lastDate, setLastDate] = useState("");

  useEffect(() => {
    handleExpiryData();
    const intervalId = setInterval(() => {
      handleExpiryData();
    }, 10 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleExpiryData = () => {
    const payload = {
      user_id: user_id,
      // user_id: "EMP-5299",
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
        console.log(formattedData, "expiry Response:", response);
        setData(formattedData);
      })
      .catch((error: any) => {
        console.error("PhysicalClientInfo Error:", error);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  const handleViewHistory = () => {
    setDetailsView("HISTORY");
    setData([]);
    handleHistoricalData();
  };

  const handleHistoricalData = () => {
    const payload = {
      user_id: user_id,
      // user_id: "EMP-5299",

      month: "jan-26",
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
        console.log(formattedData, "expiry Response:", response);
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
    <div className="page-content page-view">
      <Row>
        <Col lg={12}>
          {/* Tabs (same pattern as SPIP) */}
          <Tabs
            value={tabValue}
            onChange={(_, value) => setTabValue(value)}
            TabIndicatorProps={{ style: { display: "none" } }}
            sx={{
              marginTop: "1rem",
              marginLeft: ".7rem",
              marginBottom: "8px",
              backgroundColor: "white",
              borderRadius: "11px",
              width: "fit-content",
              minHeight: 0,
            }}
          >
            {tabs.map((label) => (
              <Tab
                key={label}
                value={label}
                label={label}
                disableRipple
                sx={{
                  textTransform: "none",
                  fontWeight: 400,
                  borderRadius: "10px",
                  px: 3,
                  minHeight: 10,
                  backgroundColor: tabValue === label ? "#11395C" : "white",
                  color: tabValue === label ? "white" : "#11395C",
                  "&.Mui-selected": {
                    color: "white !important",
                  },
                  "& .MuiTab-wrapper": {
                    color: tabValue === label ? "white" : "#11395C",
                  },
                }}
              />
            ))}
          </Tabs>

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
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Expiry Day Contest</h5>

                <div className="d-flex align-items-center">
                  <div style={{ fontSize: "0.9rem", marginRight: "12px" }}>
                    Last updated on <strong>{lastDate}</strong>
                    <span
                      style={{
                        display: "block",
                        fontSize: "0.65rem",
                        color: "#dc3545",
                      }}
                    >
                      Data refreshes every 10 minutes during market hours
                    </span>
                  </div>

                  <Button
                    size="small"
                    variant="outlined"
                    sx={{
                      textTransform: "none",
                      borderRadius: "16px",
                      fontSize: "0.9rem",
                      color: "#11395C",
                    }}
                    onClick={handleExpiryData}
                  >
                    Refresh <RefreshIcon sx={{ fontSize: "1rem" }} />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardBody>
              {/* TAB 1 */}
              {tabValue === "Contest Criteria & Rewards" && (
                <Row>
                  <Col lg={6} md={12}>
                    <DataTable
                      activeMenu={"expiryContestCriteria"}
                      T6Data={expiryContestCriteriaRows}
                      selectedWidget="Criteria and Rewards"
                      customHide={true}
                    />
                  </Col>

                  <Col lg={6} md={12}>
                    <DataTable
                      activeMenu={"expiryContestReward"}
                      T6Data={expiryContestRewardRows}
                      selectedWidget="Criteria and Rewards"
                      customHide={true}
                    />
                  </Col>
                </Row>
              )}

              {tabValue === "Details" && (
                <>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="card-title mb-0">
                      {detailsView === "TODAY"
                        ? "Today’s Contest Progress"
                        : "Historical Contest Progress"}
                    </h6>

                    {detailsView === "TODAY" ? (
                      <Button
                        size="small"
                        variant="text"
                        sx={{ textTransform: "none" }}
                        onClick={handleViewHistory}
                      >
                        View History
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        variant="text"
                        sx={{ textTransform: "none" }}
                        onClick={() => {
                          setDetailsView("TODAY");
                          handleExpiryData();
                        }}
                      >
                        Back to Today
                      </Button>
                    )}
                  </div>

                  {data.length > 0 ? (
                    <DataTable
                      // activeMenu={"todaysContestProgress"}
                      activeMenu={
                        detailsView === "TODAY"
                          ? "todaysContestProgress"
                          : "expiryContestHistory"
                      }
                      T6Data={data}
                      selectedWidget="Criteria and Rewards"
                      customHide={true}
                    />
                  ) : (
                    <span>
                      {detailsView === "TODAY"
                        ? "There’s no expiry today. You can explore previous expiry contest details in the Historical tab."
                        : "No historical data available."}
                    </span>
                  )}
                </>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Expiry;
