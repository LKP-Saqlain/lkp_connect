import { Card, CardHeader, CardBody } from "reactstrap";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import { InfoCapsules } from "../../../helper/tableColumns.tsx";
import DataTable from "../../../components/common/UserInfoTable";
import { apiServices } from "../../../services/index.ts";
import { useEffect, useState } from "react";
import { RootState } from "../../../redux/store.ts";
import { useSelector } from "react-redux";

const RegisDetails = ({ activeSubItem }: any) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [apTerminalData, setApTerminalData] = useState<any>(null);
  const [apRegisData, setApRegisData] = useState<any>(null);
  const [apSegData, setApSegData] = useState<any>(null);
  const [apCapData, setApCapData] = useState<any>(null);
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );

  const rawCode = user_id;

  const apcode = rawCode.replace(/^AP\w-/, "AP");

  useEffect(() => {
    const payload = {
      branchCode: apcode,
      // branchCode: "AP7161",
    };

    const GetAPDashboard = async () => {
      try {
        const response = await apiServices.GetAPDashboard(payload);

        if (response?.data) {
          setApRegisData(response?.data?.Table || []);
          setApSegData(response?.data?.Table1 || []);
          setApTerminalData(response?.data?.Table2 || []);
          setApCapData(response?.data?.Table3 || []);
        } else {
          console.error("No data found in the response.");
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    GetAPDashboard();
  }, [activeSubItem]);

  return (
    <>
      {/* Business Dashboard Card */}
      <Card>
        <CardHeader>
          <h4 className="card-title mb-0">Registration Details</h4>
        </CardHeader>
        <CardBody style={{ fontFamily: "Public Sans" }}>
          {/* AP Name */}
          <DataTable
            activeSubItem={"Registration Table"}
            T6Data={apRegisData}
          />
        </CardBody>
      </Card>

      {/* Segment Status Card */}
      <Card>
        <CardHeader>
          <h4 className="card-title mb-0">Segment Status</h4>
        </CardHeader>
        <CardBody>
          {apSegData ? (
            InfoCapsules.map((exchange) => (
              <div
                key={exchange.main}
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "14px",
                  alignItems: "stretch",
                  marginBottom: "10px",
                  flexDirection: isMobile ? "column" : "row",
                  fontFamily: "Public Sans",
                }}
              >
                {/* Exchange Name (e.g., NSE, BSE) */}
                <span
                  style={{
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
                    backgroundColor: "#11395C",
                    borderRadius: "23px",
                    color: "white",
                    padding: "5px 25px",
                    border: "1px solid gray",
                    display: "flex",
                    alignItems: "center",
                    fontSize: "14px",
                    fontFamily: "Public Sans, sans-serif",
                    fontWeight: 900,
                    justifyContent: "center",
                  }}
                >
                  {exchange.main}
                </span>

                {apSegData
                  .filter((segment: any) => segment.Exchange === exchange.main)
                  .map((segment: any) => (
                    <span
                      key={segment.RowId}
                      style={{
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.4)",
                        borderRadius: "23px",
                        width: !isMobile ? "100px" : "",
                        height: "40px",
                        padding: "1px",
                        border: "1px solid gray",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "14px",
                      }}
                    >
                      {segment.Segment}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <span
                          style={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            backgroundColor:
                              segment.ActiveStatus === "Active"
                                ? "#01D28E"
                                : "#ff0606",
                          }}
                        ></span>
                        <span style={{ fontSize: "9px", color: "gray" }}>
                          {segment.ActiveStatus}
                        </span>
                      </div>
                    </span>
                  ))}
              </div>
            ))
          ) : (
            <div>Loading...</div> // Or a spinner or any other placeholder
          )}
        </CardBody>
      </Card>

      {/* Terminal Table Card */}
      <Card>
        <CardHeader>
          <h4 className="card-title mb-0">No. of Terminal</h4>
        </CardHeader>
        <CardBody>
          <DataTable activeSubItem={"Terminal"} T6Data={apTerminalData} />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h4 className="card-title mb-0">Revenue Share of AP</h4>
        </CardHeader>
        <CardBody>
          <div
            style={{
              display: isMobile ? "block" : "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
              gap: isMobile ? "16px" : "10px",
              padding: isMobile ? "0" : "10px",
              fontFamily: "Public Sans",
            }}
          >
            {apCapData && apCapData.length > 0 ? (
              apCapData.map((item: any) => {
                const percentage =
                  item.Delivery_Per ||
                  item.Future_Per ||
                  item.Option_per ||
                  item.Trading_per;

                const validPercentage =
                  percentage && percentage !== 0 ? percentage : null;

                return (
                  validPercentage && (
                    <span
                      key={item["Company Code"]}
                      style={{
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.4)",
                        borderRadius: "23px",
                        height: "auto",
                        padding: "10px",
                        border: "1px solid gray",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: isMobile ? "24px" : "0",
                        fontSize: isMobile ? "14px" : "16px",
                      }}
                    >
                      {item["Company Code"]} - {validPercentage}%
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "12px",
                            color: "gray",
                          }}
                        >
                          (Subject to Minimum Retention of 0.5% of turnover)
                        </span>
                      </div>
                    </span>
                  )
                );
              })
            ) : (
              <div>No data available</div>
            )}
          </div>
        </CardBody>
      </Card>
    </>
  );
};

export default RegisDetails;
