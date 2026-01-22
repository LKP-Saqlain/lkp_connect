import React, { useEffect } from "react";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";

const Expiry = ({ activeSubItem }: any) => {
  useEffect(() => {
    console.log("Expiry_Component", activeSubItem);
  }, [activeSubItem]);

  return (
    <React.Fragment>
      <div className="page-content page-view">
        <div className="container-fluid">
          <Row className="row-font">
            <Col lg={12}>
              <Card
                style={{
                  minHeight: "80vh",
                  borderRadius: "15px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                }}
              >
                <CardHeader
                  style={{
                    borderRadius: "15px 15px 0 0",
                    boxShadow: "0 -4px 8px rgba(0, 0, 0, 0.15)",
                    backgroundColor: "#fff",
                    padding: "0.2rem 0.8rem",
                  }}
                >
                  <h4 className="card-title mb-0">Expiry Component</h4>
                </CardHeader>
                <CardBody></CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Expiry;
