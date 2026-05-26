import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";
import { ActionButton } from "../StylingCss";

const ApprovalFooter = ({
  onNext,
  onApproval,
  activeTab,
  activeSubItem,
}: any) => {
  const [decision, setDecision] = useState<"APPROVE" | "REJECT" | null>(null);
  const [remarks, setRemarks] = useState("");

  const handleNext = () => {
    onNext(activeTab);
    setDecision(null);
    setRemarks("");
  };

  const handleApproval = (decisionType: "APPROVE" | "REJECT") => {
    console.log(decisionType, remarks, decision);
    if (!remarks.trim()) {
      alert("Remarks are required");
      return;
    }
    if (
      (activeSubItem === "Business Approval" ||
        activeSubItem === "Management Approval") &&
      activeTab === "Partner Sharing"
    ) {
      localStorage.setItem("decisionType", decisionType);
    }

    if (
      (activeSubItem === "Business Approval" ||
        activeSubItem === "Management Approval") &&
      activeTab === "Payment"
    ) {
    }
    onApproval({
      decision: decisionType,
      remarks: remarks.trim(), // addded trim to remove extra spaces referral code
    });
    setDecision(null);
    setRemarks("");
  };
  const shouldHideActions =
    activeTab === "E-signed" ||
    ((activeTab === "Partner Sharing" || activeTab === "Payment") &&
      activeSubItem === "Ops Level 2 Approval");
  return (
    <Box display="flex" alignItems="center" gap={3} flexWrap="wrap" pt={3}>
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
          {!shouldHideActions && (
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
          )}
        </>
      )}
    </Box>
  );
};

export default ApprovalFooter;
