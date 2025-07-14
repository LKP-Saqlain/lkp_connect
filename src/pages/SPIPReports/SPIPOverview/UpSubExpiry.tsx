// import { useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, CardBody, CardHeader } from "reactstrap";
import { AppDispatch, RootState } from "../../../redux/store";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { apiServices } from "../../../services";
import DataTable from "../../../components/common/UserInfoTable";

const UpSubExpiry = ({ handleTradingOpen }: any) => {
  const [report, setReport] = useState<any[]>([]);

  // const isMobile = useMediaQuery("(max-width:600px)");
  const dispatch = useDispatch<AppDispatch>();

  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );

  useEffect(() => {
    const userId = user_id.includes("-") ? user_id.split("-")[1] : user_id;
    console.log("userIdupco", userId);
    let payload = {
      branchCode: "1676", //1676
      clientCode: "",
      option: "",
    };

    dispatch(showLoader(""));
    apiServices
      .SPIPB2BClientDetails(payload)
      .then((response) => {
        console.log("Raw API Response -->", response);

        const data = response?.data?.data || [];

        const sortedResponse = data
          ?.filter((item: any) => item.expiryStatus === "A")
          .map((item: any, index: number) => ({
            ...item,
            id: index + 1,
          }))
          .sort((a: any, b: any) => {
            if (a.expiryStatus === "A" && b.expiryStatus !== "A") return -1;
            if (a.expiryStatus !== "A" && b.expiryStatus === "A") return 1;
            return 0;
          });

        console.log("sortedResponse -->", sortedResponse);
        setReport(sortedResponse);
      })

      .catch((error) => {
        dispatch(hideLoader());
        console.log("Error", error);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
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
        <Card
          className="main-card"
          style={{
            borderRadius: "15px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          }}
        >
          <CardHeader
            className="d-flex justify-content-between align-items-center"
            style={{
              borderRadius: "15px 15px 0 0", // round only top
              boxShadow: "0 -4px 8px rgba(0, 0, 0, 0.2)", // top-only shadow
              backgroundColor: "#fff", // optional
            }}
          >
            <h4 className="card-title mb-0">Upcoming Subscription Expiry</h4>{" "}
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
              onClick={() => handleTradingOpen("spipSubExpiry")}
            >
              View More
            </Button>
          </CardHeader>
          <CardBody
            className="main-card-body"
            style={{
              overflowX: "auto",
              //   overflowY: "hidden", // or "auto" if vertical scroll is needed
              maxHeight: `${
                report.length > 0 ? Math.min(report.length * 50 + 40, 250) : 200
              }px`,
              padding: "15px",
            }}
          >
            <DataTable
              T6Data={report}
              selectedWidget={"Client Details Report"}
              customHide={true}
            />
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default UpSubExpiry;
