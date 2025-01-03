import React from "react";
import { Card, CardBody, Col } from "reactstrap";

const RecentOrders = () => {
  return (
    <React.Fragment>
      <Col xl={8} style={{ marginTop: "2rem" }}>
        <Card
          style={{
            minHeight: "405px",
            borderRadius: "23px",
            boxShadow:
              "0px 4px 8px rgba(0, 0, 0, 0.1), 0px 8px 16px rgba(0, 0, 0, 0.2)",
          }}
        >
          <CardBody>
            <div
              style={{
                maxHeight: "300px", // Adjust height for scrollable content
                overflowY: "auto",
                padding: "1rem",
              }}
            >
              {Array.from({ length: 10 }).map((_, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#E6F9F5" : "#FCE8E8",
                    borderRadius: "12px",
                    padding: "1rem",
                    marginBottom: "1rem",
                    boxShadow:
                      "0px 2px 4px rgba(0, 0, 0, 0.1), 0px 4px 8px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  Lorem ipsum dolor sit amet consectetur. Nisi dis viverra
                  faucibus nulla pulvinar. Scelerisque nibh eget ut aliquam
                  laoreet dolor elementum.
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </Col>
    </React.Fragment>
  );
};

export default RecentOrders;
