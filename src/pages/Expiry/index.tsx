import { useState } from "react";
import { Tabs, Tab } from "@mui/material";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";

import Details from "./Details";
import DataTable from "../../components/common/UserInfoTable";
import {
  expiryContestCriteriaRows,
  expiryContestRewardRows,
} from "../../helper/commmon";

const Expiry = () => {
  const tabs = ["Contest Criteria & Rewards", "Details"];
  const [tabValue, setTabValue] = useState(tabs[0]);

  return (
    <div className="page-content page-view">
      <Row>
        <Col lg={12}>
          {/* Tabs */}
          <Tabs
            value={tabValue}
            onChange={(_, value) => setTabValue(value)}
            TabIndicatorProps={{ style: { display: "none" } }}
            sx={{
              mt: 2,
              ml: 1,
              mb: 1,
              backgroundColor: "white",
              borderRadius: "11px",
              width: "fit-content",
            }}
          >
            {tabs.map((label) => (
              <Tab
                key={label}
                value={label}
                label={label}
                sx={{
                  textTransform: "none",
                  borderRadius: "10px",
                  px: 3,
                  backgroundColor: tabValue === label ? "#11395C" : "#fff",
                  color: tabValue === label ? "#fff" : "#11395C",
                  "&.Mui-selected": { color: "#fff" },
                }}
              />
            ))}
          </Tabs>

          <Card
            style={{
              minHeight: "80vh",
              borderRadius: "15px",
              boxShadow: "0 4px 12px rgba(0,0,0,.2)",
            }}
          >
            {/* Dynamic Header */}
            <CardHeader className="bg-white">
              <h4 className="mb-0">
                {tabValue === "Contest Criteria & Rewards"
                  ? "Expiry Day Contest Criteria & Rewards"
                  : "Expiry Day Contest Details"}
              </h4>
            </CardHeader>

            <CardBody>
              {/* TAB 1 */}
              {tabValue === "Contest Criteria & Rewards" && (
                <Row>
                  <Col lg={6}>
                    <DataTable
                      activeMenu="expiryContestCriteria"
                      T6Data={expiryContestCriteriaRows}
                      customHide
                      selectedWidget="Criteria and Rewards"
                    />
                  </Col>

                  <Col lg={6}>
                    <DataTable
                      activeMenu="expiryContestReward"
                      T6Data={expiryContestRewardRows}
                      customHide
                      selectedWidget="Criteria and Rewards"
                    />
                  </Col>
                </Row>
              )}

              {/* TAB 2 */}
              {tabValue === "Details" && <Details />}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Expiry;
