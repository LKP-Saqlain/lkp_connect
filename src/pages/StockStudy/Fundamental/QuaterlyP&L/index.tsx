import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "../../../../redux/slices/loaderSlice";
import { apiServices } from "../../../../services";
import DynamicTable from "../../../../components/common/stockStudyTable";

const Quarterly = ({ activeMenu, selectedIsin }: any) => {
  const [quarterly, setQuarterly] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false); // To handle loading state

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchFundamentalRecords = async () => {
      setLoading(true);
      dispatch(showLoader("Please wait, we are processing your request"));
      try {
        const response = await apiServices.getFundamentalQuaterlyPNL(
          selectedIsin
        );
        setQuarterly(response?.data.quarterlyDataDump);
        console.log(quarterly, "merum", response?.data.quarterlyDataDump);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        dispatch(hideLoader());
        setLoading(false);
      }
    };
    fetchFundamentalRecords();
  }, [activeMenu, dispatch]);

  // Handle loading state and conditional rendering
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {quarterly ? (
        <DynamicTable
          annualDataDump={quarterly}
          customHeaderType="quarterlyPNL"
        />
      ) : (
        <div>No data available</div>
      )}
    </>
  );
};

export default Quarterly;
