import { useState, useEffect } from "react";
import UserCapsules from "./UserCapsules";
import UserInfoTable from "../../components/common/UserInfoTable";
import { showLoader, hideLoader } from "../../redux/slices/loaderSlice";
import { apiServices } from "../../services";
import { useDispatch } from "react-redux";
import "./style.css";
import UserInfoDetail from "./IndUserInfoDetails";

const ClientDetails = () => {
  const [selectedCapsule, setSelectedCapsule] = useState("");
  const [tableData, setTableData] = useState<[]>([]);
  const [userDetails, setUserDetails] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchClientCash = async () => {
      if (selectedCapsule === "Total Clients") {
        const Id = localStorage.getItem("Id");
        const payload = {
          user_id: Id,
        };
        try {
          dispatch(showLoader(""));
          const response = await apiServices.T6Selling(payload);
          console.log("ClientCashresponse", response?.data?.data?.Table);
          if (response?.status === 200) {
            dispatch(hideLoader());
            setTableData(response?.data?.data?.Table);
            // let { recordsTotal } = response?.data[0]; // Extract the necessary data
            // console.log("Records Total:", recordsTotal);
          }
        } catch (error) {
          // console.error("Error->", error);
          dispatch(hideLoader());
          // console.error("Error fetching T6 data:", error?.response || error?.message || error);
        }
      }
    };

    fetchClientCash(); // Call the async function
  }, [selectedCapsule, dispatch]);

  const getUserDetails = (value: any) => {
    // console.log("useDetails value", typeof value);
    if (Object.keys(value).length > 0) {
      console.log("The object is not empty.");
      setUserDetails(true);
    } else {
      setUserDetails(false);
    }
  };

  const handleClick = (value: string) => {
    console.log("You clicked the Chip.", value);
    setSelectedCapsule(value);
  };

  return (
    <>
      {!userDetails ? (
        <>
          <UserCapsules
            selectedCapsule={selectedCapsule}
            handleClick={handleClick}
          />
          <UserInfoTable
            selectedWidget={selectedCapsule}
            T6Data={tableData}
            getUserDetails={getUserDetails}
          />
        </>
      ) : (
        <UserInfoDetail />
      )}
    </>
  );
};
export default ClientDetails;
