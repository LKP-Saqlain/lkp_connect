import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";
import { ActionButton } from "../StylingCss";

const ApprovalFooter = ({
  getNextTab,
  onApproval,
  activeTab,
  activeSubItem,
}: any) => {
  const [decision, setDecision] = useState<"APPROVE" | "REJECT" | null>(null);
  const [remarks, setRemarks] = useState("");

  const handleNext = () => {
    getNextTab(activeTab);
    setDecision(null);
    setRemarks("");
  };

  const handleApproval = (decisionType: "APPROVE" | "REJECT") => {
    console.log(decisionType, remarks, decision);
    onApproval({
      decision: decisionType,
      remarks: remarks || undefined,
    });
    setDecision(null);
    setRemarks("");
  };
  const shouldHideActions =
    activeTab === "Partner Sharing" && activeSubItem === "Business Approval";
  return (
    <Box display="flex" alignItems="center" gap={3} flexWrap="wrap">
      {activeTab !== "Action" && (
        <>
          {/*  Hide only this block */}
          {!shouldHideActions && (
            <>
              <Box minWidth={300}>
                <TextField
                  label="Remarks *"
                  fullWidth
                  size="small"
                  multiline
                  rows={2}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </Box>

              <ActionButton
                label="Reject"
                color="#E02424"
                bg="#FEE2E2"
                onClick={() => handleApproval("REJECT")}
              />

              <ActionButton
                label="Approve"
                color="#1f9647"
                bg="#E6F4EA"
                onClick={() => handleApproval("APPROVE")}
              />
            </>
          )}
          {/*   Always visible */}
          <Button
            variant="contained"
            onClick={handleNext}
            sx={{
              background: "#1F5A96",
              textTransform: "none",
              borderRadius: 2,
              px: 4,
              height: 40,
              ml: "auto",
            }}
          >
            Next
          </Button>
        </>
      )}
      {activeTab === "Action" && (
        <>
          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              sx={{
                borderColor: "#1F5A96",
                color: "#1F5A96",
                textTransform: "none",
                borderRadius: "10px",
                px: 3,
              }}
              // onClick={() => onAction("REWORK")}
            >
              Send for Rework
            </Button>

            <Button
              variant="outlined"
              sx={{
                borderColor: "#1F5A96",
                color: "#1F5A96",
                textTransform: "none",
                borderRadius: "10px",
                px: 3,
              }}
              // onClick={() => onAction("COMPLIANCE")}
            >
              Send to Compliance
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default ApprovalFooter;
