import React, { useEffect, Suspense } from "react";
import SPIPPerformanceDashboard from "./PerformanceDashboard";
import SPIPPerformanceSummary from "./ClientPerformanceSummary";
import { SubItemKeys } from "../../constants/subItemKeys";
import Loader from "../../components/common/Loader";

interface SPIPProps {
  activeSubItem: string;
  activeMenu: string;
}

const componentMap: Record<string, React.ReactNode> = {
  [SubItemKeys.REFERAL_ENTRY_STATUS]: <SPIPPerformanceSummary />,
  [SubItemKeys.REFERAL_ENTRY]: <SPIPPerformanceDashboard />,
};

const SPIP = ({ activeSubItem, activeMenu }: SPIPProps) => {
  useEffect(() => {
    console.log("activeMenu", activeMenu, "activeSubItem", activeSubItem);
  }, [activeSubItem, activeMenu]);

  const isValidSubItem =
    activeMenu === SubItemKeys.REFERAL_LEAD && componentMap[activeSubItem];

  return (
    <div>
      <Suspense fallback={<Loader />}>
        {isValidSubItem && componentMap[activeSubItem]}
      </Suspense>
    </div>
  );
};

export default SPIP;
