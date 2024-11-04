import React, { useEffect, useState } from "react";
// import { monthProjectData } from "../../components/common/OverviewData";
import { showLoader, hideLoader } from "../../redux/slices/loaderSlice";
import { apiServices } from "../../services";
import { useDispatch } from "react-redux";
import { Card, CardHeader, Col } from "reactstrap";
import { StoreVisitsCharts } from "../../components/common/Visitors";

const StoreVisits = () => {
  const [chartData, setChartData] = useState<[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchActiveInactiveCli = async () => {
      // if (selectedItem === "T6 Selling") {
      const Id = localStorage.getItem("Id");
      const payload = {
        user_id: Id,
      };
      try {
        dispatch(showLoader(""));
        const response = await apiServices.GetClientStatusCnt(payload);
        console.log("GetClientStatusCntresponse", response?.data?.data[0]);
        setChartData(response?.data?.data[0]);
        // setBrokerageData(response?.data?.data);
        if (response?.status === 200) {
          dispatch(hideLoader());
        }
      } catch (error) {
        console.error("Error->", error);
        dispatch(hideLoader());
      }
    };
    fetchActiveInactiveCli();
  }, [dispatch]);
  return (
    <React.Fragment>
      <Col xl={4}>
        <Card className="card-height-100">
          <CardHeader className="align-items-center d-flex">
            <h4 className="card-title mb-0 flex-grow-1">Client Summary</h4>
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
