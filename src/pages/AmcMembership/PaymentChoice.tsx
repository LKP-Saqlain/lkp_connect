import { Row, Col, Button } from "reactstrap";

const PaymentChoice = ({ onLedger, onOnline }: any) => {
  const amcFee = "₹ 1,770";
  const amcBreakup = "₹ 1500 + GST";
  const data = {
    existingDpOutstanding: "₹ 1,770",
    totalPayable: "₹ 3,540",
    ledgerBalance: "₹ 12540",
  };
  // Helper function to extract number from currency string
  const parseCurrency = (str: any) =>
    Number(str.replace(/[^\d.-]/g, "").replace(/,/g, ""));

  const ledgerBalanceNum = parseCurrency(data.ledgerBalance);
  const totalPayableNum = parseCurrency(data.totalPayable);

  const isLedgerSufficient = ledgerBalanceNum >= totalPayableNum;

  return (
    <>
      {/* Payment Details */}
      <Row style={{ padding: "0 1rem" }}>
        <Col md="12" className="mb-3">
          <p>
            <strong>Existing DP Outstanding:</strong>{" "}
            <span style={{ color: "#333" }}>{data.existingDpOutstanding}</span>
          </p>
          <hr
            style={{
              border: "none",
              borderTop: "1px dotted #999",
              margin: "1rem 0",
            }}
          />
          <p>
            <strong>Lifetime AMC Fee:</strong>{" "}
            <span style={{ color: "#333" }}>
              {amcFee} <small>({amcBreakup})</small>
            </span>
          </p>
          <hr
            style={{
              border: "none",
              borderTop: "1px dotted #999",
              margin: "1rem 0",
            }}
          />
          <p>
            <strong>Total Payable Amount:</strong>{" "}
            <span style={{ color: "#333" }}>{data.totalPayable}</span>
          </p>

          <div
            style={{
              backgroundColor: "#f8f9fa",
              padding: "0.75rem 1rem",
              borderRadius: "8px",
              marginTop: "1rem",
              border: "1px solid #eee",
            }}
          >
            <strong>Ledger Balance:</strong>{" "}
            <span style={{ color: "#1c3c6b", fontWeight: "600" }}>
              {data.ledgerBalance}
            </span>
          </div>
        </Col>
      </Row>

      <hr
        style={{
          border: "none",
          borderTop: "1px dotted #999",
          margin: "1.5rem 0",
        }}
      />

      <div style={{ textAlign: "center" }}>
        <p style={{ fontWeight: "600", color: "#000" }}>
          Select Payment Method
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "1rem",
            marginTop: "1rem",
          }}
        >
          <Button
            style={{
              backgroundColor: isLedgerSufficient ? "#003366" : "#d3d3d3",
              color: isLedgerSufficient ? "#fff" : "#000",
              border: "none",
              borderRadius: "6px",
              padding: "0.6rem 1.5rem",
              cursor: isLedgerSufficient ? "pointer" : "not-allowed",
            }}
            onClick={onLedger}
            disabled={!isLedgerSufficient}
          >
            Debit from Ledger
          </Button>

          <span style={{ fontWeight: "500", color: "#555" }}>or</span>

          <Button
            style={{
              backgroundColor: "#003366",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              padding: "0.6rem 1.5rem",
            }}
            onClick={onOnline}
          >
            Online Payment
          </Button>
        </div>
      </div>
    </>
  );
};

export default PaymentChoice;
