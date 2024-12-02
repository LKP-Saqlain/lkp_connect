import {
  Modal,
  ModalBody,
  ModalHeader,
  Card,
  CardBody,
  Col,
  Row,
  Button,
} from "reactstrap";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { ClientInfoCapsules } from "../../../components/common/Capsules";
import PerformanceHistoryChart from "../PerformanceHistory";
import SegmentWiseTable from "../../../components/common/fullTable";
import BrokerageSlab from "../BrokerageSlab";
import { useMediaQuery } from "@mui/material";
import "../style.css";

const UserInfoModal = ({ isOpen, onClose, handleModalClose }: any) => {
  const isMobile = useMediaQuery("(max-width:768px)");
  console.log(isMobile);

  function tog_fullscreen1() {
    handleModalClose(true);
  }
  return (
    <Modal
      size="xl"
      isOpen={isOpen}
      toggle={onClose}
      className="modal-fullscreen"
      id="fullscreeexampleModal"
      style={{ marginTop: "65px", paddingRight: "10px" }}
    >
      <ModalHeader
        className="modal-title"
        id="fullscreeexampleModalLabel"
        style={{
          display: "flex",
          justifyContent: "space-between", // Keeps "Client Details" on the left and "Back" on the right
          alignItems: "center",
        }}
      >
        <span>Client Details</span>
        <Button
          onClick={tog_fullscreen1}
          style={{
            padding: "0.5rem 1rem",
            height: "40px",
            marginBottom: "10px",
            fontSize: "12px",
            backgroundColor: "#11395C",
            position: "absolute", // Position it absolutely at the top-right corner
            right: "10px", // Adjust as needed
          }}
        >
          Back
        </Button>
      </ModalHeader>
      <ModalBody style={{ backgroundColor: "#E5E4E2" }}>
        <Card
          style={{
            borderRadius: "23px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
            // position: "sticky",
            // top: 0,
            // zIndex: 10,
          }}
        >
          <CardBody>
            <Row className="details-card gx-3 gy-3">
              {/* Client Name */}
              <Col xs="12" md={2} className="text-center">
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "18px",
                    fontFamily: "Public Sans",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "Poppins",
                      color: "#333",
                      fontWeight: "500",
                      fontSize: "12px",
                      margin: "5px 0",
                    }}
                  >
                    Client Name
                  </p>
                  <h6 className="user-info">John Doe</h6>
                </div>
              </Col>
              {/* Client Code */}
              <Col xs="12" md={2} className="text-center">
                <div className="box-content">
                  <p
                    style={{
                      fontFamily: "Poppins",
                      color: "#333",
                      fontWeight: "500",
                      fontSize: "12px",
                      margin: "5px 0",
                    }}
                  >
                    Client Code
                  </p>
                  <h6 className="user-info">ABCDEFGH</h6>
                </div>
              </Col>
              {/* Mobile No */}
              <Col xs="12" md={2} className="text-center">
                <div className="box-content">
                  <p
                    style={{
                      fontFamily: "Poppins",
                      color: "#333",
                      fontWeight: "500",
                      fontSize: "12px",
                      margin: "5px 0",
                    }}
                  >
                    Mobile No
                  </p>
                  <h6 className="user-info">+977 - 987451114</h6>
                </div>
              </Col>
              {/* City */}
              <Col xs="12" md={2} className="text-center">
                <div className="box-content">
                  <p
                    style={{
                      fontFamily: "Poppins",
                      color: "#333",
                      fontWeight: "500",
                      fontSize: "12px",
                      margin: "5px 0",
                    }}
                  >
                    City
                  </p>
                  <h6 className="user-info">New York</h6>
                </div>
              </Col>
              {/* Age */}
              <Col xs="12" md={2} className="text-center">
                <div className="box-content">
                  <p
                    style={{
                      fontFamily: "Poppins",
                      color: "#333",
                      fontWeight: "500",
                      fontSize: "12px",
                      margin: "5px 0",
                    }}
                  >
                    Age
                  </p>
                  <h6 className="user-info">18+</h6>
                </div>
              </Col>
              {/* Email Id */}
              <Col xs="12" md={2} className="text-center">
                <div className="box-content">
                  <p
                    style={{
                      fontFamily: "Poppins",
                      color: "#333",
                      fontWeight: "500",
                      fontSize: "12px",
                      margin: "5px 0",
                    }}
                  >
                    Email Id
                  </p>
                  <h6 className="user-info">Johndoe@tesla.co.in</h6>
                </div>
              </Col>
            </Row>
          </CardBody>
        </Card>
        <Row className="gx-3 gy-2 align-items-start">
          {/* Left Side: Last Trade Date */}
          <Col md={3}>
            <Card
              style={{
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
                backgroundColor: "#11395C",
                borderRadius: "23px",
                height: "100%",
              }}
            >
              <CardBody
                className="d-flex justify-content-center align-items-center"
                style={{ height: "80px" }}
              >
                <p
                  style={{
                    fontFamily: "Poppins",
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: "20px",
                    margin: 0,
                  }}
                >
                  Segment
                </p>
              </CardBody>
            </Card>
          </Col>

          {/* Right Side: BrokSlabItemstwo in a Single Row */}
          <Col md={9}>
            <Row className="gx-2 gy-2">
              {ClientInfoCapsules.map((item) => (
                <Col md={2} key={item.id}>
                  <Card
                    style={{
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                      border: "1px solid rgba(0, 0, 0, 0.1)",
                      borderRadius: "10px",
                      backgroundColor: "#fff",
                    }}
                  >
                    <CardBody className="text-center">
                      <p
                        style={{
                          fontFamily: "Poppins",
                          color: "#333",
                          fontWeight: "500",
                          fontSize: "12px",
                          margin: "5px 0",
                        }}
                      >
                        {item.label}
                      </p>
                      <p
                        style={{
                          fontFamily: "Poppins",
                          color: "#777",
                          fontSize: "14px",
                          margin: 0,
                        }}
                      >
                        <FiberManualRecordIcon
                          fontSize="small"
                          sx={{
                            color:
                              item.status === undefined
                                ? "red"
                                : item.status === "active"
                                ? "#01D28E"
                                : "#FF0606",
                            display: item.status === undefined ? "none" : "",
                          }}
                        />
                        {item.status}
                      </p>
                    </CardBody>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
        <PerformanceHistoryChart />
        <SegmentWiseTable />
        <BrokerageSlab />
      </ModalBody>
      {/* <div className="modal-footer">
        <Link
          to="#"
          type="button"
          onClick={onClose}
          className="btn btn-link link-success fw-medium"
        >
          <i className="ri-close-line me-1 align-middle" />
          Close
        </Link>
        <Button color="primary" className="btn btn-primary ">
          Save changes
        </Button>
      </div> */}
    </Modal>
  );
};

export default UserInfoModal;
