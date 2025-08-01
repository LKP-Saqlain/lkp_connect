import React, { useEffect, Suspense } from "react";
import { SubItemKeys } from "../../constants/subItemKeys";
import Loader from "../../components/common/Loader";
import Overview from "./Overview";
import Direct from "./Direct";
import Indirect from "./Indirect";
import VendorMaster from "./VendorMaster";

interface RH {
  activeSubItem: string;
  activeMenu: string;
}

const Index = ({ activeMenu, activeSubItem }: RH) => {
  useEffect(() => {
    console.log("Props-->", activeMenu, activeSubItem);
  }, [activeMenu, activeSubItem]);

  const componentMap: Record<string, React.ReactNode> = {
    [SubItemKeys.RH_DIRECT]: <Direct activeSubItem={activeSubItem} />,
    [SubItemKeys.RH_INDIRECT]: <Indirect activeSubItem={activeSubItem} />,
    [SubItemKeys.VENDOR_MASTER]: <VendorMaster activeSubItem={activeSubItem} />,
  };

  const getComponent = () => {
    if (activeMenu === "Zone Overview") {
      if (activeSubItem === SubItemKeys.RH_DIRECT) {
        return <Direct activeSubItem={activeSubItem} />;
      } else if (activeSubItem === SubItemKeys.RH_INDIRECT) {
        return <Indirect activeSubItem={activeSubItem} />;
      } else if (activeSubItem === "Employee Performance") {
        return <VendorMaster activeSubItem={activeSubItem} />;
      } else {
        return <Overview activeSubItem={activeSubItem} />;
      }
    }
    return componentMap[activeSubItem] || null;
  };

  return <Suspense fallback={<Loader />}>{getComponent()}</Suspense>;
};

export default Index;
