import { useState } from "react";
import BasicTabs from "../../../components/common/MutualFunds/NavTabs";
import { Card } from "@mui/material";
import MutualFundTable from "../../../components/common/MutualFunds/MfTable";
import { mutualFundRows } from "../../../helper/commmon";

const MfOrder = () => {
  const [reportTab, setReportTab] = useState(0);

  return (
    <>
      <Card sx={{ borderRadius: 4, p: 2, mb: 3 }}>
        <BasicTabs
          heading="Orders"
          tabs={[
            { label: "Completed" },
            { label: "In Process" },
            { label: "Failed" },
          ]}
          value={reportTab}
          onChange={(e, newValue) => {
            setReportTab(newValue);
            console.log(newValue, e.target, reportTab);
          }}
        />
      </Card>
      <Card sx={{ borderRadius: 4, p: 2 }}>
        <MutualFundTable rows={mutualFundRows} />
      </Card>
    </>
  );
};

export default MfOrder;
