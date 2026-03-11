import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import { apiServices } from "../../../services";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import DataTable from "../../../components/common/UserInfoTable";
import ShowToast from "../../../utils/toastUtils";

const BankApproval = ({ activeSubItem }: any) => {
  const [pendingBankAccounts, setPendingBankAccounts] = useState<any[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data,
  );
  const userId = user_id?.split("-")[1];

  const getPendingBankAccounts = () => {
    const payload = {
      actionType: "GET_PENDING",
    };
    dispatch(showLoader(""));
    apiServices
      .GetPendingEntryBankAccountMaster(payload)
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

  const handleApproval = (row: any, remark: any, flag: any) => {
    console.log("ApprovalRecords", row, remark, flag);

    const payload = {
      actionType: "Approve",
      id: row,
      userId: userId,
      accApproval: flag === "R" ? "R" : "A",
      accRemark: remark,
    };
    dispatch(showLoader(""));
    apiServices
      .GetEntry_Approval(payload)
      .then((response) => {
        if (response?.status === 200) {
          const data = response?.data?.data || [];
          console.log("ApprovalResponse", data);
          ShowToast("success", data[0].msg);
          getPendingBankAccounts();
        }
      })
      .catch((error) => {
        console.log("Pending API Error:", error);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  useEffect(() => {
    getPendingBankAccounts();
  }, []);
  return (
    <>
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
                  <h4 className="card-title mb-0">{activeSubItem}</h4>
                </CardHeader>
                <CardBody>
                  {" "}
                  <DataTable
                    activeSubItem={activeSubItem}
                    T6Data={pendingBankAccounts}
                    // getUserDetails={getUserDetails}
                    // handleEditClick={handleEditClick}
                    handleApproval={handleApproval}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default BankApproval;
