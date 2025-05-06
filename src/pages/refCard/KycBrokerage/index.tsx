import { Button, Card, CardBody, CardHeader } from "reactstrap";
import DataTable from "../../../components/common/table";
import { dummyClientPlanData } from "../../../helper/commmon";
import { useState } from "react";
import { BrokerageKyc } from "../../../helper/tableColumns";

const KycBrokerage = ({ activeSubItem }: any) => {
  const [selectedRows, setSelectedRows] = useState<any[]>([]);

  const handleButton = () => {
    console.log(activeSubItem, "handleButton:", selectedRows);
    setSelectedRows([]);
  };

  // Define your column headers

  return (
    <Card>
      <CardHeader>
        <h4 className="card-title mb-0">KYC</h4>
      </CardHeader>
      <CardBody>
        <DataTable
          tableData={dummyClientPlanData}
          dynamicHeader={BrokerageKyc}
          customRowSelection={true}
          onSelectionChange={setSelectedRows}
        />
        <Button color="success" className="mt-3 me-2" onClick={handleButton}>
          Approve
        </Button>
        <Button color="danger" className="mt-3" onClick={handleButton}>
          Reject
        </Button>
      </CardBody>
    </Card>
  );
};

export default KycBrokerage;
