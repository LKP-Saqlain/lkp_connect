import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import { RevenueCharts } from "./DashboardProjectCharts";
import { showLoader, hideLoader } from "../../redux/slices/loaderSlice";
import { apiServices } from "../../services";
import { useDispatch } from "react-redux";
import { createSelector } from "reselect";

export const allRevenueData = [
  {
    name: "Broking",
    type: "bar",
    data: [34, 65, 46, 68, 49, 61, 42, 44, 78, 52, 63, 67],
  },
  {
    name: "Non-Broking",
    type: "bar",
    data: [
      89.25, 98.58, 68.74, 108.87, 77.54, 84.03, 51.24, 28.57, 92.57, 42.36,
      88.51, 36.57,
    ],
  },
];

const series = [
  {
    name: "Q1 Budget",
    group: "budget",
    data: [44000, 55000, 41000, 67000, 22000, 43000],
  },
  {
    name: "Q1 Actual",
    group: "actual",
    data: [48000, 50000, 40000, 65000, 25000, 40000],
  },
  {
    name: "Q2 Budget",
    group: "budget",
    data: [13000, 36000, 20000, 8000, 13000, 27000],
  },
];

const Revenue = () => {
  const [yearRevenue, setYearRevenue] = useState<[]>([]);
  const [brokingNonBrokingData, setBrokingNonBrokingData] = useState([
    {
      name: "Broking",
      group: "Broking",
      data: [],
    },
    {
      name: "Non-Broking",
      group: "Non-Broking",
      data: [],
    },
    {
      name: "Indirect Broking",
      group: "Broking",
      data: [],
    },
  ]);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("series", series, brokingNonBrokingData);
  }, [series]);
  useEffect(() => {
    const fetchBrokerage = async () => {
      const Id = localStorage.getItem("Id");
      const payload = {
        user_id: Id,
      };
      try {
        dispatch(showLoader(""));
        const response = await apiServices.DealerPerformance(payload);
        console.log("DealerPerformanceResponse", response?.data?.data?.Table);
        setYearRevenue(response?.data?.data?.Table);
        const fetchRevenueData = response?.data?.data?.Table;
        if (fetchRevenueData) {
          // Extract GrossBrokerage and APbrokerage data from the API response
          const brokingValues = fetchRevenueData.map(
            (item: any) => item.Ach_brok_dir
          );
          const nonBrokingValues = fetchRevenueData.map(
            (item: any) => item.Tot_TPD_rev
          );

          const indirectValues = fetchRevenueData.map(
            (item: any) => item.Ach_brok_indir + item.Ach_brok_ind_less2yrs
          );

          console.log("indirectValues-->", indirectValues);

          // Update the monthProjectData array
          setBrokingNonBrokingData([
            {
              name: "Broking",
              group: "Broking",
              data: brokingValues,
            },
            {
              name: "Non-Broking",
              group: "Non-Broking",
              data: nonBrokingValues,
            },
            {
              name: "Indirect Broking",
              group: "Broking",
              data: indirectValues,
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
      <Card>
        <CardHeader className="p-0 border-0 bg-light-subtle">
          <Row className="g-0 text-center">
            <Col xs={12}>
              <div className="p-3 border border-dashed border-start-0 d-flex flex-column flex-sm-row">
                <h4 className="card-title mb-0 flex-grow-1 text-md-start text-center">
                  Revenue Summary For Current Financial Year
                </h4>
                <div
                  className="d-flex align-items-center flex-wrap mt-2 mt-sm-0"
                  style={{ fontFamily: "Public Sans, sans-serif" }}
                >
                  <div
                    className="legend-color"
                    style={{
                      backgroundColor: "#01D28E",
                      width: "16px",
                      height: "16px",
                      marginRight: "8px",
                    }}
                  ></div>
                  <p className="mb-0 me-3">Broking</p>
                  <div
                    className="legend-color"
                    style={{
                      backgroundColor: "#F57C00",
                      width: "16px",
                      height: "16px",
                      marginRight: "8px",
                    }}
                  ></div>
                  <p className="mb-0 me-3">Indirect-broking</p>
                  <div
                    className="legend-color"
                    style={{
                      backgroundColor: "#008FFB",
                      width: "16px",
                      height: "16px",
                      marginRight: "8px",
                    }}
                  ></div>
                  <p className="mb-0">Non-broking</p>
                </div>
              </div>
            </Col>
          </Row>
        </CardHeader>

        <CardBody className="p-0 pb-2">
          <div className="w-100">
            <div dir="ltr">
              <RevenueCharts
                revenueMonths={yearRevenue}
                series={brokingNonBrokingData}
                dataColors='["--vz-light",  "--vz-primary", "--vz-secondary"]'
              />
            </div>
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default Revenue;
