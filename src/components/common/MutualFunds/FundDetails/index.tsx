import React from "react";
import { Card, Row, Col } from "reactstrap";
import { FaUserTie } from "react-icons/fa";
import { MdOutlineScience } from "react-icons/md";
import { HiOutlineDocumentText } from "react-icons/hi";

const FundDetails: React.FC = () => {
  return (
    <div style={{ marginTop: "20px" }}>
      <Row>
        {/* Fund Manager */}
        <Col md={6}>
          <Card
            style={{
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "16px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            }}
          >
            <h6
              style={{
                display: "flex",
                alignItems: "center",
                fontWeight: 600,
                marginBottom: "12px",
              }}
            >
              <FaUserTie style={{ marginRight: "8px" }} /> Fund Manager
            </h6>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 0",
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              <span>Bhavik Dave</span>
              <span style={{ color: "#666" }}>Aug 2024 - Present</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 0",
              }}
            >
              <span>Shailesh Raj Bhan</span>
              <span style={{ color: "#666" }}>Jan 2013 - Present</span>
            </div>
          </Card>
        </Col>

        {/* Investment Objective */}
        <Col md={6}>
          <Card
            style={{
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "16px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            }}
          >
            <h6
              style={{
                display: "flex",
                alignItems: "center",
                fontWeight: 600,
                marginBottom: "12px",
              }}
            >
              <MdOutlineScience style={{ marginRight: "8px" }} /> Investment
              Objective
            </h6>
            <p style={{ fontSize: "14px", color: "#444", lineHeight: "1.6" }}>
              The Fund seeks to provide long-term capital appreciation by
              investing predominantly in small cap companies. Lorem ipsum, dolor
              sit eligendi eum?
            </p>
          </Card>
        </Col>
      </Row>

      {/* Scheme Information */}
      <Card
        style={{
          borderRadius: "12px",
          padding: "16px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
        }}
      >
        <h6
          style={{
            display: "flex",
            alignItems: "center",
            fontWeight: 600,
            marginBottom: "16px",
          }}
        >
          <HiOutlineDocumentText style={{ marginRight: "8px" }} /> Scheme
          Information
        </h6>
        <Row>
          <Col md={2}>
            <div>
              <strong style={{ fontSize: "13px", color: "#777" }}>
                Launch Date
              </strong>
              <div>17 Apr 2025</div>
            </div>
          </Col>
          <Col md={2}>
            <div>
              <strong style={{ fontSize: "13px", color: "#777" }}>ISIN</strong>
              <div>INF109K01AB2</div>
            </div>
          </Col>
          <Col md={2}>
            <div>
              <strong style={{ fontSize: "13px", color: "#777" }}>
                Expense Ratio
              </strong>
              <div>1.25%</div>
            </div>
          </Col>
          <Col md={2}>
            <div>
              <strong style={{ fontSize: "13px", color: "#777" }}>
                Sharpe Ratio
              </strong>
              <div>1.10%</div>
            </div>
          </Col>
          <Col md={2}>
            <div>
              <strong style={{ fontSize: "13px", color: "#777" }}>Beta</strong>
              <div>0.95</div>
            </div>
          </Col>
          <Col md={2}>
            <div>
              <strong style={{ fontSize: "13px", color: "#777" }}>
                Lock in
              </strong>
              <div>3Y</div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default FundDetails;
