import { Container, Col, Row } from "reactstrap";
import HoldingSummary from "../../../components/common/holdingSummary";
import HoldingsInfo from "./holdingsInfo";
import { useEffect, useRef, useState } from "react";
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
  const prevIsinRef = useRef<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    console.log("ShareHolding activeMenu:", activeMenu, selectedIsin);
    // debugger;
    // Check if ISIN changed or cleared
    if (prevIsinRef.current && prevIsinRef.current !== selectedIsin) {
      console.log("ISIN changed, clearing ShareHolding data");
      setFundamentalShareHolding([]);
    }

    // Update previous ISIN for next comparison
    prevIsinRef.current = selectedIsin;
  }, [activeMenu, selectedIsin, fundamentalShareHolding]);

  useEffect(() => {
    if (selectedIsin) {
      const fetchFundamentalShareHolding = async () => {
        dispatch(showLoader("Please wait we are processing your request"));

        try {
          const response = await apiServices.getFundamentalShareholding(
            selectedIsin
          );
          dispatch(hideLoader());
          console.log(
            "getFundamentalShareholdingResponse",
            Object.keys(response?.data).length
          );

          if (Object.keys(response?.data).length > 0) {
            setFundamentalShareHolding(response?.data);
          } else {
            setFundamentalShareHolding([]);
          }
        } catch (error) {
          dispatch(hideLoader());
          console.log("error", error);
        }
      };
      console.log("Dividendshar", selectedIsin);
      fetchFundamentalShareHolding();
    }
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
