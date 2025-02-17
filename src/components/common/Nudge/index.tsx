import { Col, Modal, ModalBody, ModalHeader } from "reactstrap";
import "./modal.css";
import { Button, Box } from "@mui/material";

const notificationsQns = [
  "Client Not traded since last 10 days",
  "Upcoming Dormant Client Count",
  "SPIP Renewal in Last 10 days",
  "New Client Added in last 5 days",
  "Brok Last week vs Brok Current week",
  "New SPIP Subscription in last 10 days",
];

const Nudge = ({ modal_animationZoom, tog_animationZoom }: any) => {
  return (
    <Col lg={12}>
      <Modal
        id="flipModal"
        isOpen={modal_animationZoom}
        toggle={tog_animationZoom}
        modalClassName="zoomIn"
        centered
        style={{
          fontFamily: "Public Sans",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <ModalHeader
          className="modal-title"
          id="flipModalLabel"
          toggle={tog_animationZoom}
          style={{ backgroundColor: "#11395C" }}
        >
          <h5 style={{ color: "#fff" }}>Notifications</h5>
        </ModalHeader>
        <ModalBody style={{ backgroundColor: "#f0f0f0" }}>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {notificationsQns.map((question, index) => (
              <Box
                key={index}
                className="question-box list-group-item-action list-group-item-dark list-group-item"
                sx={{
                  backgroundColor: "#fff",
                  borderRadius: 1,
                  padding: 2,
                  flex: "1 1 calc(50% - 14px)", // Two boxes per row
                  minWidth: "250px", // Ensures responsiveness
                  cursor: "pointer",
                }}
              >
                <h5 className="fs-15">{question}</h5>
                <p
                  className="text-muted"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                  }}
                >
                  <Button
                    sx={{
                      textTransform: "capitalize",
                      fontFamily: "Public Sans",
                      fontSize: "12px",
                    }}
                  >
                    View Details
                  </Button>
                </p>
              </Box>
            ))}
          </Box>
        </ModalBody>
        <div className="modal-footer">
          <Button
            variant="outlined"
            sx={{
              backgroundColor: "#11395C",
              color: "#fff",
              fontFamily: "Public Sans",
            }}
            onClick={tog_animationZoom}
          >
            Close
          </Button>
        </div>
      </Modal>
    </Col>
  );
};

export default Nudge;
