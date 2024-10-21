import { CardBody, Row } from "reactstrap";

const PNLNote = () => {
  return (
    <CardBody>
      <Row style={{ marginTop: "5rem" }}>
        <div>
          <p style={{ color: "red", fontWeight: "bold" }}>Important Note:</p>
          <p>
            Thank you for downloading the Tax PL Report during it's testing
            phase. We want to bring to your attention that the data provided is
            still under development and refinement. As such, there may be
            instances of inaccuracies, inconsistencies, or errors.
          </p>
          <p>
            Your feedback is invaluable to us in improving the quality and
            reliability of our data. We kindly request that you send any
            observations, discrepancies, or suggestions for improvement to{" "}
            <span style={{ fontStyle: "italic", fontWeight: "bold" }}>
              helpdesk@lkpsec.com
            </span>{" "}
            with a subject line “Tax PL Report – Feedback – Your Clients / AP
            Code”.
          </p>
          <p>
            Please note that while we strive for accuracy, the data provided
            during this testing phase should be used with caution and may not be
            suitable for circulation purposes.
          </p>
          <p>
            Thank you for your understanding and support as we work towards
            providing you with the best possible experience.
          </p>
          <br />
        </div>
      </Row>
    </CardBody>
  );
};

export default PNLNote;
