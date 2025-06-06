import { useEffect, useRef, useState } from "react";
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
import { pdfjs, Document, Page } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

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
  setShowImg?: any;
  previewUrl?: any;
  setSetShowImg?: any;
  showDocument?: any;
  fileExtension?: any;
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
  setShowImg,
  previewUrl,
  setSetShowImg,
  showDocument,
  fileExtension,
}: CustomModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [scrollPos, setScrollPos] = useState({ left: 0, top: 0 });
  const [pdfPageNumber, setPdfPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // const isImage = ["jpg", "jpeg", "png", "gif", "bmp"].includes(
  //   fileExtension.toLowerCase()
  // );
  // const isPDF = fileExtension.toLowerCase() === "pdf";

  // const { name } = useSelector(
  //   (state: RootState) => state.AuthUser?.data?.data
  // );

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("TestProps", action, row, activeSubItem);
  }, [action, row, activeSubItem]);

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
        activeSubItem === "RH Approval" ||
        activeSubItem === "Pre Trade Approval") &&
        !isAdmin && {
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
      console.log("test112121212", action, row);
      if (action && row) {
        const entryFlag = action === "approve" ? "A" : "R";
        if (
          [
            "Communication Retrival Checker",
            "KYC Approval",
            "RH Approval",
            "Pre Trade Approval",
          ].includes(activeSubItem)
        ) {
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
    setZoomLevel(1);
    setIsDragging(false);
    setScrollPos({ left: 0, top: 0 });
    setPdfPageNumber(1);
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
            localStorage.setItem("Id", `EMP-${formik.values.userChangeValue}`);
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

  const renderHeaderIcon = () => {
    if (isAdmin) {
      return <ChangeCircleIcon sx={{ color: "#11395C", fontSize: "3.5rem" }} />;
    }
    if (
      ![
        "Communication Retrival Checker",
        "Pre Trade Proof Upload",
        "Pre Trade Report",
        "Pre Trade Approval",
      ].includes(activeSubItem) &&
      !showDocument &&
      !isAdmin
    ) {
      return <i className="ri-alert-line display-5 text-warning"></i>;
    }
    return null;
  };

  const renderMessage = () => {
    if (activeSubItem === "DP Debit Recovery" && !isAdmin) {
      return (
        <>
          <h6 className="mb-4">
            An email will be sent informing the client about his DP Debit dues
            along with a link for payment.
          </h6>
          <h6 className="mb-3">{Msg}</h6>
        </>
      );
    }
    return <h6 className="mb-3">{Msg}</h6>;
  };

  const shouldShowRemarkField = () =>
    ["Communication Retrival Checker", "KYC Approval", "RH Approval"].includes(
      activeSubItem
    ) ||
    (activeSubItem === "Pre Trade Approval" && !showDocument && !isAdmin);

  const renderRemarkField = () => (
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
  );
  const renderAdminFields = () => (
    <Row style={{ gap: isMobile ? "1rem" : "0", fontFamily: "Public Sans" }}>
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
            formik.touched.userChangeValue && formik.errors.userChangeValue
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
            formik.touched.userPanValue && Boolean(formik.errors.userPanValue)
          }
          helperText={formik.touched.userPanValue && formik.errors.userPanValue}
        />
      </Col>
      <Row style={{ justifyContent: "center" }}>
        <Col xs={6} style={{ display: "flex", justifyContent: "flex-start" }}>
          <Button
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
        <Col xs={6} style={{ display: "flex", justifyContent: "flex-end" }}>
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
  );

  const renderConfirmationButtons = () => (
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
            style={{ backgroundColor: "#EE4B2B", borderColor: "#EE4B2B" }}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            className="btn"
            type="submit"
            style={{ width: "80px", backgroundColor: "#11395C" }}
          >
            Yes
          </Button>
        </>
      )}
    </div>
  );

  const renderUploadSection = () => (
    <>
      <div style={{ fontFamily: "Public Sans" }}>
        <h5 style={{ margin: 0, fontWeight: 700 }}>
          Upload Proof of Communication
        </h5>
      </div>
      <Col lg={12} style={{ padding: "16px" }}>
        <Input
          name="uploadProof"
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          className="form-control mb-3"
          onChange={(e) => e.target.files && setSelectedFile(e.target.files[0])}
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
          style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}
        >
          <Button
            className="btn"
            style={{ backgroundColor: "#EE4B2B", borderColor: "#EE4B2B" }}
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
            style={{ width: "80px", backgroundColor: "#11395C" }}
            onClick={handleFileUploadClick}
          >
            Upload
          </Button>
        </div>
      </Col>
    </>
  );

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.2, 1));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    const container = containerRef.current;
    if (container) {
      setScrollPos({ left: container.scrollLeft, top: container.scrollTop });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const container = containerRef.current;
    if (container) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      container.scrollLeft = scrollPos.left - dx;
      container.scrollTop = scrollPos.top - dy;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const renderImagePreview = () => {
    const extension = fileExtension?.toLowerCase(); // optional chaining
    const isImage = [".png", ".jpg", ".jpeg"].includes(extension);
    const isPDF = extension === ".pdf";

    return (
      <div style={{ textAlign: "center" }}>
        <div
          key={`${fileExtension}-${previewUrl}`}
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{
            width: "100%",
            maxHeight: "400px",
            overflow: "auto",
            border: "1px solid #ccc",
            borderRadius: "10px",
            cursor: isDragging ? "grabbing" : "grab",
            display: "flex",
            // alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isImage && (
            <img
              src={previewUrl}
              onLoad={() => setSetShowImg(true)}
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: "top left",
                transition: "transform 0.2s ease",
                maxWidth: "unset",
                maxHeight: "unset",
                width: "auto",
                height: "auto",
                userSelect: "none",
                pointerEvents: "none",
              }}
            />
          )}

          {isPDF && (
            <Document
              file={previewUrl}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              loading="Loading PDF..."
            >
              <Page
                pageNumber={pdfPageNumber}
                width={440 * zoomLevel}
                renderAnnotationLayer={false}
                renderTextLayer={false}
              />
            </Document>
          )}
        </div>

        {(isImage || isPDF) && (
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              justifyContent: "space-between",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <Button
              onClick={handleZoomOut}
              variant="outlined"
              disabled={zoomLevel <= 1}
              style={{
                minWidth: "80px",
                height: "30px",
                fontSize: "12px",
                padding: "4px 8px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              Zoom Out
            </Button>
            {isPDF && numPages > 1 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                <Button
                  // size="small"
                  onClick={() =>
                    setPdfPageNumber((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={pdfPageNumber <= 1}
                  style={{
                    minWidth: "80px",
                    height: "30px",
                    fontSize: "12px",
                    padding: "4px 8px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  Prev
                </Button>
                <span>
                  Page {pdfPageNumber} of {numPages}
                </span>
                <Button
                  onClick={() =>
                    setPdfPageNumber((prev) => Math.min(prev + 1, numPages))
                  }
                  disabled={pdfPageNumber >= numPages}
                  style={{
                    minWidth: "80px",
                    height: "30px",
                    fontSize: "12px",
                    padding: "4px 8px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  Next
                </Button>
              </div>
            )}
            <Button
              onClick={handleZoomIn}
              variant="outlined"
              disabled={zoomLevel >= 3}
              style={{
                minWidth: "80px",
                height: "30px",
                fontSize: "12px",
                padding: "4px 8px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              Zoom In
            </Button>
          </div>
        )}
      </div>
    );
  };
  return (
    <ReactstrapModal
      isOpen={modal_center}
      toggle={tog_center}
      centered
      backdrop={expiredtime ? "static" : undefined} // Disable clicking outside for expired token modal
      keyboard={expiredtime ? false : undefined}
      style={{ maxWidth: setShowImg ? "700px" : "500px" }}
    >
      <ModalBody className="text-center p-3">
        {!expiredtime && (
          <i
            className="ri-close-line"
            onClick={() => {
              setmodal_center(false);
              setSelectedFile(null);
              handleClose();
            }}
            style={{
              position: "absolute",
              top: "-6px",
              right: "-1px",
              fontSize: "1.5rem",
              cursor: "pointer",
              zIndex: 1000,
              color: "#000",
            }}
          />
        )}
        {/*  here Icons based on Conditions */}
        {renderHeaderIcon()}
        {/* Message Section */}
        <div className="mt-4" style={{ fontFamily: "Public Sans" }}>
          {renderMessage()}
        </div>
        {/* Main Form */}
        <form onSubmit={formik.handleSubmit}>
          {shouldShowRemarkField() && renderRemarkField()}
          {isAdmin && renderAdminFields()}

          {!isAdmin &&
            !isUploadMode &&
            !setShowImg &&
            renderConfirmationButtons()}

          {isUploadMode && renderUploadSection()}

          {setShowImg && renderImagePreview()}
        </form>
      </ModalBody>
    </ReactstrapModal>
  );
};

export default CustomModal;
