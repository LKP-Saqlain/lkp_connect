import { Card, CardBody, Col, Row } from "reactstrap";
import StatItem from "../../../../components/common/StatItem";
import { useEffect, useState } from "react";
import { hideLoader, showLoader } from "../../../../redux/slices/loaderSlice";
import { apiServices } from "../../../../services";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../redux/store";

const FundOverview = ({ activeMenu, selectedIsin }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const [overviewData, setOverviewData] = useState<any[]>([]);

  const formatValue = (val: number) => {
    const cleaned = Number(val);
    const formatted = new Intl.NumberFormat("en-IN").format(
      cleaned === 0 ? 0 : cleaned
    );
    return formatted;
  };

  const getStatValue = (key: string) => {
    const stat = overviewData?.find((item: any) => item.unique_name === key);
    return {
      value:
        stat?.value !== undefined
          ? `${formatValue(stat.value)} ${stat.unit || ""}`
          : "-",
      // dynamicColor: stat?.color || undefined,
    };
  };

  useEffect(() => {
    if (!selectedIsin) {
      setOverviewData([]);
      return;
    }
    if (selectedIsin) {
      const fetchFundamentalOverview = async () => {
        dispatch(showLoader("Please wait we are processing your request"));
        try {
          const response = await apiServices.getFundamentalOverview(
            selectedIsin
          );
          dispatch(hideLoader());
          console.log(
            "getFundamentalOverviewResponse",
            response?.data?.fundamentalData
          );
          setOverviewData(response?.data?.fundamentalData || []);
        } catch (error) {
          dispatch(hideLoader());
          console.log("error", error);
        }
      };

      if (selectedIsin) {
        fetchFundamentalOverview();
      }
    }
  }, [activeMenu, selectedIsin]);

  return (
    <Card style={{ borderRadius: "23px", marginTop: "2rem" }}>
      <CardBody>
        <Row className="details-card gx-3 gy-3">
          {/* Column 1 */}
          <Col xs="12" md={4} className="text-center">
            <div
              style={{
                fontWeight: "bold",
                fontSize: "18px",
                fontFamily: "Public Sans",
                padding: "8px",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
              }}
            >
              <StatItem label="Market Caps" {...getStatValue("MCAP_Q")} />
              <StatItem label="Company P/E" {...getStatValue("PE_TTM")} />
              <StatItem label="Op Revenue TTM" {...getStatValue("SR_TTM")} />
              <StatItem label="ROE" {...getStatValue("ROE_A")} />
            </div>
          </Col>

          {/* Column 2 */}
          <Col xs="12" md={4} className="text-center">
            <div
              style={{
                fontWeight: "bold",
                fontSize: "18px",
                fontFamily: "Public Sans",
                padding: "8px",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
              }}
            >
              <StatItem label="Current Price" value="--" />
              <StatItem label="Company P/BV" {...getStatValue("PBV_A")} />
              <StatItem label="Net Profit TTM" {...getStatValue("NP_TTM")} />
              <StatItem
                label="Cash From Operating Activity"
                {...getStatValue("CFO_A")}
              />
            </div>
          </Col>

          {/* Column 3 */}
          <Col xs="12" md={4} className="text-center">
            <div
              style={{
                fontWeight: "bold",
                fontSize: "18px",
                fontFamily: "Public Sans",
                padding: "8px",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
              }}
            >
              <StatItem label="52 Wk Hi / Lo" value="--" />
              <StatItem label="Company PEG" {...getStatValue("PEG_TTM")} />
              <StatItem
                label="Dividend Yield"
                {...getStatValue("DIVIDEND_YIELD_1_YR")}
              />
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default FundOverview;
