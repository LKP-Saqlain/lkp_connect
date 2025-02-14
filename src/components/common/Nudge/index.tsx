import { useState } from "react";
import { Card, CardBody, Col, Modal, ModalBody, ModalHeader } from "reactstrap";
import "./modal.css";
import { Button } from "@mui/material";

const Nudge = () => {
  const [modal_animationZoom, setmodal_animationZoom] =
    useState<boolean>(false);

  function tog_animationZoom() {
    setmodal_animationZoom(!modal_animationZoom);
  }

  return (
    <Col lg={12}>
      <Card>
        <CardBody>
          <div className="live-preview">
            <div>
              <div className="hstack gap-1 flex-wrap">
                <Button
                  color="primary"
                  variant="outlined"
                  onClick={() => tog_animationZoom()}
                >
                  Zoom In Modal
                </Button>
              </div>
            </div>
          </div>

          <Modal
            id="flipModal"
            isOpen={modal_animationZoom}
            toggle={() => {
              tog_animationZoom();
            }}
            modalClassName="zoomIn"
            centered
            style={{ fontFamily: "Public Sans" }}
          >
            <ModalHeader
              className="modal-title"
              id="flipModalLabel"
              toggle={() => {
                tog_animationZoom();
              }}
              style={{ backgroundColor: "#11395C" }}
            >
              <h5 style={{ color: "#fff" }}>Notifications</h5>
            </ModalHeader>
            <ModalBody style={{ backgroundColor: "#f0f0f0" }}>
              {[
                "Client Not traded since last 10 days",
                "Portfolio balance is low",
                "Unusual trading activity detected",
                "New investment opportunities available",
                "Market trends update",
                "Reminder for pending KYC",
              ].map((question, index) => (
                <div
                  key={index}
                  className="question-box  mb-2 border rounded"
                  style={{ backgroundColor: "#fff" }}
                >
                  <h5 className="fs-16">{question}</h5>
                  <p className="text-muted">
                    <Button
                      sx={{
                        textTransform: "capitalize",
                        fontFamily: "Public Sans",
                      }}
                    >
                      View Details
                    </Button>
                  </p>
                </div>
              ))}
            </ModalBody>
            <div className="modal-footer">
              <Button
                variant="outlined"
                sx={{
                  backgroundColor: "#11395C",
                  color: "#fff",
                  fontFamily: "Public Sans",
                }}
                onClick={() => {
                  tog_animationZoom();
                }}
              >
                Close
              </Button>
            </div>
          </Modal>
        </CardBody>
      </Card>
    </Col>
  );
};

export default Nudge;
