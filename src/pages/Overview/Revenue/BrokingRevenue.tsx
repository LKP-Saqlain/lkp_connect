import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import { RevenueCharts } from "../DashboardProjectCharts";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
// import { apiServices } from "../../services";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../redux/store";
import { DealerPerformance } from "../../../redux/thunk/DealerPerformance";
import ShowToast from "../../../utils/toastUtils";

const Revenue = ({ handleRevenueRange, handleRevenueData }: any) => {
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
  const [currentQuarter, setCurrentQuarter] = useState("");
  const [revenueText, setRevenueText] = useState("");
  const [apiMonths, setApiMonths] = useState([]);

  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );
  console.log("user", user_id);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    console.log(currentQuarter, revenueText, apiMonths);
    const fetchBrokerage = async () => {
      // const Id = localStorage.getItem("Id");
      const payload = {
        user_id: user_id,
      };
      dispatch(showLoader(""));
      dispatch(DealerPerformance(payload))
        .unwrap()
        .then((response) => {
          console.log("Resp", response?.data?.data?.Table);
          setYearRevenue(response?.data?.data?.Table);
          const fetchRevenueData = response?.data?.data?.Table;
          const filteredRevenueData = response?.data?.data?.Table1;
          console.log("filteredRevenueData", filteredRevenueData);

          if (fetchRevenueData) {
            function getFinancialQuarter(dateStr: any) {
              const date = new Date(dateStr);
              const month = date.getMonth(); // Months are 0-based in JavaScript
              if (month >= 0 && month <= 2) return "Q4"; // Jan-Mar
              if (month >= 3 && month <= 5) return "Q1"; // Apr-Jun
              if (month >= 6 && month <= 8) return "Q2"; // Jul-Sep
              if (month >= 9 && month <= 11) return "Q3"; // Oct-Dec
            }

            const apiData = response?.data?.data?.Table.map(
              (item: any) => item.MnthYR
            );
            setApiMonths(apiData);
            console.log("apiData", apiData);

            const mappedData = apiData.map((entry: any) => {
              const [month, year] = entry.split("-");
              const dateStr = `01-${month}-${year}`; // Construct a full date (e.g., "01-Dec-23")
              return {
                MnthYR: entry,
                FinancialQuarter: getFinancialQuarter(dateStr),
              };
            });

            console.log("mappedData", mappedData);

            const now = new Date();
            const currentYear = now.getFullYear();
            const currentMonthYear =
              now.toLocaleString("default", { month: "short" }) +
              "-" +
              String(now.getFullYear()).slice(-2);
            console.log("currentMonthYear", currentMonthYear);

            // Find the current entry
            const currentData = mappedData.find(
              (entry: any) => entry.MnthYR === currentMonthYear
            );
            console.log("currentData", currentData);
            if (currentData) {
              setCurrentQuarter(currentData.FinancialQuarter);

              // Get all months for the current quarter and filter out previous year months
              const quarterMonths = mappedData.filter(
                (entry: any) =>
                  entry.FinancialQuarter === currentData.FinancialQuarter &&
                  parseInt("20" + entry.MnthYR.split("-")[1]) >= currentYear // Include only months from the current year or later
              );
              console.log("quarterMonths", quarterMonths);

              if (quarterMonths.length > 0) {
                const startMonth = quarterMonths[0].MnthYR;
                const endMonth = quarterMonths[quarterMonths.length - 1].MnthYR;
                setRevenueText(`Revenue from ${startMonth} to ${endMonth}`);
                console.log(
                  "revenueTxt:",
                  `Revenue from ${startMonth} to ${endMonth}`
                );
                handleRevenueRange(startMonth, endMonth);
              } else {
                setRevenueText("No valid revenue data for the current year.");
              }
            } else {
              console.warn("No matching data found for:", currentMonthYear);
              setCurrentQuarter("N/A");
              setRevenueText("No revenue data available for this period.");
            }

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
          if (filteredRevenueData) {
            const total = filteredRevenueData[0]?.Net_Rev_Ach || 0;
            const broking = filteredRevenueData[0]?.Ach_brok_dir || 0;
            const nonBroking = filteredRevenueData[0]?.Ach_brok_indir || 0;
            const multiRevenueMultiply =
              filteredRevenueData[0]?.Multi_net_rev_ach || 0;
            const newClientsAdded = filteredRevenueData[0]?.New_Clients || 0;

            console.log("Total:", total);
            console.log("Broking:", broking);
            console.log("Non-Broking:", nonBroking);
            console.log("multiRevenueMultiply", multiRevenueMultiply);
            console.log("newClientsAdded", newClientsAdded);

            handleRevenueData(
              total,
              broking,
              nonBroking,
              multiRevenueMultiply,
              newClientsAdded
            );
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
                  <p className="mb-0 me-3">Indirect-Broking</p>
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
