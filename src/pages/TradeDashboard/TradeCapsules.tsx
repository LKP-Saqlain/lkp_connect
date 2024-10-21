import React from "react";
import { Card, CardBody, Col, Row, Button } from "reactstrap";
import { TradeCapsules } from "../../components/common/TradeDashBoardData";
import ButtonGroup from "../../components/common/BuutonGroup";

const TradeCapsule = () => {
  const getButtonLabels = (id: number) => {
    switch (id) {
      case 2:
        return {
          button1Label: "Spade",
          button2Label: "Alpha",
          button3Label: "Other",
        };
      case 3:
        return { button1Label: "Future", button2Label: "Option" };
      case 4:
        return {
          button1Label: "Future",
          button2Label: "Option",
        };
      case 5:
        return {
          button1Label: " Future",
          button2Label: " Option",
        };
      default:
        return { button1Label: "", button2Label: "" };
    }
  };
  return (
    <React.Fragment>
      <Row className="capsule-custom">
        {(TradeCapsules || []).map((item, key) => (
          <Col lg={2} md={6} sm={12} key={key}>
            <Card
              className="capsule-hover"
              style={{
                // Set a larger height for id 1 to match the others with buttons
                height: item.id === 1 ? "75px" : "auto",
              }}
            >
              <CardBody>
                <div className="d-flex align-items-center justify-content-center">
                  <div className="flex-grow-1 text cursor-pointer">
                    <p
                      className="fw-semibold fs-12 mb-1 trade-dash-txt text-center"
                      style={{
                        fontFamily: '"Public Sans", sans-serif',
                      }}
                    >
                      {item.label}
                    </p>
                    {item.id > 1 && (
                      <ButtonGroup
                        btnId={item.id}
                        {...getButtonLabels(item.id)}
                      />
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </React.Fragment>
  );
};

export default TradeCapsule;
