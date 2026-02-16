import { useCallback, useEffect, useState } from "react";
import BasicTabs from "../../../components/common/MutualFunds/NavTabs";
import { mainMenu } from "../mfTypes";
import {
  Card,
  Container,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from "reactstrap";
import MfOverview from "../../../components/common/MutualFunds/MfOverview";
import {
  TextField,
  Typography,
  IconButton,
  Box,
  Button,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { apiServices } from "../../../services";
import { setEncryptedValue } from "../../../utils/loocalEncrypt";
import ShowToast from "../../../utils/toastUtils";
import { capitalizeEachWord } from "../../../utils";
import PhysicalOnboard from "./PhysicalOnboard";
import MfSearch from "../../../components/common/MutualFunds/Search";

const MutualFundIndex = ({ handleTradingOpen }: any) => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedMutualFund, setSelectedMutualFund] = useState<string>("");
  const [investMoreDetails, setInvestMoreDetails] = useState(null);
  const [clientCode, setClientCode] = useState<string>("");
  const [hasToken, setHasToken] = useState(false);
  const [autoReopen, setAutoReopen] = useState(false);
  const [showClientCodeModal, setShowClientCodeModal] = useState(true);
  const [clientName, setClientName] = useState<string>("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPhysicalOnboard, setShowPhysicalOnboard] = useState(false);
  const [searchModal, setSearchModal] = useState(false);

  // Debounce typing (to avoid too many API calls)
  useEffect(() => {
    const delay = setTimeout(() => {
      if (clientCode.length >= 4) ClientList(clientCode);
      else setSuggestions([]);
    }, 500);

    return () => clearTimeout(delay);
  }, [clientCode]); // No need for dispatch dependency

  const dispatch = useDispatch<AppDispatch>();

  const handleBack = () => {
    setSelectedMutualFund("");
    setInvestMoreDetails(null);
  };

  const mfToken = "mfToken";
  useEffect(() => {
    // Always reset token when page opens
    localStorage.removeItem(mfToken);
  }, []);

  // Periodic token check
  useEffect(() => {
    if (showClientCodeModal) return;
    const intervalId = setInterval(() => {
      if (!localStorage.getItem(mfToken)) {
        setShowClientCodeModal(true);
      }
    }, 5000);
    return () => clearInterval(intervalId);
  }, [showClientCodeModal]);

  // Auto reopen after temporary close
  useEffect(() => {
    if (autoReopen && !showClientCodeModal) {
      const timeoutId = setTimeout(() => {
        setClientCode("");
        setShowClientCodeModal(true);
        setAutoReopen(false);
      }, 3000);
      return () => clearTimeout(timeoutId);
    }
  }, [autoReopen, showClientCodeModal]);

  const verifyClientCode = async (clientCode: any) => {
    // if (!clientCode?.trim()) return;
    console.log(clientCode, "uatme");

    try {
      dispatch(showLoader("Verifying Client Code..."));
      const response = await fetch(
        `https://middlewareapi.lkp.net.in/api/Client/VerifyClientCode?ClientCode=${clientCode}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      dispatch(hideLoader());
      if (data?.data === true) {
        handleSubmit();
      } else {
        ShowToast("error", data?.message);
      }
    } catch (error) {
      console.error("mfLogin error:", error);
    } finally {
      dispatch(hideLoader());
    }
  };
  const ClientList = useCallback(
    async (code: string) => {
      try {
        setLoading(true);
        dispatch(showLoader("Verifying Client Code..."));

        const response = await fetch(
          `https://middlewareapi.lkp.net.in/api/Client/GetClientsCodeAndName?SearchKey=${code}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        dispatch(hideLoader());
        setLoading(false);

        if (data?.isSuccess && Array.isArray(data.data)) {
          setSuggestions(data.data);
        } else {
          setSuggestions([]);
          ShowToast("error", data?.message || "No clients found");
        }
      } catch (error) {
        console.error("ClientList error:", error);
        dispatch(hideLoader());
        setLoading(false);
      } finally {
        setLoading(false);
        dispatch(hideLoader());
      }
    },
    [dispatch]
  );
  const handleSubmit = async () => {
    // setClientCode("");
    setHasToken(false);
    if (!clientCode || !clientCode.trim()) return;

    try {
      const payload = {
        clientcode: clientCode,
        userName: "millicent",
        password: "M1i@l3l$c5e^n7t*",
        secretKey: "mtivsm&GDy6$409gu67@3hdYmb",
      };
      dispatch(showLoader("Authenticating..."));
      const res = await apiServices.MFLogin(payload);
      if (res?.status === 200) {
        dispatch(hideLoader());
        console.log("mfLogin response->", res?.data?.statusCode);
        if (res?.data?.statusCode) {
          setHasToken(true);
          setActiveTab(0);
        } else {
          setHasToken(false);
        }
        // localStorage.setItem("mfToken", res?.data?.data);
        setEncryptedValue("mfToken", res?.data?.data);
        //  Close modal only on success
        setShowClientCodeModal(false);
        setSelectedMutualFund("");
      }
    } catch (error) {
      console.error("mfLogin error:", error);
    } finally {
      dispatch(hideLoader());
    }
  };

  const handleTemporaryClose = () => {
    setShowClientCodeModal(false);
    setAutoReopen(true);
  };

  // watch for auto-reopen trigger

  const handleSetOrderTab = () => {
    const orderIndex = mainMenu.findIndex((m) => m.label === "Order");
    setActiveTab(orderIndex);
  };

  return (
    <div className="page-content page-view">
      <Container fluid>
        <MfSearch
          searchModal={searchModal}
          setSearchModal={setSearchModal}
          setSelectedMutualFund={setSelectedMutualFund}
        />
        {!hasToken && !showClientCodeModal && (
          <Box
            sx={{
              position: "absolute", // absolute inside Container
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0)", // transparent
              zIndex: 1, // lower than modal but higher than content
              pointerEvents: "auto",
            }}
          />
        )}
        {/* 🔒 Modal for client code entry */}
        <Modal
          isOpen={showClientCodeModal}
          backdrop="static"
          keyboard={false}
          centered
          style={{
            maxWidth: "400px",
            margin: "auto",
          }}
        >
          <ModalHeader
            style={{
              borderBottom: "none",
              textAlign: "center",
              fontWeight: 600,
              fontSize: "1.25rem",
              position: "relative",
            }}
            toggle={handleTemporaryClose}
          >
            Enter Client Code
          </ModalHeader>

          <ModalBody
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <Autocomplete
              freeSolo
              inputValue={clientCode} //  THIS IS THE KEY
              options={suggestions}
              filterOptions={(x) => x} //  IMPORTANT: disable client-side filtering
              getOptionLabel={(option: any) =>
                `${option.clientCode} - ${option.clientName}`
              }
              onChange={(_event, value) => {
                // Case 1: User pressed ENTER on typed text
                if (typeof value === "string") {
                  setClientCode(value);
                  return;
                }

                // Case 2: User selected an option from dropdown
                if (value && typeof value === "object") {
                  setClientCode(value.clientCode);
                  setClientName(value.clientName);
                  return;
                }

                // Case 3: Cleared
                setClientCode("");
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Client Code / PAN"
                  value={clientCode}
                  onChange={(e) => setClientCode(e.target.value)}
                  variant="outlined"
                  size="small"
                  fullWidth
                  autoFocus
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loading ? <CircularProgress size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      width: "22rem",
                    },
                  }}
                />
              )}
            />
          </ModalBody>

          <ModalFooter
            style={{
              borderTop: "none",
              justifyContent: "center",
              gap: "1rem",
            }}
          >
            {/* Cancel button hides modal for 5 seconds */}
            <Button
              style={{
                backgroundColor: "#ee4b2b",
                fontSize: "11px",
                minHeight: "35px",
                width: "80px",
                color: "white",
              }}
              onClick={handleTemporaryClose}
            >
              Cancel
            </Button>

            <Button
              onClick={() => verifyClientCode(clientCode)}
              disabled={!clientCode || !clientCode.trim()}
              style={{
                backgroundColor: "#11395C",
                fontSize: "11px",
                minHeight: "35px",
                width: "80px",
                color: "white",
              }}
            >
              Submit
            </Button>
          </ModalFooter>
        </Modal>
        {/* The rest of the UI (tabs, etc.) */}
        <Card
          style={{
            borderRadius: "15px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
            padding: "3px",
            marginBottom: "16px",
            opacity: showClientCodeModal ? 0.4 : 1, // dim if modal open
            pointerEvents: showClientCodeModal ? "none" : "auto", // disable interaction
          }}
        >
          <Box display="flex" justifyContent="space-between" gap={2}>
            {showPhysicalOnboard || (
              <BasicTabs
                tabs={mainMenu.map((m) => ({ label: m.label }))}
                value={activeTab}
                customCase={"Search"}
                onSearchClick={() => {
                  setSearchModal(true);
                  setInvestMoreDetails(null);
                }}
                onChange={(_e, newValue) => {
                  setActiveTab(newValue);
                  setSelectedMutualFund("");
                  setShowPhysicalOnboard(false);
                  setInvestMoreDetails(null);
                }}
              />
            )}
            {hasToken && !showClientCodeModal && (
              <Box
                display="flex"
                alignItems="center"
                gap={1}
                minWidth="fit-content"
              >
                <Typography fontWeight={500}>
                  Client: {clientCode} -{" "}
                  {capitalizeEachWord(clientName.trim().split(" ")[0])}
                </Typography>
                {showPhysicalOnboard || (
                  <IconButton
                    size="small"
                    onClick={() => setShowClientCodeModal(true)}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            )}
          </Box>
        </Card>
        {showPhysicalOnboard ? (
          <PhysicalOnboard
            ClientCode={clientCode}
            onPhysicalOnboard={() => setShowPhysicalOnboard(false)}
          />
        ) : (
          <>
            {selectedMutualFund ? (
              <MfOverview
                schemeCode={selectedMutualFund}
                onBack={handleBack}
                hasToken={hasToken}
                onOrderSuccess={handleSetOrderTab}
                ClientCode={clientCode}
                onPhysicalOnboard={() => setShowPhysicalOnboard(true)}
                investMoreDetails={investMoreDetails}
                handleTradingOpen={handleTradingOpen}
              />
            ) : (
              mainMenu[activeTab]?.content({
                onSelectFund: setSelectedMutualFund,
                clientCode,
                hasToken,
                investMoreDetails: setInvestMoreDetails,
              })
            )}
          </>
        )}
      </Container>
    </div>
  );
};

export default MutualFundIndex;
