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
          setKycData(response?.data?.data);
          setFlag((prev) => !prev); // refresh parent
          console.log(flag, isNudgeTableOpen);
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
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;

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
      //  Step 1: Check TechExcel only if action is approve
      if (action === "A") {
        const moduleMap = row.map((item: any) => item?.moduleNo);
        const segmentMap = row.map((item: any) => item?.segment);

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

          const techPayload = {
            segment: segmentRow?.segment,
            clientcode: item?.clientcode,
            // startdate: "23-11-2025",
            startdate: formattedDate,
            moduleNo: thisModuleNo,
            moduleNo2: otherModuleNo,
            segment1: thisSegment ?? "",
            segment2: otherSegment ?? "",
          };

          console.log(techPayload, "techPayload", row, action);

          const techRes = await apiServices.GetTechExcelApiResponseNew(
            techPayload
          );

          const isSuccess =
            techRes?.data?.statusCode === 200 ||
            techRes?.data?.isSuccess === true;

          if (!isSuccess) {
            ShowToast("error", `Techexcel failed for ${item.clientcode}`);
            console.warn("Techexcel failed:", techRes);
            return;
          }
        }
      }

      //  Step 2: All TechExcel calls succeeded, proceed with KYC update
      const kycRes = await apiServices.UpdateBrokerageKycStatusNew(kycPayload);

      if (kycRes?.data?.isSuccess === 200) {
        ShowToast("success", kycRes?.data?.data?.[0]);
        console.log(" KYC response:", kycRes.data.data);
      } else {
        ShowToast("error", kycRes?.data?.data?.[0]);
        console.error("KYC API Error:", kycRes);
      }
      console.log(kycRes, "kycPayload");
    } catch (error) {
      console.error(" Exception in KYC flow:", error);
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
