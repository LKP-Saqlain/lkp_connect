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
        borderRadius: 3,
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={3}
      >
        <Typography fontWeight={600} fontSize={18}>
          {data.exchangeName}
        </Typography>

        <IconButton onClick={toggle}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box display="flex" gap={3} mb={3}>
        {/* Proposed */}
        <Box
          sx={{
            border: "1px solid #D0D5DD",
            borderRadius: 2,
            p: 1,
            backgroundColor: "#e7e7e7",
            minWidth: 220,
          }}
        >
          <Typography fontSize={13} color="text.secondary">
            Proposed
          </Typography>
          <Typography fontWeight={600} fontSize={16}>
            ₹ {data?.total?.toLocaleString("en-IN")}
          </Typography>
        </Box>

        {/* Revised */}
        <Box
          sx={{
            border: "1px solid #D0D5DD",
            borderRadius: 2,
            p: 1,
            backgroundColor: "#fff",
            minWidth: 220,
            flex: 1,
          }}
        >
          <Typography fontSize={13} color="text.secondary" mb={0.5}>
            Revised
          </Typography>

          <TextField
            variant="standard"
            type="number"
            value={revised}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, "");
              setRevised(value);
            }}
            fullWidth
            InputProps={{
              disableUnderline: true,
              inputProps: {
                inputMode: "numeric",
                pattern: "[0-9]*",
              },
            }}
            sx={{
              "& input": {
                fontWeight: 600,
                fontSize: 16,
                padding: 0,
              },
            }}
          />
        </Box>
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
        rows={3}
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
