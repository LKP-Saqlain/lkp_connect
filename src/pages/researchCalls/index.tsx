import React, { useEffect, useState } from "react";
import { Card, CardBody, Col, Row } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { showLoader, hideLoader } from "../../redux/slices/loaderSlice";
import TradeCard from "../../components/common/tradeCard";
import ResearchTabs from "../../components/common/CustomCards";
import dayjs from "dayjs";
import { apiServices } from "../../services";

const ResearchCalls = () => {
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [allCalls, setAllCalls] = useState<any[]>([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("All");
  const [filteredCalls, setFilteredCalls] = useState<any[]>([]);
  const [researchCalls, setResearchCalls] = useState<any[]>([]);
  const [equityCalls, setEquityCalls] = useState<any[]>([]);
  const [foCalls, setFoCalls] = useState<any[]>([]);
  const [commodityCalls, setCommodityCalls] = useState<any[]>([]);
  const [currencyCalls, setCurrencyCalls] = useState<any[]>([]);

  const dispatch = useDispatch<AppDispatch>();
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );

  useEffect(() => {
    fetchResearchCall();
  }, []);

  useEffect(() => {
    setSelectedSubCategory("All");
    handleSubCategoryFilter("All"); // refresh data immediately
  }, [selectedTab]);

  const fetchResearchCall = async () => {
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
          // setUniqueSubCategories(uniqueSubs); // bydefault All is not selected with this hook
          setSelectedSubCategory("All"); //-----> with this Bydefault All is selected

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
          console.log("uniqueSubCategories-->", selectedTab);
        }
        dispatch(hideLoader());
      })
      .catch((error) => {
        console.log("Errrrror", error);
        dispatch(hideLoader());
      });
  };

  const handleTabClick = (value: number) => {
    // alert(value);
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

  const handleRefreshClicked = async () => {
    // Reset main tab selection to "All"
    setSelectedTab(0);

    // Re-fetch API
    await fetchResearchCall();

    //  Reapply filtering for "All" tab to show all records
    handleTabClick(0);
  };

  const SUBCATEGORY_MAP: Record<string, string[]> = {
    Equity: ["All", "Spade", "Alpha", "Momentum", "Wealth", "Positional"],
    "F&O": [
      "All",
      "Spade+",
      "Stock Future",
      "Stock Option",
      "Index Future",
      "Index Option",
    ],
    Commodity: ["All", "Spade", "MCXF", "MCXO"],
    Currency: ["All"], // optional, in case needed later
  };

  const getSubCategoriesForTab = () => {
    switch (selectedTab) {
      case 1:
        return SUBCATEGORY_MAP["Equity"];
      case 2:
        return SUBCATEGORY_MAP["F&O"];
      case 3:
        return SUBCATEGORY_MAP["Commodity"];
      case 4:
        return SUBCATEGORY_MAP["Currency"];
      default:
        return [];
    }
  };

  const handleSubCategoryFilter = (subCat: string) => {
    setSelectedSubCategory(subCat);
    console.log("TestTestTest", selectedTab, subCat, filteredCalls);
    let filtered = allCalls;

    //  Filter by main tab (category)
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
        break;
    }

    //  Filter by selected subcategory
    if (subCat !== "All") {
      filtered = filtered.filter((item) => {
        const itemSub = item.subCategory?.trim().toLowerCase() || "";
        const selectedSub = subCat.trim().toLowerCase();
        return itemSub === selectedSub;
      });
    }

    setFilteredCalls(filtered);
  };

  return (
    <React.Fragment>
      <div className="page-content page-view">
        <div className="container-fluid">
          <Row className="row-font">
            <Col lg={12}>
              <Card
                style={{
                  minHeight: "80vh",
                  borderRadius: "15px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                }}
              >
                {/* <CardHeader
                  style={{
                    borderRadius: "15px 15px 0 0",
                    boxShadow: "0 -4px 8px rgba(0, 0, 0, 0.15)",
                    backgroundColor: "#fff",
                    padding: "0.2rem 0.8rem",
                  }}
                >
                  <h4 className="card-title mb-0">{activeMenu}</h4>
                </CardHeader> */}
                <CardBody>
                  {" "}
                  <ResearchTabs
                    TabClick={handleTabClick}
                    handleRefreshClicked={handleRefreshClicked}
                    value={selectedTab}
                  />
                  {selectedTab !== 0 && selectedTab !== 4 && (
                    <div
                      style={{
                        marginBottom: "12px",
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "2px",
                      }}
                    >
                      {getSubCategoriesForTab().map((subCat) => (
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
                          // Prefer insertionTime if available, else fallback to validity
                          const dateA = dayjs(
                            a.insertionTime || a.validity,
                            "DD-MM-YYYY HH:mm:ss"
                          );
                          const dateB = dayjs(
                            b.insertionTime || b.validity,
                            "DD-MM-YYYY HH:mm:ss"
                          );

                          // Invalid dates go last
                          if (!dateA.isValid()) return 1;
                          if (!dateB.isValid()) return -1;

                          // Descending order (latest first)
                          return dateB.valueOf() - dateA.valueOf();
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
                            insertionTime={item.insertionTime}
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
                              fontWeight: 400,
                              color: "#666",
                            }}
                          >
                            No Research Data
                          </CardBody>
                        </Card>
                      </>
                    )}
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ResearchCalls;
