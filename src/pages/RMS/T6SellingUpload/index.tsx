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
  type: string;
  uploadedon: string;
  uploadedBy: string;
}

const T6SellingFileUpload = ({ activeSubItem }: any) => {
  const [uploadDetails, setUploadDetails] = useState<UploadDetail[]>([]);

  const dispatch = useDispatch<AppDispatch>();
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );

  const formik = useFormik({
    initialValues: {
      nseFile: null,
      bseFile: null,
    },
    validationSchema: Yup.object({
      nseFile: Yup.mixed().required("T6 NSE Selling file is required"),
      bseFile: Yup.mixed().required("T6 BSE Selling file is required"),
    }),
    onSubmit: (values) => {
      console.log("Form Values:", values);
    },
  });

  useEffect(() => {
    let payload = {
      option: "T6Selling",
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

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: "nseFile" | "bseFile"
  ) => {
    const file = e.currentTarget.files?.[0];
    if (file && /\.txt$/i.test(file.name)) {
      formik.setFieldValue(fieldName, file);
    } else {
      formik.setFieldError(fieldName, "Only .txt files are accepted");
    }
    e.target.value = "";
  };

  const handleUpload = async (type: "nse" | "bse", file: File | null) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("File", file);
    formData.append("User_id", user_id);

    dispatch(showLoader(""));

    try {
      console.log("FormData", formData);

      const response =
        type === "nse"
          ? await apiServices.T6NSESellingFileUpload(formData)
          : await apiServices.T6BSESellingFileUpload(formData);

      if (response?.status === 200) {
        console.log(`${type} upload response:`, response?.data);
        ShowToast("success", response?.data?.message);
      }

      formik.setFieldValue(type === "nse" ? "nseFile" : "bseFile", null);
    } catch (error) {
      console.error(`${type} upload error:`, error);
    } finally {
      dispatch(hideLoader());
    }
  };

  const renderUploadBox = (
    fieldName: "nseFile" | "bseFile",
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
        accept=".txt"
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
          <strong>.txt</strong> file here
        </span>
      )}

      <div className="mt-1">
        <small className="text-muted d-block" style={{ fontSize: "12px" }}>
          • Only <strong>.txt</strong> files are accepted.
        </small>
      </div>

      {formik.errors[fieldName] && formik.touched[fieldName] && (
        <div className="text-danger mt-1" style={{ fontSize: "0.85rem" }}>
          {formik.errors[fieldName] as string}
        </div>
      )}
    </div>
  );

  const nseDetails = uploadDetails.find((item: any) => item.type === "NSE");
  const bseDetails = uploadDetails.find((item: any) => item.type === "BSE");

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
                {/* T6 NSE Selling File Upload */}
                <div
                  style={{
                    flex: "1 1 400px",
                    minWidth: "300px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <label className="form-label mb-1">
                    T6 NSE Selling File Upload
                  </label>

                  {renderUploadBox("nseFile", formik.values.nseFile)}
                  <div style={{ marginTop: "10px" }}>
                    <Button
                      variant="contained"
                      size="small"
                      disabled={formik.values.nseFile === null ? true : false}
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
                        if (!formik.values.nseFile) {
                          ShowToast("error", "Please select a file to upload");
                          return;
                        }
                        handleUpload("nse", formik.values.nseFile);
                      }}
                    >
                      Upload T6 NSE Selling File
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
                          <strong>Last Uploaded By:</strong>{" "}
                          {nseDetails.uploadedBy}
                        </div>
                        <div>
                          <strong>Last Uploaded On:</strong>{" "}
                          {formatDateTime(nseDetails?.uploadedon)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* T6 BSE Selling File Upload */}
                <div
                  style={{
                    flex: "1 1 400px",
                    minWidth: "300px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <label className="form-label mb-1">
                    T6 BSE Selling File Upload
                  </label>
                  {renderUploadBox("bseFile", formik.values.bseFile)}
                  <div style={{ marginTop: "10px" }}>
                    <Button
                      variant="contained"
                      size="small"
                      disabled={formik.values.bseFile === null ? true : false}
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
                        if (!formik.values.bseFile) {
                          ShowToast("error", "Please select a file to upload");
                          return;
                        }
                        handleUpload("bse", formik.values.bseFile);
                      }}
                    >
                      Upload T6 BSE Selling File
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
                          <strong>Last Uploaded By:</strong>{" "}
                          {bseDetails.uploadedBy}
                        </div>
                        <div>
                          <strong>Last Uploaded On:</strong>{" "}
                          {formatDateTime(bseDetails?.uploadedon)}
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

export default T6SellingFileUpload;
