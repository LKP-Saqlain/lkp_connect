import { Box, Typography } from "@mui/material";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { SectionTitle } from "../../StylingCss";
import {
  hideLoader,
  showLoader,
} from "../../../../../redux/slices/loaderSlice";
import ShowToast from "../../../../../utils/toastUtils";
import { apiServices } from "../../../../../services";
import { AppDispatch } from "../../../../../redux/store";
import { useDispatch } from "react-redux";

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
  const dispatch = useDispatch<AppDispatch>();

  const handleDownload = async (doc: any) => {
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
  const ipvDoc = data?.find((doc) => doc.docID === 9);
  const isIpvUploaded = !!ipvDoc;
  return (
    <Box pb={3}>
      {/* ================= KYC DOCUMENTS ================= */}
      <SectionTitle>KYC Document</SectionTitle>

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
              sx={{
                opacity: isUploaded ? 1 : 0.6,
                cursor: isUploaded ? "pointer" : "not-allowed",
              }}
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
                  <></>
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
      <Box mt={4}>
        <SectionTitle>IPV (with Geo tagging)</SectionTitle>

        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          p={1}
          border="1px solid #D0D5DD"
          borderRadius="12px"
          bgcolor="#fff"
          sx={{
            opacity: isIpvUploaded ? 1 : 0.6,
            cursor: isIpvUploaded ? "pointer" : "not-allowed",
          }}
        >
          {/* Left */}
          <Box display="flex" alignItems="center" gap={2}>
            <Typography fontWeight={500}>
              IPV (In Person Verification)
            </Typography>

            {isIpvUploaded ? (
              <Box display="flex" alignItems="center" gap={1}>
                <CheckCircleIcon sx={{ color: "#1f9647", fontSize: 20 }} />
                <Typography fontSize={13} color="#1f9647">
                  Uploaded
                </Typography>
              </Box>
            ) : (
              <></>
            )}
          </Box>

          {/* Download Button */}
          <Box
            onClick={() => isIpvUploaded && handleDownload(ipvDoc)}
            sx={{
              border: "1px solid #1F5A96",
              borderRadius: 2,
              p: 0.5,
            }}
          >
            <DownloadForOfflineIcon sx={{ color: "#1F5A96" }} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default KycVerification;
