import { useEffect, useState } from "react";
import { Button, Card, CardBody, CardHeader } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
// import Widgets from "./Widgets";
// import TradeCapsule from "./TradeCapsules";
import TradeInfo from "../../../../components/common/UserInfoTable";
import { showLoader, hideLoader } from "../../../../redux/slices/loaderSlice";
import { apiServices } from "../../../../services";
// import { useMediaQuery } from "@mui/material";
import "../style.css";
import ShowToast from "../../../../utils/toastUtils";
import { AppDispatch, RootState } from "../../../../redux/store";

interface T6Selling {
  ClientCode: string;
  ClientName: string;
  ClosingBal: string;
  T1: string;
  T2: string;
  T3: string;
  T4: string;
  T5: string;
  G5: string;
  StockValue: string;
}

const T6Table = ({ handleTradingOpen }: any) => {
  const [t6Data, setT6Data] = useState<T6Selling[]>([]);
  const [
    upcomingOverviewDormantTableData,
    setUpcomingOverviewDormantTableData,
  ] = useState<[]>([]);
  // const [top5Birthdays, setTop5Birthdays] = useState<[]>([]);
  const dispatch = useDispatch<AppDispatch>();

  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );

  // const isMobile = useMediaQuery("(max-width:768px)");

  // useEffect(() => {
  //   console.log(top5Birthdays);
  //   const Id = localStorage.getItem("Id");
  //   let payload = {
  //     user_id: Id,
  //   };
  //   apiServices
  //     .GetBirthdayList(payload)
  //     .then((response) => {
  //       console.log("GetBirthdayCountresponse", response?.status);
  //       if (response?.status === 200) {
  //         const data = response?.data || [];

  //         const filterRecords = data.slice(0, 5);
  //         console.log("filterData", filterRecords);
  //         setTop5Birthdays(filterRecords);
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, []);

  useEffect(() => {
    const Id = localStorage.getItem("Id");
    setUpcomingOverviewDormantTableData([]); // Clear existing data before fetching new data
    const payload = {
      start: 0,
      pageSize: 5000,
      searchKey: "",
      loginName: Id,
      zone: "ALL",
      branchCode: "ALL",
      clientStatus: "ALL",
    };

    dispatch(showLoader("")); // Show loader while fetching data

    apiServices
      .getUpcompingDormantReport(payload)
      .then((response) => {
        console.log("API Response:", response?.data);
        if (response?.status === 200) {
          const data = response?.data || [];

          const filterRecords = data
            .filter((item: any) => item.dayCount)
            .slice(0, 5);
          console.log("DormantfilterData", filterRecords);
          setUpcomingOverviewDormantTableData(filterRecords);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        if (error.status === 400) {
          ShowToast("error", error?.response?.data?.message);
        } else {
          const zoneError = error.response.data.errors.Zone?.[0];
          const branchCodeError = error.response.data.errors.BranchCode?.[0];
          ShowToast("error", zoneError || "Unknown zone error");
          ShowToast("error", branchCodeError || "Unknown branch code error");
        }
      })
      .finally(() => {
        dispatch(hideLoader()); // Hide loader after fetching
      });
  }, []);

  useEffect(() => {
    const fetchClientCash = async () => {
      // const Id = localStorage.getItem("Id");
      const payload = {
        user_id: user_id,
      };
      try {
        dispatch(showLoader(""));
        const response = await apiServices.T6Selling(payload);
        console.log("T6SellingResponse", response?.data?.data?.Table);
        if (response?.status === 200) {
          dispatch(hideLoader());
          // Get the data from the API response
          const data = response?.data?.data?.Table;
          // Sort the data: prioritize records with lower T5 values
          const sortedData = data.sort((a: any, b: any) => a.T5 - b.T5);

          // Get the first 5 records
          const top5Records = sortedData.slice(0, 5);

          // Remove records with T5 value of 0
          // const filteredRecords = top5Records.filter(
          //   (record: any) => record.T5 !== 0
          // );

          // console.log("Filtered Records", filteredRecords);

          // Store the filtered records
          setT6Data(top5Records);
        }
      } catch (error) {
        // console.error("Error->", error);
        dispatch(hideLoader());
        // console.error("Error fetching T6 data:", error?.response || error?.message || error);
      }
    };

    fetchClientCash(); // Call the async function
  }, [dispatch]);

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column", // Stack all cards vertically
          // gap: "20px", // Space between cards
          height: "auto", // Adjust to content height
        }}
      >
        <Card className="main-card">
          <CardHeader
            className="d-flex justify-content-between align-items-center"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h4 className="card-title mb-0">Top 5 Clients Ageing Report</h4>{" "}
            <Button
              style={{
                height: "25px",
                width: "80px",
                borderRadius: "5px",
                fontSize: "12px",
                padding: "0",
                fontFamily: "Public Sans",
                backgroundColor: "#11395C",
              }}
              className="btn-sm"
              onClick={() => handleTradingOpen("T6")}
            >
              View More
            </Button>
          </CardHeader>
          <CardBody
            className="main-card-body"
            style={{
              overflow: "hidden",
              height: `${
                t6Data.length > 0 ? Math.min(t6Data.length * 50 + 40, 250) : 200 // Minimum height when data is empty
              }px`,
              padding: "10px",
            }}
          >
            <TradeInfo
              T6Data={t6Data}
              selectedWidget={"T6Overview"}
              customHide={true}
            />
          </CardBody>
        </Card>
        <Card className="main-card">
          <CardHeader
            className="d-flex justify-content-between align-items-center"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h4 className="card-title mb-0">Upcoming Dormant Client</h4>
            <Button
              style={{
                height: "25px",
                width: "80px",
                borderRadius: "5px",
                fontSize: "12px",
                padding: "0",
                fontFamily: "Public Sans",
                backgroundColor: "#11395C",
              }}
              className="btn-sm"
              onClick={() => handleTradingOpen("Dormant")}
            >
              View More
            </Button>
          </CardHeader>
          <CardBody
            className="main-card-body"
            style={{
              overflow: "hidden",
              height: `${
                upcomingOverviewDormantTableData.length > 0
                  ? Math.min(
                      upcomingOverviewDormantTableData.length * 50 + 40,
                      250
                    )
                  : 450 // Minimum height when data is empty
              }px`,
              padding: "10px",
            }}
          >
            <TradeInfo
              T6Data={upcomingOverviewDormantTableData}
              selectedWidget={"dormantOverview"}
              customHide={true}
            />
          </CardBody>
        </Card>
        {/* <Card className="main-card">
          <CardHeader>
            <h4 className="card-title mb-0">Client's Birthday Today</h4>
          </CardHeader>
          <CardBody
            className="main-card-body"
            style={{ overflow: "hidden", height: "250px", padding: "10px" }}
          >
            <TradeInfo
              T6Data={top5Birthdays}
              selectedWidget={"clientBirthday"}
              customHide={true}
            />
          </CardBody>
        </Card> */}
      </div>
    </>
  );
};

export default T6Table;
