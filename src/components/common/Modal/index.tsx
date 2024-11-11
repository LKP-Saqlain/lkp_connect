import { Modal, ModalBody, Button, ModalHeader, Col, Row } from "reactstrap";
import RadioInput from "../RadioInput";
import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";

interface ModalComponentProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

const ModalComponent = ({ isOpen, onClose }: ModalComponentProps) => {
  const [selectedValue, setSelectedValue] = useState("");
  const [equityDeliveryValue, setEquityDeliveryValue] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleProceedClick = () => {
    console.log("selectedValue", selectedValue);
    if (selectedValue !== "") {
      setEquityDeliveryValue(true);
    }
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("values", event.target.value);
    setSelectedValue(event.target.value);
  };

  const handleCloseClick = () => {
    setEquityDeliveryValue(false);
    onClose();
  };
  return (
    <Modal
      id="flipModal"
      isOpen={isOpen}
      toggle={handleCloseClick}
      modalClassName="zoomIn"
      centered
      style={{
        maxWidth: "90%",
        width: isMobile ? "100%" : "50%",
        maxHeight: "90vh",
        height: "auto",
        overflowY: "auto",
      }}
    >
      <ModalHeader
        id="flipModalLabel"
        toggle={onClose}
        style={{ color: "#11395C" }}
      >
        Brokerage Modification
      </ModalHeader>
      <ModalBody>
        <Row>
          {/* Column for Brokerage Plans */}
          {!equityDeliveryValue ? (
            <Col
              xs={12}
              md={6}
              style={{ borderRight: "2px solid grey", marginBottom: "15px" }}
            >
              <p
                className="text-center"
                style={{
                  color: "#11395C",
                  fontSize: "16px",
                  fontFamily: "Poppins",
                }}
              >
                Brokerage Plans
              </p>
              <Row>
                {/* Column 1 */}
                <Col xs={12} md={6}>
                  <RadioInput
                    onChange={handleChange}
                    value={"0.50% of turnover"}
                    id="plan1"
                    name="brokeragePlan"
                    label="0.50% of turnover"
                  />
                  <RadioInput
                    onChange={handleChange}
                    id="plan2"
                    value={"0.30% of turnover"}
                    name="brokeragePlan"
                    label="0.30% of turnover"
                  />
                  <RadioInput
                    onChange={handleChange}
                    id="plan3"
                    value={"0.35% of turnover"}
                    name="brokeragePlan"
                    label="0.35% of turnover"
                  />
                </Col>
                <Col xs={12} md={6}>
                  <RadioInput
                    onChange={handleChange}
                    id="plan4"
                    value={"0.40% of turnover"}
                    name="brokeragePlan"
                    label="0.40% of turnover"
                  />
                  <RadioInput
                    onChange={handleChange}
                    id="plan5"
                    value={"0.25% of turnover"}
                    name="brokeragePlan"
                    label="0.25% of turnover"
                  />
                  <RadioInput
                    onChange={handleChange}
                    id="plan6"
                    value={"0.20% of turnover"}
                    name="brokeragePlan"
                    label="0.20% of turnover"
                  />
                </Col>
              </Row>
              <span
                style={{
                  border: "1px solid #FE4747",
                  // marginTop: "5px",
                  fontFamily: "Poppins",
                  padding: "6px",
                  borderRadius: "16px",
                  color: "#FE4747",
                  fontSize: "10px",
                }}
              >
                Note : Brokergae Plan can be modify after 90 days
              </span>
            </Col>
          ) : equityDeliveryValue ? (
            <Col
              xs={12}
              md={6}
              style={{ borderRight: "2px solid grey", marginBottom: "15px" }}
            >
              <p
                className="text-center"
                style={{
                  color: "#11395C",
                  fontSize: "16px",
                  fontFamily: "Poppins",
                }}
              >
                Existent Plans
              </p>
              <Row>
                {/* Column 1 */}
                <Col>
                  <p
                    style={{
                      color: "#11395C",
                      fontSize: "12px",
                      fontFamily: "Poppins",
                    }}
                  >
                    0.50% of turnover Plan <br />
                    active seen 5-Mar-2024
                  </p>
                </Col>
              </Row>
            </Col>
          ) : (
            ""
          )}

          {/* Column for Modification History */}
          {!equityDeliveryValue ? (
            <Col xs={12} md={6}>
              <p
                className="text-center"
                style={{
                  color: "#11395C",
                  fontSize: "16px",
                  fontFamily: "Poppins",
                }}
              >
                Modification History
              </p>
              <Row>
                <Col xs={12} md={6}>
                  <p
                    style={{
                      color: "#11395C",
                      fontSize: "12px",
                      fontFamily: "Poppins",
                    }}
                  >
                    5-Mar-24 <br />
                    0.50% of turnover
                  </p>
                </Col>
                <Col xs={12} md={6}>
                  <p
                    style={{
                      color: "#11395C",
                      fontSize: "12px",
                      fontFamily: "Poppins",
                    }}
                  >
                    5-Mar-24 <br />
                    0.50% of turnover
                  </p>
                </Col>
                <Col>
                  <p
                    style={{
                      color: "#11395C",
                      fontSize: "12px",
                      fontFamily: "Poppins",
                      //   fontWeight: "lighter",
                    }}
                  >
                    5-Mar-24 <br />
                    0.50% of turnover
                  </p>
                </Col>
                <Col xs={12} md={6}>
                  <p
                    style={{
                      color: "#11395C",
                      fontSize: "12px",
                      fontFamily: "Poppins",
                    }}
                  >
                    5-Mar-24 <br />
                    0.50% of turnover
                  </p>
                </Col>
              </Row>
            </Col>
          ) : (
            <Col xs={12} md={6}>
              <p
                className="text-center"
                style={{
                  color: "#11395C",
                  fontSize: "16px",
                  fontFamily: "Poppins",
                }}
              >
                Proposed Plans
              </p>
              <Row>
                <Col xs={12} md={6}>
                  <p
                    style={{
                      color: "#11395C",
                      fontSize: "12px",
                      fontFamily: "Poppins",
                    }}
                  >
                    0.50% of turnover
                  </p>
                </Col>
              </Row>
            </Col>
          )}
        </Row>
      </ModalBody>
      <div className="modal-footer d-flex align-items-center justify-content-center">
        <Button
          color="secondary"
          style={{
            backgroundColor: "#01396B",
            color: "#fff",
          }}
          onClick={handleCloseClick}
        >
          Cancel
        </Button>
        <Button
          onClick={handleProceedClick}
          color="secondary"
          style={{
            backgroundColor: "#01396B",
            color: "#fff",
          }}
        >
          Proceed
        </Button>
      </div>
    </Modal>
  );
};

export default ModalComponent;
