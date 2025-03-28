import { Container, Col, Row } from "reactstrap";
import HoldingSummary from "../../../components/common/holdingSummary";
import HoldingsInfo from "../holdingsInfo";
import { useEffect, useState } from "react";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { apiServices } from "../../../services";
import DynamicTable from "../../../components/common/dynamicStockStudyTable";
// import axios from "axios";

const ShareHolding = ({ activeMenu }: { activeMenu: any }) => {
  const [fundamentalShareHolding, setFundamentalShareHolding] = useState<[]>(
    []
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    console.log("ShareHolding activeMenu:", activeMenu);
  }, [activeMenu]);

  // useEffect(() => {
  //   const fetchStockNews = async (
  //     stockCode: any,
  //     pageNumber = 1,
  //     qsTime = ""
  //   ) => {
  //     const baseURL = "https://api.trendlyne.com/lane/stock/newsfeed";
  //     const url =
  //       pageNumber > 1
  //         ? `${baseURL}/${"INE009A01021"}?pageNumber=${pageNumber}&qsTime=${qsTime}`
  //         : `${baseURL}/${"INE009A01021"}`;

  //     const authHeader = `Basic ${btoa("LKPSECAPI:!36$XF2u")}`; // Encode to Base64

  //     try {
  //       const response = await axios.get(url, {
  //         headers: {
  //           Authorization: authHeader,
  //           "Content-Type": "application/json",
  //         },
  //       });
  //       console.log("Stock News:", response.data);
  //       return response.data;
  //     } catch (error) {
  //       console.error("Error fetching stock news:", error);
  //     }
  //   };
  //   const sampleApi = fetchStockNews("INE009A01021");
  //   console.log("news Api", sampleApi);
  // }, []);

  useEffect(() => {
    if (activeMenu && activeMenu === "Share Holding") {
      const fetchFundamentalShareHolding = async () => {
        dispatch(showLoader("Please wait we are processing your request"));
        apiServices
          .getFundamentalShareholding({})
          .then((response) => {
            dispatch(hideLoader());
            console.log("getFundamentalShareholdingResponse", response?.data);
            setFundamentalShareHolding(response?.data);
          })
          .catch((error) => {
            dispatch(hideLoader());
            console.log("error", error);
          });
      };
      fetchFundamentalShareHolding();
    }
  }, [activeMenu]);

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
