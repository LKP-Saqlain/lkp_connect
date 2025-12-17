import { Card, CardBody, CardHeader, Container } from "reactstrap";
import DataTable from "../../../components/common/UserInfoTable";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { apiServices } from "../../../services";
import ShowToast from "../../../utils/toastUtils";

const RegionalHead = ({ activeSubItem }: any) => {
  const [rhStatus, setRhStatus] = useState([]);
  const [flag, setFlag] = useState<boolean>(false);
  const [fileType, setFileType] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );
  useEffect(() => {
    const payload = { user_id };

    dispatch(showLoader("Please wait..."));

    apiServices
      .GetBrokerageRHStatus(payload)
      .then((response) => {
        if (response?.status === 200) {
          console.log("TestTestTest", response?.data?.data);

          const rawData = response?.data?.data || [];

          const mappedData = rawData.map((item: any, index: number) => ({
            Id: index + 1, // required for DataGrid
            ...item,
          }));

          console.log("ModStatus-data (mapped)", mappedData);
          setRhStatus(mappedData);
        }
      })
      .catch((err) => {
        console.error("Error", err);
      })
      .finally(() => dispatch(hideLoader()));
  }, [flag, user_id]);

  const handleApproval = (rid: number, remark: string, entryFlag: string) => {
    const payload = {
      rowId: rid,
      rHflag: entryFlag,
      rhUserId: user_id,
      rhRemark: remark,
    };
    dispatch(showLoader("Please wait..."));
    apiServices
      .UpdateBrokerageRHStatus(payload)
      .then((response) => {
        console.log("Responseee123", response?.data);
        if (response?.status === 200) {
          setFlag(!flag);
        }
      })
      .catch((err) => console.log("Error", err))
      .finally(() => dispatch(hideLoader()));
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

  return (
    <div className="page-content page-view">
      <Container fluid>
        <Card
          className="page-view"
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
              Regional Head - Brokerage modification approval
            </h4>
          </CardHeader>
          <CardBody>
            <DataTable
              activeSubItem={activeSubItem}
              T6Data={rhStatus}
              handleApproval={handleApproval}
              handleDownload={handlePreview}
            />
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default RegionalHead;
