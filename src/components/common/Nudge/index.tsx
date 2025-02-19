import { Col, Modal, ModalBody, ModalHeader } from "reactstrap";
import "./modal.css";
import { Button, Box } from "@mui/material";
import CountUp from "react-countup";

const notificationsQns = [
  "Client not traded since last 10 days",
  "Upcoming Dormant Client",
  "SPIP Renewal in next 10 days",
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

const countData = [4245, 1225, 25464, 2148, 45478, 2513];

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
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {/* Left Side: Question & Button */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <h5 className="fs-15">{question}</h5>

                  {question === "Brokerage Last week vs Current week" ? (
                    // Show count instead of "View Details"
                    <Box
                      sx={{
                        fontSize: "12px",
                        fontFamily: "Public Sans",
                        fontWeight: "bold",
                        color: "#333",
                        alignSelf: "flex-start", // Align to the left, same as button
                      }}
                    >
                      <CountUp
                        start={0}
                        end={1451}
                        // duration={1}
                        style={{
                          fontSize: "24px",
                          fontWeight: "bold",
                          color: "#333",
                        }}
                      />{" "}
                      VS{" "}
                      <CountUp
                        start={0}
                        end={2542}
                        // duration={1}
                        style={{
                          fontSize: "24px",
                          fontWeight: "bold",
                          color: "#333",
                        }}
                      />
                    </Box>
                  ) : (
                    // Show "View Details" button
                    <Button
                      sx={{
                        textTransform: "capitalize",
                        fontFamily: "Public Sans",
                        fontSize: "12px",
                        alignSelf: "flex-start", // Align to the left
                      }}
                    >
                      View Details
                    </Button>
                  )}
                </Box>

                {/* <Box
                  sx={{
                    width: "2px",
                    backgroundColor: "grey",

                    height: "100%", // Adjust height as needed
                    borderRadius: "10px",
                    marginX: 2, // Adds spacing between items
                  }}
                /> */}

                {/* Right Side: Large CountUp */}
                {question !== "Brokerage Last week vs Current week" && (
                  <Box>
                    <CountUp
                      start={0}
                      end={countData[index % countData.length]}
                      separator=","
                      style={{
                        fontSize: "24px",
                        fontWeight: "bold",
                        color: "#333",
                      }} // Bigger and bolder
                    />
                  </Box>
                )}
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
