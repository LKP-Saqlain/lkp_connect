import { Card, CardHeader, CardBody } from "reactstrap";
import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import { InfoCapsules, information } from "../../../helper/tableColumns.tsx";
import DataTable from "../../../components/common/UserInfoTable";
import { apiServices } from "../../../services/index.ts";
import { useEffect, useState } from "react";

const RegisDetails = ({ activeSubItem }: any) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [apData, setApData] = useState<any>(null);

  useEffect(() => {
    const payload = {
      branchCode: "0413",
      // branchCode: "0248",
    };

    const GetAPDashboard = async () => {
      try {
        const response = await apiServices.GetAPDashboard(payload);
        console.log("response?.data", response?.data?.Table1);
        setApData(response?.data?.Table2);
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
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              margin: "5px 0",
            }}
          >
            <Typography style={{ marginRight: "8px" }}>AP Name :</Typography>
          </div>
          <hr
            style={{ backgroundColor: "black", margin: "0", height: "2px" }}
          />
          {/* hr after AP Name */}
          {/* AP Registration Number */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              margin: "5px 0",
            }}
          >
            <Typography style={{ marginRight: "8px" }}>
              AP Registration Number :
            </Typography>
          </div>
          <hr
            style={{ backgroundColor: "black", margin: "0", height: "2px" }}
          />{" "}
          {/* hr after AP Registration Number */}
          {/* Date of Registration */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              margin: "5px 0",
            }}
          >
            <Typography style={{ marginRight: "8px" }}>
              Date of Registration :
            </Typography>
          </div>
          <hr
            style={{ backgroundColor: "black", margin: "0", height: "2px" }}
          />{" "}
          {/* hr after Date of Registration */}
          {/* Registration Office */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              margin: "5px 0",
            }}
          >
            <Typography style={{ marginRight: "8px" }}>
              Registration Office :
            </Typography>
          </div>
          <hr
            style={{ backgroundColor: "black", margin: "0", height: "2px" }}
          />{" "}
          {/* hr after Registration Office */}
        </CardBody>
      </Card>

      {/* Segment Status Card */}
      <Card>
        <CardHeader>
          <h4 className="card-title mb-0">Segment Status</h4>
        </CardHeader>
        <CardBody>
          {InfoCapsules.map((exchange) => (
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

              {exchange.segments.map((segment) => (
                <span
                  key={segment.id}
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
                  {segment.label}
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
                          segment.status === "Active" ? "#01D28E" : "#ff0606",
                      }}
                    ></span>
                    <span
                      style={{
                        fontSize: "9px",
                        color: "gray",
                      }}
                    >
                      {segment.status}
                    </span>
                  </div>
                </span>
              ))}
            </div>
          ))}
        </CardBody>
      </Card>

      {/* Terminal Table Card */}
      <Card>
        <CardHeader>
          <h4 className="card-title mb-0">No. of Terminal: 2</h4>
        </CardHeader>
        <CardBody>
          <DataTable activeSubItem={activeSubItem} T6Data={apData} />
          {/* <div
            style={{
              display: isMobile ? "" : "flex",
              justifyContent: "space-between",
            }}
          > */}
          {/* Terminal 1 Details */}
          {/* <div style={{ width: isMobile ? "100%" : "48%" }}>
              <h4>Terminal 1 Details</h4>
              <div style={{ margin: "1rem 0" }}>
                <Typography style={{ marginBottom: "5px" }}>
                  Terminal Id:
                </Typography>
                <TextField variant="standard" fullWidth />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <Typography style={{ marginBottom: "5px" }}>
                  Terminal User:
                </Typography>
                <TextField variant="standard" fullWidth />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <Typography style={{ marginBottom: "5px" }}>
                  NISM Certificate No:
                </Typography>
                <TextField variant="standard" fullWidth />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <Typography style={{ marginBottom: "5px" }}>
                  NISM Certificate Valid till:
                </Typography>
                <TextField variant="standard" fullWidth />
              </div>
            </div>

            <div style={{ width: isMobile ? "100%" : "48%" }}>
              <h4>Terminal 2 Details</h4>
              <div style={{ margin: "1rem 0" }}>
                <Typography style={{ marginBottom: "5px" }}>
                  Terminal Id:
                </Typography>
                <TextField variant="standard" fullWidth />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <Typography style={{ marginBottom: "5px" }}>
                  Terminal User:
                </Typography>
                <TextField variant="standard" fullWidth />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <Typography style={{ marginBottom: "5px" }}>
                  NISM Certificate No:
                </Typography>
                <TextField variant="standard" fullWidth />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <Typography style={{ marginBottom: "5px" }}>
                  NISM Certificate Valid till:
                </Typography>
                <TextField variant="standard" fullWidth />
              </div>
            </div>
          </div> */}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h4 className="card-title mb-0">Revenue Share of AP - 70%</h4>
        </CardHeader>
        <CardBody>
          <div
            style={{
              display: isMobile ? "block" : "grid", // "block" for mobile, "grid" for larger screens
              gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", // 1 column for mobile, 3 for larger screens
              gap: isMobile ? "16px" : "10px", // Adjust gap for mobile
              padding: isMobile ? "0" : "10px", // Less padding for mobile
              fontFamily: "Public Sans",
            }}
          >
            {information.map((item) => (
              <span
                key={item.id}
                style={{
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.4)",
                  borderRadius: "23px",
                  height: "auto", // Allow height to be dynamic based on content
                  padding: "10px",
                  border: "1px solid gray",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: isMobile ? "24px" : "0", // Add bottom margin for mobile
                  fontSize: isMobile ? "14px" : "16px", // Adjust font size for mobile
                }}
              >
                {item.heading} - 70%
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
                    {item.info}
                  </span>
                </div>
              </span>
            ))}
          </div>
        </CardBody>
      </Card>
    </>
  );
};

export default RegisDetails;
