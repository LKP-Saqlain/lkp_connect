import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Container, Card, CardHeader, CardBody } from "reactstrap";
import { Button, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { apiServices } from "../../../services";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import ShowToast from "../../../utils/toastUtils";

const RMSPledgeHolding = ({ activeSubItem }: any) => {
  const [uploadedFiles, setUploadedFiles] = React.useState<{
    [key: string]: boolean;
  }>({
    csvFile: false,
    excelFile: false,
  });

  const dispatch = useDispatch<AppDispatch>();

  // const { user_id } = useSelector(
  //   (state: RootState) => state.UserLogin?.data?.data
  // );

  const formik = useFormik({
    initialValues: {
      csvFile: null,
      excelFile: null,
    },
    validationSchema: Yup.object({
      csvFile: Yup.mixed().required("CSV file is required"),
      excelFile: Yup.mixed().required("Excel file is required"),
    }),
    onSubmit: (values: any) => {
      console.log("values", values);
    },
  });

  const handleUpload = async (fieldName: string, file: File | null) => {
    if (!file) {
      formik.setFieldError(fieldName, "Please upload a valid file");
      return;
    }

    const fileExt = file.name.split(".").pop()?.toLowerCase() || "";
    // const fileNameOnly = file.name.substring(0, file.name.lastIndexOf(".")); // name without extension

    dispatch(showLoader("Uploading file..."));

    try {
      // Convert file to base64
      const base64String: string = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => {
          const result = reader.result as string;
          const base64Only = result.split(",")[1] || result; // strip prefix
          resolve(base64Only);
        };

        reader.onerror = (error) => reject(error);
      });

      // Build payload
      const payload = {
        fileName: file.name,
        filePath: "D:\\FileUpload\\RMS",
        fileType: `.${fileExt}`,
        contentType: base64String,
      };

      console.log("UploadPayload", payload);

      const response = await apiServices.ComplainceFileUpload(payload);

      if (response?.status === 200) {
        // Success
        ShowToast("success", "File Successfully Uploaded");
        formik.setFieldError(fieldName, "");
        setUploadedFiles((prev) => ({ ...prev, [fieldName]: true }));
      } else {
        ShowToast("error", "File upload failed");
        console.error("Upload failed", response);
      }
    } catch (error) {
      console.error("Upload Error", error);
      ShowToast("error", "Something went wrong while uploading");
    } finally {
      dispatch(hideLoader());
    }
  };

  /** ⬇️ Drag & Drop */
  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    fieldName: string
  ) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    validateAndSetFile(file, fieldName);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  /** ⬇️ Manual File Change */
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string
  ) => {
    const file = e.currentTarget.files?.[0];
    validateAndSetFile(file, fieldName);
    e.target.value = "";
  };

  /** ⬇️ Validate extensions */
  const validateAndSetFile = (file: File | undefined, fieldName: string) => {
    if (!file) return;

    const fileName = file.name.toLowerCase();
    if (fieldName === "csvFile" && fileName.endsWith(".csv")) {
      formik.setFieldValue(fieldName, file);
    } else if (
      fieldName === "excelFile" &&
      (fileName.endsWith(".xls") || fileName.endsWith(".xlsx"))
    ) {
      formik.setFieldValue(fieldName, file);
    } else {
      formik.setFieldError(
        fieldName,
        fieldName === "csvFile"
          ? "Only .csv files are accepted"
          : "Only .xls/.xlsx files are accepted"
      );
    }
  };

  /** ⬇️ Reusable Upload Box */
  const renderUploadBox = (fieldName: string, fileValue: File | null) => (
    <div>
      <div
        style={{
          position: "relative",
          border: "1px dashed #ced4da",
          padding: "10px",
          borderRadius: "0.25rem",
          cursor: "pointer",
          backgroundColor: "#f8f9fa",
          width: "100%",
        }}
        onDrop={(e) => handleDrop(e, fieldName)}
        onDragOver={handleDragOver}
        onClick={() => document.getElementById(fieldName)?.click()}
      >
        <input
          type="file"
          id={fieldName}
          name={fieldName}
          accept={fieldName === "csvFile" ? ".csv" : ".xls,.xlsx"}
          style={{ display: "none" }}
          onChange={(e) => handleFileChange(e, fieldName)}
        />

        {fileValue ? (
          <>
            {fileValue.name}
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
                onClick={(e) => {
                  e.stopPropagation();
                  formik.setFieldValue(fieldName, null);
                  setUploadedFiles((prev) => ({ ...prev, [fieldName]: false })); // reset uploaded
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
              <strong>
                {fieldName === "csvFile" ? ".csv" : ".xls / .xlsx"}
              </strong>{" "}
              file here
            </span>
            <div className="mt-1">
              {" "}
              <small
                className="text-muted d-block"
                style={{ fontSize: "12px" }}
              >
                {" "}
                • Only{" "}
                {fieldName === "csvFile" ? (
                  <strong>.csv</strong>
                ) : (
                  <strong>.xls/.xlsx</strong>
                )}{" "}
                files are accepted.{" "}
              </small>{" "}
            </div>
          </>
        )}
      </div>
      {fileValue && !uploadedFiles[fieldName] && (
        <Button
          variant="outlined"
          size="small"
          sx={{
            fontSize: "12px",
            color: "#fff",
            bgcolor: "#11395C",
            borderColor: "#11395C",
            textTransform: "none",
            padding: "2px 8px",
            marginTop: "8px",
          }}
          onClick={() => handleUpload(fieldName, fileValue)}
        >
          Upload
        </Button>
      )}

      {formik.errors[fieldName] && formik.touched[fieldName] && (
        <div className="text-danger mt-1" style={{ fontSize: "0.85rem" }}>
          {formik.errors[fieldName] as string}
        </div>
      )}
    </div>
  );

  const downloadCSV = (csvData: string, fileName: string) => {
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownload = async () => {
    if (!formik.values.csvFile || !formik.values.excelFile) {
      ShowToast(
        "error",
        "Please upload both CSV and Excel files before downloading"
      );
      return;
    }

    try {
      dispatch(showLoader("Preparing file..."));
      const response = await apiServices.UploadCollateralFiles({}); // <-- replace with your API
      if (response?.status === 200 && response.data) {
        // If backend returns base64 CSV
        console.log("ResponseCSV", response?.data);

        let csvContent = response.data;
        if (csvContent.startsWith("data:")) {
          csvContent = atob(csvContent.split(",")[1]); // convert base64 -> raw text
        }
        downloadCSV(csvContent, "FinalReport.csv");
        ShowToast("success", "File downloaded successfully");
      } else {
        ShowToast("error", "Failed to download file");
      }
    } catch (error) {
      console.error("Download Error:", error);
      ShowToast("error", "Something went wrong while downloading");
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    console.log("formikVals", activeSubItem, formik.values);
  }, [formik.values]);

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
              padding: "0.2rem 0.8rem",
            }}
          >
            <h4 className="card-title mb-0">Pledge Holdings Adjustment</h4>
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
                {/* CSV Upload */}
                <div style={{ flex: "1 1 300px", minWidth: "250px" }}>
                  <label className="form-label">Upload CSV File</label>
                  {renderUploadBox("csvFile", formik.values.csvFile)}
                </div>

                {/* Excel Upload */}
                <div style={{ flex: "1 1 300px", minWidth: "250px" }}>
                  <label className="form-label">Upload Excel File</label>
                  {renderUploadBox("excelFile", formik.values.excelFile)}
                </div>
              </div>
            </form>
            <div>
              <Button
                variant="contained"
                sx={{
                  fontSize: "14px",
                  color: "#fff",
                  bgcolor: "#28a745",
                  "&:hover": { bgcolor: "#218838" },
                  textTransform: "none",
                  padding: "6px 16px",
                }}
                onClick={handleDownload}
              >
                Download Final CSV
              </Button>
            </div>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default RMSPledgeHolding;
