import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Label,
  Row,
  Input,
  Button,
  FormFeedback,
} from "reactstrap";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
import axios from "axios";
import { endpoints } from "../../../services/endpoints";
// import Modal from "../../../components/common/Modal";
// import { apiServices } from "../../../services";
import ShowToast from "../../../utils/toastUtils";

interface SLBMHoldingsProps {
  activeSubItem: any;
}

const SLBMHoldings: React.FC<SLBMHoldingsProps> = () => {
  const dispatch = useDispatch();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>("");
  // const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [inputKey, setInputKey] = useState<number>(0);
  const [uploadedFileData, setUploadedFileData] = useState<{
    name: string;
    content: string;
  } | null>(null);

  // const sampleFiles = [
  //   {
  //     name: "Symphony_IsinHolding.xlsx",
  //     url: import.meta.env.VITE_CLIENT_SYMPHONY_ISIN,
  //   },
  // ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
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

      // apiServices
      //   .SLBMHoldingsUpload(payload)
      //   .then((response) => {
      //     console.log("SLBMHoldingsReportResponse", response);
      //     dispatch(hideLoader());
      //   })
      //   .catch((Errror) => {
      //     console.log("Errror", Errror);
      //   });

      console.log("SLBMHoldingsReportResponse", response);

      if (response.status === 200) {
        ShowToast("success", response?.data);
        setUploadedFileData({
          name: selectedFile.name,
          content: base64Content,
        });
        // setIsModalOpen(true);
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

  // const toggleModal = () => setIsModalOpen((prev) => !prev);

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
                {/* <Modal isOpen={isModalOpen} onClose={toggleModal} /> */}
                <Row>
                  <Col lg={6}>
                    <Label htmlFor="formFile" className="form-label">
                      Select File
                    </Label>
                    <Input
                      key={inputKey}
                      className="form-control"
                      type="file"
                      id="formFile"
                      accept=".csv"
                      onChange={handleFileChange}
                      invalid={!!fileError}
                    />
                    {fileError && <FormFeedback>{fileError}</FormFeedback>}
                  </Col>

                  {/* <Col lg={6}>
                    <h6>Sample Files:</h6>
                    <ul className="mb-0">
                      {sampleFiles.map((file, index) => (
                        <li key={index}>
                          <a href={file.url} download>
                            {file.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </Col> */}
                </Row>
                {/* 
                {uploadedFileData && (
                  <Row className="mt-4">
                    <Col lg={6}>
                      <h6>Download Uploaded File:</h6>
                      <a
                        href={`data:text/csv;base64,${uploadedFileData.content}`}
                        download={uploadedFileData.name}
                      >
                        {uploadedFileData.name}
                      </a>
                    </Col>
                  </Row>
                )} */}

                <Row>
                  <Col lg={4} className="mt-4">
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
