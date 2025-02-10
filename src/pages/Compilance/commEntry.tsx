import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import UserInfoTable from "../../components/common/UserInfoTable";
import ModalComponent from "../../components/common/ComplianceModal";
import { apiServices } from "../../services";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "../../redux/slices/loaderSlice";
import ShowToast from "../../utils/toastUtils";

// const dummyData = [
//   {
//     id: 1,
//     dateOfCommunication: "2024-01-01",
//     typeOfDocuments: "Circular",
//     communicationType: "Email",
//     proofOfCommunication: "Digital",
//     ProofOfDescription: "PAN",
//     department: "IT",
//   },
//   {
//     id: 2,
//     dateOfCommunication: "2024-01-05",
//     typeOfDocuments: "SEBI",
//     communicationType: "Physical",
//     proofOfCommunication: "Digital",
//     ProofOfDescription: "AADHAAR",
//     department: "Account",
//   },
//   // Add more dummy data here...
// ];
interface ComplianceEntry {
  RowId: number;
  FinancialYear: string;
  DateOfCommunication: string;
  TypeOfDocuments: string;
  CommunicationType: string;
  CommunicationProof: string;
  CommunicationProofPath: string;
  Department: string;
  documentType: string;
  CreatedBy: string;
  CreatedDateTime: string;
  CheckerBy: string;
  CheckerDatetime: string;
  ModifiedBy?: string | null;
  ModifiedDatetime?: string | null;
  IsDeleted: string;
}

const CommEntry = ({ activeSubItem }: any) => {
  // const [modal_backdrop, setmodal_backdrop] = useState<boolean>(false);
  const [modal_grid, setmodal_grid] = useState<boolean>(false);
  const [formData, setFormData] = useState(null);
  const [editData, setEditData] = useState<ComplianceEntry | null>(null);
  const [userData, setUserData] = useState([]);
  const [apiStatus, setApiStatus] = useState(false);
  const [editUserCheck, setEditUserCheck] = useState(false);
  const [isRowDeleted, setIsRowDeleted] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isRowDeleted) {
      const fetchComplianceEntry = async () => {
        const today = new Date();
        const formattedDate = `${today
          .getDate()
          .toString()
          .padStart(2, "0")}/${(today.getMonth() + 1)
          .toString()
          .padStart(2, "0")}/${today.getFullYear()}`;

        let payload = {
          financialYear: "",
          department: "",
          action: "view",
          documentType: "",
          typeOfDocuments: "",
          communicationType: "",
          communicationProof: "",
          communicationProofPath: "",
          dateOfCommunication: formattedDate,
          rowId: 0,
          userId: "",
        };

        dispatch(showLoader("Please wait"));
        try {
          const response = await apiServices.ComplainceReport(payload);
          dispatch(hideLoader());
          console.log("apiResponse", response?.data?.Table);
          // setUserData(response?.data?.Table);
        } catch (error) {
          console.error("Error", error);
          dispatch(hideLoader());
        } finally {
          dispatch(hideLoader());
          setIsRowDeleted(false); // Reset flag in Redux store
        }
      };
      fetchComplianceEntry();
    }
  }, [dispatch, isRowDeleted]);

  function tog_grid() {
    setmodal_grid(!modal_grid);
  }

  const handleEditClick = (data: any, editCheck: boolean) => {
    console.log("TestModalData", data, editCheck);
    setmodal_grid(true);
    setEditData(data);
    setEditUserCheck(editCheck);
  };

  const getUserDetails = (row: any) => {
    console.log("ValueComm", row);
    // handleEmailSend(value?.BOID);
    console.log("Delete Data", row);

    let payload = {
      financialYear: row.FinancialYear,
      department: row.Department,
      action: "delete",
      typeOfDocuments: row.TypeOfDocuments,
      communicationType: row.CommunicationType,
      communicationProof: row.CommunicationProof,
      communicationProofPath: row.CommunicationProofPath,
      dateOfCommunication: row.DateOfCommunication
        ? new Date(row.DateOfCommunication).toLocaleDateString("en-GB")
        : "02/03/2025",
      rowId: row.RowId || 0,
      userId: "",
      DocumentType: row.DocumentType,
    };
    dispatch(showLoader("Please wait"));
    apiServices
      .ComplainceReport(payload)
      .then((response) => {
        dispatch(hideLoader());
        console.log("apiResponse", response?.data?.Table);
        // setUserData(response?.data?.Table);
        ShowToast("success", response?.data?.Table[0].Message);
      })
      .catch((error) => {
        dispatch(hideLoader());
        console.log("Error", error);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  useEffect(() => {
    if (apiStatus) {
      setEditData(null);
    }
  }, [apiStatus]);

  const handleFormSubmit = (data: any, apiStatus: any) => {
    console.log("Received form data in parent:", data, formData, apiStatus);
    setFormData(data);
    setmodal_grid(false);
    setApiStatus(apiStatus);
  };

  useEffect(() => {
    if (editData?.RowId) {
      const fetchComplianceEntry = async () => {
        let payload = {
          financialYear: editData.FinancialYear || "2024-2025",
          department: editData.Department || "ALL",
          action: "view",
          documentType: editData.documentType || "string",
          typeOfDocuments: editData.TypeOfDocuments || "ALL",
          communicationType: editData.CommunicationType || "string",
          communicationProof: editData.CommunicationProof || "string",
          communicationProofPath: editData.CommunicationProofPath || "string",
          dateOfCommunication: editData.DateOfCommunication
            ? new Date(editData.DateOfCommunication).toLocaleDateString("en-GB")
            : "02/03/2025",
          rowId: editData.RowId || 0,
          userId: editData.CreatedBy || "",
        };
        dispatch(showLoader("Please wait"));
        apiServices
          .ComplainceReport(payload)
          .then((response) => {
            dispatch(hideLoader());
            console.log("apiResponse", response?.data?.Table);
            setUserData(response?.data?.Table);
          })
          .catch((error) => {
            dispatch(hideLoader());
            console.log("Error", error);
          })
          .finally(() => {
            dispatch(hideLoader());
          });
      };
      fetchComplianceEntry();
    }
  }, [dispatch, editData]);

  //this useEffect call direct after insert api calls from modalComponent
  useEffect(() => {
    const fetchComplianceEntry = async () => {
      const today = new Date();
      const formattedDate = `${today.getDate().toString().padStart(2, "0")}/${(
        today.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}/${today.getFullYear()}`;

      let payload = {
        financialYear: "",
        department: "",
        action: "view",
        documentType: "",
        typeOfDocuments: "",
        communicationType: "",
        communicationProof: "",
        communicationProofPath: "",
        dateOfCommunication: formattedDate,
        rowId: 0,
        userId: "",
      };

      dispatch(showLoader("Please wait"));
      try {
        const response = await apiServices.ComplainceReport(payload);
        dispatch(hideLoader());
        console.log("apiResponse", response?.data?.Table);
        setUserData(response?.data?.Table);
      } catch (error) {
        console.error("Error", error);
        dispatch(hideLoader());
      }
    };

    // Call API on first render or when apiStatus is true
    if (apiStatus || apiStatus === false) {
      fetchComplianceEntry();
    }

    // Reset apiStatus to false after execution
    if (apiStatus) {
      const timeoutId = setTimeout(() => {
        setApiStatus(false);
      }, 3000);
      return () => clearTimeout(timeoutId);
    }
  }, [dispatch, apiStatus]); // Add apiStatus as dependency

  return (
    <React.Fragment>
      <ModalComponent
        modal_grid={modal_grid}
        tog_grid={tog_grid}
        editData={editData}
        onSubmit={handleFormSubmit}
        editUserCheck={editUserCheck}
      />
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
                      Add
                    </Button>
                  </Box>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <UserInfoTable
                    activeSubItem={activeSubItem}
                    T6Data={userData}
                    handleEditClick={handleEditClick}
                    // handleDeleteClick={handleDeleteClick}
                    getUserDetails={getUserDetails}
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
