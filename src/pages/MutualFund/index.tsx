import BasicTabs from "../../components/common/NavTabs";
import { mainMenu } from "../../pages/MutualFund/mfTypes";
// Import your sub-components

import { Card, Container } from "reactstrap";

const MutualFundIndex = (activeSubItem: any) => {
  console.log(activeSubItem);

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
