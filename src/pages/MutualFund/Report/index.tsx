import { useState } from "react";
import BasicTabs from "../../../components/common/MutualFunds/NavTabs";
import { Card } from "@mui/material";
import MutualFundTable from "../../../components/common/MutualFunds/MfTable";
import { mutualFundRows } from "../../../helper/commmon";

const tabList = [
  { label: "Mandates" },
  { label: "Upcoming SIP" },
  { label: "Ongoing SIP" },
  { label: "Transaction" },
];

const MfReport = () => {
  const [reportTab, setReportTab] = useState(0);
  const [selectedLabel, setSelectedLabel] = useState<string>(tabList[0].label);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setReportTab(newValue);
    const label = tabList[newValue]?.label;
    setSelectedLabel(label);
    console.log("Selected Tab Index:", newValue);
    console.log("Selected Tab Label:", label);
  };

  return (
    <>
      <Card sx={{ borderRadius: 4, p: 2, mb: 3 }}>
        <BasicTabs
          heading="Report"
          tabs={tabList}
          value={reportTab}
          onChange={handleTabChange}
        />
      </Card>
      <Card sx={{ borderRadius: 4, p: 2 }}>
        <MutualFundTable rows={mutualFundRows} selectedLabel={selectedLabel} />
      </Card>
    </>
  );
};

export default MfReport;
