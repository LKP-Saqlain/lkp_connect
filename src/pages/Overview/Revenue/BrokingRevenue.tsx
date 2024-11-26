import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import { RevenueCharts } from "../DashboardProjectCharts";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
// import { apiServices } from "../../services";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../redux/store";
import { DealerPerformance } from "../../../redux/thunk/DealerPerformance";
import ShowToast from "../../../utils/toastUtils";

const Revenue = () => {
  const [yearRevenue, setYearRevenue] = useState<[]>([]);
  const [brokingNonBrokingData, setBrokingNonBrokingData] = useState([
    {
      name: "Direct-Broking",
      group: "Direct-Broking",
      data: [],
    },
    {
      name: "Non-Broking",
      group: "Non-Broking",
      data: [],
    },
    // {
    //   name: "Indirect Broking",
    //   group: "Broking",
    //   data: [],
    // },
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
        user_id: user_id,
      };
      dispatch(showLoader(""));
      dispatch(DealerPerformance(payload))
        .unwrap()
        .then((response) => {
          console.log("Resp", response);
          setYearRevenue(response?.data?.data?.Table);
          const fetchRevenueData = response?.data?.data?.Table;
          if (fetchRevenueData) {
            // Extract GrossBrokerage and APbrokerage data from the API response
            const brokingValues = fetchRevenueData.map(
              (item: any) => item.Ach_brok_dir
            );
            // const nonBrokingValues = fetchRevenueData.map(
            //   (item: any) => item.Tot_TPD_rev
            // );

            const indirectValues = fetchRevenueData.map(
              (item: any) => item.Ach_brok_indir + item.Ach_brok_ind_less2yrs
            );

            console.log("indirectValues-->", indirectValues);

            // Update the monthProjectData array
            setBrokingNonBrokingData([
              {
                name: "Direct-Broking",
                group: "Direct-Broking",
                data: brokingValues,
              },
              {
                name: "Indirect-Broking",
                group: "Broking",
                data: indirectValues,
              },
              // {
              //   name: "Non-Broking",
              //   group: "Non-Broking",
              //   data: nonBrokingValues,
              // },
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
      <Card>
        <CardHeader className="p-0 border-0 bg-light-subtle">
          <Row className="g-0 text-center">
            <Col xs={12}>
              <div className="p-3 border border-dashed border-start-0 d-flex flex-column flex-sm-row">
                <h4 className="card-title mb-0 flex-grow-1 text-md-start text-center">
                  Broking Revenue For last 12 Months
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
                  <p className="mb-0 me-3">Direct-Broking</p>
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
                  {/* <div
                    className="legend-color"
                    style={{
                      backgroundColor: "#008FFB",
                      width: "16px",
                      height: "16px",
                      marginRight: "8px",
                    }}
                  ></div>
                  <p className="mb-0">Non-broking</p> */}
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
