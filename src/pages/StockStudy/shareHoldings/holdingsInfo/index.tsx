import React from "react";
import { Card, CardBody, Col } from "reactstrap";

const RecentOrders = ({ fundamentalShareHolding }: any) => {
  const insights = fundamentalShareHolding?.insights || {};

  const promoterInsights = insights.Promoter?.slice(0, 2) || [];
  const institutionalInsights = insights.Institutional?.slice(0, 2) || [];

  const allInsights = [...promoterInsights, ...institutionalInsights];

  return (
    <React.Fragment>
      <Col xl={8} style={{ marginTop: "2rem" }}>
        <Card
          style={{
            minHeight: "415px",
            borderRadius: "23px",
            boxShadow:
              "0px 4px 8px rgba(0, 0, 0, 0.1), 0px 8px 16px rgba(0, 0, 0, 0.2)",
            // border: "2px solid black",
          }}
        >
          <CardBody>
            <div
              style={{
                maxHeight: "415px",
                overflowY: "auto",
                padding: "1rem",
                // border: "2px solid red",
              }}
            >
              {allInsights.length > 0 ? (
                allInsights.map((insight, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor:
                        insight[2] === "positive" ? "#E6F9F5" : "#FCE8E8",
                      borderRadius: "12px",
                      padding: "1rem",
                      marginBottom: "1rem",
                      boxShadow:
                        "0px 2px 4px rgba(0, 0, 0, 0.1), 0px 4px 8px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <strong>{insight[0]}</strong>
                    <p>{insight[1]}</p>
                  </div>
                ))
              ) : (
                <p>No insights available</p>
              )}
            </div>
          </CardBody>
        </Card>
      </Col>
    </React.Fragment>
  );
};

export default RecentOrders;
