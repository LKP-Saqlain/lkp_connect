import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "reactstrap";
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
    {
      name: "Unlisted Shares",
      group: "Unlisted Shares",
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
      dispatch(showLoader("Please wait, we are processing your request..."));
      dispatch(DealerPerformance(payload))
        .unwrap()
        .then((response) => {
          console.log("NonBrokingResponseApi", response?.data?.data?.tbl);
          setYearRevenue(response?.data?.data?.tbl);
          const fetchRevenueData = response?.data?.data?.tbl;
          if (fetchRevenueData) {
            const tpd_Insurance = fetchRevenueData.map(
              (item: any) => item.tpdins
            );
            const TPD_Liq_loans = fetchRevenueData.map(
              (item: any) => item.tpdll
            );
            const spIp = fetchRevenueData.map((item: any) => item.rarev);
            const TPD_mutualfunds = fetchRevenueData.map(
              (item: any) => item.tpdmf
            );
            const unlistedShares = fetchRevenueData.map(
              (item: any) => item.usr
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
              {
                name: "Unlisted Shares",
                group: "Unlisted Shares",
                data: unlistedShares,
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
      <Card
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
          <h4 className="card-title mb-0 flex-grow-1 text-md-start text-center">
            Non-Broking Revenue for Last 12 Months
          </h4>
          <div
            className="d-flex align-items-center flex-wrap mt-2 mt-sm-0"
            style={{ fontFamily: "Public Sans, sans-serif" }}
          >
            <div
              className="legend-color"
              style={{
                backgroundColor: "#1890ff",
                width: "16px",
                height: "16px",
                marginRight: "10px",
              }}
            ></div>
            <p className="mb-0 me-3">Mutual Funds</p>
            <div
              className="legend-color"
              style={{
                backgroundColor: "#52c41a",
                width: "16px",
                height: "16px",
                marginRight: "8px",
              }}
            ></div>
            <p className="mb-0 me-3">Research</p>
            <div
              className="legend-color"
              style={{
                backgroundColor: "#faad14",
                width: "16px",
                height: "16px",
                marginRight: "8px",
              }}
            ></div>
            <p className="mb-0 me-3">Insurance</p>
            <div
              className="legend-color"
              style={{
                backgroundColor: "#00E396",
                width: "16px",
                height: "16px",
                marginRight: "8px",
              }}
            ></div>
            <p className="mb-0 me-3">LiquiLoans</p>
            <div
              className="legend-color"
              style={{
                backgroundColor: "#ec8c95",
                width: "16px",
                height: "16px",
                marginRight: "8px",
              }}
            ></div>
            <p className="mb-0">Unlisted Shares</p>
          </div>
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
