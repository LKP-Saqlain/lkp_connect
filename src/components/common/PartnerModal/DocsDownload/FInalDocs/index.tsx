import { Box, Button, Typography, Paper, Divider, Chip } from "@mui/material";
import { SectionTitle } from "../../StylingCss";
import DownloadIcon from "@mui/icons-material/Download";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { useEffect, useMemo, useState } from "react";
import {
  hideLoader,
  showLoader,
} from "../../../../../redux/slices/loaderSlice";
import { apiServices } from "../../../../../services";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../../redux/store";
import { handleCommonDownload } from "../../../../../utils";

const FinalDocs = ({ ApplNo }: any) => {
  const [data, setData] = useState<any[]>([]);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!ApplNo) return;
    const fetchDocs = async () => {
      const payload = {
        applNo: String(ApplNo),
        signerType: "compliancedoc",
      };

      dispatch(showLoader("Fetching Documents..."));

      try {
        const response = await apiServices.GetEsignDocument(payload);

        const filteredData = (response?.data?.data || []).map(
          (item: any, i: number) => ({
            id: i + 1,
            ...item,
          }),
        );

        setData(filteredData);
      } catch (error) {
        console.error("Error fetching details:", error);
      } finally {
        dispatch(hideLoader());
      }
    };

    fetchDocs();
  }, [ApplNo]);

  // ================= GROUP DOCS =================
  const groupedDocs = useMemo(() => {
    const grouped: Record<string, any[]> = {};

    data.forEach((doc: any) => {
      if (!grouped[doc.exchangeName]) {
        grouped[doc.exchangeName] = [];
      }

      grouped[doc.exchangeName].push({
        ...doc,
        label: doc.headerName,
      });
    });

    return grouped;
  }, [data]);

  const DocumentDownload = (doc: any) => {
    const fullPath = doc.filePath;
    // Get filename
    const fileNameWithExt = fullPath.split("\\").pop() || "";
    // Remove extension
    const fileName = fileNameWithExt.replace(/\.[^/.]+$/, "");
    // Get extension
    const fileType = "." + fileNameWithExt.split(".").pop();
    // Get folder path
    const filePath = fullPath.substring(0, fullPath.lastIndexOf("\\") + 1);

    const payload = {
      fileName,
      filePath,
      fileType,
      dispatch,
    };
    console.log(payload, "payload for download");
    handleCommonDownload(payload);
  };

  return (
    <Box>
      <SectionTitle>Preview Documents</SectionTitle>

      {/* EMPTY STATE */}
      {Object.keys(groupedDocs).length === 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: "center",
            border: "1px dashed #cbd5e1",
            borderRadius: 3,
            bgcolor: "#fafafa",
          }}
        >
          <InsertDriveFileIcon sx={{ fontSize: 50, color: "#94a3b8", mb: 1 }} />

          <Typography fontWeight={600} color="#475569">
            No documents found
          </Typography>
        </Paper>
      )}

      {/* GROUPS */}
      {Object.entries(groupedDocs).map(([category, docs]: any) => (
        <Paper
          key={category}
          elevation={0}
          sx={{
            mb: 3,
            borderRadius: 3,
            border: "1px solid #e2e8f0",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <Box
            px={2}
            py={1.5}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            bgcolor="#f8fafc"
          >
            <Typography fontWeight={700} color="#0f172a">
              {category}
            </Typography>

            <Chip
              label={`${docs.length} Docs`}
              size="small"
              sx={{
                bgcolor: "#dbeafe",
                color: "#1d4ed8",
                fontWeight: 600,
              }}
            />
          </Box>

          <Divider />

          {/* Docs */}
          <Box p={2} display="flex" flexDirection="column" gap={1.5}>
            {docs.map((doc: any) => (
              <Box
                key={doc.id}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                border="1px solid #e2e8f0"
                borderRadius="12px"
                p={1.5}
                bgcolor="#fff"
                sx={{
                  transition: "0.2s ease",
                  "&:hover": {
                    borderColor: "#94a3b8",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                  },
                }}
              >
                {/* Left */}
                <Box display="flex" alignItems="center" gap={1.5}>
                  <InsertDriveFileIcon
                    sx={{
                      color: "#1e3a8a",
                      fontSize: 22,
                    }}
                  />

                  <Typography fontSize={14} fontWeight={500} color="#1e293b">
                    {doc.label}
                  </Typography>
                </Box>

                {/* Actions */}
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    DocumentDownload(doc);
                    console.log("Preview:", doc);
                  }}
                  startIcon={<DownloadIcon />}
                  sx={{
                    color: "#003366",
                    borderColor: "#003366",
                    borderRadius: "10px",
                    textTransform: "none",
                    px: 2,
                    "&:hover": {
                      background: "#eff6ff",
                      borderColor: "#003366",
                    },
                  }}
                >
                  Download
                </Button>
              </Box>
            ))}
          </Box>
        </Paper>
      ))}

      {/* SUBMIT */}
      {/* <Box
        mt={4}
        display="flex"
        justifyContent="flex-end"
        position="sticky"
        bottom={0}
        bgcolor="#fff"
        pt={2}
      >
        <Button
          variant="contained"
          onClick={() => {}}
          sx={{
            background: "#b0b0b0",
            textTransform: "none",
            borderRadius: 2,
            px: 5,
            height: 42,
            fontWeight: 600,
            boxShadow: "none",

            "&:hover": {
              background: "#174876",
            },

            "&.Mui-disabled": {
              background: "#d3d3d3",
              color: "#777",
            },
          }}
        >
          Submit
        </Button>
      </Box> */}
    </Box>
  );
};

export default FinalDocs;
