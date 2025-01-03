import { useEffect, useState } from "react";
import { Row, Card, CardBody, Col } from "reactstrap";
import {
  BrokSlabItems,
  LastTradeDates,
  DPSchemes,
} from "../../../components/common/Capsules";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
// import SegmentWiseTable from "../../../components/common/fullTable";
import { FiEdit } from "react-icons/fi";
import ModalComponent from "../../../components/common/Modal";

// interface BrokerageSlabProps {
//   handleClick: (data: any) => void;
// }

const BrokerageSlab = ({ setClientDetails }: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    console.log("test124", setClientDetails);
  }, [setClientDetails]);

  const handleBrokeragePlan = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <ModalComponent isOpen={isModalOpen} onClose={handleBrokeragePlan} />
      <Row className="gx-3 gy-2 align-items-start">
        {/* Left Side: Brokerage Slab */}
        <Col md={3}>
          <Card
            style={{
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
              backgroundColor: "#11395C",
              borderRadius: "23px",
              height: "100%", // Make the height 100% to match the content
            }}
          >
            <CardBody
              className="d-flex justify-content-center align-items-center"
              style={{ height: "200px" }}
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
                Brokerage Slab
              </p>
            </CardBody>
          </Card>
        </Col>

        {/* Right Side: Brokerage Items */}
        <Col md={9}>
          <Row className="gx-2 gy-2">
            {BrokSlabItems.map((item) => {
              // Retrieve the correct subvalue from the API response
              const subvalue = setClientDetails[item.subvalueKey];
              const displaySubvalue =
                subvalue !== undefined ? subvalue : item.subvalue;

              // Check if the value is an integer or a decimal
              const isDecimal = !Number.isInteger(displaySubvalue);

              // Determine the suffix based on whether it's a decimal or integer
              const suffix = isDecimal ? "of turnover" : "per lot";
              const formattedValue = isDecimal
                ? displaySubvalue
                : `₹ ${displaySubvalue}`;

              return (
                <Col md={3} key={item.id}>
                  <Card
                    style={{
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                      border: "1px solid rgba(0, 0, 0, 0.1)",
                      borderRadius: "10px",
                      backgroundColor: "#fff",
                    }}
                  >
                    <CardBody className="d-flex justify-content-between align-items-center">
                      <div className="text-container">
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
                                displaySubvalue === "Inactive"
                                  ? "#FF0606"
                                  : "#fff",
                              display:
                                displaySubvalue === "Inactive"
                                  ? "block"
                                  : "none",
                            }}
                          />
                          {formattedValue} {suffix}
                        </p>
                      </div>
                      <FiEdit
                        style={{
                          cursor: "pointer",
                          fontSize: "16px",
                          color: "#777",
                        }}
                        onClick={handleBrokeragePlan}
                      />
                      {/* <ModalComponent/> */}
                    </CardBody>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Col>
      </Row>
      <div>
        {/* First Section: Last Trade Date and Last Trade Date Items */}
        <Row className="gx-3 gy-2 align-items-start">
          {/* Left Side: Last Trade Date */}
          <Col md={3}>
            <Card
              style={{
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
                backgroundColor: "#11395C",
                borderRadius: "23px",
                height: "100%", // Matches height of items on the right
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
                  Last Trade Date
                </p>
              </CardBody>
            </Card>
          </Col>

          {/* Right Side: BrokSlabItemstwo in a Single Row */}
          <Col md={9}>
            <Row className="gx-2 gy-2">
              {LastTradeDates.map((item) => (
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
                                ? ""
                                : item.status === "Inactive"
                                ? "#FF0606"
                                : "#01D28E",
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
      </div>
      <div>
        {/* First Section: Last Trade Date and Last Trade Date Items */}
        <Row className="gx-3 gy-2 align-items-start">
          {/* Left Side: Last Trade Date */}
          <Col md={3}>
            <Card
              style={{
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
                backgroundColor: "#11395C",
                borderRadius: "23px",
                height: "100%", // Matches height of items on the right
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
                  DP Scheme
                </p>
              </CardBody>
            </Card>
          </Col>

          {/* Right Side: BrokSlabItemstwo in a Single Row */}
          <Col md={9}>
            <Row className="gx-2 gy-2">
              {DPSchemes.map((item) => (
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
                                ? ""
                                : item.status === "Inactive"
                                ? "#FF0606"
                                : "#01D28E",
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
      </div>
      {/* <SegmentWiseTable customClass={true} /> */}
    </>
  );
};

export default BrokerageSlab;
