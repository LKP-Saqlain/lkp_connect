import React, { useEffect, useState } from "react";
// import { monthProjectData } from "../../components/common/OverviewData";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
// import { apiServices } from "../../services";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardHeader, Col } from "reactstrap";
import { StoreVisitsCharts } from "../../../components/common/Visitors";
import { RootState, AppDispatch } from "../../../redux/store";
// import { ClientSummary } from "../../../redux/thunk/ClientSummary";
import { APBrokerage } from "../../../redux/thunk/AP/lastWeekBrokerage";
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
        branchCode: user_id,
      };
      dispatch(showLoader("Please wait, we are processing your request..."));
      dispatch(APBrokerage(payload))
        .unwrap()
        .then((response) => {
          const firstItem = response?.data?.Table1?.[0];

          if (
            firstItem &&
            (firstItem.Active !== null || firstItem.Inactive !== null)
          ) {
            console.log("APSummaryResponse", firstItem);
            getActiveClients(firstItem.Active);
            setChartData(firstItem);
          } else {
            console.warn("API returned all null values");
            getActiveClients(null);
            setChartData([]);
          }

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
      //   dispatch(showLoader("Please wait, we are processing your request..."));
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
