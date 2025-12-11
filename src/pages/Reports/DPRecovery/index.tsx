import { useEffect, useState } from "react";
import { apiServices } from "../../../services";
import { Card, CardBody, Container } from "reactstrap";
// import DataTable from "../../../components/common/table";
// import { GridColDef } from "@mui/x-data-grid";
// import { Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
import ShowToast from "../../../utils/toastUtils";
import UserInfoTable from "../../../components/common/UserInfoTable";
import UserCapsules from "../../ClientDetails/UserCapsules";
import "../style.css";

const DPRecovery = ({ activeSubItem }: any) => {
  const [userData, setUserData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [emailSentStatus, setEmailSentStatus] = useState<
    Record<string, boolean>
  >({});
  const [totalCount, setTotalCount] = useState(0);
  const [activeClients, setActiveClients] = useState(0);
  const [inactiveClients, setinActiveClients] = useState(0);
  const [activeGroupedClients, setActiveGroupedClients] = useState<any[][]>([]);
  const [filteredActiveGroupClients, setFilteredActiveGroupClients] = useState<
    any[][]
  >([]);
  const [inactiveGroupedClients, setInactiveGroupedClients] = useState<any[][]>(
    []
  );
  const [filteredInActiveGroupClients, setFilteredInActiveGroupClients] =
    useState<any[][]>([]);
  const [ledgerSum, setLedgerSum] = useState({
    total: 0,
    active: 0,
    inactive: 0,
  });

  const [selectedCapsule, setSelectedCapsule] = useState("Active Clients");
  // const [searchValue, setSearchValue] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );
  useEffect(() => {
    setSearchQuery("");
  }, [selectedCapsule]);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      const payload = {
        user_id: user_id,
        clientCode: "",
      };

      try {
        dispatch(showLoader("Please wait, we are processing your request..."));
        const response = await apiServices.DPDebitRecovery(payload);
        dispatch(hideLoader());

        // Log the response structure
        console.log("API Response:", response?.data?.data);

        // Extract data safely
        const responseData = response?.data?.data ?? [];

        if (!Array.isArray(responseData)) {
          console.error("Error: Expected an array but got:", responseData);
          return; // Stop execution if responseData is not an array
        }

        // ✅ Insert Id = index + 1
        const updatedData = responseData.map((item: any, index: number) => ({
          ...item,
          Id: index + 1,
        }));

        console.log("Updated Data with Id:", updatedData);

        // Save updated data in state
        // setUserData(updatedData);
        console.log("TestLog", setUserData);
        // setFilteredData(updatedData);
        const activeClients = responseData.filter(
          (client: any) => client.bost === "Active"
        ).length;
        const inactiveClients = responseData.filter(
          (client: any) => client.bost === "Inactive"
        ).length;
        setActiveClients(activeClients);
        setinActiveClients(inactiveClients);
        setTotalCount(response?.data?.data.length);

        console.log("Active Clients:", activeClients);
        console.log("Inactive Clients:", inactiveClients);

        const activeGroupedClients: any[] = [];
        const inactiveGroupedClients: any[] = [];

        console.log("responseData:", responseData, Array.isArray(responseData));

        // Calculate total Ledger Debit Amount for Active, Inactive, and Total
        const totalLedgerDebitAmt = responseData.reduce(
          (sum, client) => sum + (client.lda || 0),
          0
        );
        const totalLedgerDebitAmtActive = responseData
          .filter((client) => client.bost === "Active")
          .reduce((sum, client) => sum + (client.lda || 0), 0);
        const totalLedgerDebitAmtInactive = responseData
          .filter((client) => client.bost === "Inactive")
          .reduce((sum, client) => sum + (client.lda || 0), 0);

        console.log("Total Ledger Debit Amount (All):", totalLedgerDebitAmt);
        console.log(
          "Total Ledger Debit Amount (Active):",
          totalLedgerDebitAmtActive
        );
        console.log(
          "Total Ledger Debit Amount (Inactive):",
          totalLedgerDebitAmtInactive
        );

        setLedgerSum({
          total: totalLedgerDebitAmt, // Total sum of all clients
          active: totalLedgerDebitAmtActive, // Active clients' sum
          inactive: totalLedgerDebitAmtInactive, // Inactive clients' sum
        });

        responseData.forEach((client: any) => {
          if (client.bost === "Active") {
            activeGroupedClients.push(client);
          } else if (client.bost === "Inactive") {
            inactiveGroupedClients.push(client);
          }
        });

        console.log("Active Clients Grouped:", activeGroupedClients);
        console.log("Inactive Clients Grouped:", inactiveGroupedClients);

        setActiveGroupedClients(activeGroupedClients);
        setInactiveGroupedClients(inactiveGroupedClients);
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
      dispatch(showLoader("Please wait, we are processing your request..."));
      const response = await apiServices.DPEmail(payload);
      dispatch(hideLoader());

      if (response?.data) {
        setEmailSentStatus((prevStatus) => ({
          ...prevStatus,
          [BOID]: true, // Update the emailSentStatus for this BkOID
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

    const filteredAllClients = userData.filter(
      (item: any) =>
        item.bonm.toLowerCase().includes(value.toLowerCase()) ||
        item.cc.toLowerCase().includes(value.toLowerCase())
    );

    if (value.trim() === "") {
      setFilteredActiveGroupClients(activeGroupedClients);
      setFilteredInActiveGroupClients(inactiveGroupedClients);
    } else {
      const filteredActiveClients = activeGroupedClients
        .flat()
        .filter(
          (item: any) =>
            (item.bost === "Active" &&
              item.bonm.toLowerCase().includes(value.toLowerCase())) ||
            item.cc.toLowerCase().includes(value.toLowerCase())
        );

      const filteredInactiveClients = inactiveGroupedClients
        .flat()
        .filter(
          (item: any) =>
            (item.bost === "Inactive" &&
              item.bonm.toLowerCase().includes(value.toLowerCase())) ||
            item.cc.toLowerCase().includes(value.toLowerCase())
        );

      setFilteredActiveGroupClients(filteredActiveClients);
      setFilteredInActiveGroupClients(filteredInactiveClients);

      console.log("Filtered Active Clients:", filteredActiveClients);
      console.log("Filtered Inactive Clients:", filteredInactiveClients);
    }

    const combinedFilteredData = [...filteredAllClients];

    setFilteredData(combinedFilteredData); //Total filtered Records //filteredActive group client
    // setFilteredInActiveGroupClients(filteredInActiveClients); //filtered Inactive grouped Client
    console.log("filteredSearch Records", filteredData);
  };

  const handleClick = (value: string) => {
    console.log("You clicked the Chip.", value);
    setSelectedCapsule(value);
  };

  return (
    <>
      <div className="page-content page-view">
        <Container fluid>
          <UserCapsules
            selectedCapsule={selectedCapsule}
            handleClick={handleClick}
            // totalCount={totalCount}
            // activeClient={activeClients}
            // inactiveClient={inactiveClients}
            capsuleType="DPDebit"
          />
          <Card
            style={{
              borderRadius: "15px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
            }}
          >
            {/* <CardHeader>
              <h4 className="card-title mb-0"> DP Debit Outstanding</h4>
            </CardHeader> */}
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
                activeSubItem={activeSubItem}
                activeGroupedClients={
                  searchQuery
                    ? filteredActiveGroupClients
                    : activeGroupedClients
                } // Show filtered when searching
                inactiveGroupedClients={
                  searchQuery
                    ? filteredInActiveGroupClients
                    : inactiveGroupedClients
                } // Show filtered when searching
                selectedWidget={selectedCapsule}
                activeClient={activeClients}
                inactiveClient={inactiveClients}
                totalCount={totalCount}
                totalLedgerDebitAmt={ledgerSum}
              />
            </CardBody>
          </Card>
        </Container>
      </div>
    </>
  );
};

export default DPRecovery;
