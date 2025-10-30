import React, { useEffect, Suspense } from "react";
import SPIPPerformanceDashboard from "./PerformanceDashboard";
import SPIPPerformanceSummary from "./ClientPerformanceSummary";
import SubScriptionDetails from "./SubscriptionDetails";
import SPIPBranchWise from "./BranchWiseReport";
import SPIPClientWiseReport from "./ClientWiseReport";
import ClientDetails from "./SPIPClientDetails";
import PeroformanceReport from "./PerformanceReport";
// import SPIPOverview from "./SPIPOverview";
import { SubItemKeys } from "../../constants/subItemKeys";
import Loader from "../../components/common/Loader";
import ClientMIS from "./ClientMIS";

interface SPIPProps {
  activeSubItem: string;
  activeMenu: string;
  handleTradingOpen?: (value: any) => void;
  selectedViewMore: string;
}

const SPIP = ({
  activeSubItem,
  activeMenu,
  // handleTradingOpen,
  selectedViewMore,
}: SPIPProps) => {
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
      // <SPIPOverview
      //   activeSubItem={activeSubItem}
      //   handleTradingOpen={handleTradingOpen}
      // />
      <SPIPClientWiseReport activeSubItem={activeSubItem} />
    ),
    [SubItemKeys.SPIP_CLIENT_DETAILS]: (
      <ClientDetails
        activeSubItem={activeSubItem}
        selectedViewMore={selectedViewMore}
      />
    ),
    [SubItemKeys.SPIP_PERFORMANCE_REPORT]: <PeroformanceReport />,
    [SubItemKeys.SPIP_CLIENT_MIS]: <ClientMIS activeSubItem={activeSubItem} />,
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
