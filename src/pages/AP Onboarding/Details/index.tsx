import { useState } from "react";
import { Tabs, Tab } from "@mui/material";
import { partnerOnboardingTabs, ProspectRows } from "../../../helper/commmon";
import { Card, CardBody, CardHeader, Container, Row } from "reactstrap";
import DataTable from "../../../components/common/UserInfoTable";

const ApDetails = () => {
  const [tabValue, setTabValue] = useState<string>("Summary");
  //   const PartnerStatus=() => {

  //   }

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
        {partnerOnboardingTabs.map((label: any) => (
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
        <Row>{tabValue === "Summary" && <div>Summary</div>}</Row>
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
              <h5 style={{ margin: 0, fontWeight: 500 }}>Details</h5>
            </CardHeader>
            <CardBody>
              <DataTable
                T6Data={ProspectRows}
                activeSubItem={"Referal Entry Status"}
              />
            </CardBody>
          </Card>
        )}
      </Container>
    </div>
  );
};

export default ApDetails;
