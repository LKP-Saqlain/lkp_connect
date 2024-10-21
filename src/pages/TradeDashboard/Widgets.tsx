import React from "react";
import CountUp from "react-countup";
import { Card, CardBody, Col } from "reactstrap";
import { cyptoWidgets } from "../../components/common/TradeDashBoardData";

interface tradeItem {
  handleItemClick(arg: any): any;
}

const Widgets = ({ handleItemClick }: tradeItem) => {
  return (
    <React.Fragment>
      {(cyptoWidgets || []).map((item, key) => (
        <Col lg={3} md={6} key={key}>
          <Card className="rounded-pill capsule-hover">
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
      ))}
    </React.Fragment>
  );
};

export default Widgets;
