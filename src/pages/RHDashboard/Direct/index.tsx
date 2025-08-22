import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";
import ChartCard from "../../../components/common/ChartCard";
import UserInfoTable from "../../../components/common/UserInfoTable";
import { apiServices } from "../../../services";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { useFormik } from "formik";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

interface OverviewProps {
  activeSubItem: string;
}

export type ViewType = "Daily" | "Monthly" | "Weekly";

const monthYearOptions = [
  "Jan-25",
  "Feb-25",
  "Mar-25",
  "Apr-25",
  "May-25",
  "Jun-25",
  "Jul-25",
  "Aug-25",
  "Sep-25",
  "Oct-25",
  "Nov-25",
  "Dec-25",
];

const getCurrentMonthYear = (): string => {
  const now = new Date();
  const month = now.toLocaleString("en-US", { month: "short" });
  const year = now.getFullYear().toString().slice(-2);
  return `${month}-${year}`;
};
const currentMonth = getCurrentMonthYear();
const now = new Date();
const monthDropdown = `${now.toLocaleString("en-US", {
  month: "short",
})}-${now.getFullYear()}`;

const Direct = ({ activeSubItem }: OverviewProps) => {
  const [topClientsRecords, setTopClientsRecords] = useState<any[]>([]);
  const [selectedViews, setSelectedViews] = useState<ViewType[]>(
    Array(9).fill("Daily")
  );
  // const [brokerageData, setBrokerageData] = useState<{
  //   daily: BrokerageRecord[];
  //   weekly: BrokerageRecord[];
  //   monthly: BrokerageRecord[];
  // }>({
  //   daily: [],
  //   weekly: [],
  //   monthly: [],
  // });
  const [chartSeries, setChartSeries] = useState<{
    daily: number[];
    weekly: number[];
    monthly: number[];
  }>({
    daily: [],
    weekly: [],
    monthly: [],
  });

  const [tradeDates, setTradeDates] = useState<{
    daily: string[];
    weekly: string[];
    monthly: string[];
  }>({
    daily: [],
    weekly: [],
    monthly: [],
  });
  const [chartSeries2, setChartSeries2] = useState<{
    daily: number[];
    weekly: number[];
    monthly: number[];
  }>({
    daily: [],
    weekly: [],
    monthly: [],
  });

  const [tradeDates2, setTradeDates2] = useState<{
    daily: string[];
    weekly: string[];
    monthly: string[];
  }>({
    daily: [],
    weekly: [],
    monthly: [],
  });

  const [chartSeries3, setChartSeries3] = useState<{
    daily: number[];
    weekly: number[];
    monthly: number[];
  }>({
    daily: [],
    weekly: [],
    monthly: [],
  });

  const [tradeDates3, setTradeDates3] = useState<{
    daily: string[];
    weekly: string[];
    monthly: string[];
  }>({
    daily: [],
    weekly: [],
    monthly: [],
  });

  const [chartSeries4, setChartSeries4] = useState<{
    daily: number[];
    weekly: number[];
    monthly: number[];
  }>({
    daily: [],
    weekly: [],
    monthly: [],
  });

  const [tradeDates4, setTradeDates4] = useState<{
    daily: string[];
    weekly: string[];
    monthly: string[];
  }>({
    daily: [],
    weekly: [],
    monthly: [],
  });
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const dispatch = useDispatch<AppDispatch>();
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );

  const formik = useFormik({
    initialValues: {
      monthDropdown: currentMonth,
    },
    onSubmit: (values) => {
      console.log("Selected Month:", values.monthDropdown);
      // Optional: Trigger data fetching based on this
    },
  });

  const handleViewChange = (index: number, newView: ViewType) => {
    setSelectedViews((prev) => {
      const updated = [...prev];
      updated[index] = newView;
      return updated;
    });
  };

  useEffect(() => {
    // if (!formik.values.monthDropdown) return;
    console.log(activeSubItem, user_id);

    setTopClientsRecords([]);
    const payload = {
      user_Id: user_id,
      branch_Type: "direct",
      option_Type: "Monthly_Client",
      monthDropdown: selectedMonth || "",
    };

    dispatch(showLoader(""));
    apiServices
      .GetMonthlyClient(payload)
      .then((response) => {
        if (response?.status === 200) {
          const rawData = response?.data?.data;

          const formattedData = rawData.map((item: any, index: any) => {
            const dateObj = new Date(item.tradeDate);
            const day = String(dateObj.getDate()).padStart(2, "0");
            const month = dateObj.toLocaleString("en-US", { month: "short" });
            const year = String(dateObj.getFullYear()).slice(-2);
            return {
              ...item,
              id: index + 0,
              tradeDate: `${day}-${month}-${year}`,
            };
          });
          console.log("filteredRecord", formattedData);

          dispatch(hideLoader());
          setTopClientsRecords(formattedData);
        }
      })
      .catch((Error) => {
        console.log("Error", Error);
        dispatch(hideLoader());
      });
  }, [dispatch, formik.values.monthDropdown]);

  const fetchBrokRevenueData = async () => {
    const formatDate = (dateStr: string): string => {
      const dateObj = new Date(dateStr);
      const day = String(dateObj.getDate()).padStart(2, "0");
      const month = dateObj.toLocaleString("en-US", { month: "short" });
      const year = String(dateObj.getFullYear()).slice(-2);
      return `${day}-${month}-${year}`;
    };

    const sortByDate = (a: any, b: any) =>
      new Date(a.period).getTime() - new Date(b.period).getTime();

    const filterAndFormat = (data: any[], type: string): any[] => {
      return data
        .filter((item) => item.periodType === type)
        .sort(sortByDate)
        .map((item) => ({
          ...item,
          period: formatDate(item.period),
        }));
    };

    const payload = {
      user_Id: user_id,
      branch_Type: "direct",
      option_Type: "Brok_Revenue",
      monthDropdown,
    };

    try {
      dispatch(showLoader(""));
      const response = await apiServices.GetBrokRevenue(payload);
      dispatch(hideLoader());

      if (response?.status !== 200) return;

      const rawData = response?.data?.data ?? [];

      const groupedData = {
        daily: filterAndFormat(rawData, "Daily"),
        weekly: filterAndFormat(rawData, "Weekly"),
        monthly: filterAndFormat(rawData, "Monthly"),
      };

      setChartSeries({
        daily: groupedData.daily.map((item) => item.total_Revenue),
        weekly: groupedData.weekly.map((item) => item.total_Revenue),
        monthly: groupedData.monthly.map((item) => item.total_Revenue),
      });

      setTradeDates({
        daily: groupedData.daily.map((item) => item.period),
        weekly: groupedData.weekly.map((item) => item.period),
        monthly: groupedData.monthly.map((item) => item.period),
      });
    } catch (error) {
      console.error("GetBrokRevenue error:", error);
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    fetchBrokRevenueData();
    fetchGetTradePlaceRecords();
    fetchGetTradedClientsRecords();
    fetchRevenuePerTradedClientRecords();
  }, [dispatch]);

  const fetchGetTradePlaceRecords = () => {
    const formatDate = (dateStr: string): string => {
      const dateObj = new Date(dateStr);
      const day = String(dateObj.getDate()).padStart(2, "0");
      const month = dateObj.toLocaleString("en-US", { month: "short" });
      const year = String(dateObj.getFullYear()).slice(-2);
      return `${day}-${month}-${year}`;
    };

    const sortByDate = (a: any, b: any) =>
      new Date(a.period).getTime() - new Date(b.period).getTime();

    const filterAndFormat = (data: any[], type: string): any[] => {
      return data
        .filter((item) => item.periodType === type)
        .sort(sortByDate)
        .map((item) => ({
          ...item,
          period: formatDate(item.period),
        }));
    };

    let payload = {
      user_Id: user_id,
      branch_Type: "direct",
      option_Type: "Trade_placed",
      monthDropdown,
    };
    dispatch(showLoader(""));
    apiServices
      .GetTradeplaced(payload)
      .then((response) => {
        if (response?.status === 200) {
          console.log("Responseee", response?.data?.data);
          dispatch(hideLoader());
          const rawData = response?.data?.data ?? [];
          const groupedData = {
            daily: filterAndFormat(rawData, "Daily"),
            weekly: filterAndFormat(rawData, "Weekly"),
            monthly: filterAndFormat(rawData, "Monthly"),
          };
          setChartSeries2({
            daily: groupedData.daily.map((item) => item.unqiue_Bill_count),
            weekly: groupedData.weekly.map((item) => item.unqiue_Bill_count),
            monthly: groupedData.monthly.map((item) => item.unqiue_Bill_count),
          });

          setTradeDates2({
            daily: groupedData.daily.map((item) => item.period),
            weekly: groupedData.weekly.map((item) => item.period),
            monthly: groupedData.monthly.map((item) => item.period),
          });
          console.log("GrouupeedData", groupedData);
        }
      })
      .catch((Error) => {
        console.log("Error", Error);
        dispatch(hideLoader());
      });
  };

  const fetchGetTradedClientsRecords = () => {
    const formatDate = (dateStr: string): string => {
      const dateObj = new Date(dateStr);
      const day = String(dateObj.getDate()).padStart(2, "0");
      const month = dateObj.toLocaleString("en-US", { month: "short" });
      const year = String(dateObj.getFullYear()).slice(-2);
      return `${day}-${month}-${year}`;
    };

    const sortByDate = (a: any, b: any) =>
      new Date(a.period).getTime() - new Date(b.period).getTime();

    const filterAndFormat = (data: any[], type: string): any[] => {
      return data
        .filter((item) => item.periodType === type)
        .sort(sortByDate)
        .map((item) => ({
          ...item,
          period: formatDate(item.period),
        }));
    };

    let payload = {
      user_Id: user_id,
      branch_Type: "direct",
      option_Type: "Traded_Client",
      monthDropdown,
    };
    dispatch(showLoader(""));
    apiServices
      .GetTradedClient(payload)
      .then((response) => {
        if (response?.status === 200) {
          console.log("Responseee", response?.data?.data);
          dispatch(hideLoader());
          const rawData = response?.data?.data ?? [];
          const groupedData = {
            daily: filterAndFormat(rawData, "Daily"),
            weekly: filterAndFormat(rawData, "Weekly"),
            monthly: filterAndFormat(rawData, "Monthly"),
          };
          setChartSeries3({
            daily: groupedData.daily.map((item) => item.unqiue_Client_ID),
            weekly: groupedData.weekly.map((item) => item.unqiue_Client_ID),
            monthly: groupedData.monthly.map((item) => item.unqiue_Client_ID),
          });

          setTradeDates3({
            daily: groupedData.daily.map((item) => item.period),
            weekly: groupedData.weekly.map((item) => item.period),
            monthly: groupedData.monthly.map((item) => item.period),
          });
          console.log("GetTradedClientGrouupeedData", groupedData);
        }
      })
      .catch((Error) => {
        console.log("Error", Error);
        dispatch(hideLoader());
      });
  };

  const fetchRevenuePerTradedClientRecords = () => {
    const formatDate = (dateStr: string): string => {
      const dateObj = new Date(dateStr);
      const day = String(dateObj.getDate()).padStart(2, "0");
      const month = dateObj.toLocaleString("en-US", { month: "short" });
      const year = String(dateObj.getFullYear()).slice(-2);
      return `${day}-${month}-${year}`;
    };

    const sortByDate = (a: any, b: any) =>
      new Date(a.period).getTime() - new Date(b.period).getTime();

    const filterAndFormat = (data: any[], type: string): any[] => {
      return data
        .filter((item) => item.periodType === type)
        .sort(sortByDate)
        .map((item) => ({
          ...item,
          period: formatDate(item.period),
        }));
    };

    let payload = {
      user_Id: user_id,
      branch_Type: "direct",
      option_Type: "Rev_Traded_Client",
      monthDropdown,
    };
    dispatch(showLoader(""));
    apiServices
      .GetRevTradedClient(payload)
      .then((response) => {
        if (response?.status === 200) {
          console.log("Responseee", response?.data?.data);
          dispatch(hideLoader());
          const rawData = response?.data?.data ?? [];
          const groupedData = {
            daily: filterAndFormat(rawData, "Daily"),
            weekly: filterAndFormat(rawData, "Weekly"),
            monthly: filterAndFormat(rawData, "Monthly"),
          };
          setChartSeries4({
            daily: groupedData.daily.map((item) => item.revenue_Per_Client),
            weekly: groupedData.weekly.map((item) => item.revenue_Per_Client),
            monthly: groupedData.monthly.map((item) => item.revenue_Per_Client),
          });

          setTradeDates4({
            daily: groupedData.daily.map((item) => item.period),
            weekly: groupedData.weekly.map((item) => item.period),
            monthly: groupedData.monthly.map((item) => item.period),
          });
          console.log("GetTradedClientGrouupeedData", groupedData);
        }
      })
      .catch((Error) => {
        console.log("Error", Error);
        dispatch(hideLoader());
      });
  };

  const chartConfigs = [
    {
      title: "Total Broking Revenue",
      dynamic: true,
      source: "brokRevenue",
    },
    {
      title: "Total Trades Placed",
      dynamic: true,
      source: "tradePlaced",
    },
    {
      title: "Total Traded Clients",
      dynamic: true,
      source: "tradedClients",
    },
    {
      title: "Revenue per traded Clients",
      dynamic: true,
      source: "revenuePerTradedClients",
    },
  ];

  return (
    <div className="page-content">
      <Container fluid>
        <Row>
          <Col xl={12}>
            {chartConfigs.map((chart, index) => {
              const selectedView = selectedViews[index];
              const viewKeyMap: Record<
                ViewType,
                "daily" | "weekly" | "monthly"
              > = {
                Daily: "daily",
                Weekly: "weekly",
                Monthly: "monthly",
              };
              const seriesKey = viewKeyMap[selectedView];

              let directData: number[] = [];
              let tradeLabels: string[] = [];

              if (chart.dynamic) {
                if (chart.source === "brokRevenue") {
                  directData = chartSeries[seriesKey] || [];
                  tradeLabels = tradeDates[seriesKey] || [];
                } else if (chart.source === "tradePlaced") {
                  directData = chartSeries2[seriesKey] || [];
                  tradeLabels = tradeDates2[seriesKey] || [];
                } else if (chart.source === "tradedClients") {
                  directData = chartSeries3[seriesKey] || [];
                  tradeLabels = tradeDates3[seriesKey] || [];
                } else if (chart.source === "revenuePerTradedClients") {
                  directData = chartSeries4[seriesKey] || [];
                  tradeLabels = tradeDates4[seriesKey] || [];
                }
              } else {
                // directData = chart.directData || [];
                // tradeLabels = [];
              }

              return (
                <ChartCard
                  key={chart.title}
                  title={chart.title}
                  selectedView={selectedView}
                  viewOptions={["Daily", "Weekly", "Monthly"]}
                  setSelectedView={(view: any) => handleViewChange(index, view)}
                  directData={directData}
                  tradeDates={tradeLabels}
                />
              );
            })}
          </Col>
        </Row>

        <Card
          style={{
            minHeight: "80vh",
            borderRadius: "15px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          }}
        >
          <CardHeader
            style={{
              borderRadius: "15px 15px 0 0",
              boxShadow: "0 -4px 8px rgba(0, 0, 0, 0.15)",
              backgroundColor: "#fff",
              padding: "0.2rem 0.8rem",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h4 className="card-title mb-0">Top 10 Clients</h4>
              <FormControl
                variant="outlined"
                size="small"
                style={{ width: "220px" }}
              >
                <InputLabel id="month-dropdown-label">Select Month</InputLabel>
                <Select
                  labelId="month-dropdown-label"
                  id="monthDropdown"
                  name="monthDropdown"
                  value={formik.values.monthDropdown}
                  label="Select Monthsss"
                  onChange={(e) => {
                    formik.handleChange(e);
                    setSelectedMonth(e.target.value);
                  }}
                >
                  {monthYearOptions.map((month) => (
                    <MenuItem key={month} value={month}>
                      {month}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </CardHeader>
          <CardBody>
            <UserInfoTable
              activeSubItem={"RHDashboardTop10Clients"}
              T6Data={topClientsRecords}
            />
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default Direct;
