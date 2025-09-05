import { Col, Row, Card } from "reactstrap";
import SipCalculator from "./sipCalculator";
import { mutualFundCards } from "../mfTypes";
import BasicTabs from "../../../components/common/MutualFunds/NavTabs";
import MfCards from "../../../components/common/MutualFunds/MfCards";
import {
  MfCardRecoLabel,
  MfCardPassLabel,
} from "../../../pages/MutualFund/mfTypes";
import MfinfoCard from "../../../components/common/MutualFunds/MfInfoCard";
import { useEffect, useState } from "react";
import MutualFundList from "./MutualFundList";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { apiServices } from "../../../services";

const MfDiscover = ({ onSelectFund, hasToken }: any) => {
  const [assetTab, setAssetTab] = useState(0);
  const [popularTab, setPopularTab] = useState("Large Cap");
  const [popularTabOrder, setPopularTabOrder] = useState(0);
  const [selectedMfType, setSelectedMfType] = useState("");
  const [popularCategorydata, setPopularCategorydata] = useState<any[]>([]);

  const dispatch = useDispatch<AppDispatch>();
  const tabList = [
    { label: "Large Cap" },
    { label: "ELSS" },
    { label: "Small Cap" },
    { label: "Mid Cap" },
    // { label: "Others" },
  ];
  useEffect(() => {
    console.log(onSelectFund, "discover onSelectFund");
  }, []);

  useEffect(() => {
    console.log("propssss", hasToken);
  }, [hasToken]);

  const productTypeMap: Record<string, number> = {
    "Large Cap": 14,
    ELSS: 20,
    "Small Cap": 16,
    "Mid Cap": 15,
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
    const label = tabList[newValue]?.label;
    setPopularTab(label);
    setPopularTabOrder(newValue);
    console.log("Selected Tab:", label, "Index:", newValue);
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
              tabs={tabList}
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
                tabs={[
                  { label: "Equity" },
                  { label: "Debt" },
                  { label: "Hybrid" },
                  { label: "Solution" },
                  { label: "Others" },
                ]}
                value={assetTab}
                onChange={(_e, newValue) => setAssetTab(newValue)}
              />

              {assetTab === 0 && (
                <MfinfoCard
                  CardType="Asset Class"
                  funds={mutualFundCards.equity}
                  handleSelectedMutualFund={handleSelectedMutualFund}
                />
              )}
              {assetTab === 1 && (
                <MfinfoCard
                  CardType="Asset Class"
                  funds={mutualFundCards.debt}
                  handleSelectedMutualFund={handleSelectedMutualFund}
                />
              )}
              {assetTab === 2 && (
                <MfinfoCard
                  CardType="Asset Class"
                  funds={mutualFundCards.hybrid}
                  handleSelectedMutualFund={handleSelectedMutualFund}
                />
              )}
              {assetTab === 3 && (
                <MfinfoCard
                  CardType="Asset Class"
                  funds={mutualFundCards.solution}
                  handleSelectedMutualFund={handleSelectedMutualFund}
                />
              )}
              {assetTab === 4 && (
                <MfinfoCard
                  CardType="Asset Class"
                  funds={mutualFundCards.others}
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
