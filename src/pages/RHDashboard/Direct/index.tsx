import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";
import ChartCard from "../../../components/common/ChartCard";
import UserInfoTable from "../../../components/common/UserInfoTable";

interface OverviewProps {
  activeSubItem: string;
}

export type ViewType = "Daily" | "Monthly" | "Weekly";

const chartConfigs = [
  {
    title: "Total Broking Revenue",
    directData: [
      1220, 1230, 1255, 1450, 1650, 2135, 1460, 1730, 1655, 1545, 1665, 1830,
    ],
    indirectData: [
      1350, 1530, 2385, 2534, 1900, 1930, 1170, 1220, 1035, 1325, 1315, 2730,
    ],
  },
  {
    title: "Total Traded Placed",
    directData: [400, 500, 450, 600, 700, 650, 620, 680, 590, 630, 610, 700],
    indirectData: [300, 420, 390, 460, 480, 500, 470, 450, 440, 430, 460, 510],
  },
  {
    title: "Total Traded Clients",
    directData: [720, 690, 710, 740, 760, 730, 750, 780, 770, 790, 800, 810],
    indirectData: [510, 530, 520, 540, 560, 550, 570, 590, 580, 600, 610, 620],
  },
  {
    title: "Revenue per traded Clients",
    directData: [820, 830, 840, 860, 850, 870, 880, 890, 900, 910, 920, 930],
    indirectData: [630, 640, 650, 660, 670, 680, 690, 700, 710, 720, 730, 740],
  },
];

const clientRevenueData = [
  {
    id: 1,
    clientCode: "CL1001",
    clientName: "Ashish Sankpal",
    revenue: 156000.25,
    lastTradeDate: "2025-07-20T00:00:00.000Z",
    rmName: "Rahul Mehra",
  },
  {
    id: 2,
    clientCode: "CL1002",
    clientName: "Meera Chopra",
    revenue: 98450.75,
    lastTradeDate: "2025-07-18T00:00:00.000Z",
    rmName: "Sneha Desai",
  },
  {
    id: 3,
    clientCode: "CL1003",
    clientName: "Vikas Jain",
    revenue: 34500.0,
    lastTradeDate: "2025-07-10T00:00:00.000Z",
    rmName: "Ankit Rawat",
  },
  {
    id: 4,
    clientCode: "CL1004",
    clientName: "Rohit Agarwal",
    revenue: 78900.5,
    lastTradeDate: "2025-06-30T00:00:00.000Z",
    rmName: "Divya Patil",
  },
  {
    id: 5,
    clientCode: "CL1005",
    clientName: "Sneha Verma",
    revenue: 128000.0,
    lastTradeDate: "2025-07-22T00:00:00.000Z",
    rmName: "Karan Shah",
  },
];

const Direct = ({ activeSubItem }: OverviewProps) => {
  const [selectedViews, setSelectedViews] = useState<ViewType[]>(
    Array(chartConfigs.length).fill("Weekly")
  );

  const handleViewChange = (index: number, newView: ViewType) => {
    setSelectedViews((prev) => {
      const updated = [...prev];
      updated[index] = newView;
      return updated;
    });
  };

  useEffect(() => {
    console.log("Active Sub Item:", activeSubItem);
  }, [activeSubItem]);

  return (
    <div className="page-content">
      <Container fluid>
        <Row>
          <Col xl={12}>
            {chartConfigs.map(({ title, directData, indirectData }, index) => (
              <ChartCard
                // key={id}
                title={title}
                selectedView={selectedViews[index]}
                viewOptions={["Daily", "Weekly", "Monthly"]}
                setSelectedView={(view: any) => handleViewChange(index, view)}
                directData={directData}
                indirectData={indirectData}
              />
            ))}
          </Col>
        </Row>

        <Card
          style={{
            minHeight: "80vh",
            borderRadius: "15px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          }}
        >
          <CardHeader
            style={{
              borderRadius: "15px 15px 0 0",
              boxShadow: "0 -4px 8px rgba(0, 0, 0, 0.15)",
              backgroundColor: "#fff",
              padding: "0.2rem 0.8rem",
            }}
          >
            <h4 className="card-title mb-0">Top 10 Clients</h4>
          </CardHeader>
          <CardBody>
            <UserInfoTable
              activeSubItem={"RHDashboardTop10Clients"}
              T6Data={clientRevenueData}
            />
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default Direct;
