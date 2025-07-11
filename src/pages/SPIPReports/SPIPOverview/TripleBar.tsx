import { Card, CardBody, CardHeader } from "reactstrap";
import { ProjectsOverviewCharts } from "../../Employee/Overview/DashboardProjectCharts";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { apiServices } from "../../../services";

const TripleBar = () => {
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

  useEffect(() => {
    const userId = user_id.includes("-") ? user_id.split("-")[1] : user_id;
    console.log("usertrip", userId);
    let payload = {
      branchCode: userId, //1676
      clientCode: "",
      option: "",
    };

    dispatch(showLoader(""));
    apiServices
      .GetCommissionRevenueSummary(payload)
      .then((response) => {
        if (response?.status === 200) {
          setBrokerageData(response?.data);
          const fetchedBrokerageData = response?.data;

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
        }
      })

      .catch((error) => {
        dispatch(hideLoader());
        console.log("Error", error);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  }, [dispatch]);
  return (
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
  );
};

export default TripleBar;
