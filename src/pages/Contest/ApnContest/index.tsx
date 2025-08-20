import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";
import DashboardCard from "../../../components/common/DashboardCard";
import { useMediaQuery } from "rsuite/esm/useMediaQuery/useMediaQuery";
import theme from "../../../theme";
import RevenueImg from "../../../assets/images/revenue_new.json";
import ActiveClient from "../../../assets/images/Clients.json";
// import CoinIcon from "../../../assets/images/coins.json";
// import IphoneIcon from "../../../assets/images/Iphone.json";
// import IpadIcon from "../../../assets/images/Ipad.json";
// import AirPodsIcon from "../../../assets/images/Airpods.json";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { apiServices } from "../../../services";
import UserInfoTable from "../../../components/common/UserInfoTable";

// type BrokerageBadge = "Target" | "Achieve" | "nonBroking";

interface APContestData {
  rowId: number;
  apCode: string;
  apName: string;
  zone: string;
  qtarget: number;
  newClientCount: number;
  prize: string;
}
// const prizeAnimations = [IphoneIcon, IpadIcon, AirPodsIcon];

const APContest = ({ activeMenu, isCustomRender, row }: any) => {
  // const [revenueBadge, setRevenueBadge] = useState<BrokerageBadge>("Target");
  // const [clientBadge, setClientBadge] = useState<BrokerageBadge>("Target");
  const [targetData, setTargetData] = useState<APContestData | null>(null);
  const [userData, setUserData] = useState<any[]>([]);
  const [apContestAchSummaryRecord, setApContestAchSummaryRecord] = useState<
    any[]
  >([]);
  const [apContestSummary, setApContestSummary] = useState<{
    brokerageNetToLKP: number;
    newClients: number;
  } | null>(null);

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch<AppDispatch>();
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );

  useEffect(() => {
    const payload = {
      user_id: isCustomRender ? `APN-${row?.apCode}` : user_id,
    };

    const fetchContestTargetDetails = async () => {
      try {
        dispatch(showLoader(""));
        const response = await apiServices.GetAPContestTargetDetails(payload);

        if (response?.status === 200) {
          const data = response?.data?.data?.[0];
          console.log("GetAPContestTargetDetails", data);
          setTargetData(data);
        }
      } catch (error) {
        console.error("Error fetching AP Contest Target Details", error);
      } finally {
        dispatch(hideLoader());
      }
    };

    fetchContestTargetDetails();
    fetchAPachievedBrokerage();
    fetchAPContestAchClients();
    fetchAPContestSummary();
  }, []);

  const fetchAPachievedBrokerage = () => {
    let payload = {
      user_id: isCustomRender ? `APN-${row?.apCode}` : user_id,
      // user_id: user_id,
    };
    dispatch(showLoader(""));

    apiServices
      .GetAPContestAchievedBrokerage(payload)
      .then((response) => {
        if (response?.status === 200) {
          console.log("ResponseAPContest", response?.data?.data);
          dispatch(hideLoader());
          setUserData(
            response?.data?.data?.map((item: any, index: number) => ({
              ...item,
              id: index,
            }))
          );
        }
      })
      .catch((error) => {
        console.log("Errror", error);
      });
  };

  const fetchAPContestAchClients = () => {
    let payload = {
      user_id: isCustomRender ? `APN-${row?.apCode}` : user_id,
      // user_id: user_id,
    };
    dispatch(showLoader(""));

    apiServices
      .GetAPContestAchievedClients(payload)
      .then((response) => {
        if (response?.status === 200) {
          console.log("ResponseAPContestAchClients", response?.data?.data);
          dispatch(hideLoader());
          setApContestAchSummaryRecord(response?.data?.data);
        }
      })
      .catch((error) => {
        console.log("Errror", error);
      });
  };

  const fetchAPContestSummary = () => {
    let payload = {
      user_id: isCustomRender ? `APN-${row?.apCode}` : user_id,
      // user_id: user_id,
    };
    dispatch(showLoader(""));

    apiServices
      .GetAPContestAchievedSummary(payload)
      .then((response) => {
        if (response?.status === 200) {
          console.log("Respponsee-->", response?.data?.data);
          dispatch(hideLoader());
          // setUserData(response?.data?.data);
          setApContestSummary(response?.data?.data);
        }
      })
      .catch((error) => {
        console.log("Errror", error);
      });
  };
  // const handleRevenueBadgeClick = (type: BrokerageBadge) => {
  //   setRevenueBadge(type);
  // };

  // const handleClientBadgeClick = (type: BrokerageBadge) => {
  //   setClientBadge(type);
  // };

  // const revenueBadges = [
  //   {
  //     type: "primary",
  //     label: "Target",
  //     isActive: revenueBadge === "Target",
  //     onClick: () => handleRevenueBadgeClick("Target"),
  //   },
  //   {
  //     type: "info",
  //     label: "Achieve",
  //     isActive: revenueBadge === "Achieve",
  //     onClick: () => handleRevenueBadgeClick("Achieve"),
  //   },
  // ];

  // const clientBadges = [
  //   {
  //     type: "primary",
  //     label: "Target",
  //     isActive: clientBadge === "Target",
  //     onClick: () => handleClientBadgeClick("Target"),
  //   },
  //   {
  //     type: "info",
  //     label: "Achieve",
  //     isActive: clientBadge === "Achieve",
  //     onClick: () => handleClientBadgeClick("Achieve"),
  //   },
  // ];

  const formatIndianNumber = (number: number) => {
    return `₹${number.toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  return (
    <>
      <div className="page-content">
        <Container fluid>
          <Row className="g-3" style={{ marginTop: "5px" }}>
            {/* Revenue Column */}
            <Col xxl={4} lg={4} md={6} sm={12}>
              <DashboardCard
                title="Revenue Target*"
                value={
                  targetData?.qtarget
                    ? formatIndianNumber(targetData.qtarget)
                    : "-"
                }
                animationData={RevenueImg}
                customClass={true}
              />
              <div style={{ marginTop: "8px", marginBottom: "0px" }}>
                <DashboardCard
                  title="Revenue Achieved*"
                  value={
                    apContestSummary?.brokerageNetToLKP
                      ? formatIndianNumber(apContestSummary.brokerageNetToLKP)
                      : "-"
                  }
                  customClass={true}
                  note={
                    isMobile && `* Contest Period - 1st July to 30th September`
                  }
                  isCustomRender={isCustomRender}
                />
              </div>
            </Col>

            {/* Client Column */}
            <Col xxl={4} lg={4} md={6} sm={12}>
              <DashboardCard
                title="Client Target*"
                value={targetData?.newClientCount}
                animationData={ActiveClient}
                activeClientsEmpty={true}
                customClass={true}
              />
              <div style={{ marginTop: "8px" }}>
                <DashboardCard
                  title="Clients Achieved*"
                  value={
                    apContestSummary?.newClients != null
                      ? apContestSummary.newClients
                      : "-"
                  }
                  customClass={true}
                />
              </div>
            </Col>

            {/* Prize Column */}
            <Col xxl={4} lg={4} md={6} sm={12}>
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <DashboardCard
                  title="Prize*"
                  value={targetData?.prize}
                  customClass={true}
                  cardStyle={{ minHeight: "225px" }}
                  note={
                    !isMobile && `* Contest Period - 1st July to 30th September`
                  }
                />
              </div>
            </Col>
          </Row>

          <Row>
            <div className="card-body">
              <Card
                style={{
                  minHeight: "80vh",
                  borderRadius: "15px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
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
                    AP Contest Achieved Brokerage{" "}
                    <span style={{ fontSize: "12px" }}>(July- Sept)</span>
                  </h4>
                </CardHeader>
                <CardBody>
                  <UserInfoTable T6Data={userData} activeMenu={activeMenu} />
                </CardBody>
              </Card>
              <Card
                style={{
                  minHeight: "80vh",
                  borderRadius: "15px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
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
                    <span style={{ fontSize: "12px" }}>(July- Sept)</span>
                  </h4>
                </CardHeader>
                <CardBody
                // style={{
                //   // overflow: "hidden",
                //   height: `${
                //     apContestAchSummaryRecord.length > 0
                //       ? Math.min(
                //           apContestAchSummaryRecord.length * 20 + 30,
                //           150
                //         )
                //       : 450 // Minimum height when data is empty
                //   }px`,
                //   padding: "15px",
                // }}
                >
                  <UserInfoTable
                    T6Data={apContestAchSummaryRecord}
                    activeMenu={"AP Contest Achieved Clients"}
                  />
                </CardBody>
              </Card>
            </div>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default APContest;
