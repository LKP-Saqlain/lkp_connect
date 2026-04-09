import React, { useState } from "react";
import { Box, Button, IconButton, TextField, Typography } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";

const PaymentEdit = ({ data, toggle }: any) => {
  const [revised, setRevised] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [commentText, setCommentText] = useState<string>(
    data.processRemarks || "",
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSave = () => {
    const payload = {
      id: data.id,
      revisedAmount: revised,
      file: selectedFile,
      comment: commentText,
    };

    console.log(payload);
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f3f4f6",
        borderRadius: 3,
        p: 4,
        position: "relative",
      }}
    >
      <IconButton
        onClick={toggle}
        sx={{ position: "absolute", top: 16, right: 16 }}
      >
        <CloseIcon />
      </IconButton>

      <Typography fontWeight={600} fontSize={18} mb={3}>
        {data.exchangeName} – {data.segmentName}
      </Typography>

      <Box display="flex" gap={3} mb={3}>
        <Box
          sx={{
            border: "1px solid #ccc",
            borderRadius: 2,
            px: 2,
            py: 1.5,
            backgroundColor: "#fff",
            minWidth: 200,
          }}
        >
          <Typography fontSize={14} color="text.secondary">
            Purposed:
          </Typography>
          <Typography fontWeight={500}>
            {data.amount.toLocaleString("en-IN")}
          </Typography>
        </Box>

        <TextField
          placeholder="Revised"
          value={revised}
          onChange={(e) => setRevised(e.target.value)}
          fullWidth
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              backgroundColor: "#fff",
            },
          }}
        />
      </Box>

      <Typography fontWeight={600} mb={1}>
        Attach Approval Copy Here
      </Typography>

      <Button
        variant="outlined"
        component="label"
        startIcon={<AttachFileIcon />}
        sx={{
          borderRadius: 2,
          textTransform: "none",
          backgroundColor: "#fff",
          mb: 3,
        }}
      >
        Attachment
        <input type="file" hidden onChange={handleFileChange} />
      </Button>

      <TextField
        placeholder="Comment"
        multiline
        rows={5}
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        fullWidth
        sx={{
          mb: 4,
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            backgroundColor: "#fff",
          },
        }}
      />

      <Box display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          sx={{
            borderRadius: 2,
            px: 4,
            textTransform: "none",
            backgroundColor: "#123B5D",
            "&:hover": { backgroundColor: "#0f2f4a" },
          }}
          onClick={handleSave}
        >
          Save & Proceed
        </Button>
      </Box>
    </Box>
  );
};

export default PaymentEdit;
