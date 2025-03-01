import { useEffect, useState } from "react";
import { Row, Card, CardBody, Col } from "reactstrap";
import { BrokSlabItems } from "../../../helper/tableColumns.tsx";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
// import SegmentWiseTable from "../../../components/common/fullTable";
import { FiEdit } from "react-icons/fi";
import ModalComponent from "../../../components/common/Modal";

const BrokerageSlab = ({ setClientDetails }: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastTradeData, setLastTradeData] = useState([]);
  const [mappedDPScheme, setMappedDPScheme] = useState([]);

  useEffect(() => {
    console.log("test124", setClientDetails);

    if (setClientDetails) {
      const mappedData: any = [
        {
          id: 1,
          label: "Equity",
          status: setClientDetails["EquityTradeDate"] || "",
        },
        {
          id: 2,
          label: "F&O",
          status: setClientDetails["F_OTradeDate"] || "",
        },
        {
          id: 3,
          label: "Currency",
          status: setClientDetails["CurrencyTradeDate"] || "",
        },
        {
          id: 4,
          label: "Commodity",
          status: setClientDetails["Commodity_TradeDate"] || "",
        },
        { id: 5, label: "MTF", status: setClientDetails[""] || "" },
        {
          id: 6,
          label: "SLBM",
          status: setClientDetails["SLBM_TradeDate"] || "",
        },
      ];

      const mappedDPSchemes: any = [
        {
          id: 1,
          label: "Equity",
          status: setClientDetails["Equity"] || "Inactive",
        },
        {
          id: 2,
          label: "F&O",
          status: setClientDetails["F & O"] || "Inactive",
        },
      ];

      setLastTradeData(mappedData);
      setMappedDPScheme(mappedDPSchemes);
      console.log("mappedDPSchemes", mappedDPScheme);
    }
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
              borderRadius: "13px",
              height: "100%", // Make the height 100% to match the content
            }}
          >
            <CardBody
              className="d-flex justify-content-center align-items-center"
              style={{ height: "100px" }}
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
                      // height: "50px",
                      margin: 0,
                    }}
                  >
                    <CardBody
                      className="d-flex justify-content-between align-items-center"
                      style={{ padding: "0px 10px" }}
                    >
                      <div className="text-container">
                        <p
                          style={{
                            fontFamily: "Poppins",
                            color: "#333",
                            fontWeight: "500",
                            fontSize: "12px",
                            margin: "5px 0 0 0",
                          }}
                        >
                          {item.label}
                        </p>
                        <p
                          style={{
                            fontFamily: "Poppins",
                            color: "#777",
                            fontSize: "11px",
                            margin: "0 0 5px 0",
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
                borderRadius: "13px",
                height: "100%", // Matches height of items on the right
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
                  Last Trade Date
                </p>
              </CardBody>
            </Card>
          </Col>

          {/* Right Side: BrokSlabItemstwo in a Single Row */}
          <Col md={9}>
            <Row className="gx-2 gy-2">
              {lastTradeData.map((item: any) => (
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
                        alignItems: "center",
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
      {/* <div>
        <Row className="gx-3 gy-2 align-items-start">
          <Col md={3}>
            <Card
              style={{
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
                backgroundColor: "#11395C",
                borderRadius: "13px",
                height: "100%", // Matches height of items on the right
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
                  DP Scheme
                </p>
              </CardBody>
            </Card>
          </Col>

          <Col md={9}>
            <Row className="gx-2 gy-2">
              {mappedDPScheme.map((item: any) => (
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
                        alignItems: "center",
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
      </div> */}
      {/* <SegmentWiseTable customClass={true} /> */}
    </>
  );
};

export default BrokerageSlab;
