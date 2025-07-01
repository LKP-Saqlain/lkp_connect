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
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
import axios from "axios";
import { endpoints } from "../../../services/endpoints";
import Modal from "../../../components/common/Modal";

const SLBMHoldings = () => {
  const dispatch = useDispatch();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string>("");
  // const [message, setMessage] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [inputKey, setInputKey] = useState<number>(0);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const allowedTypes = [".csv", ".xlsx"];

    // Filter only allowed file types
    const filteredFiles = files.filter((file) =>
      allowedTypes.some((type) => file.name.endsWith(type))
    );
    if (filteredFiles.length !== files.length) {
      setFileError("Only .csv and .xlsx files are allowed.");
      return;
    }
    setSelectedFiles(filteredFiles);
    setFileError("");
  };

  const sampleFiles = [
    {
      name: "Symphony_IsinHolding.xlsx",
      url: import.meta.env.VITE_CLIENT_SYMPHONY_ISIN,
    },
  ];

  const handleFileUpload = async () => {
    if (selectedFiles.length !== 1) {
      setFileError("Please Upload a single file.");
      return;
    }
    try {
      dispatch(showLoader("Please wait, we are processing your request..."));
      const file = selectedFiles[0];
      const fileContent = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64String = reader.result as string;
          const content = base64String.replace(/^data:.*;base64,/, "");
          resolve(content);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const Id = localStorage.getItem("Id");
      let payload = {
        user_id: Id,
        file_name: file.name,
        file_content: fileContent,
      };
      dispatch(showLoader("Please wait, we are processing your request..."));
      let token = localStorage.getItem("tkn");
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
        dispatch(hideLoader());
        console.log("File upload response-->", response.data);
        // setMessage(response?.data);
        setIsModalOpen(true);
        setSelectedFiles([]);
        setFileError("");
        setInputKey((prevKey) => prevKey + 1);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      dispatch(hideLoader());
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen); // Toggle modal visibility
  };

  document.title = "LKP Securities | SLBM Holdings File Upload";
  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Row style={{ fontFamily: "Public Sans" }}>
            <Col lg={12}>
              <Card style={{ minHeight: "85vh" }}>
                <CardHeader>
                  <h4 className="card-title mb-0">SLBM Holdings File Upload</h4>
                </CardHeader>
                <CardBody>
                  <div>
                    <Row>
                      <Modal
                        isOpen={isModalOpen}
                        onClose={toggleModal}
                        // message={message}
                      />
                      <Col lg={6}>
                        <div>
                          <Label
                            htmlFor="formFileMultiple"
                            className="form-label"
                          >
                            Select Files
                          </Label>
                          <Input
                            key={inputKey}
                            className="form-control"
                            type="file"
                            id="formFileMultiple"
                            multiple
                            accept=".csv, .xlsx"
                            onChange={handleFileChange}
                            invalid={!!fileError}
                          />
                          {fileError && (
                            <FormFeedback>{fileError}</FormFeedback>
                          )}
                        </div>
                      </Col>
                      <Col lg={6}>
                        <h6>Sample Files:</h6>
                        <ul>
                          {sampleFiles.map((file, index) => (
                            <li key={index}>
                              <a href={file.url} download>
                                {file.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </Col>
                    </Row>

                    {/* Display selected file names */}
                    {selectedFiles.length > 0 && (
                      <Row className="mt-3">
                        <Col lg={6}>
                          <Label>Selected File</Label>
                          <ListGroup>
                            {selectedFiles.map((file, index) => (
                              <ListGroupItem key={index}>
                                {file.name}
                              </ListGroupItem>
                            ))}
                          </ListGroup>
                        </Col>
                      </Row>
                    )}

                    <Row>
                      <Col lg={4} className="mt-3">
                        <Button
                          onClick={handleFileUpload}
                          //   disabled={selectedFiles.length !== 6}
                          style={{
                            backgroundColor: "#11395C",
                          }}
                        >
                          Upload File
                        </Button>
                      </Col>
                    </Row>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  );
};

export default SLBMHoldings;
