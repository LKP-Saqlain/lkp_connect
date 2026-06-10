import { useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Link,
} from "@mui/material";
import { AppDispatch, RootState } from "../../../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  hideLoader,
  showLoader,
} from "../../../../../redux/slices/loaderSlice";
import { apiServices } from "../../../../../services";
import { convertToBase64 } from "../../../../../helper/method";
import { handleCommonDownload } from "../../../../../utils";

const initialData = [
  { exchange: "NSE", regNo: "", docId: 15, fileName: "" },
  { exchange: "BSE", regNo: "", docId: 16, fileName: "" },
  { exchange: "MCX", regNo: "", docId: 17, fileName: "" },
];

const Certificate = ({ ApplNo }: any) => {
  const [certificateData, setCertificateData] = useState(initialData);
  const dispatch = useDispatch<AppDispatch>();
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data,
  );

  const handleRegChange = (index: any, value: any) => {
    const updated = [...certificateData];
    updated[index].regNo = value;
    setCertificateData(updated);
  };

  const handleSubmit = () => {
    console.log("Final Data:", certificateData);
  };

  const handleUploadCertificate = async (
    row: any,
    file: any, // you can replace later with actual file from input
  ) => {
    const base64File = await convertToBase64(file);
    const fullName = file?.name || "";

    const fileName = fullName.substring(0, fullName.lastIndexOf("."));
    const fileType = "." + fullName.split(".").pop();

    const payload = {
      user_id: user_id,
      applNo: ApplNo,
      docId: row.docId,
      fileName: fileName,
      fileType: fileType,
      contentType: base64File,
    };

    console.log(payload, "UploadExchangeCertificate payload:");

    dispatch(showLoader("Uploading Certificate..."));
    console.log("UploadExchangeCertificate payload:", payload);

    try {
      const response = await apiServices.UploadExchangeCertificate(payload);

      console.log("Upload response:", response?.data);

      setCertificateData((prev) =>
        prev.map((item) =>
          item.docId === row.docId
            ? {
                ...item,
                fileName: `${fileName}${fileType}`,
              }
            : item,
        ),
      );
    } catch (error) {
      console.error("Error uploading certificate:", error);
    } finally {
      dispatch(hideLoader());
    }
  };
  const handlePreview = (row: any) => {
    if (!row.fileName) return;

    const fileName = row.fileName.substring(0, row.fileName.lastIndexOf("."));

    const fileType = "." + row.fileName.split(".").pop();

    const basePath = "\\\\172.17.100.60\\d$\\FileUpload\\PartnerOnBoarding";

    const filePath = `${basePath}\\${ApplNo}`;

    const payload = {
      fileName,
      filePath,
      fileType,
      dispatch,
    };

    console.log(payload, "payload for preview");

    handleCommonDownload(payload);
  };

  return (
    <Box pb={3}>
      {/* Title */}
      <Typography fontWeight={600} fontSize={18} mb={3}>
        Exchange Certificates
      </Typography>

      {/* Table */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 2,
          boxShadow: "none",
          border: "1px solid #dcdcdc",
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#e8f2ff" }}>
              <TableCell sx={{ fontWeight: 700 }}>Exchange</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>
                Registration Number
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Document Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {certificateData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.exchange}</TableCell>

                {/* Editable registration number */}
                <TableCell>
                  <TextField
                    size="small"
                    value={row.regNo}
                    onChange={(e) => handleRegChange(index, e.target.value)}
                  />
                </TableCell>

                <TableCell>
                  <Box display="flex" alignItems="flex-start" gap={2}>
                    <Typography>Attachment</Typography>

                    <input
                      type="file"
                      hidden
                      id={`file-${index}`}
                      onChange={(e) =>
                        handleUploadCertificate(row, e.target.files?.[0])
                      }
                    />

                    <label htmlFor={`file-${index}`}>
                      <Typography
                        component="span"
                        sx={{
                          fontSize: 14,
                          color: "#1976d2",
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                      >
                        Upload
                      </Typography>
                    </label>

                    {row.fileName && (
                      <Link
                        component="button"
                        underline="hover"
                        onClick={() => handlePreview(row)}
                        sx={{ fontSize: 14 }}
                      >
                        Preview
                      </Link>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Submit Button */}
      <Box mt={4}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            backgroundColor: "#123B5D",
            borderRadius: 2,
            px: 5,
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#0f2f4a",
            },
          }}
          disabled={certificateData.some(
            (item) => !item.regNo || !item.fileName,
          )} // Disable if any regNo or fileName is missing
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default Certificate;
