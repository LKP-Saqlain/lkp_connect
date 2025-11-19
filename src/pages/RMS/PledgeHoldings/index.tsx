// import React from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Input,
  Row,
} from "reactstrap";
import DataTable from "../../../components/common/UserInfoTable";
import { useRef, useState } from "react";

const PledgeHolding = (activeSubItem: any) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [data, setdata] = useState<any[]>([]);
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
            <h4 className="card-title mb-0">Third Party Invoice Upload </h4>
          </CardHeader>
          <CardBody>
            <Row>
              <Col lg={12} className="mb-3">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    width: "100%",
                    maxWidth: "100%", // use full width
                    flexWrap: "wrap", // allows wrapping if screen gets small
                  }}
                >
                  <Input
                    type="file"
                    // innerRef={fileInputRef}
                    accept=".xlsx"
                    className="form-control"
                    // onChange={handleFileChange}
                    style={{ width: "250px", minHeight: "40px" }}
                  />
                  <Input
                    type="file"
                    // innerRef={fileInputRef}
                    accept=".xlsx"
                    className="form-control"
                    // onChange={handleFileChange}
                    style={{ width: "250px", minHeight: "40px" }}
                  />

                  <Button
                    style={{
                      backgroundColor: "#11395C",
                      color: "#fff",
                      whiteSpace: "nowrap",
                    }}
                    // onClick={handleUpload}
                    // disabled={!selectedFile}
                  >
                    Upload
                  </Button>

                  {selectedFile && (
                    <>
                      <span style={{ fontSize: "14px", whiteSpace: "nowrap" }}>
                        Uploaded File: {selectedFile.name}
                      </span>
                      <Button
                        style={{
                          backgroundColor: "#11395C",
                          color: "#fff",
                          padding: "4px 10px",
                          fontSize: "12px",
                          borderRadius: "20px",
                          lineHeight: "1",
                        }}
                        // onClick={handleFileDelete}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </Col>
            </Row>
            {data.length > 0 && (
              <>
                <DataTable
                  activeSubItem={activeSubItem}
                  // T6Data={data}
                  customCss={true}
                  customHide={true}
                />
              </>
            )}
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default PledgeHolding;
