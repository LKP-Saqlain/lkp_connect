import { Box, Grid, TextField, Button } from "@mui/material";
import { useFormik } from "formik";
import {
  holdingCountOptions,
  normalizeKycData,
} from "../../../../../../pages/MutualFund/mfTypes";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../../../redux/store";
import {
  hideLoader,
  showLoader,
} from "../../../../../../redux/slices/loaderSlice";
import { apiServices } from "../../../../../../services";
import ShowToast from "../../../../../../utils/toastUtils";
import CkycModal from "../../CkycModal";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const index = ({
  holderIndex,
  navDirection,
  goPrev,
  goNext,
  primaryPan,
  previousPayload,
  setPreviousPayload,
}: any) => {
  const [verified, setVerified] = useState({
    pan: false,
    mobileOtp: false,
    emailOtp: false,
  });
  const [ckycFlag, setCkycFlag] = useState<boolean>(true);
  const [showCkycModal, setShowCkycModal] = useState(false);
  const [cKycRequestId, setCKycRequestId] = useState("");
  const [fieldsDisabled, setFieldsDisabled] = useState({
    firstName: false,
    middleName: false,
    lastName: false,
    dob: false,
  });

  const dispatch = useDispatch<AppDispatch>();

  const prefix = holderIndex === 2 ? "secondHolder" : "thirdHolder";

  useEffect(() => {
    // Determine prefix dynamically
    const prefix = holderIndex === 2 ? "secondHolder" : "thirdHolder";

    // Reset form for new holder
    formik.resetForm({
      values: {
        [`${prefix}PAN`]: "",
        [`${prefix}MobileNo`]: "",
        [`${prefix}Otp`]: "",
        [`${prefix}FirstName`]: "",
        [`${prefix}MiddleName`]: "",
        [`${prefix}LastName`]: "",
        [`${prefix}DOB`]: null,
        [`${prefix}Email`]: "",
        [`${prefix}EmailOtp`]: "",
      },
    });

    setVerified({ pan: false, mobileOtp: false, emailOtp: false });
    setFieldsDisabled({
      firstName: false,
      middleName: false,
      lastName: false,
      dob: false,
    });

    // Only fetch previous data if going back
    if (navDirection === "prev") {
      previousData();
    }
  }, [holderIndex, navDirection]);

  const holderLabel =
    holdingCountOptions.find((h) => h.count === holderIndex)?.label ||
    `Holder ${holderIndex}`;

  useEffect(() => {
    if (navDirection === "prev") {
      previousData();
    }
    console.log(previousPayload, "previousPayload");
  }, [navDirection]);

  const formik = useFormik({
    initialValues: {
      [`${prefix}PAN`]: "",
      [`${prefix}MobileNo`]: "",
      [`${prefix}Otp`]: "",
      [`${prefix}FirstName`]: "",
      [`${prefix}MiddleName`]: "",
      [`${prefix}LastName`]: "",
      [`${prefix}DOB`]: null, // DatePicker expects null or a dayjs object
      [`${prefix}Email`]: "",
      [`${prefix}EmailOtp`]: "",
    },
    onSubmit: (values) => {
      console.log("Second/Third Form Data:", values);
      SendData(values);

      formik.resetForm();
    },
  });

  const PanVerify = () => {
    if (!formik.values[`${prefix}PAN`]) return;
    const payload = {
      panno: formik.values[`${prefix}PAN`],
    };
    dispatch(showLoader("Fetching Client Code..."));
    apiServices
      .PanVerification(payload)
      .then((response: any) => {
        const data = response?.data?.data[0];
        console.log("PanVerification Response:", data);
        if (data?.lkppresentstatus || !data?.lkppresentstatus) {
          setVerified((prev) => ({
            ...prev,
            pan: true,
          }));
          if (data?.lkppresentstatus) {
            setCkycFlag(false);
          }
          // ShowToast("info", data?.message);
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
    if (!verified.pan) {
      ShowToast("info", "Please verify PAN first");
      return;
    }
    const payload = {
      panno: formik.values[`${prefix}PAN`],
      mobileNo: formik.values[`${prefix}MobileNo`],
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
    if (formik.values[`${prefix}Otp`] === "") {
      ShowToast("info", "Please enter otp");
      return;
    }
    const payload = {
      ckycOtpFlag: ckycFlag,
      otp: formik.values[`${prefix}Otp`]?.toString(),
      request_id: ckycFlag ? cKycRequestId : "0",
      panno: formik.values[`${prefix}PAN`],
    };
    dispatch(showLoader("Fetching Client Code..."));
    apiServices
      .KYCOtpVerification(payload)
      .then((response: any) => {
        const data = response?.data?.data;
        if (data?.status === 1) {
          const normalizedData = normalizeKycData(data, ckycFlag);

          console.log("Normalized KYC Data:", normalizedData);

          // Update Formik values
          formik.setValues((prev: any) => ({
            ...prev,
            [`${prefix}FirstName`]: normalizedData.firstName,
            [`${prefix}MiddleName`]: normalizedData.middleName,
            [`${prefix}LastName`]: normalizedData.lastName,
            [`${prefix}Email`]: normalizedData.email,
            [`${prefix}DOB`]: normalizedData.dob,
          }));
          setFieldsDisabled({
            firstName: !!normalizedData.firstName,
            middleName: !!normalizedData.middleName,
            lastName: !!normalizedData.lastName,
            dob: !!normalizedData.dob,
          });
          setVerified((prev) => ({
            ...prev,
            mobileOtp: true,
          }));
        } else {
          ShowToast("error", "Verification Failed");
        }
      })
      .catch((error: any) => {
        console.error("PhysicalClientInfo Error:", error);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  const emailVerify = ({ otp, pan }: any) => {
    if (!formik.values[`${prefix}Email`]) {
      ShowToast("info", "Email is missing");
      return;
    }
    if (!formik.values[`${prefix}EmailOtp`]) {
      ShowToast("info", "Otp   is missing");
      return;
    }
    const payload = {
      otp,
      panno: pan,
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
            emailOtp: true,
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

  const SendEmailOtp = ({ email, pan }: any) => {
    if (!pan) {
      ShowToast("info", "PAN card missing");
      return;
    }
    if (!verified.pan) {
      ShowToast("info", "Please verify PAN first");
      return;
    }
    if (!email) {
      ShowToast("info", "Email is missing");
      return;
    }
    const payload = {
      email,
      panno: pan,
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

  const previousData = () => {
    const payload = {
      panno: primaryPan, // or hardcoded for testing
      // panno: "testt1234b", // or hardcoded for testing
    };

    dispatch(showLoader("Fetching Previous Data..."));

    apiServices
      .GetPhysicalClientDetails(payload)
      .then((response: any) => {
        const data = response?.data?.data;

        console.log("PREFIX:", prefix);
        console.log("Previous Data:", data);

        // dynamically select fields based on prefix
        const formikFields = {
          [`${prefix}PAN`]: data[`${prefix}PAN`] || "",
          [`${prefix}MobileNo`]: data[`${prefix}MobileNo`] || "",
          [`${prefix}FirstName`]: data[`${prefix}FirstName`] || "",
          [`${prefix}MiddleName`]: data[`${prefix}MiddleName`] || "",
          [`${prefix}LastName`]: data[`${prefix}LastName`] || "",
          [`${prefix}Email`]: data[`${prefix}Email`] || "",
          [`${prefix}DOB`]: data[`${prefix}DOB`]
            ? dayjs(data[`${prefix}DOB`], "DD/MM/YYYY")
            : null,

          // data[`${prefix}DOB`] || "",
        };

        formik.setValues((prev: any) => ({
          ...prev,
          ...formikFields,
        }));
      })
      .catch((error: any) => {
        console.error("PhysicalClientInfo Error:", error);
        ShowToast("error", "Failed to fetch previous data");
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  const SendData = (values: any) => {
    const payload = {
      ...previousPayload,
      primaryHolderPAN: primaryPan,
      [`${prefix}PAN`]: values[`${prefix}PAN`],
      [`${prefix}MobileNo`]: values[`${prefix}MobileNo`],
      [`${prefix}FirstName`]: values[`${prefix}FirstName`],
      [`${prefix}MiddleName`]: values[`${prefix}MiddleName`],
      [`${prefix}LastName`]: values[`${prefix}LastName`],
      [`${prefix}Email`]: values[`${prefix}Email`],
      [`${prefix}DOB`]: dayjs(values[`${prefix}DOB`]).format("DD/MM/YYYY"),
      [`${prefix}KYCType`]: ckycFlag ? "C" : "K",
      [`${prefix}CKYCNumber`]: ckycFlag ? cKycRequestId : "",
      [`${prefix}PANExempt`]: "N",
      clientType: "p",
    };
    console.log(payload, "SendData");

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

  const isFormComplete =
    formik.values[`${prefix}PAN`] &&
    formik.values[`${prefix}MobileNo`] &&
    formik.values[`${prefix}FirstName`] &&
    formik.values[`${prefix}LastName`] &&
    formik.values[`${prefix}Email`] &&
    formik.values[`${prefix}DOB`] &&
    verified.pan &&
    verified.mobileOtp &&
    verified.emailOtp;

  return (
    <div>
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
        {holderLabel} Details
      </h4>

      <form onSubmit={formik.handleSubmit}>
        {/* PAN + MOBILE + OTP */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {/* PAN + Verify */}
          <Grid item xs={12} sm={4}>
            <Box display="flex" gap={1}>
              <TextField
                name={`${prefix}PAN`}
                label={`${holderLabel} PAN`}
                value={formik.values[`${prefix}PAN`]}
                onChange={formik.handleChange}
                size="small"
                fullWidth
                inputProps={{ maxLength: 10 }}
                disabled={verified.pan}
              />

              <Button
                variant="contained"
                sx={{
                  bgcolor: "#2c7a7b",
                  "&:hover": { bgcolor: "#276969" },
                  whiteSpace: "nowrap",
                }}
                disabled={verified.pan}
                onClick={() => PanVerify()}
              >
                {verified.pan ? "Verified" : "Verify"}
              </Button>
            </Box>
          </Grid>

          {/* Mobile */}
          <Grid item xs={12} sm={4}>
            <TextField
              name={`${prefix}MobileNo`}
              label={`${holderLabel} Mobile`}
              value={formik.values[`${prefix}MobileNo`]}
              onChange={formik.handleChange}
              size="small"
              fullWidth
              disabled={verified.mobileOtp}
              inputProps={{ maxLength: 10 }}
            />
          </Grid>

          {/* OTP */}
          <Grid item xs={12} sm={4}>
            <Box display="flex" alignItems="center" gap={1}>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#4a5568",
                  "&:hover": { bgcolor: "#3b4452" },
                  whiteSpace: "nowrap",
                  px: 3,
                }}
                onClick={() => {
                  console.log(
                    "Get OTP for",
                    formik.values[`${prefix}MobileNo`]
                  );
                  sendMobileOtp();
                }}
                disabled={verified.mobileOtp}
              >
                Get OTP
              </Button>

              <TextField
                name={`${prefix}Otp`}
                label="Enter OTP"
                value={formik.values[`${prefix}Otp`]}
                onChange={formik.handleChange}
                size="small"
                fullWidth
                disabled={verified.mobileOtp}
              />

              <Button
                variant="contained"
                sx={{
                  bgcolor: "#2c7a7b",
                  "&:hover": { bgcolor: "#276969" },
                  whiteSpace: "nowrap",
                }}
                onClick={verifyMobileOtp}
                disabled={verified.mobileOtp}
              >
                {verified.mobileOtp ? "Verified" : "Verify"}
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* NAME */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={4}>
            <TextField
              name={`${prefix}FirstName`}
              label="First Name"
              value={formik.values[`${prefix}FirstName`]}
              onChange={formik.handleChange}
              size="small"
              fullWidth
              disabled={fieldsDisabled.firstName}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              name={`${prefix}MiddleName`}
              label="Middle Name"
              value={formik.values[`${prefix}MiddleName`]}
              onChange={formik.handleChange}
              size="small"
              fullWidth
              disabled={fieldsDisabled.middleName}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              name={`${prefix}LastName`}
              label="Last Name"
              value={formik.values[`${prefix}LastName`]}
              onChange={formik.handleChange}
              size="small"
              fullWidth
              disabled={fieldsDisabled.lastName}
            />
          </Grid>
        </Grid>

        {/* EMAIL */}
        <Grid container spacing={2} sx={{ mb: 2, alignItems: "flex-end" }}>
          {/* Email */}
          <Grid item xs={12} sm={3}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date of Birth"
                value={
                  formik.values[`${prefix}DOB`]
                    ? dayjs(formik.values[`${prefix}DOB`])
                    : null
                }
                referenceDate={dayjs().subtract(25, "year")}
                maxDate={dayjs().subtract(18, "year")} // disable future dates < 18 years old
                onChange={(value) => {
                  formik.setFieldValue(
                    `${prefix}DOB`,
                    value ? value.format("YYYY-MM-DD") : ""
                  );
                }}
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
                    error:
                      formik.touched[`${prefix}DOB`] &&
                      Boolean(formik.errors[`${prefix}DOB`]),
                    inputProps: { readOnly: true }, // optional UX improvement
                  },
                }}
                disabled={fieldsDisabled.dob}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              name={`${prefix}Email`}
              size="small"
              label="Email ID"
              value={formik.values[`${prefix}Email`]}
              onChange={formik.handleChange}
              fullWidth
              disabled={verified.emailOtp}
            />
          </Grid>

          {/* OTP Section */}
          <Grid item xs={12} sm={5}>
            <Grid container spacing={1} alignItems="flex-end">
              <Grid item>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: "#4a5568",
                    "&:hover": { bgcolor: "#3b4452" },
                    whiteSpace: "nowrap",
                  }}
                  disabled={verified.emailOtp}
                  onClick={() => {
                    SendEmailOtp({
                      email: formik.values[`${prefix}Email`],
                      pan: formik.values[`${prefix}PAN`],
                    });
                  }}
                >
                  Get OTP
                </Button>
              </Grid>

              <Grid item xs>
                <TextField
                  name={`${prefix}EmailOtp`}
                  label="Enter OTP"
                  size="small"
                  value={formik.values[`${prefix}EmailOtp`]}
                  onChange={formik.handleChange}
                  fullWidth
                  disabled={verified.emailOtp}
                />
              </Grid>

              <Grid item>
                <Button
                  variant="contained"
                  disabled={verified.emailOtp}
                  sx={{
                    bgcolor: "#2c7a7b",
                    "&:hover": { bgcolor: "#276969" },
                    whiteSpace: "nowrap",
                  }}
                  onClick={() => {
                    emailVerify({
                      otp: formik.values[`${prefix}EmailOtp`],
                      pan: formik.values[`${prefix}PAN`],
                    });
                    console.log(
                      "Verify Email OTP",
                      formik.values[`${prefix}EmailOtp`]
                    );
                  }}
                >
                  {verified.emailOtp ? "Verified" : "Verify Email"}
                </Button>
              </Grid>
            </Grid>
          </Grid>
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
    </div>
  );
};

export default index;
