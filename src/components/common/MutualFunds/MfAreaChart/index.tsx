import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";
import ApexCharts from "apexcharts";

interface ApexChartProps {
  series: { name?: string; data: [number, number][] }[];
  defaultRange?:
    | "one_week"
    | "one_month"
    | "three_months"
    | "six_months"
    | "one_year"
    | "three_years"
    | "five_years"
    | "ytd"
    | "all";
  height?: number;
  title?: string;
}

const MfAreaChart: React.FC<ApexChartProps> = ({
  series,
  defaultRange = "one_year",
  height = 350,
  title,
}) => {
  const [selection, setSelection] = useState(defaultRange);

  const options: ApexCharts.ApexOptions = {
    chart: {
      id: "area-datetime",
      type: "area",
      height,
      zoom: { autoScaleYaxis: true },
    },
    colors: ["#2d8a0b"], // ✅ custom line color
    dataLabels: { enabled: false },
    markers: { size: 0 },
    xaxis: {
      type: "datetime",
      tickAmount: 6,
    },
    tooltip: { x: { format: "dd MMM yyyy" } },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 100],
      },
      colors: ["#2d8a0b"], // ✅ custom fill color
    },
    stroke: {
      curve: "smooth",
      width: 3,
      colors: ["#2d8a0b"], // ✅ custom stroke color
    },
  };
  const getDateRange = (rangeKey: string, data: [number, number][]) => {
    if (!data || data.length === 0) return [0, 0];

    const sorted = [...data].sort((a, b) => a[0] - b[0]); // sort by timestamp
    const end = sorted[sorted.length - 1][0]; // latest date
    const startMap: { [key: string]: number } = {
      one_week: end - 7 * 24 * 60 * 60 * 1000,
      one_month: end - 30 * 24 * 60 * 60 * 1000,
      three_months: end - 90 * 24 * 60 * 60 * 1000,
      six_months: end - 180 * 24 * 60 * 60 * 1000,
      one_year: end - 365 * 24 * 60 * 60 * 1000,
      three_years: end - 3 * 365 * 24 * 60 * 60 * 1000,
      five_years: end - 5 * 365 * 24 * 60 * 60 * 1000,
      ytd: new Date(new Date(end).getFullYear(), 0, 1).getTime(),
      all: sorted[0][0], // beginning of dataset
    };

    const start = startMap[rangeKey] || sorted[0][0];
    return [start, end];
  };

  const updateData = (timeline: typeof defaultRange) => {
    setSelection(timeline);

    if (!series || !series[0]?.data?.length) return;

    const [start, end] = getDateRange(timeline, series[0].data);
    ApexCharts.exec("area-datetime", "zoomX", start, end);
  };

  const ranges = [
    { key: "one_week", label: "1W" },
    { key: "one_month", label: "1M" },
    { key: "three_months", label: "3M" },
    { key: "six_months", label: "6M" },
    { key: "one_year", label: "1Y" },
    { key: "three_years", label: "3Y" },
    { key: "five_years", label: "5Y" },
    { key: "ytd", label: "YTD" },
    { key: "all", label: "ALL" },
  ] as const;

  return (
    <div>
      {title && <h4 style={{}}>{title}</h4>}
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "16px",
          flexWrap: "wrap",
          justifyContent: "flex-end",
        }}
      >
        {ranges.map((range) => (
          <button
            key={range.key}
            onClick={() => updateData(range.key)}
            style={{
              padding: "5px 10px",
              borderRadius: "20px",
              fontSize: "12px",
              border:
                selection === range.key
                  ? "2px solid #007bff"
                  : "1px solid #ddd",
              background: selection === range.key ? "#007bff" : "#f9f9f9",
              color: selection === range.key ? "#fff" : "#333",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow:
                selection === range.key
                  ? "0 2px 6px rgba(0, 123, 255, 0.3)"
                  : "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            {range.label}
          </button>
        ))}
      </div>
      {/* Chart */}
      <ReactApexChart
        options={options}
        series={series}
        type="area"
        height={height}
      />
    </div>
  );
};

export default MfAreaChart;

// import React, { useState } from "react";
// import ReactApexChart from "react-apexcharts";
// import ApexCharts from "apexcharts";

// interface ApexChartProps {
//   series: { name?: string; data: [number, number][] }[];
//   defaultRange?: "one_month" | "six_months" | "one_year" | "ytd" | "all";
//   height?: number;
//   title?: string;
// }

// const MfAreaChart: React.FC<ApexChartProps> = ({
//   series,
//   defaultRange = "one_year",
//   height = 350,
//   title,
// }) => {
//   const [selection, setSelection] = useState(defaultRange);

//   const options: ApexCharts.ApexOptions = {
//     chart: {
//       id: "area-datetime",
//       type: "area",
//       height,
//       zoom: { autoScaleYaxis: true },
//     },
//     dataLabels: { enabled: false },
//     markers: {
//       size: 0,

//       // style: "hollow"
//     },
//     xaxis: {
//       type: "datetime",
//       min: new Date("01 Mar 2012").getTime(),
//       tickAmount: 6,
//     },
//     tooltip: { x: { format: "dd MMM yyyy" } },
//     fill: {
//       type: "gradient",
//       gradient: {
//         shadeIntensity: 1,
//         opacityFrom: 0.7,
//         opacityTo: 0.9,
//         stops: [0, 100],
//       },
//     },
//   };

//   const updateData = (timeline: typeof defaultRange) => {
//     setSelection(timeline);

//     switch (timeline) {
//       case "one_month":
//         ApexCharts.exec(
//           "area-datetime",
//           "zoomX",
//           new Date("28 Jan 2013").getTime(),
//           new Date("27 Feb 2013").getTime()
//         );
//         break;
//       case "six_months":
//         ApexCharts.exec(
//           "area-datetime",
//           "zoomX",
//           new Date("27 Sep 2012").getTime(),
//           new Date("27 Feb 2013").getTime()
//         );
//         break;
//       case "one_year":
//         ApexCharts.exec(
//           "area-datetime",
//           "zoomX",
//           new Date("27 Feb 2012").getTime(),
//           new Date("27 Feb 2013").getTime()
//         );
//         break;
//       case "ytd":
//         ApexCharts.exec(
//           "area-datetime",
//           "zoomX",
//           new Date("01 Jan 2013").getTime(),
//           new Date("27 Feb 2013").getTime()
//         );
//         break;
//       case "all":
//         ApexCharts.exec(
//           "area-datetime",
//           "zoomX",
//           new Date("23 Jan 2012").getTime(),
//           new Date("27 Feb 2013").getTime()
//         );
//         break;
//       default:
//     }
//   };

//   return (
//     <div>
//       {title && <h3 style={{ marginBottom: "12px" }}>{title}</h3>}

//       {/* Toolbar */}
//       <div style={{ marginBottom: "12px" }}>
//         {["one_month", "six_months", "one_year", "ytd", "all"].map((range) => (
//           <button
//             key={range}
//             onClick={() => updateData(range as any)}
//             style={{
//               marginRight: "8px",
//               padding: "6px 12px",
//               borderRadius: "6px",
//               border:
//                 selection === range ? "2px solid #007bff" : "1px solid #ccc",
//               background: selection === range ? "#007bff" : "#fff",
//               color: selection === range ? "#fff" : "#333",
//               cursor: "pointer",
//             }}
//           >
//             {range === "one_month" && "1M"}
//             {range === "six_months" && "6M"}
//             {range === "one_year" && "1Y"}
//             {range === "ytd" && "YTD"}
//             {range === "all" && "ALL"}
//           </button>
//         ))}
//       </div>

//       {/* Chart */}
//       <ReactApexChart
//         options={options}
//         series={series}
//         type="area"
//         height={height}
//       />
//     </div>
//   );
// };

// export default MfAreaChart;
