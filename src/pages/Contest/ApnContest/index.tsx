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

type BrokerageBadge = "Target" | "Achieve" | "nonBroking";
interface APContestData {
  rowId: number;
  apCode: string;
  apName: string;
  zone: string;
  qtarget: number;
  newClientCount: number;
  prize: string;
}

const index = () => {
  // ✅ Separate state for Revenue badge
  const [revenueBadge, setRevenueBadge] = useState<BrokerageBadge>("Target");

  // ✅ Separate state for Clients badge
  const [clientBadge, setClientBadge] = useState<BrokerageBadge>("Target");
  const [targetData, setTargetData] = useState<APContestData | null>(null);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch<AppDispatch>();
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );
  useEffect(() => {
    let payload = {
      user_id: "APN-7161",
      //   user_id: user_id,
    };

    dispatch(showLoader(""));
    apiServices
      .GetAPContestTargetDetails(payload)
      .then((response) => {
        // console.log("GetAPContestTargetDetails", response?.data);
        dispatch(hideLoader());
        if (response?.status === 200) {
          console.log("GetAPContestTargetDetails", response?.data?.data[0]);
          setTargetData(response?.data?.data[0]);
        }
      })
      .catch((Error) => {
        console.log("Errrror", Error);
        dispatch(hideLoader());
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  }, []);
  // ✅ Revenue badge handler
  const handleRevenueBadgeClick = (type: BrokerageBadge) => {
    setRevenueBadge(type);
  };

  // ✅ Client badge handler
  const handleClientBadgeClick = (type: BrokerageBadge) => {
    setClientBadge(type);
  };

  // ✅ Revenue badge control array
  const revenueBadges = [
    {
      type: "primary",
      label: "Target",
      isActive: revenueBadge === "Target",
      onClick: () => handleRevenueBadgeClick("Target"),
    },
    {
      type: "info",
      label: "Achieve",
      isActive: revenueBadge === "Achieve",
      onClick: () => handleRevenueBadgeClick("Achieve"),
    },
  ];

  // ✅ Client badge control array
  const clientBadges = [
    {
      type: "primary",
      label: "Target",
      isActive: clientBadge === "Target",
      onClick: () => handleClientBadgeClick("Target"),
    },
    {
      type: "info",
      label: "Achieve",
      isActive: clientBadge === "Achieve",
      onClick: () => handleClientBadgeClick("Achieve"),
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
            title="Revenue*"
            value={
              targetData?.qtarget ? formatIndianNumber(targetData.qtarget) : "-"
            }
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
            title="Clients*"
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
          />
        </Col>
      </Row>
    </div>
  );
};

export default index;
