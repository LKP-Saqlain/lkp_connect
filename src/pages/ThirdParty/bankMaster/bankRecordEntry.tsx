import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import ModalComponent from "../../../components/common/masterModal";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice.ts";
import { apiServices } from "../../../services/index.ts";
import DataTable from "../../../components/common/UserInfoTable";
import ShowToast from "../../../utils/toastUtils.tsx";
import dayjs from "dayjs";

type BankRecord = {
  Id: number;
  MemberName: string;
  BankAccountName: string;
  BankAccountNumber: string;
  AccountDescription: string;
  IFSCCode: string;
  Purpose: string;
  AccountType: string;
  Status: string;
  OpeningDate: string;
  ClosingDate: string;
  Division: string;
};

const bankRecordEntry = ({ activeSubItem }: any) => {
  const [modal_grid, setmodal_grid] = useState<boolean>(false);
  const [editUserCheck, setEditUserCheck] = useState(false);
  const [editData, setEditData] = useState<BankRecord | null>(null);
  const [pendingBankAccounts, setPendingBankAccounts] = useState<any[]>([]);

  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data,
  );
  const userId = user_id?.split("-")[1];
  const dispatch = useDispatch<AppDispatch>();

  function tog_grid() {
    setmodal_grid(!modal_grid);
    setEditUserCheck(false);
  }

  const handleUpdateBankMaster = (data: any) => {
    console.log("Test123321", data, editData);

    const payload = {
      actionType: "UPDATE",
      id: editData && editData?.Id,
      memberName: data?.memberName,
      bankAccountName: data?.bankAccountName,
      bankAccountNumber: data?.bankAccountNumber,
      accountDescription: data?.accountDescription,
      ifscCode: data?.bankMasterIfscCode,
      purpose: data?.purpose,
      accountType: data?.accountType,
      status: data?.status,
      openingDate: data?.openingDate
        ? dayjs(data.openingDate).format("YYYY-MM-DD")
        : null,

      closingDate: data?.closingDate
        ? dayjs(data.closingDate).format("YYYY-MM-DD")
        : null,
      division: data?.division,
      userId: userId,
    };
    console.log("Payload", payload);

    dispatch(showLoader(""));
    apiServices
      .GetEntry_Update(payload)
      .then((response) => {
        if (response?.status === 200) {
          console.log("Insert_Success", response?.data?.data[0]?.msg);
          ShowToast("success", response?.data?.data[0]?.msg);
          setmodal_grid(!modal_grid);

          // Call pending API
          getPendingBankAccounts();
        }
      })
      .catch((error) => {
        console.log("Insert Error", error);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  const handleFormSubmit = (data: any, apiStatus: any) => {
    console.log("Received form data in parent:", data, apiStatus);

    if (editUserCheck) {
      handleUpdateBankMaster(data);
      return;
    }

    const payload = {
      actionType: "insert",
      memberName: data?.memberName,
      bankAccountName: data?.bankAccountName,
      bankAccountNumber: data?.bankAccountNumber,
      accountDescription: data?.accountDescription,
      ifscCode: data?.bankMasterIfscCode,
      purpose: data?.purpose,
      accountType: data?.accountType,
      status: data?.status,
      openingDate: data?.openingDate,
      closingDate: data?.closingDate === "" ? null : data?.closingDate,
      division: data?.division,
      userId: userId,
    };

    dispatch(showLoader(""));

    apiServices
      .InsertBankAcoountMaster(payload)
      .then((response) => {
        if (response?.status === 200) {
          console.log("Insert Success", response?.data?.data);
          setmodal_grid(!modal_grid);
          ShowToast("success", response?.data?.data[0].Message);
          // Call pending API
          getPendingBankAccounts();
        }
      })
      .catch((error) => {
        console.log("Insert Error", error);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  const getPendingBankAccounts = () => {
    const payload = {
      actionType: "GET",
    };
    dispatch(showLoader(""));
    apiServices
      .GetFinalReportBankAccountMaster(payload)
      .then((response) => {
        if (response?.status === 200) {
          const data = response?.data?.data || [];
          console.log("Pending Bank Accounts:", response?.data?.data);
          setPendingBankAccounts(data);
        }
      })
      .catch((error) => {
        console.log("Pending API Error:", error);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

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

  const getUserDetails = async (value: any) => {
    console.log("TestValue", value);

    const payload = {
      actionType: "delete",
      id: value?.Id,
      userId: value?.RequestedBy,
    };
    dispatch(showLoader(""));
    apiServices
      .GetEntry_Delete(payload)
      .then((response) => {
        if (response?.status === 200) {
          console.log("deleteResponse", response?.data?.data[0]);
          ShowToast("success", response?.data?.data[0].msg);
          getPendingBankAccounts();
        }
      })
      .catch((error) => {
        console.log("ERRRRROR-->", error);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  useEffect(() => {
    getPendingBankAccounts();
  }, []);

  return (
    <React.Fragment>
      <ModalComponent
        modal_grid={modal_grid}
        tog_grid={tog_grid}
        editData={editData}
        onSubmit={handleFormSubmit}
        editUserCheck={editUserCheck}
        isBankMasterContent={true}
        activeSubItem={activeSubItem}
      />
      <div className="page-content page-view">
        <div className="container-fluid">
          <Row className="row-font">
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
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {" "}
                    <h4 className="card-title mb-0">{activeSubItem}</h4>
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
                  {" "}
                  <DataTable
                    activeSubItem={activeSubItem}
                    T6Data={pendingBankAccounts}
                    getUserDetails={getUserDetails}
                    handleEditClick={handleEditClick}
                    // handleApproval={handleApproval}
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

export default bankRecordEntry;
