import { Card, CardBody, Col, Row } from "reactstrap";
import StatItem from "../StatItem";
import { useEffect } from "react";

const FundOverview = ({ records }: any) => {
  useEffect(() => {
    console.log("fundOverviewData", records);
  }, [records]);

  return (
    <Card style={{ borderRadius: "23px", marginTop: "2rem" }}>
      {/* <CardHeader>OverView</CardHeader> */}
      <CardBody>
        <Row className="details-card gx-3 gy-3">
          {/* Client Name */}
          <Col xs="12" md={4} className="text-center">
            <div
              style={{
                fontWeight: "bold",
                fontSize: "18px",
                fontFamily: "Public Sans",
                padding: "8px",
                // borderRight: "1px solid #ddd", // Box border
                // borderRadius: "8px", // Rounded corners for the box
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)", // Light shadow for better visibility
              }}
            >
              {/* <StatItem label="Market Cap" value="12,21515 CR" /> */}
              <StatItem
                label={records[0]?.title || "Market Caps"}
                value={`${
                  records[0]?.value
                    ? new Intl.NumberFormat("en-IN").format(records[0]?.value)
                    : "0"
                } ${records[0]?.unit || ""}`}
                dynamicColor={records[0]?.color}
              />
              {/* <StatItem label="Company P/E" value="31" /> */}
              <StatItem
                label={records[1]?.title || "Company P/E"}
                value={`${
                  records[1]?.value
                    ? new Intl.NumberFormat("en-IN").format(records[1]?.value)
                    : "0"
                } ${records[1]?.unit || ""}`}
                dynamicColor={records[1]?.color}
              />
              <StatItem label="Op Revenue TTE static" value="0.00 CR" />
              <StatItem label="ROE static" value="21.61%" />
            </div>
          </Col>
          <Col xs="12" md={4} className="text-center">
            <div
              style={{
                fontWeight: "bold",
                fontSize: "18px",
                fontFamily: "Public Sans",
                padding: "8px",
                // borderRight: "1px solid #ddd", // Box border
                // borderRadius: "8px", // Rounded corners for the box
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)", // Light shadow for better visibility
              }}
            >
              <StatItem label="Current Price static" value="-" />
              <StatItem label="Company P/BV static" value="7.5" />
              <StatItem
                label={records[6]?.title || "Net Profit TTM"}
                value={`${
                  records[6]?.value
                    ? new Intl.NumberFormat("en-IN").format(records[6]?.value)
                    : "0"
                } ${records[6]?.unit || ""}`}
                dynamicColor={records[6]?.color}
              />
              <StatItem
                label={records[7]?.title || "Net Profit TTM"}
                value={`${
                  records[7]?.value
                    ? new Intl.NumberFormat("en-IN").format(records[7]?.value)
                    : "0"
                } ${records[7]?.unit || ""}`}
                dynamicColor={records[7]?.color}
              />
            </div>
          </Col>
          <Col xs="12" md={4} className="text-center">
            <div
              style={{
                fontWeight: "bold",
                fontSize: "18px",
                fontFamily: "Public Sans",
                padding: "8px",
                // borderRight: "1px solid #ddd", // Box border
                // borderRadius: "8px", // Rounded corners for the box
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)", // Light shadow for better visibility
              }}
            >
              <StatItem label="52 Wk Hi / Lo static" value="8,192 / 5,465.5" />
              <StatItem label="Company PEG static" value="1.1" />
              <StatItem label="Dividend Yield static" value="0.4" />
              <StatItem
                label={records[8]?.title || "ROE"}
                value={`${records[8]?.value || "-"} ${records[8]?.unit || ""}`}
                dynamicColor={records[8]?.color}
              />
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default FundOverview;
