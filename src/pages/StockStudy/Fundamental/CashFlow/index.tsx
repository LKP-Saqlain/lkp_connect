import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "../../../../redux/slices/loaderSlice";
import { apiServices } from "../../../../services";
import DynamicTable from "../../../../components/common/stockStudyTable";

const CashFlow = ({ activeMenu, selectedIsin }: any) => {
  const [cashFlow, setCashFlow] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false); // To handle loading state

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchFundamentalRecords = async () => {
      setLoading(true); // Start loading
      dispatch(showLoader("Please wait, we are processing your request"));

      try {
        const response = await apiServices.getFundamentalcashflow(selectedIsin);
        setCashFlow(response?.data?.annualDataDump);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        dispatch(hideLoader());
        setLoading(false); // End loading
      }
    };

    fetchFundamentalRecords();
  }, [activeMenu, dispatch, selectedIsin]);

  // Handle loading state and conditional rendering
  if (loading) {
    return <div>Loading...</div>; // You can replace with a spinner or custom loader component
  }

  return (
    <>
      {cashFlow ? (
        <DynamicTable annualDataDump={cashFlow} customHeaderType="cashFlow" />
      ) : (
        <div>No data available</div> // Optional: display a message when no data is fetched
      )}
    </>
  );
};

export default CashFlow;
