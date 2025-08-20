import React, { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { apiServices } from "../../../services";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import UserInfoTable from "../../../components/common/UserInfoTable";
import pako from "pako";

const VendorApproval = ({ activeSubItem }: any) => {
  const [vendorData, setVendorData] = useState<any[]>([]);

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
      tdsPath: tdsFileName,
      msmsePath: msmeFileName,
    };
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

  const handleDownload = (row: any, docType: "TDS" | "MSME" | "BANK") => {
    let base64Data = "";
    let fileExt = "";
    let fileName = "";

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
                    // handleEditClick={handleEditClick}
                    // getUserDetails={getUserDetails}
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
