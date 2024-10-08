import React, { CSSProperties, useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  useMediaQuery,
  Grid2,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  RadioGroup,
} from "@mui/material";
import "./style.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import Banner from "../../../assets/banner.png";
import Vector from "../../../assets/vector.png";
import { useTheme } from "@mui/material/styles";
import { FaRegUserCircle } from "react-icons/fa";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { RiLockPasswordFill } from "react-icons/ri";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import "dayjs/locale/en-gb";
import { regEx, isValidPANNo } from "../../../helper/method";
import { useNavigate } from "react-router-dom";

interface ForgotPassword {
  handleForgotClick: () => void;
}

const LoginPage = ({ handleForgotClick }: ForgotPassword) => {
  const [submitted, setSubmiited] = useState(false);
  const [value, setValue] = useState<dayjs.Dayjs | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const customInputRef = useRef();
  const navigate = useNavigate();

  const formStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  };

  // Form validation schema using Yup
  const validationSchema = Yup.object({
    username: Yup.string()
      .required("Username is required")
      .min(3, "Username must be at least 3 characters"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
  });
  const authenticationValidationSchema = Yup.object({
    authentication: Yup.string()
      .required("PAN is required")
      .test("is-valid-pan", "Invalid PAN format", (value) =>
        isValidPANNo(value)
      ),
  });

  // Initialize Formik
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      authentication: "",
      loginButtonGroup: "",
      authenticationButtonGroup: "",
      DateOfBirth: "",
    },
    validationSchema: !submitted
      ? validationSchema
      : authenticationValidationSchema,
    onSubmit: (values) => {
      console.log("Form Data:", values);
      // Handle login logic here
      setSubmiited(true);
    },
  });

  const customHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log("name->", name, "value->", value);
    if (name === "authenticationButtonGroup") {
      formik.setFieldValue("authentication", "");
    }
    if (name === "username") {
      if (regEx.alphaNumeric.test(value)) {
        formik.setFieldValue(name, value.toUpperCase().replace(/\s/g, ""));
      }
    } else if (name === "password") {
      // if (regEx.alphaNumeric.test(value)) {
      formik.setFieldValue(name, value.replace(/\s/g, ""));
      // }
    } else if (name === "authentication") {
      const updatedValue = value.toUpperCase();

      if (regEx.alphaNumeric.test(updatedValue)) {
        formik.setFieldValue(name, updatedValue);
      }
    } else {
      formik.handleChange(e);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleClick = (event: any) => {
    console.log("event");
    handleForgotClick();
    navigate("/forgot-password");
  };

  useEffect(() => {
    console.log("formikValues->", formik.values);
  }, [formik.values]);
  //   useEffect(() => {
  //     formik.setFieldValue("authenticationButtonGroup", "Pan");
  //   }, [formik.values.authenticationButtonGroup]);

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
        {!submitted ? (
          <Box
            sx={{
              width: isMobile ? "100%" : "50%",
              padding: 2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              // mt: 12,
              // border: "1px solid red",
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: 600, color: "#095192" }}
            >
              Welcome to
            </Typography>
            <Typography
              variant="h4"
              gutterBottom
              sx={{ fontWeight: 600, color: "#095192" }}
            >
              LKP Connect{" "}
            </Typography>
            <FormControl sx={{ marginBottom: "6px" }}>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="loginButtonGroup"
                // onChange={customHandleChange}
              >
                <FormControlLabel
                  value="Client"
                  control={<Radio onChange={customHandleChange} />}
                  label="Client"
                />
                <FormControlLabel
                  value="Partner"
                  control={<Radio onChange={customHandleChange} />}
                  label="Partner"
                />
                <FormControlLabel
                  value="Employee"
                  control={<Radio onChange={customHandleChange} />}
                  label="Employee"
                />
              </RadioGroup>
            </FormControl>

            <form
              style={isMobile ? {} : formStyle}
              onSubmit={formik.handleSubmit}
            >
              <TextField
                label="Username"
                placeholder="Please enter Username"
                variant="outlined"
                size="small"
                name="username"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaRegUserCircle />
                    </InputAdornment>
                  ),
                }}
                onChange={customHandleChange}
                onBlur={formik.handleBlur}
                value={formik.values.username}
                error={
                  formik.touched.username && Boolean(formik.errors.username)
                }
                inputProps={{
                  maxLength: 12,
                }}
                helperText={formik.touched.username && formik.errors.username}
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
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
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
                Login
              </Button>
            </form>
            <Grid2
              container
              mt={2}
              direction="row"
              spacing={2}
              alignItems="center"
            >
              <Grid2>
                <Typography
                  sx={{ color: "#095192", cursor: "pointer" }}
                  onClick={handleClick}
                >
                  Forgot Password / Unblocked User ?
                </Typography>
              </Grid2>
              {/* <Grid2>
                <Typography sx={{ color: "#095192", cursor: "pointer" }}>
                  UnBlocked User?
                </Typography>
              </Grid2> */}
            </Grid2>
          </Box>
        ) : (
          <Box
            sx={{
              width: isMobile ? "100%" : "50%",
              padding: 2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              mt: 12,
              //   border: "1px solid red",
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: 600, color: "#095192" }}
            >
              Two Factor Authentication
            </Typography>
            <FormControl sx={{ marginBottom: "6px" }}>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="authenticationButtonGroup"
              >
                <FormControlLabel
                  value="Pan"
                  control={<Radio onChange={customHandleChange} />}
                  label="Pan"
                  //   checked={formik.values.authenticationButtonGroup==="Pan"?true:false}
                />
                <FormControlLabel
                  value="Date of Birth"
                  control={<Radio onChange={customHandleChange} />}
                  label="Date of Birth"
                />
              </RadioGroup>
            </FormControl>

            {/* <form
              style={isMobile ? {} : formStyle}
              onSubmit={formik.handleSubmit}
            > */}
            {formik.values.authenticationButtonGroup === "" ||
            formik.values.authenticationButtonGroup === "Pan" ? (
              <TextField
                label="Enter Pan"
                // placeholder="Please enter Username"
                variant="outlined"
                size="small"
                name="authentication"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaRegUserCircle />
                    </InputAdornment>
                  ),
                }}
                inputProps={{
                  maxLength: 10,
                }}
                onChange={customHandleChange}
                onBlur={formik.handleBlur}
                value={formik.values.authentication}
                error={
                  formik.touched.authentication &&
                  Boolean(formik.errors.authentication)
                }
                helperText={
                  formik.touched.authentication && formik.errors.authentication
                }
                sx={{ marginBottom: 2, width: isMobile ? "100%" : "400px" }}
              />
            ) : (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  className="w-full"
                  format="DD/MM/YYYY"
                  value={
                    formik.values.DateOfBirth
                      ? dayjs(formik.values.DateOfBirth, "DD/MM/YYYY")
                      : null
                  }
                  sx={{
                    marginBottom: 2,
                    width: isMobile ? "100%" : "400px",
                    height: "40px !important",
                  }}
                  maxDate={dayjs().subtract(18, "year")}
                  minDate={dayjs().subtract(64, "year")}
                  onChange={(date: Dayjs | null) =>
                    formik.setFieldValue(
                      "startDate",
                      date ? date.format("DD/MM/YYYY") : ""
                    )
                  }
                  // renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            )}

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
          </Box>
        )}
      </Box>
    </>
  );
};

export default LoginPage;
