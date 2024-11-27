import React from "react";
import { Col, Container, Row, Card, CardBody } from "reactstrap";
import ProjectsOverview from "./ProjectsOverview";
import UserCount from "./VisitorsCount";
// import BrokingRevenue from "./Revenue/BrokingRevenue";
import RevenueDetails from "./Revenue";
import CountUp from "react-countup";
import { Link } from "react-router-dom";

const DashboardProject = () => {
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
                    <div className="h-100">
                      {/* Row for Four Boxes */}
                      <Row className="justify-content-center">
                        <Col xxl={3} lg={3} md={6} sm={12}>
                          <Card className="card-animate">
                            <CardBody>
                              <div className="d-flex mb-3">
                                <div className="flex-grow-1">
                                  {/* <i className="ri-briefcase-line display-5 text-success"></i> */}
                                </div>
                                <div className="flex-shrink-0">
                                  <Link
                                    to="#"
                                    className="badge bg-warning-subtle text-warning badge-border"
                                  >
                                    Total
                                  </Link>
                                  &nbsp;
                                  <Link
                                    to="#"
                                    className="badge bg-info-subtle text-info badge-border"
                                  >
                                    Broking
                                  </Link>
                                  &nbsp;
                                  <Link
                                    to="#"
                                    // className="badge bg-primary-subtle text-primary badge-border"
                                    className="badge bg-danger-subtle text-danger badge-border"
                                  >
                                    Non-Broking
                                  </Link>
                                  &nbsp;
                                </div>
                              </div>
                              <div className="d-flex align-items-center">
                                <div>
                                  <i className="ri-briefcase-line display-5 text-success"></i>
                                </div>
                                <div className="flex-grow-1 text-center">
                                  <h4 className="mb-2">
                                    <CountUp
                                      start={0}
                                      end={74858}
                                      separator=","
                                      prefix="₹"
                                      duration={3}
                                      style={{
                                        color: "#495057",
                                        fontSize: "20px",
                                      }}
                                    />
                                    <small className="text-muted fs-13">
                                      .12k
                                    </small>
                                  </h4>
                                </div>
                              </div>
                              <h6 className="text-muted mb-0">Revenue</h6>
                            </CardBody>
                          </Card>
                        </Col>

                        <Col xxl={3} lg={3} md={6} sm={12}>
                          <Card className="card-animate">
                            <CardBody>
                              <div className="d-flex mb-3">
                                <div className="flex-grow-1"></div>
                                <div className="flex-shrink-0">
                                  <Link
                                    to="#"
                                    className="badge bg-warning-subtle text-warning badge-border"
                                  >
                                    Total
                                  </Link>
                                  &nbsp;
                                  <Link
                                    to="#"
                                    className="badge bg-info-subtle text-info badge-border"
                                  >
                                    Broking
                                  </Link>
                                  &nbsp;
                                  <Link
                                    to="#"
                                    // className="badge bg-primary-subtle text-primary badge-border"
                                    className="badge bg-danger-subtle text-danger badge-border"
                                  >
                                    Non-Broking
                                  </Link>
                                  &nbsp;
                                </div>
                              </div>
                              <div className="d-flex align-items-center">
                                <div>
                                  <i className="ri-coin-line display-5 text-success"></i>
                                </div>
                                <div className="flex-grow-1 text-center">
                                  <h4 className="mb-2">
                                    <CountUp
                                      start={0}
                                      end={65858}
                                      separator=","
                                      prefix="₹"
                                      duration={3}
                                      style={{
                                        color: "#495057",
                                        fontSize: "20px",
                                      }}
                                    />
                                    <small className="text-muted fs-13">
                                      .48k
                                    </small>
                                  </h4>
                                </div>
                              </div>
                              <h6 className="text-muted mb-0">
                                Revenue Multiply
                              </h6>
                            </CardBody>
                          </Card>
                        </Col>

                        <Col xxl={3} lg={3} md={6} sm={12}>
                          <Card className="card-animate">
                            <CardBody>
                              <div className="d-flex mb-3">
                                <div className="flex-grow-1"></div>
                                <div className="flex-shrink-0">
                                  <Link
                                    to="#"
                                    className="badge bg-warning-subtle text-warning badge-border"
                                  >
                                    Total
                                  </Link>
                                  &nbsp;
                                  <Link
                                    to="#"
                                    className="badge bg-info-subtle text-info badge-border"
                                  >
                                    Broking
                                  </Link>
                                  &nbsp;
                                  <Link
                                    to="#"
                                    className="badge bg-primary-subtle text-primary badge-border"
                                  >
                                    Non-Broking
                                  </Link>
                                  &nbsp;
                                </div>
                              </div>
                              <div className="d-flex align-items-center">
                                <div>
                                  <i className="ri-wallet-3-line display-5 text-success"></i>
                                </div>
                                <div className="flex-grow-1 text-center">
                                  <h4 className="mb-2">
                                    <CountUp
                                      start={0}
                                      end={97858}
                                      separator=","
                                      prefix="₹"
                                      duration={3}
                                      style={{
                                        color: "#495057",
                                        fontSize: "20px",
                                      }}
                                    />
                                    <small className="text-muted fs-13">
                                      .44k
                                    </small>
                                  </h4>
                                </div>
                              </div>
                              <h6 className="text-muted mb-0">
                                New Client Added
                              </h6>
                            </CardBody>
                          </Card>
                        </Col>

                        <Col xxl={3} lg={3} md={6} sm={12}>
                          <Card className="card-animate">
                            <CardBody>
                              <div className="d-flex mb-3">
                                <div className="flex-grow-1"></div>
                                <div className="flex-shrink-0">
                                  <h6 className="text-muted mb-0 mb-1">
                                    Total Active Client - 19k
                                  </h6>
                                  {/* <Link
                                    to="#"
                                    className="badge bg-warning-subtle text-warning badge-border"
                                  >
                                    BTC
                                  </Link>
                                  &nbsp;
                                  <Link
                                    to="#"
                                    className="badge bg-info-subtle text-info badge-border"
                                  >
                                    ETH
                                  </Link>
                                  &nbsp;
                                  <Link
                                    to="#"
                                    className="badge bg-primary-subtle text-primary badge-border"
                                  >
                                    USD
                                  </Link>
                                  &nbsp;
                                  <Link
                                    to="#"
                                    className="badge bg-danger-subtle text-danger badge-border"
                                  >
                                    EUR
                                  </Link> */}
                                </div>
                              </div>
                              <div className="d-flex align-items-center">
                                <div>
                                  <i className="ri-wallet-3-line display-5 text-success"></i>
                                </div>
                                <div className="flex-grow-1 text-center">
                                  <h4 className="mb-2">
                                    <CountUp
                                      start={0}
                                      end={47858}
                                      separator=","
                                      prefix="₹"
                                      duration={3}
                                      style={{
                                        color: "#495057",
                                        fontSize: "20px",
                                      }}
                                    />
                                    <small className="text-muted fs-13">
                                      .68k
                                    </small>
                                  </h4>
                                </div>
                              </div>
                              <h6 className="text-muted mb-0">
                                Unique Traded Clients
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
                  <UserCount />
                </Row>
                <Row>
                  <Col>
                    <RevenueDetails />
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
