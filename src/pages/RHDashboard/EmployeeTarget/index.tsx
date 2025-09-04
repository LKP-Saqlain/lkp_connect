import { useEffect, useState } from "react";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { apiServices } from "../../../services";
import { Card, CardBody, CardHeader, Container } from "reactstrap";
import DataTable from "../../../components/common/UserInfoTable";

const EmployeeTargetReport = ({ activeSubItem }: any) => {
  const [data, setData] = useState<any>();

  const dispatch = useDispatch<AppDispatch>();
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );

  useEffect(() => {
    const payload = {
      //   user_id: "EMP-0238",
      user_id: user_id,
      zone: "ALL",
    };
    dispatch(showLoader("Please wait, we are processing your request..."));

    apiServices
      .GetEmpContestReport(payload)
      .then((response) => {
        const result = response?.data?.data || [];
        console.log("A1 GEmployee Performance", result);
        setData(
          result.map((item: any, index: any) => ({
            ...item,
            id: index + 1,
          }))
        );
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
              Employee Target Report{" "}
              <span style={{ fontSize: "12px" }}> (July-September)</span>
            </h4>
          </CardHeader>
          <CardBody>
            <DataTable activeSubItem={activeSubItem} T6Data={data} />
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default EmployeeTargetReport;
