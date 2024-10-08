import React, { CSSProperties, useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  useMediaQuery,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import Banner from "../../../assets/banner.png";
import Vector from "../../../assets/vector.png";
import { useTheme } from "@mui/material/styles";
import { FaRegUserCircle } from "react-icons/fa";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { RiLockPasswordFill } from "react-icons/ri";
import dayjs from "dayjs";
import "dayjs/locale/en-gb";
import { regEx } from "../../../helper/method";

const ForgotPassword = () => {
  const [submitted, setSubmiited] = useState(false);
  const [value, setValue] = useState<dayjs.Dayjs | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const customInputRef = useRef();

  const formStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  };

  // Form validation schema using Yup
  const validationSchema = Yup.object({
    userId: Yup.string()
      .required("userId is required")
      .min(3, "user ID must be at least 3 characters"),
    otp: Yup.string()
      .required("OTP is required")
      .min(4, "OTP must be at least 4 characters"),
  });

  // Initialize Formik
  const formik = useFormik({
    initialValues: {
      userId: "",
      otp: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log("Form Data:", values);
      // Handle login logic here
      setSubmiited(true);
    },
  });
  const handleToggleOTPVisibility = () => {
    setShowOtp((prev) => !prev);
  };
  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleToggleShowPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const customHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log("name->", name, "value->", value);

    switch (name) {
      case "userId":
        if (regEx.alphaNumeric.test(value)) {
          formik.setFieldValue(name, value.replace(/\s/g, ""));
        }
        break;
      case "otp":
        if (regEx.number.test(value)) {
          formik.setFieldValue(name, value.replace(/\s/g, ""));
        }
        break;

      default:
        formik.handleChange(e);
        break;
    }

    if (name === "userId") {
      if (regEx.alphaNumeric.test(value)) {
        formik.setFieldValue(name, value.replace(/\s/g, ""));
      }
    } else if (name === "otp") {
      if (regEx.number.test(value)) {
        formik.setFieldValue(name, value.replace(/\s/g, ""));
      }
    } else {
      formik.handleChange(e);
    }
  };

  useEffect(() => {
    console.log("formikValues->", formik.values);
  }, [formik.values]);

  return (
    <>
      <Box
        sx={{
          borderRadius: "4px",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          component="img"
          src={Banner}
          alt="Banner"
          sx={{
            width: isMobile ? "100%" : "50%",
            borderRadius: "4px",
            marginBottom: isMobile ? 2 : 0,
            // border: "1px solid black",
            backgroundImage: `url(${Vector})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right",
            backgroundSize: "740px 900px",
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
            sx={{ fontWeight: 600, color: "#095192" }}
          >
            Forgot Password
          </Typography>
          <Typography
            gutterBottom
            sx={{ fontWeight: 600, color: "#095192", mb: 4 }}
          >
            {" "}
            Don't worry! We will reset your Password in few seconds
          </Typography>
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
                  backgroundColor: "#095192",
                  mb:
                    formik.touched.userId && Boolean(formik.errors.userId)
                      ? 3
                      : null,
                }}
              >
                Send OTP
              </Button>
            </Box>

            <TextField
              label="OTP"
              placeholder="Please enter OTP"
              variant="outlined"
              type={showOtp ? "text" : "password"}
              size="small"
              name="otp"
              inputProps={{
                maxLength: 4,
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
                      onClick={handleToggleOTPVisibility}
                      edge="end"
                      aria-label="toggle password visibility"
                    >
                      {showOtp ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
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
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              onChange={customHandleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              error={formik.touched.password && Boolean(formik.errors.password)}
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
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
                formik.touched.confirmPassword && formik.errors.confirmPassword
              }
              sx={{ marginBottom: 2, width: isMobile ? "100%" : "400px" }}
            />

            <Button
              variant="contained"
              color="primary"
              type="submit" // Add type submit to the button
              sx={{
                width: isMobile ? "100%" : "400px",
                backgroundColor: "#095192",
              }}
            >
              Submit
            </Button>
          </form>
        </Box>
      </Box>
    </>
  );
};

export default ForgotPassword;
