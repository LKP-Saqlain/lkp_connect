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
  Grid2,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
// import Banner from "../../../assets/banner.png";
import LeftArm from "../../../assets/images/leftArm.png";
import Vector from "../../../assets/vector.png";
import { useTheme } from "@mui/material/styles";
// import { FaRegUserCircle } from "react-icons/fa";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { RiLockPasswordFill } from "react-icons/ri";
import "dayjs/locale/en-gb";
import {
  // useDispatch,
  useSelector,
  // useSelector
} from "react-redux";
// import { regEx } from "../../../helper/method";
// import { apiServices } from "../../../services/index";
// import ShowToast from "../../../utils/toastUtils";
// import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
import { useNavigate } from "react-router-dom";
import {
  // RootState,
  // AppDispatch,
  RootState,
} from "../../../redux/store";
import Logo from "../../../assets/logo.png";
import "../style.css";

const ChangePassword = () => {
  // const [showPassword, setShowPassword] = useState(false);
  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  // const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );
  const { user_type } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );

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
    oldPassword: Yup.string().required("Old Password is required"),
    newPassword: Yup.string().required("New Password is required"),
    confirmPassword: Yup.string().required("Confirm Password is required"),
  });

  // Initialize Formik
  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log("Form Data:", values);
      // Handle login logic here
      handleResetPassword();
    },
  });

  const handleTogglePasswordVisibility = (field: keyof typeof showPassword) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const customHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log("name->", name, "value->", value);

    if (name === "oldPassword") {
      // if (regEx.alphaNumeric.test(value)) {
      formik.setFieldValue(name, value.replace(/\s/g, ""));
      // }
    } else if (name === "newPassword") {
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

  const handleResetPassword = async () => {
    let payload = {
      old_password: formik.values.oldPassword,
      user_password: formik.values.newPassword,
      confirm_password: formik.values.confirmPassword,
      user_type: user_type,
      user_id: user_id,
    };
    // dispatch(showLoader(""));
    // dispatch(ForgotUserPassword(payload))
    //   .unwrap()
    //   .then((response) => {
    //     console.log("Response-->", response);
    //     if (response?.status === 200) {
    //       dispatch(hideLoader());
    //       ShowToast("success", response?.data?.message);
    //       setShowOtpField(true);
    //       navigate("/");
    //     }
    //   })
    //   .catch((error) => {
    //     const { message } = error;
    //     console.log("Error->", message);
    //     dispatch(hideLoader());
    //     ShowToast(
    //       "error",
    //       message || "Sorry for the inconvenience, please try after some time."
    //     );
    //   })
    //   .finally(() => {
    //     dispatch(hideLoader());
    //   });
    console.log(payload, "pay----");
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
            }}
          >
            Change Password
          </Typography>
          <Typography
            gutterBottom
            sx={{
              fontWeight: 600,
              color: "#11395C",
              mb: 4,
            }}
          >
            {" "}
            Don't worry! We will Change your Password in few seconds
          </Typography>
          <FormControl
            sx={{
              marginBottom: "6px",
            }}
          ></FormControl>
          <form
            style={isMobile ? {} : formStyle}
            onSubmit={formik.handleSubmit}
          >
            <>
              <TextField
                label="Old Password"
                placeholder="Please enter old Password"
                variant="outlined"
                type={showPassword.oldPassword ? "text" : "password"}
                size="small"
                name="oldPassword"
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
                        onClick={() =>
                          handleTogglePasswordVisibility("oldPassword")
                        }
                        edge="end"
                        aria-label="toggle oldPassword visibility"
                      >
                        {showPassword.oldPassword ? (
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
                value={formik.values.oldPassword}
                error={
                  formik.touched.oldPassword &&
                  Boolean(formik.errors.oldPassword)
                }
                helperText={
                  formik.touched.oldPassword && formik.errors.oldPassword
                }
                sx={{ marginBottom: 2, width: isMobile ? "100%" : "400px" }}
              />
              {/* New Password Field */}
              <TextField
                label="New Password"
                placeholder="Please enter new Password"
                variant="outlined"
                type={showPassword.newPassword ? "text" : "password"}
                size="small"
                name="newPassword"
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
                        onClick={() =>
                          handleTogglePasswordVisibility("newPassword")
                        }
                        edge="end"
                        aria-label="toggle newPassword visibility"
                      >
                        {showPassword.newPassword ? (
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
                value={formik.values.newPassword}
                error={
                  formik.touched.newPassword &&
                  Boolean(formik.errors.newPassword)
                }
                helperText={
                  formik.touched.newPassword && formik.errors.newPassword
                }
                sx={{ marginBottom: 2, width: isMobile ? "100%" : "400px" }}
              />
              {/* Confirm Password Field */}
              <TextField
                label="Confirm Password"
                placeholder="Please confirm Password"
                variant="outlined"
                type={showPassword.confirmPassword ? "text" : "password"}
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
                        onClick={() =>
                          handleTogglePasswordVisibility("confirmPassword")
                        }
                        edge="end"
                        aria-label="toggle confirmPassword visibility"
                      >
                        {showPassword.confirmPassword ? (
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

              <Grid2>
                <Typography
                  sx={{
                    color: "#11395C",
                    cursor: "pointer",

                    marginTop: "1rem",
                  }}
                  onClick={handlePageClick}
                >
                  Back to Login Page ?
                </Typography>
              </Grid2>
            </>
          </form>
        </Box>
      </Box>
    </>
  );
};

export default ChangePassword;
