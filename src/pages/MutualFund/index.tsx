import BasicTabs from "../../components/common/NavTabs";

// Import your sub-components
import Discover from "./Discover";
import Watchlist from "./Watchlist";
import Portfolio from "./Portfolio";
import Report from "./Report";
import Order from "./Order";
import { Card, Container } from "reactstrap";

const MutualFundIndex = (activeSubItem: any) => {
  console.log(activeSubItem);

  const mainMenu = [
    { id: 1, label: "Discover", content: <Discover /> },
    { id: 2, label: "Watchlist", content: <Watchlist /> },
    { id: 3, label: "Portfolio", content: <Portfolio /> },
    { id: 4, label: "Report", content: <Report /> },
    { id: 5, label: "Order", content: <Order /> },
  ];

  return (
    <div className="page-content page-view">
      <Container fluid>
        <Card
          style={{
            borderRadius: "15px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          }}
        >
          <BasicTabs tabs={mainMenu} />
        </Card>
      </Container>
    </div>
  );
};

export default MutualFundIndex;
