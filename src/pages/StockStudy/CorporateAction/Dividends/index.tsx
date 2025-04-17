import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../redux/store";
import { hideLoader, showLoader } from "../../../../redux/slices/loaderSlice";
import { apiServices } from "../../../../services";
import CorporateTable from "../../../../components/common/CorporateTable";

interface SelectedIsinProps {
  selectedIsin: string;
}

const Dividends = ({ selectedIsin }: SelectedIsinProps) => {
  const [data, setData] = useState<[]>([]);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const getFundamentalDividend = async () => {
      dispatch(showLoader("Please wait we are processing your request"));
      try {
        const response = await apiServices.getFundamentalDividend(selectedIsin);
        dispatch(hideLoader());
        console.log("getFundamentalDividendResponse", response?.data);
        setData(response?.data);
      } catch (error) {
        dispatch(hideLoader());
        console.log("error", error);
      }
    };
    getFundamentalDividend(); // This triggers the data fetch when the component mounts
  }, [selectedIsin]);

  return (
    <>
      <div className="page-content" style={{ paddingTop: "1rem" }}>
        <CorporateTable CorporateData={data} name={"Dividend"} />
      </div>
    </>
  );
};

export default Dividends;
