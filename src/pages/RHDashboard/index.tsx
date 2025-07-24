import React, { useEffect, Suspense } from "react";
import Overview from "./Overview";
import { SubItemKeys } from "../../constants/subItemKeys";
import Loader from "../../components/common/Loader";

interface RH {
  activeSubItem: string;
  activeMenu: string;
}

const Index = ({ activeMenu, activeSubItem }: RH) => {
  useEffect(() => {
    console.log("Props-->", activeMenu, activeSubItem);
  }, [activeMenu, activeSubItem]);

  const componentMap: Record<string, React.ReactNode> = {
    [SubItemKeys.RH_OVERVIEW]: <Overview activeSubItem={activeSubItem} />,
  };

  return (
    <div>
      <Suspense fallback={<Loader />}>{componentMap[activeSubItem]}</Suspense>
    </div>
  );
};

export default Index;
