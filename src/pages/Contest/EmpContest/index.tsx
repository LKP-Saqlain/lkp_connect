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
  freshCashMargin: number;
  mfauM_Net: number;
}

const EMPContest = () => {
  const [revenueBadge, setRevenueBadge] = useState<RevenueBadge>("total");
  const [clientBadge, setClientBadge] = useState<ClientBadge>("total");
  const [revenueCard, setRevenueCard] = useState({
    total: 0,
    broking: 0,
    nonBroking: 0,
    freeCash_Margin: 0,
    mfAUM_NET: 0,
  });
  const [targetData, setTargetData] = useState<APContestData | null>(null);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch<AppDispatch>();
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );
  useEffect(() => {
    const payload = {
      user_id: "EMP-0238",
    };

    dispatch(showLoader(""));
    apiServices
      .GetEMPContestTargetDetails(payload)
      .then((response) => {
        dispatch(hideLoader());
        if (response?.status === 200) {
          const data = response?.data?.data[0];
          console.log("GetEmpContestTargetDetails", data);

          setTargetData(data);

          const total = data.totalRevnTarget;
          const broking = data.brokingRevnTarget;
          const nonBroking = data.nonBrokingRevnTarget;
          const freeCash_Margin = data.freshCashMargin;
          const mfAUM_NET = data.mfauM_Net;

          setRevenueCard({
            total,
            broking,
            nonBroking,
            freeCash_Margin,
            mfAUM_NET,
          });
        }
      })
      .catch((error) => {
        console.log("Error", error);
        dispatch(hideLoader());
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  }, []);

  // ✅ Revenue badge handler
  const handleRevenueBadgeClick = (type: RevenueBadge) => {
    setRevenueBadge(type);
  };

  // ✅ Client badge handler
  const handleClientBadgeClick = (type: ClientBadge) => {
    setClientBadge(type);
  };

  // ✅ Revenue badge control array
  const revenueBadges = [
    {
      type: "primary",
      label: "Total",
      isActive: revenueBadge === "total",
      onClick: () => handleRevenueBadgeClick("total"),
    },
    {
      type: "info",
      label: "Broking",
      isActive: revenueBadge === "broking",
      onClick: () => handleRevenueBadgeClick("broking"),
    },
    {
      type: "warning",
      label: "Non-broking",
      isActive: revenueBadge === "nonBroking",
      onClick: () => handleRevenueBadgeClick("nonBroking"),
    },
  ];

  // ✅ Client badge control array
  const clientBadges = [
    {
      type: "primary",
      label: "Total",
      isActive: clientBadge === "total",
      onClick: () => handleClientBadgeClick("total"),
    },
    {
      type: "info",
      label: "NewClient",
      isActive: clientBadge === "new",
      onClick: () => handleClientBadgeClick("new"),
    },
    {
      type: "warning",
      label: "Reactivate",
      isActive: clientBadge === "reactivate",
      onClick: () => handleClientBadgeClick("reactivate"),
    },
  ];

  function formatIndianNumber(value: number): string {
    return `₹${value.toLocaleString("en-IN")}`;
  }

  return (
    <div>
      <Row style={{ marginTop: "20px" }}>
        <Col xxl={3} lg={4} md={6} sm={12}>
          <DashboardCard
            title="Revenue target*"
            // value={
            //   targetData?.qtarget ? formatIndianNumber(targetData.qtarget) : "-"
            // }
            value={revenueCard[revenueBadge]}
            animationData={RevenueImg}
            badges={revenueBadges}
            // formatIndianNumber={formatIndianNumber}
            // suffix=".00"
            note={isMobile && `* Contest Period - 1st July to 30th September`}
            customClass={true}
          />
        </Col>

        <Col xxl={3} lg={4} md={6} sm={12}>
          <DashboardCard
            title="Clients target*"
            value={targetData?.newClientCount}
            animationData={ActiveClient}
            activeClientsEmpty={true}
            customClass={true}
            badges={clientBadges}
          />
        </Col>

        <Col xxl={3} lg={4} md={6} sm={12}>
          <DashboardCard
            title="Prize*"
            value={targetData?.prize}
            animationData={CoinIcon}
            customClass={true}
            rightTitle="Weekly Contest"
            rightSubtitle={0}
          />
        </Col>
      </Row>
      <Row>
        <Col xxl={3} lg={4} md={6} sm={12}>
          <DashboardCard
            title="Revenue achieve*"
            value={
              targetData?.qtarget ? formatIndianNumber(targetData.qtarget) : "-"
            }
            animationData={RevenueImg}
            badges={revenueBadges}
            // formatIndianNumber={formatIndianNumber}
            // suffix=".00"

            customClass={true}
          />
        </Col>

        <Col xxl={3} lg={4} md={6} sm={12}>
          <DashboardCard
            title="Clients achieve*"
            value={targetData?.newClientCount}
            animationData={ActiveClient}
            activeClientsEmpty={true}
            customClass={true}
            badges={clientBadges}
          />
        </Col>

        <Col xxl={3} lg={4} md={6} sm={12}>
          <DashboardCard
            title="Fresh cash Margin*"
            value={targetData?.freshCashMargin}
            animationData={CoinIcon}
            customClass={true}
            rightTitle="Mf aum Net*"
            rightSubtitle={targetData?.mfauM_Net}
          />
        </Col>
      </Row>
    </div>
  );
};

export default EMPContest;
