import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Container } from "reactstrap";
import UserInfoTable from "../../../../components/common/UserInfoTable";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../redux/store";
import { hideLoader, showLoader } from "../../../../redux/slices/loaderSlice";
import { apiServices } from "../../../../services";

interface UserRank {
  rnk: number;
  gb: number;
}

const index = ({ isCustomRender, row }: any) => {
  const [userData, setUserData] = useState<any[]>([]);
  const [personalData, setPersonalData] = useState<UserRank>();
  const dispatch = useDispatch<AppDispatch>();
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );

  const fetchLeaderboard = async () => {
    const payload = {
      user_id: isCustomRender ? `APN-${row?.apCode}` : user_id,
      quarterPeriod: "Q4-2526",
    };

    try {
      dispatch(showLoader("Fetching leaderboard..."));

      const response = await apiServices.APContestLeaderboard(payload);
      const list = response?.data?.data?.list ?? [];
      const userRank = response?.data?.data?.urnk ?? [];

      if (response?.data?.statusCode === 200 && Array.isArray(list)) {
        const formattedData = list.map((item: any, index: number) => ({
          ...item,
          Id: index + 1,
        }));
        setPersonalData(userRank);
        setUserData(formattedData);
        console.log("Leaderboard Data:", formattedData);
      } else {
        console.warn(" No valid leaderboard data found:", response);
        setUserData([]);
      }
    } catch (error) {
      console.error(" Error fetching leaderboard:", error);
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <Container fluid>
      {/* <Row className="g-3 mt-1">
        <Col xxl={2} lg={4} md={6} sm={12}>
          {" "}
          <DashboardCard
            title="My Rank"
            value={response?.data?.data?.gb}
            customClass
          />{" "}
        </Col>
      </Row> */}
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
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <h4 className="card-title mb-0">
              AP Contest Leaderboard{" "}
              <span style={{ fontSize: "12px" }}>(January–March)</span>
            </h4>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span>My Rank: #{personalData?.rnk ?? "-"}</span>
              <span>|</span>
              <span>
                Gross Brokerage:{" "}
                {personalData?.gb?.toLocaleString("en-IN", {
                  maximumFractionDigits: 0,
                }) ?? "-"}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <UserInfoTable T6Data={userData} activeMenu={"LeaderBoard"} />
        </CardBody>
      </Card>
    </Container>
  );
};

export default index;
