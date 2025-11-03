import { Row, Col, Button } from "reactstrap";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

interface BsdaProps {
  onNext: () => void;
  clientData: any;
}

const Bsda = ({ onNext, clientData }: BsdaProps) => {
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // ✅ Email Subject
  const emailSubject =
    "Consent for Conversion from BSDA to Regular Demat Account.";

  // ✅ Plain text (for copying)
  const emailBodyText = `Dear LKP Team,

BOID - ${clientData?.dP_ID}

I hereby give my consent to convert my existing BSDA (Basic Services Demat Account) to a Regular Demat Account and avail all the facilities and services available under the Regular category. Please initiate the necessary process for the same at the earliest.

Thank you.

Warm regards,
${clientData?.primary_Holder}`;

  // ✅ HTML body (for on-screen display with bold formatting)
  const emailBodyHTML = `
    Dear LKP Team,<br /><br />
    BOID - <b>${clientData?.dP_ID}</b><br /><br />
    I hereby give my <b>consent to convert my existing BSDA (Basic Services Demat Account)</b>
    to a <b>Regular Demat Account</b> and avail all the facilities and services available under
    the Regular category. Please initiate the necessary process for the same at the earliest.<br /><br />
    Thank you.<br /><br />
    Warm regards,<br />
    <b>${clientData?.primary_Holder}</b>
  `;

  return (
    <div style={{ padding: "1rem 2rem", fontSize: "17px" }}>
      {/* Header */}

      <Row>
        <Col md="12">
          <p style={{ color: "#333", lineHeight: "1.6", marginBottom: "1rem" }}>
            It has been observed that the Demat Account{" "}
            <b>{clientData?.dP_ID}</b> is under BSDA Category and in order to
            avail the Lifetime DP AMC Scheme, the DP Account will need to be
            moved to Regular Category from BSDA Category.
          </p>

          <p
            style={{
              color: "#333",
              lineHeight: "1.6",
              marginBottom: "1.5rem",
            }}
          >
            In order to enable us to move the DP account to Regular Category,
            the client will need to send the below text message from their
            registered email ID i.e. <b>{clientData?.email_id}</b> to{" "}
            <a
              href="mailto:ho_dp@lkpsec.com"
              style={{ color: "#0055ff", textDecoration: "none" }}
            >
              ho_dp@lkpsec.com
            </a>
            .
          </p>

          {/* ✅ Email Subject */}
          <div
            style={{
              backgroundColor: "#f8f9fb",
              borderRadius: "10px",
              border: "1px solid #e0e0e0",
              padding: "1rem",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              <p style={{ fontWeight: 600, margin: 0 }}>
                <b>Email Subject:</b>{" "}
                <span style={{ fontWeight: 400 }}>{emailSubject}</span>
              </p>

              <div
                style={{
                  color: "#1c3c6b",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "0.9rem",
                }}
                onClick={() => handleCopy(emailSubject)}
              >
                <ContentCopyIcon style={{ fontSize: "16px" }} />
                <span>Click here to copy the subject line</span>
              </div>
            </div>
          </div>

          {/* ✅ Email Body (With Bold Formatting) */}
          <div
            style={{
              backgroundColor: "#f8f9fb",
              borderRadius: "10px",
              border: "1px solid #e0e0e0",
              padding: "1rem",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              {/* Render formatted HTML safely */}
              <p
                style={{
                  lineHeight: "1.6",
                  flex: 1,
                  minWidth: "250px",
                  color: "#333",
                  margin: 0,
                }}
                dangerouslySetInnerHTML={{ __html: emailBodyHTML }}
              />

              <div
                style={{
                  color: "#1c3c6b",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "0.9rem",
                  whiteSpace: "nowrap",
                }}
                onClick={() => handleCopy(emailBodyText)}
              >
                <ContentCopyIcon style={{ fontSize: "16px" }} />
                <span>Click here to copy the message</span>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* Proceed Button */}
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
            fontWeight: 600,
          }}
          onClick={onNext}
        >
          Proceed
        </Button>
      </div>
    </div>
  );
};

export default Bsda;
