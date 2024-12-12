import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader } from "reactstrap";
import { useDispatch } from "react-redux";
// import Widgets from "./Widgets";
// import TradeCapsule from "./TradeCapsules";
import TradeInfo from "../../../components/common/UserInfoTable";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
import { apiServices } from "../../../services";
import { Typography } from "@mui/material";
import { useMediaQuery } from "@mui/material";
import "../style.css";
import ShowToast from "../../../utils/toastUtils";

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

const T6Table = () => {
  const [t6Data, setT6Data] = useState<T6Selling[]>([]);
  const [
    upcomingOverviewDormantTableData,
    setUpcomingOverviewDormantTableData,
  ] = useState<[]>([]);
  const dispatch = useDispatch();

  const isMobile = useMediaQuery("(max-width:768px)");

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
            .filter((item: any) => item.dayCount === 0)
            .slice(0, 5);
          console.log("filterData", filterRecords);
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
      const Id = localStorage.getItem("Id");
      const payload = {
        user_id: Id,
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
          const filteredRecords = top5Records.filter(
            (record: any) => record.T5 !== 0
          );

          console.log("Filtered Records", filteredRecords);

          // Store the filtered records
          setT6Data(filteredRecords);
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
          flexDirection: isMobile ? "column" : "row",
          gap: "20px",
        }}
      >
        <Card style={{ flex: "1", minWidth: "300px" }}>
          <CardHeader>
            <h4 className="card-title mb-0">Top 5 T6 Clients</h4>
          </CardHeader>
          <CardBody style={{ height: "250px", overflow: "hidden" }}>
            <TradeInfo
              T6Data={t6Data}
              selectedWidget={"T6Overview"}
              customHide={true}
            />
          </CardBody>
        </Card>
        <Card style={{ flex: "1", minWidth: "300px" }}>
          <CardHeader>
            <h4 className="card-title mb-0">Upcoming Dormant Client</h4>
          </CardHeader>
          <CardBody>
            {/* <Typography>Upcoming Dormant Client</Typography> */}
            <TradeInfo
              T6Data={upcomingOverviewDormantTableData}
              selectedWidget={"dormantOverview"}
              customHide={true}
            />
          </CardBody>
        </Card>
        <Card style={{ flex: "1", minWidth: "300px" }}>
          <CardHeader>
            <h4 className="card-title mb-0">Upcoming Client Birthday</h4>
          </CardHeader>
          <CardBody>
            <Typography>Happy Birthday</Typography>
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default T6Table;
