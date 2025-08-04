import { Col, Row } from "reactstrap";
import DashboardCard from "../../../components/common/DashboardCard";
import { useMediaQuery } from "rsuite/esm/useMediaQuery/useMediaQuery";
import theme from "../../../theme";
import RevenueImg from "../../../assets/images/revenue_new.json";
import ActiveClient from "../../../assets/images/Clients.json";
import CoinIcon from "../../../assets/images/coins.json";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { apiServices } from "../../../services";
import AchieveCard from "./AchieveCard";

interface APContestData {
  rowId: number;
  apCode: string;
  apName: string;
  zone: string;
  qtarget: number;
  newClientCount: number;
  prize: string;
  freshCashMargin: number;
  mfauM_Net: number;
  freshCash: number;
  mfaum: number;
}

const EMPContest = () => {
  const [revenueCard, setRevenueCard] = useState({
    broking: 0,
    nonBroking: 0,
    freeCash_Margin: 0,
    mfAUM_NET: 0,
    newClient: 0,
    reactivate: 0,
  });
  const [achieveCard, setAchieveCard] = useState({
    broking: 0,
    nonBroking: 0,
    freeCash_Margin: 0,
    mfAUM_NET: 0,
    newClient: 0,
    reactivate: 0,
  });
  const [targetData, setTargetData] = useState<APContestData | null>(null);
  const [achievedData, setAchievedData] = useState<APContestData | null>(null);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch<AppDispatch>();
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );

  useEffect(() => {
    const payload = { user_id: user_id };
    dispatch(showLoader(""));
    Promise.all([
      apiServices.GetEMPContestTargetDetails(payload),
      apiServices.GetEmpContestAchievedSummary(payload),
    ])

      .then(([GetEMPContestTargetDetails, GetEmpContestAchievedSummary]) => {
        if (GetEMPContestTargetDetails?.status === 200) {
          const data = GetEMPContestTargetDetails?.data?.data?.[0] || {};

          const {
            newAccountCount: newClient = 0,
            reactivationCount: reactivate = 0,
            brokingRevnTarget: broking = 0,
            nonBrokingRevnTarget: nonBroking = 0,
            freshCashMargin: freeCash_Margin = 0,
            mfauM_Net: mfAUM_NET = 0,
          } = data;

          setTargetData(data);
          setRevenueCard({
            broking,
            nonBroking,
            freeCash_Margin,
            mfAUM_NET,
            newClient,
            reactivate,
          });
        }
        if (GetEmpContestAchievedSummary?.status === 200) {
          const data = GetEmpContestAchievedSummary?.data?.data || {};
          console.log(data, "GetEmpContestAchievedSummary");
          setAchievedData(data);
          console.log("achievedData", achievedData);

          const broking =
            (data.brokerageNetToLKP || 0) + (data.slbmNetToLKPBrokerage || 0);

          const nonbroking =
            (data.spipRevenue || 0) +
            (data.loanRevenue || 0) +
            (data.trilogyRevenue || 0) +
            (data.mfNetToLKP || 0) +
            (data.netToLKPInsurance || 0) +
            (data.liquiLoanNetToLKPBrokerage || 0);

          const freeCash_Margin = data.freshCash || 0;
          const mfAUM_NET = data.mfaum || 0;
          const newClient = data.newClients || 0;
          const reactivate = data.reactivatedClients || 0;

          setAchieveCard({
            broking,
            nonBroking: nonbroking,
            freeCash_Margin,
            mfAUM_NET,
            newClient,
            reactivate,
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching contest target details:", error);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  }, []);

  function formatIndianNumber(value?: number): string {
    if (typeof value !== "number") return "₹0";
    return `₹${value.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
  }
  return (
    <div>
      <Row style={{ marginTop: "20px" }}>
        <Col xxl={4} lg={4} md={6} sm={12}>
          <DashboardCard
            title="Revenue Target"
            value={formatIndianNumber(revenueCard.broking)}
            animationData={RevenueImg}
            note={isMobile && `* Contest Period - 1st July to 30th September`}
            customClass={true}
            rightValue={formatIndianNumber(revenueCard.nonBroking)}
            subHeading="Broking"
            rightSubHeading="Non-Broking"
          />
        </Col>

        <Col xxl={4} lg={4} md={6} sm={12}>
          <DashboardCard
            title="Clients Target"
            value={revenueCard.newClient}
            animationData={ActiveClient}
            // badges={clientBadges}
            subHeading="New Clients"
            customClass={true}
            rightValue={revenueCard.reactivate}
            rightSubHeading="Reactivate"
          />
        </Col>

        <Col xxl={4} lg={4} md={6} sm={12}>
          <DashboardCard
            title="Fresh Cash Margin Target"
            value={formatIndianNumber(targetData?.freshCashMargin)}
            animationData={CoinIcon}
            customClass={true}
            rightTitle="MF AUM Target"
            rightValue={formatIndianNumber(targetData?.mfauM_Net)}
          />
        </Col>
      </Row>
      <Row>
        <Col xxl={4} lg={4} md={6} sm={12}>
          <DashboardCard
            title="Revenue Achieved"
            value={formatIndianNumber(achieveCard.broking)}
            animationData={RevenueImg}
            subHeading="Broking"
            customClass={true}
            rightValue={formatIndianNumber(achieveCard.nonBroking)}
            rightSubHeading="Non-Broking"
          />
        </Col>

        <Col xxl={4} lg={4} md={6} sm={12}>
          <DashboardCard
            title="Clients Achieved"
            value={achieveCard.newClient}
            animationData={ActiveClient}
            // badges={clientBadges}
            subHeading="New Clients"
            customClass={true}
            rightValue={
              achieveCard.reactivate === 0 ? "0" : achieveCard.reactivate
            }
            rightSubHeading="Reactivate"
          />
        </Col>

        <Col xxl={4} lg={4} md={6} sm={12}>
          <DashboardCard
            title="Fresh Cash Margin Achieved"
            value={"Coming Soon"}
            animationData={CoinIcon}
            customClass={true}
            rightTitle="MF AUM Achieved"
            rightValue={"Coming Soon"}
          />
        </Col>
      </Row>
      <AchieveCard />
    </div>
  );
};

export default EMPContest;
