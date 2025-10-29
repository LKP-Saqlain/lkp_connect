import { useEffect, useState } from "react";
import BasicTabs from "../../components/common/MutualFunds/NavTabs";
import { mainMenu } from "../../pages/MutualFund/mfTypes";
import {
  Card,
  Container,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from "reactstrap";
import MfOverview from "../../components/common/MutualFunds/MfOverview";
import { TextField, Typography, IconButton, Box, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { hideLoader, showLoader } from "../../redux/slices/loaderSlice";
import { apiServices } from "../../services";
import { setEncryptedValue } from "../../utils/loocalEncrypt";
import ShowToast from "../../utils/toastUtils";

const MutualFundIndex = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedMutualFund, setSelectedMutualFund] = useState<string>("");
  const [clientCode, setClientCode] = useState<string>("");
  const [hasToken, setHasToken] = useState(false);
  const [autoReopen, setAutoReopen] = useState(false);
  const [showClientCodeModal, setShowClientCodeModal] = useState(true);

  const dispatch = useDispatch<AppDispatch>();

  const handleBack = () => setSelectedMutualFund("");

  const mfToken = "mfToken";
  useEffect(() => {
    // Always reset token when page opens
    localStorage.removeItem(mfToken);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem("mfToken");
      if (!token) {
        setShowClientCodeModal(true);
      }
    }, 5000); // check every second

    return () => clearInterval(interval);
  }, []);

  const verifyClientCode = async (clientCode: any) => {
    // if (!clientCode?.trim()) return;
    console.log(clientCode, "uatme");

    try {
      dispatch(showLoader("Verifying Client Code..."));
      const response = await fetch(
        `http://uatmiddlewareapi.lkp.net.in/api/Client/VerifyClientCode?ClientCode=${clientCode}`,
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

  const handleSubmit = async () => {
    // setClientCode("");
    setHasToken(false);
    if (!clientCode.trim()) return;
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
  useEffect(() => {
    if (autoReopen) {
      const timer = setTimeout(() => {
        setClientCode("");
        setShowClientCodeModal(true);
        setAutoReopen(false);
      }, 3000); // 5 seconds
      return () => clearTimeout(timer);
    }
  }, [autoReopen]);

  const handleSetOrderTab = () => {
    const orderIndex = mainMenu.findIndex((m) => m.label === "Order");
    setActiveTab(orderIndex);
  };

  return (
    <div className="page-content page-view">
      <Container fluid>
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
            <TextField
              fullWidth
              label="Client Code"
              value={clientCode}
              onChange={(e) => setClientCode(e.target.value)}
              autoFocus
              variant="outlined"
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                },
              }}
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
              disabled={!clientCode.trim()}
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
            <BasicTabs
              tabs={mainMenu.map((m) => ({ label: m.label }))}
              value={activeTab}
              onChange={(_e, newValue) => {
                setActiveTab(newValue);
                setSelectedMutualFund("");
              }}
            />
            {hasToken && !showClientCodeModal && (
              <Box
                display="flex"
                alignItems="center"
                gap={1}
                minWidth="fit-content"
              >
                <Typography fontWeight={500}>
                  Client Code: <b>{clientCode}</b>
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => setShowClientCodeModal(true)}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Box>
        </Card>
        {selectedMutualFund ? (
          <MfOverview
            schemeCode={selectedMutualFund}
            onBack={handleBack}
            hasToken={hasToken}
            onOrderSuccess={handleSetOrderTab}
          />
        ) : (
          mainMenu[activeTab]?.content({
            onSelectFund: setSelectedMutualFund,
            clientCode,
            hasToken,
            // onOrderSuccess: handleSetOrderTab,
          })
        )}
      </Container>
    </div>
  );
};

export default MutualFundIndex;
