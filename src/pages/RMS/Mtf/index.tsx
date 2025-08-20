import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Container, Card, CardHeader, CardBody } from "reactstrap";
import { Button, Tooltip } from "@mui/material";
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
    formik.setTouched({ symphonyFile: true, odinFile: true });

    if (!formik.values.symphonyFile || !formik.values.odinFile) {
      return;
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
        link.setAttribute("download", "MergedOdinFile.txt");
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
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
      if (response?.data) {
        const blob = new Blob([response.data], { type: "text/plain" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "MergeSymphonyFile.txt";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("MergeIntoSymphonyFile Error", error);
    } finally {
      dispatch(hideLoader());
    }
  };

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

      {formik.errors[fieldName] && formik.touched[fieldName] && (
        <div className="text-danger mt-1" style={{ fontSize: "0.85rem" }}>
          {formik.errors[fieldName] as string}
        </div>
      )}
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
            <h4 className="card-title mb-0">MTF File Merge</h4>
          </CardHeader>
          <CardBody>
            <form onSubmit={formik.handleSubmit}>
              {/* Responsive Upload Sections */}
              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  marginBottom: "20px",
                  flexWrap: "wrap",
                }}
              >
                {/* Symphony Section */}
                <div style={{ flex: "1 1 300px", minWidth: "250px" }}>
                  <label className="form-label">Symphony Format</label>
                  {renderUploadBox("symphonyFile", formik.values.symphonyFile)}

                  {/* Buttons directly below Symphony */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "10px",
                      marginTop: "10px",
                    }}
                  >
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        fontSize: "12px",
                        color: "#fff",
                        bgcolor: "#11395C",
                        borderColor: "#11395C",
                        textTransform: "none",
                        padding: "4px 10px",
                        flex: "1 1 200px",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGenerateClick("symphony");
                      }}
                    >
                      Download Symphony file
                    </Button>

                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        fontSize: "12px",
                        color: "#fff",
                        bgcolor: "#11395C",
                        borderColor: "#11395C",
                        textTransform: "none",
                        padding: "4px 10px",
                        flex: "1 1 200px",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGenerateClick("odin");
                      }}
                    >
                      Download ODIN file
                    </Button>
                  </div>
                </div>

                {/* ODIN Section */}
                <div style={{ flex: "1 1 300px", minWidth: "250px" }}>
                  <label className="form-label">ODIN Format</label>
                  {renderUploadBox("odinFile", formik.values.odinFile)}
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
