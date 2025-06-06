import { useState, useEffect } from "react";
import UserCapsules from "./UserCapsules";
import UserInfoTable from "../../components/common/UserInfoTable";
import { showLoader, hideLoader } from "../../redux/slices/loaderSlice";
import { apiServices } from "../../services";
import { useDispatch, useSelector } from "react-redux";
import "./style.css";
// import UserInfoDetail from "./IndUserInfoDetails";
import UserInfo from "./IndUserDetailsModal";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Card, CardBody, Container } from "reactstrap";
import ShowToast from "../../utils/toastUtils";
import { RootState, AppDispatch } from "../../redux/store";
import dayjs from "dayjs";

const allowedFormats = ["pdf", "png", "jpg", "jpeg"];

interface ClientRow {
  BranchCode?: string;
  BranchType?: string;
  ctermcode?: string;
  ClientCode?: string;
  ClientName?: string;
  PANNO?: string;
  ActivationDate?: string;
  MobileNo?: string;
  EMail?: string;
  ClientStatus?: string;
  LastTradeDate?: string;
  POAStatus?: string;
  MTFStatus?: string;
  RecordsTotal?: number;
  // activeMenu?: any;
}

const ClientDetails = ({
  handleDrawerClose,
  handleDrawerOpen,
  apiStatus,
  selectedTrading,
}: // activeMenu,
any) => {
  const [selectedCapsule, setSelectedCapsule] = useState(
    "Upcoming Dormant Client"
  );
  const [tableData, setTableData] = useState<[]>([]);
  const [userDetails, setUserDetails] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [activeClients, setActiveClients] = useState(0);
  const [inactiveClients, setinActiveClients] = useState(0);
  const [dormantCount, setDormantCount] = useState(0);
  // const [groupedClients, setGroupedClients] = useState<any[][]>([]);
  const [activeGroupedClients, setActiveGroupedClients] = useState<any[][]>([]);
  const [inactiveGroupedClients, setInactiveGroupedClients] = useState<any[][]>(
    []
  );
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [responseStatus, setResponseStatus] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [branchCode, setBranchCode] = useState("");
  const [totalEntries, setTotalEntries] = useState(null);
  const [filter, setFilter] = useState<string>("ALL");
  const [selectedUserInfo, setSelectedUserInfo] = useState<ClientRow | null>(
    null
  );
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileExtension, setFileExtension] = useState("");
  // const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [uploadedFileName, setUploadFileName] = useState("");

  const dispatch = useDispatch<AppDispatch>();

  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );

  useEffect(() => {
    console.log(
      "activeItemCheck->",
      uploadedFile,
      fileExtension,
      fileBase64,
      selectedCapsule
    );
  }, [selectedCapsule, uploadedFile, fileExtension, fileBase64]);

  useEffect(() => {
    console.log("test12345", totalEntries, filter, selectedUserInfo?.ctermcode);
  }, [selectedUserInfo]);
  useEffect(() => {
    if (selectedTrading === "Dormant") {
      setSelectedCapsule("Upcoming Dormant Client");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [selectedTrading]);
  useEffect(() => {
    if (selectedCapsule === "Total Clients") {
      dispatch(showLoader(""));
      const fetchClientCash = async () => {
        if (apiStatus) {
          const Id = localStorage.getItem("Id");
          const payload = {
            loginName: Id,
            branchCode: "ALL",
            zone: "ALL",
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
                (client: any) => client.ClientStatus === "Inactive"
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
                } else if (client.ClientStatus === "Inactive") {
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
      fetchClientCash();
    }
  }, [dispatch]);

  useEffect(() => {
    console.log("selected Capsules", selectedCapsule);
    const getUpcomingDormants = async () => {
      if (selectedCapsule === "Upcoming Dormant Client") {
        setTableData([]);
        // alert(selectedCapsule);
        const payload = {
          start: 0, // Calculate start based on the new page
          pageSize: 5000,
          searchKey: "",
          loginName: user_id,
          zone: "ALL",
          branchCode: "ALL",
          clientStatus: "ALL",
        };
        dispatch(showLoader(""));
        await apiServices
          .getUpcompingDormantReport(payload)
          .then((response) => {
            dispatch(hideLoader());
            console.log("getUpcomingDormantReport_response_1", response?.data);
            console.log(
              "getDormantTotalClient",
              response?.data[0].recordsTotal
            );
            setDormantCount(response?.data[0].recordsTotal);

            if (response?.status === 200) {
              setResponseStatus(true);
              let { recordsTotal } = response?.data[0];
              console.log("getDormantReport_response_1", response?.status);
              setTotalEntries(recordsTotal);
              const seven_day_duration = response?.data.filter(
                (item: any) => item.dayCount <= 7
              );
              const fifteen_day_duration = response?.data.filter(
                (item: any) => item.dayCount <= 15
              );
              const one_months_duration = response?.data.filter(
                (item: any) => item.dayCount <= 30
              );
              console.log("seven_day_duration", seven_day_duration);
              console.log("fifteen_day_duration", fifteen_day_duration);
              console.log("one_months_duration", one_months_duration);
              setTableData(response?.data);
            }
          })
          .catch((error) => {
            console.error("error", error.status);
            if (error.status === 400) {
              ShowToast("error", error?.response?.data?.message);
            } else {
              console.log("Error->", error.response.data.errors.Zone["0"]);
              const zoneError = error.response.data.errors.Zone["0"];
              const branchCodeError =
                error.response.data.errors.BranchCode["0"];
              dispatch(hideLoader());
              ShowToast("error", zoneError);
              ShowToast("error", branchCodeError);
            }
          })
          .finally(() => {
            dispatch(hideLoader());
          });
      }
    };
    getUpcomingDormants();
  }, [selectedCapsule]);

  // useEffect(() => {
  //   if (searchValue.length === 0) {
  //     setTotalCount(0);
  //     setActiveClients(0);
  //     setinActiveClients(0);
  //     // handleSearchUser();
  //   }
  // }, [searchValue]);

  useEffect(() => {
    const fetchClientCash = async () => {
      if (selectedCapsule !== "Upcoming Dormant Client") {
        const Id = localStorage.getItem("Id");
        const payload = {
          loginName: Id,
          branchCode: "ALL",
          zone: "ALL",
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
              (client: any) => client.ClientStatus === "Inactive"
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
              } else if (client.ClientStatus === "Inactive") {
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
  }, [apiStatus, dispatch, selectedCapsule]);

  const handleExcel = async () => {
    const Id = localStorage.getItem("Id");
    const payload = {
      loginName: Id,
      branchCode: "ALL",
      zone: "ALL",
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
          } else if (client.ClientStatus === "Inactive") {
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
        XLSX.utils.book_append_sheet(
          workbook,
          worksheet,
          "Clients Ageing Report Data"
        );
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

  const getUserBrokergageModificationDetails = (value: any) => {
    setBranchCode(value.BranchCode);
    console.log("useDetails_value branchbranch", value, branchCode);
    if (Object.keys(value).length > 0) {
      console.log("The object is not empty.");
      setSelectedUserInfo(value);
      setUserDetails(true);
      handleDrawerClose();
      setIsModalOpen(!isModalOpen);
    } else {
      setUserDetails(false);
      setSelectedUserInfo(null);
    }
  };
  const handleModalClose = (value: any) => {
    console.log("value", value);
    if (value) {
      setBranchCode("");
      setUserDetails(false);
      setIsModalOpen(!isModalOpen);
      handleDrawerOpen();
    }
  };

  const handleClick = (value: string) => {
    console.log("You clicked the Chip.", value);
    setSelectedCapsule(value);
    setFilteredData([]);
  };

  const handleSearchBasedOnInput = (value: string) => {
    console.log(
      "handleSearchBasedOnInputValue",
      selectedCapsule,
      value.toUpperCase()
    );
    setSearchValue(value);
    let filteredAllClients: any[] = [];

    if (selectedCapsule === "Upcoming Dormant Client") {
      filteredAllClients = tableData.filter((item: any) =>
        item.clientName.toLowerCase().includes(value.toLowerCase())
      );
    } else if (selectedCapsule === "Active Clients") {
      filteredAllClients = activeGroupedClients.filter((item: any) =>
        item.ClientName.toLowerCase().includes(value.toLowerCase())
      );
    } else if (selectedCapsule === "Inactive Clients") {
      filteredAllClients = inactiveGroupedClients.filter((item: any) =>
        item.ClientName.toLowerCase().includes(value.toLowerCase())
      );
    } else {
      filteredAllClients = tableData.filter((item: any) =>
        item.ClientName.toLowerCase().includes(value.toLowerCase())
      );
    }

    setFilteredData(filteredAllClients);

    console.log("handleSearchBasedOnInputValue", filteredData);
  };

  const handleFileUploadAsync = (
    file: any,
    communicationProofPath: string
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const fileExt = file.name.split(".").pop()?.toLowerCase() || "";
      // debugger;
      if (allowedFormats.includes(fileExt)) {
        const { name } = file;
        const fileName = name.substring(0, name.lastIndexOf("."));
        console.log("fileName", fileName);

        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = () => {
          const base64String = reader.result as string;
          const base64Only = base64String.split(",")[1] || base64String;

          setUploadedFile(file);
          setFileBase64(base64Only); // Store base64
          setFileExtension(fileExt);

          dispatch(showLoader("Uploading file..."));

          let payload = {
            fileName: communicationProofPath,
            filePath: "D:\\FileUpload\\KYCConsentForm",
            fileType: `.${fileExt}`,
            contentType: base64Only,
          };

          apiServices
            .ComplainceFileUpload(payload)
            .then((response) => {
              dispatch(hideLoader());
              if (response?.status === 200) {
                // ShowToast("success", "File Successfully Uploaded");
                resolve(fileExt); // Resolve the promise on success
              } else {
                reject(new Error("File upload failed"));
              }
            })
            .catch((error) => {
              dispatch(hideLoader());
              console.error("ERROR-->", error);
              reject(error); // Reject the promise on error
            });
        };

        reader.onerror = (error) => {
          console.error("Error reading file:", error);
          dispatch(hideLoader());
          reject(error); // Reject the promise on error
        };
      } else {
        alert("Invalid file format! Allowed: DOC, PDF, XLS, XLSX, JPG, JPEG");
        reject(new Error("Invalid file format"));
      }
    });
  };

  const handleFileUpload = async (file: File, type: any) => {
    console.log("Uploading file for", file, type);
    const allowedExtensions = ["jpg", "jpeg", "png", "pdf"];
    const fileExt = file.name.split(".").pop()?.toLowerCase() || "";

    if (!allowedExtensions.includes(fileExt)) {
      ShowToast(
        "error",
        "Please upload a file in JPG, JPEG, PNG, or PDF format."
      );
      return;
    }

    const reader = new FileReader();

    reader.onload = async () => {
      const base64WithPrefix = reader.result as string;
      const base64Data = base64WithPrefix.split(",")[1];

      if (!base64Data) {
        ShowToast("error", "Failed to process the file.");
        return;
      }
      // const fileNameWithoutExtension = file.name.substring(
      //   0,
      //   file.name.lastIndexOf(".")
      // );
      const fullFileNameWithExtension = file.name;
      const currentTime = dayjs().format("DD/MM/YYYY_hh:mmA");

      const communicationProofPath = `${user_id}_${type}_${currentTime}_${fullFileNameWithExtension}`;
      console.log("communicationProofPath", communicationProofPath);
      setUploadFileName(communicationProofPath);

      try {
        await handleFileUploadAsync(file, communicationProofPath);

        // const payload = {
        //   rowId: "",
        //   fileName: communicationProofPath,
        //   uploadedBy: user_id,
        //   uploadedDate: new Date().toISOString(),
        //   remarks: "",
        // };

        // console.log("Payload to send:", payload);
        // dispatch(showLoader("Please wait for a moment"));
        // apiServices
        //   .UploadTradeFile(payload)
        //   .then((response) => {
        //     if (response?.status === 200) {
        //       dispatch(hideLoader());
        //       console.log("Response------>", response?.data);
        //       // setUploadApiStatus(true);

        //       // ShowToast("success", response?.data?.message);
        //     }
        //   })
        //   .catch((error) => {
        //     console.log("error", error);
        //     dispatch(hideLoader());
        //     // setUploadApiStatus(false);
        //   });
      } catch (error) {
        console.error("Compliance Upload Failed:", error);
        ShowToast("error", "Compliance upload failed.");
      }
    };

    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      ShowToast("error", "Error reading the file.");
    };

    reader.readAsDataURL(file);
  };

  const handleFilterChange = (selectedFilter: string) => {
    console.log("Selected Filter:", selectedFilter);
    setFilter(selectedFilter);

    if (selectedCapsule === "Upcoming Dormant Client") {
      setTableData([]); // Clear existing data before fetching new data

      const payload = {
        start: 0,
        pageSize: 5000,
        searchKey: searchValue !== "" ? searchValue : "",
        loginName: user_id,
        zone: "ALL",
        branchCode: "ALL",
        clientStatus: "ALL",
      };

      dispatch(showLoader("")); // Show loader while fetching data

      apiServices
        .getUpcompingDormantReport(payload)
        .then((response) => {
          console.log("API Response:", response?.data);

          if (response?.status === 200) {
            setResponseStatus(true);
            const data = response?.data || [];

            // Filter data based on the selected filter
            let filteredData = [];
            if (selectedFilter === "7D") {
              filteredData = data
                .filter((item: any) => item.dayCount <= 7)
                .sort((a: any, b: any) => b.dayCount - a.dayCount); // Reverse order
            } else if (selectedFilter === "15D") {
              filteredData = data
                .filter((item: any) => item.dayCount <= 15)
                .sort((a: any, b: any) => b.dayCount - a.dayCount);
            } else if (selectedFilter === "1M") {
              filteredData = data
                .filter((item: any) => item.dayCount <= 30)
                .sort((a: any, b: any) => b.dayCount - a.dayCount);
            } else {
              filteredData = data; // Use all data for "ALL"
            }

            // Update the table data with the filtered results
            setTableData(filteredData);

            // Log filtered results for debugging
            console.log(`Filtered Data for ${selectedFilter}:`, filteredData);
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          if (error.status === 400) {
            ShowToast("error", error?.response?.data?.message);
          } else {
            const zoneError = error.response.data.errors.Zone?.[0];
            const branchCodeError = error.response.data.errors.BranchCode?.[0];
            ShowToast("error", zoneError || "Unknown zone error");
            ShowToast("error", branchCodeError || "Unknown branch code error");
          }
        })
        .finally(() => {
          dispatch(hideLoader()); // Hide loader after fetching
        });
    }
  };
  document.title = document.title = "LKP Securities | Client Details";
  return (
    <div className="page-content page-view">
      <Container fluid>
        {!userDetails ? (
          <>
            <UserCapsules
              selectedCapsule={selectedCapsule}
              handleClick={handleClick}
              totalCount={totalCount}
              activeClient={activeClients}
              inactiveClient={inactiveClients}
              capsuleType="ClientDetails"
            />
            <Card
              style={{
                borderRadius: "15px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
              }}
            >
              <CardBody>
                <UserInfoTable
                  selectedWidget={selectedCapsule}
                  T6Data={filteredData.length > 0 ? filteredData : tableData}
                  // upcomingDormantTableData={upcomingDormantTableData}
                  activeGroupedClients={
                    filteredData.length > 0
                      ? filteredData
                      : activeGroupedClients
                  }
                  inactiveGroupedClients={
                    filteredData.length > 0
                      ? filteredData
                      : inactiveGroupedClients
                  }
                  getUserBrokergageModificationDetails={
                    getUserBrokergageModificationDetails
                  }
                  apiStatus={apiStatus}
                  handleExcel={handleExcel}
                  showSearch={responseStatus}
                  handleSearchBasedOnInput={handleSearchBasedOnInput}
                  // handleSearchUser={handleSearchUser}
                  searchValue={searchValue}
                  onFilterChange={handleFilterChange}
                  totalCount={totalCount}
                  activeClient={activeClients}
                  inactiveClient={inactiveClients}
                  dormantCount={dormantCount}
                />
              </CardBody>
            </Card>
          </>
        ) : (
          // <UserInfoDetail />
          <UserInfo
            isOpen={isModalOpen}
            onClose={getUserBrokergageModificationDetails}
            handleModalClose={handleModalClose}
            selectedClientCode={
              selectedUserInfo?.ctermcode ?? selectedUserInfo?.ClientCode
            }
            branch={branchCode}
            handleFileUpload={handleFileUpload}
            uploadedFileName={uploadedFileName}
          />
        )}
      </Container>
    </div>
  );
};
export default ClientDetails;
