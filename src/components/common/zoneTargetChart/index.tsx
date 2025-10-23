import React from "react";
import Chart from "react-apexcharts";

interface ZoneTargetChartProps {
  title: string;
  categories: string[];
  series: ApexAxisChartSeries;
  borderRight?: boolean;
  selectedType: "both" | "target" | "achieved";
}

const formatIndianNumber = (num: number) => {
  if (num >= 1_00_00_000) {
    return `${(num / 1_00_00_000).toFixed(1)} Cr`;
  } else if (num >= 1_00_000) {
    return `${(num / 1_00_000).toFixed(1)} L`;
  } else if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)} K`;
  } else {
    return num.toString();
  }
};

const ZoneTargetChart: React.FC<ZoneTargetChartProps> = ({
  title,
  categories,
  series,
  borderRight = false,
  selectedType,
}) => {
  const maxValue = Math.max(...series.flatMap((s) => s.data as number[]));

  const colors =
    selectedType === "both"
      ? ["#11395C", "#F57C00"] // Target + Achieved
      : selectedType === "target"
      ? ["#11395C"] // only Target
      : ["#F57C00"]; // only Achieved

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 4,
        columnWidth: "85%",
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ["transparent"] },
    xaxis: { categories },
    yaxis: {
      min: 0,
      max: Math.ceil(maxValue * 1.1),
      labels: {
        show: true,
        formatter: (val: number) => formatIndianNumber(val),
        style: { fontSize: "11px", colors: "#555" },
      },
    },
    fill: { opacity: 1 },
    colors,
    legend: { show: false }, //  legend hidden
    tooltip: {
      y: {
        formatter: (val: number) => {
          const rounded = Math.ceil(val);
          return rounded.toLocaleString("en-IN");
        },
      },
    },
    title: {
      text: title,
      align: "center",
      style: { fontSize: "14px", fontWeight: 600, color: "#11395c" },
    },
  };

  return (
    <div
      style={{
        flex: 1,
        paddingRight: "20px",
        borderRight: borderRight ? "3px solid #ccc" : "none",
      }}
    >
      <Chart options={options} series={series} type="bar" height={350} />
    </div>
  );
};

export default ZoneTargetChart;
