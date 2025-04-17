import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../redux/store";
import { hideLoader, showLoader } from "../../../../redux/slices/loaderSlice";
import { apiServices } from "../../../../services";
import CorporateTable from "../../../../components/common/CorporateTable";

interface SelectedIsinProps {
  selectedIsin: string;
}
const Spilt = ({ selectedIsin }: SelectedIsinProps) => {
  const [data, setData] = useState<[]>([]);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const getFundamentalSplit = async () => {
      dispatch(showLoader("Please wait we are processing your request"));
      try {
        const response = await apiServices.getFundamentalSplit(selectedIsin);
        dispatch(hideLoader());
        console.log("getFundamentalDividendResponse", response?.data);
        setData(response?.data);
      } catch (error) {
        dispatch(hideLoader());
        console.log("error", error);
      }
    };
    getFundamentalSplit(); // This triggers the data fetch when the component mounts
  }, [selectedIsin]);

  return (
    <>
      <div className="page-content" style={{ paddingTop: "1rem" }}>
        {/* Pass data to DynamicTable as fundamentalShareHolding */}
        <CorporateTable CorporateData={data} name={"Split"} />
      </div>
    </>
  );
};

export default Spilt;
