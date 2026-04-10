import { Box, Button, Typography } from "@mui/material";
import { SectionTitle } from "../../StylingCss";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { documentList } from "../../../../../helper/commmon";

// ================= ROW COMPONENT =================
const DocumentRow = ({ doc, onPreview, onEsign }: any) => {
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
          sx={{
            backgroundColor: "#003366",
            textTransform: "none",
          }}
        >
          eSign
        </Button>
      </Box>
    </Box>
  );
};

// ================= MAIN COMPONENT =================
const Esign = (data: any) => {
  const forceCategories = ["AGREEMENT", "KYC"];
  const summary = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
      ? data.data
      : [];
  console.log(data, "press");
  const allowedCategories = summary
    .map((item: any) => item.exchangeName)
    .filter(
      (name: string) =>
        name &&
        !["Total", "Stamp Paper charges", "Security Deposit"].includes(name),
    );

  // 🔹 Preview Handler
  const handlePreview = (doc: any) => {
    console.log("👁 Preview:", doc);

    const fullPath = `${doc.path}\\${doc.fileName}`;
    console.log("📂 Path:", fullPath);

    // 👉 call preview API here
  };

  // 🔹 eSign Handler
  const handleEsign = (doc: any) => {
    console.log("✍️ eSign:", doc);

    // 👉 call your handleSign logic here
    // Example:
    // handleSign(doc.fileName)
  };

  // 🔹 Group by category (dynamic)
  const groupedDocs = documentList
    .filter(
      (doc) =>
        allowedCategories.includes(doc.category) ||
        forceCategories.includes(doc.category),
    )
    .reduce((acc: any, doc) => {
      if (!acc[doc.category]) acc[doc.category] = [];
      acc[doc.category].push(doc);
      return acc;
    }, {});

  return (
    <Box p={3}>
      <SectionTitle>Preview Documents</SectionTitle>

      {/* Loop Categories */}
      {Object.entries(groupedDocs).map(([category, docs]: any) => (
        <Box key={category} mb={3}>
          {/* Category Title */}
          <Typography
            fontWeight={600}
            mb={1}
            sx={{ borderBottom: "1px solid #ccc", pb: 0.5 }}
          >
            {category}
          </Typography>

          {/* Document List */}
          <Box display="flex" flexDirection="column" gap={1}>
            {docs.map((doc: any) => (
              <DocumentRow
                key={doc.fileName}
                doc={doc}
                onPreview={handlePreview}
                onEsign={handleEsign}
              />
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default Esign;
