import { Container } from "reactstrap";
import RegGraph from "./regGraph";

const RegMain = () => {
  const DataSets = [
    {
      series: [
        {
          name: "BrokerageBar 1",
          type: "bar",
          data: [
            680051.23, 538044.27, 483511.14, 1065669.67, 542258.31, 717772.02,
            496766.77,
          ],
        },
        {
          name: "BrokerageBar 2",
          type: "bar",
          data: [
            311562.76, 452921.84, 316700.94, 270955.77, 363095.8, 322153.66,
            321967.26,
          ],
        },
      ],
      customClass: "chart-one",
    },
    {
      series: [
        {
          name: "Another Bar Series 1",
          type: "bar",
          data: [210000, 420000, 320000, 110000, 540000, 670000, 480000],
        },
        {
          name: "Another Bar Series 2",
          type: "bar",
          data: [123456, 234567, 345678, 456789, 567890, 678901, 789012],
        },
      ],
      customClass: "chart-two",
    },
    {
      series: [
        {
          name: "New Series 1",
          type: "bar",
          data: [100000, 200000, 300000, 400000, 500000, 600000, 700000],
        },
        {
          name: "New Series 2",
          type: "bar",
          data: [800000, 900000, 1000000, 1100000, 1200000, 1300000, 1400000],
        },
      ],
      customClass: "chart-three",
    },
    {
      series: [
        {
          name: "Final Series 1",
          type: "bar",
          data: [1500000, 1600000, 1700000, 1800000, 1900000, 2000000, 2100000],
        },
        {
          name: "Final Series 2",
          type: "bar",
          data: [2200000, 2300000, 2400000, 2500000, 2600000, 2700000, 2800000],
        },
      ],
      customClass: "chart-four",
    },
  ];
  document.title = document.title = "LKP Securities | Zone Overview";
  return (
    <div className="page-content page-view">
      <Container fluid>
        {DataSets.map((dataSet, index) => (
          <RegGraph
            key={index}
            brokerageData={dataSet.series}
            customClass={dataSet.customClass}
          />
        ))}
      </Container>
    </div>
  );
};

export default RegMain;
