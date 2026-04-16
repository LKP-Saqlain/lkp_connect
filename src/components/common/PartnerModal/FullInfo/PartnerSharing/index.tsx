import DataTable from "../../../UserInfoTable";
import { ParOnbPartnerSharingData } from "../../../../../helper/commmon";
import {
  Box,
  Button,
  Typography,
  Stack,
  Checkbox,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { SectionTitle } from "../../StylingCss";

const PartnerSharing = ({ data, activeSubItem }: any) => {
  const [attachment1, setAttachment1] = useState<File | null>(null);
  const [attachment2, setAttachment2] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState(false);
  const [rows, setRows] = useState(ParOnbPartnerSharingData);

  console.log(data);

  // ---------------- FILE HANDLER ----------------
  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "one" | "two",
  ) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];

    // Fake upload simulation
    setIsUploading(true);

    setTimeout(() => {
      if (type === "one") {
        setAttachment1(file);
      } else {
        setAttachment2(file);
      }
      setIsUploading(false);
    }, 1200); // 1.2 second fake delay
  };

  // ---------------- VALIDATION ----------------
  const isFormValid =
    (attachment1 !== null || attachment2 !== null) && isChecked;

  // ---------------- FINAL SAVE ----------------
  const handlePartnerSharingNext = () => {
    const payload = {
      updatedRows: rows,
      attachment1,
      attachment2,
      accepted: isChecked,
    };

    console.log("Final Payload:", payload);
  };

  return (
    <Box>
      {/* Title */}
      <SectionTitle>Brokerage Commercial details</SectionTitle>

      {/* Table */}
      <Box
        sx={{
          backgroundColor: "#ffffff",
          borderRadius: 1,
          overflow: "hidden",
          width: "520px",
        }}
      >
        <DataTable
          activeSubItem="partnerSharing"
          T6Data={rows}
          setRows={setRows}
          customHide
          selectedWidget="Criteria and Rewards"
          editRowAccess={isEditing}
        />
      </Box>

      {activeSubItem === "Ops Level 2 Approval" && (
        <Stack direction="row" spacing={2} mt={2}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setIsEditing(true)}
            disabled={isEditing}
            sx={{ borderRadius: "20px", textTransform: "none", px: 3 }}
          >
            Edit
          </Button>

          <Button
            variant="outlined"
            size="small"
            onClick={() => setIsEditing(false)}
            disabled={!isEditing}
            sx={{ borderRadius: "20px", textTransform: "none", px: 3 }}
          >
            Save
          </Button>
        </Stack>
      )}
      <Box mt={4}>
        <SectionTitle>Attach Approval Copy Here</SectionTitle>

        {/* Attachment 1 */}
        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          <Button
            variant="outlined"
            component="label"
            size="small"
            sx={{
              borderRadius: "8px",
              width: "220px",
              justifyContent: "flex-start",
              textTransform: "none",
            }}
          >
            📎 Attachment 1
            <input
              hidden
              type="file"
              onChange={(e) => handleFileChange(e, "one")}
            />
          </Button>

          {isUploading ? (
            <CircularProgress size={18} />
          ) : (
            attachment1 && (
              <Typography fontSize="12px">{attachment1.name}</Typography>
            )
          )}
        </Stack>

        {/* Attachment 2 */}
        <Stack direction="row" spacing={2} alignItems="center">
          <Button
            variant="outlined"
            component="label"
            size="small"
            sx={{
              borderRadius: "8px",
              width: "220px",
              justifyContent: "flex-start",
              textTransform: "none",
            }}
          >
            📎 Attachment 2
            <input
              hidden
              type="file"
              onChange={(e) => handleFileChange(e, "two")}
            />
          </Button>

          {isUploading ? (
            <CircularProgress size={18} />
          ) : (
            attachment2 && (
              <Typography fontSize="12px">{attachment2.name}</Typography>
            )
          )}
        </Stack>

        {/* Note */}
        <Typography
          variant="body2"
          sx={{ mt: 2, fontSize: "12px", color: "#555" }}
        >
          Note: No changes will be done without an approval
        </Typography>

        {/* Checkbox */}
        <FormControlLabel
          sx={{ mt: 1 }}
          control={
            <Checkbox
              size="small"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
            />
          }
          label={
            <Typography fontSize="13px">
              I have read all details carefully
            </Typography>
          }
        />
      </Box>

      {/* ================= SAVE BUTTON ================= */}
      {activeSubItem === "Ops Level 2 Approval" && (
        <Button
          variant="contained"
          onClick={handlePartnerSharingNext}
          disabled={!isFormValid}
          sx={{
            mt: 3,
            background: "#1F5A96",
            textTransform: "none",
            borderRadius: 2,
            px: 4,
            height: 40,
            opacity: !isFormValid ? 0.6 : 1,
          }}
        >
          Save & proceed
        </Button>
      )}
    </Box>
  );
};

export default PartnerSharing;
