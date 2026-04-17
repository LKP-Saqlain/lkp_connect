import { Box, Typography } from "@mui/material";
import { SectionTitle } from "../../StylingCss";
import { documentList } from "../../../../../helper/commmon";
import DocumentRow from "./componets";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../../redux/store";
import { apiServices } from "../../../../../services";
import ShowToast from "../../../../../utils/toastUtils";
import {
  hideLoader,
  showLoader,
} from "../../../../../redux/slices/loaderSlice";
import { useMemo } from "react";

declare const Digio: any;

const Esign = ({ data, applNo, kycDocs }: any) => {
  const dispatch = useDispatch<AppDispatch>();

  const forceCategories = ["AGREEMENT", "KYC"];

  // ================= SUMMARY =================
  const summary = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
      ? data.data
      : [];

  const allowedCategories = summary
    .map((item: any) => item.exchangeName)
    .filter(
      (name: string) =>
        name &&
        !["Total", "Stamp Paper charges", "Security Deposit"].includes(name),
    );
  console.log("allowedCategories:", allowedCategories);
  const kycDocsFromApi = useMemo(() => {
    if (!Array.isArray(kycDocs)) return [];

    return kycDocs
      .filter((item: any) => item.viewType === "KycDocs")
      .map((item: any) => ({
        category: "KYC",
        fileName: item.fileName,
        label: item.docName,
        path: item.filePath,
        docID: item.docID,
        fileType: item.fileType,
        applStatus: item.applStatus,
        lkpApi: "EsignKYC_Document_LKP",
        payloadType: "kyc",
        isKyc: true,
      }));
  }, [kycDocs]);

  // ================= GROUP DOCUMENTS =================
  const groupedDocs = useMemo(() => {
    const grouped = documentList
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

    //  Inject API KYC docs dynamically
    if (kycDocsFromApi.length > 0) {
      grouped["KYC"] = kycDocsFromApi;
    }

    return grouped;
  }, [allowedCategories, kycDocsFromApi]);

  const getKycDocKey = (doc: any) => {
    const rawValue = doc.fileName || doc.label || "";

    return rawValue
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/documents?/g, "")
      .replace(/certificate/g, "")
      .replace(/proof/g, "")
      .trim();
  };

  // ================= BUILD PAYLOAD =================
  const buildPayload = (doc: any) => {
    const payload: any = { ApplNo: applNo.toString() };

    if (doc.payloadType === "template") {
      payload.templateName = doc.fileName;
    }

    if (doc.payloadType === "sourceFile") {
      const baseName = doc.fileName.replace(".html", "");
      payload.sourceFile = `${applNo}_${baseName}_AP_Signed.pdf`;
    }

    if (doc.payloadType === "kyc") {
      payload.DocName = getKycDocKey(doc);
    }

    return payload;
  };

  // ================= DIGIO INIT =================
  const initiateDigio = (
    documentId: string,
    signerIdentifier: string,
    accessToken: string,
    fileName: string,
  ) => {
    if (typeof Digio === "undefined") {
      ShowToast("error", "Digio SDK not loaded");
      return;
    }

    const digio = new Digio({
      environment: "production",
      logo: "https://www.lkpsec.com/App_Themes/images/webp/LKP--Final--Logo-New-2021-D2.webp",
      theme: { primaryColor: "#07152B", secondaryColor: "#000000" },
      callback: async (resp: any) => {
        if (resp?.error_code) {
          ShowToast("error", "Signing failed");
          return;
        }

        ShowToast("success", "Signing completed successfully");
        await downloadSignedPdf(documentId, fileName);
      },
    });

    digio.init();
    digio.submit(documentId, signerIdentifier, accessToken);
  };

  // ================= HANDLE ESIGN =================
  const handleEsign = async (doc: any) => {
    try {
      if (!doc.lkpApi || !doc.payloadType) {
        console.log("No LKP config for this document yet.");
        return;
      }

      const apiFunc = apiServices[doc.lkpApi as keyof typeof apiServices];

      if (!apiFunc) {
        ShowToast("error", "API not configured properly");
        return;
      }

      const payload = buildPayload(doc);

      ShowToast("info", `Initiating signing for Esign...`);
      dispatch(showLoader(true));

      const response = await apiFunc(payload);

      const signData = response?.data?.digioResponse?.clsUploadPDFResponse;

      if (!signData?.id || !signData?.access_token?.id) {
        ShowToast("error", "Invalid response from signature API");
        dispatch(showLoader(false));
        return;
      }

      initiateDigio(
        signData.id,
        signData.signing_parties?.[0]?.identifier,
        signData.access_token.id,
        signData.file_name,
      );
    } catch (error) {
      console.error(error);
      ShowToast("error", "Error during signing process");
    } finally {
      dispatch(hideLoader());
    }
  };

  // ================= DOWNLOAD =================
  const downloadSignedPdf = async (documentId: string, fileName: string) => {
    try {
      const response = await apiServices.DownloadSignedPdf_PO({
        id: documentId,
        name: fileName,
      });

      if (response?.status !== 200) {
        ShowToast("error", response?.data?.message || "Failed to download PDF");
      }
    } catch (error) {
      console.warn(error);
    }
  };

  const handlePreview = (doc: any) => {
    console.log(`${doc.path}\\${doc.fileName}`);
  };

  // ================= UI =================
  return (
    <Box>
      <SectionTitle>Preview Documents</SectionTitle>

      {Object.entries(groupedDocs).map(([category, docs]: any) => (
        <Box key={category} mb={3}>
          <Typography
            fontWeight={600}
            mb={1}
            sx={{ borderBottom: "1px solid #ccc", pb: 0.5 }}
          >
            {category}
          </Typography>

          <Box display="flex" flexDirection="column" gap={1}>
            {docs.map((doc: any, index: number) => (
              <DocumentRow
                key={`${doc.category}-${doc.label}-${index}`}
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
