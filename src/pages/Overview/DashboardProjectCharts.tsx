import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import getChartColorsArray from "../../components/common/ChartsDynamicColor";
import { Col } from "reactstrap";

const barColors = ["#11395C", "#F57C00"];

const ProjectsOverviewCharts = ({ series, brokerageData }: any) => {
  const [latestDates, setLatestDates] = useState<any>("");

  // var linechartcustomerColors = getChartColorsArray(dataColors);

  useEffect(() => {
    console.log("brokData", brokerageData);

    //convert to proper date format
    // const formatDate = (dateString: string) => {
    //   const date = new Date(dateString);
    //   const options: Intl.DateTimeFormatOptions = {
    //     day: "numeric",
    //     month: "short",
    //     year: "2-digit",
    //   };
    //   return date.toLocaleDateString("en-US", options);
    // };

    const categories = brokerageData.map((item: any) => item.Dtrandate);
    setLatestDates(categories);
    console.log("categories", categories);
  }, [brokerageData]);

  // Dynamically calculate max for both series
  const maxGrossBrokerage =
    Math.max(...brokerageData.map((item: any) => item.GrossBrokerage)) * 1.1;
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
      curve: "smooth",
      dashArray: [0, 0, 8],
      width: [0, 1, 0],
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
    },
    // Add yaxis configuration here
    yaxis: [
      {
        title: {
          text: "Bar Range",
        },
        min: 0,
        max: maxGrossBrokerage, // Dynamic max for GrossBrokerage
        labels: {
          formatter: function (value: number) {
            return value.toFixed(2);
          },
        },
      },
      // {
      //   opposite: true,
      //   title: {
      //     text: "AP Share",
      //   },
      //   min: 0,
      //   max: maxAPbrokerage,
      //   labels: {
      //     formatter: function (value: number) {
      //       return value.toFixed(2);
      //     },
      //   },
      // },
    ],
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
    </React.Fragment>
  );
};

const RevenueCharts = ({ series, revenueMonths }: any) => {
  const [mnthYRValues, setMnthYRValues] = useState<string[]>([]);

  useEffect(() => {
    console.log("series", revenueMonths, series);
    const latestMonths = revenueMonths.map((item: any) => item.MnthYR);
    console.log("latestMonts", latestMonths);
    setMnthYRValues(latestMonths);
  }, [revenueMonths, series]);

  // var linechartcustomerColors = getChartColorsArray(dataColors);

  // const revenueBarColor = ["#01D28E", "#6DBBFF"];

  // const brokingRange =
  //   Math.max(...revenueMonths.map((item: any) => item.Ach_brok_dir)) * 1.1;
  // const NonBrokingRange =
  //   Math.max(...revenueMonths.map((item: any) => item.Tot_TPD_rev)) * 1.1;

  var options: any = {
    series: series,
    chart: {
      type: "bar",
      height: 350,
      stacked: true,
      toolbar: {
        show: false, // Hide the toolbar
      },
    },
    stroke: {
      width: 1,
      colors: ["#fff"],
    },
    dataLabels: {
      enabled: false, // Disable data labels
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
    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
    xaxis: {
      categories: mnthYRValues,
    },
    fill: {
      opacity: 1,
    },
    colors: ["#01D28E", "#008FFB", "#F57C00", "#00E396"],
    yaxis: {
      title: {
        text: "Bar Range",
      },
      labels: {
        formatter: (value: any) => {
          return value.toFixed(0);
        },
      },
    },
    legend: {
      position: "bottom",
      horizontalAlign: "center",
    },
    tooltip: {
      enabled: true,
      shared: true,
      intersect: false,
    },
  };
  return (
    <React.Fragment>
      <ReactApexChart
        dir="ltr"
        options={options}
        series={options?.series}
        type="bar"
        height="370"
        className="apex-charts"
      />
    </React.Fragment>
  );
};

const TeamMembersCharts = ({ seriesData, chartsColor }: any) => {
  // const series=  isApexSeriesData.series,
  const series = [seriesData];

  const options: any = {
    chart: {
      type: "radialBar",
      width: 36,
      height: 36,
      sparkline: {
        enabled: !0,
      },
    },
    dataLabels: {
      enabled: !1,
    },
    plotOptions: {
      radialBar: {
        hollow: {
          margin: 0,
          size: "50%",
        },
        track: {
          margin: 1,
        },
        dataLabels: {
          show: !1,
        },
      },
    },
    colors: [chartsColor],
  };
  return (
    <React.Fragment>
      <ReactApexChart
        dir="ltr"
        options={options}
        series={[...series]}
        type="radialBar"
        height="36"
        className="apex-charts"
      />
    </React.Fragment>
  );
};

const PrjectsStatusCharts = ({ dataColors, series }: any) => {
  var donutchartProjectsStatusColors = getChartColorsArray(dataColors);

  var options: any = {
    labels: ["Completed", "In Progress", "Yet to Start", "Cancelled"],
    chart: {
      type: "donut",
      height: 230,
    },
    plotOptions: {
      pie: {
        size: 100,
        offsetX: 0,
        offsetY: 0,
        donut: {
          size: "90%",
          labels: {
            show: false,
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    stroke: {
      lineCap: "round",
      width: 0,
    },
    colors: donutchartProjectsStatusColors,
  };
  return (
    <React.Fragment>
      <ReactApexChart
        dir="ltr"
        options={options}
        series={series}
        type="donut"
        height="230"
        className="apex-charts"
      />
    </React.Fragment>
  );
};

export {
  ProjectsOverviewCharts,
  TeamMembersCharts,
  PrjectsStatusCharts,
  RevenueCharts,
};
