import { Card, CardBody, CardHeader, Container } from "reactstrap";
import DataTable from "../../../components/common/UserInfoTable";
import { useEffect, useState } from "react";
import { AppDispatch, RootState } from "../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { apiServices } from "../../../services";
import ShowToast from "../../../utils/toastUtils";
import NudgeTable from "../../../components/common/NudgeTable";

type SegmentRowType = {
  clientcode: string;
  segment: string;
  [key: string]: any; // optional if there are other fields
};

const KycBrokerage = ({ activeSubItem }: any) => {
  const [kycData, setKycData] = useState([]);
  const [combinedKycData, setCombinedKycData] = useState({});
  const [flag, setFlag] = useState<boolean>(false);
  const [fileType, setFileType] = useState<string | null>(null);
  const [isNudgeTableOpen, setIsNudgeTableOpen] = useState(false);
  const [segmentRow, setSegmentRow] = useState<SegmentRowType | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );
  useEffect(() => {
    dispatch(showLoader("Please wait..."));
    apiServices
      .GetBrokerageKycStatusNew({})
      // .GetBrokerageKycStatus({})
      .then((response) => {
        if (response?.status === 200) {
          console.log("kyc-data", response?.data?.data);
          const resData = response?.data?.data;
          setKycData(
            resData.map((item: any, index: number) => ({
              id: index + 1,
              ...item,
            }))
          );
          // setKycData(response?.data?.data);
          setFlag((prev) => !prev); // refresh parent
          console.log(flag, isNudgeTableOpen, "<---nud");
        }
      })
      .catch((err) => console.log("Error", err))
      .finally(() => dispatch(hideLoader()));
  }, [isNudgeTableOpen]);

  useEffect(() => {
    if (!segmentRow) return; //  wait until segmentRow is set

    dispatch(showLoader("Please wait..."));

    const payload = {
      clientcode: segmentRow.clientcode,
      brokSeg: segmentRow.segment,
    };

    apiServices
      .GetBrokerageKycDetailsStatus(payload)
      .then((response) => {
        if (response?.status === 200) {
          console.log("kyc-data", response?.data?.data);
          setCombinedKycData(response?.data?.data);
        }
      })
      .catch((err) => console.log("Error", err))
      .finally(() => dispatch(hideLoader()));
  }, [segmentRow]);

  const handleKyc = async ({ row, remarks, action }: any) => {
    if (!Array.isArray(row) || row.length === 0) return;
    if (!segmentRow) {
      console.error("segmentRow is null. Aborting.");
      return;
    }

    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, "0")}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${now.getFullYear()}`;

    const commonFields = {
      kycflag: action,
      kycUserId: user_id,
      kycRemark: remarks,
    };

    const kycPayload = {
      brokeragedtls: row.map((item: any) => ({
        rowID: item?.rowId,
        ...commonFields,
      })),
    };

    dispatch(showLoader("Please wait..."));

    try {
      let allTechExcelSuccess = true;

      // Step 1: Call TechExcel only if approving (A)
      if (action === "A") {
        const moduleMap = row.map((item: any) => item?.moduleNo);
        const segmentMap = row.map((item: any) => item?.segment);

        // prevent duplicate reverse calls (e.g., Intraday ↔ Delivery)
        const uniquePairs = new Set<string>();

        for (const item of row) {
          const thisModuleNo = item?.moduleNo;
          const thisSegment = item?.segment;

          const otherModuleNo =
            moduleMap.length > 1
              ? moduleMap.find((mod) => mod !== thisModuleNo) || ""
              : "";

          const otherSegment =
            segmentMap.length > 1
              ? segmentMap.find((seg) => seg !== thisSegment) || ""
              : "";

          const pairKey = [thisModuleNo, otherModuleNo].sort().join("-");
          if (uniquePairs.has(pairKey)) {
            console.log("Skipping duplicate TechExcel pair:", pairKey);
            continue;
          }
          uniquePairs.add(pairKey);

          const techPayload = {
            segment: segmentRow?.segment,
            clientcode: item?.clientcode,
            startdate: formattedDate,
            moduleNo: thisModuleNo,
            moduleNo2: otherModuleNo,
            segment1: thisSegment ?? "",
            segment2: otherSegment ?? "",
          };

          console.log("TechExcel Payload:", techPayload);

          const techRes = await apiServices.GetTechExcelApiResponseNew(
            techPayload
          );

          const statusCode = techRes?.data?.statusCode;
          const message = techRes?.data?.data || "";

          // ✅ treat “Slab Already Exists” (206) as success
          const isSoftSuccess =
            statusCode === 206 &&
            typeof message === "string" &&
            message.toLowerCase().includes("slab already exists");

          const isSuccess =
            statusCode === 200 ||
            techRes?.data?.isSuccess === true ||
            isSoftSuccess;

          if (!isSuccess) {
            allTechExcelSuccess = false;
            ShowToast(
              "error",
              `TechExcel failed for ${item.clientcode}: ${
                techRes?.data?.data || "Unknown error"
              }`
            );
            console.warn("TechExcel failed:", techRes);
            break; // stop loop — no need to continue
          } else {
            console.log(
              `✅ TechExcel success for ${item.clientcode}: ${techRes?.data?.data}`
            );
          }
        }
      }

      // Step 2: Only call KYC if either Reject (R) or all TechExcel succeeded
      if (action === "R" || allTechExcelSuccess) {
        const kycRes = await apiServices.UpdateBrokerageKycStatusNew(
          kycPayload
        );

        if (kycRes?.data?.isSuccess == true) {
          ShowToast("success", kycRes?.data?.data?.[0]);
          console.log("KYC response:", kycRes.data.data);
        } else {
          ShowToast("error", kycRes?.data?.data?.[0]);
          console.error("KYC API Error:", kycRes);
        }
        console.log("KYC Payload:", kycPayload);
      } else {
        console.warn("Skipping KYC update due to failed TechExcel check.");
      }
    } catch (error) {
      console.error("Exception in KYC flow:", error);
      ShowToast("error", "Something went wrong while updating KYC");
    } finally {
      dispatch(hideLoader());
      setIsNudgeTableOpen(false);
    }
  };

  const handlePreview = async (row: any) => {
    setFileType("");
    const fileExtension = row.consentfilename
      ? `.${row.consentfilename.split(".").pop()?.toLowerCase()}`
      : "";

    console.log("approvalExtension", fileExtension, row);
    setFileType(fileExtension);

    const payload = {
      fileName: row.consentfilename,
      filePath: "D:\\FileUpload\\KYCConsentForm",
      fileType: fileExtension ? fileExtension : fileType ? fileType : "",
      contentType: "",
    };

    dispatch(showLoader("Download file..."));

    apiServices
      .ComplianceDownload(payload)
      .then((response) => {
        if (response?.status === 200 && response?.data) {
          const url = window.URL.createObjectURL(new Blob([response?.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute(
            "download",
            `${payload.fileName}${payload.fileType}`
          );
          document.body.appendChild(link);
          link.click();
          dispatch(hideLoader());
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
  };

  useEffect(() => {
    if (segmentRow) {
      console.log(segmentRow.clientcode, "count", segmentRow.segment);
    }
  }, [segmentRow]);

  const closeNudgeTable = () => {
    setIsNudgeTableOpen(false);
  };
  return (
    <div className="page-content page-view">
      <Container fluid>
        <Card
          style={{
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
            <h4 className="card-title mb-0">
              KYC - Brokerage modification approval
            </h4>
          </CardHeader>
          <CardBody>
            <DataTable
              activeSubItem={activeSubItem}
              T6Data={kycData}
              // handleApproval={handleApproval}
              // handleApproval={handleApproval}
              handleDownload={handlePreview}
              setIsNudgeTableOpen={setIsNudgeTableOpen}
              setSegmentRow={setSegmentRow}
            />
          </CardBody>
        </Card>
        <NudgeTable
          isOpen={isNudgeTableOpen}
          onClose={closeNudgeTable}
          selectedReport={"More details about segment"}
          singleData={combinedKycData}
          handleAction={handleKyc}
          handleDownload={handlePreview}
        />
      </Container>
    </div>
  );
};

export default KycBrokerage;
