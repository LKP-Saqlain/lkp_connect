import { useState } from "react";
import { Tabs, Tab } from "@mui/material";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";

import DataTable from "../../../components/common/UserInfoTable";
import {
  expiryContestCriteriaRows,
  RHexpiryContestRewardRows,
} from "../../../helper/commmon";
import Details from "./Details";

const Expiry = () => {
  const tabs = ["Contest Criteria & Rewards", "Details"];
  const [tabValue, setTabValue] = useState(tabs[0]);

  return (
    <div className="page-content page-view">
      <Tabs
        value={tabValue}
        onChange={(_, value) => setTabValue(value)}
        TabIndicatorProps={{ style: { display: "none" } }}
        sx={{
          mb: 1,
          backgroundColor: "#fff",
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
              px: 3,
              borderRadius: "10px",
              backgroundColor: tabValue === label ? "#11395C" : "#fff",
              color: tabValue === label ? "#fff" : "#11395C",
              "&.Mui-selected": { color: "#fff" },
            }}
          />
        ))}
      </Tabs>

      <Row>
        <Col lg={12}>
          <Card
            style={{
              minHeight: "80vh",
              borderRadius: "15px",
              boxShadow: "0 4px 12px rgba(0,0,0,.2)",
            }}
          >
            <CardHeader className="bg-white">
              <h5 className="mb-0">
                {tabValue === tabs[0]
                  ? "Expiry Day Contest Criteria & Rewards"
                  : "Expiry Day Contest Details"}
              </h5>
            </CardHeader>

            <CardBody>
              {tabValue === tabs[0] && (
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
                      activeMenu="RHexpiryContestReward"
                      T6Data={RHexpiryContestRewardRows}
                      customHide
                      selectedWidget="Criteria and Rewards"
                    />
                  </Col>
                </Row>
              )}

              {tabValue === tabs[1] && <Details />}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Expiry;
