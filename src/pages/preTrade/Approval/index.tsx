import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import UserInfoTable from "../../../components/common/UserInfoTable";
import ShowToast from "../../../utils/toastUtils";
import { apiServices } from "../../../services";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../redux/store";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import "../style.css";

interface PreTradeApproval {
  activeSubItem: string;
}

const PreTradeApproval = ({ activeSubItem }: PreTradeApproval) => {
  const [preTradeReportData, setPreTradeReportData] = useState<[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [setShowImg, setSetShowImg] = useState<boolean>(false);
  const [flag, setFlag] = useState<boolean>(false);
  const [fileType, setFileType] = useState<string | null>(null);
  const [showDocument, setShowDocument] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data,
  );

  // useEffect(() => {
  //   console.log("updateFlag", flag);
  //   if (flag === true) {
  //     handleViewReport();
  //   }
  // }, [flag]);
  useEffect(() => {
    void handleViewReport();
  }, [flag]);

  const handleViewReport = () => {
    let payload = {
      client_id: "",
      sSymbol: "",
      start: 0,
      pagesize: 0,
      userId: user_id,
    };
    dispatch(showLoader("Please wait, we are processing your request..."));
    apiServices
      .GetPendingApproveStatus(payload)
      .then((res) => {
        console.log("ResponsePreTrade", res);

        if (res?.status === 200) {
          dispatch(hideLoader());
          const rawData = res?.data || [];
          console.log("GetPreTradeReportResponse", rawData);
          const filteredData = rawData.filter((item: any) => {
            return item !== null;
          });
          const finalData = filteredData.map((item: any, index: number) => ({
            ...item,
            Id: index + 1,
          }));
          console.log("FinalData", finalData);
          setPreTradeReportData(finalData);
          // if (res?.data?.data.length === 0) {
          //   ShowToast("error", res?.data?.message);
          // } else {
          //   ShowToast("success", res?.data?.message);
          // }
        }
      })
      .catch((error) => {
        console.log("error", error);
        dispatch(hideLoader());
      });
  };
  // const handleDownload = async (row: any) => {
  //   const fileExtension = row.userRemarks
  //     ? `.${row.userRemarks.split(".").pop()}`
  //     : "";
  //   const payload = {
  //     fileName: row.userRemarks,
  //     filePath: "D:\\FileUpload\\PreTrade",
  //     fileType: fileExtension,
  //     contentType: "",
  //   };

  //   dispatch(showLoader("Downloading..."));
  //   console.log("row_data", row, payload);

  //   apiServices
  //     .ComplianceDownload(payload)
  //     .then((response) => {
  //       console.log("response", response);

  //       if (response?.status === 200 && response?.data) {
  //         const url = window.URL.createObjectURL(new Blob([response?.data]));
  //         const link = document.createElement("a");
  //         link.href = url;
  //         link.setAttribute(
  //           "download",
  //           `${payload.fileName}${payload.fileType}`
  //         );
  //         document.body.appendChild(link);
  //         link.click();
  //         dispatch(hideLoader());
  //       } else {
  //         console.log("Error during download", response);
  //         ShowToast("info", "Error downloading file");
  //       }
  //     })
  //     .catch((error) => {
  //       ShowToast(
  //         "info",
  //         error.message || "An error occurred while downloading"
  //       );
  //     })
  //     .finally(() => {
  //       dispatch(hideLoader());
  //     });
  // };

  const handlePreview = async (row: any) => {
    console.log("rowData", row);
    setPreviewUrl("");
    setFileType("");
    const fileExtension = row.userRemarks
      ? `.${row.userRemarks.split(".").pop()?.toLowerCase()}`
      : "";

    console.log("approvalExtension", fileExtension);
    setFileType(fileExtension);

    const payload = {
      fileName: row.userRemarks,
      filePath: "D:\\FileUpload\\PreTrade",
      fileType: fileExtension ? fileExtension : fileType ? fileType : "",
      contentType: "",
    };

    dispatch(showLoader("Loading Preview..."));

    apiServices
      .ComplianceDownload(payload)
      .then((response) => {
        if (response?.status === 200 && response?.data) {
          const blob = new Blob([response.data]);
          const url = URL.createObjectURL(blob);

          setPreviewUrl(url);
          setSetShowImg(false);
          setShowDocument(true);
          console.log("fileURL", url, setShowImg);

          // setmodal_center(true); // Open modal to preview
        } else {
          ShowToast("info", "Error fetching file for preview");
        }
      })
      .catch((error) => {
        ShowToast("info", error.message || "Preview failed");
        setPreviewUrl("");
        setSetShowImg(false);
        setShowDocument(false);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  const handleApproval = (rid: number, remark: string, entryFlag: string) => {
    console.log("arggss->", rid, remark, entryFlag);
    const payload = {
      // rowId: rid,
      // rHflag: entryFlag,
      // rhUserId: user_id,
      // rhRemark: remark,
      rowId: rid,
      statusApprove: entryFlag,
      statusRemarks: remark,
      approvedby: user_id,
    };
    dispatch(showLoader("Please wait..."));
    apiServices
      .SavePreTradeApproveStatus(payload)
      .then((response) => {
        console.log("SaveResponse", response);
        // debugger;
        if (response?.status === 200) {
          setFlag(true);
        }
      })
      .catch((err) => console.log("Error", err))
      .finally(() => dispatch(hideLoader()));
  };

  return (
    <>
      <div className="page-content page-view">
        <div className="container-fluid">
          <Row className="row-font">
            <Col lg={12}>
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
                    backgroundColor: "#fff", // optional for contrast
                  }}
                >
                  <h4 className="card-title mb-0">PreTrade Approval</h4>
                </CardHeader>
                <CardBody>
                  <UserInfoTable
                    activeSubItem={activeSubItem}
                    T6Data={preTradeReportData}
                    handleDownload={handlePreview}
                    previewUrl={previewUrl}
                    setSetShowImg={setSetShowImg}
                    handleApproval={handleApproval}
                    showDocument={showDocument}
                    setShowDocument={setShowDocument}
                    fileExtension={fileType}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default PreTradeApproval;
