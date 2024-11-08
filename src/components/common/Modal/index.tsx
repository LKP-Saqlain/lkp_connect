import { Modal, ModalBody, Button, ModalHeader, Col, Row } from "reactstrap";
import RadioInput from "../RadioInput";

interface ModalComponentProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

const ModalComponent = ({ isOpen, onClose }: ModalComponentProps) => {
  return (
    <>
      <Modal
        id="flipModal"
        isOpen={isOpen}
        toggle={onClose}
        modalClassName="zoomIn"
        centered
        style={{
          maxWidth: "90%", // Adjust the max width
          width: "50%", // Width of the modal
          maxHeight: "90vh",
          height: "80vh" /* Adjust this value as needed */,
        }}
      >
        <ModalHeader
          // className="text-center"
          id="flipModalLabel"
          toggle={onClose}
          style={{ color: "#11395C" }}
        >
          Brokerage Modification
        </ModalHeader>
        <ModalBody>
          <Row>
            {/* Column for Brokerage Plans */}
            <Col style={{ borderRight: "2px solid grey" }}>
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
                <Col md={6}>
                  <RadioInput
                    id="plan1"
                    name="brokeragePlan"
                    label="0.50% of turnover"
                  />
                  <RadioInput
                    id="plan2"
                    name="brokeragePlan"
                    label="0.30% of turnover"
                  />
                  <RadioInput
                    id="plan3"
                    name="brokeragePlan"
                    label="0.35% of turnover"
                  />
                </Col>

                {/* Column 2 */}
                <Col md={6}>
                  <RadioInput
                    id="plan1"
                    name="brokeragePlan"
                    label="0.40% of turnover"
                  />
                  <RadioInput
                    id="plan2"
                    name="brokeragePlan"
                    label="0.25% of turnover"
                  />
                  <RadioInput
                    id="plan3"
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

            {/* Column for Modification History */}
            <Col>
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
                {/* Column 1 */}
                <Col md={6}>
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
                </Col>

                {/* Column 2 */}
                <Col md={6}>
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
                </Col>
              </Row>
            </Col>
          </Row>
        </ModalBody>
        <div className="modal-footer d-flex  align-items-center justify-content-center">
          <Button
            color="secondary"
            style={{
              backgroundColor: "#01396B",
              color: "#fff",
            }}
            onClick={onClose}
          >
            {" "}
            Cancel{" "}
          </Button>
          <Button
            onClick={onClose}
            color="secondary"
            style={{
              backgroundColor: "#01396B",
              color: "#fff",
            }}
          >
            {" "}
            Proceed{" "}
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default ModalComponent;
