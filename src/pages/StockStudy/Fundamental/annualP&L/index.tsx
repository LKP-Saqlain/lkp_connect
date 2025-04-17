import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "../../../../redux/slices/loaderSlice";
import { apiServices } from "../../../../services";
import DynamicTable from "../../../../components/common/stockStudyTable";

const AnnualPNL = ({ activeMenu, activeSubmenu, selectedIsin }: any) => {
  const [annually, setAnnually] = useState<any>();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("parentChildClass", activeMenu, activeSubmenu);
  }, [activeMenu, activeSubmenu]);

  useEffect(() => {
    if (activeSubmenu === "Annual P&L") {
      const fetchFundamentalRecords = async () => {
        dispatch(showLoader("Please wait we are processing your request"));
        apiServices
          .getFundamentalAnnualPNL(selectedIsin)
          .then((response) => {
            dispatch(hideLoader());
            console.log("ResponseGetFundamentalAnnualPNL", response);
            setAnnually(response?.data?.annualDataDump);
            console.log(response?.data?.annualDataDump, "setAnnually");
          })
          .catch((error) => {
            dispatch(hideLoader());
            console.log("error", error);
          });
      };
      fetchFundamentalRecords();
    }
  }, [activeSubmenu, dispatch, selectedIsin]);

  return (
    <>
      {annually ? (
        <DynamicTable
          annualDataDump={annually}
          customHeaderType="annuallyPNL"
        />
      ) : (
        <div>No data available</div>
      )}
    </>
  );
};

export default AnnualPNL;
