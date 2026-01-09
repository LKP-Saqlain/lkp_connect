import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Container,
  Label,
  Input,
  CardHeader,
} from "reactstrap";
import Chart from "react-apexcharts";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../redux/store";
import { hideLoader, showLoader } from "../../../../redux/slices/loaderSlice";
import { apiServices } from "../../../../services";
import ShowToast from "../../../../utils/toastUtils";
import UserInfoTable from "../../../../components/common/UserInfoTable";

// 📅 Month options
const months = [
  { label: "ALL", value: 13 },
  //   { label: "Jan-2026", value: 1 },
  //   { label: "February", value: 2 },
  //   { label: "March", value: 3 },
  //   { label: "April", value: 4 },
  //   { label: "May", value: 5 },
  //   { label: "June", value: 6 },
  //   { label: "July", value: 7 },
  //   { label: "August", value: 8 },
  //   { label: "September", value: 9 },
  { label: "Oct-2025", value: 10 },
  { label: "Nov-2025", value: 11 },
  { label: "Dec-2025", value: 12 },
];

const TopClientBrokerage = ({ isCustomRender, row }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );

  const [brokerageData, setBrokerageData] = useState<any[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1
  );

  const [userData, setUserData] = useState<any[]>([]);

  const fetchTopClients = async () => {
    const payload = {
      //   user_id: "APN-7161", // you can replace this with your logged-in user_id
      user_id: isCustomRender ? `APN-${row?.apCode}` : user_id,
      periodType: selectedMonth === 13 ? "ALL" : "MONTH",
      year: 2025,
      month: selectedMonth,
      quarterPeriod: "Q4-2526",
    };

    try {
      dispatch(showLoader("Fetching top clients..."));
      const res = await apiServices.GetAPTop10ClientBrokerage(payload);
      if (res?.status === 200 && Array.isArray(res?.data?.data)) {
        const apiData = res?.data?.data || [];

        const updatedList = apiData.map((item: any, index: number) => ({
          Id: index + 1,
          ...item,
        }));
        setBrokerageData(updatedList);
      } else {
        ShowToast("error", "No data found for this period.");
        console.log(res?.data?.data);

        setBrokerageData([]);
      }
    } catch (err) {
      console.error("Error fetching client data:", err);
      ShowToast("error", "Something went wrong while fetching data.");
    } finally {
      dispatch(hideLoader());
    }
  };

  const fetchAPachievedBrokerage = () => {
    let payload = {
      user_id: isCustomRender ? `APN-${row?.apCode}` : user_id,
      quarterPeriod: "Q4-2526",
    };
    dispatch(showLoader(""));

    apiServices
      .GetAPContestAchievedBrokerage(payload)
      .then((response) => {
        if (response?.status === 200) {
          dispatch(hideLoader());
          console.log("ResponseAPContest", response?.data);
          setUserData(
            response?.data?.data?.map((item: any, index: number) => ({
              ...item,
              Id: index,
            }))
          );
          console.log(userData);
        }
      })
      .catch((error) => {
        console.log("Errror", error);
      });
  };

  useEffect(() => {
    fetchTopClients();
  }, [selectedMonth]);
  useEffect(() => {
    fetchAPachievedBrokerage();
  }, []);

  //  Prepare Apex chart data
  const chartOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
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
    legend: {
      show: false, // ✅ hide duplicate legend
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
      categories: brokerageData.map((item) => item.cn), // ✅ show client name on x-axis
      labels: {
        style: {
          fontSize: "11px",
          fontWeight: 600,
        },
        rotate: -45, // optional: tilt for readability
      },
    },
    yaxis: {
      title: { text: "Gross Brokerage (₹)" },
      labels: {
        formatter: (val: number) => val.toLocaleString("en-IN"),
      },
    },
    colors: ["#F57C00"],
    tooltip: {
      custom: function ({ dataPointIndex }: any) {
        const client = brokerageData[dataPointIndex];
        return `
          <div style="padding:8px; font-size:12px;">
            <strong>${client.fcn}</strong><br/>
            <span style="color:#777">Code:</span> ${client.cc}<br/>
            <span style="color:#777">Gross Brokerage:</span> ₹${client.gb.toLocaleString(
              "en-IN",
              {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }
            )}

          </div>
        `;
      },
    },
    series: [
      {
        name: "Gross Brokerage",
        data: brokerageData.map((item) => item.gb),
      },
    ],
  };

  const chartSeries = [
    {
      name: "Gross Brokerage",
      data: brokerageData.map((item) => item.gb),
    },
  ];

  return (
    <div className="page-content">
      <Container fluid>
        <Card
          style={{
            borderRadius: "15px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
            marginBottom: "1.5rem",
          }}
        >
          <CardHeader
            style={{
              borderRadius: "15px 15px 0 0",
              boxShadow: "0 -4px 8px rgba(0, 0, 0, 0.15)",
              backgroundColor: "#fff",
              padding: "0.5rem 0.8rem",
            }}
          >
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
              <h4 className="card-title mb-0">
                Top 10 Clients by Brokerage{" "}
                {/* <span style={{ fontSize: "12px" }}>
                  ({months.find((m) => m.value === selectedMonth)?.label}{" "}
                  {selectedYear})
                </span> */}
              </h4>

              <div className="d-flex gap-2 align-items-center">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Label for="monthSelect" className="form-label m-2">
                    Month:
                  </Label>
                  <Input
                    type="select"
                    id="monthSelect"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    style={{ width: "140px" }}
                  >
                    {months.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </Input>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardBody>
            <Chart
              options={chartOptions as any}
              series={chartSeries}
              type="bar"
              height={400}
            />
          </CardBody>
        </Card>

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
            <h4 className="card-title mb-0">
              AP Contest Achieved Brokerage{" "}
              <span style={{ fontSize: "12px" }}>(October–December)</span>
            </h4>
          </CardHeader>
          <CardBody>
            <UserInfoTable
              T6Data={userData}
              activeMenu={"AP Contest Achieved Brokerage"}
            />
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default TopClientBrokerage;
