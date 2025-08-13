import { useEffect, useState } from "react";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { apiServices } from "../../../services";
import { Card, CardBody, CardHeader, Container } from "reactstrap";
import DataTable from "../../../components/common/UserInfoTable";

const ThirdPartyStatusReport = ({ activeSubItem }: any) => {
  const [data, setData] = useState<any>();

  const dispatch = useDispatch<AppDispatch>();
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );
  useEffect(() => {
    const payload = {
      user_id: user_id,
      // user_id: "EMP-0656",
    };
    dispatch(showLoader("Please wait, we are processing your request..."));

    apiServices
      .ViewThirdPartyMaster(payload)
      .then((response) => {
        console.log("A1 Data", response?.data?.data);
        setData(response?.data?.data);
      })
      .catch((error) => {
        console.error("Error fetching compliance data:", error);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  }, [dispatch]);
  return (
    <div className="page-content page-view">
      <Container fluid>
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
            <h4 className="card-title mb-0">
              Third Party Vendor Status Report
            </h4>
          </CardHeader>
          <CardBody>
            <DataTable
              activeSubItem={activeSubItem}
              T6Data={data}
              // handleApproval={handleApproval}
            />
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default ThirdPartyStatusReport;
