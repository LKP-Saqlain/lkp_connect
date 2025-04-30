import { Card, CardBody, CardHeader } from "reactstrap";
import DataTable from "../../../components/common/UserInfoTable";
import { dummyClientPlanData } from "../../../helper/commmon";
const BrokerageModificationStatus = ({ activeSubItem }: any) => {
  console.log("active", activeSubItem);

  return (
    <Card>
      <CardHeader>
        <h4 className="card-title mb-0">Brokerage Modification Status</h4>
      </CardHeader>
      <CardBody>
        <DataTable activeSubItem={activeSubItem} T6Data={dummyClientPlanData} />
      </CardBody>
    </Card>
  );
};

export default BrokerageModificationStatus;
