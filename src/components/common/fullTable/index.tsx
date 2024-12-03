import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Col, Row, Card, CardBody, CardHeader } from "reactstrap";
import { Button } from "@mui/material";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import dayjs, { Dayjs } from "dayjs";
// import { useTheme } from "@mui/material/styles";

const barColors = ["#11395C", "#F57C00"];
// const GrossBrokerageColor = ["#FFAF6C"];

const newSeries = [
  {
    name: "Gross Brokerage",
    type: "bar",
    data: [
      680051.23, 538044.27, 483511.14, 1065669.67, 542258.31, 496766.77,
      838044.27, 480051.23, 942258.31, 796766.77,
    ],
  },
  {
    name: "AP Share",
    type: "bar",
    data: [
      311562.76, 452921.84, 316700.94, 270955.77, 363095.8, 321967.26,
      538044.27, 890051.23, 542258.31, 942258.31,
    ],
  },
];

const PerformanceHistoryChart = ({ brokerageData }: any) => {
  const [latestDates, setLatestDates] = useState<any>("");
  const [selectedButton, setSelectedButton] = useState<string>("7 Days");
  // const [selectedButton, setSelectedButton] = useState<string>("Daily");

  // const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
      "Equity Intraday",
      "Equity Delivery",
      "Equity Futures",
      "Equity Options",
      "Comm Futures",
      "Comm Options",
      "MF",
      "SPIP",
      "Insurance",
      "Liquiloans",
    ];
    setLatestDates(categories);
    console.log("categories", categories);
  }, []);

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
          fontSize: "12px",
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
                      Segment wise Brokerage
                    </span>
                    <div
                      className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-end"
                      style={{ fontFamily: "Public Sans, sans-serif" }}
                    >
                      <div
                        style={{
                          backgroundColor: "#1c3d5a",
                          width: "16px",
                          height: "16px",
                          marginRight: "8px",
                        }}
                      ></div>
                      <p className="mb-2 mb-md-0 me-4">Gross Brokerage</p>

                      <div
                        style={{
                          backgroundColor: "#f57c00",
                          width: "16px",
                          height: "16px",
                          marginRight: "8px",
                        }}
                      ></div>
                      <p className="mb-0" style={{ marginRight: "20px" }}>
                        AP Share
                      </p>
                    </div>
                    <div className="d-flex gap-1">
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setSelectedButton("7 Days")}
                        sx={
                          selectedButton === "7 Days"
                            ? selectedStyle
                            : nonSelectedStyle
                        }
                      >
                        7 Days
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setSelectedButton("15 Days")}
                        sx={
                          selectedButton === "15 Days"
                            ? selectedStyle
                            : nonSelectedStyle
                        }
                      >
                        15 Days
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setSelectedButton("1 Month")}
                        sx={
                          selectedButton === "1 Month"
                            ? selectedStyle
                            : nonSelectedStyle
                        }
                      >
                        1 Month
                      </Button>
                      <Button
                        variant="contained" // MUI equivalent of 'btn-soft-primary'
                        size="small"
                        color="primary" // 'primary' color corresponds to the blue style in MUI
                        onClick={() => setSelectedButton("3 Months")}
                        sx={
                          selectedButton === "3 Months"
                            ? selectedStyle
                            : nonSelectedStyle
                        }
                      >
                        3 Months
                      </Button>
                      <Button
                        variant="contained" // MUI equivalent of 'btn-soft-primary'
                        size="small"
                        color="primary" // 'primary' color corresponds to the blue style in MUI
                        onClick={() => setSelectedButton("6 Months")}
                        sx={
                          selectedButton === "6 Months"
                            ? selectedStyle
                            : nonSelectedStyle
                        }
                      >
                        6 Months
                      </Button>
                      <Button
                        variant="contained" // MUI equivalent of 'btn-soft-primary'
                        size="small"
                        color="primary" // 'primary' color corresponds to the blue style in MUI
                        onClick={() => setSelectedButton("12 Months")}
                        sx={
                          selectedButton === "12 Months"
                            ? selectedStyle
                            : nonSelectedStyle
                        }
                      >
                        12 Months
                      </Button>
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
                      series={newSeries}
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

export default PerformanceHistoryChart;
