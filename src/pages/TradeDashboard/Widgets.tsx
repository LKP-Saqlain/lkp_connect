import React from "react";
import { Card, CardBody, Col } from "reactstrap";
import { cyptoWidgets } from "../../helper/tableColumns.tsx";

interface SelectedWidgetProps {
  selectedWidget: string;
  handleItemClick(arg: any): any;
}

const Widgets = ({ selectedWidget, handleItemClick }: SelectedWidgetProps) => {
  return (
    <React.Fragment>
      {(cyptoWidgets || []).map((item, key) => {
        const isSelected = selectedWidget === item.label;

        return (
          <Col key={key}>
            <Card
              className={`rounded-pill capsule-hover ${
                isSelected ? "selected-widget" : ""
              }`}
              style={{
                boxShadow: isSelected
                  ? "0 4px 12px rgba(0, 0, 0, 0.6)"
                  : "0 4px 8px rgba(0, 0, 0, 0.4)",
                border: "1px solid rgba(0, 0, 0, 0.2)",
                backgroundColor: isSelected ? "#11395C" : "#fff",
                color: isSelected ? "#fff" : "#000",
                marginTop: "0px",
                marginBottom: "8px",
              }}
            >
              <CardBody>
                <div className="d-flex align-items-center justify-content-row">
                  <div className="flex-grow-1 text cursor-pointer">
                    <p
                      className="fw-semibold fs-12 mb-1 trade-dash-txt text-center"
                      style={{
                        fontFamily: '"Public Sans", sans-serif',
                      }}
                      onClick={() => handleItemClick(item.label)}
                    >
                      {item.label}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        );
      })}
    </React.Fragment>
  );
};

export default Widgets;
