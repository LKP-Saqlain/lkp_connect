import { useFormik } from "formik";
import {
  Country,
  genderOptions,
  holderSchema,
  normalizeKycData,
  occupationOptions,
  States,
  taxOptions,
} from "../../../../../../pages/MutualFund/mfTypes";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../../../redux/store";
import { useEffect, useState } from "react";
import {
  hideLoader,
  showLoader,
} from "../../../../../../redux/slices/loaderSlice";
import { apiServices } from "../../../../../../services";
import ShowToast from "../../../../../../utils/toastUtils";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CkycModal from "../../CkycModal";

const HolderDetails = ({
  setStep,
  navDirection,
  goPrev,
  goNext,
  holdingType,
  setPrimaryPan,
  primaryPan,
  setPreviousPayload,
}: any) => {
  const [verified, setVerified] = useState({
    panNo: false,
    mobileNo: false,
    email: false,
  });
  const [ckycFlag, setCkycFlag] = useState<boolean>(true);
  const [showCkycModal, setShowCkycModal] = useState(false);
  const [cKycRequestId, setCKycRequestId] = useState("");
  const [fieldsDisabled, setFieldsDisabled] = useState({
    firstName: false,
    middleName: false,
    lastName: false,
    email: false,
    gender: false,
    address1: false,
    address2: false,
    address3: false,
    city: false,
    state: false,
    country: false,
    pincode: false,
    dob: false,
  });

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (navDirection === "prev") {
      previousData();
    }
  }, [navDirection]);

  const PanVerify = () => {
    if (formik.values.pan === "") return;
    const payload = {
      panno: formik.values.pan,
    };
    dispatch(showLoader("Fetching Client Code..."));
    apiServices
      .PanVerification(payload)
      .then((response: any) => {
        const data = response?.data?.data[0];
        console.log("PanVerification Response:", data);
        if (data?.mfpresentstatus === true) {
          ShowToast("error", "PAN already exists in MF");
          setStep(0);
          return;
        }
        if (data?.lkppresentstatus || !data?.lkppresentstatus) {
          setVerified({
            panNo: true,
            mobileNo: false,
            email: false,
          });
          setPrimaryPan(formik.values.pan);
          // ShowToast("info", data?.message);
          if (data?.lkppresentstatus) {
            setCkycFlag(false);
          }
          return;
        }

        ShowToast("info", "Unavailable to verify");
      })
      .catch((error: any) => {
        console.error("PhysicalClientInfo Error:", error);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  const sendMobileOtp = () => {
    if (!verified.panNo) {
      ShowToast("info", "Please verify PAN first");
      return;
    }
    const payload = {
      panno: formik.values.pan,
      mobileNo: formik.values.mobile,
      ckycOtpFlag: ckycFlag,
    };
    dispatch(showLoader("Fetching Client Code..."));
    apiServices
      .KYCverification(payload)
      .then((response: any) => {
        const data = response?.data?.data;
        console.log("NumberVerification Response:", data);
        if ((data?.message).includes("sent")) {
          if (ckycFlag) {
            setCKycRequestId(data?.request_id);
          }
          ShowToast("success", data?.message);
        } else if ((data?.message).includes("failed")) {
          setShowCkycModal(true);
          ShowToast("info", data?.message);
        } else {
          ShowToast("error", data?.message);
        }
      })
      .catch((error: any) => {
        console.error("PhysicalClientInfo Error:", error);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  const verifyMobileOtp = () => {
    if (formik.values.otp === "") {
      ShowToast("info", "Please enter otp");
      return;
    }

    const payload = {
      ckycOtpFlag: ckycFlag,
      otp: formik.values.otp,
      request_id: ckycFlag ? cKycRequestId : "0",
      panno: formik.values.pan,
    };

    dispatch(showLoader("Fetching Client Code..."));

    apiServices
      .KYCOtpVerification(payload)
      .then((response: any) => {
        const data = response?.data?.data;
        console.log("before Normalized KYC Data:", response?.data);
        if (data?.status === 1) {
          console.log("before Normalized KYC Data:", data);
          const normalizedData = normalizeKycData(data, ckycFlag);

          console.log("Normalized KYC Data:", normalizedData);

          // Update all Formik fields
          formik.setValues((prev: any) => ({
            ...prev,
            firstName: normalizedData.firstName,
            middleName: normalizedData.middleName,
            lastName: normalizedData.lastName,
            dob: normalizedData.dob || null,
            gender: normalizedData.gender || "",
            email: normalizedData.email,
            address1: normalizedData.address1,
            address2: normalizedData.address2,
            address3: normalizedData.address3,
            city: normalizedData.city,
            state: normalizedData.state,
            country: normalizedData.country,
            pincode: normalizedData.pincode,
          }));

          // Disable fields if data exists
          setFieldsDisabled({
            firstName: !!normalizedData.firstName,
            middleName: !!normalizedData.middleName,
            lastName: !!normalizedData.lastName,
            email: !!normalizedData.email,
            address1: !!normalizedData.address1,
            address2: !!normalizedData.address2,
            address3: !!normalizedData.address3,
            city: !!normalizedData.city,
            gender: !!normalizedData.gender,
            state: !!normalizedData.state,
            country: !!normalizedData.country,
            pincode: !!normalizedData.pincode,
            dob: !!normalizedData.dob,
          });

          // Set verification flag
          setVerified((prev) => ({
            ...prev,
            mobileNo: true,
          }));
        } else if (response?.data?.message === "LKP OTP verified") {
          const normalizedData = normalizeKycData(data, ckycFlag);

          console.log("Normalized KYC Data: lkp", normalizedData, data[0]);

          // Update all Formik fields
          formik.setValues((prev: any) => ({
            ...prev,
            firstName: normalizedData.firstName,
            middleName: normalizedData.middleName,
            lastName: normalizedData.lastName,
            // dob: normalizedData.dob || null,
            gender: normalizedData.gender || "",
            email: normalizedData.email,
            address1: normalizedData.address1,
            address2: normalizedData.address2,
            address3: normalizedData.address3,
            city: normalizedData.city,
            state: normalizedData.state,
            country: normalizedData.country,
            pincode: normalizedData.pincode,
          }));
          setVerified((prev) => ({
            ...prev,
            mobileNo: true,
          }));
          return;
        } else {
          ShowToast("error", "Verification Failed");
        }
      })
      .catch((error: any) => {
        console.error("PhysicalClientInfo Error:", error);
        ShowToast("error", "Failed to verify KYC");
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  const emailVerify = () => {
    if (!formik.values.email) {
      ShowToast("info", "Email is missing");
      return;
    }
    if (!formik.values.emailOtp) {
      ShowToast("info", "Otp   is missing");
      return;
    }
    const payload = {
      otp: formik.values.emailOtp,
      panno: formik.values.pan,
    };
    dispatch(showLoader("Fetching Client Code..."));
    apiServices
      .EmailVerificationPhysical(payload)
      .then((response: any) => {
        const success = response?.data?.isSuccess;
        console.log("PanVerification Response:", response?.data?.isSuccess);
        if (success) {
          setVerified((prev) => ({
            ...prev,
            email: true,
          }));
          ShowToast("success", response?.data?.message);
          return;
        }
        ShowToast("error", "Email OTP not verified");
      })
      .catch((error: any) => {
        console.error("Email OTP Error:", error);
        ShowToast("error", "Email OTP not verified");
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  const SendEmailOtp = () => {
    if (!formik.values.pan) {
      ShowToast("info", "PAN card missing");
      return;
    }
    if (!verified.panNo) {
      ShowToast("info", "Please verify PAN first");
      return;
    }
    if (!formik.values.email) {
      ShowToast("info", "Email is missing");
      return;
    }
    const payload = {
      email: formik.values.email,
      panno: formik.values.pan,
    };
    dispatch(showLoader("Fetching Client Code..."));
    apiServices
      .EmailOTPForPhysical(payload)
      .then((response: any) => {
        const data = response?.data;
        console.log("EmailVerification Response:", data);
        ShowToast("info", data?.message);
      })
      .catch((error: any) => {
        console.error("EmailVerification Error:", error);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  const SendData = (values: any) => {
    console.log("sendate values", values.firstName);
    const payload = {
      primaryHolderPAN: primaryPan,
      indianMobileNo: values.mobile,
      primaryHolderFirstName: values.firstName,
      primaryHolderMiddleName: values.middleName,
      primaryHolderLastName: values.lastName,
      email: values.email,
      gender: values.gender,
      primaryHolderDOB: dayjs(values.dob).format("DD/MM/YYYY"),
      address1: values.address1,
      address2: values.address2,
      address3: values.address3,
      city: values.city,
      state: values.state,
      pincode: values.pincode,
      country: values.country,
      taxStatus: values.taxResident,
      occupationCode: values.occupation,
      primaryHolderPANExempt: "N",
      holdingNature: holdingType,
      divPayMode: "02",
      communicationMode: "E",
      primaryHolderKYCType: ckycFlag ? "C" : "K",
      primaryHolderCKYCNumber: ckycFlag ? cKycRequestId : "",
      nominationAuthMode: "O",
      paperlessFlag: "Z",
      clientType: "p",
    };

    dispatch(showLoader("Fetching Previous Data..."));

    apiServices
      .PhysicalManualOnboarding(payload)
      .then((response: any) => {
        const data = response?.data?.data;
        if (data.includes("Successfully")) {
          setPreviousPayload((prev: any) => ({
            ...prev,
            ...payload,
          }));
          ShowToast("success", data);
          goNext();
        } else {
          ShowToast("error", "Error While Submitting data");
        }
      })
      .catch((error: any) => {
        console.error("PhysicalClientInfo Error:", error);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  const previousData = () => {
    const payload = {
      // panno: "testt1234b",
      panno: primaryPan,
    };

    dispatch(showLoader("Fetching Previous Data..."));

    apiServices
      .GetPhysicalClientDetails(payload)
      .then((response: any) => {
        const data = response?.data?.data;

        console.log("Previous Data:", data);

        // Update all Formik fields
        formik.setValues((prev: any) => ({
          ...prev,
          // mobile:data.
          firstName: data.primaryHolderFirstName,
          middleName: data.primaryHolderMiddleName,
          lastName: data.primaryHolderLastName,
          dob: data?.primaryHolderDOB
            ? dayjs(data.primaryHolderDOB, "DD/MM/YYYY")
            : null,
          gender: data?.gender
            ? data.gender.toLowerCase() === "male"
              ? "Male"
              : data.gender.toLowerCase() === "female"
              ? "Female"
              : prev.gender
            : prev.gender,
          email: data.email,
          address1: data.address1,
          address2: data.address2,
          address3: data.address3,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
        }));

        console.log("Previous Data:", data);
      })
      .catch((error: any) => {
        console.error("PhysicalClientInfo Error:", error);
        ShowToast("error", "Failed to verify KYC");
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  const formik = useFormik({
    initialValues: {
      pan: "",
      mobile: "",
      otp: "",
      firstName: "",
      middleName: "",
      lastName: "",
      dob: null,
      gender: "",
      email: "",
      emailOtp: "",
      address1: "",
      address2: "",
      address3: "",
      country: "",
      state: "",
      city: "",
      pincode: "",
      incomeSlab: "",
      sourceWealth: "",
      occupation: "",
      pepStatus: "",
      kraAddressType: "",
      taxResident: "",
      placeOfBirth: "",
      countryOfBirth: "",
    },
    validationSchema: holderSchema,
    onSubmit: (values) => {
      console.log("Physical Form Data:", values);
      SendData(values);
      formik.resetForm();
    },
  });

  const isFormComplete = verified.panNo && verified.mobileNo && verified.email;
  return (
    <>
      <CkycModal
        isOpen={showCkycModal}
        toggle={() => setShowCkycModal(false)}
        onProceedCkyc={() => {
          setCkycFlag(true);
          setShowCkycModal(false);
          sendMobileOtp();
        }}
        onProceedLkp={() => {
          setCkycFlag(false);
          setShowCkycModal(false);
          sendMobileOtp();
        }}
      />
      <h4 style={{ marginBottom: "20px", fontWeight: 600 }}>
        Primary Holder Details
      </h4>

      {/* Start Form */}
      <form onSubmit={formik.handleSubmit}>
        {/* 1️⃣ PAN + MOBILE + OTP */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {/* PAN + Verify */}
          <Grid item xs={12} sm={4}>
            <Box display="flex" gap={1}>
              <TextField
                name="pan"
                label={"Primary Holder PAN"}
                value={formik.values.pan}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                size="small"
                fullWidth
                inputProps={{ maxLength: 10 }}
                error={formik.touched.pan && Boolean(formik.errors.pan)}
                disabled={verified.panNo}
              />

              <Button
                variant="contained"
                disabled={verified.panNo}
                sx={{
                  bgcolor: "#2c7a7b",
                  "&:hover": { bgcolor: "#276969" },
                  whiteSpace: "nowrap",
                }}
                onClick={PanVerify}
              >
                Verify
              </Button>
            </Box>
          </Grid>

          {/* Mobile */}
          <Grid item xs={12} sm={4}>
            <TextField
              name="mobile"
              label={"Primary Holder Mobile"}
              value={formik.values.mobile}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              size="small"
              fullWidth
              error={formik.touched.mobile && Boolean(formik.errors.mobile)}
              disabled={verified.mobileNo}
            />
          </Grid>

          {/* OTP */}
          <Grid item xs={12} sm={4}>
            {" "}
            {/* changed from sm={3} → sm={4} */}
            <Box display="flex" alignItems="center" gap={1}>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#4a5568",
                  "&:hover": { bgcolor: "#3b4452" },
                  whiteSpace: "nowrap",
                  px: 3,
                }}
                onClick={sendMobileOtp}
                disabled={verified.mobileNo}
              >
                Get OTP
              </Button>

              <TextField
                name="otp"
                label="Enter OTP"
                value={formik.values.otp}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                size="small"
                fullWidth
                error={formik.touched.otp && Boolean(formik.errors.otp)}
                disabled={verified.mobileNo}
              />

              <Button
                variant="contained"
                sx={{
                  bgcolor: "#2c7a7b",
                  "&:hover": { bgcolor: "#276969" },
                  whiteSpace: "nowrap",
                }}
                onClick={verifyMobileOtp}
                disabled={verified.mobileNo}
              >
                Verify
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* 2️⃣ Name Details */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {/* First Name */}
          <Grid item xs={12} sm={4}>
            <TextField
              name="firstName"
              label="First Name"
              size="small"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              fullWidth
              error={
                formik.touched.firstName && Boolean(formik.errors.firstName)
              }
              disabled={fieldsDisabled.firstName}
            />
          </Grid>

          {/* Middle Name */}
          <Grid item xs={12} sm={4}>
            <TextField
              name="middleName"
              label="Middle Name"
              size="small"
              value={formik.values.middleName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              fullWidth
              // optional: no validation on middle name
              error={
                formik.touched.middleName && Boolean(formik.errors.middleName)
              }
              disabled={fieldsDisabled.middleName}
            />
          </Grid>

          {/* Last Name */}
          <Grid item xs={12} sm={4}>
            <TextField
              name="lastName"
              label="Last Name"
              size="small"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              fullWidth
              error={formik.touched.lastName && Boolean(formik.errors.lastName)}
              disabled={fieldsDisabled.lastName}
            />
          </Grid>
        </Grid>

        {/* 3️⃣ DOB + Gender */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {/* DOB */}
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date of Birth"
                value={formik.values.dob}
                referenceDate={dayjs().subtract(25, "year")}
                maxDate={dayjs().subtract(18, "year")} //  future dates disabled
                onChange={(value) => {
                  formik.setFieldValue("dob", value);
                }}
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
                    error: formik.touched.dob && Boolean(formik.errors.dob),
                    inputProps: { readOnly: true }, // optional UX improvement
                  },
                }}
                disabled={fieldsDisabled.dob}
              />
            </LocalizationProvider>
          </Grid>

          {/* Gender */}
          <Grid item xs={12} sm={6}>
            <FormControl
              fullWidth
              error={formik.touched.gender && Boolean(formik.errors.gender)}
            >
              <InputLabel id="gender-label">Gender</InputLabel>
              <Select
                labelId="gender-label"
                name="gender"
                size="small"
                value={formik.values.gender}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                label="Gender"
                disabled={fieldsDisabled.gender}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {genderOptions.map((option) => (
                  <MenuItem key={option.value} value={option.label}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* 4️⃣ EMAIL + OTP */}
        <Grid container spacing={2} sx={{ mb: 2, alignItems: "flex-end" }}>
          {/* Email */}
          <Grid item xs={12} sm={6}>
            <TextField
              name="email"
              size="small"
              label="Email ID"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              fullWidth
              error={formik.touched.email && Boolean(formik.errors.email)}
              disabled={verified.email}
            />
          </Grid>

          {/* OTP Section */}
          <Grid item xs={12} sm={6}>
            <Grid container spacing={1} alignItems="flex-end">
              <Grid item>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: "#4a5568",
                    "&:hover": { bgcolor: "#3b4452" },
                    whiteSpace: "nowrap",
                  }}
                  onClick={SendEmailOtp}
                  disabled={verified.email}
                >
                  Get OTP
                </Button>
              </Grid>
              <Grid item xs>
                <TextField
                  name="emailOtp"
                  label="Enter OTP"
                  size="small"
                  value={formik.values.emailOtp}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  fullWidth
                  error={
                    formik.touched.emailOtp && Boolean(formik.errors.emailOtp)
                  }
                  disabled={verified.email}
                  helperText={formik.touched.emailOtp && formik.errors.emailOtp}
                />
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: "#2c7a7b",
                    "&:hover": { bgcolor: "#276969" },
                    whiteSpace: "nowrap",
                  }}
                  onClick={emailVerify}
                  disabled={verified.email}
                >
                  Verify Email
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* 5️⃣ ADDRESS FIELDS */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {/* Address 1 */}
          <Grid item xs={12} sm={4}>
            <TextField
              size="small"
              name="address1"
              label="Address 1"
              value={formik.values.address1}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              inputProps={{ maxLength: 40 }}
              fullWidth
              error={formik.touched.address1 && Boolean(formik.errors.address1)}
              disabled={fieldsDisabled.address1}
            />
          </Grid>

          {/* Address 2 */}
          <Grid item xs={12} sm={4}>
            <TextField
              size="small"
              name="address2"
              label="Address 2"
              value={formik.values.address2}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              inputProps={{ maxLength: 40 }}
              fullWidth
              error={formik.touched.address2 && Boolean(formik.errors.address2)}
              disabled={fieldsDisabled.address2}
            />
          </Grid>

          {/* Address 3 */}
          <Grid item xs={12} sm={4}>
            <TextField
              size="small"
              name="address3"
              label="Address 3"
              value={formik.values.address3}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              inputProps={{ maxLength: 40 }}
              fullWidth
              error={formik.touched.address3 && Boolean(formik.errors.address3)}
              disabled={fieldsDisabled.address3}
            />
          </Grid>
        </Grid>

        {/* 6️⃣ COUNTRY / STATE / CITY / PINCODE */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {/* Country */}
          <Grid item xs={12} sm={3}>
            {/* <TextField onBlur={formik.handleBlur} size="small" fullWidth /> */}
            <FormControl
              fullWidth
              size="small"
              error={formik.touched.country && Boolean(formik.errors.country)}
            >
              <InputLabel>Country</InputLabel>
              <Select
                name="country"
                label="Country"
                value={formik.values.country}
                onChange={formik.handleChange}
                disabled={fieldsDisabled.country}
              >
                <MenuItem value="">
                  <em>Select</em>
                </MenuItem>

                {Country.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* State */}
          <Grid item xs={12} sm={3}>
            {/* <TextField
              name="state"
              label="State"
              value={formik.values.state}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              size="small"
              fullWidth
              error={formik.touched.state && Boolean(formik.errors.state)}
              disabled={fieldsDisabled.state}
            /> */}
            <FormControl
              fullWidth
              size="small"
              error={formik.touched.state && Boolean(formik.errors.state)}
            >
              <InputLabel>State</InputLabel>
              <Select
                name="state"
                label="State"
                value={formik.values.state}
                onChange={formik.handleChange}
                disabled={fieldsDisabled.state}
              >
                <MenuItem value="">
                  <em>Select</em>
                </MenuItem>

                {States.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* City */}
          <Grid item xs={12} sm={3}>
            <TextField
              name="city"
              label="City"
              value={formik.values.city}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              size="small"
              fullWidth
              error={formik.touched.city && Boolean(formik.errors.city)}
              disabled={fieldsDisabled.city}
            />
          </Grid>

          {/* Pincode */}
          <Grid item xs={12} sm={3}>
            <TextField
              name="pincode"
              label="Pincode"
              value={formik.values.pincode}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              size="small"
              fullWidth
              inputProps={{ maxLength: 6 }} // optional
              error={formik.touched.pincode && Boolean(formik.errors.pincode)}
              disabled={fieldsDisabled.pincode}
            />
          </Grid>
        </Grid>

        {/* 7️⃣ FINANCIAL INFO */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {/* Income Slab */}
          {/* <Grid item xs={12} sm={3}>
            <FormControl
              fullWidth
              size="small"
              error={
                formik.touched.incomeSlab && Boolean(formik.errors.incomeSlab)
              }
            >
              <InputLabel>Income Slab</InputLabel>
              <Select
                label="Income Slab"
                name="incomeSlab"
                value={formik.values.incomeSlab}
                onChange={formik.handleChange}
              >
                <MenuItem value="">
                  <em>Select</em>
                </MenuItem>

                {genderOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid> */}

          {/* Source of Wealth */}
          {/* <Grid item xs={12} sm={3}>
            <FormControl
              fullWidth
              size="small"
              error={
                formik.touched.sourceWealth &&
                Boolean(formik.errors.sourceWealth)
              }
            >
              <InputLabel>Source of Wealth</InputLabel>
              <Select
                label="Source of Wealth"
                name="sourceWealth"
                value={formik.values.sourceWealth}
                onChange={formik.handleChange}
              >
                <MenuItem value="">
                  <em>Select</em>
                </MenuItem>

                {genderOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid> */}

          {/* Occupation */}
          <Grid item xs={12} sm={3}>
            <FormControl
              fullWidth
              size="small"
              error={
                formik.touched.occupation && Boolean(formik.errors.occupation)
              }
            >
              <InputLabel>Occupation</InputLabel>
              <Select
                label=" Occupation "
                name="occupation"
                value={formik.values.occupation}
                onChange={formik.handleChange}
              >
                <MenuItem value="">
                  <em>Select</em>
                </MenuItem>

                {occupationOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={3}>
            <FormControl
              fullWidth
              size="small"
              error={
                formik.touched.taxResident && Boolean(formik.errors.taxResident)
              }
            >
              <InputLabel>Tax Resident of Other Country</InputLabel>
              <Select
                label="Tax Resident of Other Country"
                name="taxResident"
                value={formik.values.taxResident}
                onChange={formik.handleChange}
              >
                <MenuItem value="">
                  <em>Select</em>
                </MenuItem>

                {taxOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* PEP Status */}
          {/* <Grid item xs={12} sm={3}>
            <FormControl
              fullWidth
              size="small"
              error={
                formik.touched.pepStatus && Boolean(formik.errors.pepStatus)
              }
            >
              <InputLabel>Politically Exposed Person</InputLabel>
              <Select
                label="Politically Exposeddd Politically   "
                name="pepStatus"
                value={formik.values.pepStatus}
                onChange={formik.handleChange}
              >
                <MenuItem value="">
                  <em>Select</em>
                </MenuItem>

                {DuoOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid> */}
        </Grid>

        {/* 8️⃣ TAX & BIRTH INFO */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {/* KRA Address Type */}
          {/* <Grid item xs={12} sm={3}>
            <FormControl
              fullWidth
              size="small"
              error={
                formik.touched.kraAddressType &&
                Boolean(formik.errors.kraAddressType)
              }
            >
              <InputLabel>KRA Address Type</InputLabel>
              <Select
                label="KRA Address Type"
                name="kraAddressType"
                value={formik.values.kraAddressType}
                onChange={formik.handleChange}
              >
                <MenuItem value="">
                  <em>Select</em>
                </MenuItem>

                {genderOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid> */}

          {/* Tax Resident of Other Country */}
          {/* <Grid item xs={12} sm={3}>
            <FormControl
              fullWidth
              size="small"
              error={
                formik.touched.taxResident && Boolean(formik.errors.taxResident)
              }
            >
              <InputLabel>Tax Resident of Other Country</InputLabel>
              <Select
                label="Tax Resident of Other Country"
                name="taxResident"
                value={formik.values.taxResident}
                onChange={formik.handleChange}
              >
                <MenuItem value="">
                  <em>Select</em>
                </MenuItem>

                {taxOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid> */}

          {/* Place of Birth */}
          {/* <Grid item xs={12} sm={3}>
            <TextField
              name="placeOfBirth"
              label="Place of Birth"
              value={formik.values.placeOfBirth}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              size="small"
              fullWidth
              error={
                formik.touched.placeOfBirth &&
                Boolean(formik.errors.placeOfBirth)
              }
            />
          </Grid> */}

          {/* Country of Birth */}
          {/* <Grid item xs={12} sm={3}>
            <TextField
              name="countryOfBirth"
              label="Country of Birth"
              value={formik.values.countryOfBirth}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              size="small"
              fullWidth
              error={
                formik.touched.countryOfBirth &&
                Boolean(formik.errors.countryOfBirth)
              }
            />
          </Grid> */}
        </Grid>

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "20px",
          }}
        >
          <button
            type="button"
            onClick={goPrev}
            style={{
              padding: "8px 20px",
              background: "#a0a0a0",
              color: "#fff",
              borderRadius: "6px",
              border: "none",
            }}
          >
            Prev
          </button>

          <button
            type="submit"
            disabled={!isFormComplete}
            style={{
              padding: "8px 20px",
              background: isFormComplete ? "#1c3c6b" : "#9aa5b1",
              color: "#fff",
              borderRadius: "6px",
              border: "none",
              cursor: isFormComplete ? "pointer" : "not-allowed",
            }}
          >
            Next
          </button>
        </div>
      </form>
    </>
  );
};

export default HolderDetails;
