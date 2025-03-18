import { useEffect, useState, CSSProperties } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  useMediaQuery,
  FormControlLabel,
  Radio,
  FormControl,
  RadioGroup,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { FaRegUserCircle } from "react-icons/fa";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { RiLockPasswordFill } from "react-icons/ri";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
import { UserLogin } from "../../../redux/thunk/Login/login";
import { verifyPassword } from "../../../redux/slices/Login/login";
import ShowToast from "../../../utils/toastUtils";
import Logo from "../../../assets/logo.png";
import LeftArm from "../../../assets/images/leftArm.png";
import Vector from "../../../assets/vector.png";
// import { regEx, isValidPANNo } from "../../../helper/method";
import { AppDispatch } from "../../../redux/store";

const formStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
};

const initialValues = {
  username: "",
  password: "",
  authentication: "",
  loginButtonGroup: "Employee",
};

const validationSchema = Yup.object({
  username: Yup.string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    localStorage.clear();
  }, []);

  const handleValidateUser = async (values: any) => {
    const payload = {
      user_type: values.loginButtonGroup,
      user_id: values.username,
      user_password: values.password,
    };

    dispatch(showLoader(""));
    try {
      const response: any = await dispatch(UserLogin(payload)).unwrap();
      if (response.status === 200) {
        dispatch(verifyPassword(values.password));
        localStorage.setItem("Id", response.data.user_id);
        localStorage.setItem("uIdType", response.data.user_type);
        ShowToast("success", "User Validated.");
        navigate("/authorization");
      }
    } catch (error: any) {
      ShowToast("error", error.message || "Please try again later.");
    } finally {
      dispatch(hideLoader());
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleValidateUser,
  });

  const handleTogglePasswordVisibility = () => setShowPassword((prev) => !prev);

  return (
    <Box
      display="flex"
      flexDirection={isMobile ? "column" : "row"}
      alignItems="center"
    >
      <Box
        component="img"
        alt="Logo"
        src={Logo}
        width={"auto"}
        height="50px"
        sx={{
          position: "absolute",
          top: 10,
          right: 26,
          zIndex: 10,
        }}
      />
      <Box
        component="img"
        src={LeftArm}
        alt="LeftArm"
        sx={{
          width: isMobile ? "100%" : "47.9%",
          height: "100vh",
          backgroundImage: `url(${Vector})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right",
        }}
      />
      <Box
        sx={{
          width: isMobile ? "100%" : "50%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700, color: "#095192" }}>
          LKP Connect
        </Typography>
        <FormControl sx={{ marginBottom: "6px" }}>
          <RadioGroup
            row
            value={formik.values.loginButtonGroup}
            name="loginButtonGroup"
            onChange={formik.handleChange}
          >
            <FormControlLabel
              value="Employee"
              control={<Radio />}
              label="Employee"
            />
            <FormControlLabel
              value="Partner"
              control={<Radio />}
              label="Partner"
            />
          </RadioGroup>
        </FormControl>
        <form style={formStyle} onSubmit={formik.handleSubmit}>
          <TextField
            label={
              formik.values.loginButtonGroup === "Employee"
                ? "Employee Code"
                : "AP Code"
            }
            placeholder="Enter Code"
            variant="outlined"
            size="small"
            name="username"
            onChange={formik.handleChange}
            value={formik.values.username}
            error={Boolean(formik.errors.username)}
            helperText={formik.errors.username}
            sx={{ marginBottom: 2, width: "400px" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FaRegUserCircle />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Password"
            placeholder="Enter Password"
            variant="outlined"
            type={showPassword ? "text" : "password"}
            size="small"
            name="password"
            onChange={formik.handleChange}
            value={formik.values.password}
            error={Boolean(formik.errors.password)}
            helperText={formik.errors.password}
            sx={{ marginBottom: 2, width: "400px" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <RiLockPasswordFill />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePasswordVisibility}>
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={{ width: "400px", backgroundColor: "#11395C" }}
          >
            Login
          </Button>
        </form>
        <Typography
          sx={{ color: "#11395C", cursor: "pointer", mt: 2 }}
          onClick={() => navigate("/forgot-password")}
        >
          Forgot Password / Unblock User?
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginPage;
