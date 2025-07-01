import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Col, Row, Card, CardBody, CardHeader } from "reactstrap";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { ClientSegBrok } from "../../../redux/thunk/ClientSegmentBrokerage";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
// import ButtonGroup from "../../common/ButtonGroup";
// import ShowToast from "../../../utils/toastUtils";
import { Box, Button, Typography } from "@mui/material";
import { apiServices } from "../../../services";

const barColors = [
  "#4E79A7", // Soft Blue
  "#F28E2B", // Orange
  "#EDC948", // Mustard Yellow
  "#59A14F", // Green
  "#E15759", // Coral Red
  "#76B7B2", // Teal
];

const categories = [
  "Equity Intraday",
  "Equity Delivery",
  "Equity Futures",
  "Equity Options",
  "Commodity Futures",
  "Commodity Options",
  "Currency Futures",
  "Currency Options",
  "SLBM",
];

const PerformanceHistoryChart = ({ selectedClientCode }: any) => {
  const [selectedButton, setSelectedButton] = useState<string>("Last 30 days");
  const [grossBrokerageData, setGrossBrokerageData] = useState<number[]>([]);
  const [monthBrokerageData, setMonthBrokerageData] = useState<{
    data: number[];
    labels: string[];
  }>({
    data: [],
    labels: [],
  });

  const dispatch = useDispatch<AppDispatch>();

  // const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchBrokerage = async () => {
      const payload = {
        clientcode: selectedClientCode,
      };

      dispatch(showLoader("Please wait, we are processing your request..."));

      apiServices
        .GetClientWiseBrokerage(payload)
        .then((response: any) => {
          const fetchedBrokerageData = response?.data?.data;
          console.log("fetchedBrokerageData raw", fetchedBrokerageData);

          if (fetchedBrokerageData && Array.isArray(fetchedBrokerageData)) {
            const data = fetchedBrokerageData.map(
              (item: any) => item.brokerage ?? 0
            );
            const labels = fetchedBrokerageData.map(
              (item: any) => item.monthyr ?? ""
            );

            setMonthBrokerageData({
              data,
              labels,
            });

            console.log("Mapped monthBrokerageData", { data, labels });
          }
        })

        .catch((Err: any) => {
          const { message } = Err;
          console.log("Error->", message);
          dispatch(hideLoader());
        })
        .finally(() => {
          dispatch(hideLoader());
        });
    };
    fetchBrokerage();
  }, [dispatch, selectedClientCode]);

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
        // clientCode: "24215", //24215 for show data in all btns
        fromDate: formattedFromDate,
        toDate: formattedToDate, //"2024/12/01",
      };
      dispatch(showLoader("Please wait, we are processing your request..."));
      dispatch(ClientSegBrok(payload))
        .unwrap()
        .then((res) => {
          console.log(formattedFromDate, "TypeCheck", typeof res?.data);
          console.log("ClientSegmentBrokerageResponse", res?.data?.data);
          if (typeof res?.data === "string") {
            // ShowToast("error", res?.data);
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
    fontSize: "10px",
  };

  const nonSelectedStyle = {
    bgcolor: "#ABC4DA",
    color: "#11395C",
    borderRadius: "7px",
    fontFamily: "Poppins",
    borderColor: "#ABC4DA",
    fontSize: "10px",
  };

  const barOptions: any = (labels: string[]) => ({
    labels,

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
      enabled: false,
      formatter: function (val: number) {
        return Math.round(val);
      },
    },
    tooltip: {
      y: {
        formatter: function (val: number) {
          return Intl.NumberFormat("en-IN").format(Math.round(val));
        },
      },
    },
    yaxis: {
      labels: {
        formatter: function (val: number) {
          return Math.round(val).toString(); // ensures no decimals
        },
      },
    },
    colors: barColors,
  });

  // const DonutOptions: any = {
  //   labels: categories,
  //   chart: {
  //     height: 370,
  //     type: "donut",
  //   },
  //   legend: {
  //     show: false,
  //   },
  //   stroke: {
  //     show: false,
  //   },
  //   dataLabels: {
  //     formatter: function (val: number) {
  //       return Math.round(val) + "%";
  //     },
  //     dropShadow: {
  //       enabled: false,
  //     },
  //   },
  //   tooltip: {
  //     y: {
  //       formatter: function (val: number) {
  //         return Intl.NumberFormat("en-IN").format(Math.round(val));
  //       },
  //     },
  //   },
  //   colors: barColors,
  // };

  // const series = grossBrokerageData;

  const seriess = [
    {
      name: "Brokerage",
      type: "bar",
      data: grossBrokerageData,
    },
  ];

  return (
    <React.Fragment>
      <Row>
        <Col xl={6}>
          <Card
            className="card-height-100"
            style={{
              borderRadius: "15px",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
            }}
          >
            <CardHeader
              className="align-items-center d-flex"
              style={{
                borderRadius: "15px 15px 0 0",
                boxShadow: "0 -4px 8px rgba(0, 0, 0, 0.15)",
                backgroundColor: "#fff", // optional for contrast
              }}
            >
              <h4 className="card-title flex-grow-1 d-flex justify-content-start">
                Month-wise Brokerage
              </h4>
            </CardHeader>
            <CardBody>
              <ReactApexChart
                options={barOptions(monthBrokerageData.labels)}
                series={[
                  {
                    name: "Brokerage",
                    data: monthBrokerageData.data,
                  },
                ]}
                type="bar"
                height={350}
              />
            </CardBody>
          </Card>
        </Col>
        <Col xl={6}>
          <Card
            className="card-height-100"
            style={{
              borderRadius: "15px",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
            }}
          >
            <CardHeader
              className="align-items-center d-flex"
              style={{
                borderRadius: "15px 15px 0 0",
                boxShadow: "0 -4px 8px rgba(0, 0, 0, 0.15)",
                backgroundColor: "#fff", // optional for contrast
              }}
            >
              <h4 className="card-title flex-grow-1  d-flex justify-content-start">
                Segment-wise Brokerage
              </h4>
              <div className="d-flex gap-1 justify-content-end">
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
                  // variant="outlined"
                  // size="small"
                  onClick={() => setSelectedButton("MTD")}
                  sx={
                    selectedButton === "MTD" ? selectedStyle : nonSelectedStyle
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
                    selectedButton === "YTD" ? selectedStyle : nonSelectedStyle
                  }
                >
                  YTD
                </Button>
              </div>
            </CardHeader>
            <CardBody className="p-0 pb-2">
              <div>
                <div dir="ltr" className="apex-charts">
                  <Col>
                    {grossBrokerageData.length > 0 ? (
                      <ReactApexChart
                        // dir="ltr"
                        // options={barOptions}
                        options={barOptions(categories)}
                        series={seriess}
                        type="bar"
                        height="374"
                        className="apex-charts"
                      />
                    ) : (
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        height={350}
                      >
                        <Typography variant="body1" color="textSecondary">
                          No records!
                        </Typography>
                      </Box>
                    )}
                  </Col>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
        {/* <Col xl={6}>
          <Card
            className="card-height-100"
            style={{
              borderRadius: "15px",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
            }}
          >
            <CardHeader
              className="align-items-center d-flex"
              style={{
                borderRadius: "15px 15px 0 0",
                boxShadow: "0 -4px 8px rgba(0, 0, 0, 0.15)",
                backgroundColor: "#fff", // optional for contrast
              }}
            >
              <h4 className="card-title flex-grow-1">Segment-wise Brokerage</h4>
            </CardHeader>
            <CardBody className="">
              <div>
                <div dir="ltr" className="apex-charts">
                  <Col>
                    {/* <ReactApexChart
                      // dir="ltr"
                      options={DonutOptions}
                      series={series.length > 0 ? series : [0]}
                      type="donut"
                      height={350}
                      // className="apex-charts"
                    /> */}
        {/* {series.length > 0 ? (
                      <ReactApexChart
                        options={DonutOptions}
                        series={series}
                        type="donut"
                        height={350}
                      />
                    ) : (
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        height={350}
                      >
                        <Typography variant="body1" color="textSecondary">
                          No records!
                        </Typography>
                      </Box>
                    )}
                  </Col>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col> */}
      </Row>
    </React.Fragment>
  );
};

export default PerformanceHistoryChart;
