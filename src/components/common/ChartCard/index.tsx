import { Card, CardBody, CardHeader, Col, Button } from "reactstrap";
import ReactApexChart from "react-apexcharts";

const months = [
  "Jan-25",
  "Feb-25",
  "Mar-25",
  "Apr-25",
  "May-25",
  "Jun-25",
  "Jul-25",
  "Aug-25",
  "Sep-25",
  "Oct-25",
  "Nov-25",
  "Dec-25",
];

const colorMap = {
  Direct: ["#008FFB"],
  Indirect: ["#00E396"],
  Total: ["#008FFB", "#00E396"],
};

const ChartCard = ({
  title,
  selectedView,
  setSelectedView,
  directData,
  indirectData,
}: {
  title: string;
  selectedView: "Direct" | "Indirect" | "Total";
  setSelectedView: React.Dispatch<
    React.SetStateAction<"Direct" | "Indirect" | "Total">
  >;
  directData: number[];
  indirectData: number[];
}) => {
  const getSeries = () => {
    if (selectedView === "Direct")
      return [{ name: "Direct", data: directData }];
    if (selectedView === "Indirect")
      return [{ name: "Indirect", data: indirectData }];
    return [
      { name: "Direct", data: directData },
      { name: "Indirect", data: indirectData },
    ];
  };

  const getOptions = (): ApexCharts.ApexOptions => ({
    chart: {
      type: "bar" as const,
      height: 374,
      stacked: true,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "60%",
      },
    },
    xaxis: {
      categories: months,
    },
    legend: {
      position: "bottom" as const,
    },
    fill: {
      opacity: 1,
    },
    colors: colorMap[selectedView],
    tooltip: {
      y: {
        formatter: (val: number) => `${val} units`,
      },
    },
  });

  const renderButtons = () => (
    <div className="d-flex gap-2">
      {(["Direct", "Indirect", "Total"] as const).map((type) => {
        const isSelected = selectedView === type;
        const isTotal = type === "Total";
        const gradient = `linear-gradient(135deg, ${colorMap.Direct[0]}, ${colorMap.Indirect[0]})`;

        if (isSelected && isTotal) {
          return (
            <div
              key={type}
              style={{
                background: gradient,
                padding: "2px",
                borderRadius: "8px",
                display: "inline-block",
              }}
            >
              <Button
                size="sm"
                onClick={() => setSelectedView(type)}
                style={{
                  background: gradient,
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: 500,
                  width: "80px",
                }}
              >
                {type}
              </Button>
            </div>
          );
        }

        return (
          <Button
            key={type}
            color={isSelected ? "primary" : "light"}
            size="sm"
            onClick={() => setSelectedView(type)}
            style={{
              borderRadius: "6px",
              fontWeight: 500,
              width: "80px",
              background:
                isSelected && !isTotal ? colorMap[type][0] : undefined,
              color: isSelected ? "#fff" : undefined,
              border:
                isSelected && !isTotal
                  ? `1px solid ${colorMap[type][0]}`
                  : undefined,
            }}
          >
            {type}
          </Button>
        );
      })}
    </div>
  );

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
        {renderButtons()}
      </CardHeader>
      <CardBody>
        <Col>
          <ReactApexChart
            options={getOptions()}
            series={getSeries()}
            type="bar"
            height={374}
            className="apex-charts"
          />
        </Col>
      </CardBody>
    </Card>
  );
};

export default ChartCard;
