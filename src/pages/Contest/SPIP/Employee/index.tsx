import { useEffect, useMemo, useState } from "react";
import { Tabs, Tab } from "@mui/material";
import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";
import contestReward from "../../../../assets/images/SPIP employees.svg";
import DataTable from "../../../../components/common/UserInfoTable";
import { apiServices } from "../../../../services";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../redux/store";
import { hideLoader, showLoader } from "../../../../redux/slices/loaderSlice";
import { DateRangePicker } from "rsuite";

const EmployeeSPIP = ({ activeSubItem }: any) => {
  const partnerContestTabs = ["Contest Rewards", "Details"];
  const { user_id } = useSelector(
    (state: RootState) => state.AuthUser?.data?.data
  );
  const onlyDigits = user_id.replace(/\D/g, "");
  const [tabValue, setTabValue] = useState<string>("Contest Rewards");
  const [rawData, setRawData] = useState([]);
  const [data, setData] = useState([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const dispatch = useDispatch<AppDispatch>();
  const [apiTotalAmount, setApiTotalAmount] = useState<number>(0);

  const [selectedDateRange, setSelectedDateRange] = useState<
    [Date | null, Date | null]
  >([null, null]);

  useEffect(() => {
    if (activeSubItem && partnerContestTabs.includes(activeSubItem)) {
      setTabValue(activeSubItem);
    }
  }, [activeSubItem]);

  useEffect(() => {
    if (tabValue === "Details") {
      handleSPIPData();
    }
  }, [tabValue]);

  const handleSPIPData = () => {
    // const payload = { userType: "B2B", userId: "7387", quarterPeriod: "Q4" };
    // const payload = { userType: "APN", userId: "7417", quarterPeriod: "Q4" };
    const payload = {
      userType: "EMP",
      userId: onlyDigits,
      quarterPeriod: "Q4",
    };
    dispatch(showLoader("Fetching SPIP Data..."));
    apiServices
      .GetSPIPContest(payload)
      .then((response: any) => {
        const list = response?.data?.data?.list || [];
        const apiTotal = response?.data?.data?.totalAmount || 0;

        const mappedData = list.map((item: any, index: number) => ({
          id: index + 1,
          ...item,
        }));

        setRawData(mappedData);
        setData(mappedData);
        setApiTotalAmount(apiTotal);
        setTotalAmount(apiTotal);
      })
      .catch((error: any) => {
        console.error("PhysicalClientInfo Error:", error);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  /* -------------------- Date filtering (prd) -------------------- */
  const filteredData = useMemo(() => {
    if (!selectedDateRange[0] || !selectedDateRange[1]) {
      return rawData;
    }

    const [startDate, endDate] = selectedDateRange;

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    return rawData.filter((item: any) => {
      if (!item.prd) return false;
      const prdDate = new Date(item.prd);
      return prdDate >= start && prdDate <= end;
    });
  }, [rawData, selectedDateRange]);

  /* -------------------- Update table + total -------------------- */
  useEffect(() => {
    setData(filteredData);

    if (!selectedDateRange[0] || !selectedDateRange[1]) {
      setTotalAmount(apiTotalAmount);
      return;
    }

    const total = filteredData.reduce(
      (sum, item: any) => sum + (Number(item.sf) || 0),
      0
    );

    setTotalAmount(total);
  }, [filteredData]);

  /* ============================================================= */

  return (
    <div className="page-content page-view">
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
        {partnerContestTabs.map((label) => (
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

      {/* 🔹 Example conditional rendering */}
      <Container fluid>
        <Row>
          {tabValue === "Contest Rewards" && (
            <div>
              <Row className="mt-3">
                <Col sm={12}>
                  <Card className="contest-card">
                    <CardBody style={{ textAlign: "center" }}>
                      <p style={{ fontWeight: "700", marginBottom: "15px" }}>
                        Contest Period: 1st January – 31st March
                      </p>
                      <img
                        src={contestReward}
                        alt="Contest Reward"
                        style={{
                          width: "65%",
                          height: "auto",
                          borderRadius: "8px",
                          // boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        }}
                      />
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </div>
          )}
        </Row>
        {tabValue === "Details" && (
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
                boxShadow: "0 -4px 8px rgba(0, 0, 0, 0.15)",
                backgroundColor: "#fff",
                padding: "0.2rem 0.8rem",
              }}
            >
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                <h5 className="mb-0">SPIP Employee Contest</h5>

                <div style={{ gap: "10px" }}>
                  <DateRangePicker
                    size="md"
                    value={
                      selectedDateRange[0] && selectedDateRange[1]
                        ? ([selectedDateRange[0], selectedDateRange[1]] as [
                            Date,
                            Date
                          ])
                        : undefined
                    }
                    onChange={(value) =>
                      setSelectedDateRange(value ?? [null, null])
                    }
                    placeholder="Start Date & End Date"
                    showOneCalendar
                    shouldDisableDate={(date) => date > new Date()}
                    style={{ paddingRight: "1rem" }}
                  />

                  <span style={{ paddingLeft: 2 }}>
                    <strong>Total:</strong> ₹
                    {totalAmount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <DataTable T6Data={data} activeSubItem={"contestSPIP"} />
            </CardBody>
          </Card>
        )}
      </Container>
    </div>
  );
};

export default EmployeeSPIP;
