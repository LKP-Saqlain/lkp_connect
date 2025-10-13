import { Row, Col, Button } from "reactstrap";

const ClientInfo = ({ onNext }: { onNext: () => void }) => {
  const primaryHolder = "Mahesh Ganesh Sharma";
  const secondaryHolder = "Suresh Ganesh Sharma";
  const email = "rahulsharma@gmail.com";
  const mobile = "91+ 5872277244";
  const dpId = "1234567890123456";
  const amcFee = "₹ 1,770";
  const amcBreakup = "₹ 1500 + GST";
  return (
    <>
      {/* Holder Info */}
      <Row style={{ padding: "0 1rem" }}>
        <Col md="6" className="mb-3">
          <p>
            <strong>Primary Holder:</strong>{" "}
            <span style={{ color: "#333" }}>{primaryHolder}</span>
          </p>

          <p>
            <strong>Secondary Holder:</strong>{" "}
            <span style={{ color: "#333" }}>{secondaryHolder}</span>
          </p>

          <p>
            <strong>Tertiary Holder:</strong>{" "}
            <span style={{ color: "#333" }}>{secondaryHolder}</span>
          </p>
          <hr
            style={{
              border: "none",
              borderTop: "1px dotted #999",
              margin: "1rem 0",
            }}
          />
          <p>
            <strong>Email ID:</strong>{" "}
            <span style={{ color: "#333" }}>{email}</span>
          </p>
          <hr
            style={{
              border: "none",
              borderTop: "1px dotted #999",
              margin: "1rem 0",
            }}
          />
          <p>
            <strong>Mobile Number:</strong>{" "}
            <span style={{ color: "#333" }}>{mobile}</span>
          </p>
          <hr
            style={{
              border: "none",
              borderTop: "1px dotted #999",
              margin: "1rem 0",
            }}
          />
        </Col>

        <Col md="6" className="mb-3">
          <p>
            <strong>DP ID:</strong>{" "}
            <span style={{ color: "#333" }}>{dpId}</span>
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
        </Col>
      </Row>

      {/* Proceed Button */}
      <div
        style={{
          textAlign: "center",
          marginTop: "1rem",
        }}
      >
        <Button
          color="primary"
          style={{
            padding: "0.6rem 2rem",
            borderRadius: "6px",
            backgroundColor: "#003366",
            border: "none",
          }}
          onClick={onNext}
        >
          Proceed
        </Button>
      </div>
    </>
  );
};

export default ClientInfo;
