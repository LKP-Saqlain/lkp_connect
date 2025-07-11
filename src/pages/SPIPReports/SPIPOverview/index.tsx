import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "reactstrap";
import DashboardCard from "../../../components/common/DashboardCard";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import RevenueImg from "../../../assets/images/revenue_new.json";
import ActiveClient from "../../../assets/images/Clients.json";
import ProjectsOverview from "../../Employee/Overview/ProjectsOverview";
import UserCount from "../SPIPOverview/ClientsCount";
import UpcomingSubExpiry from "./UpSubExpiry";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { apiServices } from "../../../services";
import TripleBar from "./TripleBar";

type BrokerageBadge = "total" | "release" | "balance";

const SPIPOverview = ({ activeSubItem, handleTradingOpen }: any) => {
  const [commisionCard, setCommisionCard] = useState({
    total: 0,
    release: 0,
    balance: 0,
  });
  const [newClient, setNewClient] = useState(0);
  const [newSubClient, setNewSubClient] = useState(0);
  const [activeBrokerageBadge, setActiveBrokerageBadge] =
    useState<BrokerageBadge>("total");

  const dispatch = useDispatch<AppDispatch>();
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    console.log("PropsValues", activeSubItem);
  }, [activeSubItem]);

  useEffect(() => {
    const userId = user_id?.split("-")[1] || "";
    console.log("userprop", userId);
    let payload = {
      branchCode: userId, //for getting static data--> 1676
    };

    dispatch(showLoader(""));

    Promise.all([
      apiServices.GetB2BCommissionSummary(payload),
      apiServices.GetNewClientCount(payload),
      apiServices.GetUniqueSubclientCount(payload),
      apiServices.GetCommissionRevenueSummary(payload),
    ])
      .then(
        ([commissionResponse, clientCountResponse, uniqueSubCountResponse]) => {
          // Set commission summary card
          if (commissionResponse?.status === 200) {
            const {
              TotalCommission: total,
              CommissionReleased: release,
              BalanceCommission: balance,
            } = commissionResponse.data;
            setCommisionCard({ total, release, balance });
          }

          // Set active client count
          if (clientCountResponse?.status === 200) {
            const { activeClientCount } = clientCountResponse.data;
            setNewClient(activeClientCount);
          }

          // Set new sub-client count
          if (uniqueSubCountResponse?.status === 200) {
            const { uniqueSubclientcount } = uniqueSubCountResponse.data;
            setNewSubClient(uniqueSubclientcount);
          }
        }
      )
      .catch((error) => {
        console.error("API error:", error);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  }, [user_id]);

  function formatIndianNumber(value: number): string {
    return `₹${value.toLocaleString("en-IN")}`;
  }

  const handleBrokerageBadgeClick = (type: BrokerageBadge) => {
    // console.log("Badge clicked:", type, badges);
    setActiveBrokerageBadge(type); // ✅ Update the active badge
  };

  const brokerageBadges = [
    {
      type: "warning",
      label: "total",
      isActive: activeBrokerageBadge === "total",
      onClick: () => handleBrokerageBadgeClick("total"),
    },
    {
      type: "info",
      label: "release",
      isActive: activeBrokerageBadge === "release",
      onClick: () => handleBrokerageBadgeClick("release"),
    },
    {
      type: "primary",
      label: "balance",
      isActive: activeBrokerageBadge === "balance",
      onClick: () => handleBrokerageBadgeClick("balance"),
    },
  ];
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row className="g-3" style={{ marginTop: "5px" }}>
            <Col
              xxl={4}
              lg={4}
              md={6}
              sm={12}
              style={{ marginTop: isMobile ? "10px" : "" }}
              // className="dashboard-card-col"
            >
              <DashboardCard
                title="Commission*"
                value={commisionCard[activeBrokerageBadge]}
                animationData={RevenueImg}
                badges={brokerageBadges}
                formatIndianNumber={formatIndianNumber}
                // suffix=".00"

                note={!isMobile && `*Financial Year 2025-2026 `}
                customClass={true}
              />
            </Col>
            <Col xxl={4} lg={4} md={6} sm={12}>
              <DashboardCard
                title="New Client Count*"
                value={newClient}
                animationData={ActiveClient}
                // decimals={2}
                // suffix="x"
                activeClientsEmpty={true}
                customClass={true}
              />
            </Col>
            <Col xxl={4} lg={4} md={6} sm={12}>
              <DashboardCard
                title="Unique Sub. Count*"
                value={newSubClient}
                animationData={ActiveClient}
                // decimals={2}
                // suffix="x"
                activeClientsEmpty={true}
                customClass={true}
                note={isMobile && `*Financial Year 2025-2026 `}
              />
            </Col>
          </Row>

          <Row>
            <Col xl={8}>
              <div className="card-body">
                <ProjectsOverview />
              </div>
            </Col>
            <UserCount />
          </Row>
          <Row>
            <TripleBar />
          </Row>

          <Row>
            <Col>
              <UpcomingSubExpiry handleTradingOpen={handleTradingOpen} />
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default SPIPOverview;
