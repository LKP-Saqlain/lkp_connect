import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import { ProjectsOverviewCharts } from "./DashboardProjectCharts";
// import { getProjectChartsData } from "../../slices/thunks";
// import { monthProjectData } from "../../components/common/OverviewData";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
// import { apiServices } from "../../services";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../redux/store";
import { APBrokerage } from "../../../redux/thunk/AP/lastWeekBrokerage";
import ShowToast from "../../../utils/toastUtils";
import "remixicon/fonts/remixicon.css";
const ProjectsOverview = () => {
  const [brokerageData, setBrokerageData] = useState<[]>([]);
  const [monthProjectData, setMonthProjectData] = useState([
    {
      name: "Gross Brokerage",
      type: "bar",
      data: [],
    },
  ]);
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );
  console.log("user", user_id);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchBrokerage = async () => {
      // const Id = localStorage.getItem("Id");
      const payload = {
        branchCode: user_id,
      };

      dispatch(showLoader("Please wait"));
      dispatch(APBrokerage(payload))
        .unwrap()
        .then((response) => {
          console.log("APBrokerageResponse", response?.data?.Table);
          setBrokerageData(response?.data?.Table);
          const fetchedBrokerageData = response?.data?.Table;

          if (fetchedBrokerageData) {
            // Extract GrossBrokerage and APbrokerage data from the API response
            const grossBrokerageData = fetchedBrokerageData.map(
              (item: any) => item.GrossBrokerage
            );
            const apShareData = fetchedBrokerageData.map(
              (item: any) => item.APbrokerage
            );

            // Update the monthProjectData array
            setMonthProjectData([
              {
                name: "Gross Brokerage",
                type: "bar",
                data: grossBrokerageData, // Set GrossBrokerage data
              },
              {
                name: "AP Share",
                type: "bar",
                data: apShareData, // Set APbrokerage data
              },
            ]);
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
          dispatch(hideLoader());
        });
    };

    fetchBrokerage();
  }, [dispatch]);

  return (
    <React.Fragment>
      <Row>
        <Col xl={12}>
          <Card>
            <CardHeader className="align-items-center d-flex">
              <h4 className="card-title mb-2 mb-md-0 flex-grow-1 text-md-start text-center">
                Brokerage Details for Last 10 Days
              </h4>
              <div
                className="d-flex align-items-center flex-wrap mt-2 mt-sm-0"
                style={{ fontFamily: "Public Sans, sans-serif" }}
              >
                <div
                  className="legend-color"
                  style={{
                    backgroundColor: "#11395C",
                    width: "16px",
                    height: "16px",
                    marginRight: "10px",
                  }}
                ></div>
                <p className="mb-0 me-3">Gross brokerage</p>
                <div
                  className="legend-color"
                  style={{
                    backgroundColor: "#faad14",
                    width: "16px",
                    height: "16px",
                    marginRight: "8px",
                  }}
                ></div>
                <p className="mb-0 me-3">AP Share</p>
              </div>
            </CardHeader>
            {/* <div
                      className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-end"
                      style={{ fontFamily: "Public Sans, sans-serif" }}
                    >
                      <div
                        style={{
                          backgroundColor: "#1c3d5a",
                          width: "16px",
                          height: "16px",
                          marginRight: "8px",
                        }}
                      ></div>
                      <p className="mb-2 mb-md-0 me-4">Gross Brokerage</p>

                      <div
                        style={{
                          backgroundColor: "#f57c00",
                          width: "16px",
                          height: "16px",
                          marginRight: "8px",
                        }}
                      ></div>
                      <p className="mb-0">AP Share</p>
                    </div> */}

            <CardBody className="p-0 pb-2">
              <div>
                <div dir="ltr" className="apex-charts">
                  <ProjectsOverviewCharts
                    series={monthProjectData}
                    // dataColors='["--vz-primary", "--vz-secondary", "--vz-danger"]'
                    brokerageData={brokerageData}
                    brokerageDate={true}
                  />
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default ProjectsOverview;
