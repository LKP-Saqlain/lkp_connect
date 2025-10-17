import React, { useEffect, useState } from "react";
import { Card, CardBody, Container, Row } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { showLoader, hideLoader } from "../../redux/slices/loaderSlice";
import Widgets from "./Widgets";
// import TradeCapsule from "./TradeCapsules";
import TradeInfo from "../../components/common/UserInfoTable";
import { apiServices } from "../../services";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import ShowToast from "../../utils/toastUtils";
import Nudge from "../../components/common/Nudge";
import TradeCard from "../../components/common/tradeCard";
import ResearchTabs from "../../components/common/CustomCards";
import dayjs from "dayjs";
// import { Pagination } from "@mui/material";

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
  showMyPerformance?: any;
}

const DashboardCrypto = ({
  selectedTrading,
  selectedViewMore,
  showMyPerformance,
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
  const [researchCalls, setResearchCalls] = useState<any[]>([]);
  const [allCalls, setAllCalls] = useState<any[]>([]);
  const [equityCalls, setEquityCalls] = useState<any[]>([]);
  const [foCalls, setFoCalls] = useState<any[]>([]);
  const [commodityCalls, setCommodityCalls] = useState<any[]>([]);
  const [currencyCalls, setCurrencyCalls] = useState<any[]>([]);
  const [filteredCalls, setFilteredCalls] = useState<any[]>([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("All");
  const [uniqueSubCategories, setUniqueSubCategories] = useState<string[]>([]);
  const [selectedTab, setSelectedTab] = useState<number>(0);
  //pagination logic
  // const [currentPage, setCurrentPage] = useState(1);
  // const recordsPerPage = 10;

  // const indexOfLastRecord = currentPage * recordsPerPage;
  // const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  // const currentRecords = filteredCalls.slice(
  //   indexOfFirstRecord,
  //   indexOfLastRecord
  // );

  // const totalPages = Math.ceil(filteredCalls.length / recordsPerPage);

  // const handlePageChange = (
  //   event: React.ChangeEvent<unknown>,
  //   value: number
  // ) => {
  //   console.log(event);

  //   setCurrentPage(value);
  // };
  //ends here
  const dispatch = useDispatch<AppDispatch>();
  const sessionExpired = useSelector(
    (state: RootState) => state.sessionExpired.data.session
  );

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
    if (showMyPerformance) {
      const hasFetched = sessionStorage.getItem("dashboardNudgeFetched");
      if (hasFetched) return; // If fetched before, do nothing
      sessionStorage.setItem("dashboardNudgeFetched", "true"); // Mark as fetched

      const fetchDashboardNudge = async () => {
        const payload = {
          user_id: user_id,
        };
        // debugger;
        try {
          dispatch(
            showLoader("Please wait, we are processing your request...")
          );
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
    }
  }, [dispatch, showMyPerformance]);

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
      dispatch(showLoader("Please wait, we are processing your request..."));
      const fetchCWCBReport = async () => {
        // tradeData([]);
        // setSelectedZone(null);
        // setSelectedBranchCode(null);
        const payload = {
          user_id: user_id,
          zone: "ALL",
          branchCode: "ALL",
        };
        dispatch(showLoader("Please wait, we are processing your request..."));
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
          dispatch(
            showLoader("Please wait, we are processing your request...")
          );
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
      dispatch(showLoader("Please wait, we are processing your request..."));
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
      filteredAllClients = t6Data.filter(
        (item: any) =>
          item.ClientName.toLowerCase().includes(value.toLowerCase()) ||
          item.ClientCode.toLowerCase().includes(value.toLowerCase())
      );
    } else if (selectedItem === "Clients With Ledger Balance") {
      filteredtradeCWCBData = tradeCWCBData.filter(
        (item: any) =>
          item.ClientName.toLowerCase().includes(value.toLowerCase()) ||
          item.ClientCode.toLowerCase().includes(value.toLowerCase())
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

  const handleTabClick = (value: number) => {
    setSelectedTab(value);
    let filteredByCategory = [];

    if (value === 0) filteredByCategory = allCalls;
    if (value === 1)
      filteredByCategory = allCalls.filter(
        (item) => item.category === "Equity"
      );
    if (value === 2)
      filteredByCategory = allCalls.filter((item) => item.category === "F&O");
    if (value === 3)
      filteredByCategory = allCalls.filter(
        (item) => item.category === "Commodity"
      );
    if (value === 4)
      filteredByCategory = allCalls.filter(
        (item) => item.category === "Currency"
      );

    // Apply subCategory filter if not "All"
    if (selectedSubCategory && selectedSubCategory !== "All" && value !== 0) {
      filteredByCategory = filteredByCategory.filter(
        (item) => item.subCategory === selectedSubCategory
      );
    }

    setFilteredCalls(filteredByCategory);
  };

  useEffect(() => {
    tog_animationZoom();
  }, []);

  useEffect(() => {
    if (selectedItem === "Reasearch Calls") {
      let payload = {
        user_id: user_id,
        groupName: "GSG",
        activeCallFlag: 1,
      };
      dispatch(showLoader(""));
      apiServices
        .ResearchCallData(payload)
        .then((response) => {
          if (response?.status === 200) {
            console.log("API_RESPONSE", response?.data?.data);

            setResearchCalls(response?.data?.data || []);
            const data = response?.data?.data || [];
            console.log(researchCalls);

            setAllCalls(data);
            setEquityCalls(
              data.filter((item: any) => item.category === "Equity")
            );
            setFoCalls(data.filter((item: any) => item.category === "F&O"));
            setCommodityCalls(
              data.filter((item: any) => item.category === "Commodity")
            );

            setCurrencyCalls(
              data.filter((item: any) => item.category === "Currency")
            );

            const uniqueSubs: any = [
              "All",
              ...Array.from(new Set(data.map((item: any) => item.subCategory))),
            ];
            setUniqueSubCategories(uniqueSubs);

            uniqueSubs.forEach((subCat: any, index: any) => {
              console.log(`${index + 1}. ${subCat}`);
            });

            console.log(
              "dummyConsole",
              uniqueSubs,
              equityCalls,
              foCalls,
              commodityCalls,
              currencyCalls
            );
            setFilteredCalls(data);
            console.log(
              "uniqueSubCategories-->",
              selectedTab,
              uniqueSubCategories
            );
          }
          dispatch(hideLoader());
        })
        .catch((error) => {
          console.log("Errrrror", error);
          dispatch(hideLoader());
        });
    }
  }, [dispatch, selectedItem]);

  const handleSubCategoryFilter = (subCat: string) => {
    setSelectedSubCategory(subCat);
    console.log("TestTestTest", selectedTab, subCat, filteredCalls);
    let filtered = allCalls;
    switch (selectedTab) {
      case 1:
        filtered = filtered.filter((item) => item.category === "Equity");
        break;
      case 2:
        filtered = filtered.filter((item) => item.category === "F&O");
        break;
      case 3:
        filtered = filtered.filter((item) => item.category === "Commodity");
        break;
      case 4:
        filtered = filtered.filter((item) => item.category === "Currency");
        break;
      default:
        break; // 0 or All
    }

    if (subCat !== "All") {
      filtered = filtered.filter((item) => item.subCategory === subCat);
    }

    setFilteredCalls(filtered);
  };

  const tabCategoryMap: Record<number, string> = {
    1: "Equity",
    2: "F&O",
    3: "Commodity",
    5: "Currency",
  };

  const filteredSubCategories = uniqueSubCategories.filter((subCat) => {
    // For 'All' (0) and 'Fundamental' (4), show all subcategories
    if (selectedTab === 0 || selectedTab === 4) return true;

    // For others, only show subcategories that have data
    return allCalls.some(
      (item) =>
        item.category === tabCategoryMap[selectedTab] &&
        item.subCategory === subCat
    );
  });

  const finalSubCategories =
    selectedTab !== 0 && selectedTab !== 4
      ? ["All", ...filteredSubCategories]
      : filteredSubCategories;

  useEffect(() => {
    console.log("filteredCallsData", filteredCalls);
  }, [filteredCalls]);

  document.title = document.title = "LKP Securities | Zone Target";
  return (
    <React.Fragment>
      <div className="page-content page-view">
        <Container fluid>
          {isNudgeOpen && !sessionExpired && (
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
            {/* {selectedItem === "Reasearch Calls" && <TradeCapsule />} */}
            {/* {selectedItem === "Clients With Ledger Balance" && <DropDown />} */}
          </Row>
          {selectedItem === "Clients With Ledger Balance" ||
          selectedItem === "Clients Ageing Report" ? (
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
          ) : (
            <>
              {" "}
              <Card
                style={{
                  borderRadius: "15px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                  // padding: "14px",
                }}
              >
                <CardBody>
                  <ResearchTabs TabClick={handleTabClick} />
                  {selectedTab !== 0 && selectedTab !== 4 && (
                    <div
                      style={{
                        marginBottom: "12px",
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "2px",
                      }}
                    >
                      {finalSubCategories.map((subCat) => (
                        <div
                          key={subCat}
                          onClick={() => handleSubCategoryFilter(subCat)}
                          style={{
                            fontWeight: 500,
                            fontSize: "10px",
                            color:
                              selectedSubCategory === subCat
                                ? "#fff"
                                : "#11395C",
                            backgroundColor:
                              selectedSubCategory === subCat
                                ? "#11395C"
                                : "#e6f0ff",
                            borderRadius: "5px",
                            padding: "4px 12px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            cursor: "pointer",
                            userSelect: "none",
                            transition: "background-color 0.2s ease",
                            marginRight: "3px",
                          }}
                        >
                          {subCat}
                        </div>
                      ))}
                    </div>
                  )}

                  <div>
                    {filteredCalls.length > 0 ? (
                      [...filteredCalls]
                        .sort((a, b) => {
                          const dateA = dayjs(
                            a.validity,
                            "DD-MM-YYYY HH:mm:ss"
                          );
                          const dateB = dayjs(
                            b.validity,
                            "DD-MM-YYYY HH:mm:ss"
                          );

                          if (!dateA.isValid()) return 1; // invalid dates go last
                          if (!dateB.isValid()) return -1;

                          return dateB.valueOf() - dateA.valueOf(); // descending
                        })
                        .map((item, index) => (
                          <TradeCard
                            key={index}
                            stockName={item.scripName}
                            exchange={`${item.exchange}`}
                            ltp={parseFloat(item.lastTradedPrice)}
                            ltpChange={0}
                            stopLoss={parseFloat(item.stopLoss)}
                            recPrice={parseFloat(item.price)}
                            targetPrice={parseFloat(item.targetPrice)}
                            status={item.status}
                            category={item.category}
                            tag={item.subCategory}
                            dateTime={item.validity}
                            partialProfitText={item.statusDescreption}
                            buySell={item.buySell}
                            type="ResearchCall"
                            exchSegment={item.exchSegment}
                            selectedTab={selectedTab}
                          />
                        ))
                    ) : (
                      <>
                        <Card
                          style={{
                            borderRadius: "8px",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                            border: "1px solid #e0e0e0",
                            backgroundColor: "#f9f9f9",
                            textAlign: "center",
                          }}
                        >
                          <CardBody
                            style={{
                              // padding: "40px 20px",
                              fontSize: "16px",
                              fontWeight: 500,
                              color: "#666",
                            }}
                          >
                            No Records Found!
                          </CardBody>
                        </Card>
                      </>
                    )}
                  </div>
                </CardBody>
              </Card>
            </>
          )}
          {/* </Col> */}
          {/* </Row> */}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default DashboardCrypto;
