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

const MutualFundIndex = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedMutualFund, setSelectedMutualFund] = useState<string>("");
  const [clientCode, setClientCode] = useState<string>("");
  const [hasToken, setHasToken] = useState(false);

  // 🚨 New state for modal
  const [showClientCodeModal, setShowClientCodeModal] = useState(true);

  const dispatch = useDispatch<AppDispatch>();

  const handleBack = () => setSelectedMutualFund("");

  const mfToken = "mfToken";
  useEffect(() => {
    // Always reset token when page opens
    localStorage.removeItem(mfToken);
  }, []);

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
        // ✅ Close modal only on success
        setShowClientCodeModal(false);
      }
    } catch (error) {
      console.error("mfLogin error:", error);
    } finally {
      dispatch(hideLoader());
    }
  };

  return (
    <div className="page-content page-view">
      <Container fluid>
        {/* 🔒 Modal for client code entry */}
        <Modal
          isOpen={showClientCodeModal}
          backdrop="static"
          keyboard={false}
          centered
          style={{
            maxWidth: "420px", // compact width
            margin: "auto", // ensure horizontal center
          }}
        >
          <ModalHeader
            style={{
              borderBottom: "none",
              textAlign: "center",
              fontWeight: 600,
              fontSize: "1.25rem",
              // paddingBottom: "0.5rem",
            }}
          >
            Enter Client Code
          </ModalHeader>

          <ModalBody
            style={{
              // padding: "1.5rem",
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
              // paddingBottom: "1.5rem",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={!clientCode.trim()}
              style={{
                padding: "0.6rem 2rem",
                borderRadius: "8px",
                fontWeight: 500,
                textTransform: "none",
                boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
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
            {!showClientCodeModal && (
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
          <MfOverview schemeCode={selectedMutualFund} onBack={handleBack} />
        ) : (
          mainMenu[activeTab]?.content({
            onSelectFund: setSelectedMutualFund,
            clientCode,
            hasToken,
          })
        )}
      </Container>
    </div>
  );
};

export default MutualFundIndex;
