import { Box, Button, Typography } from "@mui/material";
import { SectionTitle } from "../../StylingCss";
import { documentList, KYC_ESIGN_MAP } from "../../../../../helper/commmon";
import DocumentRow from "./componets";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../../redux/store";
import { apiServices } from "../../../../../services";
import ShowToast from "../../../../../utils/toastUtils";
import {
  hideLoader,
  showLoader,
} from "../../../../../redux/slices/loaderSlice";
import { useMemo } from "react";
import axios from "axios";

declare const Digio: any;

const kycDocNameMap: Record<number, string> = {
  1: "pan",
  2: "residence",
  3: "office",
  4: "education",
  6: "gst",
  14: "other",
};

const Esign = ({
  data,
  applNo,
  kycDocs,
  esignDocs,
  handleViewApprovalData,
}: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data,
  );
  const signedDocIds = useMemo(() => {
    return new Set((esignDocs || []).map((d: any) => Number(d.isEsignDisable)));
  }, [esignDocs]);

  const isDocSigned = (doc: any) => {
    // KYC docs mapping
    if (doc.isKyc) {
      const mappedEsignId = KYC_ESIGN_MAP[Number(doc.docID)];

      return signedDocIds.has(Number(mappedEsignId));
    }

    // Normal docs mapping
    return signedDocIds.has(Number(doc.esignId));
  };

  const forceCategories = ["AGREEMENT", "KYC"];

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

    const allowedDocIds = [1, 2, 3, 4, 6, 14];

    return kycDocs
      .filter(
        (item: any) =>
          item.viewType === "KycDocs" &&
          allowedDocIds.includes(Number(item.docID)),
      )
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

  //  PLACE HERE
  const allDocuments = Object.values(groupedDocs).flat();

  const allSigned = allDocuments.every((doc: any) => isDocSigned(doc));

  // const getKycDocKey = (doc: any) => {
  //   const rawValue = doc.fileName || doc.label || "";

  //   return rawValue
  //     .toLowerCase()
  //     .replace(/\s+/g, "")
  //     .replace(/documents?/g, "")
  //     .replace(/certificate/g, "")
  //     .replace(/proof/g, "")
  //     .trim();
  // };

  // ================= BUILD PAYLOAD =================
  const buildPayload = (doc: any) => {
    console.log("Test", doc);
    const payload: any = { ApplNo: applNo.toString() };

    if (doc.payloadType === "template") {
      payload.templateName = doc.fileName;
    }

    if (doc.payloadType === "sourceFile") {
      console.log("Test11", doc);
      const baseName = doc.fileName.replace(".html", "");
      payload.sourceFile = `${applNo}_${baseName}_AP_Signed.pdf`;
    }

    if (doc.payloadType === "kyc") {
      payload.DocName = kycDocNameMap[Number(doc.docID)];
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

        const statusPayload = {
          applNo: applNo.toString(),
          digioDocId: documentId, // THIS is important
        };

        const statusRes: any =
          await apiServices.UpdateEsignStatus(statusPayload);
        console.log("Response11", statusRes);
        if (statusRes?.status === 200) {
          ShowToast("success", statusRes?.data?.message || "Status updated");
          handleViewApprovalData();
        } else {
          ShowToast(
            "error",
            statusRes?.data?.message || "Status update failed",
          );
        }
      },
    });

    digio.init();
    digio.submit(documentId, signerIdentifier, accessToken);
  };

  //  const digio = new Digio({
  //       environment: "production",
  //       logo: "https://www.lkpsec.com/App_Themes/images/webp/LKP--Final--Logo-New-2021-D2.webp",
  //       theme: {
  //         primaryColor: "#07152B",
  //         secondaryColor: "#000000",
  //       },
  //       callback: async (resp: any) => {
  //         if (resp?.error_code) {
  //           ShowToast("error", "Signing failed");
  //           return;
  //         }

  //         try {
  //           setSignedDocs((prev) => [...prev, fileName]);
  //           ShowToast("success", "Signing completed successfully");

  //           await downloadSignedPdf(documentId, signedFileName);

  //           const statusPayload = {
  //             applNo: apNo,
  //             digioDocId: documentId, // THIS is important
  //           };

  //           const statusRes = await UpdateEsignStatus(statusPayload);

  //           if (statusRes?.status === 1) {
  //             ShowToast("success", statusRes?.message || "Status updated");
  //           } else {
  //             ShowToast("error", statusRes?.message || "Status update failed");
  //           }
  //         } catch (err) {
  //           console.error("Post-sign error:", err);
  //           ShowToast("error", "Error after signing");
  //         }
  //       },
  //     });

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
      console.log(response, "mcx");
      let signData;
      if (doc.payloadType === "kyc") {
        signData = response?.data?.data?.digioResponse?.clsUploadPDFResponse;
      } else {
        signData = response?.data?.digioResponse?.clsUploadPDFResponse;
      }

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

  const getSignedDoc = (doc: any) => {
    return (esignDocs || []).find(
      (item: any) => Number(item.isEsignDisable) === doc.esignId,
    );
  };

  const handlePreview = async (doc: any) => {
    console.log("Test1111", doc);

    try {
      let token = localStorage.getItem("tkn");
      dispatch(showLoader(""));
      const signedDoc = getSignedDoc(doc);
      const payload = {
        fileName: signedDoc ? signedDoc.fileName : doc.fileName,
        filePath: signedDoc ? signedDoc.filePath : doc.path,
        fileType: signedDoc
          ? `.${signedDoc.fileType}`
          : `.${doc.fileType}` || ".pdf",
        contentType: "",
        applNo: applNo,
      };
      console.log("Payload11", payload);

      const response = await axios.post(
        `https://api.lkpconnect.net.in/api/AP/ApAdminDocumentsFileDownload`,
        payload,
        {
          responseType: "blob", // Ensures the response is treated as a binary file
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const blob = new Blob([response?.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;

      const finalFileName = doc.fileName.endsWith(".pdf")
        ? doc.fileName
        : `${doc.fileName}.pdf`;

      link.setAttribute("download", finalFileName);

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

      ShowToast("success", "File downloaded successfully");
    } catch (err) {
      console.error("Preview download error:", err);
      ShowToast("error", "Failed to download file");
    } finally {
      dispatch(hideLoader());
    }
  };

  const handleComplianceAlertMail = async () => {
    try {
      dispatch(showLoader("Processing Approval..."));

      const approvalPayload = {
        applNo: applNo,
        userId: user_id,
        headApproverStatus: "A",
      };

      console.log("Head Approval Payload:", approvalPayload);

      const approvalResponse = await apiServices.HeadApprove(approvalPayload);

      console.log("Head Approval Response:", approvalResponse);

      const mailPayload = {
        applNo: applNo,
        templateType: "LKP_ESIGN",
      };

      console.log("Mail Payload:", mailPayload);

      const mailResponse = await apiServices.SendMailToApprover(mailPayload);

      console.log("Mail Response:", mailResponse);

      ShowToast("success", "Approval completed and mail sent");
    } catch (error) {
      console.error("Error:", error);

      ShowToast("error", "Something went wrong");
    } finally {
      dispatch(hideLoader());
    }
  };

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
                isSigned={isDocSigned(doc)}
              />
            ))}
          </Box>
        </Box>
      ))}
      <Button
        variant="contained"
        disabled={!allSigned}
        sx={{
          background: allSigned ? "#1F5A96" : "#b0b0b0",
          textTransform: "none",
          borderRadius: 2,
          px: 4,
          height: 40,
          ml: "auto",
          cursor: allSigned ? "pointer" : "not-allowed",

          "&.Mui-disabled": {
            background: "#d3d3d3",
            color: "#777",
          },
        }}
        onClick={handleComplianceAlertMail}
      >
        Submit
      </Button>
    </Box>
  );
};

export default Esign;
