import { useEffect, useState } from "react";
import { Row, Card, CardBody, Col } from "reactstrap";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
// import SegmentWiseTable from "../../../components/common/fullTable";
import { FiEdit } from "react-icons/fi";
import ModalComponent from "../../../components/common/Modal";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice.ts";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store.ts";
import { apiServices } from "../../../services/index.ts";
import ShowToast from "../../../utils/toastUtils.tsx";

const BrokerageSlab = ({ setClientDetails, selectedClientCode }: any) => {
  interface BrokerageItem {
    type: string;
    equity_intraday_brokerage?: number;
    equity_Delivery_brokerage?: number;
    equity_Futures_brokerage?: number;
    equity_Options_brokerage?: number;
    currency_Futures_brokerage?: number;
    currency_Options_brokerage?: number;
    commodity_Futures_brokerage?: number;
    commodity_Options_brokerage?: number;
    description?: string;
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastTradeData, setLastTradeData] = useState([]);
  const [mappedDPScheme, setMappedDPScheme] = useState([]);
  const [brokerageSlab, setBrokerageSlab] = useState<BrokerageItem[]>([]);
  const [selectedBrokerageItem, setSelectedBrokerageItem] = useState<
    string | null
  >(null);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    console.log("test124", setClientDetails);

    if (setClientDetails) {
      const mappedData: any = [
        {
          id: 1,
          label: "Equity",
          status: setClientDetails["EquityTradeDate"] || "--",
        },
        {
          id: 2,
          label: "F&O",
          status: setClientDetails["F_OTradeDate"] || "--",
        },
        {
          id: 3,
          label: "Currency",
          status: setClientDetails["CurrencyTradeDate"] || "--",
        },
        {
          id: 4,
          label: "Commodity",
          status: setClientDetails["Commodity_TradeDate"] || "--",
        },
        { id: 5, label: "MTF", status: setClientDetails[""] || "--" },
        {
          id: 6,
          label: "SLBM",
          status: setClientDetails["SLBM_TradeDate"] || "--",
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

  useEffect(() => {
    const payload = {
      clientcode: selectedClientCode,
    };

    dispatch(showLoader("Please wait..."));

    apiServices
      .GetBrokerageDetails(payload)
      .then((response) => {
        if (response?.status === 200) {
          console.log("Fetched Brokerage Details---raw", response?.data);
          setBrokerageSlab(response?.data?.data);
        }
      })
      .catch((err) => {
        console.log("Error", err);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  }, [selectedClientCode]);

  useEffect(() => {
    console.log("Fetched Brokerage Details-use", brokerageSlab);
  }, [brokerageSlab]);

  const handleBrokeragePlan = (item?: any) => {
    console.log("eventValue", item);
    setIsModalOpen(!isModalOpen);
    setSelectedBrokerageItem(item);
  };
  // const handleValidty = (item?: any) => {
  //   const payload = {
  //     clientcode: item?.clientcode,
  //     segment: item?.type,
  //     moduleNo: item.moduleNo,
  //   };

  //   dispatch(showLoader("Please wait..."));

  //   apiServices
  //     .GetBrokerageModificationValidity(payload)
  //     .then((response) => {
  //       if (response?.status === 200) {
  //         console.log("Fetched Validity Details---raw", response?.data);
  //       }
  //     })
  //     .catch((err) => {
  //       console.log("Error", err);
  //     })
  //     .finally(() => {
  //       dispatch(hideLoader());
  //     });
  // };
  const handleValidty = async (item?: any): Promise<boolean> => {
    const payload = {
      clientcode: item?.clientcode,
      segment: item?.type,
      moduleNo: item.moduleNo,
    };

    try {
      dispatch(showLoader("Please wait..."));

      const response = await apiServices.GetBrokerageModificationValidity(
        payload
      );

      if (response?.status === 200) {
        const modificationFlag = response?.data?.data?.modificationFlag;
        const statusMsg = response?.data?.data?.statusMsg;

        console.log(
          modificationFlag,
          "Fetched Validity Details---raw",
          response?.data
        );

        // Show message only if modification is not allowed
        if (modificationFlag !== "Y" && statusMsg) {
          ShowToast("error", statusMsg);
        }

        return modificationFlag === "Y";
      }
    } catch (err) {
      console.log("Error", err);
    } finally {
      dispatch(hideLoader());
    }

    return false;
  };

  const handleEditClick = async (item: any) => {
    const isValid = await handleValidty(item);

    if (isValid) {
      handleBrokeragePlan(item); // open modal only if valid
    }
  };

  return (
    <>
      <ModalComponent
        isOpen={isModalOpen}
        onClose={handleBrokeragePlan}
        BrokerageTitle={selectedBrokerageItem}
      />
      <Row className="gx-3 gy-2 align-items-start">
        {/* Left Side: Brokerage Slab */}
        <Col md={3}>
          <Card
            style={{
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
              backgroundColor: "#11395C",
              borderRadius: "13px",
              height: brokerageSlab.length > 4 ? "100px" : "50px", // Make the height 100% to match the content
              // margin: 0,
            }}
          >
            <CardBody
              className="p-0 d-flex justify-content-center align-items-center "
              // style={{ height: "100px" }}
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
            {Array.isArray(brokerageSlab) &&
              brokerageSlab.map((item, index) => {
                // Extract the first non-zero brokerage value
                const value =
                  item.equity_intraday_brokerage ||
                  item.equity_Delivery_brokerage ||
                  item.equity_Futures_brokerage ||
                  item.equity_Options_brokerage ||
                  item.currency_Futures_brokerage ||
                  item.currency_Options_brokerage ||
                  item.commodity_Futures_brokerage ||
                  item.commodity_Options_brokerage ||
                  0;

                // const isOption = item.type?.toLowerCase().includes("option");
                // const formattedValue = isOption ? `₹ ${value}` : `${value}%`;

                // const suffix = isOption ? "per lot" : "of turnover";
                return (
                  <Col md={3} key={index}>
                    <Card
                      style={{
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                        border: "1px solid rgba(0, 0, 0, 0.1)",
                        borderRadius: "10px",
                        backgroundColor: "#fff",
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
                            {item.type}
                          </p>
                          <p
                            style={{
                              fontFamily: "Poppins",
                              color: "#777",
                              fontSize: "11px",
                              margin: "0 0 5px 0",
                            }}
                          >
                            {value === 0 && (
                              <FiberManualRecordIcon
                                fontSize="small"
                                sx={{
                                  color: "#FF0606",
                                  marginRight: "5px",
                                }}
                              />
                            )}
                            {/* {formattedValue} {suffix} */}
                            {item.description}
                          </p>
                        </div>
                        <FiEdit
                          style={{
                            cursor: "pointer",
                            fontSize: "16px",
                            color: "#777",
                          }}
                          onClick={() => handleEditClick(item)}
                        />
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
