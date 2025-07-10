import { Col, Row } from "reactstrap";
import DashboardCard from "../../../components/common/DashboardCard";
import { useMediaQuery } from "rsuite/esm/useMediaQuery/useMediaQuery";
import theme from "../../../theme";
import RevenueImg from "../../../assets/images/revenue_new.json";
import ActiveClient from "../../../assets/images/Clients.json";
import CoinIcon from "../../../assets/images/coins.json";
// import DataTable from "../../../components/common/UserInfoTable";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { apiServices } from "../../../services";

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
  const [targetData, setTargetData] = useState<APContestData | null>(null);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch<AppDispatch>();
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );
  useEffect(() => {
    const payload = {
      // user_id: "EMP-0238",
      user_id: user_id,
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
          const totalClient = data.totalAccountCount;
          const newClient = data.newAccountCount;
          const reactivate = data.reactivationCount;
          setClientCard({
            totalClient,
            newClient,
            reactivate,
          });
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
      isActive: clientBadge === "totalClient",
      onClick: () => handleClientBadgeClick("totalClient"),
    },
    {
      type: "info",
      label: "NewClient",
      isActive: clientBadge === "newClient",
      onClick: () => handleClientBadgeClick("newClient"),
    },
    {
      type: "warning",
      label: "Reactivate",
      isActive: clientBadge === "reactivate",
      onClick: () => handleClientBadgeClick("reactivate"),
    },
  ];

  return (
    <div>
      <Row style={{ marginTop: "20px" }}>
        <Col xxl={3} lg={4} md={6} sm={12}>
          <DashboardCard
            title="Revenue target*"
            value={revenueCard[revenueBadge]}
            // formatIndianNumber={formatIndianNumber}
            animationData={RevenueImg}
            badges={revenueBadges}
            note={isMobile && `* Contest Period - 1st July to 30th September`}
            customClass={true}
          />
        </Col>

        <Col xxl={3} lg={4} md={6} sm={12}>
          <DashboardCard
            title="Clients target*"
            value={clientCard[clientBadge]}
            animationData={ActiveClient}
            badges={clientBadges}
            customClass={true}
          />
        </Col>

        <Col xxl={3} lg={4} md={6} sm={12}>
          <DashboardCard
            title="Fresh cash Margin*"
            value={targetData?.freshCashMargin}
            animationData={CoinIcon}
            customClass={true}
            rightTitle="Mf aum Net*"
            rightValue={targetData?.mfauM_Net}
          />
        </Col>
      </Row>
      <Row>
        <Col xxl={3} lg={4} md={6} sm={12}>
          <DashboardCard
            title="Revenue achieve*"
            value={targetData?.qtarget ? targetData.qtarget : "-"}
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
            value={targetData?.newClientCount ? targetData.qtarget : "-"}
            animationData={ActiveClient}
            activeClientsEmpty={true}
            customClass={true}
            badges={clientBadges}
          />
        </Col>

        <Col xxl={3} lg={4} md={6} sm={12}>
          <DashboardCard
            title="Fresh cash Margin*"
            value={0}
            animationData={CoinIcon}
            customClass={true}
            rightTitle="Mf aum Net*"
            rightValue={0}
          />
        </Col>
      </Row>
      {/* <Card
        style={{
          borderRadius: "15px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          marginTop: "20px",
        }}
      >
        <CardHeader
          style={{
            borderRadius: "15px 15px 0 0",
            boxShadow: "0 -4px 8px rgba(0, 0, 0, 0.15)",
            backgroundColor: "#fff",
            padding: "0.2rem 0.8rem",
          }}
        >
          <h4 className="card-title mb-0">Employee contest</h4>
        </CardHeader>
        <CardBody>
          <DataTable
          // activeSubItem={activeSubItem}
          // T6Data={data}
          // handleApproval={handleApproval}
          // handleDownload={handleDownload}
          />
        </CardBody>
      </Card> */}
    </div>
  );
};

export default EMPContest;
