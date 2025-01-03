import { Container, Col, Row } from "reactstrap";
import HoldingSummary from "../../../components/common/holdingSummary";
import HoldingsInfo from "../holdingsInfo";

const ShareHolding = () => {
  return (
    <>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col>
              <div>
                <Row>
                  <HoldingSummary />
                  <HoldingsInfo />
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default ShareHolding;
