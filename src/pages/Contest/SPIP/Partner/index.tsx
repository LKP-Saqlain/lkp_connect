import { useEffect, useState } from "react";
import { Tabs, Tab } from "@mui/material";
import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";
import contestReward from "../../../../assets/images/SPIP APs.svg";
import DataTable from "../../../../components/common/UserInfoTable";
import { apiServices } from "../../../../services";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../redux/store";
import { hideLoader, showLoader } from "../../../../redux/slices/loaderSlice";

const Index = ({ activeSubItem, row, isCustomRender }: any) => {
  const partnerContestTabs = ["Contest Rewards", "Details"];
  const { user_id } = useSelector(
    (state: RootState) => state.AuthUser?.data?.data
  );
  const onlyDigits = user_id.replace(/\D/g, "");
  const [tabValue, setTabValue] = useState<string>("Contest Rewards");
  const [data, setData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const dispatch = useDispatch<AppDispatch>();
  // 🔹 Sync tab with activeSubItem (optional)
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
      userType: "APN",
      userId: isCustomRender ? row?.ec : onlyDigits,
      quarterPeriod: "Q4",
    };
    dispatch(showLoader("Fetching Client Code..."));
    apiServices
      .GetSPIPContest(payload)
      .then((response: any) => {
        const rawData = response?.data?.data?.list || {};
        setTotalAmount(response?.data?.data?.totalAmount);
        console.log("expiry Response:", rawData);

        const filteredData = (rawData || []).map(
          (item: any, index: number) => ({
            id: index + 1,
            ...item,
          })
        );

        setData(filteredData);
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
      {row && isCustomRender && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            fontSize: "13px",
            fontWeight: 300,
          }}
        >
          {row.en} / {row.ec}
        </div>
      )}
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
                <h4 className="card-title mb-0">SPIP Partner Contest</h4>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <span>Total: ₹{totalAmount.toLocaleString("en-IN")}</span>
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

export default Index;
