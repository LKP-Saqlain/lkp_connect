import React from "react";
import { Col, Container, Row } from "reactstrap";
import ProjectsOverview from "./ProjectsOverview";
import StoreVisits from "./VisitorsCount";
import Revenue from "./Revenue";

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
                  <StoreVisits />
                </Row>
                <Row>
                  <Col>
                    <Revenue />
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
