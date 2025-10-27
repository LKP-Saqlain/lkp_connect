import { Row, Col, Button } from "reactstrap";
import { useEffect, useState } from "react";
import ShowToast from "../../../utils/toastUtils";
import { apiServices } from "../../../services";

interface ESignProps {
  onPrimarySign?: () => void;
  onSecondarySign?: () => void;
  onThirdSign?: () => void;
  selectedRow: any;
  onNext: () => void;
}
declare const Digio: any;

const ESign = ({ onNext, selectedRow }: ESignProps) => {
  const [isSigning, setIsSigning] = useState(false);
  const [disabledHolders, setDisabledHolders] = useState<{
    [key: string]: boolean;
  }>({});

  // ✅ Trigger onNext when all holders are signed
  useEffect(() => {
    const holderKeys = holders.map((h) => h.key); // Active holders
    const allSigned = holderKeys.every((key) => disabledHolders[key]);

    if (allSigned && holderKeys.length > 0) {
      ShowToast(
        "success",
        "All holders have signed. Proceeding to next step..."
      );
      setTimeout(() => {
        onNext(); // call the next step
      }, 800); // small delay to show toast
    }
  }, [disabledHolders]); // Runs each time a holder signs

  const handleSign = async (holderType: "primary" | "secondary" | "third") => {
    try {
      setIsSigning(true);
      ShowToast("info", `Initiating ${holderType} holder signing...`);

      let apiFunc;
      if (holderType === "primary")
        apiFunc = apiServices.SendFirstHolderSignature;
      else if (holderType === "secondary")
        apiFunc = apiServices.SendSecondHolderSignature;
      else apiFunc = apiServices.SendThirdHolderSignature;

      const response = await apiFunc({
        dpid: selectedRow?.dP_ID,
        // dpid: "1203000001123371",
        // dpid: "1203000001078403", //Msir
      });
      const data = response?.data?.clsUploadPDFResponse;

      if (!data?.id || !data?.access_token?.id) {
        ShowToast("error", "Invalid response from signature API");
        setIsSigning(false);
        return;
      }

      const documentId = data.id;
      const signerIdentifier = data.signing_parties?.[0]?.identifier;
      const accessToken = data.access_token.id;
      const fileName = data.file_name;
      const logoUrl =
        "https://www.lkpsec.com/App_Themes/images/webp/LKP--Final--Logo-New-2021-D2.webp";

      const options = {
        environment: "production",
        callback: async function (resp: any) {
          if (resp?.error_code) {
            ShowToast("error", "Signing failed  ");
            setIsSigning(false);
            return;
          }

          ShowToast("success", "Signing completed successfully");
          console.log(resp, " from digio");
          setDisabledHolders((prev) => ({ ...prev, [holderType]: true }));
          await downloadSignedPdf(documentId, fileName);
        },
        logo: logoUrl,
        theme: { primaryColor: "#07152B", secondaryColor: "#000000" },
      };

      const digio = new Digio(options);
      digio.init();
      digio.submit(documentId, signerIdentifier, accessToken);
    } catch (err) {
      ShowToast("error", "Error during signing process");
    } finally {
      setIsSigning(false);
    }
  };

  const downloadSignedPdf = async (documentId: string, fileName: string) => {
    console.log("check before downloadSignedPdf");
    try {
      const payload = {
        id: documentId,
        name: fileName,
      };
      console.log(payload, "payload downloadSignedPdf");
      const response = await apiServices.DownloadSignedPdf(payload); // API call
      console.log(response, "response from downloadSignedPdf");
      if (response?.status == 200) {
        console.log("success", "PDF Downloaded Successfully!");
      } else {
        ShowToast("error", response?.data?.message || "Failed to download PDF");
      }
    } catch (error) {
      console.warn(error);
    }
  };

  const holders = [
    {
      name: selectedRow?.primary_Holder,
      type: "Primary Holder",
      action: () => handleSign("primary"),
      key: "primary",
    },
    {
      name: selectedRow?.secondary_Holder_Name,
      type: "Second Holder",
      action: () => handleSign("secondary"),
      key: "secondary",
    },
    {
      name: selectedRow?.third_Holder_Name,
      type: "Third Holder",
      action: () => handleSign("third"),
      key: "third",
    },
  ].filter((holder) => holder.name?.trim());

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <Row className="justify-content-center">
        {holders.map((holder, idx) => (
          <Col
            key={idx}
            md="4"
            sm="6"
            xs="12"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: "2rem",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                border: "2px solid #1c3c6b",
                borderRadius: "50%",
                marginBottom: "1rem",
              }}
            ></div>

            <p
              style={{
                marginBottom: "0.25rem",
                fontWeight: 500,
                color: "#000",
              }}
            >
              {holder.name}
            </p>
            <p
              style={{
                marginBottom: "1rem",
                color: "#1c3c6b",
                fontWeight: 600,
              }}
            >
              {holder.type}
            </p>

            <Button
              color="primary"
              style={{
                backgroundColor: "#003366",
                border: "none",
                borderRadius: "6px",
                padding: "0.5rem 1.5rem",
              }}
              onClick={holder.action}
              disabled={isSigning || disabledHolders[holder.key]}
            >
              {disabledHolders[holder.key] ? "Signed" : "Proceed to eSign"}
            </Button>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ESign;
