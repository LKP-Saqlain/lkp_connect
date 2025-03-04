import { Card, CardHeader, CardBody } from "reactstrap";
import { TextField, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import { InfoCapsules, information } from "../../../helper/tableColumns.tsx";

const RegisDetails = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <>
      {/* Business Dashboard Card */}
      <Card>
        <CardHeader style={{ backgroundColor: "#6C757D", color: "white" }}>
          <h4 className="card-title mb-0">Registration Details</h4>
        </CardHeader>
        <CardBody>
          {/* AP Name */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              marginBottom: "1rem",
            }}
          >
            <Typography style={{ marginRight: "8px" }}>AP Name :</Typography>
            <TextField variant="standard" sx={{ width: "60ch" }} />
          </div>

          {/* AP Registration Number */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              marginBottom: "1rem",
            }}
          >
            <Typography style={{ marginRight: "8px" }}>
              AP Registration Number :
            </Typography>
            <TextField variant="standard" sx={{ width: "48ch" }} />
          </div>

          {/* Date of Registration */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              marginBottom: "1rem",
            }}
          >
            <Typography style={{ marginRight: "8px" }}>
              Date of Registration :
            </Typography>
            <TextField variant="standard" sx={{ width: "52ch" }} />
          </div>

          {/* Registration Office */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              marginBottom: "1rem",
            }}
          >
            <Typography style={{ marginRight: "8px" }}>
              Registration Office :
            </Typography>
            <TextField variant="standard" sx={{ width: "53ch" }} />
          </div>
        </CardBody>
      </Card>

      {/* Segment Status Card */}
      <Card>
        <CardHeader style={{ backgroundColor: "#6C757D", color: "white" }}>
          <h4 className="card-title mb-0">Segment Status</h4>
        </CardHeader>
        <CardBody>
          {InfoCapsules.map((exchange) => (
            <div
              key={exchange.main}
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "40px",
                alignItems: "stretch",
                marginBottom: "20px",
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
                  padding: "10px 50px",
                  border: "1px solid gray",
                  display: "flex",
                  alignItems: "center",
                  fontSize: "20px",
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
                    width: !isMobile ? "120px" : "",
                    height: "60px",
                    padding: "10px",
                    border: "1px solid gray",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
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
                        fontSize: "12px",
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

      <Card>
        <CardHeader style={{ backgroundColor: "#6C757D", color: "white" }}>
          <h4 className="card-title mb-0">No. of Terminal: 2</h4>
        </CardHeader>
        <CardBody>
          <div
            style={{
              display: isMobile ? "" : "flex",
              justifyContent: "space-between",
            }}
          >
            {/* Terminal 1 Details */}
            <div style={{ width: isMobile ? "100%" : "48%" }}>
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
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader style={{ backgroundColor: "#6C757D", color: "white" }}>
          <h4 className="card-title mb-0">Revenue Share of AP - 70%</h4>
        </CardHeader>
        <CardBody>
          <div
            style={{
              display: isMobile ? "" : "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "10px",
              padding: isMobile ? "0" : "10px",
              fontFamily: "Public Sans",
            }}
          >
            {information.map((item) => (
              <span
                key={item.id}
                style={{
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.4)",
                  borderRadius: "23px",
                  height: "60px",
                  padding: "10px",
                  border: "1px solid gray",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: isMobile ? "24px" : "0",
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
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                    }}
                  ></span>
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
