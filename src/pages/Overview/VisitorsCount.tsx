import React, { useEffect, useState } from "react";
// import { monthProjectData } from "../../components/common/OverviewData";
import { showLoader, hideLoader } from "../../redux/slices/loaderSlice";
// import { apiServices } from "../../services";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardHeader, Col } from "reactstrap";
import { StoreVisitsCharts } from "../../components/common/Visitors";
import { RootState, AppDispatch } from "../../redux/store";
import { ClientSummary } from "../../redux/thunk/ClientSummary";
import ShowToast from "../../utils/toastUtils";

const StoreVisits = ({ getActiveClients }: any) => {
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>(
    []
  );

  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );
  console.log("user", user_id);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchActiveInactiveCli = async () => {
      const payload = {
        user_id: user_id,
      };
      dispatch(showLoader("Please wait, we are processing your request..."));
      dispatch(ClientSummary(payload))
        .unwrap()
        .then((response) => {
          const clientData = response?.data?.data?.[0] || {};

          const active = Number(clientData?.Active ?? 0); // Handle null -> 0
          const inactive = Number(clientData?.Inactive ?? 0); // Handle null -> 0

          console.log("ChartData Debug:", { active, inactive });

          setChartData([
            { name: "Active", value: active },
            { name: "Inactive", value: inactive },
          ]);

          getActiveClients(active);

          if (response?.status === 200) {
            dispatch(hideLoader());
          }
        })
        .catch((err) => {
          console.log("Error->", err?.message);
          dispatch(hideLoader());
          ShowToast("error", err?.message || "Try again later.");
        });
    };

    fetchActiveInactiveCli();
  }, [dispatch]);

  return (
    <React.Fragment>
      <Col xl={4}>
        <Card
          className="card-height-100"
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
            <h4 className="card-title flex-grow-1">Client Summary</h4>
          </CardHeader>

          <div className="card-body">
            <div dir="ltr">
              <StoreVisitsCharts
                chartData={chartData}
                dataColors='["--vz-primary", "--vz-success", "--vz-secondary", "--vz-info", "--vz-warning"]'
              />
            </div>
          </div>
        </Card>
      </Col>
    </React.Fragment>
  );
};

export default StoreVisits;
