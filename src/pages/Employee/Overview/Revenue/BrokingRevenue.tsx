import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "reactstrap";
import {
  // RevenueCharts,
  ProjectsOverviewCharts,
} from "../DashboardProjectCharts";
import { showLoader, hideLoader } from "../../../../redux/slices/loaderSlice";
// import { apiServices } from "../../services";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../../redux/store";
// import { DealerPerformance } from "../../../../redux/thunk/DealerPerformance";
import ShowToast from "../../../../utils/toastUtils";
import { APBrokerage } from "../../../../redux/thunk/AP/lastWeekBrokerage";
// import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const Revenue = ({}: any) => {
  // const [selectedYear, setSelectedYear] = useState("2024-2025");
  const [brokerageData, setBrokerageData] = useState<[]>([]);
  const [monthProjectData, setMonthProjectData] = useState([
    {
      name: "Gross Brokerage",
      type: "bar",
      data: [],
    },
  ]);
  // const [apiMonths, setApiMonths] = useState([]);

  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );
  console.log("user", user_id);
  const dispatch = useDispatch<AppDispatch>();

  // const financialYears = [
  //   { value: "2023-2024", label: "2023-2024" },
  //   { value: "2024-2025", label: "2024-2025" },
  //   // { value: "2024-2025", label: "2024-2025" },
  // ];

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
          console.log("APBrokerageResponse", response?.data?.Table2);
          setBrokerageData(response?.data?.Table2);
          const fetchedBrokerageData = response?.data?.Table2;

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

  // const handleChange = (:event any) => {
  //   setSelectedYear(event.target.value as string);
  // };

  return (
    <React.Fragment>
      <Card>
        <CardHeader className="align-items-center d-flex">
          <h4 className="card-title mb-0 flex-grow-1 text-md-start text-center">
            Brokerage Revenue Summary
            <span style={{ fontSize: "0.8rem" }}> (Last 12 Months)</span>
          </h4>
          <div
            className="d-flex align-items-center flex-wrap mt-2 mt-sm-0 justify-content-between"
            style={{ fontFamily: "Public Sans, sans-serif" }}
          >
            <div className="d-flex align-items-center flex-wrap">
              {/* <div
                className="legend-color"
                style={{
                  backgroundColor: "#1890FF",
                  width: "16px",
                  height: "16px",
                  marginRight: "8px",
                }}
              ></div>
              <p className="mb-0 me-3">Gross Brokerage</p>

              <div
                className="legend-color"
                style={{
                  backgroundColor: "#00E396",
                  width: "16px",
                  height: "16px",
                  marginRight: "8px",
                }}
              ></div>
              <p className="mb-0 me-3">AP Share</p> */}
              {/* Broking Data */}
            </div>

            {/* <div style={{ minWidth: 160, maxHeight: 36 }}>
              <FormControl fullWidth size="small" sx={{ maxHeight: 36 }}>
                <InputLabel
                  id="financial-year-select-label"
                  sx={{ fontSize: "0.8rem", top: "5px" }}
                >
                  Financial Year
                </InputLabel>
                <Select
                  size="small"
                  labelId="financial-year-select-label"
                  id="financial-year-select"
                  name="finYear"
                  value={selectedYear}
                  label="Financial Year"
                  onChange={handleChange}
                >
                  {financialYears.map((year) => (
                    <MenuItem key={year.value} value={year.value}>
                      {year.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div> */}
          </div>
        </CardHeader>

        <CardBody className="p-0 pb-2">
          <div className="w-100">
            <div dir="ltr">
              {/* <RevenueCharts
                series={brokingNonBrokingData}
                revenueMonths={yearRevenue}
              /> */}
              <ProjectsOverviewCharts
                series={monthProjectData}
                // dataColors='["--vz-primary", "--vz-secondary", "--vz-danger"]'
                brokerageData={brokerageData}
                revenueYear={true}
              />
            </div>
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default Revenue;
