import React, { useEffect, useState } from "react";
// import { monthProjectData } from "../../components/common/OverviewData";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
// import { apiServices } from "../../services";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardHeader, Col } from "reactstrap";
import { StoreVisitsCharts } from "../../../components/common/Visitors";
import { RootState, AppDispatch } from "../../../redux/store";
import ShowToast from "../../../utils/toastUtils";
import { apiServices } from "../../../services";

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
    const GetClientActiveInactiveCount = async () => {
      const branchCode = user_id?.split("-")[1] || "";
      const payload = { branchCode: branchCode };

      dispatch(showLoader(""));

      try {
        const response = await apiServices.GetClientActiveInactiveCount(
          payload
        );
        dispatch(hideLoader());

        if (response?.status === 200) {
          const clientData = response?.data;
          console.log(clientData, "merum");

          const active = Number(clientData?.activeClients ?? 0);
          const inactive = Number(clientData?.inactiveClients ?? 0);

          console.log("ChartData Debug:", { active, inactive });

          setChartData([
            { name: "Active", value: active },
            { name: "Inactive", value: inactive },
          ]);

          getActiveClients(active);
        } else {
          ShowToast("error", "Unexpected response status.");
        }
      } catch (err) {
        dispatch(hideLoader());
      }
    };

    GetClientActiveInactiveCount();
  }, [dispatch, user_id]);

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
