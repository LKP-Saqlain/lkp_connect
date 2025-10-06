import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Container } from "reactstrap";
import DataTable from "../../components/common/UserInfoTable";
import { hideLoader, showLoader } from "../../redux/slices/loaderSlice";
import { apiServices } from "../../services";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";

import UserCapsules from "../ClientDetails/UserCapsules";

const Index = ({ activeMenu }: any) => {
  const [data, setData] = useState<any>();
  const [flag, setFlag] = useState<boolean>(false);

  const [currentClient, setCurrentClient] = useState("");

  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );

  useEffect(() => {
    const GetClientPledgeDetails = () => {
      const payload = {
        user_id: user_id,
        clientCode: "ALL",
        zone: "ALL",
        branchCode: "ALL",
      };
      dispatch(showLoader("Please wait, we are processing your request..."));

      apiServices
        .GetClientPledgeDetails(payload)
        .then((response) => {
          setData(response?.data?.data);
        })
        .catch((error) => {
          console.error("Error fetching compliance data:", error);
        })
        .finally(() => {
          dispatch(hideLoader());
        });
    };
    GetClientPledgeDetails();
  }, []);

  const handleSearchBasedOnInput = (value: string) => {
    console.log("handleSearchBasedOnInputValue", value);
    const query = value;
    setSearchQuery(query);

    const lowerCaseValue = value.toLowerCase();

    const filtered = data.filter((item: any) => {
      const clientNameMatch = item.clientName
        ?.toLowerCase()
        .includes(lowerCaseValue);
      const accountCodeMatch = item.clientCode
        ?.toString()
        .toLowerCase()
        .includes(lowerCaseValue);

      return clientNameMatch || accountCodeMatch;
    });

    setFilteredData(filtered);
    console.log("filteredSearch Records", filtered);
  };

  const handleClick = (row: any) => {
    const encryptedCode = row?.encryptedCode;
    const clientCode = row?.clientCode;

    if (!encryptedCode || !clientCode) {
      console.warn("Missing client or encrypted code");
      return;
    }

    const url = `https://allocation.lkp.net.in:51528/Pledge/direct?UserId=${encryptedCode}`;
    setCurrentClient(clientCode); // keep this if you want to display client info somewhere

    // Open popup window instead of iframe
    const popupWidth = 900;
    const popupHeight = 500;
    const left = window.screenX + (window.outerWidth - popupWidth) / 2;
    const top = window.screenY + (window.outerHeight - popupHeight) / 2;

    window.open(
      url,
      "PledgePopup",
      `width=${popupWidth},height=${popupHeight},left=${left},top=${top},resizable=yes,scrollbars=yes`
    );

    console.log("Pledge Encrypted Code:", encryptedCode);
  };

  return (
    <div className="page-content page-view">
      <UserCapsules
        selectedCapsule={"Pledge Request"}
        capsuleType="Pledge Request"
      />
      <Container fluid>
        <Card
          style={{
            borderRadius: "15px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          }}
        >
          <CardHeader
            style={{
              borderRadius: "15px 15px 0 0",
              boxShadow: "0 -4px 8px rgba(0, 0, 0, 0.15)",
              backgroundColor: "#fff",
              padding: "0.2rem 0.8rem",
              position: "relative", // for absolute positioning inside
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <h4
              className="card-title mb-0"
              style={{
                width: "100%",
                textAlign: "center",
                margin: 0,
              }}
            >
              Client Pledge Request
            </h4>

            {flag && (
              <button
                onClick={() => {
                  setFlag(false);
                  setCurrentClient("");
                }}
                style={{
                  position: "absolute",
                  right: "12px",
                  backgroundColor: "#11395C",
                  color: "white",
                  border: "none",
                  padding: "4px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                Close
              </button>
            )}
          </CardHeader>

          <CardBody style={flag ? { padding: 0 } : {}}>
            {flag ? (
              <>
                <div className="mb-3 px-3 py-2 bg-light rounded border d-flex align-items-center">
                  <strong className="me-2 ">Client Code:</strong>
                  <span className="text-dark ">{currentClient || "N/A"}</span>
                </div>
                <iframe
                  // src={iframeSrc}
                  width="100%"
                  height="400"
                  style={{ border: "none" }}
                  title="Pledge Frame"
                />
              </>
            ) : (
              <DataTable
                activeMenu={activeMenu}
                // T6Data={data}
                handleDownload={handleClick}
                showSearch={Array.isArray(data) && data.length > 0}
                handleSearchBasedOnInput={handleSearchBasedOnInput}
                searchValue={searchQuery}
                T6Data={searchQuery ? filteredData : data}
              />
            )}
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default Index;
