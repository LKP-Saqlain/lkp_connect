import { Col, Row, Card } from "reactstrap";
import SipCalculator from "./sipCalculator";
import { mutualFundCards } from "../mfTypes";
import BasicTabs from "../../../components/common/MutualFunds/NavTabs";
import MfCards from "../../../components/common/MutualFunds/MfCards";
import {
  MfCardRecoLabel,
  MfCardPassLabel,
} from "../../../pages/MutualFund/mfTypes";
import MfinfoCard from "../../../components/common/MutualFunds/MfInfoCard";
import { useState } from "react";
import MutualFundList from "./MutualFundList";

const MfDiscover = ({ onSelectFund }: any) => {
  const [assetTab, setAssetTab] = useState(0);
  const [popularTab, setPopularTab] = useState(0);
  const [selectedMfType, setSelectedMfType] = useState("");

  const handleSelectedMfType = (MfType: string) => {
    setSelectedMfType(MfType);
    console.log("selectedMfType", MfType);
  };
  const handleSelectedMutualFund = (MfName: string) => {
    console.log("selectedMutualFund", MfName);
    onSelectFund(MfName);
  };
  const handleBack = () => {
    setSelectedMfType("");
  };
  return (
    <Card
      style={{
        borderRadius: "15px",
        // marginBottom: "16px",
        padding: "16px",
      }}
    >
      {selectedMfType ? (
        <MutualFundList selectedMfType={selectedMfType} onBack={handleBack} />
      ) : (
        // <MfOverview />
        <Row>
          <Col xl={8}>
            {/* Recommendation Section */}
            <Card
              style={{
                borderRadius: "15px",
                margin: "0",
                padding: "16px",
              }}
            >
              <BasicTabs
                heading="Our Recommendation"
                tabs={[]}
                value={0}
                onChange={() => {}}
              />
              <MfCards
                CardData={MfCardRecoLabel}
                handleSelectedMfType={handleSelectedMfType}
              />
            </Card>

            {/* Asset Class Section */}
            <Card
              style={{
                borderRadius: "15px",
                // marginBottom: "16px",
                padding: "16px",
              }}
            >
              <BasicTabs
                heading="Asset Class"
                tabs={[
                  { label: "Equity" },
                  { label: "Debt" },
                  { label: "Hybrid" },
                  { label: "Solution" },
                  { label: "Others" },
                ]}
                value={assetTab}
                onChange={(e, newValue) => setAssetTab(newValue)}
              />
              {/* </Card>

        <Card
          style={{
            borderRadius: "15px",
            marginBottom: "16px",
            padding: "16px",
          }}
        > */}
              {assetTab === 0 && (
                <MfinfoCard
                  CardType="Asset Class"
                  funds={mutualFundCards.equity}
                  handleSelectedMutualFund={handleSelectedMutualFund}
                />
              )}
              {assetTab === 1 && (
                <MfinfoCard
                  CardType="Asset Class"
                  funds={mutualFundCards.debt}
                  handleSelectedMutualFund={handleSelectedMutualFund}
                />
              )}
              {assetTab === 2 && (
                <MfinfoCard
                  CardType="Asset Class"
                  funds={mutualFundCards.hybrid}
                  handleSelectedMutualFund={handleSelectedMutualFund}
                />
              )}
              {assetTab === 3 && (
                <MfinfoCard
                  CardType="Asset Class"
                  funds={mutualFundCards.solution}
                  handleSelectedMutualFund={handleSelectedMutualFund}
                />
              )}
              {assetTab === 4 && (
                <MfinfoCard
                  CardType="Asset Class"
                  funds={mutualFundCards.others}
                  handleSelectedMutualFund={handleSelectedMutualFund}
                />
              )}
            </Card>

            {/* Passive & Product Cards */}
            <Row>
              <Col xl={6}>
                <Card
                  style={{
                    borderRadius: "15px",
                    margin: "0",
                    padding: "16px",
                  }}
                >
                  <BasicTabs
                    heading="Passive Investing"
                    tabs={[]}
                    value={0}
                    onChange={() => {}}
                  />
                  <MfCards
                    CardData={MfCardPassLabel}
                    handleSelectedMfType={handleSelectedMfType}
                  />
                </Card>
              </Col>
              <Col xl={6}>
                <Card
                  style={{
                    borderRadius: "15px",
                    margin: "0",
                    padding: "16px",
                  }}
                >
                  <BasicTabs
                    heading="Product"
                    tabs={[]}
                    value={0}
                    onChange={() => {}}
                  />
                  <MfCards
                    CardData={MfCardPassLabel}
                    handleSelectedMfType={handleSelectedMfType}
                  />
                </Card>
              </Col>
            </Row>

            {/* Popular Category Section */}
            <Card
              style={{
                borderRadius: "15px",
                // marginBottom: "16px",
                padding: "16px",
              }}
            >
              <BasicTabs
                heading="Popular Category"
                tabs={[
                  { label: "Large Cap" },
                  { label: "ELSS" },
                  { label: "Small Cap" },
                  { label: "Mid Cap" },
                  // { label: "Others" },
                ]}
                value={popularTab}
                onChange={(e, newValue) => setPopularTab(newValue)}
              />

              {popularTab === 0 && (
                <MfinfoCard
                  CardType="Popular Category"
                  funds={mutualFundCards.equity}
                  handleSelectedMutualFund={handleSelectedMutualFund}
                />
              )}
              {popularTab === 1 && (
                <MfinfoCard
                  CardType="Popular Category"
                  funds={mutualFundCards.debt}
                  handleSelectedMutualFund={handleSelectedMutualFund}
                />
              )}
              {popularTab === 2 && (
                <MfinfoCard
                  CardType="Popular Category"
                  funds={mutualFundCards.hybrid}
                  handleSelectedMutualFund={handleSelectedMutualFund}
                />
              )}
              {popularTab === 3 && (
                <MfinfoCard
                  CardType="Popular Category"
                  funds={mutualFundCards.solution}
                  handleSelectedMutualFund={handleSelectedMutualFund}
                />
              )}
              {popularTab === 4 && (
                <MfinfoCard
                  CardType="Popular Category"
                  funds={mutualFundCards.others}
                  handleSelectedMutualFund={handleSelectedMutualFund}
                />
              )}
            </Card>
          </Col>

          {/* Right Section */}
          <Col xl={4}>
            <SipCalculator />
          </Col>
        </Row>
      )}
    </Card>
  );
};

export default MfDiscover;
