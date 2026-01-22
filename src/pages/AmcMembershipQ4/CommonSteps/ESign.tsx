import { Row, Col, Button } from "reactstrap";
import { useEffect, useState } from "react";
import ShowToast from "../../../utils/toastUtils";
import { apiServices } from "../../../services";
import { Avatar } from "rsuite";

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
  const [signCount, setSignCount] = useState<number>(0); // ✅

  // ✅ Trigger onNext when all holders are signed
  // useEffect(() => {
  //   const holderKeys = holders.map((h) => h.key); // Active holders
  //   const allSigned = holderKeys.every((key) => disabledHolders[key]);

  //   if (allSigned && holderKeys.length > 0) {
  //     ShowToast(
  //       "success",
  //       "All holders have signed. Proceeding to next step..."
  //     );
  //     setTimeout(() => {
  //       onNext(); // call the next step
  //       sendFinalEmail();
  //     }, 1000); // small delay to show toast
  //   }
  // }, [disabledHolders]); // Runs each time a holder signs

  useEffect(() => {
    const totalHolders = holders.length;
    if (signCount === totalHolders && totalHolders > 0) {
      ShowToast(
        "success",
        "All holders have signed. Proceeding to next step..."
      );
      setTimeout(() => {
        sendFinalEmail();
        onNext();
      }, 1000);
    }
  }, [signCount]);

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
        dpid: selectedRow?.dpid,
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
          setSignCount((prevCount) => prevCount + 1);
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

  const sendFinalEmail = async () => {
    console.log("check before downloadSignedPdf");
    try {
      const payload = {
        dpid: selectedRow?.dpid,
        maxStage: signCount,
      };

      const response = await apiServices.SendFinalSignedMail(payload);
      console.log(response, "response from downloadSignedPdf");
      if (response?.data?.success == true) {
        ShowToast("success", response?.data?.message);
        console.log("success", "Email sent succesfully", response);
      } else {
        console.log("Failure", "Email NOT sent succesfully", response);
      }
    } catch (error) {
      console.warn(error);
    }
  };

  const holders = [
    {
      name: selectedRow?.ph1,
      type: "Primary Holder",
      action: () => handleSign("primary"),
      key: "primary",
    },
    {
      name: selectedRow?.ph2,
      type: "Second Holder",
      action: () => handleSign("secondary"),
      key: "secondary",
    },
    {
      name: selectedRow?.ph3,
      type: "Third Holder",
      action: () => handleSign("third"),
      key: "third",
    },
  ]
    .filter((holder) => holder.name?.trim())
    .map((holder) => ({
      ...holder,
      firstLetter: holder.name.charAt(0).toUpperCase(),
    }));

  return (
    <div
      style={{
        padding: "2rem",
        textAlign: "center",
        minHeight: "60vh",
        minWidth: "70vw",
        fontSize: "21px",
      }}
    >
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
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1rem",
                overflow: "hidden", // ensures avatar stays inside circle
              }}
            >
              <Avatar
                src="/static/images/avatar/2.jpg"
                style={{
                  width: "81px",
                  height: "81px",
                  backgroundColor: "#284c6c",
                  fontSize: "34px",
                  color: "#fff",
                }}
              >
                {holder.firstLetter}
              </Avatar>
            </div>

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
              onClick={() => {
                const shouldDisable =
                  isSigning ||
                  disabledHolders[holder.key] ||
                  (idx > 0 && !disabledHolders[holders[idx - 1].key]);

                if (!shouldDisable) holder.action(); // ✅ only call if active
              }}
              style={{
                backgroundColor:
                  isSigning ||
                  disabledHolders[holder.key] ||
                  (idx > 0 && !disabledHolders[holders[idx - 1].key])
                    ? "#d3d3d3"
                    : "#003366",
                color:
                  isSigning ||
                  disabledHolders[holder.key] ||
                  (idx > 0 && !disabledHolders[holders[idx - 1].key])
                    ? "#000"
                    : "#fff",
                border: "none",
                borderRadius: "6px",
                padding: "0.3rem 1.5rem",
                cursor:
                  isSigning ||
                  disabledHolders[holder.key] ||
                  (idx > 0 && !disabledHolders[holders[idx - 1].key])
                    ? "not-allowed"
                    : "pointer",
                transition: "all 0.3s ease",
              }}
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
