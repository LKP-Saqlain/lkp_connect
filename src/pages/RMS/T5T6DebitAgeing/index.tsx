import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import { Container, Card, CardHeader, CardBody } from "reactstrap";
import { Button, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../../redux/store";
import type { RootState } from "../../../redux/store";

import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { apiServices } from "../../../services";
import ShowToast from "../../../utils/toastUtils";
import { formatDateTime } from "../../../helper/commmon";

interface FormValues {
  excelFile: File | null;
}

const T5T6DebitAgeing = ({ activeSubItem }: any) => {
  const [lastUploadedDetails, setLastUploadedDetails] = useState<{
    uploadedBy: string;
    uploadedOn: string;
  } | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data,
  );

  useEffect(() => {
    fetchLastUploadedDetails();
  }, []);

  const formik = useFormik<FormValues>({
    initialValues: {
      excelFile: null,
    },

    validationSchema: Yup.object({
      excelFile: Yup.mixed<File>()
        .required("Excel file is required")
        .test(
          "excel-format",
          "Only .xls and .xlsx files are accepted",
          (file) => {
            if (!file) return true;

            return /\.(xls|xlsx)$/i.test(file.name);
          },
        ),
    }),

    onSubmit: async (values) => {
      const file = values.excelFile;

      if (!file) {
        ShowToast("error", "Please upload an Excel file");
        return;
      }

      const formData = new FormData();

      formData.append("File", file);
      formData.append("User_id", user_id);

      dispatch(showLoader(""));

      try {
        console.log("FormData", formData);

        const response = await apiServices.UploadT5T6AgeingDebit(formData);

        // HTTP request successful
        if (response?.status === 200) {
          // API-level validation failed
          if (
            response?.data?.statusCode === 400 ||
            response?.data?.isSuccess === false
          ) {
            ShowToast(
              "error",
              response?.data?.message || "Invalid file format",
            );

            return;
          }

          // API success
          if (
            response?.data?.statusCode === 200 &&
            response?.data?.isSuccess === true
          ) {
            console.log("T5T6 Ageing Debit upload response:", response?.data);

            ShowToast(
              "success",
              response?.data?.message || "Excel file uploaded successfully",
            );

            formik.resetForm();

            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }

            await fetchLastUploadedDetails();
          } else {
            ShowToast("error", response?.data?.message || "File upload failed");
          }
        } else {
          ShowToast("error", response?.data?.message || "File upload failed");
        }
      } catch (error) {
        console.error("T5T6 Ageing Debit upload error:", error);

        ShowToast("error", "Something went wrong while uploading the file");
      } finally {
        dispatch(hideLoader());
      }
    },
  });

  const fetchLastUploadedDetails = async () => {
    try {
      const response = await apiServices.GetFileuploadDetails({
        option: "T5Ageing",
      });

      if (
        response?.status === 200 &&
        response?.data?.isSuccess &&
        response?.data?.data?.length > 0
      ) {
        const details = response.data.data[0];

        setLastUploadedDetails({
          uploadedBy: details.uby || "—",
          uploadedOn: details.uon || "",
        });
      } else {
        setLastUploadedDetails(null);
      }
    } catch (error) {
      console.error("Error fetching last uploaded details:", error);

      setLastUploadedDetails(null);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    const file = event.dataTransfer.files?.[0];

    if (!file) return;

    validateAndSetFile(file);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];

    if (!file) return;

    validateAndSetFile(file);

    // Allow selecting the same file again
    event.target.value = "";
  };

  const validateAndSetFile = (file: File) => {
    const isExcelFile = /\.(xls|xlsx)$/i.test(file.name);

    if (!isExcelFile) {
      formik.setFieldValue("excelFile", null);
      formik.setFieldTouched("excelFile", true, false);

      formik.setFieldError(
        "excelFile",
        "Only .xls and .xlsx files are accepted",
      );

      return;
    }

    formik.setFieldError("excelFile", undefined);
    formik.setFieldValue("excelFile", file);
  };

  const renderUploadBox = (fileValue: File | null) => (
    <div>
      <div
        style={{
          position: "relative",
          border: "1px dashed #ced4da",
          padding: "10px",
          borderRadius: "0.25rem",
          cursor: "pointer",
          backgroundColor: "#f8f9fa",
          width: "40%",
          minHeight: "50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          id="excelFile"
          name="excelFile"
          accept=".xls,.xlsx"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        {fileValue ? (
          <>
            <span
              style={{
                fontSize: "13px",
                paddingRight: "35px",
                wordBreak: "break-word",
              }}
            >
              {fileValue.name}
            </span>

            <Tooltip title="Delete file" arrow>
              <span
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#dc3545",
                  display: "flex",
                  alignItems: "center",
                }}
                onClick={(event) => {
                  event.stopPropagation();

                  formik.setFieldValue("excelFile", null);

                  formik.setFieldTouched("excelFile", false);

                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
              >
                <CloseIcon fontSize="small" />
              </span>
            </Tooltip>
          </>
        ) : (
          <>
            <span style={{ fontSize: "13px" }}>
              <strong>Click to upload</strong> or drag and drop your{" "}
              <strong>.xls / .xlsx</strong> file here
            </span>

            {/* <div className="mt-1">
              <small
                className="text-muted d-block"
                style={{ fontSize: "12px" }}
              >
                • Only <strong>.xls/.xlsx</strong> files are accepted.
              </small>
            </div> */}
          </>
        )}
      </div>

      {formik.errors.excelFile && formik.touched.excelFile && (
        <div className="text-danger mt-1" style={{ fontSize: "0.85rem" }}>
          {formik.errors.excelFile}
        </div>
      )}
    </div>
  );

  return (
    <div className="page-content page-view">
      <Container fluid>
        <Card
          style={{
            borderRadius: "15px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          }}
        >
          <CardHeader
            style={{
              borderRadius: "15px 15px 0 0",
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
                  gap: "20px",
                  marginBottom: "20px",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    flex: "1 1 300px",
                    minWidth: "250px",
                  }}
                >
                  <label className="form-label">Upload Excel File</label>
                  {renderUploadBox(formik.values.excelFile)}
                </div>
              </div>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  fontSize: "14px",
                  color: "#fff",
                  bgcolor: "#11395C",
                  "&:hover": {
                    bgcolor: "#0d2d49",
                  },
                  textTransform: "none",
                  padding: "6px 20px",
                  borderRadius: "6px",
                }}
              >
                Upload File
              </Button>

              {lastUploadedDetails && (
                <div
                  style={{
                    marginTop: "12px",
                    fontSize: "13px",
                    color: "#344054",
                    lineHeight: "1.6",
                  }}
                >
                  <div>
                    <strong>Last Uploaded By:</strong>{" "}
                    {lastUploadedDetails.uploadedBy}
                  </div>

                  <div>
                    <strong>Last Uploaded On:</strong>{" "}
                    {formatDateTime(lastUploadedDetails.uploadedOn)}
                  </div>
                </div>
              )}
            </form>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default T5T6DebitAgeing;
