import React, { useEffect, useState } from "react";
// import { monthProjectData } from "../../components/common/OverviewData";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
// import { apiServices } from "../../services";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardHeader, Col } from "reactstrap";
import { StoreVisitsCharts } from "../../../components/common/Visitors";
import { RootState, AppDispatch } from "../../../redux/store";
import { ClientSummary } from "../../../redux/thunk/ClientSummary";
import ShowToast from "../../../utils/toastUtils";

const StoreVisits = ({ getActiveClients }: any) => {
  const [chartData, setChartData] = useState<[]>([]);

  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );
  console.log("user", user_id);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchActiveInactiveCli = async () => {
      // const Id = localStorage.getItem("Id");
      const payload = {
        user_id: user_id,
      };
      dispatch(showLoader(""));
      dispatch(ClientSummary(payload))
        .unwrap()
        .then((response) => {
          console.log("ClientSummaryResponse", response?.data?.data[0].Active);
          const activeClient = response?.data?.data[0].Active;
          getActiveClients(activeClient);
          setChartData(response?.data?.data[0]);
          // setBrokerageData(response?.data?.data);
          if (response?.status === 200) {
            dispatch(hideLoader());
          }
        })
        .catch((Err) => {
          const { message } = Err;
          console.log("Error->", message);
          dispatch(hideLoader());
          // formik.setFieldError("password", message);
          ShowToast(
            "error",
            message ||
              "Sorry for the inconvenience, please try after some time."
          );
        })
        .finally(() => {
          // dispatch(hideLoader());
        });
      // try {
      //   dispatch(showLoader(""));
      //   const response = await apiServices.GetClientStatusCnt(payload);
      //   console.log("GetClientStatusCntresponse", response?.data?.data[0]);
      //   setChartData(response?.data?.data[0]);
      //   // setBrokerageData(response?.data?.data);
      //   if (response?.status === 200) {
      //     dispatch(hideLoader());
      //   }
      // } catch (error) {
      //   console.error("Error->", error);
      //   dispatch(hideLoader());
      // }
    };
    fetchActiveInactiveCli();
  }, [dispatch]);
  return (
    <React.Fragment>
      <Col xl={4}>
        <Card className="card-height-100">
          <CardHeader className="align-items-center d-flex">
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
