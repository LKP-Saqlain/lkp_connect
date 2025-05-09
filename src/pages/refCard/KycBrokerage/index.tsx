import { Card, CardBody, CardHeader, Container } from "reactstrap";
import DataTable from "../../../components/common/UserInfoTable";
import { dummyClientPlanData } from "../../../helper/commmon";

const KycBrokerage = ({ activeSubItem }: any) => {
  // const KycBrokerage = () => {
  //   console.log("kycBrokerage");
  // };
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
            <h4 className="card-title mb-0">KYC</h4>
          </CardHeader>
          <CardBody>
            <DataTable
              activeSubItem={activeSubItem}
              T6Data={dummyClientPlanData}
            />
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default KycBrokerage;
