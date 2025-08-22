import { useState } from "react";
import BasicTabs from "../../components/common/MutualFunds/NavTabs";
import { mainMenu } from "../../pages/MutualFund/mfTypes";
import { Card, Container } from "reactstrap";
import MfOverview from "../../components/common/MutualFunds/MfOverview";

const MutualFundIndex = (activeSubItem: any) => {
  console.log(activeSubItem);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedMutualFund, setSelectedMutualFund] = useState<string>("");
  const handleBack = () => {
    setSelectedMutualFund("");
  };

  return (
    <div className="page-content page-view">
      <Container fluid>
        {/* Card for Tabs */}
        <Card
          style={{
            borderRadius: "15px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
            marginBottom: "16px",
          }}
        >
          <BasicTabs
            tabs={mainMenu.map((m) => ({ label: m.label }))}
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
          />
        </Card>

        {/* Card for Content */}
        {/* <Card
          style={{
            borderRadius: "15px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            padding: "16px",
          }}
        > */}
        {/* {false ? <MfOverview /> : mainMenu[activeTab]?.content} */}
        {selectedMutualFund ? (
          <MfOverview fundName={selectedMutualFund} onBack={handleBack} />
        ) : (
          mainMenu[activeTab]?.content({ onSelectFund: setSelectedMutualFund })
        )}

        {/* </Card> */}
      </Container>
    </div>
  );
};

export default MutualFundIndex;
