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

const initialData = [
  { exchange: "NSE", regNo: "123456" },
  { exchange: "BSE", regNo: "45678" },
  { exchange: "MCX", regNo: "142536" },
];

const Certificate = () => {
  const [certificateData, setCertificateData] = useState(initialData);

  // update registration number
  const handleRegChange = (index: any, value: any) => {
    const updated = [...certificateData];
    updated[index].regNo = value;
    setCertificateData(updated);
  };

  // optional handlers for upload/preview
  const handleUpload = (exchange: string) => {
    console.log("Upload for:", exchange);
  };

  const handlePreview = (exchange: string) => {
    console.log("Preview for:", exchange);
  };

  const handleSubmit = () => {
    console.log("Final Data:", certificateData);
    // 👉 send API here
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
            <TableRow sx={{ backgroundColor: "#f9fafb" }}>
              <TableCell sx={{ fontWeight: 600 }}>Exchange</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>
                Registration Number
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Upload Document</TableCell>
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
                  <Box display="flex" alignItems="center" gap={2}>
                    <Typography>Attachment</Typography>

                    <Link
                      component="button"
                      underline="hover"
                      onClick={() => handleUpload(row.exchange)}
                      sx={{ fontSize: 14 }}
                    >
                      Upload
                    </Link>

                    <Link
                      component="button"
                      underline="hover"
                      onClick={() => handlePreview(row.exchange)}
                      sx={{ fontSize: 14 }}
                    >
                      Preview
                    </Link>
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
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default Certificate;
