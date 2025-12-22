import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Container, Card, CardHeader, CardBody } from "reactstrap";
import { Button, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { apiServices } from "../../../services";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import ShowToast from "../../../utils/toastUtils";
import { formatDateTime } from "../../../helper/commmon";

interface UploadDetail {
  tp: string;
  uon: string;
  uby: string;
}
interface UploadDetail {
  tp: string;
  uon: string;
  uby: string;
}
const RegFileUpload = ({ activeSubItem }: any) => {
  const [uploadDetails, setUploadDetails] = useState<UploadDetail[]>([]);

  const dispatch = useDispatch<AppDispatch>();
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );

  const formik = useFormik({
    initialValues: {
      regNse: null,
      regBse: null,
    },
    validationSchema: Yup.object({
      regNse: Yup.mixed().required("Reg NSE file is required"),
      regBse: Yup.mixed().required("Reg BSE file is required"),
    }),
    onSubmit: (values) => {
      console.log("Form Values:", values);
    },
  });

  //  Updated to accept only .csv files
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: "regNse" | "regBse"
  ) => {
    const file = e.currentTarget.files?.[0];

    if (file && /\.csv$/i.test(file.name)) {
      // valid .csv file
      formik.setFieldValue(fieldName, file);
      formik.setFieldError(fieldName, ""); // clear old error
    } else {
      const errorMsg = "Only .csv files are accepted";
      formik.setFieldError(fieldName, errorMsg);
      ShowToast("error", errorMsg); // <<< SHOW TOAST ERROR
    }

    // allow same file to be selected again
    e.target.value = "";
  };

  const handleUpload = async (type: "nse" | "bse", file: File | null) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("File", file);
    formData.append("User_id", user_id);

    for (const [key, value] of formData.entries()) {
      console.log(` Test check${key}:`, value); // Debug check
    }

    dispatch(showLoader(""));

    try {
      const response =
        type === "nse"
          ? await apiServices.REGNSEFileUpload(formData)
          : await apiServices.REGBSEFileUpload(formData);

      console.log("Upload Response:", response);

      if (response?.status === 200) {
        ShowToast("success", response?.data?.message);
      } else {
        ShowToast("error", response?.data?.message || "Upload failed.");
      }

      formik.setFieldValue(type === "nse" ? "regNse" : "regBse", null);
    } catch (error) {
      console.error(`${type} upload error:`, error);
      ShowToast("error", "File upload failed. Please try again.");
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    let payload = {
      option: "REGMASTER",
    };
    dispatch(showLoader(""));

    apiServices
      .GetFileuploadDetails(payload)
      .then((response) => {
        if (response?.status === 200) {
          dispatch(hideLoader());
          console.log("ResponseeeGetFileuploadDetails", response?.data?.data);
          const data = response?.data?.data || [];
          setUploadDetails(data);
        }
      })
      .catch((error) => {
        console.log("errror", error);
        dispatch(hideLoader());
      });
  }, [dispatch]);

  const renderUploadBox = (
    fieldName: "regNse" | "regBse",
    file: File | null
  ) => (
    <div
      style={{
        position: "relative",
        border: "1px dashed #ced4da",
        padding: "10px",
        borderRadius: "0.25rem",
        backgroundColor: "#f8f9fa",
        width: "100%",
        cursor: "pointer",
        minHeight: "60px",
      }}
      onClick={() => document.getElementById(fieldName)?.click()}
    >
      <input
        type="file"
        id={fieldName}
        name={fieldName}
        accept=".csv" // ✅ accept only CSV files
        style={{ display: "none" }}
        onChange={(e) => handleFileChange(e, fieldName)}
      />

      {file ? (
        <>
          {file.name}
          <Tooltip title="Delete file" arrow>
            <span
              style={{
                position: "absolute",
                right: "8px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#dc3545",
                display: "flex",
                alignItems: "center",
              }}
              onClick={(e) => {
                e.stopPropagation();
                formik.setFieldValue(fieldName, null);
              }}
            >
              <CloseIcon fontSize="small" />
            </span>
          </Tooltip>
        </>
      ) : (
        <span style={{ fontSize: "13px" }}>
          <strong>Click to upload</strong> or drag and drop your{" "}
          <strong>.csv</strong> file here
        </span>
      )}

      <div className="mt-1">
        <small className="text-muted d-block" style={{ fontSize: "12px" }}>
          • Only <strong>.csv</strong> files are accepted.
        </small>
      </div>

      {formik.errors[fieldName] && formik.touched[fieldName] && (
        <div className="text-danger mt-1" style={{ fontSize: "0.85rem" }}>
          {formik.errors[fieldName] as string}
        </div>
      )}
    </div>
  );

  const nseDetails = uploadDetails.find(
    (item: any) => item.tp === "NSEREGMASTER"
  );
  const bseDetails = uploadDetails.find(
    (item: any) => item.tp === "BSEREGMASTER"
  );

  return (
    <div className="page-content page-view">
      <Container fluid>
        <Card
          style={{
            borderRadius: "15px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          }}
        >
          <CardHeader
            style={{
              borderRadius: "15px 15px 0 0",
              boxShadow: "0 -4px 8px rgba(0, 0, 0, 0.15)",
              backgroundColor: "#fff",
              padding: "0.5rem 0.8rem",
            }}
          >
            <h4 className="card-title mb-0">{activeSubItem}</h4>
          </CardHeader>

          <CardBody>
            <form onSubmit={formik.handleSubmit}>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "20px",
                  justifyContent: "space-between",
                }}
              >
                {/* REG NSE File Upload */}
                <div
                  style={{
                    flex: "1 1 400px",
                    minWidth: "300px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <label className="form-label mb-1">REG NSE File Upload</label>
                  {renderUploadBox("regNse", formik.values.regNse)}
                  <div style={{ marginTop: "10px" }}>
                    <Button
                      variant="contained"
                      size="small"
                      disabled={formik.values.regNse === null}
                      sx={{
                        fontSize: "12px",
                        color: "#fff",
                        bgcolor: "#11395C",
                        textTransform: "none",
                        padding: "6px 12px",
                        width: "100%",
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        if (!formik.values.regNse) {
                          ShowToast("error", "Please select a file to upload");
                          return;
                        }
                        handleUpload("nse", formik.values.regNse);
                      }}
                    >
                      Upload REG NSE File
                    </Button>
                    {nseDetails && (
                      <div
                        style={{
                          marginTop: "8px",
                          fontSize: "11px",
                          color: "#444",
                        }}
                      >
                        <div>
                          <strong>Last Uploaded By:</strong> {nseDetails.uby}
                        </div>
                        <div>
                          <strong>Last Uploaded On:</strong>{" "}
                          {formatDateTime(nseDetails?.uon)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* REG BSE File Upload */}
                <div
                  style={{
                    flex: "1 1 400px",
                    minWidth: "300px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <label className="form-label mb-1">REG BSE File Upload</label>
                  {renderUploadBox("regBse", formik.values.regBse)}
                  <div style={{ marginTop: "10px" }}>
                    <Button
                      variant="contained"
                      size="small"
                      disabled={formik.values.regBse === null}
                      sx={{
                        fontSize: "12px",
                        color: "#fff",
                        bgcolor: "#11395C",
                        textTransform: "none",
                        padding: "6px 12px",
                        width: "100%",
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        if (!formik.values.regBse) {
                          ShowToast("error", "Please select a file to upload");
                          return;
                        }
                        handleUpload("bse", formik.values.regBse);
                      }}
                    >
                      Upload REG BSE File
                    </Button>
                    {bseDetails && (
                      <div
                        style={{
                          marginTop: "8px",
                          fontSize: "11px",
                          color: "#444",
                        }}
                      >
                        <div>
                          <strong>Last Uploaded By:</strong> {bseDetails.uby}
                        </div>
                        <div>
                          <strong>Last Uploaded On:</strong>{" "}
                          {formatDateTime(bseDetails?.uon)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default RegFileUpload;
