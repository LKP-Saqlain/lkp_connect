import { useState } from "react";
import BasicTabs from "../../components/common/MutualFunds/NavTabs";
import { mainMenu } from "../../pages/MutualFund/mfTypes";
import { Card, Container } from "reactstrap";
import MfOverview from "../../components/common/MutualFunds/MfOverview";
import { TextField, Typography, IconButton, Box, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { hideLoader, showLoader } from "../../redux/slices/loaderSlice";
import { apiServices } from "../../services";
import { setEncryptedValue } from "../../utils/loocalEncrypt";

const MutualFundIndex = (activeSubItem: any) => {
  console.log(activeSubItem);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedMutualFund, setSelectedMutualFund] = useState<string>("");
  const [clientCode, setClientCode] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(true);
  const [hasToken, sethasToken] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const handleBack = () => setSelectedMutualFund("");

  const handleSubmit = async () => {
    // setClientCode("");
    sethasToken(false);
    if (!clientCode.trim()) return;
    try {
      const payload = {
        clientcode: clientCode,
        userName: "millicent",
        password: "M1i@l3l$c5e^n7t*",
        secretKey: "mtivsm&GDy6$409gu67@3hdYmb",
      };
      dispatch(showLoader(""));
      const res = await apiServices.MFLogin(payload);
      if (res?.status === 200) {
        dispatch(hideLoader());
        console.log("mfLogin response->", res?.data?.statusCode);
        if (res?.data?.statusCode) {
          sethasToken(true);
        } else {
          sethasToken(false);
        }
        // localStorage.setItem("mfToken", res?.data?.data);
        setEncryptedValue("mfToken", res?.data?.data);

        setIsEditing(false);
      }
    } catch (error) {
      console.error("mfLogin error:", error);
      dispatch(hideLoader());
    } finally {
      dispatch(hideLoader());
    }
  };

  return (
    <div className="page-content page-view">
      <Container fluid>
        {/* Card for Tabs */}
        <Card
          style={{
            borderRadius: "15px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
            padding: "3px",
            marginBottom: "16px",
          }}
        >
          <Box
            display="flex"
            // flexDirection={{ xs: "column", md: "row" }}
            // alignItems={{ xs: "flex-start", md: "center" }}
            justifyContent="space-between"
            gap={2}
          >
            {/* Tabs */}
            <BasicTabs
              tabs={mainMenu.map((m) => ({ label: m.label }))}
              value={activeTab}
              onChange={(_e, newValue) => {
                setActiveTab(newValue);
                setSelectedMutualFund(""); // Main NavTabs will have more priority over overview
              }}
            />

            {/* Client Code Section */}
            {isEditing ? (
              <Box display="flex" alignItems="center" gap={1}>
                <TextField
                  label="Enter Client Code"
                  variant="outlined"
                  value={clientCode}
                  onChange={(e) => setClientCode(e.target.value)}
                  size="small"
                  sx={{ width: "200px" }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </Box>
            ) : (
              <Box
                display="flex"
                alignItems="center"
                gap={1}
                minWidth="fit-content"
              >
                <Typography fontWeight={500}>
                  Client Code: <b>{clientCode}</b>
                </Typography>
                <IconButton size="small" onClick={() => setIsEditing(true)}>
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

        {/* </Card> */}
      </Container>
    </div>
  );
};

export default MutualFundIndex;
