import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";

import { useMediaQuery } from "rsuite/esm/useMediaQuery/useMediaQuery";
import theme from "../../../theme";
import contestReward from "../../../assets/images/AP Contest.png";
import ActiveClient from "../../../assets/images/Clients.json";
import DashboardCard from "../../../components/common/DashboardCard";
import UserInfoTable from "../../../components/common/UserInfoTable";
import ClientWiseBrokerage from "./Clientwise Brokerage/index";
import BrokingRevenue from "./Broking Revenue/index";
import Leaderboard from "./LeaderBoard/index";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { apiServices } from "../../../services";
import { Tabs, Tab } from "@mui/material";
// import UserCapsules from "../../ClientDetails/UserCapsules";

// import ShowToast from "../../../utils/toastUtils";

// interface APContestData {
//   rid: number;
//   apc: string;
//   apn: string;
//   zn: string;
//   qtrg: number;
//   nccnt: number;
//   prze: string;
// }

const APContestQ4 = ({ activeMenu, isCustomRender, row }: any) => {
  // const [selectedCapsule, setSelectedCapsule] = useState("Contest Rewards");
  // const [targetData, setTargetData] = useState<APContestData | null>(null);
  const [apInfo, setApInfo] = useState<any | null>(null);

  const [userData, setUserData] = useState<any[]>([]);
  const [apContestAchSummaryRecord, setApContestAchSummaryRecord] = useState<
    any[]
  >([]);
  const [apContestSummary, setApContestSummary] = useState<{
    bnlkp: number;
    newc: number;
  } | null>(null);
  const [tabValue, setTabValue] = useState(0);

  const partnerContestTabs = [
    "Contest Rewards",
    "Leaderboard",
    "Broking Revenue",
    "Clientwise Brokerage",
    "New Added Clients",
  ];

  const selectedCapsuleData = partnerContestTabs[tabValue];
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch<AppDispatch>();
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );

  useEffect(() => {
    const payload = {
      user_id: isCustomRender ? `APN-${row?.apc}` : user_id,
      quarterPeriod: "Q3-2526",
    };

    const fetchContestTargetDetails = async () => {
      try {
        dispatch(showLoader(""));
        const response = await apiServices.GetAPContestTargetDetails(payload);

        if (response?.status === 200) {
          const list = response?.data?.data || [];

          // Add Id to each item
          const mappedList = list.map((item: any, index: number) => ({
            Id: index + 1,
            ...item,
          }));

          // Store the first item after mapping
          const firstItem = mappedList[0] || {};

          console.log(
            "GetAPContestTargetDetails",
            firstItem,
            activeMenu,
            userData
          );
          setApInfo(firstItem);
          // setTargetData(firstItem);
        }
      } catch (error) {
        console.error("Error fetching AP Contest Target Details", error);
      } finally {
        dispatch(hideLoader());
      }
    };

    fetchContestTargetDetails();
    // fetchAPachievedBrokerage();
    // fetchAPContestAchClients();
    fetchAPContestSummary();
  }, [row?.apc]);

  // const fetchAPachievedBrokerage = () => {
  //   let payload = {
  //     user_id: isCustomRender ? `APN-${row?.apc}` : user_id,
  //   };
  //   dispatch(showLoader(""));

  //   apiServices
  //     .GetAPContestAchievedBrokerage(payload)
  //     .then((response) => {
  //       if (response?.status === 200) {
  //         dispatch(hideLoader());
  //         console.log("ResponseAPContest", response?.data);
  //         setUserData(
  //           response?.data?.data?.map((item: any, index: number) => ({
  //             ...item,
  //             id: index,
  //           }))
  //         );
  //         console.log(userData);
  //       }
  //     })
  //     .catch((error) => {
  //       console.log("Errror", error);
  //     });
  // };

  const fetchAPContestAchClients = () => {
    let payload = {
      user_id: isCustomRender ? `APN-${row?.apc}` : user_id,
      quarterPeriod: "Q3-2526",
      // user_id: user_id,
    };
    dispatch(showLoader(""));

    apiServices
      .GetAPContestAchievedClients(payload)
      .then((response) => {
        if (response?.status === 200) {
          dispatch(hideLoader());
          console.log("ResponseAPContestAchClients", response?.data);

          const list = response?.data?.data || [];

          // Map and add Id field
          const mappedList = list.map((item: any, index: number) => ({
            Id: index + 1,
            ...item,
          }));

          // Store mapped list in state
          setApContestAchSummaryRecord(mappedList);
        }
      })
      .catch((error) => {
        console.log("Errror", error);
      });
  };

  const fetchAPContestSummary = () => {
    let payload = {
      user_id: isCustomRender ? `APN-${row?.apc}` : user_id,
      quarterPeriod: "Q3-2526",
      // user_id: user_id,
    };
    dispatch(showLoader(""));

    apiServices
      .GetAPContestAchievedSummary(payload)
      .then((response) => {
        if (response?.status === 200) {
          console.log("Respponsee-->", response?.data?.data);
          dispatch(hideLoader());
          setUserData(response?.data?.data);
          setApContestSummary(response?.data?.data);
        }
      })
      .catch((error) => {
        console.log("Errror", error);
      });
  };

  // const handleClick = (value: string) => {
  //   console.log("You clicked the Chip.", value);
  //   setSelectedCapsule(value);
  // };

  useEffect(() => {
    // alert(selectedCapsule);
    if (selectedCapsuleData === "New Added Clients") {
      fetchAPContestAchClients();
    }
  }, [selectedCapsuleData]);

  return (
    <>
      <div className="page-content page-view">
        {/* <div>
          <UserCapsules
            selectedCapsule={selectedCapsule}
            handleClick={handleClick}
            capsuleType="Partner Contest"
            targetData={targetData}
            isCustomRender={isCustomRender}
          />
        </div> */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "1rem",
            marginRight: "0.7rem",
            flexWrap: "wrap", // responsive
            gap: "8px",
          }}
        >
          <Tabs
            value={tabValue}
            onChange={(_, v) => setTabValue(v)}
            TabIndicatorProps={{ style: { display: "none" } }}
            sx={{
              marginTop: "1rem",
              marginLeft: ".7rem",
              marginBottom: "8px",
              backgroundColor: "white",
              borderRadius: "11px",
              width: "fit-content",
              minHeight: 0,
            }}
          >
            {partnerContestTabs.map((label, index) => (
              <Tab
                key={label}
                label={label}
                sx={{
                  textTransform: "none",
                  fontWeight: 400,
                  borderRadius: "10px",
                  px: 3,
                  minHeight: 10,
                  backgroundColor: tabValue === index ? "#11395C" : "white",
                  color: tabValue === index ? "white" : "#11395C",
                  "&.Mui-selected": {
                    color: "white !important",
                  },
                  "& .MuiTab-wrapper": {
                    color: tabValue === index ? "white" : "#11395C",
                  },
                }}
              />
            ))}
          </Tabs>
          {apInfo && isCustomRender && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                fontSize: "13px",
                fontWeight: 300,
              }}
            >
              {apInfo.apn} / {apInfo.apc}
            </div>
          )}
        </div>

        <Container fluid>
          <Row>
            <div className="card-body">
              {selectedCapsuleData === "Contest Rewards" && (
                <Row className="mt-3">
                  <Col sm={12}>
                    <Card className="contest-card">
                      <CardBody style={{ textAlign: "center" }}>
                        <p style={{ fontWeight: "700", marginBottom: "15px" }}>
                          Contest Period - 1st October to 31st December
                        </p>
                        <img
                          src={contestReward}
                          alt="Contest Reward"
                          style={{
                            maxWidth: "75%",
                            height: "auto",
                            borderRadius: "8px",
                            // boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          }}
                        />
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              )}

              {selectedCapsuleData === "Leaderboard" && (
                <Leaderboard isCustomRender={isCustomRender} row={row} />
              )}
              {selectedCapsuleData === "Broking Revenue" && (
                <BrokingRevenue isCustomRender={isCustomRender} row={row} />
              )}
              {selectedCapsuleData === "Clientwise Brokerage" && (
                <ClientWiseBrokerage
                  isCustomRender={isCustomRender}
                  row={row}
                />
              )}

              {selectedCapsuleData === "New Added Clients" && (
                <>
                  <Row className="g-3" style={{ margin: "5px 0px" }}>
                    <Col xxl={4} lg={4} md={6} sm={12}>
                      <DashboardCard
                        title="Client Target*"
                        value={12}
                        animationData={ActiveClient}
                        activeClientsEmpty={true}
                        customClass={true}
                        note={
                          isMobile && `* Contest Period - 1st Oct to 31st Dec`
                        }
                      />
                    </Col>
                    <Col xxl={4} lg={4} md={6} sm={12}>
                      <DashboardCard
                        title="Clients Achieved*"
                        value={
                          apContestSummary?.newc != null
                            ? apContestSummary.newc
                            : "-"
                        }
                        customClass={true}
                      />
                    </Col>
                  </Row>

                  <Card
                    style={{
                      minHeight: "80vh",
                      borderRadius: "15px",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                      // marginTop: "17px",
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
                      <h4 className="card-title mb-0">
                        AP Contest Achieved Clients{" "}
                        <span style={{ fontSize: "12px" }}>
                          (October–December)
                        </span>
                      </h4>
                    </CardHeader>
                    <CardBody>
                      <UserInfoTable
                        T6Data={apContestAchSummaryRecord}
                        activeMenu={"AP Contest Achieved Clients"}
                      />
                    </CardBody>
                  </Card>
                </>
              )}

              {/* <Card className="contest-card">
                <CardBody style={{ textAlign: "center" }}>
                  <p style={{ fontWeight: "500", marginBottom: "15px" }}>
                    Contest Period - 1st October to 31st December
                  </p>{" "}
                  <h4
                    style={{
                      fontWeight: "700",
                      marginBottom: "15px",
                      textAlign: "left",
                    }}
                  >
                    Coming Soon
                  </h4>{" "}
                </CardBody>
              </Card> */}
            </div>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default APContestQ4;
