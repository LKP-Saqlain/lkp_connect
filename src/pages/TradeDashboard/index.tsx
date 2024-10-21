import React, { useState } from "react";
import { Col, Container, Row } from "reactstrap";
// import BreadCrumb from "../../Components/Common/BreadCrumb";
// import MarketGraph from "./MarketGraph";
// import MyCurrencies from "./MyCurrencies";
// import MyPortfolio from "./MyPortfolio";
// import NewsFeed from "./NewsFeed";
// import RecentActivity from "./RecentActivity";
// import TopPerformers from "./TopPerformers";
// import Trading from "./Trading";
import Widgets from "./Widgets";
import TradeCapsule from "./TradeCapsules";
import TradeInfo from "./tradeInfo";
// import Widgets1 from "./Widgets1";

const DashboardCrypto = () => {
  const [selectedItem, setSelectedItem] = useState("");

  const handleItemClick = (data: any) => {
    console.log("value->", data);
    setSelectedItem(data);
  };
  document.title =
    "Crypto Dashboard | Velzon - React Admin & Dashboard Template";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col className="col-xxl-9 order-xxl-0 order-first">
              <Row>
                <Widgets handleItemClick={handleItemClick} />
                {selectedItem === "Reasearch Calls" && <TradeCapsule />}
              </Row>
              <TradeInfo />
            </Col>
          </Row>
          {/* <Row>
            <Widgets1 />
          </Row> */}
          {/* <Row>
            <MyCurrencies />
            <Trading />
          </Row> */}
          {/* <Row>
            <RecentActivity />
            <TopPerformers />
            <NewsFeed />
          </Row> */}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default DashboardCrypto;
