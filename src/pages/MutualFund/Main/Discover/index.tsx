import { Col, Row, Card } from "reactstrap";
import SipCalculator from "./sipCalculator";
import BasicTabs from "../../../../components/common/MutualFunds/NavTabs";
import MfCards from "../../../../components/common/MutualFunds/MfCards";
import {
  MfCardRecoLabel,
  MfCardPassLabel,
  popularTabList,
  assetClassTabList,
  returnPeriodsTabs,
} from "../../mfTypes";
import MfinfoCard from "../../../../components/common/MutualFunds/MfInfoCard";
import { useEffect, useState } from "react";
import MutualFundList from "./MutualFundList";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../redux/store";
import { hideLoader, showLoader } from "../../../../redux/slices/loaderSlice";
import { apiServices } from "../../../../services";

const MfDiscover = ({ onSelectFund, hasToken }: any) => {
  const [popularTab, setPopularTab] = useState("Large Cap");
  const [popularTabOrder, setPopularTabOrder] = useState(0);
  const [selectedMfType, setSelectedMfType] = useState("");
  const [popularCategorydata, setPopularCategorydata] = useState<any[]>([]);
  const [assetTab, setAssetTab] = useState("Equity");
  const [assetTabOrder, setAssetTabOrder] = useState(0);
  const [assetClassData, setAssetClassData] = useState<any[]>([]);
  const [selectedReturnPeriod, setSelectedReturnPeriod] = useState("1Y");

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    console.log(onSelectFund, "discover onSelectFund");
  }, []);

  useEffect(() => {
    console.log("propssss", hasToken);
  }, [hasToken]);

  const productTypeMap: Record<string, any> = {
    "Large Cap": 14,
    ELSS: 20,
    "Small Cap": 16,
    "Mid Cap": 15,
    Equity: "Equity Schemes",
    Debt: "Debt Schemes",
    Hybrid: "Hybrid Schemes",
    Solution: "Solution-Oriented Schemes",
    Others: "Others Schemes",
  };

  useEffect(() => {
    const fetchData = async () => {
      dispatch(showLoader("Please wait we are processing your request"));

      const productId = productTypeMap[popularTab];

      if (!productId) {
        dispatch(hideLoader());
        console.warn("Unsupported popularTab:", popularTab);
        return;
      }

      try {
        const payload = {
          ProductId: productId,
          BrokerID: 10001662,
          SortColumn: "",
          SortOrder: 1,
          RecordsPerPage: 50,
          PageNumber: 1,
        };

        const response = await apiServices.MF_BasketDetialedList(payload);
        const rawData = response?.data?.data?.returnsList ?? [];

        const formattedData = rawData.map((item: any, index: number) => ({
          id: index + 1,
          ...item,
        }));

        setPopularCategorydata(formattedData);
        console.log(formattedData, "popularCategorydata");
      } catch (error) {
        console.error("Error fetching data for", popularTab, error);
      } finally {
        dispatch(hideLoader());
      }
    };

    if (popularTab) {
      fetchData();
    }
  }, [dispatch, popularTab, hasToken]);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(showLoader("Please wait, we are processing your request..."));
      const assetName = productTypeMap[assetTab];
      try {
        const response = await apiServices.MF_FundOverView({
          pageNumber: 0,
          pageSize: 10,
          searchKey: "",
          schemeCode: 0,
          sipMinimum: "",
          lumpsumMinimum: "",
          riskCategory: "",
          assetClass: assetName,
          schemeCategory: "",
          encryptionKey: "",
        });

        const fundOverviewData = response?.data?.data;
        setAssetClassData(fundOverviewData || []);
        console.log(fundOverviewData, "fundOverviewData AssetClass");
      } catch (err: any) {
        console.error("Error fetching fund overview:", err.message);
      } finally {
        dispatch(hideLoader());
      }
    };

    fetchData();
  }, [dispatch, assetTab, hasToken]);

  const handleSelectedMfType = (MfType: string) => {
    setSelectedMfType(MfType);
    console.log("selectedMfType", MfType);
  };
  const handleSelectedMutualFund = (schemeCode: string) => {
    console.log("selectedMutualFund", schemeCode);
    onSelectFund(schemeCode);
  };
  const handleBack = () => {
    setSelectedMfType("");
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    const label = popularTabList[newValue]?.label;
    setPopularTab(label);
    setPopularTabOrder(newValue);
    console.log("Selected Tab:", label, "Index:", newValue);
  };
  const handleAssetTabChange = (
    _event: React.SyntheticEvent,
    newValue: number
  ) => {
    const label = assetClassTabList[newValue]?.label;
    setAssetTab(label);
    setAssetTabOrder(newValue);
  };

  return (
    <Card style={{ borderRadius: "15px", padding: "16px" }}>
      {selectedMfType ? (
        <MutualFundList
          selectedMfType={selectedMfType}
          onBack={handleBack}
          onSelectFund={onSelectFund}
        />
      ) : (
        <Row>
          <Col xl={12}>
            <Card
              style={{
                borderRadius: "15px",
                padding: "16px",
                marginBottom: "16px",
              }}
            >
              <BasicTabs
                heading="Popular Category"
                tabs={popularTabList}
                value={popularTabOrder}
                onChange={handleTabChange}
                returnPeriods={returnPeriodsTabs}
                selectedReturnPeriod={selectedReturnPeriod}
                onReturnPeriodChange={setSelectedReturnPeriod}
              />
              {popularCategorydata.length > 0 && (
                <MfinfoCard
                  CardType="Popular Category"
                  funds={popularCategorydata}
                  handleSelectedMutualFund={handleSelectedMutualFund}
                  selectedReturnPeriod={selectedReturnPeriod}
                />
              )}
            </Card>
          </Col>

          {/*  Our Recommendation + Calculator */}
          <Col xl={8}>
            <Row>
              <Card
                style={{
                  borderRadius: "15px",
                  padding: "16px",
                  marginBottom: "16px",
                }}
              >
                <BasicTabs
                  heading="Our Recommendation"
                  tabs={[]}
                  value={0}
                  onChange={() => {}}
                />
                <MfCards
                  CardData={MfCardRecoLabel}
                  handleSelectedMfType={handleSelectedMfType}
                />
              </Card>
              <Col xl={4}>
                <Card
                  style={{
                    borderRadius: "15px",
                    padding: "16px",
                    marginBottom: "16px",
                  }}
                >
                  <BasicTabs
                    heading="Product"
                    tabs={[]}
                    value={0}
                    onChange={() => {}}
                  />
                  <MfCards
                    CardData={MfCardPassLabel}
                    handleSelectedMfType={handleSelectedMfType}
                  />
                </Card>
              </Col>
            </Row>
          </Col>
          <Col xl={4}>
            <SipCalculator />
          </Col>

          <Col xl={12}>
            <Card style={{ borderRadius: "15px", padding: "16px" }}>
              <BasicTabs
                heading="Asset Class"
                tabs={assetClassTabList}
                value={assetTabOrder}
                onChange={handleAssetTabChange}
                returnPeriods={returnPeriodsTabs}
                selectedReturnPeriod={selectedReturnPeriod}
                onReturnPeriodChange={setSelectedReturnPeriod}
              />
              {assetClassData.length > 0 && (
                <MfinfoCard
                  CardType="Asset Class"
                  funds={assetClassData}
                  handleSelectedMutualFund={handleSelectedMutualFund}
                  selectedReturnPeriod={selectedReturnPeriod}
                />
              )}
            </Card>
          </Col>
        </Row>
      )}
    </Card>
  );
};

export default MfDiscover;
