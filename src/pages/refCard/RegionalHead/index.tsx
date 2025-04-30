import { Card, CardBody, CardHeader } from "reactstrap";
import DataTable from "../../../components/common/UserInfoTable";
import { dummyClientPlanData } from "../../../helper/commmon";

const RegionalHead = ({ activeSubItem }: any) => {
  console.log("active", activeSubItem);

  return (
    <Card>
      <CardHeader>
        <h4 className="card-title mb-0">Regional Head</h4>
      </CardHeader>
      <CardBody>
        <DataTable activeSubItem={activeSubItem} T6Data={dummyClientPlanData} />
      </CardBody>
    </Card>
  );
};

export default RegionalHead;
