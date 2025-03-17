import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  useMediaQuery,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  IconButton,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
// import { apiServices } from "../../../services";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
import { useDispatch } from "react-redux";
import { isValidPANNo, regEx } from "../../../helper/method";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { FaRegUserCircle } from "react-icons/fa";
import { useTheme } from "@mui/material/styles";
// import Banner from "../../../assets/banner.png";
import LeftArm from "../../../assets/images/leftArm.png";
import Vector from "../../../assets/vector.png";
import ShowToast from "../../../utils/toastUtils";
import { useEffect, useState } from "react";
import { AppDispatch } from "../../../redux/store";
import { AuthUser } from "../../../redux/thunk/AuthUser";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Logo from "../../../assets/logo.png";
import "./style.css";

const AuthenticateUser = () => {
  const [showPassword, setShowPassword] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const authenticationValidationSchema = Yup.object({
    authentication: Yup.string().when("authenticationButtonGroup", {
      is: "PAN",
      then: (schema) =>
        schema
          .required("PAN is Required")
          .test("is-valid-pan", "Invalid PAN format", (value) =>
            isValidPANNo(value)
          ),
      otherwise: (schema) => schema.notRequired(),
    }),
    DateOfBirth: Yup.string().when("authenticationButtonGroup", {
      is: "DateOfBirth",
      then: (schema) => schema.required("Date of Birth is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    // Add `authenticationButtonGroup` here to make it accessible for conditions
    authenticationButtonGroup: Yup.string().required(),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      authentication: "",
      loginButtonGroup: "",
      authenticationButtonGroup: "Pan",
      DateOfBirth: "",
    },
    validationSchema: authenticationValidationSchema,
    onSubmit: async (values) => {
      console.log("Form Data:", values);
      // Call the two-factor authentication handler
      await handleTwoFactorAuthentication();
    },
  });

  const handleTwoFactorAuthentication = async () => {
    if (
      formik.values.authenticationButtonGroup === "Pan" &&
      formik.values.authentication === ""
    ) {
      formik.setFieldError("authentication", "Please enter PAN");
      return false;
    } else if (
      formik.values.authenticationButtonGroup === "Date of Birth" &&
      formik.values.DateOfBirth === ""
    ) {
      formik.setFieldError("DateOfBirth", "Please enter Date of Birth");
      return false;
    }

    const Id = localStorage.getItem("Id");
    const IdType = localStorage.getItem("uIdType");

    let payload = {
      user_id: Id,
      user_type: IdType,
      auth_type:
        formik.values.authenticationButtonGroup === "Pan" ? "PAN" : "DOB",
      auth_value: formik.values.authentication
        ? formik.values.authentication
        : formik.values.DateOfBirth,
    };
    dispatch(showLoader(""));
    dispatch(AuthUser(payload))
      .unwrap()
      .then((response) => {
        console.log("2FAresponse", response);
        if (response?.status === 200) {
          const { token, name } = response?.data;
          console.log("2FA_Response", response?.data);
          localStorage.setItem("authenticated", "true");
          localStorage.setItem("tkn", token);
          localStorage.setItem("userName", name);
          navigate("/dashboard");
        }
      })
      .catch((error) => {
        const { message } = error;
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

  useEffect(() => {
    console.log("formikValls", formik.values);
    if (formik.values.authenticationButtonGroup !== "Date of Birth") {
      formik.setFieldValue("DateOfBirth", "");
    }
  }, [formik.values, formik.values.authenticationButtonGroup]);

  return (
    <form onSubmit={formik.handleSubmit}>
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
          }}
        />
        {/* Right side */}
        <Box
          sx={{
            width: isMobile ? "100%" : "50%",
            padding: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            // mt: 12,
            mb: 4,
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: "#095192",
              fontFamily: "Poppins",
            }}
          >
            Two Factor Authentication
          </Typography>
          <FormControl sx={{ marginBottom: "6px" }}>
            <RadioGroup
              value={formik.values.authenticationButtonGroup}
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="authenticationButtonGroup"
              onChange={customHandleChange} // Handle changes for selecting authentication type
            >
              <FormControlLabel
                value="Pan"
                control={
                  <Radio
                    sx={{
                      "&.Mui-checked": {
                        color: "#11395C",
                      },
                    }}
                  />
                }
                label="PAN"
              />
              <FormControlLabel
                value="Date of Birth"
                control={
                  <Radio
                    sx={{
                      "&.Mui-checked": {
                        color: "#11395C",
                      },
                    }}
                  />
                }
                label="Date of Birth"
              />
            </RadioGroup>
          </FormControl>

          {formik.values.authenticationButtonGroup === "Pan" ? (
            <TextField
              type={showPassword ? "text" : "password"}
              label="Enter PAN"
              variant="outlined"
              size="small"
              name="authentication"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaRegUserCircle />
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
              sx={{
                marginBottom: 1.2,
                width: isMobile ? "100%" : "400px",
              }}
            />
          ) : (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                format="DD/MM/YYYY"
                value={
                  formik.values.DateOfBirth
                    ? dayjs(formik.values.DateOfBirth, "DD/MM/YYYY")
                    : null
                }
                sx={{
                  marginBottom: 1.2,
                  width: isMobile ? "100%" : "400px",
                }}
                maxDate={dayjs().subtract(18, "year")}
                minDate={dayjs().subtract(64, "year")}
                onChange={(date: Dayjs | null) =>
                  formik.setFieldValue(
                    "DateOfBirth",
                    date ? date.format("DD/MM/YYYY") : ""
                  )
                }
                slotProps={{
                  textField: {
                    error: Boolean(
                      formik.touched.DateOfBirth && formik.errors.DateOfBirth
                    ),
                    helperText:
                      formik.touched.DateOfBirth && formik.errors.DateOfBirth,
                  },
                }}
              />
            </LocalizationProvider>
          )}

          <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={{
              width: isMobile ? "100%" : "400px",
              backgroundColor: "#11395C",
            }}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </form>
  );
};

export default AuthenticateUser;
