import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";

import { useMediaQuery } from "rsuite/esm/useMediaQuery/useMediaQuery";
import theme from "../../../theme";
import contestReward from "../../../assets/images/AP Contest Reward.png";
import ActiveClient from "../../../assets/images/Clients.json";
import DashboardCard from "../../../components/common/DashboardCard";
import UserInfoTable from "../../../components/common/UserInfoTable";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { apiServices } from "../../../services";

import UserCapsules from "../../ClientDetails/UserCapsules";

interface APContestData {
  rowId: number;
  apCode: string;
  apName: string;
  zone: string;
  qtarget: number;
  newClientCount: number;
  prize: string;
}

const APContest = ({ activeMenu, isCustomRender, row }: any) => {
  const [selectedCapsule, setSelectedCapsule] = useState("Contest Rewards");
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
          setUserData(response?.data?.data);
          setApContestSummary(response?.data?.data);
        }
      })
      .catch((error) => {
        console.log("Errror", error);
      });
  };

  const formatIndianNumber = (number: number) => {
    return `₹${number.toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };
  const handleClick = (value: string) => {
    console.log("You clicked the Chip.", value);
    setSelectedCapsule(value);
  };

  return (
    <>
      <div className="page-content page-view">
        <UserCapsules
          selectedCapsule={selectedCapsule}
          handleClick={handleClick}
          capsuleType="Partner Contest"
        />
        <Container fluid>
          <Row>
            <div className="card-body">
              {selectedCapsule === "Contest Rewards" && (
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
                            maxWidth: "100%",
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

              {selectedCapsule === "Broking Revenue" && (
                <>
                  <Row className="g-3" style={{ marginTop: "5px" }}>
                    <Col xxl={4} lg={4} md={6} sm={12}>
                      <DashboardCard
                        title="Revenue Achieved*"
                        value={
                          apContestSummary?.brokerageNetToLKP
                            ? formatIndianNumber(
                                apContestSummary.brokerageNetToLKP
                              )
                            : "-"
                        }
                        customClass={true}
                        note={
                          isMobile &&
                          `* Contest Period - 1st October to 31st December`
                        }
                        isCustomRender={isCustomRender}
                      />
                    </Col>
                  </Row>
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
                        <span style={{ fontSize: "12px" }}>
                          (October–December)
                        </span>
                      </h4>
                    </CardHeader>
                    <CardBody>
                      <UserInfoTable
                        T6Data={userData}
                        activeMenu={activeMenu}
                      />
                    </CardBody>
                  </Card>
                </>
              )}

              {selectedCapsule === "Client Achieve" && (
                <>
                  <Row className="g-3" style={{ margin: "5px 0px" }}>
                    <Col xxl={4} lg={4} md={6} sm={12}>
                      <DashboardCard
                        title="Client Target*"
                        value={targetData?.newClientCount}
                        animationData={ActiveClient}
                        activeClientsEmpty={true}
                        customClass={true}
                        note={
                          isMobile &&
                          `* Contest Period - 1st October to 31st December`
                        }
                      />
                    </Col>
                    <Col xxl={4} lg={4} md={6} sm={12}>
                      <DashboardCard
                        title="Clients Achieved*"
                        value={
                          apContestSummary?.newClients != null
                            ? apContestSummary.newClients
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

export default APContest;
