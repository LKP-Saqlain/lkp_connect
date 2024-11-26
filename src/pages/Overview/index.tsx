import React from "react";
import { Col, Container, Row } from "reactstrap";
import ProjectsOverview from "./ProjectsOverview";
import UserCount from "./VisitorsCount";
// import BrokingRevenue from "./Revenue/BrokingRevenue";
import RevenueDetails from "./Revenue";

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
