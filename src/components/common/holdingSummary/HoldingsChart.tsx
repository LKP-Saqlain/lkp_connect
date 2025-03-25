import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const StoreVisitsCharts = ({ fundamentalShareHolding }: any) => {
  const [chartData, setChartData] = useState<{
    labels: string[];
    series: number[];
  }>({
    labels: [],
    series: [],
  });

  useEffect(() => {
    if (fundamentalShareHolding?.summaryData) {
      const summaryData = fundamentalShareHolding.summaryData;

      const labels = summaryData.slice(1).map((item: any) => item[0]);
      const series = summaryData.slice(1).map((item: any) => item[1]);
      setChartData({ labels, series });
    }
  }, [fundamentalShareHolding]);
  const chartColors = ["#01D28E", "#FF7C0D", "#11395C", "#FE4747", "#6DBBFF"];

  // const series = [44, 55, 41, 17, 15];
  var options: any = {
    labels: chartData.labels,
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
    plotOptions: {
      pie: {
        donut: {
          size: "50%", // Adjust the size to make the donut wider (default is "65%")
        },
      },
    },
  };
  return (
    <>
      <div>
        <ReactApexChart
          dir="ltr"
          options={options}
          series={chartData.series}
          type="donut"
          height="333"
          className="apex-charts"
        />
      </div>
    </>
  );
};

export default StoreVisitsCharts;
