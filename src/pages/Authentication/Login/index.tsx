import React, { CSSProperties, useEffect, useState } from "react";
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
  RadioGroup,
} from "@mui/material";
import "./style.css";
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
import { regEx, isValidPANNo } from "../../../helper/method";
import { useNavigate } from "react-router-dom";
// import { apiServices } from "../../../services";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
import { useDispatch } from "react-redux";
import ShowToast from "../../../utils/toastUtils";
import { AppDispatch } from "../../../redux/store";
import { UserLogin } from "../../../redux/thunk/Login/login";
import Logo from "../../../assets/logo.png";

const LoginPage = () => {
  const [submitted, setSubmiited] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    localStorage.removeItem("tkn");
    localStorage.removeItem("Id");
    localStorage.removeItem("uIdType");
    localStorage.removeItem("authenticated");
  }, []);

  // useEffect(() => {
  //   console.log("userData", LoginUser.data);
  // }, [LoginUser]);
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
      loginButtonGroup: "Employee",
      authenticationButtonGroup: "",
      DateOfBirth: "",
    },
    validationSchema: !submitted
      ? validationSchema
      : authenticationValidationSchema, //commented 2FA validation for a while
    // validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log("Form Data:", values);
      // Handle login logic here
      // setSubmiited(true);
      handleValidateUser(values);
    },
  });

  const handleValidateUser = (values: any) => {
    console.log("handleValidateUser values", values);

    const payload = {
      user_type: values.loginButtonGroup,
      user_id: values.username,
      user_password: values.password,
    };

    dispatch(showLoader("Please wait"));

    dispatch(UserLogin(payload))
      .unwrap()
      .then((response) => {
        console.log("reduxResponse", response?.data);
        if (response?.status === 200) {
          const { user_id, user_type } = response?.data;
          dispatch(hideLoader());
          localStorage.setItem("Id", user_id);
          localStorage.setItem("uIdType", user_type);
          // localStorage.setItem("authenticated", "true");

          ShowToast("success", "User Validated.");
          formik.setErrors({}); // Clear any previous errors
          setSubmiited(true);
          navigate("/authorization");
        }
      })
      .catch((Err) => {
        const { message } = Err;
        console.log("Error->", message);
        dispatch(hideLoader());
        // formik.setFieldError("password", message);
        ShowToast(
          "error",
          message || "Sorry for the inconvenience, please try after some time."
        );
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  const customHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log("name->", name, "value----->", value);
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

  const handleClick = () => {
    console.log("event");
    navigate("/forgot-password");
  };

  useEffect(() => {
    console.log("formikValues->", formik.values);
  }, [formik.values]);

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
            width: isMobile ? "100%" : "47.9%",
            borderRadius: "4px",
            marginBottom: isMobile ? 2 : 0,
            // border: "1px solid black",
            marginRight: "35px",
            backgroundImage: `url(${Vector})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right",
            // backgroundSize: "740px 900px",
            height: "100vh",
            // border: "4px solid red",
          }}
        />
        {/* Right side - Text fields */}

        <Box
          sx={{
            width: isMobile ? "100%" : "50%",
            // padding: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            // mt: 12,
            mb: 4,
            // border: "1px solid blue",
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: "#095192",
              fontFamily: "Poppins",
            }}
          >
            LKP Connect{" "}
          </Typography>
          <FormControl
            sx={{
              marginBottom: "6px",
            }}
          >
            <RadioGroup
              value={formik.values.loginButtonGroup}
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="loginButtonGroup"
              // onChange={customHandleChange}
              className="custom-font"
            >
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
            </RadioGroup>
          </FormControl>

          <form
            style={isMobile ? {} : formStyle}
            onSubmit={formik.handleSubmit}
          >
            <TextField
              label={
                formik.values.loginButtonGroup === "Employee"
                  ? "Employee Code"
                  : "AP Code"
              }
              placeholder={
                formik.values.loginButtonGroup === "Employee"
                  ? "Please Enter Employee Code"
                  : "Please Enter AP Code"
              }
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
              error={formik.touched.username && Boolean(formik.errors.username)}
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
                      {showPassword ? <Visibility /> : <VisibilityOff />}
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
            <Button
              variant="contained"
              color="primary"
              type="submit" // Add type submit to the button
              sx={{
                width: isMobile ? "100%" : "400px",
                backgroundColor: "#11395C",
                fontFamily: "Public Sans",
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
                sx={{
                  color: "#11395C",
                  cursor: "pointer",
                  fontFamily: "Public Sans",
                }}
                onClick={handleClick}
              >
                Forgot Password / Unblock User ?
              </Typography>
            </Grid2>
          </Grid2>
        </Box>
      </Box>
    </>
  );
};

export default LoginPage;
