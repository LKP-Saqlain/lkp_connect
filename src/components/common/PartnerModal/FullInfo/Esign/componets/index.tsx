import { Box, Button, Typography } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

interface DocumentRowProps {
  doc: any;
  onPreview: (doc: any) => void;
  onEsign: (doc: any) => void;
  isSigned?: any;
}

const DocumentRow = ({
  doc,
  onPreview,
  onEsign,
  isSigned,
}: DocumentRowProps) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      border="1px solid #D0D5DD"
      borderRadius="10px"
      p={1}
      bgcolor="#fff"
    >
      {/* Document Name */}
      <Typography fontSize={14}>{doc.label}</Typography>

      {/* Actions */}
      <Box display="flex" gap={1}>
        {/* Preview */}
        <Button
          variant="outlined"
          size="small"
          onClick={() => onPreview(doc)}
          sx={{
            minWidth: "40px",
            color: "#003366",
            borderColor: "#003366",
            borderRadius: "11px",
          }}
        >
          <VisibilityIcon fontSize="small" />
        </Button>

        {/* eSign */}
        <Button
          variant="contained"
          size="small"
          onClick={() => onEsign(doc)}
          disabled={isSigned}
          sx={{
            backgroundColor: "#003366",
            textTransform: "none",
          }}
        >
          {isSigned ? "Signed" : "eSign"}
        </Button>
      </Box>
    </Box>
  );
};

export default DocumentRow;
