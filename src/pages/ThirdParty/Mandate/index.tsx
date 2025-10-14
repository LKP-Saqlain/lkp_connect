import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import { apiServices } from "../../../services";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import UserInfoTable from "../../../components/common/UserInfoTable";
import ShowToast from "../../../utils/toastUtils";

type MandateUser = {
  clientCode: string;
  clientName: string;
  branchcode: string;
  zone: string;
  boid: string;
  dpDebit: number;
  mandateAmount: number;
  umn: string;
  referenceNumber: string;
  nextRecurDate: string;
};

const MandatePayment = ({ activeSubItem }: any) => {
  const [userData, setUserData] = useState<MandateUser[]>([]);

  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    let payload = {
      user_id: user_id,
    };
    dispatch(showLoader(""));
    apiServices
      .CollectMandatePayment(payload)
      .then((response) => {
        if (response?.status === 200) {
          console.log("Response", response?.data?.data);
          setUserData(response?.data?.data);
          dispatch(hideLoader());
        }
      })
      .catch((error) => {
        console.log("Errror", error);
        dispatch(hideLoader());
      });
  }, [dispatch]);

  const handleIntimation = () => {
    // debugger;
    let payload = {
      requestInfo: {
        pgMerchantId: "HDFC000010010275",
        pspRefNo: "",
      },
      mandate: {
        action_type: "MANDATE_NOTIFY",
        onBehalf_Of: "PAYEE",
        amount: userData[0]?.mandateAmount?.toString() || "0.00",
        UMN: userData[0]?.umn || "",
        recurrence: {
          nextRecurDate: userData[0]?.nextRecurDate || "",
          seqNo: 1,
        },
      },
    };
    dispatch(showLoader(""));
    apiServices
      .PreDebitMandateNotify(payload)
      .then((response) => {
        if (response?.status === 200) {
          dispatch(hideLoader());
          console.log("Reponsee", response?.data?.data?.statusDesc);
          ShowToast("success", response?.data?.data?.statusDesc);
        }
      })
      .catch((error) => {
        console.log("Error", error);
        dispatch(hideLoader());
      });
  };

  const handleExecution = () => {
    let payload = {
      requestInfo: {
        pgMerchantId: "HDFC000010010275",
        pspRefNo: "",
      },
      mandate: {
        amount: userData[0]?.mandateAmount?.toString() || "0.00",
        UMN: userData[0]?.umn,
        action_type: "RECUR_PAY",
        onBehalf_Of: "PAYEE",
        expiryTime: "180",
        recurringSeqNo: 1,
      },
      addInfo: {
        addInfo1: "Test Data 1",
        addInfo2: "Test Data 2",
        addInfo3: "Test Data 3",
        addInfo4: "Test Data 4",
        addInfo5: "Test Data 5",
        addInfo6: "Test Data 6",
        addInfo7: "Test Data 7",
        addInfo8: "Test Data 8",
        addInfo9: "Test Data 9",
        addInfo10: "Test Data 10",
      },
      remarks: "Execution test",
    };
    dispatch(showLoader(""));
    apiServices
      .ExecuteUpiMandate(payload)
      .then((response) => {
        if (response?.status === 200) {
          dispatch(hideLoader());
          console.log("Reponsee", response?.data?.data);
          ShowToast("success", response?.data?.data?.statusDesc);
        }
      })
      .catch((error) => {
        console.log("Error", error);
        dispatch(hideLoader());
      });
  };
  return (
    <React.Fragment>
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
                <Row className="mb-3 px-3">
                  <Col className="d-flex ">
                    <Button
                      style={{
                        width: "150px",
                        backgroundColor: "#11395C",
                        marginRight: "1rem",
                        marginLeft: "1rem",
                        marginTop: "1rem",
                      }}
                      size="sm"
                      onClick={() => handleIntimation()}
                    >
                      Intimation
                    </Button>

                    <Button
                      style={{
                        width: "150px",
                        backgroundColor: "#11395C",
                        marginRight: "1rem",
                        marginLeft: "1rem",
                        marginTop: "1rem",
                      }}
                      size="sm"
                      onClick={() => handleExecution()}
                    >
                      Execution
                    </Button>
                  </Col>
                </Row>
                <CardBody>
                  {" "}
                  <UserInfoTable
                    activeSubItem={activeSubItem}
                    T6Data={userData}
                    // handleDownload={handleDownload}
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

export default MandatePayment;
