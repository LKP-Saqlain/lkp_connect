import { Box, Typography } from "@mui/material";
import { SectionTitle } from "../../StylingCss";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const fields = [
  "Business Profile",
  "Personal Details",
  "KYC Document",
  "Infrastructure details",
  "Segments",
];

const iscompleted = ["KYC Document", "Infrastructure details"];

const Action = () => {
  return (
    <Box pb={3}>
      {/* ================= Action ================= */}
      <SectionTitle>Action</SectionTitle>
      <Box display="flex" flexDirection="column" gap={2}>
        {fields.map((Fname) => {
          const isCompleted = iscompleted.includes(Fname);
          return (
            <Box
              key={Fname}
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
                <Typography fontWeight={500}>{Fname}</Typography>
              </Box>

              {/* Right Section */}
              <Box display="flex" gap={2}>
                <Box>
                  {isCompleted ? (
                    <Box display="flex" alignItems="center" gap={1}>
                      <CheckCircleIcon
                        sx={{ color: "#1f9647", fontSize: 30 }}
                      />
                    </Box>
                  ) : (
                    <CancelIcon sx={{ color: "#E02424", fontSize: 30 }} />
                  )}
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default Action;
