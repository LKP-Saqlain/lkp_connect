import { Card, CardBody, CardHeader } from "reactstrap";
import DataTable from "../../../components/common/UserInfoTable";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { useEffect, useState } from "react";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { apiServices } from "../../../services";

const AchieveCard = () => {
  type AchieveDataKey = "broking" | "nonBroking" | "client";

  const [achieveData, setAchieveData] = useState({
    broking: [],
    nonBroking: [],
    client: [],
  });

  const dispatch = useDispatch<AppDispatch>();
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );

  useEffect(() => {
    const payload = { user_id: user_id };
    dispatch(showLoader(""));

    Promise.all([
      apiServices.GetEmpContestAchievedBrokerage(payload),
      apiServices.GetEmpContestAchievedNonBrokerage(payload),
      apiServices.GetEmpContestAchievedClients(payload),
    ])
      .then(
        ([
          GetEmpContestAchievedBrokerage,
          GetEmpContestAchievedNonBrokerage,
          GetEmpContestAchievedClients,
        ]) => {
          const broking =
            GetEmpContestAchievedBrokerage?.status === 200
              ? GetEmpContestAchievedBrokerage?.data?.data || []
              : [];

          const nonBroking =
            GetEmpContestAchievedNonBrokerage?.status === 200
              ? GetEmpContestAchievedNonBrokerage?.data?.data || []
              : [];

          const client =
            GetEmpContestAchievedClients?.status === 200
              ? GetEmpContestAchievedClients?.data?.data || []
              : [];

          setAchieveData({
            broking,
            nonBroking,
            client,
          });

          console.log(
            { broking, nonBroking, client },
            "Merged Achieve Card Data"
          );
        }
      )
      .catch((error) => {
        console.error("Error fetching contest target details:", error);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  }, []);
  const cardConfigs: {
    title: string;
    dataKey: AchieveDataKey;
    menu: string;
    timeFrame: string;
  }[] = [
    {
      title: "Brokerage Achieved ",
      dataKey: "broking",
      menu: "Employee Brokerage Achieved",
      timeFrame: "(July-Sept)",
    },
    {
      title: "Non-Brokerage Achieved ",
      dataKey: "nonBroking",
      menu: "Employee Non-Brokerage Achieved",
      timeFrame: "(July-Sept)",
    },
    {
      title: "Clients Achieved ",
      dataKey: "client",
      menu: "Employee Clients Achieved",
      timeFrame: "(July-Sept)",
    },
  ];

  return (
    <div>
      {cardConfigs.map(({ title, dataKey, menu, timeFrame }) => (
        <Card
          key={title}
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
            <h4 className="card-title mb-0">
              {title}
              <span style={{ fontSize: "12px" }}>{timeFrame}</span>
            </h4>
          </CardHeader>
          <CardBody>
            <DataTable T6Data={achieveData[dataKey]} activeMenu={menu} />
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

export default AchieveCard;
