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

const PersonalDetails = ({ data, kycDocs }: any) => {
  if (!data) return null;
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

  const bankDoc = kycDocs?.find((doc: any) => doc.docID === 8);
  const isDisabled = !bankDoc;
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
  const Education = [
    { label: "Graduate", value: "graduate" },
    { label: "Post Graduate", value: "PostGraduate" },
    { label: "12th (HSC)", value: "12HSC" },
    { label: "10th (SSC)", value: "10SSC" },
  ];
  return (
    <Box>
      {/* ================= EDUCATION ================= */}
      <Box mb={5}>
        <SectionTitle>Highest Education Qualification</SectionTitle>
        <Box display="flex" gap={3} flexWrap="wrap">
          {[...Education].map((item) => (
            <SelectableBox
              key={item.value}
              label={item.label}
              selected={mappedData.highestEdu === item.value}
            />
          ))}
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
            Download Nominee ID Proof
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
