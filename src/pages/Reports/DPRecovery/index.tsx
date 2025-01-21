import { useEffect, useState } from "react";
import { apiServices } from "../../../services";
import { Card, CardBody, CardHeader } from "reactstrap";
// import DataTable from "../../../components/common/table";
// import { GridColDef } from "@mui/x-data-grid";
// import { Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
import ShowToast from "../../../utils/toastUtils";
import UserInfoTable from "../../../components/common/UserInfoTable";
import "../style.css";

const DPRecovery = () => {
  const [userData, setUserData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [emailSentStatus, setEmailSentStatus] = useState<
    Record<string, boolean>
  >({});
  // const [searchValue, setSearchValue] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      const payload = {
        user_id: user_id,
        clientCode: "",
      };

      try {
        dispatch(showLoader("Please wait"));
        const response = await apiServices.DPDebitRecovery(payload);
        dispatch(hideLoader());
        setUserData(response?.data?.data || []);
        setFilteredData(response?.data?.data || []);
      } catch (error) {
        dispatch(hideLoader());
        console.error("Error fetching DP debit recovery data:", error);
      }
    };

    fetchUserData();
  }, [dispatch]);

  // // Helper function to mask mobile numbers
  // const maskMobileNumber = (mobile: string) => {
  //   if (!mobile) return "";
  //   return mobile.replace(/^(\d{2})(\d+)/, (_match, prefix, rest) => {
  //     console.log(prefix);
  //     return `${"X".repeat(rest.length)}`;
  //   });
  // };

  // Handle email sending
  const handleEmailSend = async (BOID: string) => {
    const payload = {
      user_id: user_id,
      clientCode: BOID,
    };

    try {
      dispatch(showLoader("Please wait"));
      const response = await apiServices.DPEmail(payload);
      dispatch(hideLoader());

      if (response?.data) {
        setEmailSentStatus((prevStatus) => ({
          ...prevStatus,
          [BOID]: true, // Update the emailSentStatus for this BOID
        }));
        ShowToast("success", response?.data?.Message);
      } else {
        console.error("Failed to send email");
      }
    } catch (error) {
      dispatch(hideLoader());
      console.error("Error sending email:", error);
    }
  };

  const getUserDetails = (value: any) => {
    console.log("userBOID", value?.BOID);
    handleEmailSend(value?.BOID);
  };

  const handleSearchBasedOnInput = (value: string) => {
    console.log("handleSearchBasedOnInputValue", value.toUpperCase());
    // setSearchValue(value);

    const query = value;
    setSearchQuery(query);

    const filtered = userData.filter(
      (item: any) => item.BOName.toLowerCase().includes(query) // Check if the client name includes the query
    );

    setFilteredData(filtered);
    console.log("filteredSearch Records", filteredData);
  };

  return (
    <Card>
      <CardHeader style={{ fontFamily: "Poppins" }}>
        DP Debit Outstanding
      </CardHeader>
      <CardBody>
        {/* <DataTable
          customFlag={true}
          dynamicHeader={dormantColumns}
          tableData={userData}
        /> */}
        <UserInfoTable
          showSearch={true}
          handleSearchBasedOnInput={handleSearchBasedOnInput}
          searchValue={searchQuery}
          T6Data={userData ? filteredData : filteredData}
          getUserDetails={getUserDetails}
          emailSentStatus={emailSentStatus}
        />
      </CardBody>
    </Card>
  );
};

export default DPRecovery;
