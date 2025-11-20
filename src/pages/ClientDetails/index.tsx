import { useState, useEffect } from "react";
import UserCapsules from "./UserCapsules";
import UserInfoTable from "../../components/common/UserInfoTable";
import { showLoader, hideLoader } from "../../redux/slices/loaderSlice";
import { apiServices } from "../../services";
import { useDispatch, useSelector } from "react-redux";
import "./style.css";
import UserInfo from "./IndUserDetailsModal";
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
}

const ClientDetails = ({
  handleDrawerClose,
  handleDrawerOpen,
  apiStatus,
  selectedTrading,
}: any) => {
  const [selectedCapsule, setSelectedCapsule] = useState<any>(
    "Upcoming Dormant Client"
  );
  const [tableData, setTableData] = useState<[]>([]);
  const [userDetails, setUserDetails] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeClients, setActiveClients] = useState<any[]>([]);
  const [inactiveClients, setInactiveClients] = useState<any[]>([]);
  const [totalClients, setTotalClients] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [responseStatus, setResponseStatus] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [branchCode, setBranchCode] = useState("");
  const [selectedUserInfo, setSelectedUserInfo] = useState<ClientRow | null>(
    null
  );
  const [uploadedFileName, setUploadFileName] = useState("");

  // 👉 NEW minimal state to avoid duplicate API calls
  const [clientDataLoaded, setClientDataLoaded] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );

  useEffect(() => {
    if (selectedTrading === "Dormant") {
      setSelectedCapsule("Upcoming Dormant Client");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [selectedTrading]);

  useEffect(() => {
    const getUpcomingDormants = async () => {
      if (
        selectedCapsule === "Upcoming Dormant Client" &&
        tableData.length === 0
      ) {
        setTableData([]);

        const payload = {
          start: 0,
          pageSize: 5000,
          searchKey: "",
          loginName: user_id,
          zone: "ALL",
          branchCode: "ALL",
          clientStatus: "ALL",
        };

        dispatch(showLoader("Please wait, we are processing your request..."));

        await apiServices
          .getUpcompingDormantReport(payload)
          .then((response) => {
            dispatch(hideLoader());

            if (response?.status === 200) {
              setResponseStatus(true);
              setTableData(response?.data);
            }
          })
          .catch((error) => {
            console.error("error", error.status);
            dispatch(hideLoader());
            ShowToast("error", error?.response?.data?.message);
          });
      }
    };
    getUpcomingDormants();
  }, [selectedCapsule]);

  // ✅ Only call client details API ONCE unless capsule changes
  useEffect(() => {
    if (selectedCapsule !== "Upcoming Dormant Client" && !clientDataLoaded) {
      fetchClientCash();
    }
  }, [apiStatus, selectedCapsule]);

  const fetchClientCash = async () => {
    if (clientDataLoaded) return; // ⛔ prevent repeated calls

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
        dispatch(showLoader("Please wait, we are processing your request..."));
        const response = await apiServices.ClientDetails(payload);

        if (response?.status === 200) {
          dispatch(hideLoader());
          setResponseStatus(true);
          setTotalClients(response?.data);
          setClientDataLoaded(true);
          const activeClients = response?.data.filter(
            (client: any) => client.ClientStatus === "Active"
          );

          const inactiveClients = response?.data.filter(
            (client: any) => client.ClientStatus === "Inactive"
          );

          setActiveClients(activeClients);
          setInactiveClients(inactiveClients);
        }
      } catch (error) {
        dispatch(hideLoader());
      }
    }
  };
  let mainTableData =
    filteredData.length > 0
      ? filteredData
      : selectedCapsule === "Active Clients"
      ? activeClients
      : selectedCapsule === "Inactive Clients"
      ? inactiveClients
      : selectedCapsule === "Total Clients"
      ? totalClients
      : tableData;

  const getUserBrokergageModificationDetails = (value: any) => {
    setBranchCode(value.BranchCode);

    if (Object.keys(value).length > 0) {
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
    if (value) {
      setBranchCode("");
      setUserDetails(false);
      setIsModalOpen(!isModalOpen);
      handleDrawerOpen();
    }
  };

  const handleClick = (value: string) => {
    setSelectedCapsule(value);
    setFilteredData([]);
  };

  const handleSearchBasedOnInput = (value: string) => {
    setSearchValue(value);

    let baseData: any[] = [];

    if (selectedCapsule === "Upcoming Dormant Client") {
      baseData = tableData;
    } else if (selectedCapsule === "Active Clients") {
      baseData = activeClients;
    } else if (selectedCapsule === "Inactive Clients") {
      baseData = inactiveClients;
    } else if (selectedCapsule === "Total Clients") {
      baseData = totalClients;
    } else {
      baseData = tableData;
    }

    const searchVal = value.toLowerCase();

    const filteredAllClients = baseData.filter((item: any) => {
      const name = item.clientName || item.ClientName;
      const code = item.ctermcode || item.ClientCode;

      return (
        name?.toLowerCase().includes(searchVal) ||
        code?.toLowerCase().includes(searchVal)
      );
    });

    setFilteredData(filteredAllClients);
  };

  const handleFileUploadAsync = (
    file: any,
    communicationProofPath: string
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const fileExt = file.name.split(".").pop()?.toLowerCase() || "";
      if (allowedFormats.includes(fileExt)) {
        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = () => {
          const base64String = reader.result as string;
          const base64Only = base64String.split(",")[1] || base64String;
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
                resolve(fileExt);
              } else {
                reject(new Error("File upload failed"));
              }
            })
            .catch((error) => {
              dispatch(hideLoader());
              reject(error);
            });
        };

        reader.onerror = (error) => {
          dispatch(hideLoader());
          reject(error);
        };
      } else {
        alert("Invalid file format! Allowed: DOC, PDF, XLS, XLSX, JPG, JPEG");
        reject(new Error("Invalid file format"));
      }
    });
  };

  const handleFileUpload = async (file: File, type: any) => {
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

      const currentTime = dayjs().format("DD/MM/YYYY_hh:mmA");
      const communicationProofPath = `${user_id}_${type}_${currentTime}_${file.name}`;

      setUploadFileName(communicationProofPath);

      try {
        await handleFileUploadAsync(file, communicationProofPath);
      } catch (error) {
        ShowToast("error", "Compliance upload failed.");
      }
    };

    reader.readAsDataURL(file);
  };

  const handleFilterChange = (selectedFilter: string) => {
    if (selectedCapsule === "Upcoming Dormant Client") {
      setTableData([]);

      const payload = {
        start: 0,
        pageSize: 5000,
        searchKey: searchValue || "",
        loginName: user_id,
        zone: "ALL",
        branchCode: "ALL",
        clientStatus: "ALL",
      };

      dispatch(showLoader("Please wait, we are processing your request..."));

      apiServices
        .getUpcompingDormantReport(payload)
        .then((response) => {
          if (response?.status === 200) {
            const data = response?.data || [];
            let filteredData = [];

            if (selectedFilter === "7D") {
              filteredData = data
                .filter((i: any) => i.dayCount <= 7)
                .sort((a: any, b: any) => b.dayCount - a.dayCount);
            } else if (selectedFilter === "15D") {
              filteredData = data
                .filter((i: any) => i.dayCount <= 15)
                .sort((a: any, b: any) => b.dayCount - a.dayCount);
            } else if (selectedFilter === "1M") {
              filteredData = data
                .filter((i: any) => i.dayCount <= 30)
                .sort((a: any, b: any) => b.dayCount - a.dayCount);
            } else {
              filteredData = data;
            }

            setTableData(filteredData);
          }
        })
        .catch((error) => {
          ShowToast("error", error?.response?.data?.message);
        })
        .finally(() => {
          dispatch(hideLoader());
        });
    }
  };

  document.title = "LKP Securities | Client Details";

  return (
    <div className="page-content page-view">
      <Container fluid>
        {!userDetails ? (
          <>
            <UserCapsules
              selectedCapsule={selectedCapsule}
              handleClick={handleClick}
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
                  T6Data={mainTableData}
                  getUserBrokergageModificationDetails={
                    getUserBrokergageModificationDetails
                  }
                  apiStatus={apiStatus}
                  showSearch={responseStatus}
                  handleSearchBasedOnInput={handleSearchBasedOnInput}
                  searchValue={searchValue}
                  onFilterChange={handleFilterChange}
                />
              </CardBody>
            </Card>
          </>
        ) : (
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
