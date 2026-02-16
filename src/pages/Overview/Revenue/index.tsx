import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../redux/store";
import { DealerPerformance } from "../../../redux/thunk/DealerPerformance";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
import ShowToast from "../../../utils/toastUtils";

import Revenue from "./BrokingRevenue";
import NonBrokingRevenue from "./NonBrokingRevenue";

const RevenueDetails = ({
  handleRevenueRange,
  handleRevenueData,
  setTradedClientCount,
}: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );

  const [yearRevenue, setYearRevenue] = useState<any[]>([]);
  const [brokingSeries, setBrokingSeries] = useState<any[]>([]);
  const [nonBrokingSeries, setNonBrokingSeries] = useState<any[]>([]);

  useEffect(() => {
    const fetchRevenue = async () => {
      dispatch(showLoader("Please wait, we are processing your request..."));

      dispatch(DealerPerformance({ user_id }))
        .unwrap()
        .then((response) => {
          console.log("DealerPerformanceResponse", response?.data);

          const monthlyData = response?.data?.data?.tbl;
          const summary = response?.data?.data?.tbl1;
          console.log("MonthlyData", monthlyData);

          if (!monthlyData) return;

          setYearRevenue(monthlyData);

          if (monthlyData) {
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

            // setRevenueText(`Revenue from ${startMonthYear} to ${endMonthYear}`);
            console.log(
              "revenueText:",
              `Revenue from ${startMonthYear} to ${endMonthYear}`
            );
            handleRevenueRange(startMonthYear, endMonthYear);
          }

          /* ---------------- Broking / Indirect ---------------- */
          const directBroking = monthlyData.map(
            (i: any) => i.abrd + i.absl_dir + i.abri + i.abil2
          );

          const indirectBroking = monthlyData.map(
            (i: any) => i.absl_dir + i.absl_ind + i.absl_ind2
          );

          setBrokingSeries([
            { name: "Direct-Broking", group: "Broking", data: directBroking },
            {
              name: "Indirect-Broking",
              group: "Broking",
              data: indirectBroking,
            },
          ]);

          /* ---------------- Non-Broking ---------------- */
          setNonBrokingSeries([
            {
              name: "Insurance",
              group: "Insurance",
              data: monthlyData.map((i: any) => i.tpdins),
            },
            {
              name: "LiquiLoans",
              group: "LiquiLoans",
              data: monthlyData.map((i: any) => i.tpdll),
            },
            {
              name: "Research",
              group: "Research",
              data: monthlyData.map((i: any) => i.rarev),
            },
            {
              name: "Mutual Funds",
              group: "Mutual Funds",
              data: monthlyData.map((i: any) => i.tpdmf),
            },
            {
              name: "Unlisted Shares",
              group: "Unlisted Shares",
              data: monthlyData.map((i: any) => i.usr),
            },
          ]);

          /* ---------------- KPI Summary ---------------- */
          if (summary) {
            const broking =
              summary.abrd +
              summary.absl_dir +
              summary.abri +
              summary.abil2 +
              summary.absl_ind +
              summary.absl_ind2;

            const nonBroking =
              summary.tpdins + summary.tpdll + summary.tpdmf + summary.usr;

            handleRevenueData(
              broking + nonBroking,
              broking,
              nonBroking,
              summary.mnra || 0,
              summary.newc || 0
            );

            setTradedClientCount(summary.trcc || 0);
          }

          dispatch(hideLoader());
        })
        .catch((err) => {
          dispatch(hideLoader());
          ShowToast("error", err?.message || "Unable to fetch revenue data");
        });
    };

    fetchRevenue();
  }, [dispatch, user_id]);

  return (
    <>
      <Revenue
        yearRevenue={yearRevenue}
        series={brokingSeries}
        handleRevenueRange={handleRevenueRange}
      />
      <NonBrokingRevenue yearRevenue={yearRevenue} series={nonBrokingSeries} />
    </>
  );
};

export default RevenueDetails;
