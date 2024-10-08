import React from "react";
import ReactApexChart from "react-apexcharts";
import getChartColorsArray from "../ChartsDynamicColor";

const StoreVisitsCharts = ({ dataColors }: any) => {
  var chartDonutBasicColors = getChartColorsArray(dataColors);
  const series = [44, 55, 41, 17, 15];
  var options: any = {
    labels: ["Direct", "Social", "Email", "Other", "Referrals"],
    chart: {
      height: 333,
      type: "donut",
    },
    legend: {
      position: "bottom",
    },
    stroke: {
      show: false,
    },
    dataLabels: {
      dropShadow: {
        enabled: false,
      },
    },
    colors: chartDonutBasicColors,
  };
  return (
    <React.Fragment>
      <ReactApexChart
        dir="ltr"
        options={options}
        series={series}
        type="donut"
        height="333"
        className="apex-charts"
      />
    </React.Fragment>
  );
};
export { StoreVisitsCharts };

export const monthProjectData = [
  {
    name: "Number of Projects",
    type: "bar",
    data: [14, 45, 56, 78, 79, 81, 62, 44, 88, 52, 63, 87],
  },
  {
    name: "Revenue",
    type: "area",
    data: [
      119.25, 128.58, 148.74, 148.87, 17.54, 154.03, 71.24, 78.57, 92.57, 42.36,
      88.51, 76.57,
    ],
  },
  {
    name: "Active Projects",
    type: "bar",
    data: [18, 22, 17, 47, 71, 31, 5, 9, 7, 29, 22, 75],
  },
];
