import { Col, Row } from "reactstrap";
import SipCalculator from "./sipCalculator";
import { mutualFundCards } from "../mfTypes";
import BasicTabs from "../../../components/common/NavTabs";
import MfCards from "../../../components/common/MfCards";
import {
  MfCardRecoLabel,
  MfCardPassLabel,
} from "../../../pages/MutualFund/mfTypes";
import MfinfoCard from "../../../components/common/MfInfoCard";

const MfDiscover = () => {
  console.log("mutualFundCards.equity", mutualFundCards.equity);

  return (
    <Row>
      <Col xl={8}>
        <BasicTabs heading="Our Recommendation" />
        <MfCards CardData={MfCardRecoLabel} />

        {/* Asset Class Tabs */}
        <BasicTabs
          tabs={[
            {
              label: "Equity",
              content: (
                <MfinfoCard
                  CardType="Asset Class"
                  funds={mutualFundCards.equity}
                />
              ),
            },
            {
              label: "Debt",
              content: (
                <MfinfoCard
                  CardType="Asset Class"
                  funds={mutualFundCards.debt}
                />
              ),
            },
            {
              label: "Hybrid",
              content: (
                <MfinfoCard
                  CardType="Asset Class"
                  funds={mutualFundCards.hybrid}
                />
              ),
            },
            {
              label: "Solution",
              content: (
                <MfinfoCard
                  CardType="Asset Class"
                  funds={mutualFundCards.solution}
                />
              ),
            },
            {
              label: "Others",
              content: (
                <MfinfoCard
                  CardType="Asset Class"
                  funds={mutualFundCards.others}
                />
              ),
            },
          ]}
          heading="Asset Class"
        />

        {/* Other sections */}
        <Row>
          <Col xl={6}>
            <BasicTabs heading="Passive Investing" />
            <MfCards CardData={MfCardPassLabel} />
          </Col>
          <Col xl={6}>
            <BasicTabs heading="Product" />
            <MfCards CardData={MfCardPassLabel} />
          </Col>
        </Row>
        <BasicTabs
          tabs={[
            {
              label: "Equity",
              content: (
                <MfinfoCard
                  CardType="Popular Category"
                  funds={mutualFundCards.equity}
                />
              ),
            },
            {
              label: "Debt",
              content: (
                <MfinfoCard
                  CardType="Popular Category"
                  funds={mutualFundCards.debt}
                />
              ),
            },
            {
              label: "Hybrid",
              content: (
                <MfinfoCard
                  CardType="Popular Category"
                  funds={mutualFundCards.hybrid}
                />
              ),
            },
            {
              label: "Solution",
              content: (
                <MfinfoCard
                  CardType="Popular Category"
                  funds={mutualFundCards.solution}
                />
              ),
            },
            {
              label: "Others",
              content: (
                <MfinfoCard
                  CardType="Popular Category"
                  funds={mutualFundCards.others}
                />
              ),
            },
          ]}
          heading="Popular Category"
        />
      </Col>

      <Col xl={4}>
        <SipCalculator />
      </Col>
    </Row>
  );
};

export default MfDiscover;
