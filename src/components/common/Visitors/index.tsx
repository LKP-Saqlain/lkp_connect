import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
// import getChartColorsArray from "../ChartsDynamicColor";
import "../../../pages/Overview/style.css";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

const StoreVisitsCharts = ({ chartData }: any) => {
  const [labels, setLabels] = useState<string[]>([]);
  const [seriess, setSeriess] = useState<number[]>([]);

  const { user_type } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );

  const chartColors = ["#11395C", "#F57C00"];

  useEffect(() => {
    console.log("chartData", chartData);
    if (user_type === "Employee") {
      const newLabels = chartData.map((item: any) => item.name);
      const newSeries = chartData.map((item: any) => Number(item.value) || 0);
      setLabels(newLabels);
      setSeriess(newSeries);
      console.log("res12", newLabels, newSeries);
    } else {
      const newLabels = Object.keys(chartData);
      const newSeries = Object.values(chartData) as number[];
      setLabels(newLabels);
      setSeriess(newSeries);
      console.log("res12", newLabels, newSeries);
    }
  }, [chartData]);

  useEffect(() => {
    console.log("chartData", chartData);
  }, [chartData]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN").format(value);
  };

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
      formatter: function (label: string, opts: any) {
        const value = opts.w.globals.series[opts.seriesIndex];
        return `${label}: ${formatCurrency(value)}`; // Format label with its value in Indian format
      },
      onItemHover: {
        highlightDataSeries: false, // Prevent dimming on hover
      },
      onItemClick: {
        toggleDataSeries: false, // Prevent toggling of slices on click
      },
    },
    stroke: {
      show: false,
    },
    tooltip: {
      y: {
        formatter: function (val: number) {
          return Intl.NumberFormat("en-IN").format(Math.round(val));
        },
      },
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
