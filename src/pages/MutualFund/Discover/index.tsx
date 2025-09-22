import { Col, Row, Card } from "reactstrap";
import SipCalculator from "./sipCalculator";
import BasicTabs from "../../../components/common/MutualFunds/NavTabs";
import MfCards from "../../../components/common/MutualFunds/MfCards";
import {
  MfCardRecoLabel,
  MfCardPassLabel,
  popularTabList,
  assetClassTabList,
} from "../../../pages/MutualFund/mfTypes";
import MfinfoCard from "../../../components/common/MutualFunds/MfInfoCard";
import { useEffect, useState } from "react";
import MutualFundList from "./MutualFundList";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { apiServices } from "../../../services";

const MfDiscover = ({ onSelectFund, hasToken }: any) => {
  const [popularTab, setPopularTab] = useState("Large Cap");
  const [popularTabOrder, setPopularTabOrder] = useState(0);
  const [selectedMfType, setSelectedMfType] = useState("");
  const [popularCategorydata, setPopularCategorydata] = useState<any[]>([]);
  const [assetTab, setAssetTab] = useState("Equity");
  const [assetTabOrder, setAssetTabOrder] = useState(0);
  const [assetClassData, setAssetClassData] = useState<any[]>([]);

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
          pageNumber: 1,
          pageSize: 5,
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
    <Card
      style={{
        borderRadius: "15px",
        // marginBottom: "16px",
        padding: "16px",
      }}
    >
      {selectedMfType ? (
        <MutualFundList
          selectedMfType={selectedMfType}
          onBack={handleBack}
          onSelectFund={onSelectFund}
        />
      ) : (
        <Row>
          <Card
            style={{
              borderRadius: "15px",
              // marginBottom: "16px",
              padding: "16px",
            }}
          >
            <BasicTabs
              heading="Popular Category"
              tabs={popularTabList}
              value={popularTabOrder}
              onChange={handleTabChange}
            />
            {popularCategorydata.length > 0 && (
              <MfinfoCard
                CardType="Popular Category"
                funds={popularCategorydata}
                handleSelectedMutualFund={handleSelectedMutualFund}
              />
            )}
          </Card>
          <Col xl={8}>
            {/* Recommendation Section */}
            <Card
              style={{
                borderRadius: "15px",
                margin: "0",
                padding: "16px",
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

            {/* Asset Class Section */}
            <Card
              style={{
                borderRadius: "15px",
                // marginBottom: "16px",
                padding: "16px",
              }}
            >
              <BasicTabs
                heading="Asset Class"
                tabs={assetClassTabList}
                value={assetTabOrder}
                onChange={handleAssetTabChange}
              />
              {assetClassData.length > 0 && (
                <MfinfoCard
                  CardType="Asset Class"
                  funds={assetClassData}
                  handleSelectedMutualFund={handleSelectedMutualFund}
                />
              )}
            </Card>

            {/* Passive & Product Cards */}
            <Row>
              <Col xl={6}>
                <Card
                  style={{
                    borderRadius: "15px",
                    margin: "0",
                    padding: "16px",
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

            {/* Popular Category Section */}
          </Col>

          {/* Right Section */}
          <Col xl={4}>
            <SipCalculator />
          </Col>
        </Row>
      )}
    </Card>
  );
};

export default MfDiscover;
