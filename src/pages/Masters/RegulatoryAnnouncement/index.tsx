import { useEffect } from "react";

const RegAnnMaster = ({ activeSubItem }: any) => {
  useEffect(() => {
    console.log("test12334", activeSubItem);
  }, [activeSubItem]);
  return <div>Regulatory Announcement Master</div>;
};

export default RegAnnMaster;
