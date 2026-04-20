import { Box } from "@mui/material";
import { FieldGrid, SectionTitle, SelectableBox } from "../../StylingCss";

/* ================= MAIN COMPONENT ================= */

const BusinessPartnerForm = ({ data }: any) => {
  // 🔥 MAP API TO CLEAN UI STRUCTURE
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
            { label: "Address Line 1", value: mappedData.offAddress1 },
            { label: "Address Line 2", value: mappedData.offAddress2 },
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
            { label: "Address Line 1", value: mappedData.resAddress1 },
            { label: "Address Line 2", value: mappedData.resAddress2 },
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
        {/* <Box
          mt={2}
          p={1.2}
          display="flex"
          alignItems="center"
          gap={3}
          border="1px solid #D0D5DD"
          borderRadius="12px"
          bgcolor="#fff"
          sx={{ width: "fit-content" }}
        >
          <Typography fontSize={14} fontWeight={500}>
            Download Bank Proof
          </Typography>

          <Box
            sx={{
              border: "1px solid #11395C",
              borderRadius: 2,
              p: 0.7,
              cursor: "pointer",
              "&:hover": { bgcolor: "#F3F4F6" },
            }}
          >
            <DownloadForOfflineIcon sx={{ fontSize: 22, color: "#11395C" }} />
          </Box> */}
        {/* </Box> */}
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
