import DataTable from "../../../UserInfoTable";
import { ParOnbPartnerSharingData } from "../../../../../helper/commmon";
import {
  Box,
  Button,
  Typography,
  Stack,
  Checkbox,
  FormControlLabel,
  Link,
} from "@mui/material";
import { useState } from "react";
import { SectionTitle } from "../../StylingCss";

const PartnerSharing = ({ data }: { data: any }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [rows, setRows] = useState(ParOnbPartnerSharingData);
  console.log(data);

  return (
    <Box>
      {/* Title */}
      <SectionTitle>Brokerage Commercial details</SectionTitle>

      {/* Table */}
      <Box
        sx={{
          backgroundColor: "#ffffff",
          borderRadius: 1,
          overflow: "hidden",
          width: "520px",
        }}
      >
        {/* <Col lg={12}> */}
        <DataTable
          activeSubItem="partnerSharing"
          T6Data={rows}
          setRows={setRows}
          customHide
          selectedWidget="Criteria and Rewards"
          editRowAccess={isEditing}
        />
        {/* </Col> */}
      </Box>

      {/* Edit / Save Buttons (Below Table Left Aligned) */}
      <Stack direction="row" spacing={2} mt={2}>
        <Button
          variant="outlined"
          size="small"
          sx={{
            borderRadius: "20px",
            textTransform: "none",
            px: 3,
          }}
          onClick={() => setIsEditing(true)}
          disabled={isEditing}
        >
          Edit
        </Button>

        <Button
          variant="outlined"
          size="small"
          sx={{
            borderRadius: "20px",
            textTransform: "none",
            px: 3,
          }}
          onClick={() => setIsEditing(false)}
          disabled={!isEditing}
        >
          Save
        </Button>
      </Stack>

      {/* Attach Approval Section */}
      <Box mt={4}>
        <SectionTitle>Attach Approval Copy Here</SectionTitle>

        {/* Attachment 1 */}
        <Stack direction="row" spacing={2} alignItems="center" mb={1}>
          <Button
            variant="outlined"
            component="label"
            size="small"
            sx={{
              borderRadius: "8px",
              width: "220px",
              justifyContent: "flex-start",
              textTransform: "none",
            }}
          >
            📎 Attachment 1
            <input hidden type="file" />
          </Button>

          <Link component="button" underline="hover" fontSize="13px">
            Download
          </Link>
        </Stack>

        {/* Attachment 2 */}
        <Stack direction="row" spacing={2} alignItems="center">
          <Button
            variant="outlined"
            component="label"
            size="small"
            sx={{
              borderRadius: "8px",
              width: "220px",
              justifyContent: "flex-start",
              textTransform: "none",
            }}
          >
            📎 Attachment 2
            <input hidden type="file" />
          </Button>

          <Link component="button" underline="hover" fontSize="13px">
            Download
          </Link>
        </Stack>

        {/* Note */}
        <Typography
          variant="body2"
          sx={{ mt: 2, fontSize: "12px", color: "#555" }}
        >
          Note: No changes will be done without an approval
        </Typography>

        {/* Checkbox */}
        <FormControlLabel
          sx={{ mt: 1 }}
          control={<Checkbox size="small" />}
          label={
            <Typography fontSize="13px">
              I have read all details carefully
            </Typography>
          }
        />
      </Box>
    </Box>
  );
};

export default PartnerSharing;
