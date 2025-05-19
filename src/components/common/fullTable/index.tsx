import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Col, Row, Card, CardBody, CardHeader } from "reactstrap";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { ClientSegBrok } from "../../../redux/thunk/ClientSegmentBrokerage";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
import ButtonGroup from "../../common/ButtonGroup";
import ShowToast from "../../../utils/toastUtils";
import { Button } from "@mui/material";

const barColors = ["#11395C", "#F57C00"];
const categories = [
  "Equity Intraday",
  "Equity Delivery",
  "Equity Futures",
  "Equity Options",
  "Commodity Futures",
  "Commodity Options",
];

const PerformanceHistoryChart = ({ selectedClientCode }: any) => {
  const [selectedButton, setSelectedButton] = useState<string>("7 Days");

  const [grossBrokerageData, setGrossBrokerageData] = useState<number[]>([]);

  const dispatch = useDispatch<AppDispatch>();

  // const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchClientBrokerage = () => {
      const Id = localStorage.getItem("Id");
      const currentDate = new Date();
      let fromDate, toDate;

      switch (selectedButton) {
        case "Last 30 days":
          fromDate = new Date(currentDate);
          fromDate.setDate(currentDate.getDate() - 30);
          break;
        case "Last 90 days":
          fromDate = new Date(currentDate);
          fromDate.setDate(currentDate.getDate() - 90);
          break;
        case "MTD": // Month to Date
          fromDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            1
          ); // 1st of current month
          break;
        case "YTD":
          const year =
            currentDate.getMonth() >= 3
              ? currentDate.getFullYear()
              : currentDate.getFullYear() - 1;
          fromDate = new Date(year, 3, 1);
          break;
        default:
          fromDate = new Date(currentDate);
          fromDate.setDate(currentDate.getDate() - 30);
      }

      toDate = new Date(currentDate);

      const formattedFromDate = fromDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
      const formattedToDate = toDate.toISOString().split("T")[0];

      let payload = {
        user_id: Id,
        clientCode: selectedClientCode, //24215 for show data in all btns
        fromDate: formattedFromDate,
        toDate: formattedToDate, //"2024/12/01",
      };
      dispatch(showLoader("Please wait"));
      dispatch(ClientSegBrok(payload))
        .unwrap()
        .then((res) => {
          console.log(formattedFromDate, "TypeCheck", typeof res?.data);
          console.log("ClientSegmentBrokerageResponse", res?.data);
          if (typeof res?.data === "string") {
            ShowToast("error", res?.data);
            setGrossBrokerageData([]);
          }
          if (typeof res?.data === "object") {
            const responseData = res?.data?.data[0];
            if (responseData) {
              const mappedData = categories.map(
                (category) => responseData[category.replace(/ /g, "_")]
              );
              console.log("responseData", mappedData);

              setGrossBrokerageData(mappedData);
            }
          }
        })
        .catch((err) => {
          console.log("ResponseError-->", err);
          dispatch(hideLoader());
        })
        .finally(() => {
          dispatch(hideLoader());
        });
    };
    fetchClientBrokerage();
  }, [dispatch, selectedButton, selectedClientCode]);

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
  var options: any = {
    chart: {
      zoom: {
        enabled: false,
      },
      height: 370,
      type: "bar",
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: true, // Enable data labels
      formatter: function (value: number) {
        return new Intl.NumberFormat("en-IN").format(value); // Format the value
      },
      style: {
        fontSize: "12px",
        fontFamily: "Public Sans",
        fontWeight: 500,
        colors: ["#000"], // Label color
      },
      offsetY: -5, // Adjust the position of the labels (optional)
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
      categories: categories,
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
          fontWeight: 500,
          colors: "#000",
        },
      },
    },
    yaxis: {
      labels: {
        formatter: function (value: number) {
          return new Intl.NumberFormat("en-IN").format(value); // Format y-axis labels
        },
        style: {
          fontSize: "12px",
          fontFamily: "Public Sans",
          fontWeight: 500,
          colors: "#000",
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
      shared: false,
      y: {
        formatter: function (y: any) {
          if (typeof y !== "undefined") {
            return new Intl.NumberFormat("en-IN").format(Math.round(y));
          }
          return y;
        },
      },
    },
  };

  const series = [
    {
      name: "Gross Brokerage",
      type: "bar",
      data: grossBrokerageData,
    },
  ];

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
                    {/* <div
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
                    </div> */}
                    <div className="d-flex gap-1">
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setSelectedButton("Last 30 days")}
                        sx={
                          selectedButton === "Last 30 days"
                            ? selectedStyle
                            : nonSelectedStyle
                        }
                      >
                        Last 30 days
                      </Button>
                      <Button
                        variant="outlined" // MUI equivalent of 'btn-soft-primary'
                        size="small"
                        color="primary" // 'primary' color corresponds to the blue style in MUI
                        onClick={() => setSelectedButton("Last 90 days")}
                        sx={
                          selectedButton === "Last 90 days"
                            ? selectedStyle
                            : nonSelectedStyle
                        }
                      >
                        Last 90 days
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setSelectedButton("MTD")}
                        sx={
                          selectedButton === "MTD"
                            ? selectedStyle
                            : nonSelectedStyle
                        }
                      >
                        MTD
                      </Button>
                      <Button
                        variant="outlined" // MUI equivalent of 'btn-soft-primary'
                        size="small"
                        color="primary" // 'primary' color corresponds to the blue style in MUI
                        onClick={() => setSelectedButton("YTD")}
                        sx={
                          selectedButton === "YTD"
                            ? selectedStyle
                            : nonSelectedStyle
                        }
                      >
                        YTD
                      </Button>{" "}
                      {/* <Button
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
                      </Button> */}
                      {/* <Button
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
                      </Button> */}
                    </div>
                    <ButtonGroup
                      selectedButton={selectedButton}
                      setSelectedButton={setSelectedButton}
                      selectedStyle={selectedStyle}
                      nonSelectedStyle={nonSelectedStyle}
                      customClass={true}
                    />
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
                      series={series}
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
