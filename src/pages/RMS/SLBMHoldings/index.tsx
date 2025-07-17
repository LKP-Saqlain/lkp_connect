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
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
import axios from "axios";
import { endpoints } from "../../../services/endpoints";
import ShowToast from "../../../utils/toastUtils";
import { Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface SLBMHoldingsProps {
  activeSubItem: any;
}

const SLBMHoldings: React.FC<SLBMHoldingsProps> = () => {
  const dispatch = useDispatch();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>("");
  const [inputKey, setInputKey] = useState<number>(0);
  const [uploadedFileData, setUploadedFileData] = useState<{
    name: string;
    content: string;
  } | null>(null);

  const handleFileChange = (file: File | null) => {
    if (!file) return;
    const isCSV = file.name.toLowerCase().endsWith(".csv");
    if (!isCSV) {
      setFileError("Only .csv files are allowed.");
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
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    handleFileChange(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      setFileError("Please upload a .csv file before submitting.");
      return;
    }
    try {
      dispatch(showLoader("Please wait, we are processing your request..."));
      const base64Content = await getBase64Content(selectedFile);
      const payload = {
        user_id: localStorage.getItem("Id"),
        file_name: selectedFile.name,
        file_content: base64Content,
      };
      const token = localStorage.getItem("tkn");
      const response = await axios.post(
        `https://middlewareapi.lkp.net.in${endpoints.SLBMHoldingsUpload}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        ShowToast("success", response?.data);
        setUploadedFileData({
          name: selectedFile.name,
          content: base64Content,
        });
        resetForm();
        console.log(uploadedFileData);
      }
    } catch (error) {
      console.error("Upload error:", error);
      setFileError("Failed to upload the file. Please try again.");
    } finally {
      dispatch(hideLoader());
    }
  };

  const getBase64Content = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.replace(/^data:.*;base64,/, ""));
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const resetForm = () => {
    setSelectedFile(null);
    setFileError("");
    setInputKey((prev) => prev + 1);
  };

  document.title = "LKP Securities | SLBM Holdings File Upload";

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
                <h4 className="card-title mb-0">SLBM Holdings File Upload</h4>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col lg={6}>
                    <Label htmlFor="formFile" className="form-label">
                      Upload File
                    </Label>
                    <div
                      style={{ position: "relative", width: "100%" }}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                    >
                      <input
                        type="file"
                        id="customFileUpload"
                        key={inputKey}
                        style={{ display: "none" }}
                        accept=".csv"
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
                                  resetForm();
                                }}
                              >
                                <CloseIcon fontSize="small" />
                              </span>
                            </Tooltip>
                          </>
                        ) : (
                          <span>
                            <strong>Click to upload</strong> or drag and drop
                            your <strong>.csv</strong> file here
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
                          • Only <strong>.csv</strong> files are accepted.
                        </small>
                      </div>
                    </div>
                  </Col>
                </Row>

                <Row>
                  <Col lg={4} className="mt-2">
                    <Button
                      onClick={handleFileUpload}
                      style={{ backgroundColor: "#11395C" }}
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

export default SLBMHoldings;
