import React from "react";
import { Card, Col } from "reactstrap";
import HoldingSummary from "./HoldingsChart";

const ClientHoldings = ({ fundamentalShareHolding }: any) => {
  return (
    <React.Fragment>
      <Col
        xl={4}
        style={{
          marginTop: "2rem",
          borderRadius: "23px",
        }}
      >
        <Card
          style={{
            borderRadius: "20px",
            height: "95%", // Allow it to expand dynamically
            boxShadow:
              "0px 4px 8px rgba(0, 0, 0, 0.1), 0px 8px 16px rgba(0, 0, 0, 0.2)",
          }}
        >
          <div className="card-body">
            <h4
              className="card-title text-md-start text-center"
              style={{
                fontFamily: "Poppins",
                marginBottom: "1rem",
                fontWeight: "bold",
                fontSize: "18px",
                color: "#11395C",
              }}
            >
              SHAREHOLDING SUMMARY
            </h4>
            <div dir="ltr">
              <HoldingSummary
                fundamentalShareHolding={fundamentalShareHolding}
              />
            </div>
          </div>
        </Card>
      </Col>
    </React.Fragment>
  );
};

export default ClientHoldings;
