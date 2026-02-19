import React, { useState } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { encryptAES } from "../utils/encryptDecrypt";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface Props {
  fullLink: string;
  field?: string;
  selectedRow?: any;
}

const CopyToClipboardCell: React.FC<Props> = ({
  fullLink,
  field,
  selectedRow,
}) => {
  const [copied, setCopied] = useState(false);
  const [mandateLink, setMandateLink] = useState("");

  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );

  const fallbackCopyTextToClipboard = (text: string) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;

    // Avoid scrolling to bottom and make it invisible
    textarea.style.position = "fixed";
    textarea.style.top = "0";
    textarea.style.left = "0";
    textarea.style.opacity = "0";

    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
      const successful = document.execCommand("copy");
      console.log(
        "Fallback copy command was",
        successful ? "successful" : "unsuccessful"
      );
    } catch (err) {
      console.error("Fallback: Unable to copy", err);
    }

    document.body.removeChild(textarea);
  };

  const handleCopy = () => {
    console.log("testsad", field, selectedRow);
    let textToCopy = field !== "dpMandate" ? fullLink : mandateLink;
    console.log("textToCopy", textToCopy);

    if (field === "dpMandate" || field === "AMC") {
      console.log("clientCode&dP_ID", selectedRow.cc, selectedRow.dP_ID);

      const isMandate = field === "dpMandate";

      if (isMandate) {
        const encryptedCode = encryptAES(selectedRow.cc);
        const safeCode = encodeURIComponent(encryptedCode);
        textToCopy = `${window.location.origin}/DPMandate/${safeCode}`;
        setMandateLink(textToCopy);
        console.log("customLink", textToCopy);
      } else {
        const encryptedBOID = encodeURIComponent(encryptAES(selectedRow.dpid));
        const encryptedUserId = encodeURIComponent(encryptAES(user_id));

        textToCopy = `${window.location.origin}/AMCLink?boid=${encryptedBOID}&user=${encryptedUserId}`;
        setMandateLink(textToCopy);
        console.log("customLink", textToCopy);
      }
    }

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 3000);
        })
        .catch((err) => {
          console.warn("Clipboard API failed, using fallback:", err);
          fallbackCopyTextToClipboard(textToCopy);
          setCopied(true);
          setTimeout(() => setCopied(false), 3000);
        });
    } else {
      fallbackCopyTextToClipboard(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
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
