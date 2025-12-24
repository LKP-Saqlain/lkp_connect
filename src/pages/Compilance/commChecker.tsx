import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Container } from "reactstrap";
import DataTable from "../../components/common/UserInfoTable";
import { showLoader, hideLoader } from "../../redux/slices/loaderSlice";
import { apiServices } from "../../services";
import ShowToast from "../../utils/toastUtils";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";

const ComChecker = ({ activeSubItem }: any) => {
  const [data, setData] = useState<any>();
  const [flag, setFlag] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();

  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );
  const today = new Date();
  const day = today.getDate().toString().padStart(2, "0");
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const year = today.getFullYear();

  const formattedDate = `${year}/${month}/${day}`;

  useEffect(() => {
    const fetchComplianceData = () => {
      const payload = {
        financialYear: "",
        department: "",
        action: "viewchecker",
        documentType: "",
        typeOfDocuments: "",
        communicationType: "",
        communicationProof: "",
        communicationProofPath: "",
        dateOfCommunication: formattedDate,
        // dateOfCommunication: "2025/02/05",
        rowId: 0,
        userId: "",
        entryFlag: "",
        remark: "",
      };
      dispatch(showLoader("Please wait, we are processing your request..."));

      apiServices
        .Compliance(payload)
        .then((response) => {
          setData(response?.data.Table);
        })
        .catch((error) => {
          console.error("Error fetching compliance data:", error);
        })
        .finally(() => {
          dispatch(hideLoader());
        });
    };

    fetchComplianceData();
  }, [dispatch, flag]);

  const handleApproval = (rid: number, remark: string, entryFlag: string) => {
    const payload = {
      rowId: rid,
      userId: user_id,
      entryFlag: entryFlag,
      remark: remark,
    };
    dispatch(showLoader("Approving..."));

    apiServices
      .ApproveComplianceData(payload)
      .then((response) => {
        // setFlag(!flag);
        if (response?.status === 200) {
          setFlag(!flag);
          console.log("Responseee-->", response?.data);
          ShowToast("success", response?.data.message);
        } else {
          console.log("Error during approval", response);
          ShowToast("error", "Error approving item");
        }
      })
      .catch((error) => {
        ShowToast("info", error);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  const handleDownload = async (row: any) => {
    const payload = {
      fileName: row.CommunicationProofPath,
      filePath: "D:\\FileUpload\\Compliance",
      fileType: `.${row.DocumentType}`,
      contentType: "",
    };

    dispatch(showLoader("Downloading..."));
    console.log("row data", row, payload.fileType);

    apiServices
      .ComplianceDownload(payload)
      .then((response) => {
        console.log("response", response);

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
          console.log("Error during download", response);
          ShowToast("info", "Error downloading file");
        }
      })
      .catch((error) => {
        ShowToast(
          "info",
          error.message || "An error occurred while downloading"
        );
      })
      .finally(() => {
        dispatch(hideLoader());
      });
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
            <h4 className="card-title mb-0">Communication Checker</h4>
          </CardHeader>
          <CardBody>
            <DataTable
              activeSubItem={activeSubItem}
              T6Data={data}
              handleApproval={handleApproval}
              handleDownload={handleDownload}
            />
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default ComChecker;
