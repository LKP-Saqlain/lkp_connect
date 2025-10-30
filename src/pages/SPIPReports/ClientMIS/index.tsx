import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import { AppDispatch } from "../../../redux/store";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
import { apiServices } from "../../../services";
import UserInfoTable from "../../../components/common/UserInfoTable";

interface ClientMIS {
  activeSubItem: any;
}

interface ClientMISData {
  id: number;
  clientName: string;
  raCode: string;
  clientCode: string;
  partnerName: string;
  partnerCode: string;
  totalSPIPIRevenue: number;
  partnerShare: number;
  lkpShare: number;
  totalBrokRevenue: number;
  partnerbrokShare: number;
  lkpbroshare: number;
  cmobileno: string;
  email: string;
  rmName: string;
  zoneCode: string;
}

const ClientMIS = ({ activeSubItem }: ClientMIS) => {
  const [clientData, setClientData] = useState<ClientMISData[]>([]);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const payload = {
      branchCode: "ALL",
      clientCode: "ALL",
      rmName: "ALL",
      zoneCode: "ALL",
    };

    dispatch(showLoader(""));
    apiServices
      .GetClientMISDetails(payload)
      .then((response) => {
        if (response?.status === 200) {
          dispatch(hideLoader());
          const apiData = response?.data?.data || [];

          const formattedData = apiData.map((item: any, index: number) => ({
            id: index + 1,
            ...item,
          }));

          setClientData(formattedData);
          console.log("Client MIS Data:", formattedData);
        }
      })
      .catch((error) => {
        console.log("Error", error);
        dispatch(hideLoader());
      });
  }, [dispatch]);

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
                  {" "}
                  <UserInfoTable
                    activeSubItem={activeSubItem}
                    T6Data={clientData}
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

export default ClientMIS;
