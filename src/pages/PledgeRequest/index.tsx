import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Label,
  Row,
} from "reactstrap";
import DataTable from "../../components/common/UserInfoTable";
import { hideLoader, showLoader } from "../../redux/slices/loaderSlice";
import { apiServices } from "../../services";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import Select from "react-select";
import ShowToast from "../../utils/toastUtils";
import { TextField } from "@mui/material";
import UserCapsules from "../ClientDetails/UserCapsules";

const Index = ({ activeMenu }: any) => {
  // const [iframeSrc, setIframeSrc] = useState("");
  const [data, setData] = useState<any>();
  const [flag, setFlag] = useState<boolean>(false);
  const [zoneOptions, setZoneOptions] = useState<any[]>([]);
  const [branchCodeOptions, setBranchCodeOptions] = useState<any[]>([]); // Add if needed
  const [selectedZone, setSelectedZone] = useState<any>(null);
  const [clientCode, setClientCode] = useState("");
  const [currentClient, setCurrentClient] = useState("");
  const [selectedBranchCode, setSelectedBranchCode] = useState<any>(null);
  // const [selectedCapsule, setSelectedCapsule] = useState("Pledge Request");
  const dispatch = useDispatch<AppDispatch>();
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );

  useEffect(() => {
    const GetClientPledgeDetails = () => {
      const payload = {
        // user_id: "EMP-5432",
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
  }, [dispatch]);

  useEffect(() => {
    const payload = {
      user_id,
      option: "zone",
      userType: "EMP",
      zone: "ALL",
    };

    dispatch(showLoader("Please wait, we are processing your request..."));
    apiServices
      .getDropDown(payload)
      .then((res) => {
        if (res?.status === 200) {
          const formatted = res.data.map((item: any) => ({
            label: item.itemVal,
            value: item.itemVal,
          }));
          setZoneOptions(formatted);
        }
      })
      .catch(() => ShowToast("error", "Failed to fetch zones"))
      .finally(() => dispatch(hideLoader()));
  }, [dispatch, user_id]);

  // Fetch branch codes when a zone is selected
  useEffect(() => {
    if (selectedZone) {
      const str = user_id;
      let extractUserId = null;
      if (str) {
        const parts = str.split("-");
        if (parts.length > 1) {
          extractUserId = parts[1];
        }
      }
      const payload = {
        user_id: extractUserId,
        option: "BranchByZone",
        userType: "EMP",
        zone: selectedZone.value, // Use the selected zone value!
      };

      dispatch(showLoader("Please wait, we are processing your request..."));

      apiServices
        .getDropDown(payload)
        .then((res) => {
          if (res?.status === 200) {
            let branchDropdown = res?.data.map((item: any) => ({
              label: item.itemVal,
              value: item.itemVal,
            }));
            branchDropdown = [
              { label: "ALL", value: "ALL" },
              ...branchDropdown,
            ];
            setBranchCodeOptions(branchDropdown);
          }
          dispatch(hideLoader());
        })
        .catch((Err) => {
          const errorMessage = Err?.response?.data?.message;
          dispatch(hideLoader());
          ShowToast(
            "error",
            errorMessage ||
              "Sorry for the inconvenience, please try after some time."
          );
        });
    } else {
      setBranchCodeOptions([]); // Clear branch codes if no zone is selected
    }
  }, [selectedZone, dispatch, user_id]);

  const handleSubmit = () => {
    const zone = selectedZone?.value || "ALL";
    const branch = selectedBranchCode?.value || "ALL";
    const client = clientCode?.trim() || "ALL";

    console.log("Form submitted with:", { zone, branch, client });

    const payload = {
      user_id,
      clientCode: client,
      zone,
      branchCode: branch,
    };

    dispatch(showLoader("Please wait, we are processing your request..."));

    apiServices
      .GetClientPledgeDetails(payload)
      .then((response) => {
        setData(response?.data?.data);
      })
      .catch((error) => {
        console.error("Error fetching pledge details:", error);
      })
      .finally(() => {
        dispatch(hideLoader());
      });

    // Optional: Reset fields
    // setSelectedZone(null);
    // setSelectedBranchCode(null);
    // setClientCode("");
  };

  // const handleClick = (row: any) => {
  //   const encryptedCode = row?.encryptedCode;
  //   const clientCode = row?.clientCode;

  //   if (!encryptedCode || !clientCode) {
  //     console.warn("Missing client or encrypted code");
  //     return;
  //   }
  //   const url = `https://allocation.lkp.net.in:51528/Pledge/direct?UserId=${encryptedCode}`;
  //   setCurrentClient(clientCode); // Set client code for display
  //   setIframeSrc(url); // Update iframe URL
  //   setFlag(true); // Trigger rendering if flag is used
  //   console.log("Pledge Encrypted Code:", encryptedCode);
  // };

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
        {/* <button onClick={handleClick}>Click to open link</button> */}

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
                // fontWeight: 500,
                // fontSize: "1.1rem",
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

          <CardHeader>
            {!flag && (
              <Row className="">
                <Col md={3} sm={6} xs={12} className="mb-3">
                  <Label className="form-label text-muted label-font">
                    Zone
                  </Label>
                  <Select
                    value={selectedZone}
                    onChange={(option) => setSelectedZone(option)}
                    options={zoneOptions}
                    isClearable
                    styles={{
                      control: (base) => ({ ...base, fontSize: "12px" }),
                    }}
                  />
                </Col>
                <Col md={3} sm={6} xs={12} className="mb-3">
                  <Label
                    htmlFor="client-code-input"
                    className="form-label text-muted label-font"
                  >
                    Branch Code
                  </Label>
                  <Select
                    value={selectedBranchCode}
                    onChange={(option) => setSelectedBranchCode(option)}
                    options={branchCodeOptions}
                    isClearable
                    styles={{
                      control: (base) => ({ ...base, fontSize: "12px" }),
                    }}
                  />
                </Col>{" "}
                <Col
                  xs={12}
                  style={{
                    flex: "0 0 auto",
                    minWidth: "140px",
                    maxWidth: "180px",
                  }}
                  className="mb-3"
                >
                  <Label
                    htmlFor="client-code-input"
                    className="form-label text-muted label-font"
                  >
                    Client Code
                  </Label>
                  <TextField
                    id="client-code-input"
                    value={clientCode}
                    onChange={(e) => setClientCode(e.target.value)}
                    placeholder="Enter client code"
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                </Col>
                <Col
                  md={2}
                  sm={4}
                  xs={12}
                  className="mb-3 d-flex align-items-end"
                >
                  <Button
                    type="submit"
                    onClick={handleSubmit}
                    style={{
                      backgroundColor: "#11395C",
                      color: "#fff",
                      fontSize: "12px",
                      width: "100%",
                    }}
                  >
                    View
                  </Button>
                </Col>
              </Row>
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
                T6Data={data}
                handleDownload={handleClick}
              />
            )}
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default Index;
