import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import CountUp from "react-countup";
import { ProjectsOverviewCharts } from "./DashboardProjectCharts";
// import { getProjectChartsData } from "../../slices/thunks";
import { createSelector } from "reselect";
// import { monthProjectData } from "../../components/common/OverviewData";
import { showLoader, hideLoader } from "../../redux/slices/loaderSlice";
import { apiServices } from "../../services";
import { useDispatch } from "react-redux";

const ProjectsOverview = () => {
  const [brokerageData, setBrokerageData] = useState<[]>([]);
  const [monthProjectData, setMonthProjectData] = useState([
    {
      name: "Gross Brokerage",
      type: "bar",
      data: [],
    },
    {
      name: "AP Share",
      type: "bar",
      data: [],
    },
  ]);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchBrokerage = async () => {
      const Id = localStorage.getItem("Id");
      const payload = {
        user_id: Id,
      };
      try {
        dispatch(showLoader(""));
        const response = await apiServices.Last7dayBrokerage(payload);
        console.log("Last7dayBrokerageresponse", response?.data?.data);
        setBrokerageData(response?.data?.data);
        const fetchedBrokerageData = response?.data?.data;

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
      } catch (error) {
        console.error("Error->", error);
        dispatch(hideLoader());
      }
    };

    fetchBrokerage();
  }, [dispatch]);

  return (
    <React.Fragment>
      <Row>
        <Col xl={12}>
          <Card>
            <CardHeader className="p-0 border-0 bg-light-subtle">
              <Row className="g-0 text-center">
                <Col xs={12} sm={12}>
                  <div className="p-3 border border-dashed border-start-0 d-flex">
                    <h4 className="card-title mb-0 flex-grow-1 text-start">
                      Brokerage Details for last 7 Days
                    </h4>
                    <div
                      className="d-flex align-items-center"
                      style={{ fontFamily: "Public Sans, sans-serif" }}
                    >
                      <div
                        style={{
                          backgroundColor: "#1c3d5a", // Color for Gross Brokerage
                          width: "16px",
                          height: "16px",
                          marginRight: "8px",
                        }}
                      ></div>
                      <p className="mb-0 me-4">Gross Brokerage</p>

                      <div
                        style={{
                          backgroundColor: "#f57c00", // Color for AP Share
                          width: "16px",
                          height: "16px",
                          marginRight: "8px",
                        }}
                      ></div>
                      <p className="mb-0">AP Share</p>
                    </div>
                  </div>
                </Col>
              </Row>
            </CardHeader>
            <CardBody className="p-0 pb-2">
              <div>
                <div dir="ltr" className="apex-charts">
                  <ProjectsOverviewCharts
                    series={monthProjectData}
                    // dataColors='["--vz-primary", "--vz-secondary", "--vz-danger"]'
                    brokerageData={brokerageData}
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
