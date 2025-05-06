import React, { useEffect, useState } from "react";
import { Card, CardBody, Container, Row } from "reactstrap";
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
import Nudge from "../../components/common/Nudge";

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
  selectedViewMore?: any;
}

const DashboardCrypto = ({
  selectedTrading,
  selectedViewMore,
}: DashboardCrypto) => {
  const [selectedItem, setSelectedItem] = useState(
    "Clients With Ledger Balance"
  );
  const [t6Data, setT6Data] = useState<T6Selling[]>([]);
  const [tradeCWCBData, setTradeCWCBData] = useState<CWCB[]>([]);
  const [isNudgeOpen, setIsNudgeOpen] = useState(false);
  const [dashboardNudgeData, setDashboardNudgeData] = useState<any[][]>([]);
  const [modal_animationZoom, setmodal_animationZoom] = useState(false);
  const [responseStatus, setResponseStatus] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [filteredtradeCWCBData, setFilteredtradeCWCBData] = useState<any[]>([]);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    console.log("testProps->", selectedViewMore);
    if (selectedViewMore === "T6") {
      setSelectedItem("Clients Ageing Report");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [selectedViewMore]);

  const { accessType } = useSelector(
    (state: RootState) => state.AuthUser?.data?.data
  );

  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );
  console.log("accessType----", accessType);

  const handleItemClick = (data: any) => {
    console.log("value->", data);
    setSelectedItem(data);
  };

  useEffect(() => {
    const hasFetched = sessionStorage.getItem("dashboardNudgeFetched");
    if (hasFetched) return; // If fetched before, do nothing
    sessionStorage.setItem("dashboardNudgeFetched", "true"); // Mark as fetched

    const fetchDashboardNudge = async () => {
      const payload = {
        user_id: user_id,
      };
      // debugger;
      try {
        dispatch(showLoader(""));
        const response = await apiServices.DashboardNudge(payload);
        console.log("dashBoardNudgeData", typeof response?.data);

        const nudgeData = response?.data;
        setDashboardNudgeData(nudgeData);

        dispatch(hideLoader());

        if (response?.status === 200) {
          // ShowToast("success", response?.data?.Message);
          setIsNudgeOpen(!isNudgeOpen);
        } else {
          console.error("Failed");
        }
      } catch (error) {
        dispatch(hideLoader());
        console.error("Error sending email:", error);
      }
    };
    fetchDashboardNudge();
  }, [dispatch]);

  useEffect(() => {
    if (selectedTrading === "T6") {
      setSelectedItem("Clients Ageing Report");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [selectedTrading]);

  useEffect(() => {
    console.log("Tesr1213", accessType);
  }, []);

  useEffect(() => {
    if (accessType === "") {
      setT6Data([]);
      dispatch(showLoader("Please wait"));
      const fetchCWCBReport = async () => {
        // tradeData([]);
        // setSelectedZone(null);
        // setSelectedBranchCode(null);
        const payload = {
          user_id: user_id,
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
              setResponseStatus(true);
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
  }, [dispatch, accessType, selectedItem]);

  useEffect(() => {
    const fetchClientCash = async () => {
      if (selectedItem === "Clients Ageing Report") {
        setTradeCWCBData([]);
        const payload = {
          user_id: user_id,
        };
        try {
          dispatch(showLoader(""));
          const response = await apiServices.T6Selling(payload);
          console.log("ClientCashresponse", response?.data?.data?.Table);
          if (response?.status === 200) {
            setResponseStatus(true);
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
    // if (selectedItem === "Clients Ageing Report") {
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
  const handleSearchBasedOnInput = (value: string) => {
    console.log(
      "handleSearchBasedOnInputValue  upper",
      selectedItem,
      tradeCWCBData,
      value.toUpperCase()
    );
    // debugger;
    setSearchValue(value);
    let filteredAllClients: any[] = [];
    let filteredtradeCWCBData: any[] = [];

    if (selectedItem === "Clients Ageing Report") {
      filteredAllClients = t6Data.filter((item: any) =>
        item.ClientName.toLowerCase().includes(value.toLowerCase())
      );
    } else if (selectedItem === "Clients With Ledger Balance") {
      filteredtradeCWCBData = tradeCWCBData.filter((item: any) =>
        item.ClientName.toLowerCase().includes(value.toLowerCase())
      );
      console.log(
        "ledger agee",
        filteredtradeCWCBData,
        tradeCWCBData,
        searchValue,
        value
      );
    }

    setFilteredData(filteredAllClients);
    setFilteredtradeCWCBData(filteredtradeCWCBData);

    console.log("handleSearchBasedOnInputValue---->", filteredData);
  };

  function tog_animationZoom() {
    setmodal_animationZoom((prev) => !prev);
  }

  useEffect(() => {
    tog_animationZoom();
  }, []);

  document.title = document.title = "LKP Securities | Trading";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {isNudgeOpen && (
            <Nudge
              modal_animationZoom={modal_animationZoom}
              tog_animationZoom={tog_animationZoom}
              dashBoardNudgeData={dashboardNudgeData}
            />
          )}
          {/* <Row> */}
          {/* <Col className="col-xxl-9 order-xxl-0 order-first m-2"> */}{" "}
          <Row>
            <Widgets
              selectedWidget={selectedItem}
              handleItemClick={handleItemClick}
            />
            {selectedItem === "Reasearch Calls" && <TradeCapsule />}
            {/* {selectedItem === "Clients With Ledger Balance" && <DropDown />} */}
          </Row>
          <Card
            style={{
              borderRadius: "15px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
            }}
          >
            <CardBody>
              <TradeInfo
                T6Data={filteredData.length > 0 ? filteredData : t6Data}
                tradeCWCBData={
                  filteredtradeCWCBData.length > 0
                    ? filteredtradeCWCBData
                    : tradeCWCBData
                }
                selectedWidget={selectedItem}
                handleExcel={handleExcel}
                showSearch={responseStatus}
                handleSearchBasedOnInput={handleSearchBasedOnInput}
              />
            </CardBody>
          </Card>
          {/* </Col> */}
          {/* </Row> */}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default DashboardCrypto;
