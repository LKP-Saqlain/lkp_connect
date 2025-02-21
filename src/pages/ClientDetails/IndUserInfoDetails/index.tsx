import { Card, CardBody, Row, Col } from "reactstrap";
import { ClientInfoCapsules } from "../../../helper/tableColumns";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import PerformanceHistoryChart from "../PerformanceHistory";
import SegmentWiseTable from "../../../components/common/fullTable";
import BrokerageSlab from "../BrokerageSlab";

const UserInfoDetail = () => {
  return (
    <>
      {/* <div style={{ overflow: "hidden" }}> */}
      {/* Fixed Header Section */}
      <Card
        style={{
          borderRadius: "23px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
          position: "sticky",
          top: 0,
          zIndex: 10,
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
                <span>Client Name</span>
                <h6 className="user-info">John Doe</h6>
              </div>
            </Col>
            {/* Client Code */}
            <Col xs="12" md={2} className="text-center">
              <div className="box-content">
                <span>Client Code</span>
                <h6 className="user-info">ABCDEFGH</h6>
              </div>
            </Col>
            {/* Mobile No */}
            <Col xs="12" md={2} className="text-center">
              <div className="box-content">
                <span>Mobile No</span>
                <h6 className="user-info">+977 - 987451114</h6>
              </div>
            </Col>
            {/* City */}
            <Col xs="12" md={2} className="text-center">
              <div className="box-content">
                <span>City</span>
                <h6 className="user-info">New York</h6>
              </div>
            </Col>
            {/* Age */}
            <Col xs="12" md={2} className="text-center">
              <div className="box-content">
                <span>Age</span>
                <h6 className="user-info">18+</h6>
              </div>
            </Col>
            {/* Email Id */}
            <Col xs="12" md={2} className="text-center">
              <div className="box-content">
                <span>Email Id</span>
                <p className="user-info">Johndoe@tesla.co.in</p>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>

      {/* Scrollable Content */}

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
      {/* <div
          style={{
            height: "calc(100vh - 150px)",
            overflowY: "auto",
            paddingTop: "15px",
          }}
        > */}
      <PerformanceHistoryChart />
      <SegmentWiseTable />
      <BrokerageSlab />
      {/* </div>
      </div> */}
    </>
  );
};

export default UserInfoDetail;
