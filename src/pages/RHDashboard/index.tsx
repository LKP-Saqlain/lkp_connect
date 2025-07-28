import React, { useEffect, Suspense } from "react";
import { SubItemKeys } from "../../constants/subItemKeys";
import Loader from "../../components/common/Loader";
import Overview from "./Overview";
// import Direct from "./Direct";

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
    // [SubItemKeys.RH_DIRECT]: <Direct activeSubItem={activeSubItem} />,
  };

  return (
    <div>
      <Suspense fallback={<Loader />}>{componentMap[activeMenu]}</Suspense>
    </div>
  );
};

export default Index;
