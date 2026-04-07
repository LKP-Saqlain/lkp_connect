import { Box, Typography } from "@mui/material";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { SectionTitle } from "../../StylingCss";

const REQUIRED_DOCS = [
  "Pan Card",
  "Residence Address",
  "Office Address",
  "Educational Qualification",
  "Occupation Proof",
  "GSTIN Certificate",
];

const KycVerification = ({ data }: { data: any[] }) => {
  // Map API docs by name for quick lookup
  const docMap: Record<string, any> = {};
  data?.forEach((doc) => {
    docMap[doc.docName] = doc;
  });

  const handleDownload = (doc: any) => {
    console.log("Download:", doc);
    // call download API here
  };

  return (
    <Box pb={3}>
      {/* ================= KYC DOCUMENTS ================= */}
      <SectionTitle>KYC Document</SectionTitle>

      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Typography
          sx={{
            color: "#1F5A96",
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 500,
            textDecoration: "underline",
          }}
        >
          Download All Document
        </Typography>
      </Box>

      <Box display="flex" flexDirection="column" gap={2}>
        {REQUIRED_DOCS.map((docName) => {
          const doc = docMap[docName];
          const isUploaded = !!doc;

          return (
            <Box
              key={docName}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              p={1}
              border="1px solid #D0D5DD"
              borderRadius="12px"
              bgcolor="#fff"
            >
              {/* Left Section */}
              <Box display="flex" alignItems="center" gap={2}>
                <Typography fontWeight={500}>{docName}</Typography>

                {isUploaded ? (
                  <Box display="flex" alignItems="center" gap={1}>
                    <CheckCircleIcon sx={{ color: "#1f9647", fontSize: 20 }} />
                    <Typography fontSize={13} color="#1f9647">
                      Uploaded
                    </Typography>
                  </Box>
                ) : (
                  <Typography fontSize={13} color="#E02424">
                    Not Uploaded
                  </Typography>
                )}
              </Box>

              {/* Right Section */}
              <Box display="flex" gap={2}>
                <Box
                  onClick={() => isUploaded && handleDownload(doc)}
                  sx={{
                    border: "1px solid #1F5A96",
                    borderRadius: 2,
                    p: 0.5,
                    cursor: isUploaded ? "pointer" : "not-allowed",
                    opacity: isUploaded ? 1 : 0.4,
                  }}
                >
                  <DownloadForOfflineIcon sx={{ color: "#1F5A96" }} />
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* ================= IPV SECTION ================= */}
      <Box mt={6}>
        <SectionTitle>IPV (with Geo tagging)</SectionTitle>

        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          p={2}
          border="1px solid #D0D5DD"
          borderRadius="12px"
          bgcolor="#fff"
        >
          <Typography fontWeight={500}>IPV (In Person Verification)</Typography>

          <Box
            sx={{
              width: 18,
              height: 18,
              border: "1px solid #1F5A96",
              borderRadius: 1,
              backgroundColor: "#1F5A96",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default KycVerification;
