import React, { useState, useEffect, useRef } from "react";
import { Col, Container, Row } from "reactstrap";
import "./style.css";
import ProjectsOverview from "./ProjectsOverview";
import UserCount from "./VisitorsCount";
// import BrokingRevenue from "./Revenue/BrokingRevenue";
import RevenueDetails from "./Revenue";
import T6Table from "./T6";
import { Player } from "@lordicon/react";
import CoinIcon from "../../../assets/images/coins.json";
import RevenueImg from "../../../assets/images/revenue_new.json";
import ActiveClient from "../../../assets/images/Clients.json";
import DashboardCard from "../../../components/common/DashboardCard";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
// import Nudge from "../../components/common/Nudge";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "../../redux/store";
// import { showLoader, hideLoader } from "../../redux/slices/loaderSlice";
// import { apiServices } from "../../services";
// import CryptoJS from "crypto-js";
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
  // const [isNudgeOpen, setIsNudgeOpen] = useState(false);
  // const [dashboardNudgeData, setDashboardNudgeData] = useState<any[][]>([]);
  // const [hasApiStarted, setHasApiStarted] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // const dispatch = useDispatch<AppDispatch>();
  const playerRef = useRef<Player>(null);

  // const { user_id } = useSelector(
  //   (state: RootState) => state.UserLogin?.data?.data
  // );

  // const { activeRequests } = useSelector((state: RootState) => state.loader);

  // const decryptTripleDES = (
  //   cipherText: string,
  //   key: string,
  //   useHashing: boolean
  // ): string | null => {
  //   try {
  //     // Convert Base64 string to bytes
  //     const encryptedBytes = CryptoJS.enc.Base64.parse(cipherText);

  //     // Generate the key
  //     let keyBytes;
  //     if (useHashing) {
  //       keyBytes = CryptoJS.MD5(CryptoJS.enc.Utf8.parse(key));
  //     } else {
  //       keyBytes = CryptoJS.enc.Utf8.parse(key);
  //     }

  //     // Decrypt using TripleDES with ECB mode and PKCS7 padding
  //     const decrypted = CryptoJS.TripleDES.decrypt(
  //       { ciphertext: encryptedBytes } as CryptoJS.lib.CipherParams,
  //       keyBytes,
  //       {
  //         mode: CryptoJS.mode.ECB,
  //         padding: CryptoJS.pad.Pkcs7,
  //       }
  //     );

  //     const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);

  //     if (!decryptedText) {
  //       throw new Error("Decryption failed. Invalid key or payload.");
  //     }

  //     return decryptedText;
  //   } catch (error) {
  //     console.error("Decryption error:", error);
  //     return null;
  //   }
  // };

  // Example Usage:
  // const encryptedPayload =
  //   "6PzJ32NGCUREH/BPpiCM9z92P2tLocTV3yOS2ZWZWBe8NnwR1PDbldEm3pAPseZUREE5/S1YafO8NnwR1PDble4HZVp9KfLss23C53KaLqG3qK2iv8TUAMXc802h9OzX";
  // const encryptionKey = "27819f7bdb0da9b21e1e8e54b82298f5";

  // const decryptedData = decryptTripleDES(encryptedPayload, encryptionKey, true);
  // console.log("Decrypted Data:", decryptedData);

  const handleValues = (revTotal: string) => {
    console.log("revTotal", revTotal);
  };

  // function tog_animationZoom() {
  //   setmodal_animationZoom((prev) => !prev);
  // }

  // useEffect(() => {
  //   tog_animationZoom();
  // }, []);

  // useEffect(() => {
  //   const hasFetched = sessionStorage.getItem("dashboardNudgeFetched");
  //   if (hasFetched) return; // If fetched before, do nothing
  //   sessionStorage.setItem("dashboardNudgeFetched", "true"); // Mark as fetched

  //   const fetchDashboardNudge = async () => {
  //     const payload = {
  //       user_id: user_id,
  //     };

  //     try {
  //       dispatch(showLoader(""));
  //       const response = await apiServices.DashboardNudge(payload);
  //       console.log("dashBoardNudgeData", typeof response?.data);

  //       const nudgeData = response?.data;
  //       setDashboardNudgeData(nudgeData);

  //       dispatch(hideLoader());

  //       if (response?.status === 200) {
  //         // ShowToast("success", response?.data?.Message);
  //         setIsNudgeOpen(!isNudgeOpen);
  //       } else {
  //         console.error("Failed");
  //       }
  //     } catch (error) {
  //       dispatch(hideLoader());
  //       console.error("Error sending email:", error);
  //     }
  //   };
  //   fetchDashboardNudge();
  // }, [dispatch]);

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
      console.log(newClients);
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
          {/* {isNudgeOpen && (
            <Nudge
              modal_animationZoom={modal_animationZoom}
              tog_animationZoom={tog_animationZoom}
              dashBoardNudgeData={dashboardNudgeData}
            />
          )} */}
          <Row className="g-3">
            <Col
              xxl={4}
              lg={4}
              md={6}
              sm={12}
              style={{ marginTop: isMobile ? "10px" : "" }}
              // className="dashboard-card-col"
            >
              <DashboardCard
                title="Brokerage*"
                value={revenueValues[activeBadge]}
                animationData={RevenueImg}
                badges={badges}
                formatIndianNumber={formatIndianNumber}
                suffix=".00"
                note={!isMobile && `* Period - ${startMonth} to ${endMonth}`}
                customClass={true}
              />
            </Col>
            <Col xxl={4} lg={4} md={6} sm={12}>
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
            {/* <Col xxl={3} lg={3} md={6} sm={12}>
                    <DashboardCard
                      title="New Clients Added*"
                      value={newClients}
                      animationData={ActiveClient}
                      activeClientsEmpty={true}
                      customClass={true}
                    />
                  </Col> */}
            <Col xxl={4} lg={4} md={6} sm={12}>
              <DashboardCard
                title="Unique Traded Clients*"
                value={tradedClientCount}
                animationData={ActiveClient}
                activeClients={activeClients}
                customClass={true}
                note={isMobile && `* Period - ${startMonth} to ${endMonth}`}
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
        </Container>
      </div>
    </React.Fragment>
  );
};

export default DashboardProject;
