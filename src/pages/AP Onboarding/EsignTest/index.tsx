import { Button } from "reactstrap";
import ShowToast from "../../../utils/toastUtils";
import { apiServices } from "../../../services";
import { showLoader } from "../../../redux/slices/loaderSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";

declare const Digio: any;

const TestESign = () => {
  //   const [step, setStep] = useState(1);
  //   const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const handleSign = async (holderType: "primary" | "secondary" | "third") => {
    try {
      ShowToast("info", `Initiating ${holderType} holder signing...`);
      let apiFunc;
      let payload: any = {
        applNo: "10007",
      };

      // 🔥 Decide API + payload
      if (holderType === "primary") {
        apiFunc = apiServices.EsignAP_NSE;
        payload.templateName = "NSE_Annexure-2.html";
      } else if (holderType === "secondary") {
        apiFunc = apiServices.EsignAP_NSE;
        payload.templateName = "NSE_Tradingmem&AuthpersonAgree .html";
      } else {
        apiFunc = apiServices.EsignLKP_NSE;
        payload.sourceFile =
          "10007_NSE_Tradingmem&AuthpersonAgree _AP_Signed.pdf"; // ✅ fixed space
      }
      const response = await apiFunc(payload);

      const data = response?.data?.digioResponse?.clsUploadPDFResponse;
      console.log(
        data,
        "ddd",
        response?.data?.digioResponse?.clsUploadPDFResponse,
      );

      if (!data?.id || !data?.access_token?.id) {
        ShowToast("error", "Invalid response from signature API");
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
            // setIsSigning(false);
            return;
          }

          ShowToast("success", "Signing completed successfully");
          console.log(resp, " from digio");
          //   setDisabledHolders((prev) => ({ ...prev, [holderType]: true }));
          //   setSignCount((prevCount) => prevCount + 1);
          //   await downloadSignedPdf(documentId, fileName);
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
      //   setIsSigning(false);
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

  //  CORE DIGIO FUNCTION (same as your handleSign logic)

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h2>eSign Test Flow</h2>

      <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
        <Button
          //   disabled={step !== 1 || loading}
          onClick={() => handleSign("primary")}
        >
          Step 1 - Annexure
        </Button>

        <Button onClick={() => handleSign("secondary")}>
          Step 2 - Agreement
        </Button>

        <Button onClick={() => handleSign("third")}>
          Step 3 - Final Submit
        </Button>
      </div>
    </div>
  );
};

export default TestESign;
