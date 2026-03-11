import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import { AppDispatch } from "../../../redux/store";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { apiServices } from "../../../services";
import DataTable from "../../../components/common/UserInfoTable";

const BankReport = ({ activeSubItem }: any) => {
  const [bankRecords, SetBankRecords] = useState<any[]>([]);

  const dispatch = useDispatch<AppDispatch>();
  const getBankRecords = () => {
    const payload = {
      actionType: "FINALREPORT",
    };
    dispatch(showLoader(""));
    apiServices
      .BankAccountMaster_report(payload)
      .then((response) => {
        if (response?.status === 200) {
          const data = response?.data?.data || [];

          const processedData = data.map((item: any, index: number) => ({
            Id: index + 1,
            ...item,
          }));
          console.log("BankAccountsRecords:", response?.data?.data);
          SetBankRecords(processedData);
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
    getBankRecords();
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
                  <DataTable
                    activeSubItem={activeSubItem}
                    T6Data={bankRecords}
                    // getUserDetails={getUserDetails}
                    // handleEditClick={handleEditClick}
                    // handleApproval={handleApproval}
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

export default BankReport;
