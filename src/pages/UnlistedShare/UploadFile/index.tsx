import React, { useRef, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Container,
  Row,
  Col,
  Button,
  Input,
} from "reactstrap";
import { apiServices } from "../../../services";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import ShowToast from "../../../utils/toastUtils";

const UnlistedShareUploadFile = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const userId = "EMP-5347";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.name.endsWith(".xls") || file.name.endsWith(".xlsx"))) {
      setSelectedFile(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } else {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      ShowToast("error", "Please upload a valid Excel file (.xls or .xlsx)");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      ShowToast("error", "No file selected!");
      return;
    }

    const formData = new FormData();
    formData.append("User_id", userId);
    formData.append("VendorFile", selectedFile);
    console.log("formDataPayload", formData);
    try {
      dispatch(showLoader(""));
      const response = await apiServices.UploadUnlistedSharesVendorFile(
        formData
      );
      dispatch(hideLoader());
      console.log("Response:", response);
    } catch (error) {
      dispatch(hideLoader());
      console.error("Error uploading file:", error);
    }
  };

  const handleFileDelete = () => {
    dispatch(showLoader(""));
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      dispatch(hideLoader());
    }
  };

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
            <h4 className="card-title mb-0">
              Upload Unlisted Shares Vendor File
            </h4>
          </CardHeader>
          <CardBody>
            <Row>
              <Col lg={12}>
                <label style={{ fontSize: "12px" }} className="form-label">
                  Upload Excel File (.xls, .xlsx)
                </label>
                <Input
                  type="file"
                  innerRef={fileInputRef}
                  accept=".xls,.xlsx"
                  className="form-control"
                  onChange={handleFileChange}
                  style={{ width: "50%", minHeight: "40px" }}
                />
                {selectedFile && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "10px",
                      gap: "10px",
                    }}
                  >
                    <p style={{ margin: 0 }}>
                      Uploaded File: {selectedFile.name}
                      <Button
                        variant="contained"
                        style={{
                          backgroundColor: "#11395C",
                          color: "#fff",
                          padding: "4px 10px",
                          fontSize: "12px",
                          borderRadius: "20px",
                          lineHeight: "1",
                          marginLeft: "1rem",
                        }}
                        onClick={handleFileDelete}
                      >
                        Delete
                      </Button>
                    </p>
                  </div>
                )}
                <div className="mt-3">
                  <Button
                    style={{
                      backgroundColor: "#11395C",
                      color: "#fff",
                    }}
                    onClick={handleUpload}
                    disabled={!selectedFile}
                  >
                    Upload
                  </Button>
                </div>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default UnlistedShareUploadFile;
