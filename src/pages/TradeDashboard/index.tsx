import React, { useEffect, useState } from "react";
import { Container, Row } from "reactstrap";
import { useDispatch } from "react-redux";
import Widgets from "./Widgets";
import TradeCapsule from "./TradeCapsules";
import TradeInfo from "../../components/common/UserInfoTable";
import { showLoader, hideLoader } from "../../redux/slices/loaderSlice";
import { apiServices } from "../../services";

interface T6Selling {
  ClientCode: string;
  ClientName: string;
  ClosingBal: string;
  T1: string;
  T2: string;
  T3: string;
  T4: string;
  T5: string;
  G5: string;
  StockValue: string;
}

const DashboardCrypto = () => {
  const [selectedItem, setSelectedItem] = useState("");
  const [t6Data, setT6Data] = useState<T6Selling[]>([]);
  const dispatch = useDispatch();

  const handleItemClick = (data: any) => {
    console.log("value->", data);
    setSelectedItem(data);
  };

  useEffect(() => {
    const fetchClientCash = async () => {
      if (selectedItem === "T6 Selling") {
        const Id = localStorage.getItem("Id");
        const payload = {
          user_id: Id,
        };
        try {
          dispatch(showLoader(""));
          const response = await apiServices.T6Selling(payload);
          console.log("ClientCashresponse", response?.data?.data?.Table);
          if (response?.status === 200) {
            dispatch(hideLoader());
            setT6Data(response?.data?.data?.Table);
            // let { recordsTotal } = response?.data[0]; // Extract the necessary data
            // console.log("Records Total:", recordsTotal);
          }
        } catch (error) {
          // console.error("Error->", error);
          dispatch(hideLoader());
          // console.error("Error fetching T6 data:", error?.response || error?.message || error);
        }
      }
    };

    fetchClientCash(); // Call the async function
  }, [selectedItem, dispatch]);

  document.title =
    "Crypto Dashboard | Velzon - React Admin & Dashboard Template";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* <Row> */}
          {/* <Col className="col-xxl-9 order-xxl-0 order-first m-2"> */}
          <Row>
            <Widgets
              selectedWidget={selectedItem}
              handleItemClick={handleItemClick}
            />
            {selectedItem === "Reasearch Calls" && <TradeCapsule />}
            {/* {selectedItem === "Clients With Cash Balance" && <DropDown />} */}
          </Row>
          <TradeInfo T6Data={t6Data} selectedWidget={selectedItem} />
          {/* </Col> */}
          {/* </Row> */}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default DashboardCrypto;
