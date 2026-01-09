import { useEffect } from "react";
import { Row, Col, Button } from "reactstrap";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

interface TariffProps {
  onNext: () => void;
  selectedRow: any;
}

const TariffForm = ({ onNext, selectedRow }: TariffProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    console.log(selectedRow, "selectedRow from tariff");
  }, [selectedRow]);

  const tableStyle = {
    width: "100%",
    color: "#000",
    fontSize: isMobile ? "0.9rem" : "1.1rem",
  };

  const thStyle = {
    padding: "10px",
    textAlign: "left" as const,
  };

  const tdStyle = {
    textAlign: "right" as const,
    padding: "8px",
  };

  return (
    <div
      style={{
        padding: isMobile ? "1rem" : "1.5rem 3rem",
        minHeight: "60vh",
        minWidth: isMobile ? "90vw" : "70vw",
        fontSize: isMobile ? "1rem" : "1.25rem",
        lineHeight: 2,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
          flexWrap: "wrap",
          flexDirection: isMobile ? "column-reverse" : undefined,
        }}
      >
        <h5
          style={{
            color: "#1c3c6b",
            fontWeight: 700,
            fontSize: isMobile ? "1.2rem" : "1.4rem",
          }}
        >
          {selectedRow.module_No === 12
            ? "DP Lifetime AMC-1500 Tariff for Non–Corporate Clients"
            : " Lifetime–1500 Tariff for Non–Corporate Clients"}
        </h5>

        <div
          style={{
            display: "flex",
            gap: !isMobile ? "1.5rem" : "0rem",
            flexWrap: "wrap",
          }}
        >
          <p style={{ margin: 0, fontWeight: 500, color: "#000" }}>
            DP ID –{" "}
            <span style={{ color: "#1c3c6b", fontWeight: 600 }}>
              {selectedRow?.dP_ID}
            </span>
          </p>
          <p style={{ margin: 0, fontWeight: 500, color: "#000" }}>
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
          style={{
            borderRight: isMobile ? "none" : "1px solid #ddd",
            paddingRight: "1rem",
          }}
        >
          <table style={tableStyle}>
            <thead style={{ backgroundColor: "#dbdbdb" }}>
              <tr>
                <th style={thStyle}>Particulars</th>
                <th style={thStyle}>
                  {selectedRow.module_No === 12
                    ? "DP LIFETIME AMC-1500"
                    : "Lifetime–1500"}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Annual Maintenance Charge (AMC)</td>
                <td style={tdStyle}>₹1500</td>
              </tr>
              <tr>
                <td>Dematerialization (DRF)</td>
                <td style={tdStyle}>₹50 per request + ₹3 per certificate</td>
              </tr>
              <tr>
                <td>Rejection of DRF</td>
                <td style={tdStyle}>₹30</td>
              </tr>
              <tr>
                <td>Rematerialisation (RRF)</td>
                <td style={tdStyle}>₹25 per request + ₹3 per certificate</td>
              </tr>
              <tr>
                <td>Rejection of RRF</td>
                <td style={tdStyle}>₹30</td>
              </tr>
              <tr>
                <td>Postage / Courier Charges (All related)</td>
                <td style={tdStyle}>₹25</td>
              </tr>
            </tbody>
          </table>
        </Col>

        {/* Right Column */}
        <Col
          md="6"
          style={{
            paddingLeft: isMobile ? "0" : "1rem",
            marginTop: isMobile ? "1.5rem" : 0,
          }}
        >
          <table style={tableStyle}>
            <thead style={{ backgroundColor: "#dbdbdb" }}>
              <tr>
                <th style={thStyle}>Particulars</th>
                <th style={thStyle}>
                  {selectedRow.module_No === 12
                    ? "DP LIFETIME AMC-1500"
                    : "Lifetime–1500"}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Additional DIS Booklet</td>
                <td style={tdStyle}>₹20</td>
              </tr>
              <tr>
                <td>On-Market transactions</td>
                <td style={tdStyle}>
                  {selectedRow.module_No === 12
                    ? "0.02% of trans value or Rs.25/trans which is higher"
                    : "₹25 per debit transaction"}
                </td>
              </tr>
              <tr>
                <td>Off-Market transactions</td>
                <td style={tdStyle}>
                  {selectedRow.module_No === 12
                    ? "0.02% of trans value or Rs.25/trans which is higher"
                    : "₹25 per debit transaction"}
                </td>
              </tr>
              <tr>
                <td>Pledge Creation / Pledge Closure / Pledge Invocation</td>
                <td style={tdStyle}>₹25</td>
              </tr>
              <tr>
                <td>Billing Cycle</td>
                <td style={tdStyle}>Daily</td>
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
