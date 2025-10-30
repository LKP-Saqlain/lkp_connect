import { useEffect, useState } from "react";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { apiServices } from "../../../services";
import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";
import DataTable from "../../../components/common/UserInfoTable";
import ShowToast from "../../../utils/toastUtils";

const Index = ({ activeSubItem }: any) => {
  const [data, setData] = useState<any[]>([]);
  const [createdDate, setCreatedDate] = useState("2025-10-27");
  const dispatch = useDispatch<AppDispatch>();

  const fetchLedgerReport = async () => {
    const payload = { createdDate };

    try {
      dispatch(showLoader("Loading Ledger Report..."));
      const response = await apiServices.GetLedgerReport(payload);

      const result = response?.data?.data || [];
      setData(
        result.map((item: any, index: number) => ({
          id: index + 1,
          ...item,
        }))
      );
      console.log(setCreatedDate);
    } catch (err) {
      ShowToast("error", "Failed to fetch ledger report.");
    } finally {
      dispatch(hideLoader());
    }
  };

  // 🔁 Run once on mount
  useEffect(() => {
    fetchLedgerReport();
  }, []);

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
            <h4 className="card-title mb-0">Ledger Report</h4>
          </CardHeader>

          <CardBody>
            <Row>
              <Col>
                <DataTable activeSubItem={activeSubItem} T6Data={data} />
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default Index;
