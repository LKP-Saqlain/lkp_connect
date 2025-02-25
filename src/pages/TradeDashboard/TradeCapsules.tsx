import React from "react";
import { Card, CardBody, Col, Row } from "reactstrap";
import { TradeCapsules } from "../../helper/tableColumns.tsx";
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
      <Row className="capsule-custom d-flex flex-row justify-content-between align-items-center ms-1 mobile-margin">
        {(TradeCapsules || []).map((item, key) => (
          <Col lg={2} md={6} sm={12} key={key}>
            <Card
              className="capsule-hover"
              style={{
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
                border: "1px solid rgba(0, 0, 0, 0.2)",
                height: item.id === 1 ? "80px" : "auto",
              }}
            >
              <CardBody>
                <div className="d-flex align-items-center justify-content-center">
                  <div className="flex-grow-1 text cursor-pointer">
                    <p
                      className="fw-semibold fs-12 mb-1 trade-dash-txt text-center"
                      style={{
                        fontFamily: '"Public Sans", sans-serif',
                        marginTop: item.id === 1 ? "15px" : "auto",
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
