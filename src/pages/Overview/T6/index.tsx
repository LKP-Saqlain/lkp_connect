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
  const dispatch = useDispatch();

  const isMobile = useMediaQuery("(max-width:768px)");

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
          // Sort the data: prioritize records with negative T4 or T5
          const sortedData = data.sort((a: any, b: any) => {
            const isANegative = a.T4 < 0 || a.T5 < 0 ? -1 : 1;
            const isBNegative = b.T4 < 0 || b.T5 < 0 ? -1 : 1;
            return isANegative - isBNegative;
          });

          // Get the first 5 records
          const top5Records = sortedData.slice(0, 5);

          // Store the top 5 records
          setT6Data(top5Records);

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
          flexDirection: isMobile ? "column" : "row",
          gap: "20px",
        }}
      >
        <Card style={{ flex: "1", minWidth: "300px" }}>
          <CardHeader>
            <h4 className="card-title mb-0">Top 5 T6 Clients</h4>
          </CardHeader>
          <CardBody>
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
            <Typography>Upcoming Dormant Client</Typography>
          </CardBody>
        </Card>
        <Card style={{ flex: "1", minWidth: "300px" }}>
          <CardHeader>
            <h4 className="card-title mb-0">Upcoming Birthday - Training</h4>
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
