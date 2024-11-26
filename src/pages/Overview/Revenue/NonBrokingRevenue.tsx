import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import { RevenueNonBrokingCharts } from "../DashboardProjectCharts";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
// import { apiServices } from "../../services";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../redux/store";
import { DealerPerformance } from "../../../redux/thunk/DealerPerformance";
import ShowToast from "../../../utils/toastUtils";

const NonBrokingRevenue = () => {
  const [yearRevenue, setYearRevenue] = useState<[]>([]);
  const [nonBrokingValues, setNonBrokingValues] = useState([
    {
      name: "tpd_Insurance",
      group: "tpd_Insurance",
      data: [],
    },
    {
      name: "TPD_Liq_loans",
      group: "TPD_Liq_loans",
      data: [],
    },
    {
      name: "spIp",
      group: "spIp",
      data: [],
    },
    {
      name: "TPD_mutualfunds",
      group: "TPD_mutualfunds",
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
            const tpd_Insurance = fetchRevenueData.map(
              (item: any) => item.TPD_Insurance
            );
            const TPD_Liq_loans = fetchRevenueData.map(
              (item: any) => item.TPD_Liq_loans
            );
            const spIp = fetchRevenueData.map((item: any) => item.TPD_Others);
            const TPD_mutualfunds = fetchRevenueData.map(
              (item: any) => item.TPD_mutualfunds
            );
            // Update the monthProjectData array
            setNonBrokingValues([
              {
                name: "Insurance",
                group: "Insurance",
                data: tpd_Insurance,
              },
              {
                name: "Liq_loans",
                group: "Liq_loans",
                data: TPD_Liq_loans,
              },
              {
                name: "spIp",
                group: "spIp",
                data: spIp,
              },
              {
                name: "Mutualfunds",
                group: "mutualfunds",
                data: TPD_mutualfunds,
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
      <Card>
        <CardHeader className="p-0 border-0 bg-light-subtle">
          <Row className="g-0 text-center">
            <Col xs={12}>
              <div className="p-3 border border-dashed border-start-0 d-flex flex-column flex-sm-row">
                <h4 className="card-title mb-0 flex-grow-1 text-md-start text-center">
                  Non-Broking Revenue For last 12 Months
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
                  <p className="mb-0 me-3">Insurance</p>
                  <div
                    className="legend-color"
                    style={{
                      backgroundColor: "#F57C00",
                      width: "16px",
                      height: "16px",
                      marginRight: "8px",
                    }}
                  ></div>
                  <p className="mb-0 me-3">Liquiloans</p>
                  <div
                    className="legend-color"
                    style={{
                      backgroundColor: "#008FFB",
                      width: "16px",
                      height: "16px",
                      marginRight: "8px",
                    }}
                  ></div>
                  <p className="mb-0 me-3">SPIP</p>
                  <div
                    className="legend-color"
                    style={{
                      backgroundColor: "#3D2785",
                      width: "16px",
                      height: "16px",
                      marginRight: "10px",
                    }}
                  ></div>
                  <p className="mb-0 me-3">Mutual Funds</p>
                </div>
              </div>
            </Col>
          </Row>
        </CardHeader>

        <CardBody className="p-0 pb-2">
          <div className="w-100">
            <div dir="ltr">
              <RevenueNonBrokingCharts
                revenueMonths={yearRevenue}
                series={nonBrokingValues}
                dataColors='["--vz-light",  "--vz-primary", "--vz-secondary"]'
              />
            </div>
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default NonBrokingRevenue;
