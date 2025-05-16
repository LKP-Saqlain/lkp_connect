import CardTable from "./CardTable";
import { combinedDataBySource } from "../../helper/commmon";
import { useEffect } from "react";

const BrokerageModificationStatus = ({ activeSubItem }: any) => {
  useEffect(() => {
    combinedDataBySource.map((item) => {
      console.log("MaintestData", item);
    });
  }, []);

  return (
    <>
      {/* <h1>hello</h1> */}
      {combinedDataBySource.map((item, idx) => (
        <CardTable
          key={idx}
          tableData={item.data}
          customTableFlag={item?.customFlag}
          activeSubItem={activeSubItem}
        />
      ))}
    </>
  );
};

export default BrokerageModificationStatus;
