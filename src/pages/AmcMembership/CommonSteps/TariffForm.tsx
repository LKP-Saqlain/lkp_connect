import { useEffect } from "react";
import { Row, Col, Button } from "reactstrap";

interface TariffProps {
  onNext: () => void;
  selectedRow: any;
}
const TariffForm = ({ onNext, selectedRow }: TariffProps) => {
  useEffect(() => {
    console.log(selectedRow, "selectedRow from tarif");
  }, []);

  return (
    <div
      style={{
        padding: "1.5rem 3rem",
        minHeight: "60vh",
        minWidth: "70vw",
        fontSize: "1.25rem", // 🔹 Increased base font size (~20px)
        lineHeight: "2",
      }}
    >
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
        <h5 style={{ color: "#1c3c6b", fontWeight: 700, fontSize: "1.4rem" }}>
          Lifetime–1500 Tariff for Non–Corporate Clients
        </h5>

        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
          <p
            style={{
              margin: 0,
              fontWeight: 500,
              color: "#000",
              fontSize: "1.1rem",
            }}
          >
            DP ID –{" "}
            <span style={{ color: "#1c3c6b", fontWeight: 600 }}>
              {selectedRow?.dP_ID}
            </span>
          </p>
          <p
            style={{
              margin: 0,
              fontWeight: 500,
              color: "#000",
              fontSize: "1.1rem",
            }}
          >
            Client ID –{" "}
            <span style={{ color: "#1c3c6b", fontWeight: 600 }}>
              {selectedRow?.trading_Code}
            </span>
          </p>
        </div>
      </div>

      <Row>
        {/* Left Column */}
        <Col
          md="6"
          style={{ borderRight: "1px solid #ddd", paddingRight: "1rem" }}
        >
          <table style={{ width: "100%", color: "#000", fontSize: "1.1rem" }}>
            <thead style={{ backgroundColor: "#dbdbdb" }}>
              <tr style={{ borderBottom: "1px solid #ddd" }}>
                <th style={{ padding: "10px", textAlign: "left" }}>
                  Particulars
                </th>
                <th style={{ padding: "10px", textAlign: "right" }}>
                  Lifetime–1500
                </th>
              </tr>
            </thead>
            <tbody>
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
        <Col md="6" style={{ paddingLeft: "1rem" }}>
          <table style={{ width: "100%", color: "#000", fontSize: "1.1rem" }}>
            <thead style={{ backgroundColor: "#dbdbdb" }}>
              <tr style={{ borderBottom: "1px solid #ddd" }}>
                <th style={{ padding: "10px", textAlign: "left" }}>
                  Particulars
                </th>
                <th style={{ padding: "10px", textAlign: "right" }}>
                  Lifetime–1500
                </th>
              </tr>
            </thead>
            <tbody>
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
      <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
        <Button
          color="primary"
          style={{
            backgroundColor: "#003366",
            border: "none",
            borderRadius: "6px",
            padding: "0.8rem 2.5rem",
            fontSize: "1.1rem",
            fontWeight: 600,
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
