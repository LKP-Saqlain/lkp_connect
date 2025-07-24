import { useEffect, useState } from "react";
import { Col, Container, Row } from "reactstrap";
import ChartCard from "../../../components/common/ChartCard";

interface OverviewProps {
  activeSubItem: string;
}

// Data sets
const directData1 = [
  1220, 1230, 1255, 1450, 1650, 2135, 1460, 1730, 1655, 1545, 1665, 1830,
];
const indirectData1 = [
  1350, 1530, 2385, 2534, 1900, 1930, 1170, 1220, 1035, 1325, 1315, 2730,
];
const directData2 = [
  400, 500, 450, 600, 700, 650, 620, 680, 590, 630, 610, 700,
];
const indirectData2 = [
  300, 420, 390, 460, 480, 500, 470, 450, 440, 430, 460, 510,
];
const directData3 = [
  720, 690, 710, 740, 760, 730, 750, 780, 770, 790, 800, 810,
];

const indirectData3 = [
  510, 530, 520, 540, 560, 550, 570, 590, 580, 600, 610, 620,
];
const directData4 = [
  820, 830, 840, 860, 850, 870, 880, 890, 900, 910, 920, 930,
];
const indirectData4 = [
  630, 640, 650, 660, 670, 680, 690, 700, 710, 720, 730, 740,
];
const directData5 = [
  940, 950, 960, 970, 980, 990, 1000, 1010, 1020, 1030, 1040, 1050,
];
const indirectData5 = [
  750, 760, 770, 780, 790, 800, 810, 820, 830, 840, 850, 860,
];
const directData6 = [
  1060, 1070, 1080, 1090, 1100, 1110, 1120, 1130, 1140, 1150, 1160, 1170,
];
const indirectData6 = [
  870, 880, 890, 900, 910, 920, 930, 940, 950, 960, 970, 980,
];
const directData7 = [
  1180, 1190, 1200, 1210, 1220, 1230, 1240, 1250, 1260, 1270, 1280, 1290,
];
const indirectData7 = [
  990, 1000, 1010, 1020, 1030, 1040, 1050, 1060, 1070, 1080, 1090, 1100,
];
const directData8 = [
  1300, 1310, 1320, 1330, 1340, 1350, 1360, 1370, 1380, 1390, 1400, 1410,
];
const indirectData8 = [
  1110, 1120, 1130, 1140, 1150, 1160, 1170, 1180, 1190, 1200, 1210, 1220,
];
const directData9 = [
  1420, 1430, 1440, 1450, 1460, 1470, 1480, 1490, 1500, 1510, 1520, 1530,
];
const indirectData9 = [
  1230, 1240, 1250, 1260, 1270, 1280, 1290, 1300, 1310, 1320, 1330, 1340,
];

const Overview = ({ activeSubItem }: OverviewProps) => {
  const [selectedView1, setSelectedView1] = useState<
    "Direct" | "Indirect" | "Total"
  >("Total");
  const [selectedView2, setSelectedView2] = useState<
    "Direct" | "Indirect" | "Total"
  >("Total");
  const [selectedView3, setSelectedView3] = useState<
    "Direct" | "Indirect" | "Total"
  >("Total");
  const [selectedView4, setSelectedView4] = useState<
    "Direct" | "Indirect" | "Total"
  >("Total");
  const [selectedView5, setSelectedView5] = useState<
    "Direct" | "Indirect" | "Total"
  >("Total");
  const [selectedView6, setSelectedView6] = useState<
    "Direct" | "Indirect" | "Total"
  >("Total");
  const [selectedView7, setSelectedView7] = useState<
    "Direct" | "Indirect" | "Total"
  >("Total");
  const [selectedView8, setSelectedView8] = useState<
    "Direct" | "Indirect" | "Total"
  >("Total");
  const [selectedView9, setSelectedView9] = useState<
    "Direct" | "Indirect" | "Total"
  >("Total");

  useEffect(() => {
    console.log("Active Sub Item:", activeSubItem);
  }, [activeSubItem]);

  return (
    <div className="page-content">
      <Container fluid>
        <Row>
          <Col xl={12}>
            <ChartCard
              title="Total Broking Revenue for last 12 months"
              selectedView={selectedView1}
              setSelectedView={setSelectedView1}
              directData={directData1}
              indirectData={indirectData1}
            />
            <ChartCard
              title="Total Traded Clients for last 10 months"
              selectedView={selectedView2}
              setSelectedView={setSelectedView2}
              directData={directData2}
              indirectData={indirectData2}
            />
            <ChartCard
              title="Total Revenue Per Traded  Clients for last 10 months"
              selectedView={selectedView3}
              setSelectedView={setSelectedView3}
              directData={directData3}
              indirectData={indirectData3}
            />
            <ChartCard
              title="Delivery Segment Revenue for last 10 days"
              selectedView={selectedView4}
              setSelectedView={setSelectedView4}
              directData={directData4}
              indirectData={indirectData4}
            />{" "}
            <ChartCard
              title="Intraday Segment Revenue for last 10 Days"
              selectedView={selectedView5}
              setSelectedView={setSelectedView5}
              directData={directData5}
              indirectData={indirectData5}
            />{" "}
            <ChartCard
              title="Intraday Segment Revenue for last 10 Days"
              selectedView={selectedView6}
              setSelectedView={setSelectedView6}
              directData={directData6}
              indirectData={indirectData6}
            />{" "}
            <ChartCard
              title="Options Revenue for last 10 Days"
              selectedView={selectedView7}
              setSelectedView={setSelectedView7}
              directData={directData7}
              indirectData={indirectData7}
            />{" "}
            <ChartCard
              title="Commodity Futures Revenue for last 10 Days"
              selectedView={selectedView8}
              setSelectedView={setSelectedView8}
              directData={directData8}
              indirectData={indirectData8}
            />{" "}
            <ChartCard
              title="Commodity Options Revenue for last 10 Days"
              selectedView={selectedView9}
              setSelectedView={setSelectedView9}
              directData={directData9}
              indirectData={indirectData9}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Overview;
