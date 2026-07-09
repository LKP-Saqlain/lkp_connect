import { Box, Button, Typography } from "@mui/material";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import Logo from "../../assets/LKP Logo (Light Theme).svg";
import CongratsIcon from "../../assets/images/congratsIcon.png";
import { useNavigate } from "react-router-dom";

const MTFOtpVerification = () => {
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate("/dashboard");
  };

  return (
    <div className="page-content page-view">
      <div className="container-fluid">
        <Row className="row-font">
          <Col style={{ marginLeft: "10px" }}>
            <Card
              style={{
                minHeight: "85vh",
                borderRadius: "20px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                margin: "1rem .5rem",
              }}
            >
              <CardHeader
                style={{
                  borderRadius: "20px 20px 0 0",
                  boxShadow: "0 -4px 8px rgba(0, 0, 0, 0.15)",
                  backgroundColor: "rgb(238, 238, 238)",
                  padding: "0.5rem 1rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <h4
                    className="mb-0"
                    style={{
                      color: "#01396B",
                      fontSize: "22px",
                      fontWeight: "bold",
                    }}
                  >
                    Margin Trading Facility
                  </h4>
                </Box>

                <img
                  src={Logo}
                  alt="Logo"
                  style={{ height: "50px", margin: ".2rem" }}
                />
              </CardHeader>
              <CardBody
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    minHeight: "78vh",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <Box
                    component="img"
                    alt="Logo"
                    src={CongratsIcon}
                    width={"auto"}
                    height="100px"
                    // sx={{
                    //   position: "absolute",
                    //   top: 10, // Adjust as needed
                    //   right: 26, // Adjust as needed
                    //   zIndex: 10, // Ensures it appears above other elements
                    //   // border: "4px solid red",
                    // }}
                  />
                  <Typography
                    sx={{
                      fontSize: "24px",
                      fontWeight: 900,
                      color: "#01396B",
                      mb: 1,
                    }}
                  >
                    MTF Segment <br></br> has been activated
                  </Typography>

                  {/* Proceed Button */}
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    sx={{
                      backgroundColor: "#01396B",
                      width: "260px",
                      textTransform: "none",
                      py: 1,
                      fontWeight: 500,
                      borderRadius: "8px",
                    }}
                  >
                    Done
                  </Button>
                </Box>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default MTFOtpVerification;
