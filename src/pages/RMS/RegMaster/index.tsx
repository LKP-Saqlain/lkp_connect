import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import { AppDispatch, RootState } from "../../../redux/store";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
// import ShowToast from "../../../utils/toastUtils";
import { apiServices } from "../../../services";
import UserInfoTable from "../../../components/common/UserInfoTable";

const RegMaster = ({ activeSubItem }: any) => {
  const [rows, setRows] = useState<any[]>([]);

  const dispatch = useDispatch<AppDispatch>();
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );

  useEffect(() => {
    const fetchRegMasterData = async () => {
      const payload = { user_id };
      dispatch(showLoader(""));

      try {
        const response = await apiServices.ViewREGMasterdata(payload);

        if (response?.status === 200 && Array.isArray(response?.data?.data)) {
          const records = response.data.data.map(
            (item: any, index: number) => ({
              id: index + 1, // ✅ Add incremental id
              ...item,
            })
          );

          console.log("Processed Records:", records);
          setRows(records);
        }
      } catch (error) {
        console.error("Error fetching REG Master Data:", error);
      } finally {
        dispatch(hideLoader());
      }
    };

    fetchRegMasterData();
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
                  {" "}
                  <UserInfoTable activeSubItem={activeSubItem} T6Data={rows} />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  );
};

export default RegMaster;
