import { Card, CardBody, CardHeader } from "reactstrap";
import DataTable from "../../../../components/common/UserInfoTable";

const ApDetails = ({ data, PartnerStatus }: any) => {
  return (
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
        <h5 style={{ margin: 0, fontWeight: 500 }}>Details</h5>
      </CardHeader>
      <CardBody>
        <DataTable
          T6Data={data}
          activeSubItem={"Referal Entry Status"}
          onStatusClick={PartnerStatus}
        />
      </CardBody>
    </Card>
  );
};

export default ApDetails;
