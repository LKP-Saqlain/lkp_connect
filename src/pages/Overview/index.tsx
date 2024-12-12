import React, { useState, useEffect, useRef } from "react";
import { Col, Container, Row, Card, CardBody } from "reactstrap";
import "./style.css";
import ProjectsOverview from "./ProjectsOverview";
import UserCount from "./VisitorsCount";
// import BrokingRevenue from "./Revenue/BrokingRevenue";
import RevenueDetails from "./Revenue";
import CountUp from "react-countup";
import { Link } from "react-router-dom";
import T6Table from "./T6";
import { Player } from "@lordicon/react";
import Lottie from "react-lottie-player";
import CoinIcon from "../../assets/images/coins.json";
import BriefCase from "../../assets/images/breifcase.json";
import PiggyBank from "../../assets/images/piggyBank.json";
import ActiveClient from "../../assets/images/Clients.json";

type RevenueKeys = "total" | "broking" | "nonBroking";
type TotalClientKey = "total" | "broking" | "nonBroking";

const DashboardProject = () => {
  const [startMonth, setStartMonth] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [revenueValues, setRevenueValues] = useState({
    total: 0,
    broking: 0,
    nonBroking: 0,
  });
  const [activeBadge, setActiveBadge] = useState<RevenueKeys>("total");
  const [activeClientBadge, setActiveClientBadge] =
    useState<TotalClientKey>("total");
  const [multiRevenueMultiply, setMultiRevenueMultiply] = useState(0);
  const [newClients, setNewClients] = useState(0);
  const [activeClients, setActiveClients] = useState(0);
  const [tradedClientCount, setTradedClientCount] = useState(0);

  const handleValues = (revTotal: string) => {
    console.log("revTotal", revTotal);
  };

  const playerRef = useRef<Player>(null);

  useEffect(() => {
    console.log(activeClientBadge);

    playerRef.current?.playFromBeginning();
  }, []);

  const handleRevenueRange = (startMonth: any, endMonth: any) => {
    console.log("startMonth", startMonth, "endMonth", endMonth);
    setStartMonth(startMonth);
    setEndMonth(endMonth);
  };
  const handleBadgeClick = (type: any) => {
    setActiveBadge(type);
    if (type === "total") {
      handleRevenueData(
        revenueValues.total,
        revenueValues.broking,
        revenueValues.nonBroking,
        multiRevenueMultiply // Pass the multiRevenueMultiply value for the total badge
      );
    } else {
      handleRevenueData(
        revenueValues.total,
        revenueValues.broking,
        revenueValues.nonBroking
      );
    }
  };

  const handleRevenueData = (
    total: any,
    broking: any,
    nonBroking: any,
    multiRevenueMultiply?: any,
    newClientsAdded?: any
  ) => {
    console.log(
      "valuesss->",
      total,
      broking,
      nonBroking,
      multiRevenueMultiply,
      newClientsAdded
    );
    setRevenueValues({
      total: total,
      broking: broking,
      nonBroking: nonBroking,
    });
    if (multiRevenueMultiply !== undefined) {
      setMultiRevenueMultiply(multiRevenueMultiply);
    }
    if (newClientsAdded !== undefined) {
      setNewClients(newClientsAdded);
    }
  };

  function formatIndianNumber(value: number): string {
    return `₹${value.toLocaleString("en-IN")}`;
  }

  const getActiveClients = (clients: number) => {
    console.log("activeClients", clients);
    setActiveClients(clients);
  };

  document.title = "LKP Securities | User Overview";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col>
              <div className="h-100">
                <Row>
                  <Col>
                    <div className="movable-note">
                      <span>
                        <strong>Note:</strong> I am the Note with no
                        Information, Thank You!
                      </span>
                    </div>
                    <div className="h-100">
                      {/* Row for Four Boxes */}

                      <Row className="justify-content-center">
                        <Col xxl={3} lg={3} md={6} sm={12}>
                          <Card
                            className="card-animate position-relative shadow-card"
                            style={{
                              maxWidth: "300px",
                              overflow: "hidden",
                            }}
                          >
                            <CardBody>
                              {/* Positioned badges */}
                              <div
                                className="position-absolute"
                                style={{
                                  top: "10px",
                                  right: "10px",
                                  zIndex: 1,
                                }}
                              >
                                <Link
                                  to="#"
                                  // className="badge bg-warning-subtle text-warning badge-border small px-2 py-1"
                                  className={`badge ${
                                    activeBadge === "total"
                                      ? "bg-warning text-white"
                                      : "bg-warning-subtle text-warning"
                                  } badge-border small px-2 py-1`}
                                  onClick={() => handleBadgeClick("total")}
                                >
                                  Total
                                </Link>
                                &nbsp;
                                <Link
                                  to="#"
                                  // className="badge bg-info-subtle text-info badge-border small px-2 py-1"
                                  className={`badge ${
                                    activeBadge === "broking"
                                      ? "bg-info text-white"
                                      : "bg-info-subtle text-info"
                                  } badge-border small px-2 py-1`}
                                  onClick={() => handleBadgeClick("broking")}
                                >
                                  Broking
                                </Link>
                                &nbsp;
                                <Link
                                  to="#"
                                  // className="badge bg-primary-subtle text-primary badge-border small px-2 py-1"
                                  className={`badge ${
                                    activeBadge === "nonBroking"
                                      ? "bg-primary text-white"
                                      : "bg-primary-subtle text-primary"
                                  } badge-border small px-2 py-1`}
                                  onClick={() => handleBadgeClick("nonBroking")}
                                >
                                  Non-Broking
                                </Link>
                              </div>

                              {/* Main content */}
                              <div
                                className="d-flex align-items-center justify-content-between"
                                style={{ marginTop: "1.3rem" }}
                              >
                                {/* Lottie Animation */}
                                <div className="mr-3">
                                  <Lottie
                                    loop={true}
                                    play
                                    animationData={BriefCase}
                                    style={{ width: 40, height: 40 }}
                                  />
                                </div>

                                {/* CountUp and Text */}
                                <div className="text-center">
                                  <h5
                                    className="mb-0"
                                    style={{
                                      fontSize: "7px",
                                      color: "#red",
                                    }}
                                  >
                                    <CountUp
                                      start={0}
                                      end={revenueValues[activeBadge]}
                                      separator=","
                                      // prefix="₹"
                                      formattingFn={formatIndianNumber}
                                      duration={3}
                                      style={{
                                        color: "#495057",
                                        fontSize: "17px", // Adjusted font size for CountUp
                                        fontWeight: "bold",
                                        // marginRight: "15px",
                                      }}
                                    />
                                    <small
                                      className="text-muted fs-12"
                                      style={{
                                        fontWeight: "bold",
                                        marginRight: "15px",
                                      }}
                                    >
                                      .00{" "}
                                    </small>
                                  </h5>
                                </div>
                              </div>

                              <h6 className="text-muted mb-0 fs-14">
                                Revenue
                                <span
                                  style={{
                                    fontSize: "11px",
                                    textDecoration: "underline",
                                    marginLeft: "4px",
                                  }}
                                >{`${startMonth} to ${endMonth}`}</span>
                              </h6>
                            </CardBody>
                          </Card>
                        </Col>

                        {/* Revenue Mulitply */}
                        <Col xxl={3} lg={3} md={6} sm={12}>
                          <Card
                            className="card-animate position-relative shadow-card"
                            style={{
                              maxWidth: "300px",
                              overflow: "hidden",
                            }}
                          >
                            <CardBody>
                              {/* Positioned badges */}
                              <div
                                className="position-absolute"
                                style={{
                                  top: "10px",
                                  right: "10px",
                                  zIndex: 1,
                                }}
                              >
                                <Link
                                  to="#"
                                  // className="badge bg-warning-subtle text-warning badge-border small px-2 py-1"
                                  className="badge bg-warning text-white badge-border small px-2 py-1"
                                  onClick={() => {
                                    setActiveBadge("total");
                                    // setMultiRevenueMultiply(someDynamicValue); // Replace `someDynamicValue` with the actual value
                                  }}
                                >
                                  Total
                                </Link>
                                {/* &nbsp;
                                <Link
                                  to="#"
                                  className="badge bg-info-subtle text-info badge-border small px-2 py-1"
                                >
                                  Broking
                                </Link>
                                &nbsp;
                                <Link
                                  to="#"
                                  className="badge bg-primary-subtle text-primary badge-border small px-2 py-1"
                                >
                                  Non-Broking
                                </Link> */}
                              </div>

                              {/* Main content */}
                              <div
                                className="d-flex align-items-center justify-content-between"
                                style={{ marginTop: "1.3rem" }}
                              >
                                {/* Lottie Animation */}
                                <div className="mr-3">
                                  <Lottie
                                    loop={true}
                                    play
                                    animationData={CoinIcon}
                                    style={{ width: 40, height: 40 }}
                                  />
                                </div>

                                {/* CountUp and Text */}
                                <div className="text-center">
                                  <h5
                                    className="mb-0"
                                    style={{
                                      fontSize: "7px",
                                      color: "#red",
                                    }}
                                  >
                                    <CountUp
                                      start={0}
                                      end={multiRevenueMultiply}
                                      separator=","
                                      decimals={2}
                                      // prefix="₹"
                                      duration={3}
                                      style={{
                                        color: "#495057",
                                        fontSize: "17px", // Adjusted font size for CountUp
                                        fontWeight: "bold",
                                      }}
                                    />
                                    <small
                                      className="text-muted fs-12"
                                      style={{
                                        fontWeight: "bold",
                                        marginRight: "1rem",
                                      }}
                                    >
                                      {" "}
                                      x
                                    </small>
                                  </h5>
                                </div>
                              </div>
                              <h6 className="text-muted mb-0 fs-14">
                                Revenue Multiple
                              </h6>
                            </CardBody>
                          </Card>
                        </Col>

                        {/* New Client Added */}
                        <Col xxl={3} lg={3} md={6} sm={12}>
                          <Card
                            className="card-animate position-relative shadow-card"
                            style={{
                              maxWidth: "300px",
                              overflow: "hidden",
                            }}
                          >
                            <CardBody>
                              {/* Positioned badges */}
                              <div
                                className="position-absolute"
                                style={{
                                  top: "10px",
                                  right: "10px",
                                  zIndex: 1,
                                }}
                              >
                                <Link
                                  to="#"
                                  className="badge bg-warning text-white badge-border small px-2 py-1"
                                  onClick={() => {
                                    setActiveClientBadge("total");
                                    // setMultiRevenueMultiply(someDynamicValue); // Replace `someDynamicValue` with the actual value
                                  }}
                                >
                                  Total
                                </Link>
                                {/* &nbsp;
                                <Link
                                  to="#"
                                  className="badge bg-info-subtle text-info badge-border small px-2 py-1"
                                >
                                  Broking
                                </Link>
                                &nbsp;
                                <Link
                                  to="#"
                                  className="badge bg-primary-subtle text-primary badge-border small px-2 py-1"
                                >
                                  Non-Broking
                                </Link> */}
                              </div>

                              {/* Main content */}
                              <div
                                className="d-flex align-items-center justify-content-between"
                                style={{ marginTop: "1.3rem" }}
                              >
                                {/* Lottie Animation */}
                                <div className="mr-3">
                                  <Lottie
                                    loop={true}
                                    play
                                    animationData={PiggyBank}
                                    style={{ width: 40, height: 40 }}
                                  />
                                </div>

                                {/* CountUp and Text */}
                                <div className="text-center">
                                  <h5
                                    className="mb-0"
                                    style={{
                                      fontSize: "7px",
                                      color: "#red",
                                    }}
                                  >
                                    <CountUp
                                      start={0}
                                      end={newClients}
                                      separator=","
                                      // prefix="₹"
                                      duration={3}
                                      style={{
                                        color: "#495057",
                                        fontSize: "17px",
                                        fontWeight: "bold",
                                        marginRight: "1rem",
                                      }}
                                    />
                                    {/* <small className="text-muted fs-12">
                                      .12k
                                    </small> */}
                                  </h5>
                                </div>
                              </div>
                              <h6 className="text-muted mb-0 fs-14">
                                New Clients Added
                              </h6>
                            </CardBody>
                          </Card>
                        </Col>

                        <Col xxl={3} lg={3} md={6} sm={12}>
                          <Card
                            className="card-animate position-relative shadow-card"
                            style={{
                              maxWidth: "300px",
                              overflow: "hidden",
                            }}
                          >
                            <CardBody>
                              {/* Total Active Clients Badge */}
                              <div
                                className="position-absolute"
                                style={{
                                  top: "10px",
                                  right: "10px",
                                  zIndex: 1,
                                }}
                              >
                                <Link
                                  to="#"
                                  className="badge bg-success-subtle text-success badge-border small px-2 py-1"
                                >
                                  Total Active Clients -{" "}
                                  {new Intl.NumberFormat("en-IN").format(
                                    activeClients
                                  )}
                                </Link>
                              </div>

                              {/* Main content */}
                              <div
                                className="d-flex align-items-center justify-content-between"
                                style={{ marginTop: "1.3rem" }}
                              >
                                {/* Lottie Animation */}
                                <div className="mr-3">
                                  <Lottie
                                    loop={true}
                                    play
                                    animationData={ActiveClient}
                                    style={{ width: 40, height: 40 }}
                                  />
                                </div>

                                {/* CountUp and Text */}
                                <div className="text-center">
                                  <h5
                                    className="mb-0"
                                    style={{
                                      fontSize: "7px",
                                      color: "#red",
                                    }}
                                  >
                                    <CountUp
                                      start={0}
                                      end={tradedClientCount}
                                      separator=","
                                      // prefix="₹"
                                      duration={3}
                                      style={{
                                        color: "#495057",
                                        fontSize: "17px",
                                        fontWeight: "bold",
                                        marginRight: "1rem",
                                      }}
                                    />
                                    {/* <small className="text-muted fs-12">
                                      .12k
                                    </small> */}
                                  </h5>
                                </div>
                              </div>
                              <h6 className="text-muted mb-0 fs-14">
                                Traded Clients
                              </h6>
                            </CardBody>
                          </Card>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </Row>

                <Row>
                  <Col xl={8}>
                    <div className="card-body">
                      <ProjectsOverview />
                    </div>
                  </Col>
                  <UserCount getActiveClients={getActiveClients} />
                </Row>
                <Row>
                  <Col>
                    <RevenueDetails
                      handleValues={handleValues}
                      handleRevenueRange={handleRevenueRange}
                      handleRevenueData={handleRevenueData}
                      setTradedClientCount={setTradedClientCount}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <T6Table />
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default DashboardProject;
