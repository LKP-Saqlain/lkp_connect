import React, { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { apiServices } from "../../../services";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import UserInfoTable from "../../../components/common/UserInfoTable";
import pako from "pako";
import ShowToast from "../../../utils/toastUtils";
import dayjs from "dayjs";

const allowedFormats = ["pdf", "png", "jpg", "jpeg"];

const VendorApproval = ({ activeSubItem }: any) => {
  const [vendorData, setVendorData] = useState<any[]>([]);
  const [isBankVerified, setIsBankVerified] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileExtension, setFileExtension] = useState("");
  const [beneficiaryName, setBeneficiaryName] = useState("");
  // const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const { user_id, authenticationValue } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );

  useEffect(() => {
    fetchVendorMasterDetails();
  }, []);

  const fetchVendorMasterDetails = () => {
    const payload = { vendorName: "ALL" };
    dispatch(showLoader(""));

    apiServices
      .ViewVendorDetails(payload)
      .then((response) => {
        if (response?.status === 200) {
          const newVendors = response?.data?.data || [];

          const formattedVendors = newVendors.map(
            (vendor: any, index: number) => ({
              ...vendor,
              id: index + 1, // Assign frontend index-based ID
            })
          );

          setVendorData(formattedVendors); // Replace existing data
          dispatch(hideLoader());

          console.log("Mapped Vendor Data:", formattedVendors);
        }
      })
      .catch((error) => {
        console.error("Error fetching vendor details:", error);
        dispatch(hideLoader());
      });
  };

  const handleApproval = (row: any, remark: string, entryFlag: string) => {
    console.log("Dataaa", row, remark, entryFlag);

    const ensureDot = (ext: any) => {
      if (!ext) return "";
      return ext.startsWith(".") ? ext : `.${ext}`;
    };

    const tdsFileName = `${authenticationValue}_TDS${ensureDot(row.tdsExtn)}`;
    const msmeFileName = `${authenticationValue}_MSME${ensureDot(
      row.msmseExtn
    )}`;

    console.log("Testtss", tdsFileName, msmeFileName);

    const payload = {
      vendorId: row?.vendorId,
      accApproval: entryFlag,
      accUserId: user_id,
      accRemark: remark,
      tdsPath: uploadedFile?.name ? uploadedFile?.name : "",
      msmsePath: msmeFileName,
    };
    console.log("approvalPayload", payload, uploadedFile?.name);

    dispatch(showLoader(""));
    apiServices
      .UpdateAccountApproval(payload)
      .then((response) => {
        if (response?.status === 200) {
          // setFlag(!flag);
          dispatch(hideLoader());
          console.log("Responsee-->", response);
          fetchVendorMasterDetails();
        }
      })
      .catch((err) => console.log("Error", err))
      .finally(() => dispatch(hideLoader()));
  };

  const handleDownload = (
    row: any,
    docType: "TDS" | "MSME" | "BANK" | "PAN"
  ) => {
    let base64Data = "";
    let fileExt = "";
    let fileName = "";
    console.log("row", docType, row);

    if (docType === "PAN") {
      const fileExtension =
        row && row.panDoc
          ? `.${row.panDoc.split(".").pop()?.toLowerCase()}`
          : "";

      const payload = {
        fileName: row.panDoc,
        filePath:
          "\\172.17.100.60\\d$\\WebPortal\\Intranet_New\\Files\\VendorMasterMSME",
        fileType: fileExtension,
        contentType: "",
      };

      dispatch(showLoader("Loading Preview..."));

      apiServices
        .ComplianceDownload(payload)
        .then((response) => {
          if (response?.status === 200 && response?.data) {
            const fileBlob = new Blob([response.data], {
              type:
                response.headers["content-type"] || "application/octet-stream",
            });

            const url = URL.createObjectURL(fileBlob);
            const link = document.createElement("a");
            link.href = url;
            link.download = row.panDoc || `PAN_Document${fileExtension}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          } else {
            ShowToast("info", "Error fetching file for preview");
          }
        })
        .catch((error) => {
          ShowToast("info", error.message || "Preview failed");
        })
        .finally(() => {
          dispatch(hideLoader());
        });

      return;
    }
    switch (docType) {
      case "TDS":
        base64Data = row.tdsPath;
        fileExt = row.tdsExtn?.toLowerCase();
        fileName = `TDS_Document.${fileExt}`;
        break;

      case "MSME":
        base64Data = row.msmePath;
        fileExt = row.msmseExtn?.toLowerCase();
        fileName = `MSME_Document.${fileExt}`;
        break;

      case "BANK":
        base64Data = row.bankDoc;
        fileExt = row.bankDocExtn?.toLowerCase();
        fileName = `Bank_Document.${fileExt}`;
        break;

      default:
        console.error("Invalid document type");
        return;
    }

    if (!base64Data) {
      console.error("No document data found");
      return;
    }

    // Remove prefix if present (e.g., data:image/png;base64,...)
    const cleanBase64 = base64Data.includes("base64,")
      ? base64Data.split("base64,")[1]
      : base64Data;

    // Decode base64 to binary
    const binaryString = atob(cleanBase64);
    let binaryData = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      binaryData[i] = binaryString.charCodeAt(i);
    }

    // Detect GZIP (first two bytes 0x1F 0x8B)
    const isGzip = binaryData[0] === 0x1f && binaryData[1] === 0x8b;
    if (isGzip) {
      binaryData = pako.ungzip(binaryData);
    }

    // Map extn to MIME type
    let mimeType =
      fileExt === "pdf"
        ? "application/pdf"
        : fileExt === "jpg" || fileExt === "jpeg"
        ? "image/jpeg"
        : fileExt === "png"
        ? "image/png"
        : "application/octet-stream";

    // Create Blob and download
    const blob = new Blob([binaryData], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Cleanup
  };

  const handleVerifyDetails = (accNo: string, ifscCode: string) => {
    console.log("BankValues", accNo, ifscCode);

    let payload = {
      bankAccNo: accNo,
      ifscCode: ifscCode,
    };
    dispatch(showLoader(""));
    apiServices
      .VerifyBankDetails(payload)
      .then((response) => {
        if (response?.status === 200) {
          dispatch(hideLoader());
          let data = response?.data;
          console.log("VerifyBankResponse", data?.data);
          if (data?.data !== "") {
            setBeneficiaryName(data?.data);
          }
          if (data?.statusCode === 400) {
            ShowToast("error", "Invalid Bank Details!");

            setIsBankVerified(false);
          } else {
            if (data?.isSuccess) {
              setIsBankVerified(true);
            }
            ShowToast("success", data?.message);
          }
        }
      })
      .catch((error) => {
        console.log("eRRROR", error);
        dispatch(hideLoader());
      });
  };
  const handleFileUploadAsync = (
    file: any,
    communicationProofPath: string,
    tdsFlag: any,
    row: any
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const fileExt = file.name.split(".").pop()?.toLowerCase() || "";
      // debugger;
      if (allowedFormats.includes(fileExt)) {
        const { name } = file;
        const fileName = name.substring(0, name.lastIndexOf("."));
        console.log("fileName", fileName);

        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = () => {
          const base64String = reader.result as string;
          const base64Only = base64String.split(",")[1] || base64String;

          setUploadedFile(file);
          setFileBase64(base64Only); // Store base64
          setFileExtension(fileExt);
          console.log(
            "tpConsole",
            fileExtension,
            fileBase64,
            communicationProofPath
          );

          dispatch(showLoader("Uploading file..."));

          let payload = {
            vendorId: row?.vendorId,
            accUserId: user_id,
            tdsFlag: tdsFlag === "Yes" ? true : false,
            tdsPath: base64Only,
            tdsExtn: fileExt,
          };

          apiServices
            .UploadTdsfile(payload)
            .then((response) => {
              dispatch(hideLoader());
              if (response?.status === 200) {
                console.log("response", response?.data?.data);

                ShowToast("success", response?.data?.data);
                resolve(fileExt); // Resolve the promise on success
              } else {
                reject(new Error("File upload failed"));
              }
            })
            .catch((error) => {
              dispatch(hideLoader());
              console.error("ERROR-->", error);
              reject(error); // Reject the promise on error
            });
        };

        reader.onerror = (error) => {
          console.error("Error reading file:", error);
          dispatch(hideLoader());
          reject(error); // Reject the promise on error
        };
      } else {
        alert("Invalid file format! Allowed: DOC, PDF, XLS, XLSX, JPG, JPEG");
        reject(new Error("Invalid file format"));
      }
    });
  };

  const handleFileUpload = async (row: any, file: File, tdsFlag: string) => {
    console.log("Uploading file for", row, file, tdsFlag);
    const allowedExtensions = ["jpg", "jpeg", "png", "pdf"];
    const fileExt = file.name.split(".").pop()?.toLowerCase() || "";

    if (!allowedExtensions.includes(fileExt)) {
      ShowToast(
        "error",
        "Please upload a file in JPG, JPEG, PNG, or PDF format."
      );
      return;
    }

    const reader = new FileReader();

    reader.onload = async () => {
      const base64WithPrefix = reader.result as string;
      const base64Data = base64WithPrefix.split(",")[1];

      if (!base64Data) {
        ShowToast("error", "Failed to process the file.");
        return;
      }
      // const fileNameWithoutExtension = file.name.substring(
      //   0,
      //   file.name.lastIndexOf(".")
      // );
      const fullFileNameWithExtension = file.name;
      const currentTime = dayjs().format("DD/MM/YYYY_hh:mmA");

      const communicationProofPath = `${currentTime}_${fullFileNameWithExtension}`;
      console.log("communicationProofPath", communicationProofPath);

      try {
        await handleFileUploadAsync(file, communicationProofPath, tdsFlag, row);
      } catch (error) {
        console.error("Compliance Upload Failed:", error);
        ShowToast("error", "Compliance upload failed.");
      }
    };

    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      ShowToast("error", "Error reading the file.");
    };

    reader.readAsDataURL(file);
  };
  return (
    <React.Fragment>
      <div className="page-content page-view">
        <div className="container-fluid">
          <Row className="row-font">
            <Col lg={12}>
              <Card
                style={{
                  minHeight: "80vh",
                  borderRadius: "15px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                }}
              >
                <CardHeader
                  style={{
                    borderRadius: "15px 15px 0 0",
                    boxShadow: "0 -4px 8px rgba(0, 0, 0, 0.15)",
                    backgroundColor: "#fff",
                    padding: "0.2rem 0.8rem",
                  }}
                >
                  <h4 className="card-title mb-0">Vendor Approval</h4>
                </CardHeader>
                <CardBody>
                  {" "}
                  <UserInfoTable
                    activeSubItem={activeSubItem}
                    T6Data={vendorData}
                    handleApproval={handleApproval}
                    handleDownload={handleDownload}
                    handleVerifyDetails={handleVerifyDetails}
                    isBankVerified={isBankVerified}
                    beneficiaryName={beneficiaryName}
                    onFileUpload={handleFileUpload}
                    setIsBankVerified={setIsBankVerified}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  );
};

export default VendorApproval;
