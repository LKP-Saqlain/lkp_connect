import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "reactstrap";
import { RevenueCharts } from "../DashboardProjectCharts";
import { showLoader, hideLoader } from "../../../../redux/slices/loaderSlice";
// import { apiServices } from "../../services";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../../redux/store";
import { DealerPerformance } from "../../../../redux/thunk/DealerPerformance";
import ShowToast from "../../../../utils/toastUtils";

const Revenue = ({
  handleRevenueRange,
  handleRevenueData,
  setTradedClientCount,
}: any) => {
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
  // const [currentQuarter, setCurrentQuarter] = useState("");
  const [revenueText, setRevenueText] = useState("");
  // const [apiMonths, setApiMonths] = useState([]);

  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );
  console.log("user", user_id);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // console.log(currentQuarter, revenueText, apiMonths);
    console.log(revenueText);

    const fetchBrokerage = async () => {
      const payload = {
        user_id: user_id,
      };

      dispatch(showLoader("Please wait"));
      dispatch(DealerPerformance(payload))
        .unwrap()
        .then((response) => {
          console.log("Resp", response?.data?.data?.Table);
          setYearRevenue(response?.data?.data?.Table);
          const fetchRevenueData = response?.data?.data?.Table;
          const filteredRevenueData = response?.data?.data?.Table1;

          if (fetchRevenueData) {
            function getQuarterMonths(quarter: string) {
              switch (quarter) {
                case "Q1":
                  return ["Apr", "May", "Jun"];
                case "Q2":
                  return ["Jul", "Aug", "Sep"];
                case "Q3":
                  return ["Oct", "Nov", "Dec"];
                case "Q4":
                  return ["Jan", "Feb", "Mar"];
                default:
                  return [];
              }
            }

            function getFinancialQuarter(date: Date) {
              const month = date.getMonth(); // 0 = Jan, 1 = Feb, ..., 11 = Dec
              console.log("checkMonths", month);

              if (month >= 0 && month <= 2) return "Q4"; // Jan-Mar
              if (month >= 3 && month <= 5) return "Q1"; // Apr-Jun
              if (month >= 6 && month <= 8) return "Q2"; // Jul-Sep
              if (month >= 9 && month <= 11) return "Q3"; // Oct-Dec
              return "Q1";
            }

            const now = new Date();
            const currentQuarter = getFinancialQuarter(now) || "Q1"; // Ensure it's not undefined
            console.log("currentQtrCheck", currentQuarter);

            const quarterMonths = getQuarterMonths(currentQuarter); // This is now safe
            const currentYear = now.getFullYear();

            let startMonthYear, endMonthYear;

            if (currentQuarter === "Q4") {
              startMonthYear = `${quarterMonths[0]}-${String(currentYear).slice(
                -2
              )}`;
              endMonthYear = `${quarterMonths[2]}-${String(currentYear).slice(
                -2
              )}`;
            } else {
              startMonthYear = `${quarterMonths[0]}-${String(currentYear).slice(
                -2
              )}`;
              endMonthYear = `${quarterMonths[2]}-${String(currentYear).slice(
                -2
              )}`;
            }

            setRevenueText(`Revenue from ${startMonthYear} to ${endMonthYear}`);
            console.log(
              "revenueText:",
              `Revenue from ${startMonthYear} to ${endMonthYear}`
            );
            handleRevenueRange(startMonthYear, endMonthYear);

            // Extract data for broking and indirect values
            const brokingValues = fetchRevenueData.map(
              (item: any) => item.Ach_brok_dir + item.Ach_brokslbm_dir
            );
            const indirectValues = fetchRevenueData.map(
              (item: any) => item.Ach_brok_indir + item.Ach_brok_ind_less2yrs
            );

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
            ]);
          }

          if (filteredRevenueData) {
            const broking =
              filteredRevenueData[0]?.Ach_brok_dir +
                filteredRevenueData[0]?.Ach_brok_ind_less2yrs +
                filteredRevenueData[0]?.Ach_brok_indir +
                filteredRevenueData[0]?.Ach_brokslbm_dir || 0;
            const nonBroking = filteredRevenueData[0]?.Tot_TPD_rev || 0;

            // const total = filteredRevenueData[0]?.Net_Rev_Ach || 0; //existing total getting from api
            const total = broking + nonBroking;
            const multiRevenueMultiply =
              filteredRevenueData[0]?.Multi_net_rev_ach || 0;
            const newClientsAdded = filteredRevenueData[0]?.New_Clients || 0;

            const tradedClient = filteredRevenueData[0]?.TradedClientCount || 0;
            console.log("valueTest", total, broking, nonBroking);

            setTradedClientCount(tradedClient);
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
          ShowToast(
            "error",
            message ||
              "Sorry for the inconvenience, please try after some time."
          );
        })
        .finally(() => {
          // dispatch(hideLoader()); // Hide loader
        });
    };

    fetchBrokerage();
  }, [dispatch]);

  return (
    <React.Fragment>
      <Card>
        <CardHeader className="align-items-center d-flex">
          <h4 className="card-title mb-0 flex-grow-1 text-md-start text-center">
            Broking Revenue for Last 12 Months
          </h4>
          <div
            className="d-flex align-items-center flex-wrap mt-2 mt-sm-0"
            style={{ fontFamily: "Public Sans, sans-serif" }}
          >
            <div
              className="legend-color"
              style={{
                backgroundColor: "#52c41a",
                width: "16px",
                height: "16px",
                marginRight: "8px",
              }}
            ></div>
            <p className="mb-0 me-3">Direct-Broking</p>
            <div
              className="legend-color"
              style={{
                backgroundColor: "#faad14",
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
