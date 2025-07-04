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

type RevenueBadge = "total" | "broking" | "nonBroking";
type ClientBadge = "total" | "new" | "reactivate";

interface APContestData {
  rowId: number;
  apCode: string;
  apName: string;
  zone: string;
  qtarget: number;
  newClientCount: number;
  prize: string;
  totalRevnTarget: number;
  brokingRevnTarget: number;
  nonBrokingRevnTarget: number;
}

// 🔧 Utility Function
const formatIndianNumber = (value: number | undefined): string =>
  value !== undefined ? `₹${value.toLocaleString("en-IN")}` : "-";

const Index = () => {
  const [revenueBadge, setRevenueBadge] = useState<RevenueBadge>("total");
  const [clientBadge, setClientBadge] = useState<ClientBadge>("total");
  const [revenueCard, setRevenueCard] = useState({
    total: 0,
    broking: 0,
    nonBroking: 0,
  });
  const [targetData, setTargetData] = useState<APContestData | null>(null);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch<AppDispatch>();
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data || {}
  );

  useEffect(() => {
    const payload = {
      // user_id: user_id
      user_id: "EMP-0238",
    };

    dispatch(showLoader(""));
    apiServices
      .GetEMPContestTargetDetails(payload)
      .then((response) => {
        if (response?.status === 200) {
          const data = response?.data?.data[0];
          setTargetData(data);
          setRevenueCard({
            total: data.totalRevnTarget,
            broking: data.brokingRevnTarget,
            nonBroking: data.nonBrokingRevnTarget,
          });
        }
      })
      .catch((error) => console.error("Error fetching data", error))
      .finally(() => {
        dispatch(hideLoader());
      });
  }, [dispatch, user_id]);

  const revenueBadges = [
    { type: "primary", label: "Total", key: "total" },
    { type: "info", label: "Broking", key: "broking" },
    { type: "warning", label: "Non-broking", key: "nonBroking" },
  ] as const;

  const clientBadges = [
    { type: "primary", label: "Total", key: "total" },
    { type: "info", label: "NewClient", key: "new" },
    { type: "warning", label: "Reactivate", key: "reactivate" },
  ] as const;

  const cards = [
    {
      title: "Revenue target*",
      value: formatIndianNumber(revenueCard[revenueBadge]),
      animationData: RevenueImg,
      badges: revenueBadges.map((badge) => ({
        ...badge,
        isActive: revenueBadge === badge.key,
        onClick: () => setRevenueBadge(badge.key),
      })),
    },
    {
      title: "Clients target*",
      value: targetData?.newClientCount ?? "-",
      animationData: ActiveClient,
      badges: clientBadges.map((badge) => ({
        ...badge,
        isActive: clientBadge === badge.key,
        onClick: () => setClientBadge(badge.key),
      })),
    },
    {
      title: "Prize*",
      value: targetData?.prize ?? "-",
      animationData: CoinIcon,
    },
  ];

  const achievedCards = [
    {
      title: "Revenue achieve*",
      value: formatIndianNumber(targetData?.qtarget),
      animationData: RevenueImg,
      badges: revenueBadges.map((badge) => ({
        ...badge,
        isActive: revenueBadge === badge.key,
        onClick: () => setRevenueBadge(badge.key),
      })),
    },
    {
      title: "Clients achieve*",
      value: targetData?.newClientCount ?? "-",
      animationData: ActiveClient,
      badges: clientBadges.map((badge) => ({
        ...badge,
        isActive: clientBadge === badge.key,
        onClick: () => setClientBadge(badge.key),
      })),
    },
    {
      title: "Prize*",
      value: targetData?.prize ?? "-",
      animationData: CoinIcon,
    },
  ];

  return (
    <div>
      <Row style={{ marginTop: "20px" }}>
        {cards.map((card, index) => (
          <Col key={index} xxl={3} lg={4} md={6} sm={12}>
            <DashboardCard
              {...card}
              customClass
              note={
                isMobile && card.title.includes("target")
                  ? "* Contest Period - 1st July to 30th September"
                  : ""
              }
              activeClientsEmpty={card.title.includes("Clients")}
            />
          </Col>
        ))}
      </Row>

      <Row style={{ marginTop: "2px" }}>
        {achievedCards.map((card, index) => (
          <Col key={index} xxl={3} lg={4} md={6} sm={12}>
            <DashboardCard
              {...card}
              customClass
              activeClientsEmpty={card.title.includes("Clients")}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Index;
