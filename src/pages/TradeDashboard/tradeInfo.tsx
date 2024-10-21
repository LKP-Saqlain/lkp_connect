import React, { useEffect, useState } from "react";
import { Card, Col, CardBody, Container, Row, Table, Button } from "reactstrap";
import { Link } from "react-router-dom";
// import "./style.css";

interface Trade {
  id: string;
  date: string;
  category: string;
  scriptName: string;
  rr: string; // Risk-Reward ratio
  timeFrame: string;
  status: string;
  analyst: string;
}

const TradeInfo = () => {
  const [tradeData, setTradeData] = useState<Trade[]>([]);

  useEffect(() => {
    // Simulate data fetching from API
    const fetchData = async () => {
      const data = [
        {
          id: "#VZ2110",
          date: "October 15, 2021",
          category: "Stock",
          scriptName: "ABC Ltd.",
          rr: "2:1",
          timeFrame: "1D",
          status: "Active",
          analyst: "Bobby Davis",
        },
        {
          id: "#VZ2109",
          date: "October 7, 2021",
          category: "Stock",
          scriptName: "XYZ Ltd.",
          rr: "3:1",
          timeFrame: "4H",
          status: "Closed",
          analyst: "Christopher Neal",
        },
        {
          id: "#VZ2108",
          date: "October 5, 2021",
          category: "Crypto",
          scriptName: "BTC",
          rr: "1.5:1",
          timeFrame: "1D",
          status: "Active",
          analyst: "Monkey Karry",
        },
        {
          id: "#VZ2107",
          date: "October 2, 2021",
          category: "Forex",
          scriptName: "EUR/USD",
          rr: "1:1",
          timeFrame: "4H",
          status: "Closed",
          analyst: "James White",
        },
      ];
      setTradeData(data);
    };

    fetchData();
  }, []);

  return (
    <React.Fragment>
      <div
        className="page-content"
        style={{ fontFamily: '"Public Sans", sans-serif' }}
      >
        <Container fluid>
          <Row>
            <Card>
              <CardBody>
                <div className="live-preview">
                  <div className="table-responsive">
                    <div className="table-wrapper">
                      <Table className="align-middle table-nowrap mb-0 rounded">
                        <thead>
                          <tr className="text-center">
                            <th scope="col">Date</th>
                            <th scope="col">Category</th>
                            <th scope="col">Script Name</th>
                            <th scope="col">Trade Details</th>
                            <th scope="col">R:R</th>
                            <th scope="col">Time Frame</th>
                            <th scope="col"> Status</th>
                            <th scope="col">Analyst</th>
                          </tr>
                        </thead>
                        <tbody className="text-center">
                          {tradeData.map((trade) => (
                            <tr key={trade.id}>
                              <td>{trade.date}</td>
                              <td>{trade.id}</td>
                              <td>{trade.category}</td>
                              <td>{trade.scriptName}</td>
                              <td>{trade.rr}</td>
                              <td>{trade.timeFrame}</td>
                              <td>{trade.status}</td>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignContent: "center",
                                  flexWrap: "wrap",
                                }}
                              >
                                <td>{trade.analyst}</td>
                                <Button
                                  className="custom-table-btn"
                                  style={
                                    {
                                      // width: "80px",
                                      // fontSize: "9px",
                                    }
                                  }
                                >
                                  View Details
                                </Button>
                              </div>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default TradeInfo;

// import React from "react";
// import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";
// import { PaginationTable } from "./TradeTable";

// const ReactTable = () => {
//   document.title = "React Tables | Velzon - React Admin & Dashboard Template";
//   return (
//     <React.Fragment>
//       <div className="page-content">
//         <Container fluid>
//           <Row>
//             <Col lg={12}>
//               <Card>
//                 <CardBody style={{ fontFamily: '"Public Sans", sans-serif' }}>
//                   <PaginationTable />
//                 </CardBody>
//               </Card>
//             </Col>
//           </Row>
//         </Container>
//       </div>
//     </React.Fragment>
//   );
// };

// export default ReactTable;
