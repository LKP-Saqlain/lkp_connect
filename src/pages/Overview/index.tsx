import React, { useState, useEffect, useRef } from "react";
import { Col, Container, Row } from "reactstrap";
import "./style.css";
import ProjectsOverview from "./ProjectsOverview";
import UserCount from "./VisitorsCount";
// import BrokingRevenue from "./Revenue/BrokingRevenue";
import RevenueDetails from "./Revenue";
import T6Table from "./T6";
import { Player } from "@lordicon/react";
import CoinIcon from "../../assets/images/coins.json";
import RevenueImg from "../../assets/images/revenue_new.json";
import ActiveClient from "../../assets/images/Clients.json";
import DashboardCard from "../../components/common/DashboardCard";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
// import Nudge from "../../components/common/Nudge";

type RevenueKeys = "total" | "broking" | "nonBroking";
// type TotalClientKey = "total" | "broking" | "nonBroking";

const DashboardProject = ({ handleTradingOpen }: any) => {
  const [startMonth, setStartMonth] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [revenueValues, setRevenueValues] = useState({
    total: 0,
    broking: 0,
    nonBroking: 0,
  });
  const [activeBadge, setActiveBadge] = useState<RevenueKeys>("total");

  const [multiRevenueMultiply, setMultiRevenueMultiply] = useState(0);
  const [newClients, setNewClients] = useState(0);
  const [activeClients, setActiveClients] = useState(null);
  const [tradedClientCount, setTradedClientCount] = useState(0);
  // const [modal_animationZoom, setmodal_animationZoom] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleValues = (revTotal: string) => {
    console.log("revTotal", revTotal);
  };

  // function tog_animationZoom() {
  //   setmodal_animationZoom((prev) => !prev);
  // }

  // useEffect(() => {
  //   tog_animationZoom();
  // }, []);

  const playerRef = useRef<Player>(null);

  useEffect(() => {
    playerRef.current?.playFromBeginning();
  }, []);

  const handleRevenueRange = (startMonth: any, endMonth: any) => {
    console.log("startMonth", startMonth, "endMonth", endMonth);
    setStartMonth(startMonth);
    setEndMonth(endMonth);
  };
  const handleBadgeClick = (type: any) => {
    setActiveBadge(type);
    if (type === "total") {
      handleRevenueData(
        revenueValues.total,
        revenueValues.broking,
        revenueValues.nonBroking,
        multiRevenueMultiply // Pass the multiRevenueMultiply value for the total badge
      );
    } else {
      handleRevenueData(
        revenueValues.total,
        revenueValues.broking,
        revenueValues.nonBroking
      );
    }
  };
  const badges = [
    {
      type: "warning",
      label: "Total",
      isActive: activeBadge === "total",
      onClick: () => handleBadgeClick("total"),
    },
    {
      type: "info",
      label: "Broking",
      isActive: activeBadge === "broking",
      onClick: () => handleBadgeClick("broking"),
    },
    {
      type: "primary",
      label: "Non-Broking",
      isActive: activeBadge === "nonBroking",
      onClick: () => handleBadgeClick("nonBroking"),
    },
  ];

  const handleRevenueData = (
    total: any,
    broking: any,
    nonBroking: any,
    multiRevenueMultiply?: any,
    newClientsAdded?: any
  ) => {
    console.log(
      "valuesss->",
      total,
      broking,
      nonBroking,
      multiRevenueMultiply,
      newClientsAdded
    );
    setRevenueValues({
      total: total,
      broking: broking,
      nonBroking: nonBroking,
    });
    if (multiRevenueMultiply !== undefined) {
      setMultiRevenueMultiply(multiRevenueMultiply);
    }
    if (newClientsAdded !== undefined) {
      setNewClients(newClientsAdded);
    }
  };

  function formatIndianNumber(value: number): string {
    return `₹${value.toLocaleString("en-IN")}`;
  }

  const getActiveClients = (clients: any) => {
    console.log("activeClients", clients);
    setActiveClients(clients);
  };

  document.title = "LKP Securities | User Overview";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* <Nudge
            modal_animationZoom={modal_animationZoom}
            tog_animationZoom={tog_animationZoom}
          /> */}
          <Row>
            <Col>
              <div className="h-100">
                {/* Row for Four Boxes */}
                <Row>
                  <Col
                    xxl={3}
                    lg={3}
                    md={6}
                    sm={12}
                    style={{ marginTop: isMobile ? "10px" : "" }}
                  >
                    <DashboardCard
                      title="Revenue*"
                      value={revenueValues[activeBadge]}
                      animationData={RevenueImg}
                      badges={badges}
                      formatIndianNumber={formatIndianNumber}
                      suffix=".00"
                      note={
                        !isMobile && `* Period - ${startMonth} to ${endMonth}`
                      }
                      customClass={true}
                    />
                  </Col>
                  <Col xxl={3} lg={3} md={6} sm={12}>
                    <DashboardCard
                      title="Revenue Multiple*"
                      value={multiRevenueMultiply}
                      animationData={CoinIcon}
                      decimals={2}
                      suffix="x"
                      activeClientsEmpty={true}
                      customClass={true}
                    />
                  </Col>
                  <Col xxl={3} lg={3} md={6} sm={12}>
                    <DashboardCard
                      title="New Clients Added*"
                      value={newClients}
                      animationData={ActiveClient}
                      activeClientsEmpty={true}
                      customClass={true}
                    />
                  </Col>
                  <Col xxl={3} lg={3} md={6} sm={12}>
                    <DashboardCard
                      title="Unique Traded Clients*"
                      value={tradedClientCount}
                      animationData={ActiveClient}
                      activeClients={activeClients}
                      customClass={true}
                      note={
                        isMobile && `* Period - ${startMonth} to ${endMonth}`
                      }
                    />
                  </Col>
                </Row>

                <Row>
                  <Col xl={8}>
                    <div className="card-body">
                      <ProjectsOverview />
                    </div>
                  </Col>
                  <UserCount getActiveClients={getActiveClients} />
                </Row>
                <Row>
                  <Col>
                    <RevenueDetails
                      handleValues={handleValues}
                      handleRevenueRange={handleRevenueRange}
                      handleRevenueData={handleRevenueData}
                      setTradedClientCount={setTradedClientCount}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <T6Table handleTradingOpen={handleTradingOpen} />
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default DashboardProject;
