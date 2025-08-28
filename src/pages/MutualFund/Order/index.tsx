import { useState } from "react";
import BasicTabs from "../../../components/common/MutualFunds/NavTabs";
import { Card } from "@mui/material";
import MutualFundTable from "../../../components/common/MutualFunds/MfTable";
import { mutualFundRows } from "../../../helper/commmon";

const tabList = [
  { label: "Completed" },
  { label: "In Process" },
  { label: "Failed" },
];
const MfOrder = () => {
  const [OrderTab, setOrderTab] = useState(0);
  // const [selectedLabel, setSelectedLabel] = useState<string>(tabList[0].label);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setOrderTab(newValue);
    const label = tabList[newValue]?.label;
    // setSelectedLabel(label);
    console.log("Selected Tab Index:", newValue);
    console.log("Selected Tab Label:", label);
  };
  return (
    <>
      <Card sx={{ borderRadius: 4, p: 2, mb: 3 }}>
        <BasicTabs
          heading="Orders"
          tabs={tabList}
          value={OrderTab}
          onChange={handleTabChange}
        />
      </Card>
      <Card sx={{ borderRadius: 4, p: 2 }}>
        <MutualFundTable
          rows={mutualFundRows}
          selectedLabel={"MutualFundOrder"}
        />
      </Card>
    </>
  );
};

export default MfOrder;
