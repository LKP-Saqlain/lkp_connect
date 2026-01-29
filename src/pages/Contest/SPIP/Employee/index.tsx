import { useEffect, useState } from "react";
import { Tabs, Tab } from "@mui/material";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import contestReward from "../../../../assets/images/SPIP employees.svg";

const EmployeeSPIP = ({ activeSubItem }: any) => {
  const partnerContestTabs = ["Contest Rewards", "Details"];

  const [tabValue, setTabValue] = useState<string>("Contest Rewards");

  // 🔹 Sync tab with activeSubItem (optional)
  useEffect(() => {
    if (activeSubItem && partnerContestTabs.includes(activeSubItem)) {
      setTabValue(activeSubItem);
    }
  }, [activeSubItem]);

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
          {tabValue === "Details" && <div>Details Content</div>}
        </Row>
      </Container>
    </div>
  );
};

export default EmployeeSPIP;
