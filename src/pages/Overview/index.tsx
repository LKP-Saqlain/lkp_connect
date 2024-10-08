import React from "react";
import { Col, Container, Row } from "reactstrap";
import ProjectsOverview from "./ProjectsOverview";
import StoreVisits from "./VisitorsCount";

const DashboardProject = () => {
  document.title = "Projects | Velzon - React Admin & Dashboard Template";
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
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default DashboardProject;
