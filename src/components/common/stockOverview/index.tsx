import { Card, CardBody, Col, Row } from "reactstrap";
import StatItem from "../StatItem";

const Overview = () => {
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
              <StatItem label="Market Cap" value="12,21515 CR" />
              <StatItem label="Company P/E" value="31" />
              <StatItem label="Op Revenue TTE" value="0.00 CR" />
              <StatItem label="ROE" value="21.61%" />
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
              <StatItem label="Current Price" value="-" />
              <StatItem label="Company P/BV" value="7.5" />
              <StatItem label="Net Profit TTM" value="0.00 CR" />
              <StatItem
                label="Cash From Operating Activity"
                value="-42,146.5 Cr."
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
              <StatItem label="52 Wk Hi / Lo" value="8,192 / 5,465.5" />
              <StatItem label="Company PEG" value="1.1" />
              <StatItem label="Dividend Yield" value="0.4" />
              <StatItem label="ROE" value="21.61%" />
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default Overview;
