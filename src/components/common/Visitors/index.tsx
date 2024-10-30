import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
// import getChartColorsArray from "../ChartsDynamicColor";

const StoreVisitsCharts = ({ dataColors, chartData }: any) => {
  const [labels, setLabels] = useState<string[]>([]);
  const [seriess, setSeriess] = useState<number[]>([]);

  const chartColors = ["#11395C", "#F57C00"];

  useEffect(() => {
    console.log("chartData", chartData);

    const newLabels = Object.keys(chartData);
    const newSeries = Object.values(chartData) as number[];
    console.log("res12", newLabels, newSeries);

    setLabels(newLabels);
    setSeriess(newSeries);
  }, [chartData]);

  useEffect(() => {
    console.log("chartData", chartData);
  }, [chartData]);
  // var chartDonutBasicColors = getChartColorsArray(dataColors);
  const series = seriess;
  var options: any = {
    labels: labels,
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
    colors: chartColors,
  };
  return (
    <React.Fragment>
      <ReactApexChart
        dir="ltr"
        options={options}
        series={series}
        type="donut"
        height="320"
        className="apex-charts"
      />
    </React.Fragment>
  );
};
export { StoreVisitsCharts };
