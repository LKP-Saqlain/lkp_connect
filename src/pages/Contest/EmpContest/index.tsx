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

type RevenueBadge = "total" | "broking" | "nonBroking";
type ClientBadge = "totalClient" | "newClient" | "reactivate";
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
  const [revenueBadge, setRevenueBadge] = useState<RevenueBadge>("total");
  const [clientBadge, setClientBadge] = useState<ClientBadge>("totalClient");
  const [clientCard, setClientCard] = useState({
    totalClient: 0,
    newClient: 0,
    reactivate: 0,
  });
  const [revenueCard, setRevenueCard] = useState({
    total: 0,
    broking: 0,
    nonBroking: 0,
    freeCash_Margin: 0,
    mfAUM_NET: 0,
  });
  const [achieveCard, setAchieveCard] = useState({
    total: 0,
    broking: 0,
    nonBroking: 0,
    freeCash_Margin: 0,
    mfAUM_NET: 0,
    totalClient: 0,
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
            totalAccountCount: totalClient = 0,
            newAccountCount: newClient = 0,
            reactivationCount: reactivate = 0,
            totalRevnTarget: total = 0,
            brokingRevnTarget: broking = 0,
            nonBrokingRevnTarget: nonBroking = 0,
            freshCashMargin: freeCash_Margin = 0,
            mfauM_Net: mfAUM_NET = 0,
          } = data;

          setTargetData(data);
          setClientCard({ totalClient, newClient, reactivate });
          setRevenueCard({
            total,
            broking,
            nonBroking,
            freeCash_Margin,
            mfAUM_NET,
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
            total: broking + nonbroking,
            broking,
            nonBroking: nonbroking,
            freeCash_Margin,
            mfAUM_NET,
            totalClient: newClient + reactivate,
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

  const handleRevenueBadgeClick = (type: RevenueBadge) => setRevenueBadge(type);
  const handleClientBadgeClick = (type: ClientBadge) => setClientBadge(type);

  const revenueBadgeTypes: {
    type: string;
    label: string;
    key: RevenueBadge;
  }[] = [
    { type: "primary", label: "Total", key: "total" },
    { type: "info", label: "Broking", key: "broking" },
    { type: "warning", label: "Non-broking", key: "nonBroking" },
  ];

  const revenueBadges = revenueBadgeTypes.map((badge) => ({
    ...badge,
    isActive: revenueBadge === badge.key,
    onClick: () => handleRevenueBadgeClick(badge.key),
  }));

  const clientBadgeTypes: { type: string; label: string; key: ClientBadge }[] =
    [
      { type: "primary", label: "Total", key: "totalClient" },
      { type: "info", label: "NewClient", key: "newClient" },
      { type: "warning", label: "Reactivate", key: "reactivate" },
    ];

  const clientBadges = clientBadgeTypes.map((badge) => ({
    ...badge,
    isActive: clientBadge === badge.key,
    onClick: () => handleClientBadgeClick(badge.key),
  }));
  function formatIndianNumber(value: number): string {
    return `₹${value.toLocaleString("en-IN")}`;
  }
  return (
    <div>
      <Row style={{ marginTop: "20px" }}>
        <Col xxl={4} lg={4} md={6} sm={12}>
          <DashboardCard
            title="Revenue target*"
            value={revenueCard[revenueBadge]}
            formatIndianNumber={formatIndianNumber}
            animationData={RevenueImg}
            badges={revenueBadges}
            note={isMobile && `* Contest Period - 1st July to 30th September`}
            customClass={true}
          />
        </Col>

        <Col xxl={4} lg={4} md={6} sm={12}>
          <DashboardCard
            title="Clients target*"
            value={clientCard[clientBadge]}
            animationData={ActiveClient}
            badges={clientBadges}
            customClass={true}
          />
        </Col>

        <Col xxl={4} lg={4} md={6} sm={12}>
          <DashboardCard
            title="Fresh Cash Margin*"
            value={targetData?.freshCashMargin}
            formatIndianNumber={formatIndianNumber}
            animationData={CoinIcon}
            customClass={true}
            rightTitle="MF AUM Net*"
            rightValue={targetData?.mfauM_Net}
          />
        </Col>
      </Row>
      <Row>
        <Col xxl={4} lg={4} md={6} sm={12}>
          <DashboardCard
            title="Revenue achieve*"
            value={
              typeof achieveCard[revenueBadge] === "number"
                ? achieveCard[revenueBadge]
                : 0
            }
            animationData={RevenueImg}
            badges={revenueBadges}
            formatIndianNumber={formatIndianNumber}
            // suffix=".00"

            customClass={true}
          />
        </Col>

        <Col xxl={4} lg={4} md={6} sm={12}>
          <DashboardCard
            title="Clients achieve*"
            value={achieveCard[clientBadge]}
            animationData={ActiveClient}
            activeClientsEmpty={true}
            customClass={true}
            badges={clientBadges}
          />
        </Col>

        <Col xxl={4} lg={4} md={6} sm={12}>
          <DashboardCard
            title="Fresh Cash Margin*"
            value={achievedData?.freshCash}
            animationData={CoinIcon}
            customClass={true}
            rightTitle="MF AUM Net*"
            rightValue={achievedData?.mfaum}
            formatIndianNumber={formatIndianNumber}
          />
        </Col>
      </Row>
      <AchieveCard />
    </div>
  );
};

export default EMPContest;
