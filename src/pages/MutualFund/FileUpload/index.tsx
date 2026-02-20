import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Label,
  Row,
  Button,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
import ShowToast from "../../../utils/toastUtils";
import { Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { apiServices } from "../../../services";
import { RootState } from "../../../redux/store";

const ALLOWED_EXTENSIONS = [".xlsx", ".csv"];

const FileUpload: React.FC = () => {
  const dispatch = useDispatch();
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>("");
  const [inputKey, setInputKey] = useState<number>(0);

  const resetForm = () => {
    setSelectedFile(null);
    setFileError("");
    setInputKey((prev) => prev + 1); // reset input field
  };

  const isValidExtension = (fileName: string): boolean => {
    return ALLOWED_EXTENSIONS.some((ext) =>
      fileName.toLowerCase().endsWith(ext)
    );
  };

  const handleFileChange = (file: File | null) => {
    if (!file) return;

    if (!isValidExtension(file.name)) {
      setFileError("Only .xlsx and .csv files are allowed.");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setFileError("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e.target.files?.[0] || null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFileChange(e.dataTransfer.files?.[0] || null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("File", selectedFile);
    formData.append("user_id", user_id);

    dispatch(showLoader(""));
    apiServices
      .PhysicalClientFileUpload(formData)
      .then((response) => {
        if (response?.data?.statusCode === 200) {
          //     console.log(payload, "slbm payload");
          ShowToast("success", response?.data?.message);
          resetForm();
        } else {
          ShowToast("error", response?.data?.message);
        }
      })
      .catch((error) => {
        console.log("Error", error);
        ShowToast("error", "File upload failed.");
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  document.title = "LKP Securities | MF File Upload";

  return (
    <div className="page-content">
      <div className="container-fluid">
        <Row style={{ fontFamily: "Public Sans", marginTop: "1rem" }}>
          <Col lg={12}>
            <Card
              style={{
                minHeight: "80vh",
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
                <h4 className="card-title mb-0">Mutual Fund File Upload</h4>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col lg={6}>
                    <Label htmlFor="formFile" className="form-label">
                      Upload File
                    </Label>
                    <div
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      style={{ position: "relative", width: "100%" }}
                    >
                      <input
                        type="file"
                        id="customFileUpload"
                        key={inputKey}
                        style={{ display: "none" }}
                        accept=".xlsx,.csv"
                        onChange={handleInputChange}
                      />

                      <Button
                        type="button"
                        onClick={() =>
                          document.getElementById("customFileUpload")?.click()
                        }
                        style={{
                          backgroundColor: "#f8f9fa",
                          color: "#333",
                          border: "1px dashed #ced4da",
                          height: "38px",
                          width: "80%",
                          borderRadius: "0.25rem",
                          fontSize: "0.9rem",
                          textAlign: "left",
                          paddingLeft: "12px",
                          paddingRight: selectedFile ? "40px" : "12px",
                          overflow: "hidden",
                          position: "relative",
                          display: "flex",
                          alignItems: "center",
                          cursor: "pointer",
                        }}
                      >
                        {selectedFile ? (
                          <>
                            {selectedFile.name}
                            <Tooltip title="Remove file" arrow>
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                  resetForm();
                                }}
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
                              >
                                <CloseIcon fontSize="small" />
                              </span>
                            </Tooltip>
                          </>
                        ) : (
                          <span>
                            <strong>Click to upload</strong> or drag and drop a{" "}
                            <strong>.xlsx</strong> or <strong>.csv</strong> file
                          </span>
                        )}
                      </Button>

                      {fileError && (
                        <div
                          className="text-danger mt-1"
                          style={{ fontSize: "0.85rem" }}
                        >
                          {fileError}
                        </div>
                      )}

                      <div className="mt-1">
                        <small className="text-muted d-block">
                          • Only <strong>.xlsx</strong> and{" "}
                          <strong>.csv</strong> files are accepted.
                        </small>
                        {/* <small className="text-muted d-block">
                          • Max size: <strong>20MB</strong>.
                        </small> */}
                      </div>
                    </div>
                  </Col>
                </Row>

                <Row>
                  <Col lg={4} className="mt-3">
                    <Button
                      onClick={handleFileUpload}
                      style={{
                        backgroundColor: "#11395C",
                        color: "white",
                        width: "150px",
                      }}
                    >
                      Upload File
                    </Button>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default FileUpload;
