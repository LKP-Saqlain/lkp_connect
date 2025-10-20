import { Row, Col, Button } from "reactstrap";

interface ESignProps {
  onPrimarySign?: () => void;
  onSecondarySign?: () => void;
  onThirdSign?: () => void;
  selectedRow: any;
}

const ESign = ({
  onPrimarySign,
  onSecondarySign,
  onThirdSign,
  selectedRow,
}: ESignProps) => {
  console.log(selectedRow, "selectedRow from eSign");

  const holders = [
    {
      name: selectedRow?.primary_Holder,
      type: "Primary Holder",
      onClick: onPrimarySign,
    },
    {
      name: selectedRow?.secondary_Holder_Name,
      type: "Second Holder",
      onClick: onSecondarySign,
    },
    {
      name: selectedRow?.third_Holder_Name,
      type: "Third Holder",
      onClick: onThirdSign, // you can make separate handler if needed
    },
  ].filter((holder) => holder.name?.trim()); //  Only include non-empty names

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <Row className="justify-content-center">
        {holders.map((holder, idx) => (
          <Col
            key={idx}
            md="4"
            sm="6"
            xs="12"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: "2rem",
            }}
          >
            {/* Circular Placeholder */}
            <div
              style={{
                width: "80px",
                height: "80px",
                border: "2px solid #1c3c6b",
                borderRadius: "50%",
                marginBottom: "1rem",
              }}
            ></div>

            {/* Holder Info */}
            <p
              style={{
                marginBottom: "0.25rem",
                fontWeight: 500,
                color: "#000",
              }}
            >
              {holder.name}
            </p>
            <p
              style={{
                marginBottom: "1rem",
                color: "#1c3c6b",
                fontWeight: 600,
              }}
            >
              {holder.type}
            </p>

            {/* Proceed Button */}
            <Button
              color="primary"
              style={{
                backgroundColor: "#003366",
                border: "none",
                borderRadius: "6px",
                padding: "0.5rem 1.5rem",
              }}
              onClick={holder.onClick}
            >
              Proceed to eSign
            </Button>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ESign;
