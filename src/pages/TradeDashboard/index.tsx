import React, { useEffect, useState } from "react";
import { Container, Row } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { showLoader, hideLoader } from "../../redux/slices/loaderSlice";
import Widgets from "./Widgets";
import TradeCapsule from "./TradeCapsules";
import TradeInfo from "../../components/common/UserInfoTable";
import { apiServices } from "../../services";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import ShowToast from "../../utils/toastUtils";

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

interface CWCB {
  Brokerage_for_1month: number; // Brokerage for 1 month
  Brokerage_for_3months: number; // Brokerage for 3 months
  Brokerage_for_currentmonth: number; // Brokerage for the current month
  Cash: number; // Cash balance
  ClientCode: string; // Client code
  ClientName: string; // Client name
  LastTradeDate: string; // Last trade date (format: YYYY-MM-DD)
  MobileNo: string; // Mobile number
}
interface DashboardCrypto {
  selectedTrading?: any;
}

const DashboardCrypto = ({ selectedTrading }: DashboardCrypto) => {
  const [selectedItem, setSelectedItem] = useState(
    "Clients With Ledger Balance"
  );
  const [t6Data, setT6Data] = useState<T6Selling[]>([]);
  const [tradeCWCBData, setTradeCWCBData] = useState<CWCB[]>([]);
  const dispatch = useDispatch<AppDispatch>();

  const { accessType } = useSelector(
    (state: RootState) => state.AuthUser?.data?.data
  );

  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );
  console.log(accessType);

  const handleItemClick = (data: any) => {
    console.log("value->", data);
    setSelectedItem(data);
  };

  useEffect(() => {
    if (selectedTrading === "T6") {
      setSelectedItem("Clients Ageing Report");
    }
  }, [selectedTrading]);

  useEffect(() => {
    if (selectedItem === "" || selectedItem === "Clients With Ledger Balance") {
      setT6Data([]);
      dispatch(showLoader("Please wait"));
      const fetchCWCBReport = async () => {
        // tradeData([]);
        // setSelectedZone(null);
        // setSelectedBranchCode(null);
        let Id = localStorage.getItem("Id");
        const payload = {
          user_id: Id,
          zone: "ALL",
          branchCode: "ALL",
        };
        dispatch(showLoader(""));
        apiServices
          .ClientCash(payload)
          .then((response) => {
            console.log("ClientCashresponse", response?.data?.data);
            // handleValues(response?.data?.data);
            dispatch(hideLoader());
            if (response?.status === 200) {
              ShowToast("error", response?.data);
              // let { recordsTotal } = response?.data[0];
              // setTotalEntries(recordsTotal);
              // setUserData(response.data);
              setTradeCWCBData(response?.data?.data);
            }
          })
          .catch((error) => {
            console.log("Error->", error);
            // const zoneError = error.response?.data?.errors?.Zone["0"];
            // const branchCodeError = error?.response?.data?.errors?.BranchCode["0"];
            dispatch(hideLoader());
            ShowToast("error", error.response?.data?.message);
            // ShowToast("error", zoneError);
            // ShowToast("error", branchCodeError);
          })
          .finally(() => {
            dispatch(hideLoader());
          });
      };
      fetchCWCBReport();
    }
  }, [dispatch, selectedItem]);

  useEffect(() => {
    const fetchClientCash = async () => {
      if (selectedItem === "Clients Ageing Report") {
        setTradeCWCBData([]);
        // const Id = localStorage.getItem("Id");
        const payload = {
          user_id: user_id,
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

  const handleExcel = async () => {
    // alert("I am Clicked");
    // if (selectedItem === "Clients Ageing Report") {
    // const Id = localStorage.getItem("Id");
    const payload = {
      user_id: user_id,
    };
    try {
      dispatch(showLoader(""));
      const response = await apiServices.T6Selling(payload);
      console.log("ClientCashresponse", response?.data?.data?.Table);
      if (response?.status === 200) {
        dispatch(hideLoader());
        // setT6Data(response?.data?.data?.Table);
        const data: T6Selling[] = response?.data?.data?.Table;

        // Convert data to a worksheet
        const worksheet = XLSX.utils.json_to_sheet(data);
        // Create a workbook and append the worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(
          workbook,
          worksheet,
          "Clients Ageing Report Data"
        );
        // Convert the workbook to a binary file
        const excelBuffer = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array",
        });
        const excelFile = new Blob([excelBuffer], {
          type: "application/octet-stream",
        });
        saveAs(excelFile, "T6_Selling_Data.xlsx");
      }
    } catch (error) {
      // console.error("Error->", error);
      dispatch(hideLoader());
      // console.error("Error fetching T6 data:", error?.response || error?.message || error);
      // }
    }
  };

  document.title = document.title = "LKP Securities | Trading";
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
            {/* {selectedItem === "Clients With Ledger Balance" && <DropDown />} */}
          </Row>
          <TradeInfo
            T6Data={t6Data}
            tradeCWCBData={tradeCWCBData}
            selectedWidget={selectedItem}
            handleExcel={handleExcel}
          />
          {/* </Col> */}
          {/* </Row> */}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default DashboardCrypto;
