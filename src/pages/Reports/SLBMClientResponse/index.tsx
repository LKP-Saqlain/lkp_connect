import React, { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import { apiServices } from "../../../services";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../redux/store";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
import UserInfoTable from "../../../components/common/UserInfoTable";

interface SLBMClientData {
  Zone: string | null;
  BranchCode: string | null;
  M_Type: string | null;
  ClientCode: string | null;
  ClientName: string | null;
  ClientType: string | null;
  ClientStatus: string | null;
  EmailID: string | null;
  MobileNo: string | null;
  RMName: string | null;
  DealerName: string | null;
}

const SLBMClientResponse = ({ activeSubItem }: any) => {
  const [SLBMClientData, setSLBMClientData] = useState<SLBMClientData[]>([]);

  const dispatch = useDispatch<AppDispatch>();

  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data,
  );

  useEffect(() => {
    const payload = {
      emailId: "",
      option: "View",
      type: "",
      userId: user_id,
    };

    dispatch(showLoader(""));

    apiServices
      .MarketingData(payload)
      .then((response) => {
        console.log("MarketingData Response:", response?.data);

        const data = response?.data?.data ?? [];

        const recordsWithId = data.map((item: any, index: number) => ({
          Id: index + 1,
          ...item,
        }));

        setSLBMClientData(recordsWithId);

        dispatch(hideLoader());
      })
      .catch((error) => {
        console.log("Error fetching MarketingData:", error);
        setSLBMClientData([]);
        dispatch(hideLoader());
      });
  }, [dispatch, user_id]);

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
                <CardBody>
                  <UserInfoTable
                    activeSubItem={activeSubItem}
                    T6Data={SLBMClientData}
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

export default SLBMClientResponse;
