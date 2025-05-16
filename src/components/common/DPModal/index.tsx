import { useState } from "react";
import {
  Button,
  Modal as ReactstrapModal,
  ModalBody,
  Col,
  Row,
  Input,
} from "reactstrap";
import { TextField } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { regEx } from "../../../helper/method";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { AuthUser } from "../../../redux/thunk/AuthUser";
import { updateUserId } from "../../../redux/slices/Login/login";
import ShowToast from "../../../utils/toastUtils";
import { useMediaQuery } from "rsuite/esm/useMediaQuery/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
// import { isAdminAccess } from "../../../helper/commmon";

interface CustomModalProps {
  tog_center: () => void;
  modal_center: boolean;
  setmodal_center: React.Dispatch<React.SetStateAction<boolean>>;
  getUserDetails?: (value: any) => void;
  row?: any;
  handleApproval?: (value: any, remark: string, entryFlag: string) => void;
  Msg?: string;
  activeSubItem?: any;
  action?: "approve" | "reject";
  expiredtime?: boolean;
  isAdmin?: boolean;
  isUploadMode?: boolean;
  handleFileUpload?: (selectedRow: string, file: File, remark: string) => void;
}

const CustomModal = ({
  tog_center,
  modal_center,
  setmodal_center,
  getUserDetails,
  row,
  Msg,
  action,
  handleApproval,
  activeSubItem,
  expiredtime,
  isAdmin,
  isUploadMode,
  handleFileUpload,
}: CustomModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // const { name } = useSelector(
  //   (state: RootState) => state.AuthUser?.data?.data
  // );

  const handleSessionClear = () => {
    localStorage.clear();
    sessionStorage.clear();
    setmodal_center(false);
    navigate("/");
  };

  const formik = useFormik({
    initialValues: { remark: "", userChangeValue: "", userPanValue: "" },
    validationSchema: Yup.object({
      // Remark validation for "Communication Retrival Checker"
      ...((activeSubItem === "Communication Retrival Checker" ||
        activeSubItem === "KYC Approval" ||
        activeSubItem === "RH Approval") && {
        remark: Yup.string().trim().required("Remark is required"),
      }),

      // Admin validation for userChangeValue
      ...(isAdmin && {
        userChangeValue: Yup.string()
          .trim()
          .matches(/^[0-9]{4}$/, "Client code must be exactly 4 digits")
          .required("Client code is required"),

        userPanValue: Yup.string()
          .trim()
          .matches(/[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN number format")
          .required("PAN number is required"),
      }),
    }),
    onSubmit: (values) => {
      if (getUserDetails && row) {
        getUserDetails(row);
      }
      setmodal_center(false);

      if (action && row) {
        const entryFlag = action === "approve" ? "A" : "R";
        if (activeSubItem === "Communication Retrival Checker") {
          handleApproval?.(row, values.remark, entryFlag);
        } else if (activeSubItem === "KYC Approval") {
          handleApproval?.(row, values.remark, entryFlag);
        } else if (activeSubItem === "RH Approval") {
          handleApproval?.(row, values.remark, entryFlag);
        }
        console.log(values.remark, "values.remark", row, entryFlag);
        formik.resetForm();
      }
    },
  });

  const handleClose = () => {
    setmodal_center(false);
    formik.resetForm();
  };

  const handleCustomChange = (event: any) => {
    const { name, value } = event.target;
    console.log("eventCheck", name, value);

    if (name === "userChangeValue") {
      if (regEx.number.test(value)) {
        formik.setFieldValue(name, value.replace(/\s/g, ""));
      }
    } else if (name === "userPanValue") {
      const sanitizedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
      formik.setFieldValue(name, sanitizedValue);
    } else {
      formik.handleChange(event);
    }
  };

  const handleUserClick = async () => {
    const errors = await formik.validateForm();

    if (Object.keys(errors).length > 0) {
      formik.setTouched({
        userChangeValue: true,
        userPanValue: true,
      });
      return;
    }

    let payload = {
      user_id: `EMP-${formik.values.userChangeValue}`,
      user_type: "Employee",
      auth_type: "PAN",
      auth_value: formik.values.userPanValue,
    };
    dispatch(showLoader(""));
    dispatch(AuthUser(payload))
      .unwrap()
      .then((response) => {
        console.log("2FAresponse", response);
        if (response?.status === 200) {
          const { token } = response?.data;

          setTimeout(() => {
            console.log("2FA_Response", response?.data);
            localStorage.setItem("authenticated", "true");
            localStorage.setItem("tkn", token);
            // localStorage.setItem("userName", name);
            dispatch(updateUserId(`EMP-${formik.values.userChangeValue}`));
            setmodal_center(false);
            formik.resetForm();
            window.location.reload();
          }, 250);
          // navigate("/dashboard");
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

  const handleFileUploadClick = () => {
    if (selectedFile && handleFileUpload) {
      console.log("rowCheck-->", row);

      handleFileUpload(row, selectedFile, formik.values.remark);
      setSelectedFile(null);
      setmodal_center(false);
      formik.setFieldValue("remark", "");
    } else {
      ShowToast("error", "Please select a file to upload.");
    }
  };

  return (
    <ReactstrapModal
      isOpen={modal_center}
      toggle={tog_center}
      centered
      backdrop={expiredtime ? "static" : undefined} // Disable clicking outside for expired token modal
      keyboard={expiredtime ? false : undefined}
    >
      <ModalBody className="text-center p-3">
        {activeSubItem !== "Communication Retrival Checker" && !isAdmin && (
          <i className="ri-alert-line display-5 text-warning"></i>
        )}
        {isAdmin && (
          <ChangeCircleIcon sx={{ color: "#11395C", fontSize: "3.5rem" }} />
        )}

        <div className="mt-4" style={{ fontFamily: "Public Sans" }}>
          {activeSubItem === "DP Debit Recovery" && !isAdmin ? (
            <>
              <h6 className="mb-4">
                An email will be sent informing the client about his DP Debit
                dues along with a link for payment.
              </h6>
              <h6 className="mb-3">{Msg}</h6>
            </>
          ) : (
            <h6 className="mb-3">{Msg}</h6>
          )}
        </div>

        <form onSubmit={formik.handleSubmit}>
          {(activeSubItem === "Communication Retrival Checker" ||
            activeSubItem === "KYC Approval" ||
            activeSubItem === "RH Approval") && (
            <TextField
              label="Enter Remark *"
              variant="outlined"
              fullWidth
              size="small"
              value={formik.values.remark}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name="remark"
              error={formik.touched.remark && Boolean(formik.errors.remark)}
              helperText={formik.touched.remark && formik.errors.remark}
            />
          )}
          {isAdmin && (
            <Row
              className=""
              style={{
                gap: isMobile ? "1rem" : "0",
                fontFamily: "Public Sans",
              }}
            >
              <Col xs={12}>
                <TextField
                  size="small"
                  label="Enter Client Code"
                  variant="outlined"
                  name="userChangeValue"
                  value={formik.values.userChangeValue}
                  onChange={handleCustomChange}
                  onBlur={formik.handleBlur}
                  InputProps={{ startAdornment: "EMP- " }}
                  fullWidth
                  inputProps={{ maxLength: 4 }}
                  sx={{ width: isMobile ? "100%" : "50%" }}
                  error={
                    formik.touched.userChangeValue &&
                    Boolean(formik.errors.userChangeValue)
                  }
                  helperText={
                    formik.touched.userChangeValue &&
                    formik.errors.userChangeValue
                  }
                />
              </Col>
              <Col xs={12}>
                <TextField
                  size="small"
                  label="Enter PAN Number"
                  variant="outlined"
                  name="userPanValue"
                  value={formik.values.userPanValue}
                  onChange={handleCustomChange}
                  onBlur={formik.handleBlur}
                  fullWidth
                  inputProps={{ maxLength: 10 }}
                  sx={{ width: isMobile ? "100%" : "50%" }}
                  error={
                    formik.touched.userPanValue &&
                    Boolean(formik.errors.userPanValue)
                  }
                  helperText={
                    formik.touched.userPanValue && formik.errors.userPanValue
                  }
                />
              </Col>
              <Row
                style={{
                  // gap: isMobile ? "0.5rem" : "0",
                  justifyContent: "center",
                }}
              >
                <Col
                  xs={6}
                  style={{ display: "flex", justifyContent: "flex-start" }}
                >
                  <Button
                    className="btn"
                    style={{
                      width: isMobile ? "100%" : "150px",
                      backgroundColor: "#11395C",
                      borderColor: "#11395C",
                    }}
                    onClick={handleClose}
                  >
                    Cancel
                  </Button>
                </Col>
                <Col
                  xs={6}
                  style={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <Button
                    variant="contained"
                    style={{
                      width: isMobile ? "100%" : "150px",
                      backgroundColor: "#EE4B2B",
                      borderColor: "#EE4B2B",
                    }}
                    onClick={handleUserClick}
                  >
                    Change
                  </Button>
                </Col>
              </Row>
            </Row>
          )}
          {!isAdmin && !isUploadMode && (
            <div className="hstack gap-2 pt-2 justify-content-center">
              {expiredtime || activeSubItem === "UCCCode MATCH" ? (
                <Button
                  className="btn"
                  style={{
                    width: "80px",
                    backgroundColor: "#11395C",
                    borderColor: "#11395C",
                  }}
                  onClick={
                    expiredtime
                      ? handleSessionClear
                      : () => {
                          setmodal_center(false);
                          console.log("clicked Regulator Announcements");
                        }
                  }
                >
                  OK
                </Button>
              ) : (
                <>
                  <Button
                    className="btn"
                    style={{
                      backgroundColor: "#EE4B2B",
                      borderColor: "#EE4B2B",
                    }}
                    onClick={handleClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="btn"
                    style={{ width: "80px", backgroundColor: "#11395C" }}
                    type="submit"
                  >
                    Yes
                  </Button>
                </>
              )}
            </div>
          )}
          {isUploadMode && (
            <Col lg={12} style={{ padding: "16px" }}>
              <label style={{ fontSize: "12px" }} className="form-label">
                Upload Proof of Communication
              </label>
              <Input
                name="uploadProof"
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                className="form-control mb-3"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setSelectedFile(e.target.files[0]);
                  }
                }}
                style={{ width: "100%", minHeight: "40px" }}
              />
              <TextField
                label="Enter Remark"
                variant="outlined"
                fullWidth
                size="small"
                className="mb-3"
                value={formik.values.remark}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="remark"
                error={formik.touched.remark && Boolean(formik.errors.remark)}
                helperText={formik.touched.remark && formik.errors.remark}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                }}
              >
                <Button
                  className="btn"
                  style={{
                    backgroundColor: "#EE4B2B",
                    borderColor: "#EE4B2B",
                  }}
                  onClick={() => {
                    handleClose();
                    setSelectedFile(null);
                    setmodal_center(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="btn"
                  style={{
                    width: "80px",
                    backgroundColor: "#11395C",
                  }}
                  onClick={handleFileUploadClick}
                >
                  Upload
                </Button>
              </div>
            </Col>
          )}
        </form>
      </ModalBody>
    </ReactstrapModal>
  );
};

export default CustomModal;
