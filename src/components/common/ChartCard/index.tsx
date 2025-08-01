import React from "react";
import ReactApexChart from "react-apexcharts";
import { Card, CardBody, CardHeader } from "reactstrap";
import { Button } from "@mui/material";

type ChartCardProps = {
  title: string;
  selectedView: string;
  setSelectedView: (view: string) => void;
  viewOptions: string[];
  directData: number[];
  indirectData?: number[];
  tradeDates?: any;
  customClass?: any;
};

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  selectedView,
  setSelectedView,
  viewOptions,
  directData,
  indirectData,
  tradeDates,
  customClass,
}) => {
  const colorMap: Record<string, string[]> = {
    Direct: ["#11395C"],
    Indirect: ["#F57C00"],
    Total: ["#11395C", "#F57C00"],
    Daily: customClass ? ["#F57C00"] : ["#11395C"],
    Weekly: customClass ? ["#F57C00"] : ["#11395C"],
    Monthly: customClass ? ["#F57C00"] : ["#11395C"],
  };

  const computeChartData = () => {
    const categories = tradeDates;
    const isStackedView = ["Total", "Daily", "Weekly", "Monthly"].includes(
      selectedView
    );

    let series: any = [];
    if (selectedView === "Direct") {
      series = [{ name: "Direct", data: directData }];
    } else if (selectedView === "Indirect") {
      series = [{ name: "Indirect", data: indirectData }];
    } else if (selectedView === "Total") {
      series = [
        { name: "Direct", data: directData },
        { name: "Indirect", data: indirectData },
      ];
    } else if (selectedView === "Daily") {
      series = [{ name: "Daily", data: directData ?? [] }];
    } else if (selectedView === "Weekly") {
      series = [{ name: "Weekly", data: directData ?? [] }];
    } else if (selectedView === "Monthly") {
      series = [{ name: "Monthly", data: directData ?? [] }];
    }

    return { series, categories, isStackedView };
  };

  const { series, categories, isStackedView } = computeChartData();

  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      stacked: isStackedView,
      toolbar: { show: false },
    },
    xaxis: {
      categories,
    },
    colors: colorMap[selectedView] || ["#8884d8"],
    dataLabels: {
      enabled: true,
      formatter: function (val: number, opts: any) {
        if (isStackedView && selectedView === "Total") {
          const seriesIndex = opts.seriesIndex;
          const lastSeriesIndex = opts.w.config.series.length - 1;
          if (seriesIndex === lastSeriesIndex) {
            const totals = opts.w.globals.stackedSeriesTotals;
            return Math.floor(totals[opts.dataPointIndex]).toLocaleString(
              "en-IN"
            );
          }
          return "";
        }
        return Math.floor(val).toLocaleString("en-IN");
      },
      style: {
        fontSize: "11px",
        fontWeight: "bold",
        colors: ["#000"],
        // top: "10px",
      },
      offsetY: -15,
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: "60%",

        dataLabels: {
          position: "top",
        },
      },
    },
    tooltip: {
      shared: false,
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        if (selectedView === "Total") {
          const directValue = Math.floor(
            series[0][dataPointIndex] || 0
          ).toLocaleString("en-IN");
          const indirectValue = Math.floor(
            series[1][dataPointIndex] || 0
          ).toLocaleString("en-IN");
          const totalValue = Math.floor(
            (series[0][dataPointIndex] || 0) + (series[1][dataPointIndex] || 0)
          ).toLocaleString("en-IN");

          return `
            <div style="
              padding:6px;
              font-size:12px;
              background:#fff;
              border:1px solid #ccc;
              border-radius:4px;
              color:#000;
            ">
              <div style="margin-bottom:4px;">
                <span style="display:inline-block;width:10px;height:10px;margin-right:6px;background:#11395C;"></span>
                <strong>Direct:</strong> ${directValue}
              </div>
              <div style="margin-bottom:4px;">
                <span style="display:inline-block;width:10px;height:10px;margin-right:6px;background:#F57C00;"></span>
                <strong>Indirect:</strong> ${indirectValue}
              </div>
              <div>
                <span style="display:inline-block;width:10px;height:10px;margin-right:6px;background:linear-gradient(90deg, #11395C, #F57C00);"></span>
                <strong>Total:</strong> ${totalValue}
              </div>
            </div>
          `;
        }

        // Default single-series tooltip
        const value = Math.floor(
          series[seriesIndex][dataPointIndex]
        ).toLocaleString("en-IN");
        const seriesName = w.config.series[seriesIndex].name;
        const seriesColor = w.globals.colors[seriesIndex];

        return `
          <div style="
            padding:6px;
            font-size:12px;
            background:#fff;
            border:1px solid #ccc;
            border-radius:4px;
            color:#000;
          ">
            <span style="
              display:inline-block;
              width:10px;
              height:10px;
              margin-right:6px;
              background:${seriesColor};
            "></span>
            <strong>${seriesName}:</strong> ${value}
          </div>
        `;
      },
    },

    legend: {
      position: "bottom",
    },
    yaxis: {
      show: false,
    },
  };

  return (
    <Card
      style={{
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
        marginTop: "1rem",
      }}
    >
      <CardHeader
        className="align-items-center d-flex justify-content-between"
        style={{
          backgroundColor: "#fff",
          borderRadius: "15px 15px 0 0",
        }}
      >
        <h4 className="card-title mb-2 mb-md-0 flex-grow-1 text-md-start text-center">
          {title}
        </h4>
        {viewOptions.map((view) => (
          <Button
            key={view}
            size="small"
            onClick={() => setSelectedView(view)}
            style={{
              borderRadius: "6px",
              fontWeight: 500,
              minWidth: 80,
              margin: "0px 2px 0px 2px",
              // textTransform: "none",
              backgroundColor:
                selectedView === view ? colorMap[view][0] : undefined,
              color: selectedView === view ? "#fff" : undefined,
            }}
            variant={selectedView === view ? "contained" : "outlined"}
          >
            {view}
          </Button>
        ))}
      </CardHeader>
      <CardBody>
        <ReactApexChart
          options={chartOptions}
          series={series}
          type="bar"
          height={280}
        />
      </CardBody>
    </Card>
  );
};

export default ChartCard;
