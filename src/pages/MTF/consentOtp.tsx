import { useEffect, useRef, useState } from "react";
import { Box, Button, Typography, TextField } from "@mui/material";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import Logo from "../../assets/logo.png";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { hideLoader, showLoader } from "../../redux/slices/loaderSlice";
import { apiServices } from "../../services";
import ShowToast from "../../utils/toastUtils";

const MTFOtpVerification = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<any>([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [resendVisible, setResendVisible] = useState(false);
  const navigate = useNavigate();

  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const clientDetails = useSelector(
    (state: RootState) => state.mtfClient.clientDetails,
  );

  console.log("ClientDetails12", clientDetails);

  const clientCode = location.search.replace("?", "");

  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data,
  );

  // Timer logic
  useEffect(() => {
    if (timeLeft === 0) {
      setResendVisible(true);
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // OTP input logic
  const handleChange = (value: any, index: any) => {
    if (!/^[0-9]?$/.test(value)) return; // allow only numbers

    setOtp((prev) => {
      const newOtp = [...prev];
      newOtp[index] = value;
      return newOtp;
    });

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleResend = () => {
    setOtp(["", "", "", "", "", ""]);
    setTimeLeft(60);
    setResendVisible(false);
    inputRefs.current[0].focus();

    const payload = {
      user_id: user_id,
      clientCode: clientCode,
    };
    dispatch(showLoader(""));
    apiServices
      .MTFSendOTP(payload)
      .then((res) => {
        if (res?.status === 200) {
          console.log("Resspon123", res?.data);
          ShowToast("success", res?.data?.message);
        }
      })
      .catch((error) => {
        console.log("Errror", error);
        dispatch(hideLoader());
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  const handleSubmit = () => {
    const enteredOtp = otp.join("");
    console.log("OTP Submitted:", typeof enteredOtp);
    const payload = {
      user_id: user_id,
      clientCode: clientCode,
      otp: enteredOtp,
    };
    dispatch(showLoader(""));
    apiServices
      .MTFVerifyOTP(payload)
      .then((res) => {
        console.log("Response--->", res);

        if (res?.status === 200) {
          console.log("Resss123", res?.data?.data);
          ShowToast("success", res?.data?.message);
          navigate("/congratulations");
        }
        if (res?.status === 502) {
          ShowToast("error", res?.data?.message);
        }
      })
      .catch((error) => {
        console.log("Errror", error?.response?.data?.message);
        ShowToast("error", error?.response?.data?.message);
        dispatch(hideLoader());
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };
  const handleBackspace = (e: any, index: any) => {
    if (e.key === "Backspace") {
      if (otp[index] === "") {
        if (index > 0) {
          inputRefs.current[index - 1]?.focus();
          setOtp((prev) => {
            const newOtp = [...prev];
            newOtp[index - 1] = "";
            return newOtp;
          });
        }
      } else {
        setOtp((prev) => {
          const newOtp = [...prev];
          newOtp[index] = "";
          return newOtp;
        });
      }
    }
  };

  const isOtpComplete = otp.every((digit) => digit !== "");
  const maskedMobile = clientDetails?.mob
    ? `XXXXX${clientDetails.mob.slice(-4)}`
    : "";

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
                  <Typography
                    sx={{
                      fontSize: "24px",
                      fontWeight: 900,
                      color: "#01396B",
                      mb: 1,
                    }}
                  >
                    Client Consent by OTP for MTF
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: "16px",
                      fontWeight: 900,
                      color: "#01396B",
                      mb: 2,
                    }}
                  >
                    Enter OTP
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#555",
                      mb: 4,
                    }}
                  >
                    OTP sent to Client Registered mobile number– {maskedMobile}{" "}
                    & <br />
                    Email ID– {clientDetails?.mail} to confirm MTF.
                  </Typography>

                  {/* OTP Inputs */}
                  <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                    {otp.map((digit, index) => (
                      <TextField
                        key={index}
                        value={digit}
                        variant="standard"
                        inputRef={(el) => (inputRefs.current[index] = el)}
                        onChange={(e) => handleChange(e.target.value, index)}
                        onKeyDown={(e) => handleBackspace(e, index)}
                        autoComplete="one-time-code"
                        inputMode="numeric"
                        sx={{
                          width: "50px",
                          "& input": {
                            textAlign: "center",
                            fontSize: "20px",
                            padding: "6px 0",
                          },
                        }}
                      />
                    ))}
                  </Box>

                  {/* Proceed Button */}
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={!isOtpComplete}
                    sx={{
                      backgroundColor: "#01396B",
                      width: "260px",
                      textTransform: "none",
                      py: 1,
                      fontWeight: 500,
                      borderRadius: "8px",
                    }}
                  >
                    Proceed
                  </Button>

                  {/* Timer / Resend OTP */}
                  <Box sx={{ fontSize: "13px", color: "#666" }}>
                    {!resendVisible ? (
                      <>
                        Resend OTP in <b>{timeLeft}</b> seconds
                      </>
                    ) : (
                      <Button
                        onClick={handleResend}
                        sx={{
                          textTransform: "none",
                          fontSize: "14px",
                          color: "black",
                          fontWeight: 600,
                        }}
                      >
                        Resend OTP
                      </Button>
                    )}
                  </Box>
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
