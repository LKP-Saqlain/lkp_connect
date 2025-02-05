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
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
import { ClientUserDetails } from "../../../redux/thunk/ClientUserDetails";
import { useEffect, useState } from "react";

const UserInfoModal = ({
  isOpen,
  onClose,
  handleModalClose,
  selectedClientCode,
}: any) => {
  const [clientDetails, setClientDetails] = useState({
    Client_Name: "",
    Clientcode: "",
    Mobile_No: "",
    City: "",
    Age: 0,
    Email_Id: "",
    Equity: "",
    "F & O": "",
    Currency: "",
    Commodity: "",
    MTF: "",
    SLBM: "",
    Equity_Intraday: 0,
    Equity_Delivery: 0,
    Equity_Futures: 0,
    Equity_Options: 0,
    Currency_Futures: 0,
    Currency_Options: 0,
    Commodity_Futures: 0,
    Commodity_Options: 0,
  });

  const isMobile = useMediaQuery("(max-width:768px)");
  console.log(isMobile);

  const dispatch = useDispatch<AppDispatch>();
  // const { user_id } = useSelector(
  //   (state: RootState) => state.UserLogin?.data?.data
  // );

  useEffect(() => {
    const fetchClientUserDetails = async () => {
      const Id = localStorage.getItem("Id");
      let payload = {
        user_id: Id,
        clientCode: selectedClientCode,
      };
      dispatch(showLoader("Please wait"));
      dispatch(ClientUserDetails(payload))
        .unwrap()
        .then((response) => {
          dispatch(hideLoader());
          console.log("ClientDetailsResponse", response);
          setClientDetails(response?.data?.data[0]);
        })
        .catch((err) => {
          console.log("ResponseError", err);
          dispatch(hideLoader());
        })
        .finally(() => {
          dispatch(hideLoader());
        });
    };
    fetchClientUserDetails();
  }, [dispatch]);

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
      style={{ marginTop: "50px", paddingRight: "10px" }}
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
                  <h6 className="user-info">{clientDetails.Client_Name}</h6>
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
                  <h6 className="user-info">{clientDetails.Clientcode}</h6>
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
                  <h6 className="user-info">{clientDetails.Mobile_No}</h6>
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
                  <h6 className="user-info">{clientDetails.City}</h6>
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
                  <h6 className="user-info">{clientDetails.Age}</h6>
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
                  <h6 className="user-info">{clientDetails.Email_Id}</h6>
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
                style={{ height: "50px" }}
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
            <Row className="">
              {ClientInfoCapsules.map((item) => {
                const status = (
                  clientDetails as Record<string, string | number>
                )[item.label];
                const color = status === "Active" ? "#01D28E" : "#FF0606";

                return (
                  <Col md={2} key={item.id}>
                    <Card
                      style={{
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                        border: "1px solid rgba(0, 0, 0, 0.1)",
                        borderRadius: "10px",
                        backgroundColor: "#fff",
                      }}
                    >
                      <CardBody
                        className="text-center"
                        style={{
                          height: "50px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                        }}
                      >
                        <p
                          style={{
                            fontFamily: "Poppins",
                            color: "#333",
                            fontWeight: "500",
                            fontSize: "12px",
                            // margin: "5px 0",
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
                            sx={{ color: color }}
                          />
                          {status}
                        </p>
                      </CardBody>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </Col>
        </Row>
        <PerformanceHistoryChart />
        <SegmentWiseTable selectedClientCode={selectedClientCode} />
        <BrokerageSlab setClientDetails={clientDetails} />
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
