import { Card, CardBody, CardHeader } from "reactstrap";
import { RevenueNonBrokingCharts } from "../DashboardProjectCharts";
const NonBrokingRevenue = ({ yearRevenue, series }: any) => {
  return (
    <Card>
      <CardHeader
        className="align-items-center d-flex"
        style={{
          borderRadius: "15px 15px 0 0",
          boxShadow: "0 -4px 8px rgba(0, 0, 0, 0.15)",
          backgroundColor: "#fff", // optional for contrast
        }}
      >
        <h4 className="card-title mb-0 flex-grow-1 text-md-start text-center">
          Non-Broking Revenue for Last 12 Months
        </h4>
        <div
          className="d-flex align-items-center flex-wrap mt-2 mt-sm-0"
          style={{ fontFamily: "Public Sans, sans-serif" }}
        >
          <div
            className="legend-color"
            style={{
              backgroundColor: "#1890ff",
              width: "16px",
              height: "16px",
              marginRight: "10px",
            }}
          ></div>
          <p className="mb-0 me-3">Mutual Funds</p>
          <div
            className="legend-color"
            style={{
              backgroundColor: "#52c41a",
              width: "16px",
              height: "16px",
              marginRight: "8px",
            }}
          ></div>
          <p className="mb-0 me-3">Research</p>
          <div
            className="legend-color"
            style={{
              backgroundColor: "#faad14",
              width: "16px",
              height: "16px",
              marginRight: "8px",
            }}
          ></div>
          <p className="mb-0 me-3">Insurance</p>
          <div
            className="legend-color"
            style={{
              backgroundColor: "#00E396",
              width: "16px",
              height: "16px",
              marginRight: "8px",
            }}
          ></div>
          <p className="mb-0 me-3">LiquiLoans</p>
          <div
            className="legend-color"
            style={{
              backgroundColor: "#ec8c95",
              width: "16px",
              height: "16px",
              marginRight: "8px",
            }}
          ></div>
          <p className="mb-0">Unlisted Shares</p>
        </div>
      </CardHeader>
      <CardBody>
        <RevenueNonBrokingCharts revenueMonths={yearRevenue} series={series} />
      </CardBody>
    </Card>
  );
};

export default NonBrokingRevenue;
