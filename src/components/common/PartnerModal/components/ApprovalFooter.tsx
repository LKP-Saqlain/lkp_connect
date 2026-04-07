import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";
import { ActionButton } from "../StylingCss";

type Props = {
  onSubmit: (data: { decision: "APPROVE" | "REJECT"; remarks: string }) => void;
  activeTab: string;
};

const ApprovalFooter = ({ onSubmit, activeTab }: Props) => {
  const [decision, setDecision] = useState<"APPROVE" | "REJECT" | null>(null);
  const [remarks, setRemarks] = useState("");

  const handleSubmit = () => {
    if (!decision || !remarks) return;

    onSubmit({
      decision,
      remarks,
    });
  };

  return (
    <Box display="flex" alignItems="center" gap={3} flexWrap="wrap">
      {activeTab !== "Action" && (
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
            onClick={() => setDecision("REJECT")}
          />

          <ActionButton
            label="Approve"
            color="#1f9647"
            bg="#E6F4EA"
            onClick={() => setDecision("APPROVE")}
          />

          <Button
            variant="contained"
            // disabled={!decision || !remarks}
            onClick={handleSubmit}
            sx={{
              background: "#1F5A96",
              textTransform: "none",
              borderRadius: 2,
              px: 4,
              height: 40,
              ml: "auto",
            }}
          >
            Submit & Continue
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
