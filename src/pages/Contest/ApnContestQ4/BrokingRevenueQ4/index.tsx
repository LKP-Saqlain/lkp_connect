import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import DashboardCard from "../../../../components/common/DashboardCard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../redux/store";
import { hideLoader, showLoader } from "../../../../redux/slices/loaderSlice";
import { apiServices } from "../../../../services";
import { useMediaQuery } from "rsuite/esm/useMediaQuery/useMediaQuery";
import theme from "../../../../theme";
import ShowToast from "../../../../utils/toastUtils";
import Chart from "react-apexcharts";

const ApContestSummaryCard = ({ isCustomRender, row }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [clientData, setClientData] = useState<any>(null);
  const [brokerageChartData, setBrokerageChartData] = useState<any[]>([]);
  const [uniqueClientChartData, setUniqueClientChartData] = useState<any[]>([]);
  const [summary, setSummary] = useState<any | null>(null);

  //  Format currency
  const formatIndianCurrency = (amount?: number) =>
    amount
      ? `₹${amount.toLocaleString("en-IN", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })}`
      : "-";

  //  Fetch Dashboard Data
  const fetchDashboardData = async () => {
    const payload = {
      user_id: isCustomRender ? `APN-${row?.apc}` : user_id,
      quarterPeriod: "Q4-2526",
    };

    try {
      dispatch(showLoader("Loading AP Contest Dashboard..."));
      const res = await apiServices.GetAPContestDashboard(payload);

      if (res?.data?.statusCode === 200) {
        const data = res.data.data;

        //  Summary cards
        setClientData(data.cdata || {});

        //  Brokerage chart data
        const brokerageData = (data.b15 || []).map((item: any) => ({
          date: new Date(item.td).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
          }),
          value: item.tgb,
        }));

        //  Unique traded clients chart data
        const uniqueData = (data.ucd || []).map((item: any) => ({
          date: new Date(item.td).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
          }),
          value: item.ttl,
        }));

        setBrokerageChartData(brokerageData);
        setUniqueClientChartData(uniqueData);
      } else {
        ShowToast("error", "No data found for AP Contest Dashboard.");
      }
    } catch (err) {
      console.error("Error fetching AP Contest Dashboard:", err);
      ShowToast("error", "Something went wrong while fetching dashboard data.");
    } finally {
      dispatch(hideLoader());
    }
  };
  const fetchApContestSummary = async () => {
    const payload = {
      user_id: isCustomRender ? `APN-${row?.apc}` : user_id,
      quarterPeriod: "Q4-2526",
    };

    try {
      dispatch(showLoader("Fetching contest summary..."));

      const res = await apiServices.GetAPContestAchievedSummary(payload);

      if (res?.status === 200 && res?.data?.data) {
        setSummary(res.data.data);
        console.log("GetAPContestAchievedSummary");
      } else {
        ShowToast("error", "Failed to fetch contest summary.");
        setSummary(null);
      }
    } catch (error) {
      console.error("Error fetching contest summary:", error);
      ShowToast("error", "Something went wrong while fetching data.");
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchApContestSummary();
  }, [user_id]);

  //  Common Bar Chart Config
  const getBarChartConfig = (
    data: any[],
    categoryKey: string,
    valueKey: string,
    color: string = "#F57C00",
    yAxisTitle: string = "Value",
    valuePrefix: string = "₹"
  ) => ({
    series: [
      {
        name: yAxisTitle,
        data: data.map((item) => item[valueKey]),
      },
    ],
    options: {
      chart: {
        type: "bar",
        toolbar: { show: false },
      },
      legend: {
        show: false,
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: false,
          distributed: true,
          columnWidth: "45%",
          dataLabels: {
            position: "top", // ✅ value above bar
          },
        },
      },

      dataLabels: {
        enabled: true, // ✅ show value above bar
        formatter: function (val: number) {
          return `${val.toLocaleString("en-IN", {
            maximumFractionDigits: 0,
          })}`;
        },
        offsetY: -20, // ✅ move value slightly above bar
        style: {
          fontSize: "11px",
          fontWeight: "bold",
          colors: ["#000"],
        },
      },
      xaxis: {
        categories: data.map((item) => item[categoryKey]),
        labels: {
          rotate: -45,
          style: { fontSize: "12px" },
        },
      },
      yaxis: {
        title: { text: yAxisTitle },
        labels: {
          formatter: (val: number) => val.toLocaleString("en-IN"),
        },
      },
      colors: [color],
      tooltip: {
        y: {
          formatter: (val: number) =>
            `${valuePrefix} ${Math.round(val).toLocaleString("en-IN")}`,
        },
      },
    },
  });

  //  Chart Configs
  const brokerageChartConfig = getBarChartConfig(
    brokerageChartData,
    "date",
    "value",
    "#F57C00",
    "Gross Brokerage (₹)"
  );

  const uniqueChartConfig = getBarChartConfig(
    uniqueClientChartData,
    "date",
    "value",
    "#F57C00",
    "Unique Traded Clients",
    ""
  );

  return (
    <div>
      {/*  Summary Cards */}
      <Row className="g-3 mt-1">
        {[
          {
            title: "Revenue Achieved*",
            value: formatIndianCurrency(summary?.bnlkp),
            note: isMobile
              ? "* Contest Period - 1st Oct to 31st Dec"
              : undefined,
          },
          { title: "Active Clients", value: clientData?.actc ?? "-" },
          {
            title: "Unique Traded Clients*",
            value: clientData?.utrc ?? "-",
          },
          {
            title: "New Accounts Added*",
            value: clientData?.naca ?? "-",
          },
          {
            title: "Upcoming Dormant Clients",
            value: clientData?.dcl ?? "-",
          },
        ].map((item, index) => (
          <Col key={index} xs={12} sm={6} md={4} lg={2}>
            <DashboardCard
              title={item.title}
              value={item.value}
              customClass
              note={item.note}
            />
          </Col>
        ))}
      </Row>

      {/*  Brokerage Chart */}
      <Card
        style={{
          borderRadius: "15px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          marginTop: "1rem",
        }}
      >
        <CardHeader
          className="align-items-center d-flex"
          style={{
            borderRadius: "15px 15px 0 0",
            backgroundColor: "#fff",
            boxShadow: "0 -4px 8px rgba(0, 0, 0, 0.15)",
          }}
        >
          <h4 className="card-title mb-2 mb-md-0 flex-grow-1 text-md-start text-center">
            Brokerage Details for Last 15 Days
          </h4>
        </CardHeader>
        <CardBody>
          <Chart
            options={brokerageChartConfig.options as any}
            series={brokerageChartConfig.series}
            type="bar"
            height={350}
          />
        </CardBody>
      </Card>

      {/*  Unique Clients Chart */}
      <Card
        style={{
          borderRadius: "15px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          marginTop: "1rem",
        }}
      >
        <CardHeader
          className="align-items-center d-flex"
          style={{
            borderRadius: "15px 15px 0 0",
            backgroundColor: "#fff",
            boxShadow: "0 -4px 8px rgba(0, 0, 0, 0.15)",
          }}
        >
          <h4 className="card-title mb-2 mb-md-0 flex-grow-1 text-md-start text-center">
            Unique Traded Clients for Last 15 Days
          </h4>
        </CardHeader>
        <CardBody>
          <Chart
            options={uniqueChartConfig.options as any}
            series={uniqueChartConfig.series}
            type="bar"
            height={350}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default ApContestSummaryCard;
