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
  Link,
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";

const certificateData = [
  { exchange: "NSE", regNo: "123456" },
  { exchange: "BSE", regNo: "45678" },
  { exchange: "MCX", regNo: "142536" },
];

const Certificate = () => {
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
                <TableCell>{row.regNo}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={2}>
                    <AttachFileIcon fontSize="small" />
                    <Typography>Attachment</Typography>

                    <Link
                      component="button"
                      underline="hover"
                      sx={{ fontSize: 14 }}
                    >
                      Upload
                    </Link>

                    <Link
                      component="button"
                      underline="hover"
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
