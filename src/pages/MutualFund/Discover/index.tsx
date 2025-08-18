import { Col, Row } from "reactstrap";
import SipCalculator from "./sipCalculator";
import { mainMenuC } from "../mfTypes";
import BasicTabs from "../../../components/common/NavTabs";
import MfCards from "../../../components/common/MfCards";
import {
  MfCardRecoLabel,
  MfCardPassLabel,
} from "../../../pages/MutualFund/mfTypes";

const MfDiscover = () => {
  return (
    <Row>
      {/* Left Section (8 columns total) */}
      <Col xl={8}>
        <BasicTabs heading="Our Recommendation" />
        <MfCards CardData={MfCardRecoLabel} />
        <BasicTabs tabs={mainMenuC} heading="Asset Class" />

        {/* New row inside left section to split 4 + 4 */}
        <Row>
          <Col xl={6}>
            <BasicTabs heading="Passive Investing" />{" "}
            <MfCards CardData={MfCardPassLabel} />
          </Col>
          <Col xl={6}>
            <BasicTabs heading="Product" />{" "}
            <MfCards CardData={MfCardPassLabel} />
          </Col>
        </Row>
      </Col>

      {/* Right Section (4 columns total) */}
      <Col xl={4}>
        <SipCalculator />
      </Col>
    </Row>
  );
};

export default MfDiscover;
