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
  indirectData: number[];
  tradeDates?: any;
};

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  selectedView,
  setSelectedView,
  viewOptions,
  directData,
  indirectData,
  tradeDates,
}) => {
  const colorMap: Record<string, string[]> = {
    Direct: ["#11395C"],
    Indirect: ["#F57C00"],
    Total: ["#11395C", "#F57C00"],
    Daily: ["#1976d2"],
    Weekly: ["#9c27b0"],
    Monthly: ["#2e7d32"],
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
      series = [
        { name: "Daily", data: directData },
        { name: "", data: indirectData },
      ];
    } else if (selectedView === "Weekly") {
      series = [
        { name: "Weekly", data: indirectData },
        { name: "", data: directData },
      ];
    } else if (selectedView === "Monthly") {
      series = [
        { name: "Monthly Direct", data: directData },
        { name: "Monthly Indirect", data: indirectData },
      ];
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
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: "45%",
      },
    },
    dataLabels: {
      enabled: false,
      formatter: function (value: number) {
        return new Intl.NumberFormat("en-IN").format(Math.round(value)); // Format the value
      },
    },
    tooltip: {
      y: {
        formatter: function (value: number) {
          return new Intl.NumberFormat("en-IN").format(Math.round(value)); // Format the value
        },
      },
    },

    legend: {
      show: false,
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
