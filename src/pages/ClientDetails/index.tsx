import { useState, useEffect } from "react";
import UserCapsules from "./UserCapsules";
import UserInfoTable from "../../components/common/UserInfoTable";
import { showLoader, hideLoader } from "../../redux/slices/loaderSlice";
import { apiServices } from "../../services";
import { useDispatch } from "react-redux";
import "./style.css";
// import UserInfoDetail from "./IndUserInfoDetails";
import UserInfo from "./IndUserDetailsModal";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ClientDetails = ({
  handleDrawerClose,
  handleDrawerOpen,
  apiStatus,
}: any) => {
  const [selectedCapsule, setSelectedCapsule] = useState("Total Clients");
  const [tableData, setTableData] = useState<[]>([]);
  const [userDetails, setUserDetails] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [activeClients, setActiveClients] = useState(0);
  const [inactiveClients, setinActiveClients] = useState(0);
  // const [groupedClients, setGroupedClients] = useState<any[][]>([]);
  const [activeGroupedClients, setActiveGroupedClients] = useState<any[][]>([]);
  const [inactiveGroupedClients, setInactiveGroupedClients] = useState<any[][]>(
    []
  );
  const [responseStatus, setResponseStatus] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchClientCash = async () => {
      if (apiStatus) {
        const Id = localStorage.getItem("Id");
        const payload = {
          loginName: Id,
          branchCode: "ALL",
          zone: "H.O.",
          clientStatus: "ALL",
          start: 0,
          pageSize: 0,
          searchkey: "",
        };
        try {
          dispatch(showLoader(""));
          const response = await apiServices.ClientDetails(payload);
          console.log(
            "ClientClientDetailsResponse",
            response?.data[0].RecordsTotal
          );

          if (response?.status === 200) {
            dispatch(hideLoader());
            setResponseStatus(true);
            setTableData(response?.data);

            const totalCount = response?.data[0].RecordsTotal;
            setTotalCount(totalCount);

            const activeClients = response?.data.filter(
              (client: any) => client.ClientStatus === "Active"
            ).length;
            const inactiveClients = response?.data.filter(
              (client: any) => client.ClientStatus === "InActive"
            ).length;
            setActiveClients(activeClients);
            setinActiveClients(inactiveClients);
            console.log("Active Clients:", activeClients);
            console.log("Inactive Clients:", inactiveClients);

            const activeGroupedClients: any[] = [];
            const inactiveGroupedClients: any[] = [];

            // Loop through the data and categorize clients as active or inactive
            response?.data.forEach((client: any) => {
              if (client.ClientStatus === "Active") {
                activeGroupedClients.push(client);
              } else if (client.ClientStatus === "InActive") {
                inactiveGroupedClients.push(client);
              }
            });

            console.log("Active Clients:", activeGroupedClients);
            console.log("Inactive Clients:", inactiveGroupedClients);

            // Optionally, set the grouped data to state
            // setGroupedClients(groupedClients);
            setActiveGroupedClients(activeGroupedClients);
            setInactiveGroupedClients(inactiveGroupedClients);
          }
        } catch (error) {
          dispatch(hideLoader());
          // console.error(
          //   "Error fetching data:",
          //   error?.response || error?.message || error
          // );
        }
      }
    };

    fetchClientCash(); // Call the async function
  }, [apiStatus, dispatch]);

  const handleExcel = async () => {
    const Id = localStorage.getItem("Id");
    const payload = {
      loginName: Id,
      branchCode: "ALL",
      zone: "H.O.",
      clientStatus: "ALL",
      start: 0,
      pageSize: 0,
      searchkey: "",
    };
    try {
      dispatch(showLoader(""));
      const response = await apiServices.ClientDetails(payload);
      console.log("ClientClientDetailsResponse", response?.data);

      if (response?.status === 200) {
        dispatch(hideLoader());
        setTableData(response?.data);

        const totalCount = response?.data[0].RecordsTotal;
        setTotalCount(totalCount);
        const activeGroupedClients: any[] = [];
        const inactiveGroupedClients: any[] = [];

        // Loop through the data and categorize clients as active or inactive
        response?.data.forEach((client: any) => {
          if (client.ClientStatus === "Active") {
            activeGroupedClients.push(client); // Add to active clients
          } else if (client.ClientStatus === "InActive") {
            inactiveGroupedClients.push(client); // Add to inactive clients
          }
        });

        console.log("", activeGroupedClients);
        console.log("Inactive Clients:", inactiveGroupedClients);

        const data: any[] =
          selectedCapsule === "Total Clients"
            ? response?.data
            : selectedCapsule === "Active Clients"
            ? activeGroupedClients
            : selectedCapsule === "Inactive Clients"
            ? inactiveClients
            : [];

        // Convert data to a worksheet
        const worksheet = XLSX.utils.json_to_sheet(data);
        // Create a workbook and append the worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "T6 Selling Data");
        // Convert the workbook to a binary file
        const excelBuffer = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array",
        });
        const excelFile = new Blob([excelBuffer], {
          type: "application/octet-stream",
        });
        saveAs(excelFile, "ClientDetails.xlsx");

        // Optionally, set the grouped data to state
        // setGroupedClients(groupedClients);
      }
    } catch (error) {
      dispatch(hideLoader());
    }
  };

  const getUserDetails = (value: any) => {
    // console.log("useDetails value", typeof value);
    if (Object.keys(value).length > 0) {
      console.log("The object is not empty.");
      setUserDetails(true);
      handleDrawerClose();
      setIsModalOpen(!isModalOpen);
    } else {
      setUserDetails(false);
    }
  };
  const handleModalClose = (value: any) => {
    console.log("value", value);
    if (value) {
      setUserDetails(false);
      setIsModalOpen(!isModalOpen);
      handleDrawerOpen();
    }
  };

  const handleClick = (value: string) => {
    console.log("You clicked the Chip.", value);
    setSelectedCapsule(value);
  };

  const handleSearchBasedOnInput = (value: string) => {
    console.log("handleSearchBasedOnInputValue", value);
    setSearchValue(value);
  };

  const handleSearchUser = async () => {
    setTableData([]);
    if (apiStatus) {
      const Id = localStorage.getItem("Id");
      const payload = {
        loginName: Id,
        branchCode: "ALL",
        zone: "H.O.",
        clientStatus: "ALL",
        start: 0,
        pageSize: 0,
        searchkey: searchValue !== "" ? searchValue : "",
      };
      try {
        dispatch(showLoader(""));
        const response = await apiServices.ClientDetails(payload);
        console.log(
          "ClientClientDetailsResponse",
          response?.data[0].RecordsTotal
        );

        if (response?.status === 200) {
          dispatch(hideLoader());
          setResponseStatus(true);
          setTableData(response?.data);

          const totalCount = response?.data[0].RecordsTotal;
          setTotalCount(totalCount);

          const activeClients = response?.data.filter(
            (client: any) => client.ClientStatus === "Active"
          ).length;
          const inactiveClients = response?.data.filter(
            (client: any) => client.ClientStatus === "InActive"
          ).length;
          setActiveClients(activeClients);
          setinActiveClients(inactiveClients);
          console.log("Active Clients:", activeClients);
          console.log("Inactive Clients:", inactiveClients);

          const activeGroupedClients: any[] = [];
          const inactiveGroupedClients: any[] = [];

          // Loop through the data and categorize clients as active or inactive
          response?.data.forEach((client: any) => {
            if (client.ClientStatus === "Active") {
              activeGroupedClients.push(client);
            } else if (client.ClientStatus === "InActive") {
              inactiveGroupedClients.push(client);
            }
          });

          console.log("Active Clients:", activeGroupedClients);
          console.log("Inactive Clients:", inactiveGroupedClients);

          // Optionally, set the grouped data to state
          // setGroupedClients(groupedClients);
          setActiveGroupedClients(activeGroupedClients);
          setInactiveGroupedClients(inactiveGroupedClients);
        }
      } catch (error) {
        dispatch(hideLoader());
        // console.error(
        //   "Error fetching data:",
        //   error?.response || error?.message || error
        // );
      }
    }
  };

  return (
    <>
      {!userDetails ? (
        <>
          <UserCapsules
            selectedCapsule={selectedCapsule}
            handleClick={handleClick}
            totalCount={totalCount}
            activeClient={activeClients}
            inactiveClient={inactiveClients}
          />
          <UserInfoTable
            selectedWidget={selectedCapsule}
            T6Data={tableData}
            activeGroupedClients={activeGroupedClients}
            inactiveGroupedClients={inactiveGroupedClients}
            getUserDetails={getUserDetails}
            apiStatus={apiStatus}
            handleExcel={handleExcel}
            showSearch={responseStatus}
            handleSearchBasedOnInput={handleSearchBasedOnInput}
            handleSearchUser={handleSearchUser}
          />
        </>
      ) : (
        // <UserInfoDetail />
        <UserInfo
          isOpen={isModalOpen}
          onClose={getUserDetails}
          handleModalClose={handleModalClose}
        />
      )}
    </>
  );
};
export default ClientDetails;
