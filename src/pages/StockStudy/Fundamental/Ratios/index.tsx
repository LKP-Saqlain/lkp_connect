import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "../../../../redux/slices/loaderSlice";
import { apiServices } from "../../../../services";
import DynamicTable from "../../../../components/common/stockStudyTable"; // Adjust path if needed

const Ratios = ({ activeMenu }: any) => {
  const [ratiosData, setRatiosData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false); // To handle loading state

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchFundamentalRatios = async () => {
      setLoading(true); // Start loading
      dispatch(showLoader("Please wait, we are processing your request"));

      try {
        const response = await apiServices.getFundamentalRatios({});
        console.log("Fetched ratios data:", response?.data?.annualDataDump);
        setRatiosData(response?.data?.annualDataDump); // Save data in state
      } catch (error) {
        console.error("Error fetching ratios data:", error);
      } finally {
        dispatch(hideLoader());
        setLoading(false); // End loading
      }
    };

    fetchFundamentalRatios();
  }, [activeMenu, dispatch]);

  // Handle loading state and conditional rendering
  if (loading) {
    return <div>Loading...</div>; // Replace with spinner or custom loader if needed
  }

  return (
    <>
      {ratiosData ? (
        <DynamicTable
          annualDataDump={ratiosData}
          customHeaderType="ratioHeader"
        />
      ) : (
        <div>No data available</div> // Optional: display a message when no data is fetched
      )}
    </>
  );
};

export default Ratios;
