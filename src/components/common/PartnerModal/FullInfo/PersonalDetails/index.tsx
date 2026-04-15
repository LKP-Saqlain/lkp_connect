import { Box } from "@mui/material";
import { FieldGrid, SectionTitle, SelectableBox } from "../../StylingCss";

const PersonalDetails = ({ data }: { data: any }) => {
  if (!data) return null;

  // 🔥 Safe mapping
  const mappedData = {
    highestEdu: data.highestEdu || "",
    gender: data.gender || "",
    martialStatus: data.martialStatus || "",
    familyMemberRelation: data.familyMemberRelation || "",
    familyMemberName: data.familyMemberName || "",

    nomineeName: data.nomineeName || "",
    nomineeMobileNo: data.nomineeMobileNo || "",
    nomineeRelation: data.nomineeRelation || "",
    nomineeDob: data.nomineeDob
      ? new Date(data.nomineeDob).toLocaleDateString("en-GB")
      : "",

    isCaseflag: data.isCaseflag === "Y" ? "Yes" : "No",
    caseRemark: data.caseRemark || "",

    isPEPFlag: data.isPEPFlag === "Y" ? "Yes" : "No",

    apActiveBroker: data.apActive_Broker === "N" ? "Yes" : "No",
  };

  return (
    <Box>
      {/* ================= EDUCATION ================= */}
      <Box mb={5}>
        <SectionTitle>Highest Education Qualification</SectionTitle>
        <Box display="flex" gap={3} flexWrap="wrap">
          {["Graduate", "Post Graduate", "12th (HSC)", "10th (SSC)"].map(
            (edu) => (
              <SelectableBox
                key={edu}
                label={edu}
                selected={
                  mappedData.highestEdu.toLowerCase() === edu.toLowerCase()
                }
              />
            ),
          )}
        </Box>
      </Box>

      {/* ================= PERSONAL INFORMATION ================= */}
      <Box mb={5}>
        <SectionTitle>Personal Information</SectionTitle>

        <Box display="flex" gap={6} flexWrap="wrap" alignItems="flex-start">
          {/* GENDER */}
          <Box minWidth={280}>
            <Box mb={1} fontWeight={500}>
              Gender
            </Box>
            <Box display="flex" gap={2}>
              {["Male", "Female", "Transgender"].map((gender) => (
                <SelectableBox
                  key={gender}
                  label={gender}
                  selected={
                    mappedData.gender?.toLowerCase() === gender.toLowerCase()
                  }
                />
              ))}
            </Box>
          </Box>

          {/* MARITAL STATUS */}
          <Box minWidth={320}>
            <Box mb={1} fontWeight={500}>
              Marital Status
            </Box>
            <Box display="flex" gap={2} flexWrap="wrap">
              {["Unmarried", "Married", "Divorced"].map((status) => (
                <SelectableBox
                  key={status}
                  label={status}
                  selected={
                    mappedData.martialStatus?.toLowerCase() ===
                    status.toLowerCase()
                  }
                />
              ))}
            </Box>
          </Box>
        </Box>

        {/* Father / Spouse Name (Only If Exists) */}
        {mappedData.familyMemberName && (
          <Box mt={3}>
            <FieldGrid
              fields={[
                {
                  label: "Father / Spouse Name",
                  value: mappedData.familyMemberName,
                },
              ]}
            />
          </Box>
        )}
      </Box>

      {/* ================= NOMINEE ================= */}
      <Box mb={5}>
        <SectionTitle>Add Nominee (Optional)</SectionTitle>

        <FieldGrid
          fields={[
            { label: "Nominee Name", value: mappedData.nomineeName },
            {
              label: "Nominee Mobile Number",
              value: mappedData.nomineeMobileNo,
            },
            {
              label: "Nominee Relation",
              value: mappedData.nomineeRelation,
            },
            { label: "Nominee DOB", value: mappedData.nomineeDob },
          ]}
        />
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
            Download Nominee ID Proof
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
          </Box>
        </Box> */}
      </Box>

      {/* ================= COMPLIANCE DECLARATIONS ================= */}
      <Box>
        <SectionTitle>Compliance Declarations</SectionTitle>

        <Box display="flex" gap={4} flexWrap="wrap" alignItems="flex-start">
          {/* CASE */}
          <Box minWidth={280}>
            <Box mb={1} fontWeight={500}>
              Any case / claim pending?
            </Box>
            <Box display="flex" gap={2}>
              {["Yes", "No"].map((option) => (
                <SelectableBox
                  key={option}
                  label={option}
                  selected={mappedData.isCaseflag === option}
                />
              ))}
            </Box>
          </Box>

          {/* PEP */}
          <Box minWidth={220}>
            <Box mb={1} fontWeight={500}>
              Politically Exposed Person (PEP)
            </Box>
            <Box display="flex" gap={2}>
              {["Yes", "No"].map((option) => (
                <SelectableBox
                  key={option}
                  label={option}
                  selected={mappedData.isPEPFlag === option}
                />
              ))}
            </Box>
          </Box>

          {/* ACTIVE BROKER */}
          <Box minWidth={280}>
            <Box mb={1} fontWeight={500}>
              Active with another broker?
            </Box>
            <Box display="flex" gap={2}>
              {["Yes", "No"].map((option) => (
                <SelectableBox
                  key={option}
                  label={option}
                  selected={mappedData.apActiveBroker === option}
                />
              ))}
            </Box>
          </Box>
        </Box>

        {/* Show Case Remark Below If Yes */}
        {mappedData.isCaseflag === "Yes" && mappedData.caseRemark && (
          <Box mt={3}>
            <FieldGrid
              fields={[
                {
                  label: "Case Clarification",
                  value: mappedData.caseRemark,
                },
              ]}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PersonalDetails;
