import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Col, Row, Card, CardBody, CardHeader } from "reactstrap";
import { Button } from "@mui/material";

const barColors = ["#ABC4DA"];
const GrossBrokerageColor = ["#FFAF6C"];

const newSeris = [
  {
    name: "Turnover",
    type: "bar",
    data: [
      680051.23, 538044.27, 483511.14, 1065669.67, 542258.31, 717772.02,
      496766.7,
    ],
  },
  {
    name: "Line", // The name of the line series
    type: "line", // Specify the type as line
    data: [
      680051.23, 538044.27, 483511.14, 1065669.67, 542258.31, 717772.02,
      496766.7,
    ], // Same data as the bar series or any other data you want
    markers: {
      size: 5, // Control the size of the markers (points)
    },
    lineSmooth: { enabled: false },
    color: "#11395C",
    tooltip: { enabled: false },
  },
];
const grossBrokerageSeries = [
  {
    name: "Turnover",
    type: "bar",
    data: [
      838044.23, 538044.27, 1283511.14, 1065669.67, 542258.31, 717772.02,
      1496766.7,
    ],
  },
  {
    name: "Line", // The name of the line series
    type: "line", // Specify the type as line
    data: [
      838044.23, 538044.27, 1283511.14, 1065669.67, 542258.31, 717772.02,
      1496766.7,
    ],
    markers: {
      size: 5,
    },
    lineSmooth: { enabled: false },
    color: "#FF7C0D",
    tooltip: { enabled: false },
  },
];

const PerformanceHistoryChart = ({ brokerageData }: any) => {
  const [latestDates, setLatestDates] = useState<any>("");
  const [selectedButton, setSelectedButton] = useState<string>("Daily");

  const selectedStyle = {
    bgcolor: "#11395C",
    color: "#fff",
    borderRadius: "7px",
    fontFamily: "Poppins",
    borderColor: "#ABC4DA",
    textTransform: "capitalize",
  };

  const nonSelectedStyle = {
    bgcolor: "#ABC4DA",
    color: "#11395C",
    borderRadius: "7px",
    fontFamily: "Poppins",
    borderColor: "#ABC4DA",
    textTransform: "capitalize",
  };

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

  // Dynamically calculate max for both series
  //   const maxGrossBrokerage =
  //     Math.max(...brokerageData.map((item: any) => item.GrossBrokerage)) * 1.1;
  // const maxAPbrokerage =
  //   Math.max(...brokerageData.map((item: any) => item.APbrokerage)) * 1.1;

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
          fontSize: "8px",
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
      show: true,
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

  var grossBrokerageOptions: any = {
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
          fontSize: "8px",
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
      show: true,
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
      },
    },
    colors: GrossBrokerageColor,
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

  return (
    <React.Fragment>
      <Row>
        <Col xl={12}>
          <Card>
            <CardHeader className="p-0 border-0 bg-light-subtle">
              <Row className="g-0 text-center">
                <Col xs={12}>
                  <div className="p-3 border border-dashed border-start-0 d-flex flex-column flex-md-row align-items-center">
                    <span className="card-title mb-2 mb-md-0 flex-grow-1 text-md-start text-center chart-header">
                      Performance History
                    </span>
                    <div className="d-flex gap-1">
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setSelectedButton("Daily")}
                        sx={
                          selectedButton === "Daily"
                            ? selectedStyle
                            : nonSelectedStyle
                        }
                      >
                        Daily
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setSelectedButton("Weekly")}
                        sx={
                          selectedButton === "Weekly"
                            ? selectedStyle
                            : nonSelectedStyle
                        }
                      >
                        Weekly
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setSelectedButton("Monthly")}
                        sx={
                          selectedButton === "Monthly"
                            ? selectedStyle
                            : nonSelectedStyle
                        }
                      >
                        Monthly
                      </Button>
                      <Button
                        variant="contained" // MUI equivalent of 'btn-soft-primary'
                        size="small"
                        color="primary" // 'primary' color corresponds to the blue style in MUI
                        onClick={() => setSelectedButton("Yearly")}
                        sx={
                          selectedButton === "Yearly"
                            ? selectedStyle
                            : nonSelectedStyle
                        }
                      >
                        Yearly
                      </Button>
                    </div>
                  </div>
                </Col>
              </Row>
            </CardHeader>
            <CardBody className="p-0 pb-2">
              <Row>
                <Col xs="12" md="6">
                  <div dir="ltr" className="apex-charts">
                    <ReactApexChart
                      dir="ltr"
                      options={options}
                      series={newSeris}
                      type="line"
                      height="374"
                      className="apex-charts"
                    />
                  </div>
                </Col>
                <Col xs="12" md="6">
                  <div dir="ltr" className="apex-charts">
                    <ReactApexChart
                      dir="ltr"
                      options={grossBrokerageOptions}
                      series={grossBrokerageSeries}
                      type="line"
                      height="374"
                      className="apex-charts"
                    />
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default PerformanceHistoryChart;
