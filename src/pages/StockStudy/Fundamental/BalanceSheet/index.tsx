import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "../../../../redux/slices/loaderSlice";
import { apiServices } from "../../../../services";
import DynamicTable from "../../../../components/common/stockStudyTable";

const BalanceSheet = ({ activeMenu, activeSubmenu }: any) => {
  const [annualBalanceSheetData, setAnnualBalanceSheetData] =
    useState<any>(null);

  const dispatch = useDispatch();

  useEffect(() => {
    console.log("testasdasd", activeMenu, activeSubmenu);
  }, [activeMenu, activeSubmenu]);

  useEffect(() => {
    if (activeMenu === "Fundamental") {
      const fetchFundamentalRecords = async () => {
        dispatch(showLoader("Please wait we are processing your request"));
        apiServices
          .getFundamentalBalanceSheet({})
          .then((response) => {
            dispatch(hideLoader());
            console.log("getFundamentalBalanceSheetResponse", response?.data);
            setAnnualBalanceSheetData(response?.data);
          })
          .catch((error) => {
            dispatch(hideLoader());
            console.log("error", error);
          });
      };
      fetchFundamentalRecords();
    }
  }, [activeMenu]);

  return (
    <>
      {annualBalanceSheetData && (
        <DynamicTable annualDataDump={annualBalanceSheetData} />
      )}
    </>
  );
};

export default BalanceSheet;
