import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import UserInfoTable from "../../components/common/UserInfoTable";
import ModalComponent from "../../components/common/ComplianceModal";
import { apiServices } from "../../services";
import { useDispatch, useSelector } from "react-redux";
import { showLoader, hideLoader } from "../../redux/slices/loaderSlice";
import ShowToast from "../../utils/toastUtils";
import { RootState } from "../../redux/store";
// import dayjs from "dayjs";
// import dayjs from "dayjs";

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
  rid: number;
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

const today = new Date();
const day = today.getDate().toString().padStart(2, "0");
const month = (today.getMonth() + 1).toString().padStart(2, "0");
const year = today.getFullYear();
const formattedDate = `${year}/${month}/${day}`;

const CommEntry = ({ activeSubItem }: any) => {
  // const [modal_backdrop, setmodal_backdrop] = useState<boolean>(false);
  const [modal_grid, setmodal_grid] = useState<boolean>(false);
  const [formData, setFormData] = useState(null);
  const [editData, setEditData] = useState<ComplianceEntry | null>(null);
  const [userData, setUserData] = useState([]);
  const [apiStatus, setApiStatus] = useState(false);
  const [editUserCheck, setEditUserCheck] = useState(false);
  const [isRowDeleted, setIsRowDeleted] = useState(false);
  const [deletedRow, setDeletedRow] = useState<ComplianceEntry | null>(null);

  const dispatch = useDispatch();
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );

  useEffect(() => {
    if (isRowDeleted && deletedRow) {
      const fetchComplianceEntry = async () => {
        const payload = {
          financialYear: "",
          department: "",
          action: "view",
          documentType: "",
          typeOfDocuments: "",
          communicationType: "",
          communicationProof: "",
          communicationProofPath: "",
          dateOfCommunication: formattedDate,
          rowId: deletedRow?.rid || 0,
          userId: "",
          entryFlag: "",
          remark: "",
        };

        dispatch(showLoader("Please wait, we are processing your request..."));

        try {
          const response = await apiServices.ViewComplianceData(payload);
          const apiData = response?.data?.data || [];

          // ✅ Add id for each row
          const mappedData = apiData.map((item: any, index: number) => ({
            Id: index + 1,
            ...item,
          }));

          console.log("Mapped Data After Delete", mappedData);
          setUserData(mappedData);
        } catch (error) {
          console.error("Error", error);
        } finally {
          dispatch(hideLoader());
          // setIsRowDeleted(false); // keep commented if handled in Redux elsewhere
        }
      };

      fetchComplianceEntry();
    }
  }, [dispatch, isRowDeleted, deletedRow]);

  function tog_grid() {
    setmodal_grid(!modal_grid);
    setEditUserCheck(false);
  }

  const handleEditClick = (data: any, editCheck: boolean) => {
    // debugger;
    console.log("TestModalData", data, editCheck);
    // const formattedDate = data.DateOfCommunication
    //   ? dayjs(data.DateOfCommunication, "DD-MMM-YY").format("DD/MM/YYYY")
    //   : "";
    // const updatedData = { ...data, DateOfCommunication: formattedDate };

    setmodal_grid(true);
    setEditData(data);
    setEditUserCheck(editCheck);
  };

  const getUserDetails = async (row: any) => {
    console.log("ValueComm", typeof row);
    // handleEmailSend(value?.BOID);
    console.log("Delete Data", row);
    setDeletedRow(row);

    let payload = {
      rowId: row?.rid,
      userId: user_id,
    };

    dispatch(showLoader("Please wait, we are processing your request..."));
    try {
      const response = await apiServices.DeleteComplianceData(payload);
      dispatch(hideLoader());
      console.log("apiResponse111", response?.data?.message);
      ShowToast("success", response?.data?.message);
      setIsRowDeleted(true);
    } catch (error) {
      console.error("Error", error);
      dispatch(hideLoader());
    }
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
    if (editData?.rid) {
      const fetchComplianceEntry = async () => {
        const payload = {
          financialYear: editData.FinancialYear || "2024-2025",
          department: editData.Department || "ALL",
          action: "view",
          documentType: editData.documentType || "string",
          typeOfDocuments: editData.TypeOfDocuments || "ALL",
          communicationType: editData.CommunicationType || "string",
          communicationProof: editData.CommunicationProof || "string",
          communicationProofPath: editData.CommunicationProofPath || "string",
          dateOfCommunication: formattedDate,
          rowId: editData.rid || 0,
          userId: editData.CreatedBy || "",
          entryFlag: "",
          remark: "",
        };

        dispatch(showLoader("Please wait, we are processing your request..."));

        try {
          const response = await apiServices.ViewComplianceData(payload);
          const apiData = response?.data?.data || [];

          const mappedData = apiData.map((item: any, index: number) => ({
            Id: index + 1,
            ...item,
          }));

          console.log("Mapped Edit Data", mappedData);
          setUserData(mappedData);
        } catch (error) {
          console.error("Error", error);
        } finally {
          dispatch(hideLoader());
        }
      };

      fetchComplianceEntry();
    }
  }, [dispatch, editData]);

  //this useEffect call direct after insert api calls from modalComponent
  useEffect(() => {
    const fetchComplianceEntry = async () => {
      const payload = {
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
        entryFlag: "",
        remark: "",
      };

      dispatch(showLoader("Please wait, we are processing your request..."));

      try {
        const response = await apiServices.ViewComplianceData(payload);
        dispatch(hideLoader());

        const apiData = response?.data?.data || [];

        const mappedData = apiData.map((item: any, index: number) => ({
          Id: index + 1,
          ...item,
        }));

        console.log("Mapped Data", mappedData);
        setUserData(mappedData);
      } catch (error) {
        console.error("Error", error);
        dispatch(hideLoader());
      }
    };

    if (apiStatus || apiStatus === false) {
      fetchComplianceEntry();
    }

    if (apiStatus) {
      const timeoutId = setTimeout(() => {
        setApiStatus(false);
      }, 3000);
      return () => clearTimeout(timeoutId);
    }
  }, [dispatch, apiStatus]);

  return (
    <React.Fragment>
      <ModalComponent
        modal_grid={modal_grid}
        tog_grid={tog_grid}
        editData={editData}
        onSubmit={handleFormSubmit}
        editUserCheck={editUserCheck}
      />
      <div className="page-content page-view">
        <div className="container-fluid">
          <Row className="row-font">
            <Col lg={12}>
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
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {" "}
                    <h4 className="card-title mb-0">Communication Entry</h4>
                    <Box>
                      <Button
                        type="submit"
                        variant="contained"
                        className="btn-font"
                        onClick={tog_grid}
                        style={{
                          backgroundColor: "#11395C",
                          height: "32px",
                          fontSize: "13px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          textTransform: "none",
                          borderRadius: "6px",
                        }}
                      >
                        Add
                      </Button>
                    </Box>
                  </div>
                </CardHeader>
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
