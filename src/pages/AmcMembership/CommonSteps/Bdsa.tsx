import { Row, Col, Button } from "reactstrap";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

interface BsdaProps {
  onNext: () => void;
  clientData: any;
}

const Bsda = ({ onNext, clientData }: BsdaProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const emailSubject =
    "Consent for Conversion from BSDA to Regular Demat Account.";

  const emailBodyText = `Dear LKP Team,

BOID - ${clientData?.dP_ID}

I hereby give my consent to convert my existing BSDA (Basic Services Demat Account) to a Regular Demat Account and avail all the facilities and services available under the Regular category. Please initiate the necessary process for the same at the earliest.

Thank you.

Warm regards,
${clientData?.primary_Holder}`;

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
    <div
      style={{
        padding: isMobile ? "1rem" : "1rem 2rem",
        fontSize: isMobile ? "15px" : "17px",
        lineHeight: "1.8",
      }}
    >
      <Row>
        <Col md="12">
          <p
            style={{
              color: "#333",
              marginBottom: isMobile ? "0.8rem" : "1rem",
              textAlign: isMobile ? "center" : "left",
            }}
          >
            It has been observed that the Demat Account{" "}
            <b>{clientData?.dP_ID}</b> is under BSDA Category and in order to
            avail the Lifetime DP AMC Scheme, the DP Account will need to be
            moved to Regular Category from BSDA Category.
          </p>

          <p
            style={{
              color: "#333",
              marginBottom: isMobile ? "1rem" : "1.5rem",
              textAlign: isMobile ? "center" : "left",
            }}
          >
            In order to enable us to move the DP account to Regular Category,
            the client will need to send the below text message from their
            registered email ID i.e. <b>( {clientData?.email_id} )</b> to{" "}
            <a
              href="mailto:ho_dp@lkpsec.com"
              style={{
                color: "#0055ff",
                textDecoration: "none",
                // wordBreak: "break-all",
              }}
            >
              ho_dp@lkpsec.com
            </a>
            .
          </p>

          {/* ✅ Email Subject Box */}
          <div
            style={{
              backgroundColor: "#f8f9fb",
              borderRadius: "10px",
              border: "1px solid #e0e0e0",
              padding: isMobile ? "0.8rem" : "1rem",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                justifyContent: "space-between",
                alignItems: isMobile ? "center" : "center",
                gap: "0.8rem",
                textAlign: isMobile ? "center" : "left",
              }}
            >
              <p style={{ fontWeight: 600, margin: 0 }}>
                <b>Email Subject:</b>{" "}
                <span style={{ fontWeight: 400 }}>{emailSubject}</span>
              </p>

              <div
                style={{
                  color: "#0055ff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: isMobile ? "0.85rem" : "0.9rem",
                  justifyContent: isMobile ? "center" : "flex-end",
                  textDecoration: "underline",
                }}
                onClick={() => handleCopy(emailSubject)}
              >
                <ContentCopyIcon style={{ fontSize: "16px" }} />
                <span>Click to copy subject</span>
              </div>
            </div>
          </div>

          {/*  Email Body Box */}
          <div
            style={{
              backgroundColor: "#f8f9fb",
              borderRadius: "10px",
              border: "1px solid #e0e0e0",
              padding: isMobile ? "0.8rem" : "1rem",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                justifyContent: "space-between",
                alignItems: isMobile ? "center" : "flex-end",
                gap: "0.8rem",
                textAlign: isMobile ? "center" : "left",
              }}
            >
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
                  color: "#0055ff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: isMobile ? "center" : "flex-end",
                  gap: "4px",
                  fontSize: isMobile ? "0.85rem" : "0.9rem",
                  textDecoration: "underline",
                  whiteSpace: isMobile ? "normal" : "nowrap",
                }}
                onClick={() => handleCopy(emailBodyText)}
              >
                <ContentCopyIcon style={{ fontSize: "16px" }} />
                <span>Click to copy message</span>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/*  Proceed Button */}
      <div
        style={{
          textAlign: "center",
          marginTop: isMobile ? "1.5rem" : "2rem",
        }}
      >
        <Button
          color="primary"
          style={{
            backgroundColor: "#003366",
            border: "none",
            borderRadius: "6px",
            padding: isMobile ? "0.6rem 1.5rem" : "0.6rem 2rem",
            fontWeight: 600,
            fontSize: isMobile ? "15px" : "17px",
            width: isMobile ? "100%" : "auto",
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
