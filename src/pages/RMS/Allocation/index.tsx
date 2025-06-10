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
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
import axios from "axios";
import { endpoints } from "../../../services/endpoints";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";

const RMSAllocation = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string>("");

  const dispatch = useDispatch<AppDispatch>();

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

    if (filteredFiles.length > 6) {
      setFileError("You can upload exactly 6 files.");
      return;
    }

    if (filteredFiles.length < 6) {
      setFileError("Please select exactly 6 files.");
      setSelectedFiles(filteredFiles);
      return;
    }

    setSelectedFiles(filteredFiles);
    setFileError("");
  };

  const sampleFiles = [
    {
      name: "clientmarginutilcurr_ddmmyyyy_1.csv",
      url: import.meta.env.VITE_CLIENT_MARGIN_UTIL_CURR,
    },
    {
      name: "clientmarginutileq_ddmmyyyy_1.csv",
      url: import.meta.env.VITE_CLIENT_MARGIN_UTIL_EQ,
    },
    {
      name: "clientmarginutilfo_ddmmyyyy_1.csv",
      url: import.meta.env.VITE_CLIENT_MARGIN_UTIL_FO,
    },
    { name: "cnc_ddmmyyyy_1.xlsx", url: import.meta.env.VITE_CNC },
    { name: "limit_ddmmyyyy_1.csv", url: import.meta.env.VITE_LIMIT },
    {
      name: "weballocation_ddmmyyyy_1.xlsx",
      url: import.meta.env.VITE_WEBALLOCATION,
    },
  ];

  const handleFileUpload = async () => {
    if (selectedFiles.length !== 6) {
      setFileError("Please select exactly 6 files.");
      return;
    }

    try {
      dispatch(showLoader("Please wait, we are processing your request..."));

      // Create an array to store the promises for file reading
      const filePromises: Promise<{
        file_name: string;
        file_content: string;
      }>[] = [];

      // Use forEach to iterate over selectedFiles and create promises
      selectedFiles.forEach((file) => {
        const filePromise = new Promise<{
          file_name: string;
          file_content: string;
        }>((resolve, reject) => {
          const reader = new FileReader();

          reader.onload = () => {
            const base64String = reader.result as string;

            // Remove the base64 prefix (data:<mime-type>;base64,)
            const fileContent = base64String.replace(/^data:.*;base64,/, "");

            resolve({
              file_name: file.name,
              file_content: fileContent,
            });
          };

          reader.onerror = reject;
          reader.readAsDataURL(file); // Reads the file as base64
        });

        // Push the promise into the array
        filePromises.push(filePromise);
      });

      // Wait for all file promises to resolve
      const resolvedFiles = await Promise.all(filePromises);

      // Prepare the payload
      const Id = localStorage.getItem("Id");
      const payload = {
        user_id: Id, // Use the correct user ID
        files: resolvedFiles, // The resolved files will be sent in the payload
      };

      const token = localStorage.getItem("tkn");
      console.log("payload", payload);

      // Send the request to upload files
      const response = await axios.post(
        `https://middlewareapi.lkp.net.in${endpoints.shortAllocation}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("File upload response:", response.data);
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      dispatch(hideLoader());
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Row style={{ fontFamily: "Public Sans" }}>
            <Col lg={12}>
              <Card style={{ minHeight: "85vh" }}>
                <CardHeader>
                  <h4 className="card-title mb-0">RMS File Upload</h4>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col lg={6}>
                      {/* Upload Section */}
                      <div>
                        <Label
                          htmlFor="formFileMultiple"
                          className="form-label"
                        >
                          Select Files (exactly 6 files required)
                        </Label>
                        <Input
                          className="form-control"
                          type="file"
                          id="formFileMultiple"
                          multiple
                          accept=".csv, .xlsx"
                          onChange={handleFileChange}
                          invalid={!!fileError}
                        />
                        {fileError && <FormFeedback>{fileError}</FormFeedback>}
                      </div>

                      {/* Display selected file names */}
                      {selectedFiles.length > 0 && (
                        <Row className="mt-3">
                          <Col>
                            <Label>Selected Files:</Label>
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

                      {/* Upload Button */}
                      <Row>
                        <Col className="mt-3">
                          <Button
                            onClick={handleFileUpload}
                            disabled={selectedFiles.length !== 6}
                            style={{
                              backgroundColor: "#11395C",
                            }}
                          >
                            Upload Files
                          </Button>
                        </Col>
                      </Row>
                    </Col>

                    {/* Sample Files Section */}
                    <Col lg={6}>
                      <h5>Sample Files:</h5>
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
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  );
};

export default RMSAllocation;
