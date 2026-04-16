import DataTable from "../../../UserInfoTable";
import {
  Box,
  Button,
  Typography,
  Stack,
  Checkbox,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { SectionTitle } from "../../StylingCss";
import { convertToBase64 } from "../../../../../helper/method";
import { apiServices } from "../../../../../services";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import ShowToast from "../../../../../utils/toastUtils";

const PartnerSharing = ({ data, activeSubItem, applNo, goToNextTab }: any) => {
  const [attachment1, setAttachment1] = useState<File | null>(null);
  const [attachment2, setAttachment2] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState(false);
  // const [rows, setRows] = useState(ParOnbPartnerSharingData);
  const [rows, setRows] = useState<any[]>([]);

  console.log(data, "check", rows);

  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data,
  );

  useEffect(() => {
    if (data && data.length > 0) {
      const formattedRows = data.map((item: any, index: number) => ({
        id: index + 1, // increment id
        ...item, // keep all API fields
      }));

      setRows(formattedRows);
    }
  }, [data]);
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
    }, 1000); // 1.2 second fake delay
  };

  // ---------------- VALIDATION ----------------
  const isFormValid =
    (attachment1 !== null || attachment2 !== null) && isChecked;

  // ---------------- FINAL SAVE ----------------
  const handlePartnerSharingNext = async () => {
    if (!attachment1 && !attachment2) {
      alert("At least one attachment is required");
      return;
    }

    const isShareValid = rows.every((row: any) => {
      const ap = Number(row.apshare ?? row.ApShare);
      const lkp = Number(row.lkpShare ?? row.LkpShare);
      return ap + lkp === 100;
    });

    if (!isShareValid) {
      alert("AP Share + LKP Share must be exactly 100%");
      return;
    }

    try {
      setIsUploading(true);

      const filesArray: any[] = [];

      if (attachment1) {
        const base64_1 = await convertToBase64(attachment1);
        filesArray.push({
          docId: 11,
          fileName: "Partner_Sharing_1",
          fileType: "." + attachment1.name.split(".").pop(),
          contentType: base64_1,
        });
      }

      if (attachment2) {
        const base64_2 = await convertToBase64(attachment2);
        filesArray.push({
          docId: 12,
          fileName: "Partner_Sharing_2",
          fileType: "." + attachment2.name.split(".").pop(),
          contentType: base64_2,
        });
      }

      const uploadPayload = {
        user_id,
        applNo,
        files: filesArray,
      };

      const response1 =
        await apiServices.UploadPartnerSharingDocs(uploadPayload);

      if (!response1?.data?.isSuccess) {
        throw new Error("Upload API failed");
      }

      const formattedItems = rows.map((row: any) => ({
        segment: row.segment,
        apShare: Number(row.apshare ?? row.ApShare),
        lkpShare: Number(row.lkpShare ?? row.LkpShare),
        minRetn: Number(row.minRetention ?? row.minRentation),
      }));

      const secondPayload = {
        applNo,
        userId: user_id,
        items: formattedItems,
      };

      const response2 = await apiServices.AddBrokSharing(secondPayload);

      if (!response2?.data?.isSuccess) {
        throw new Error("AddBrokSharing API failed");
      }

      const thirdPayload = {
        user_id,
        applNo,
      };

      const response3 = await apiServices.BrokShareSubmit(thirdPayload);
      if (response3?.data?.data?.msg === "Success") {
        ShowToast("success", response3?.data?.data?.msg);
        goToNextTab();
      }
      if (!response3?.data?.isSuccess) {
        throw new Error("BrokShareSubmit API failed");
      }

      console.log("All APIs succeeded");
    } catch (error) {
      console.error("Process stopped:", error);
    } finally {
      setIsUploading(false);
    }
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
