import React from "react";

const Dividends = () => {
  return (
    <div>
      Dividends
      {/* const [records, setRecords] = useState<any[]>([]);
  const fetchFundamentalData = async (
    apiMethod: any,
    setRecords: any,
    dispatch: any
  ) => {
    dispatch(showLoader("Please wait, we are processing your request"));

    try {
      const response = await apiMethod();
      if (response?.status === 200) {
        setRecords(response?.data || []);
        console.log("Data fetched successfully", response?.data);
      } else {
        console.error("Failed to fetch data", response);
      }
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      dispatch(hideLoader());
    }
  }; */}
      {/* useEffect(() => {
    if (activeSubmenu === "Dividend") {
      fetchFundamentalData(
        apiServices.getFundamentalDividend,
        setRecords,
        dispatch
      );
    } else if (activeSubmenu === "Bonus") {
      fetchFundamentalData(
        apiServices.getFundamentalBonus,
        setRecords,
        dispatch
      );
    } else if (activeSubmenu === "Split") {
      fetchFundamentalData(
        apiServices.getFundamentalSplit,
        setRecords,
        dispatch
      );
    } else if (activeSubmenu === "Board Meeting") {
      fetchFundamentalData(
        apiServices.getFundamentalBoardMeeting,
        setRecords,
        dispatch
      );
    } else {
      setRecords([]);
      console.log("No data for this submenu");
    }
  }, [activeSubmenu, dispatch]);

  useEffect(() => {
    console.log(activeSubmenu, "records", records);
  }, [records]); */}
    </div>
  );
};

export default Dividends;
