import { Col, Modal, ModalBody, ModalHeader } from "reactstrap";
import "./modal.css";
import { Button, Box } from "@mui/material";

const notificationsQns = [
  "Client Not traded since last 10 days",
  "Upcoming Dormant Client",
  "SPIP Renewal in Next 10 days",
  "New Client Added in last 5 days",
  "Brokerage Last week vs Current week",
  "SPIP Subscription in last 10 days",
];

const boxColors = [
  "#E2F8ED",
  "#FFECE7",
  "#E9EBEC",
  "#E8EBFF",
  "#FEE8E9",
  "#DAF7FE",
];

const borderColors = [
  "#cbdfd5",
  "#e5d4cf",
  "#d1d3d4",
  "#d0d3e5",
  "#e4d0d1",
  "#c4dee4",
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
        contentClassName="custom-modal-content"
      >
        <ModalHeader
          className="modal-title"
          id="flipModalLabel"
          toggle={tog_animationZoom}
          style={{ backgroundColor: "#11395C" }}
        >
          <h5 style={{ color: "#fff" }}>Notifications</h5>
        </ModalHeader>
        <ModalBody
          className="modal-body-custom"
          style={{ backgroundColor: "#f0f0f0" }}
        >
          <Box display="flex" flexWrap="wrap" gap={1}>
            {notificationsQns.map((question, index) => (
              <Box
                key={index}
                className=".bg-secondary-subtle"
                sx={{
                  backgroundColor: boxColors[index % boxColors.length],
                  borderRadius: 1,
                  padding: 2,
                  flex: "1 1 calc(50% - 14px)", // Two boxes per row
                  minWidth: "250px", // Ensures responsiveness
                  cursor: "pointer",
                  border: `2px dashed ${
                    borderColors[index % borderColors.length]
                  }`,
                  boxShadow: "0 8px 8px rgba(0, 0, 0, 0.2)",
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
