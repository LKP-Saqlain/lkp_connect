import React, { CSSProperties, useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  useMediaQuery,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Grid2,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
// import Banner from "../../../assets/banner.png";
import LeftArm from "../../../assets/images/leftArm.png";
import Vector from "../../../assets/vector.png";
import { useTheme } from "@mui/material/styles";
import { FaRegUserCircle } from "react-icons/fa";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { RiLockPasswordFill } from "react-icons/ri";
import "dayjs/locale/en-gb";
import { useDispatch } from "react-redux";
import { regEx } from "../../../helper/method";
// import { apiServices } from "../../../services/index";
import ShowToast from "../../../utils/toastUtils";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../../../redux/store";
import {
  SendOtp,
  ForgotUserPassword,
} from "../../../redux/thunk/ForgotPassword";
import Logo from "../../../assets/logo.png";
import "./style.css";

const ForgotPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);
  // const [showOtp, setShowOtp] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const formStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  };

  // Form validation schema using Yup
  const validationSchema = Yup.object({
    userId: Yup.string()
      .required("UserId is required")
      .min(4, "user ID must be at least 4 characters"),
    otp: Yup.string()
      .required("OTP is required")
      .min(4, "OTP must be at least 4 characters"),
    password: Yup.string().required("Password is required"),
    confirmPassword: Yup.string().required("Confirm Password is required"),
  });

  // Initialize Formik
  const formik = useFormik({
    initialValues: {
      userId: "",
      otp: "",
      password: "",
      confirmPassword: "",
      forgotButtonGroup: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log("Form Data:", values);
      // Handle login logic here
      handleResetPassword();
    },
  });
  // const handleToggleOTPVisibility = () => {
  //   setShowOtp((prev) => !prev);
  // };
  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleToggleShowPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const customHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log("name->", name, "value->", value);

    if (name === "userId") {
      setShowOtpField(false);
      if (regEx.alphaNumeric.test(value)) {
        formik.setFieldValue(name, value.toUpperCase().replace(/\s/g, ""));
      }
    } else if (name === "otp") {
      if (regEx.number.test(value)) {
        formik.setFieldValue(name, value.replace(/\s/g, ""));
      }
    } else if (name === "password") {
      // if (regEx.alphaNumeric.test(value)) {
      formik.setFieldValue(name, value.replace(/\s/g, ""));
      // }
    } else if (name === "confirmPassword") {
      // if (regEx.alphaNumeric.test(value)) {
      formik.setFieldValue(name, value.replace(/\s/g, ""));
      // }
    } else {
      formik.handleChange(e);
    }
  };

  const handleSentOtp = async () => {
    formik.setTouched({ userId: true }, true);
    await formik.validateField("userId");
    if (formik.values.userId.length < 4) {
      return;
    } else {
      let payload = {
        otp_type: "SendOtp",
        user_id: formik.values.userId,
        user_type: formik.values.forgotButtonGroup,
        sender_type: "E,S",
      };
      dispatch(showLoader(""));
      dispatch(SendOtp(payload))
        .unwrap()
        .then((response) => {
          console.log("Response", response);
          if (response?.status === 200) {
            dispatch(hideLoader());
            ShowToast("success", response?.data?.message);
            setShowOtpField(true);
          }
        })
        .catch((error) => {
          const { message } = error;
          console.log("Error->", message);
          dispatch(hideLoader());
          ShowToast(
            "error",
            message ||
              "Sorry for the inconvenience, please try after some time."
          );
        })
        .finally(() => {
          dispatch(hideLoader());
        });
    }
  };

  const handleResetPassword = async () => {
    let payload = {
      user_type: formik.values.forgotButtonGroup,
      user_id: formik.values.userId,
      user_password: formik.values.password,
      confirm_password: formik.values.confirmPassword,
      otp: formik.values.otp,
    };
    dispatch(showLoader(""));
    dispatch(ForgotUserPassword(payload))
      .unwrap()
      .then((response) => {
        console.log("Response-->", response);
        if (response?.status === 200) {
          dispatch(hideLoader());
          ShowToast("success", response?.data?.message);
          setShowOtpField(true);
          navigate("/");
        }
      })
      .catch((error) => {
        const { message } = error;
        console.log("Error->", message);
        dispatch(hideLoader());
        ShowToast(
          "error",
          message || "Sorry for the inconvenience, please try after some time."
        );
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  useEffect(() => {
    console.log("formikValues->", formik.values);
  }, [formik.values]);

  const handlePageClick = () => {
    console.log("eventhandlePageClick");
    navigate("/");
  };

  return (
    <>
      <Box
        sx={{
          position: "relative", // Allows absolute positioning of the logo
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <Box
          component="img"
          alt="Logo"
          src={Logo}
          width={"auto"}
          height="50px"
          sx={{
            position: "absolute",
            top: 10, // Adjust as needed
            right: 26, // Adjust as needed
            zIndex: 10, // Ensures it appears above other elements
            // border: "4px solid red",
          }}
        />
        <Box
          component="img"
          src={LeftArm}
          alt="LeftArm"
          sx={{
            width: isMobile ? "100%" : "50%",
            borderRadius: "4px",
            marginBottom: isMobile ? 2 : 0,
            // border: "1px solid black",
            backgroundImage: `url(${Vector})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right",
            // backgroundSize: "740px 900px",
            height: "100vh",
          }}
        />
        {/* Right side - Text fields */}
        <Box
          sx={{
            width: isMobile ? "100%" : "50%",
            padding: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: 600,
              color: "#11395C",
              fontFamily: "Public Sans",
            }}
          >
            Forgot Password
          </Typography>
          <Typography
            gutterBottom
            sx={{
              fontWeight: 600,
              color: "#11395C",
              mb: 4,
              fontFamily: "Public Sans",
            }}
          >
            {" "}
            Don't worry! We will reset your Password in few seconds
          </Typography>
          <FormControl
            sx={{
              marginBottom: "6px",
            }}
          >
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="forgotButtonGroup"
              // onChange={customHandleChange}
            >
              <FormControlLabel
                value="Partner"
                control={
                  <Radio
                    onChange={customHandleChange}
                    sx={{
                      "&.Mui-checked": {
                        color: "#11395C",
                      },
                    }}
                  />
                }
                label="Partner"
              />
              <FormControlLabel
                value="Employee"
                control={
                  <Radio
                    onChange={customHandleChange}
                    sx={{
                      "&.Mui-checked": {
                        color: "#11395C",
                      },
                    }}
                  />
                }
                label="Employee"
              />
            </RadioGroup>
          </FormControl>
          <form
            style={isMobile ? {} : formStyle}
            onSubmit={formik.handleSubmit}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                width: isMobile ? "100%" : "400px",
                marginBottom: 2,
              }}
            >
              <TextField
                label="User ID"
                placeholder="Please enter User ID"
                variant="outlined"
                size="small"
                name="userId"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaRegUserCircle />
                    </InputAdornment>
                  ),
                }}
                inputProps={{
                  maxLength: 12,
                }}
                onChange={customHandleChange}
                onBlur={formik.handleBlur}
                value={formik.values.userId}
                error={formik.touched.userId && Boolean(formik.errors.userId)}
                helperText={formik.touched.userId && formik.errors.userId}
                sx={{ flexGrow: 1, marginRight: 1 }} // Adjust the width and margin
              />
              <Button
                variant="contained"
                sx={{
                  whiteSpace: "nowrap",
                  backgroundColor: "#11395C",
                  mb:
                    formik.touched.userId && Boolean(formik.errors.userId)
                      ? 3
                      : null,
                  fontFamily: "Public Sans",
                }}
                onClick={handleSentOtp}
              >
                Send OTP
              </Button>
            </Box>
            {!showOtpField && (
              <Grid2>
                <Typography
                  sx={{
                    color: "#11395C",
                    cursor: "pointer",
                    fontFamily: "Public Sans",
                    // marginRight: "6rem",
                  }}
                  onClick={handlePageClick}
                >
                  Back to Login Page ?
                </Typography>
              </Grid2>
            )}

            {showOtpField && (
              <>
                <TextField
                  label="OTP"
                  placeholder="Please enter OTP"
                  variant="outlined"
                  // type={showOtp ? "text" : "password"}
                  type={"text"}
                  size="small"
                  name="otp"
                  inputProps={{
                    maxLength: 6,
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <RiLockPasswordFill />
                      </InputAdornment>
                    ),
                  }}
                  onChange={customHandleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.otp}
                  error={formik.touched.otp && Boolean(formik.errors.otp)}
                  helperText={formik.touched.otp && formik.errors.otp}
                  sx={{ marginBottom: 2, width: isMobile ? "100%" : "400px" }}
                />
                <TextField
                  label="Password"
                  placeholder="Please enter Password"
                  variant="outlined"
                  type={showPassword ? "text" : "password"}
                  size="small"
                  name="password"
                  inputProps={{
                    maxLength: 20,
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <RiLockPasswordFill />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleTogglePasswordVisibility}
                          edge="end"
                          aria-label="toggle password visibility"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  onChange={customHandleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
                  sx={{ marginBottom: 2, width: isMobile ? "100%" : "400px" }}
                />
                <TextField
                  label="Confirm Password"
                  placeholder="Please confirm Password"
                  variant="outlined"
                  type={showConfirmPassword ? "text" : "password"}
                  size="small"
                  name="confirmPassword"
                  inputProps={{
                    maxLength: 20,
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <RiLockPasswordFill />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleToggleShowPasswordVisibility}
                          edge="end"
                          aria-label="toggle password visibility"
                        >
                          {showConfirmPassword ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  onChange={customHandleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.confirmPassword}
                  error={
                    formik.touched.confirmPassword &&
                    Boolean(formik.errors.confirmPassword)
                  }
                  helperText={
                    formik.touched.confirmPassword &&
                    formik.errors.confirmPassword
                  }
                  sx={{ marginBottom: 2, width: isMobile ? "100%" : "400px" }}
                />

                <Button
                  variant="contained"
                  color="primary"
                  type="submit" // Add type submit to the button
                  sx={{
                    width: isMobile ? "100%" : "400px",
                    backgroundColor: "#11395C",
                  }}
                >
                  Submit
                </Button>
                {showOtpField && (
                  <Grid2>
                    <Typography
                      sx={{
                        color: "#11395C",
                        cursor: "pointer",
                        fontFamily: "Public Sans",
                        marginTop: "1rem",
                      }}
                      onClick={handlePageClick}
                    >
                      Back to Login Page ?
                    </Typography>
                  </Grid2>
                )}
              </>
            )}
          </form>
        </Box>
      </Box>
    </>
  );
};

export default ForgotPassword;
