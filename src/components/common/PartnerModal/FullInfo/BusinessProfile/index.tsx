import { Box, Typography } from "@mui/material";
import { FieldGrid, SectionTitle, SelectableBox } from "../../StylingCss";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../../redux/store";
import {
  hideLoader,
  showLoader,
} from "../../../../../redux/slices/loaderSlice";
import { apiServices } from "../../../../../services";
import ShowToast from "../../../../../utils/toastUtils";

/* ================= MAIN COMPONENT ================= */

const BusinessPartnerForm = ({ data, kycDocs }: any) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleCommonDownload = async (doc: any) => {
    console.log("Download:", doc);

    const payload = {
      // fileName: "danger.jpeg.jpeg",
      fileName: doc.fileName,
      filePath: doc.filePath,
      // filePath: "\\172.17.100.60\\d$\\FileUpload\\PartnerOnBoarding\\10128",
      fileType: doc.fileType,
      contentType: "",
    };

    dispatch(showLoader("Downloading..."));
    console.log("row data", payload);

    apiServices
      .ComplianceDownload(payload)
      .then((response) => {
        console.log("response", response);

        if (response?.status === 200 && response?.data) {
          const url = window.URL.createObjectURL(new Blob([response?.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute(
            "download",
            `${payload.fileName}${payload.fileType}`,
          );
          const finalFileName = doc.fileName.endsWith(doc.fileType)
            ? doc.fileName
            : `${doc.fileName}${doc.fileType}`;

          link.href = url;
          link.download = finalFileName;
          document.body.appendChild(link);
          link.click();
          dispatch(hideLoader());
        } else {
          console.log("Error during download", response);
          ShowToast("info", "Error downloading file");
        }
      })
      .catch((error) => {
        ShowToast(
          "info",
          error.message || "An error occurred while downloading",
        );
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };
  // 🔥 MAP API TO CLEAN UI STRUCTURE
  console.log(data, kycDocs, "data, kycDoc");

  const mappedData = {
    mobile: data?.mobile,
    email: data?.emailId,
    city: data?.city,
    referral: data?.referralName,

    businessType:
      data?.partnerType === "individual" ? "Individual" : "Proprietorship",

    pan: data?.panNo,
    dob: data?.dob ? new Date(data?.dob).toLocaleDateString("en-GB") : "",
    panName: data?.panNo_Name,
    tradeName: data?.tradeName,
    gstNo: data?.gstNo,

    offAddress1: data?.offAddress1,
    offAddress2: data?.offAddress2,
    offPincode: data?.offPincode,
    offCity: data?.offCity,
    offState: data?.offState,

    resAddress1: data?.resAddress1,
    resAddress2: data?.resAddress2,
    resPincode: data?.resPincode,
    resCity: data?.resCity,
    resState: data?.resState,

    ifscCode: data?.ifsCcode,
    accountNumber: data?.bankAcctNo,
    bankName: data?.bankName,
    bankAddress: data?.bankAddress,

    accountType:
      data?.acctType === "savingAcc" ? "Savings Account" : "Current Account",
  };
  const bankDoc = kycDocs?.find((doc: any) => doc.docID === 7);
  const isDisabled = !bankDoc;
  return (
    <Box>
      {/* ================= CONTACT DETAILS ================= */}
      <Box mb={5}>
        <SectionTitle>Contact Details</SectionTitle>
        <FieldGrid
          fields={[
            { label: "Mobile Number", value: mappedData.mobile },
            { label: "Email ID", value: mappedData.email },
            { label: "City", value: mappedData.city },
            {
              label: "Referral By (Employee Code)",
              value: mappedData.referral,
            },
          ]}
        />
      </Box>

      {/* ================= BUSINESS PARTNER ================= */}
      <Box mb={5}>
        <SectionTitle>Business Partner</SectionTitle>
        <Box display="flex" gap={3}>
          {["Individual", "Proprietorship"].map((type) => (
            <SelectableBox
              key={type}
              label={type}
              selected={mappedData.businessType === type}
            />
          ))}
        </Box>
      </Box>

      {/* ================= PAN DETAILS ================= */}
      <Box mb={5}>
        <SectionTitle>PAN Details</SectionTitle>
        <FieldGrid
          fields={[
            { label: "PAN Number", value: mappedData.pan },
            { label: "DOB / DOI", value: mappedData.dob },
            { label: "Name As Per PAN", value: mappedData.panName },
            { label: "Trade Name", value: mappedData.tradeName },
            { label: "GSTIN (Optional)", value: mappedData.gstNo },
          ]}
        />
      </Box>

      {/* ================= OFFICE ADDRESS ================= */}
      <Box mb={5}>
        <SectionTitle>Office Address</SectionTitle>
        <FieldGrid
          fields={[
            {
              label: "Address Line 1",
              value: mappedData.resAddress1,
              md: 6,
              lg: 6,
            },
            {
              label: "Address Line 2",
              value: mappedData.resAddress2,
              md: 6,
              lg: 6,
            },
            { label: "Pincode", value: mappedData.offPincode },
            { label: "City", value: mappedData.offCity },
            { label: "State", value: mappedData.offState },
          ]}
        />
      </Box>
      {/* ================= Residential ADDRESS ================= */}
      <Box mb={5}>
        <SectionTitle>Residential Address</SectionTitle>
        <FieldGrid
          fields={[
            // { label: "Address Line 1", value: mappedData.resAddress1 },
            // { label: "Address Line 2", value: mappedData.resAddress2 },
            {
              label: "Address Line 1",
              value: mappedData.offAddress1,
              md: 6,
              lg: 6,
            },
            {
              label: "Address Line 2",
              value: mappedData.offAddress2,
              md: 6,
              lg: 6,
            },
            { label: "Pincode", value: mappedData.resPincode },
            { label: "City", value: mappedData.resCity },
            { label: "State", value: mappedData.resState },
          ]}
        />
      </Box>

      {/* ================= BANK DETAILS ================= */}
      <Box mb={2}>
        <SectionTitle>Bank Account Details</SectionTitle>
        <FieldGrid
          fields={[
            { label: "IFSC Code", value: mappedData.ifscCode },
            { label: "Account Number", value: mappedData.accountNumber },
            { label: "Bank Name", value: mappedData.bankName },
            { label: "Bank Address", value: mappedData.bankAddress },
          ]}
        />

        {/* Download Proof */}
        <Box
          mt={2}
          p={1.2}
          display="flex"
          alignItems="center"
          gap={3}
          border="1px solid #D0D5DD"
          borderRadius="12px"
          bgcolor="#fff"
          sx={{ width: "fit-content", opacity: isDisabled ? 0.5 : 1 }}
        >
          <Typography fontSize={14} fontWeight={500}>
            Download Bank Proof
          </Typography>

          <Box
            sx={{
              border: "1px solid",
              borderColor: isDisabled ? "#D0D5DD" : "#11395C",
              borderRadius: 2,
              p: 0.7,
              cursor: isDisabled ? "not-allowed" : "pointer",
              pointerEvents: isDisabled ? "none" : "auto",
              "&:hover": {
                bgcolor: isDisabled ? "transparent" : "#F3F4F6",
              },
            }}
          >
            <DownloadForOfflineIcon
              sx={{
                fontSize: 22,
                color: isDisabled ? "#98A2B3" : "#11395C",
              }}
              onClick={() => {
                if (!isDisabled) {
                  handleCommonDownload(bankDoc);
                }
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* ================= ACCOUNT TYPE ================= */}
      <Box>
        <SectionTitle>Account Type</SectionTitle>
        <Box display="flex" gap={3}>
          {["Savings Account", "Current Account"].map((type) => (
            <SelectableBox
              key={type}
              label={type}
              selected={mappedData.accountType === type}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default BusinessPartnerForm;
