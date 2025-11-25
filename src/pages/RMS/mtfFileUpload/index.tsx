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

const MTFFileUpload = ({ activeSubItem }: any) => {
  const [uploadDetails, setUploadDetails] = useState<UploadDetail[]>([]);

  const dispatch = useDispatch<AppDispatch>();
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );

  const formik = useFormik({
    initialValues: {
      shortfallFile: null,
      ageingFile: null,
    },
    validationSchema: Yup.object({
      shortfallFile: Yup.mixed().required("MTF Shortfall file is required"),
      ageingFile: Yup.mixed().required("MTF Ageing file is required"),
    }),
    onSubmit: (values) => {
      console.log("Form Values:", values);
    },
  });

  useEffect(() => {
    fetchFileUploadedDetails();
  }, []);

  const fetchFileUploadedDetails = () => {
    let payload = {
      option: "MTFAgeing",
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
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: "shortfallFile" | "ageingFile"
  ) => {
    const file = e.currentTarget.files?.[0];

    if (!file) return;

    if (fieldName === "shortfallFile") {
      // ONLY CSV
      if (/\.csv$/i.test(file.name)) {
        formik.setFieldValue(fieldName, file);
      } else {
        formik.setFieldError(fieldName, "Only .csv file is accepted");
      }
    } else if (fieldName === "ageingFile") {
      // XLS / XLSX
      if (/\.(xlsx|xls)$/i.test(file.name)) {
        formik.setFieldValue(fieldName, file);
      } else {
        formik.setFieldError(
          fieldName,
          "Only .xlsx or .xls files are accepted"
        );
      }
    }

    e.target.value = "";
  };

  const handleUpload = async (
    type: "shortfall" | "ageing",
    file: File | null
  ) => {
    if (!file) return;

    const formData = new FormData();
    if (type === "shortfall") formData.append("File", file);
    else formData.append("File", file);
    formData.append("User_id", user_id);

    dispatch(showLoader(""));

    try {
      console.log("FormData", formData);

      const response =
        type === "shortfall"
          ? await apiServices.MTFStockAgeingFileUpload(formData)
          : await apiServices.MTFAgeingFileUpload(formData);

      if (response?.status === 200) {
        console.log(`${type} upload response:`, response?.data);
        ShowToast("success", response?.data?.message);
        fetchFileUploadedDetails();
      }
      formik.setFieldValue(
        type === "shortfall" ? "shortfallFile" : "ageingFile",
        null
      );
    } catch (error) {
      console.error(`${type} upload error:`, error);
      //   alert("Upload failed, please try again.");
    } finally {
      dispatch(hideLoader());
    }
  };

  const renderUploadBox = (
    fieldName: "shortfallFile" | "ageingFile",
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
        accept={fieldName === "shortfallFile" ? ".csv" : ".xlsx,.xls"}
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
          <strong>
            {fieldName === "shortfallFile" ? ".csv" : ".xlsx / .xls"}
          </strong>{" "}
          file here
        </span>
      )}

      <div className="mt-1">
        <small className="text-muted d-block" style={{ fontSize: "12px" }}>
          • Only{" "}
          {fieldName === "shortfallFile" ? (
            <strong>.csv</strong>
          ) : (
            <>
              <strong>.xlsx</strong> or <strong>.xls</strong>
            </>
          )}{" "}
          files are accepted.
        </small>
      </div>

      {formik.errors[fieldName] && formik.touched[fieldName] && (
        <div className="text-danger mt-1" style={{ fontSize: "0.85rem" }}>
          {formik.errors[fieldName] as string}
        </div>
      )}
    </div>
  );

  const MTFStockAgeing = uploadDetails.find(
    (item: any) => item.type === "MTFStockAgeing"
  );
  const MTFAgeing = uploadDetails.find(
    (item: any) => item.type === "MTFAgeing"
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
              {/* Responsive two-column layout */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "20px",
                  justifyContent: "space-between",
                }}
              >
                {/* MTF Shortfall File */}
                <div
                  style={{
                    flex: "1 1 400px",
                    minWidth: "300px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <label className="form-label mb-1">
                    MTF Stock Ageing File
                  </label>
                  {renderUploadBox(
                    "shortfallFile",
                    formik.values.shortfallFile
                  )}
                  <div style={{ marginTop: "10px" }}>
                    <Button
                      variant="contained"
                      size="small"
                      disabled={
                        formik.values.shortfallFile === null ? true : false
                      }
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
                        handleUpload("shortfall", formik.values.shortfallFile);
                      }}
                    >
                      Upload MTF Stock Ageing File
                    </Button>
                    {MTFStockAgeing && (
                      <div
                        style={{
                          marginTop: "8px",
                          fontSize: "11px",
                          color: "#444",
                        }}
                      >
                        <div>
                          <strong>Last Uploaded By:</strong>{" "}
                          {MTFStockAgeing.uploadedBy}
                        </div>
                        <div>
                          <strong>Last Uploaded On:</strong>{" "}
                          {formatDateTime(MTFStockAgeing?.uploadedon)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* MTF Ageing File */}
                <div
                  style={{
                    flex: "1 1 400px",
                    minWidth: "300px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <label className="form-label mb-1">MTF Ageing File</label>
                  {renderUploadBox("ageingFile", formik.values.ageingFile)}
                  <div style={{ marginTop: "10px" }}>
                    <Button
                      variant="contained"
                      size="small"
                      disabled={
                        formik.values.ageingFile === null ? true : false
                      }
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
                        handleUpload("ageing", formik.values.ageingFile);
                      }}
                    >
                      Upload MTF Ageing File
                    </Button>
                    {MTFAgeing && (
                      <div
                        style={{
                          marginTop: "8px",
                          fontSize: "11px",
                          color: "#444",
                        }}
                      >
                        <div>
                          <strong>Last Uploaded By:</strong>{" "}
                          {MTFAgeing.uploadedBy}
                        </div>
                        <div>
                          <strong>Last Uploaded On:</strong>{" "}
                          {formatDateTime(MTFAgeing?.uploadedon)}
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

export default MTFFileUpload;
