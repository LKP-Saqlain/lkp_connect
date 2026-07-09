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
import {
  convertToBase64,
  validatePartnerSharingRows,
} from "../../../../../helper/method";
import { apiServices } from "../../../../../services";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../../redux/store";
import ShowToast from "../../../../../utils/toastUtils";
import {
  hideLoader,
  showLoader,
} from "../../../../../redux/slices/loaderSlice";

const PartnerSharing = ({
  data,
  activeSubItem,
  applNo,
  goToNextTab,
  kycDocs,
}: any) => {
  const [attachment1, setAttachment1] = useState<File | null>(null);
  const [attachment2, setAttachment2] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState(false);
  const [rows, setRows] = useState<any[]>([]);

  const dispatch = useDispatch<AppDispatch>();
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
    !isEditing && (attachment1 !== null || attachment2 !== null) && isChecked;

  // ---------------- FINAL SAVE ----------------
  const handlePartnerSharingNext = async () => {
    if (!attachment1 && !attachment2) {
      alert("At least one attachment is required");
      return;
    }
    if (activeSubItem === "Ops Level 2 Approval") {
      localStorage.setItem("MailDecision", "true");
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
  const partnerDoc1 = kycDocs?.find((doc: any) => doc.docID === 11);
  const partnerDoc2 = kycDocs?.find((doc: any) => doc.docID === 12);

  const handleDownload = async (doc: any) => {
    const payload = {
      fileName: doc.fileName,
      filePath: doc.filePath,
      fileType: doc.fileType,
      contentType: "",
    };

    dispatch(showLoader("Downloading..."));

    try {
      const response = await apiServices.ComplianceDownload(payload);

      if (response?.status === 200 && response?.data) {
        const blob = new Blob([response.data]);
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;

        const finalFileName = doc.fileName.endsWith(doc.fileType)
          ? doc.fileName
          : `${doc.fileName}${doc.fileType}`;

        link.download = finalFileName;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        window.URL.revokeObjectURL(url);
      } else {
        ShowToast("info", "Error downloading file");
      }
    } catch (error: any) {
      ShowToast("info", error.message || "An error occurred while downloading");
    } finally {
      dispatch(hideLoader());
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
            onClick={() => {
              const result = validatePartnerSharingRows(rows);

              if (!result.valid) {
                ShowToast("error", result.message);
                return;
              }

              setIsEditing(false);
            }}
            disabled={!isEditing}
            sx={{ borderRadius: "20px", textTransform: "none", px: 3 }}
          >
            Save
          </Button>
        </Stack>
      )}
      <Box mt={4}>
        <SectionTitle>
          {(activeSubItem === "Business Approval" ? "Download" : "Attach") +
            " Approval Copy Here"}
        </SectionTitle>

        {/* Attachment 1 */}
        {activeSubItem !== "Business Approval" &&
          activeSubItem !== "Management Approval" && (
            <Stack>
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
            </Stack>
          )}

        {/* Note */}
        {activeSubItem !== "Business Approval" &&
          activeSubItem !== "Management Approval" && (
            <>
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
            </>
          )}
        {(activeSubItem === "Business Approval" ||
          activeSubItem === "Management Approval") && (
          <Stack spacing={2}>
            {partnerDoc1 && (
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleDownload(partnerDoc1)}
                sx={{ width: "220px", textTransform: "none" }}
              >
                ⬇ Download Partner Sharing 1
              </Button>
            )}

            {partnerDoc2 && (
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleDownload(partnerDoc2)}
                sx={{ width: "220px", textTransform: "none" }}
              >
                ⬇ Download Partner Sharing 2
              </Button>
            )}

            {!partnerDoc1 && !partnerDoc2 && (
              <Typography fontSize="12px" color="gray">
                No Partner Sharing documents uploaded
              </Typography>
            )}
          </Stack>
        )}
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
