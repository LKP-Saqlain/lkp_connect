import { Container, Col, Row } from "reactstrap";
import HoldingSummary from "../../../components/common/holdingSummary";
import HoldingsInfo from "./holdingsInfo";
import { useEffect, useState } from "react";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { apiServices } from "../../../services";
import DynamicTable from "../../../components/common/dynamicStockStudyTable";
// import axios from "axios";

const ShareHolding = ({ activeMenu, selectedIsin }: any) => {
  const [fundamentalShareHolding, setFundamentalShareHolding] = useState<[]>(
    []
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    console.log("ShareHolding activeMenu:", activeMenu, selectedIsin);
  }, [activeMenu]);

  useEffect(() => {
    const fetchFundamentalShareHolding = async () => {
      dispatch(showLoader("Please wait we are processing your request"));

      try {
        const response = await apiServices.getFundamentalShareholding(
          selectedIsin
        );
        dispatch(hideLoader());
        console.log("getFundamentalShareholdingResponse", response?.data);
        setFundamentalShareHolding(response?.data);
      } catch (error) {
        dispatch(hideLoader());
        console.log("error", error);
      }
    };
    console.log("Dividendshar", selectedIsin);
    fetchFundamentalShareHolding();
  }, [activeMenu, selectedIsin]);

  return (
    <>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col>
              <div>
                <Row>
                  <HoldingSummary
                    fundamentalShareHolding={fundamentalShareHolding}
                  />
                  <HoldingsInfo
                    fundamentalShareHolding={fundamentalShareHolding}
                  />
                </Row>
                <DynamicTable
                  fundamentalShareHolding={fundamentalShareHolding}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default ShareHolding;
