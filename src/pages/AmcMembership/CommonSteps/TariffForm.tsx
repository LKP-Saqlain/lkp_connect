import React from "react";
import { Row, Col, Button } from "reactstrap";

const TariffForm: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  return (
    <div style={{ padding: "1rem 2rem" }}>
      {/* Header Line */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
          flexWrap: "wrap",
        }}
      >
        <h6 style={{ color: "#1c3c6b", fontWeight: 600 }}>
          Lifetime–1500 Tariff for Non–Corporate Clients
        </h6>

        <div style={{ display: "flex", gap: "2rem" }}>
          <p style={{ margin: 0, fontWeight: 500, color: "#000" }}>
            DP ID– <span style={{ color: "#1c3c6b" }}>12030000</span>
          </p>
          <p style={{ margin: 0, fontWeight: 500, color: "#000" }}>
            Client ID– <span style={{ color: "#1c3c6b" }}>12234</span>
          </p>
        </div>
      </div>

      <Row>
        {/* Left Column */}
        <Col md="6" style={{ borderRight: "1px solid #ddd" }}>
          <table style={{ width: "100%", color: "#000" }}>
            <thead style={{ width: "100%", backgroundColor: "#dbdbdb" }}>
              <tr style={{ borderBottom: "1px solid #ddd" }}>
                <th style={{ padding: "8px", textAlign: "left" }}>
                  Particulars
                </th>
                <th style={{ padding: "8px", textAlign: "right" }}>
                  Lifetime–1500
                </th>
              </tr>
            </thead>
            <tbody style={{ fontSize: "0.95rem" }}>
              <tr>
                <td>Annual Maintenance Charge (AMC)</td>
                <td style={{ textAlign: "right" }}>₹1500</td>
              </tr>
              <tr>
                <td>Dematerialization (DRF)</td>
                <td style={{ textAlign: "right" }}>
                  ₹50 per request + ₹3 per certificate
                </td>
              </tr>
              <tr>
                <td>Rejection of DRF</td>
                <td style={{ textAlign: "right" }}>₹30</td>
              </tr>
              <tr>
                <td>Rematerialisation (RRF)</td>
                <td style={{ textAlign: "right" }}>
                  ₹25 per request + ₹3 per certificate
                </td>
              </tr>
              <tr>
                <td>Rejection of RRF</td>
                <td style={{ textAlign: "right" }}>₹30</td>
              </tr>
              <tr>
                <td>Postage / Courier Charges (All related)</td>
                <td style={{ textAlign: "right" }}>₹25</td>
              </tr>
            </tbody>
          </table>
        </Col>

        {/* Right Column */}
        <Col md="6">
          <table style={{ width: "100%", color: "#000" }}>
            <thead style={{ backgroundColor: "#dbdbdb" }}>
              <tr style={{ borderBottom: "1px solid #ddd" }}>
                <th style={{ padding: "8px", textAlign: "left" }}>
                  Particulars
                </th>
                <th style={{ padding: "8px", textAlign: "right" }}>
                  Lifetime–1500
                </th>
              </tr>
            </thead>
            <tbody style={{ fontSize: "0.95rem" }}>
              <tr>
                <td>Additional DIS Booklet</td>
                <td style={{ textAlign: "right" }}>₹20</td>
              </tr>
              <tr>
                <td>On-Market transactions</td>
                <td style={{ textAlign: "right" }}>
                  ₹25 per debit transaction
                </td>
              </tr>
              <tr>
                <td>Off-Market transactions</td>
                <td style={{ textAlign: "right" }}>
                  ₹25 per debit transaction
                </td>
              </tr>
              <tr>
                <td>Pledge Creation / Pledge Closure / Pledge Invocation</td>
                <td style={{ textAlign: "right" }}>₹25</td>
              </tr>
              <tr>
                <td>Billing Cycle</td>
                <td style={{ textAlign: "right" }}>Daily</td>
              </tr>
            </tbody>
          </table>
        </Col>
      </Row>

      {/* Button */}
      <div
        style={{
          textAlign: "center",
          marginTop: "2rem",
        }}
      >
        <Button
          color="primary"
          style={{
            backgroundColor: "#003366",
            border: "none",
            borderRadius: "6px",
            padding: "0.6rem 2rem",
          }}
          onClick={onNext}
        >
          Proceed to eSign
        </Button>
      </div>
    </div>
  );
};

export default TariffForm;
