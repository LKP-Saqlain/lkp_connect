import { Card, CardBody, CardHeader } from "reactstrap";
import DataTable from "../../../components/common/UserInfoTable";
import { dummyClientPlanData } from "../../../helper/commmon";

const KycBrokerage = ({ activeSubItem }: any) => {
  // const KycBrokerage = () => {
  //   console.log("kycBrokerage");
  // };
  return (
    <Card>
      <CardHeader>
        <h4 className="card-title mb-0">KYC</h4>
      </CardHeader>
      <CardBody>
        <DataTable activeSubItem={activeSubItem} T6Data={dummyClientPlanData} />
      </CardBody>
    </Card>
  );
};

export default KycBrokerage;
