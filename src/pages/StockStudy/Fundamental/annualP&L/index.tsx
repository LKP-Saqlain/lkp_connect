import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "../../../../redux/slices/loaderSlice";
import { apiServices } from "../../../../services";

const AnnualPNL = ({ activeMenu, activeSubmenu }: any) => {
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("parentChildClass", activeMenu, activeSubmenu);
  }, [activeMenu, activeSubmenu]);

  useEffect(() => {
    if (activeSubmenu === "Annual P&L") {
      const fetchFundamentalRecords = async () => {
        dispatch(showLoader("Please wait we are processing your request"));
        apiServices
          .getFundamentalAnnualPNL({})
          .then((response) => {
            dispatch(hideLoader());
            console.log("ResponseGetFundamentalAnnualPNL", response);
            // setAnnualBalanceSheetData(response?.data?.annualDataDump);
          })
          .catch((error) => {
            dispatch(hideLoader());
            console.log("error", error);
          });
      };
      fetchFundamentalRecords();
    }
  }, [activeSubmenu, dispatch]);

  return <div>AnnualPNL Componentssss</div>;
};

export default AnnualPNL;
