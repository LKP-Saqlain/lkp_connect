import React, { useState } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

interface Props {
  fullLink: string;
}

const CopyToClipboardCell: React.FC<Props> = ({ fullLink }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      console.error("Clipboard API not supported");
      return;
    }

    navigator.clipboard
      .writeText(fullLink)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      })
      .catch((err) => {
        console.error("Copy failed:", err);
      });
  };

  return copied ? (
    <span style={{ color: "#11395C", fontSize: "13px" }}>Copied!</span>
  ) : (
    <ContentCopyIcon
      fontSize="small"
      style={{ color: "#11395C", cursor: "pointer" }}
      onClick={handleCopy}
      titleAccess="Copy to clipboard"
    />
  );
};

export default CopyToClipboardCell;
