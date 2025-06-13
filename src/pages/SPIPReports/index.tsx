import React, { useEffect, Suspense } from "react";
import SPIPPerformanceDashboard from "./PerformanceDashboard";
import SPIPPerformanceSummary from "./ClientPerformanceSummary";
import SubScriptionDetails from "./SubscriptionDetails";
import SPIPBranchWise from "./BranchWiseReport";
import SPIPClientWiseReport from "./ClientWiseReport";
import ClientDetails from "./SPIPClientDetails";
import { SubItemKeys } from "../../constants/subItemKeys";
import Loader from "../../components/common/Loader";

interface SPIPProps {
  activeSubItem: string;
  activeMenu: string;
}

const SPIP = ({ activeSubItem, activeMenu }: SPIPProps) => {
  useEffect(() => {
    console.log("activeMenu", activeMenu, "activeSubItem", activeSubItem);
  }, [activeSubItem, activeMenu]);

  const componentMap: Record<string, React.ReactNode> = {
    [SubItemKeys.SPIP_Per_Summ]: (
      <SPIPPerformanceSummary activeSubItem={activeSubItem} />
    ),
    [SubItemKeys.SPIP_Dashboard]: (
      <SPIPPerformanceDashboard activeSubItem={activeSubItem} />
    ),
    [SubItemKeys.SPIP_SUBSCRIBE_DETAIL]: (
      <SubScriptionDetails activeSubItem={activeSubItem} />
    ),
    [SubItemKeys.SPIP_BRANCH_WISE_FEES]: (
      <SPIPBranchWise activeSubItem={activeSubItem} />
    ),
    [SubItemKeys.SPIP_CLIENT_WISE_FEES]: (
      <SPIPClientWiseReport activeSubItem={activeSubItem} />
    ),
    [SubItemKeys.SPIP_CLIENT_DETAILS]: (
      <ClientDetails activeSubItem={activeSubItem} />
    ),
  };

  const isValidSubItem =
    activeMenu === SubItemKeys.SPIP && componentMap[activeSubItem];

  return (
    <div>
      <Suspense fallback={<Loader />}>
        {isValidSubItem && componentMap[activeSubItem]}
      </Suspense>
    </div>
  );
};

export default SPIP;
