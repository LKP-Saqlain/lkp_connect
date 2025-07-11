import React, { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";
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
import { ProjectsOverviewCharts } from "../../Employee/Overview/DashboardProjectCharts";

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
  const [brokerageData, setBrokerageData] = useState<[]>([]);
  const [monthProjectData, setMonthProjectData] = useState([
    {
      name: "Gross Brokerage",
      type: "bar",
      data: [],
    },
  ]);
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
    const branchCode = user_id?.split("-")[1] || "";
    const payload = {
      // branchCode: branchCode,
      branchCode: "1676",
    };

    dispatch(showLoader(""));

    Promise.all([
      apiServices.GetB2BCommissionSummary(payload),
      apiServices.GetNewClientCount(payload),
      apiServices.GetUniqueSubclientCount(payload),
      apiServices.GetCommissionRevenueSummary(payload),
    ])
      .then(
        ([
          commissionResponse,
          clientCountResponse,
          uniqueSubCountResponse,
          commissionRevenueResponse,
        ]) => {
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

          // Set chart data
          if (commissionRevenueResponse?.status === 200) {
            setBrokerageData(commissionRevenueResponse?.data);
            const fetchedBrokerageData = commissionRevenueResponse?.data;

            const balanceCommission = fetchedBrokerageData.map(
              (item: any) => item.balanceCommission
            );
            const commissionReleased = fetchedBrokerageData.map(
              (item: any) => item.commissionReleased
            );
            const totalCommission = fetchedBrokerageData.map(
              (item: any) => item.totalCommission
            );

            setMonthProjectData([
              {
                name: "Total Commission",
                type: "bar",
                data: totalCommission,
              },
              {
                name: "Commission Released",
                type: "bar",
                data: commissionReleased,
              },
              {
                name: "Balance Commission",
                type: "bar",
                data: balanceCommission,
              },
            ]);

            setBrokerageData(fetchedBrokerageData);
            console.log(fetchedBrokerageData, "commissionRevenueResponse");
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
  useEffect(() => {
    console.log(monthProjectData, brokerageData, "check data111");
  }, [brokerageData]);

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
            {/* <UserCount getActiveClients={getActiveClients} /> */}
          </Row>
          <Row>
            <Card
              style={{
                borderRadius: "15px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
              }}
            >
              <CardHeader
                className="align-items-center d-flex"
                style={{
                  borderRadius: "15px 15px 0 0",
                  boxShadow: "0 -4px 8px rgba(0, 0, 0, 0.15)",
                  backgroundColor: "#fff", // optional for contrast
                }}
              >
                <h4 className="card-title mb-2 mb-md-0 flex-grow-1 text-md-start text-center">
                  Commission Details for Last 12 months
                </h4>
                <div
                  className="d-flex align-items-center flex-wrap mt-2 mt-sm-0"
                  style={{ fontFamily: "Public Sans, sans-serif" }}
                ></div>
              </CardHeader>

              <CardBody className="p-0 pb-2">
                <div>
                  <div dir="ltr" className="apex-charts">
                    <ProjectsOverviewCharts
                      series={monthProjectData}
                      // dataColors='["--vz-primary", "--vz-secondary", "--vz-danger"]'
                      brokerageData={brokerageData}
                      tripleBarData={true}
                    />
                  </div>
                </div>
              </CardBody>
            </Card>
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
