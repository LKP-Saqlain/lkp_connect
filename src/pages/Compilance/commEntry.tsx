import { Box } from "@mui/material";
import React, { useState } from "react";
import { Button, Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import UserInfoTable from "../../components/common/UserInfoTable";
import ModalComponent from "../../components/common/ComplianceModal";

const dummyData = [
  {
    id: 1,
    dateOfCommunication: "2024-01-01",
    typeOfDocuments: "Circular",
    communicationType: "Internal",
    emailLogReport: "log_1.pdf",
    physicalDispatchProof: "proof_1.pdf",
    department: "IT",
  },
  {
    id: 2,
    dateOfCommunication: "2024-01-05",
    typeOfDocuments: "Report",
    communicationType: "External",
    emailLogReport: "log_2.pdf",
    physicalDispatchProof: "proof_2.pdf",
    department: "Account",
  },
  // Add more dummy data here...
];

const CommEntry = ({ activeSubItem }: any) => {
  // const [modal_backdrop, setmodal_backdrop] = useState<boolean>(false);
  const [modal_grid, setmodal_grid] = useState<boolean>(false);

  function tog_grid() {
    setmodal_grid(!modal_grid);
  }

  const handleEditClick = (data: any) => {
    console.log("TestModalData", data);
    setmodal_grid(true);
  };

  return (
    <React.Fragment>
      <ModalComponent modal_grid={modal_grid} tog_grid={tog_grid} />
      <div className="page-content">
        <div className="container-fluid">
          <Row className="row-font">
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <h4 className="card-title mb-0">Communication Entry</h4>
                </CardHeader>
                <CardBody>
                  <Box>
                    <Button
                      type="submit"
                      variant="contained"
                      className="btn-font"
                      onClick={tog_grid}
                      style={{
                        backgroundColor: "#11395C",
                      }}
                    >
                      Add User
                    </Button>
                  </Box>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <UserInfoTable
                    activeSubItem={activeSubItem}
                    T6Data={dummyData}
                    handleEditClick={handleEditClick}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  );
};

export default CommEntry;
