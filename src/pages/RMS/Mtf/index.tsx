import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Container, Card, CardHeader, CardBody } from "reactstrap";
import { Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { apiServices } from "../../../services";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";

const MTF = ({ activeSubItem }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );

  const formik = useFormik({
    initialValues: {
      symphonyFile: null,
      odinFile: null,
    },
    validationSchema: Yup.object({
      symphonyFile: Yup.mixed().required("Symphony file is required"),
      odinFile: Yup.mixed().required("ODIN file is required"),
    }),
    onSubmit: (values: any) => {
      console.log("values", values);
    },
  });

  const handleGenerateClick = (type: "symphony" | "odin") => {
    // Mark all fields as touched so validation shows
    formik.setTouched({ symphonyFile: true, odinFile: true });

    if (!formik.values.symphonyFile || !formik.values.odinFile) {
      return; // Stop if files are missing
    }

    if (type === "symphony") {
      mergeIntoSymphonyFile(formik.values, dispatch);
    } else {
      mergeIntoOdinFile(formik.values, dispatch);
    }
  };

  const mergeIntoOdinFile = async (values: any, dispatch: AppDispatch) => {
    const formData = new FormData();
    formData.append("Symphony", values.symphonyFile);
    formData.append("Odin", values.odinFile);
    formData.append("User_id", user_id);

    dispatch(showLoader(""));

    try {
      const response = await apiServices.MergeIntoOdinFile(formData);

      console.log("MergeIntoOdinFile Response", response);

      if (response?.data) {
        const blob = new Blob([response.data], { type: "text/plain" });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "MergedOdinFile.txt"); // file name
        document.body.appendChild(link);
        link.click();

        // Cleanup
        link.remove();
        window.URL.revokeObjectURL(url);
      } else {
        console.error("No data found in API response");
      }
    } catch (error) {
      console.error("MergeIntoOdinFile Error", error);
    } finally {
      dispatch(hideLoader());
    }
  };

  const mergeIntoSymphonyFile = async (values: any, dispatch: AppDispatch) => {
    const formData = new FormData();
    formData.append("Symphony", values?.symphonyFile);
    formData.append("Odin", values?.odinFile);
    formData.append("User_id", user_id);

    dispatch(showLoader(""));

    try {
      const response = await apiServices.MergeIntoSymphonyFile(formData);
      console.log("MergeIntoSymphonyFile Response", response);

      if (response?.data) {
        const blob = new Blob([response.data], { type: "text/plain" });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "MergeIntoSymphonyFile.txt"; // File name
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("MergeIntoSymphonyFile Error", error);
    } finally {
      dispatch(hideLoader());
    }
  };

  // Drag and drop handling
  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    fieldName: string
  ) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.name.toLowerCase().endsWith(".txt")) {
      formik.setFieldValue(fieldName, file);
    } else {
      formik.setFieldError(fieldName, "Only .txt files are accepted");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string
  ) => {
    const file = e.currentTarget.files?.[0];
    if (file && file.name.toLowerCase().endsWith(".txt")) {
      formik.setFieldValue(fieldName, file);
    } else {
      formik.setFieldError(fieldName, "Only .txt files are accepted");
    }
    e.target.value = "";
  };

  const renderUploadBox = (fieldName: string, fileValue: File | null) => (
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
        accept=".txt"
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

      {formik.errors[fieldName] && (
        <div className="text-danger mt-1" style={{ fontSize: "0.85rem" }}>
          {formik.touched[fieldName] &&
          typeof formik.errors[fieldName] === "string"
            ? formik.errors[fieldName]
            : null}
        </div>
      )}

      {/* Generate button text */}
      {/* <div
        style={{
          marginTop: "5px",
          fontSize: "12px",
          color: "#007bff",
          textDecoration: "underline",
          cursor: "pointer",
        }}
        onClick={(e) => {
          e.stopPropagation();
          handleGenerateClick(fieldName === "symphonyFile" ? "symphony" : "odin");
        }}
      >
        Click to generate {label} file
      </div> */}
    </div>
  );

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
            <h4 className="card-title mb-0">Third Party Invoice Upload</h4>
          </CardHeader>
          <CardBody>
            <form onSubmit={formik.handleSubmit}>
              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  marginBottom: "20px",
                }}
              >
                <div style={{ flex: 1 }}>
                  <label className="form-label">Symphony Format</label>
                  {renderUploadBox("symphonyFile", formik.values.symphonyFile)}
                </div>

                <div style={{ flex: 1 }}>
                  <label className="form-label">ODIN Format</label>
                  {renderUploadBox("odinFile", formik.values.odinFile)}
                </div>
              </div>

              {/* External Click-to-generate section */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  fontFamily: "Public Sans",
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    color: "#007bff",
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGenerateClick("symphony");
                  }}
                >
                  Click to generate Symphony file
                </div>

                <div
                  style={{
                    fontSize: "12px",
                    color: "#007bff",
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGenerateClick("odin");
                  }}
                >
                  Click to generate ODIN file
                </div>
              </div>
            </form>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default MTF;
