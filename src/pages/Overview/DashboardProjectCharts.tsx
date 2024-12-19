import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import getChartColorsArray from "../../components/common/ChartsDynamicColor";
import { Col } from "reactstrap";

const barColors = ["#11395C", "#F57C00"];

const ProjectsOverviewCharts = ({ series, brokerageData }: any) => {
  const [latestDates, setLatestDates] = useState<any>("");

  useEffect(() => {
    console.log("brokData", brokerageData);

    const categories = brokerageData.map((item: any) => item.Dtrandate);
    setLatestDates(categories);
    console.log("categories", categories);
  }, [brokerageData]);

  var options: any = {
    chart: {
      height: 370,
      type: "bar",
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
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "12px",
        fontWeight: "bold",
        colors: ["#71797E"], // Text color
      },
      background: {
        enabled: false,
        foreColor: "black", // Text color inside the background
        // color: "#333", // Background color
        borderRadius: 2,
        padding: 4,
      },
      formatter: function (value: number) {
        return new Intl.NumberFormat("en-IN").format(Math.round(value)); // Format the value
      },
      offsetY: -10, // Adjust the position of the labels
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
          fontWeight: 600,
        },
      },
    },

    yaxis: {
      show: false, // Completely hide the Y-axis
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
      y: [
        {
          formatter: function (y: any) {
            if (typeof y !== "undefined") {
              return new Intl.NumberFormat("en-IN").format(Math.round(y)); // Remove decimals
            }
            return y;
          },
        },
        {
          formatter: function (y: any) {
            if (typeof y !== "undefined") {
              return new Intl.NumberFormat("en-IN").format(Math.round(y)); // Remove decimals
            }
            return y;
          },
        },
        {
          formatter: function (y: any) {
            if (typeof y !== "undefined") {
              return new Intl.NumberFormat("en-IN").format(Math.round(y)); // Remove decimals
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
  const [totals, setTotals] = useState<number[]>([]);

  useEffect(() => {
    console.log("series", revenueMonths, series);
    const latestMonths = revenueMonths.map((item: any) => item.MnthYR);
    console.log("latestMonts", latestMonths);
    setMnthYRValues(latestMonths);

    // Calculate totals for each category (stack)
    const calculatedTotals = revenueMonths.map((_: any, index: number) =>
      series.reduce((sum: number, s: any) => sum + (s.data[index] || 0), 0)
    );
    setTotals(calculatedTotals);
  }, [revenueMonths, series]);

  const directBrokingData = series[0]?.data || [];
  const indirectBrokingData = series[1]?.data || [];

  var options: any = {
    series: [
      {
        name: "Direct-Broking",
        data: directBrokingData,
      },
      {
        name: "Indirect-Broking",
        data: indirectBrokingData,
      },
    ],
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
      enabled: false,
      style: {
        fontSize: "8px",
        fontWeight: "bold",
        colors: ["#fff"], // Individual stack values in white
      },
      formatter: function (val: number) {
        // const stackIndex = opts.dataPointIndex;
        // const seriesIndex = opts.seriesIndex;
        // const stackTotal = totals[stackIndex];

        // Show individual stack values
        if (val > 0) {
          return new Intl.NumberFormat("en-IN").format(val);
        }

        return ""; // Hide labels for zero values
      },
      offsetY: 0, // Adjust the vertical position for individual values
    },
    annotations: {
      points: totals.map((total, index) => ({
        x: mnthYRValues[index], // Bar category (month-year)
        y: total, // Total value
        marker: {
          size: 0, // No marker
        },
        label: {
          text: new Intl.NumberFormat("en-IN").format(total), // Show total
          style: {
            fontSize: "12px",
            fontWeight: "bold",
            color: "#71797E", // Text color
            // below style to remove top label bg box
            background: "transparent", // Remove background box
            borderWidth: 0, // Ensure no border
            borderRadius: 0, // Remove any rounding
            padding: 0, // Remove padding
          },
        },
      })),
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
        horizontal: false, // Keep bars vertical
        columnWidth: "50%", // Adjust the width of bars
      },
    },
    xaxis: {
      categories: mnthYRValues,
      labels: {
        style: {
          fontSize: "12px",
          fontWeight: 600,
        },
      },
    },
    fill: {
      opacity: 1,
    },
    colors: ["#52c41a", "#faad14"],
    // yaxis: {
    //   title: {
    //     text: "Broking Revenue",
    //   },
    //   labels: {
    //     formatter: (value: any) => {
    //       return new Intl.NumberFormat("en-IN").format(value);
    //     },
    //     style: {
    //       fontSize: "11px",
    //       fontWeight: 600,
    //       colors: "#333",
    //     },
    //   },
    // },
    yaxis: {
      show: false, // Completely hide the Y-axis
    },
    legend: {
      // show: false,
      // position: "bottom",
      // horizontalAlign: "center",
    },
    tooltip: {
      enabled: true,
      shared: true,
      intersect: false,
      y: {
        formatter: (value: number) => {
          return new Intl.NumberFormat("en-IN").format(value); // Format value in Indian style
        },
      },
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

const RevenueNonBrokingCharts = ({ series, revenueMonths }: any) => {
  const [mnthYRValues, setMnthYRValues] = useState<string[]>([]);
  const [totals, setTotals] = useState<number[]>([]);

  useEffect(() => {
    console.log("series", revenueMonths, series);
    const latestMonths = revenueMonths.map((item: any) => item.MnthYR);
    console.log("latestMonts", latestMonths);
    setMnthYRValues(latestMonths);

    // Calculate totals for each category (stack)
    const calculatedTotals = revenueMonths.map((_: any, index: number) =>
      series.reduce((sum: number, s: any) => sum + (s.data[index] || 0), 0)
    );
    setTotals(calculatedTotals);
  }, [revenueMonths, series]);

  const TPD_Insurance = series[0]?.data || [];
  const TPD_Liq_Loans = series[1]?.data || [];
  const spIp = series[2]?.data || [];
  const TPD_mutualfunds = series[3]?.data || [];

  var options: any = {
    series: [
      {
        name: "Mutual Funds",
        data: TPD_mutualfunds,
      },
      {
        name: "SPIP",
        data: spIp,
      },
      {
        name: "Insurance",
        data: TPD_Insurance,
      },
      {
        name: "Liquiloans",
        data: TPD_Liq_Loans,
      },
    ],
    chart: {
      type: "bar",
      height: 350,
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    stroke: {
      width: 1,
      colors: ["#fff"],
    },
    dataLabels: {
      enabled: false,
      style: {
        fontSize: "9px",
        fontWeight: "bold",
        colors: ["#fff"],
      },
      formatter: function (val: number) {
        if (val > 0) {
          return new Intl.NumberFormat("en-IN").format(val);
        }

        return "";
      },
      offsetY: 0,
    },
    annotations: {
      points: totals.map((total, index) => ({
        x: mnthYRValues[index],
        y: total,
        marker: {
          size: 0,
        },
        label: {
          text: new Intl.NumberFormat("en-IN").format(total),
          style: {
            fontSize: "12px",
            fontWeight: "bold",
            color: "#71797E",
            // below style to remove top label bg box
            background: "transparent", // Remove background box
            borderWidth: 0, // Ensure no border
            borderRadius: 0, // Remove any rounding
            padding: 0, // Remove padding
          },
        },
      })),
    },
    grid: {
      show: true,
      xaxis: {
        lines: {
          show: false,
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
        columnWidth: "50%",
      },
    },
    xaxis: {
      categories: mnthYRValues,
      labels: {
        style: {
          fontSize: "12px",
          fontWeight: 600,
        },
      },
    },
    fill: {
      opacity: 1,
    },
    colors: ["#1890ff", "#52c41a", "#faad14", "#00E396"],
    yaxis: {
      show: false, // Completely hide the Y-axis
    },
    legend: {
      // show: false,
      // position: "bottom",
      // horizontalAlign: "center",
    },
    tooltip: {
      enabled: true,
      shared: true,
      intersect: false,
      y: {
        formatter: (value: number) => {
          return new Intl.NumberFormat("en-IN").format(value); // Format value in Indian style
        },
      },
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
  RevenueNonBrokingCharts,
};
