import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Col, Row, Card, CardBody, CardHeader } from "reactstrap";
import { Button } from "@mui/material";
import { CombinedStyles, directStyle, indirectStyle } from "../../utils";

const RegOverview = ({ brokerageData, customClass }: any) => {
  const [latestDates, setLatestDates] = useState<any>("");
  const [selectedButton, setSelectedButton] = useState<string>("Direct");
  const [filteredSeries, setFilteredSeries] = useState<any>([brokerageData]);

  const barColors =
    selectedButton === "Direct"
      ? ["#A8D4FB"]
      : selectedButton === "Indirect"
      ? ["#FFAE69"]
      : ["#A8D4FB", "#FFAE69"];

  useEffect(() => {
    console.log("brokData", brokerageData);
    const categories = [
      "31/10/2024",
      "30/10/2024",
      "29/10/2024",
      "28/10/2024",
      "25/10/2024",
      "24/10/2024",
      "23/10/2024",
    ];
    setLatestDates(categories);
    console.log("categories", categories);
  }, []);

  useEffect(() => {
    // Filter series based on the selected button
    if (selectedButton === "Direct") {
      setFilteredSeries([brokerageData[0]]); // Show only Gross Brokerage
    } else if (selectedButton === "Indirect") {
      setFilteredSeries([brokerageData[1]]); // Show only AP Share
    } else {
      setFilteredSeries(brokerageData); // Show both for Combined
    }
  }, [selectedButton]);

  var options: any = {
    chart: {
      height: 370,
      type: "line",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "straight",
      dashArray: [0, 0, 8],
      width: [0, 3, 0],
    },
    fill: {
      opacity: [1, 1],
    },
    markers: {
      size: [0, 4, 0],
      strokeWidth: 2,
      hover: {
        size: 4,
      },
    },
    xaxis: {
      categories: latestDates,
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      labels: {
        style: {
          fontSize: "10px",
          fontFamily: "Public Sans",
          fontWeight: 400,
          colors: "#333",
        },
      },
    },
    grid: {
      show: true,
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: false,
        },
      },
      padding: {
        top: 0,
        right: -2,
        bottom: 15,
        left: 10,
      },
    },
    legend: {
      show: false, // once it is true then bottom header with their clr will appear
      horizontalAlign: "center",
      offsetX: 0,
      offsetY: -5,
      markers: {
        width: 9,
        height: 9,
        radius: 6,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 0,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
      },
    },
    colors: barColors,
    tooltip: {
      shared: true,
      y: [
        {
          formatter: function (y: any) {
            if (typeof y !== "undefined") {
              return y.toFixed(0);
            }
            return y;
          },
        },
        {
          formatter: function (y: any) {
            if (typeof y !== "undefined") {
              return y.toFixed(2);
            }
            return y;
          },
        },
        {
          formatter: function (y: any) {
            if (typeof y !== "undefined") {
              return y.toFixed(0);
            }
            return y;
          },
        },
      ],
    },
  };
  useEffect(() => {
    console.log("CustomClass", customClass);
  }, [customClass]);

  return (
    <React.Fragment>
      <Row>
        <Col xl={12}>
          <Card
            style={{
              borderRadius: "15px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
            }}
          >
            <CardHeader
              className="p-0 border-0 bg-light-subtle"
              style={{
                borderRadius: "15px 15px 0 0",
                boxShadow: "0 -4px 8px rgba(0, 0, 0, 0.15)",
                backgroundColor: "#fff", // optional for contrast
              }}
            >
              <Row className="g-0 text-center">
                <Col xs={12}>
                  <div className="p-3 border border-dashed border-start-0 d-flex flex-column flex-md-row">
                    <h4 className="card-title mb-2 mb-md-0 flex-grow-1 text-md-start text-center chart-header">
                      {customClass === "chart-one"
                        ? "Brokerage Revenue Details of last 10 days"
                        : customClass === "chart-two"
                        ? "Unique Traded Client for last 10 days"
                        : customClass === "chart-three"
                        ? "Average Brokerage per Traded Client for last 10 days"
                        : customClass === "chart-four"
                        ? "New Accounts opened in last 10 days"
                        : ""}
                    </h4>
                    <div className="d-flex gap-1">
                      {["Direct", "Indirect", "Combined"].map((type) => {
                        // Determine the appropriate style for each button
                        const buttonStyle =
                          type === "Direct"
                            ? directStyle
                            : type === "Indirect"
                            ? indirectStyle
                            : CombinedStyles;

                        return (
                          <div
                            key={type}
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                            }}
                          >
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => setSelectedButton(type)}
                              sx={buttonStyle}
                            >
                              {type}
                            </Button>
                            {selectedButton === type && (
                              <div
                                style={{
                                  height: "2px",
                                  backgroundColor: "#000000", // Your preferred color for the underline
                                  width: "100%",
                                  marginTop: "4px", // Gap between the button and the line
                                }}
                              ></div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Col>
              </Row>
            </CardHeader>
            <CardBody className="p-0 pb-2">
              <div>
                <div dir="ltr" className="apex-charts">
                  <Col>
                    <ReactApexChart
                      dir="ltr"
                      options={options}
                      series={filteredSeries}
                      type="line"
                      height="374"
                      className="apex-charts"
                    />
                  </Col>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default RegOverview;
