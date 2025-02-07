import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "reactstrap";
import DataTable from "../../components/common/UserInfoTable";
import { showLoader, hideLoader } from "../../redux/slices/loaderSlice";
import { AppDispatch } from "../../redux/store";
import { useDispatch } from "react-redux";
import { apiServices } from "../../services";
import ShowToast from "../../utils/toastUtils";

const ComChecker = ({ activeSubItem }: any) => {
  const [data, setData] = useState<any>();
  // const [ext, setExt] = useState<any>();
  const dispatch = useDispatch<AppDispatch>();

  const today = new Date();
  const day = today.getDate().toString().padStart(2, "0");
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const year = today.getFullYear();

  const formattedDate = `${day}/${month}/${year}`;

  useEffect(() => {
    const fetchComplianceData = () => {
      const payload = {
        financialYear: "string",
        department: "string",
        action: "viewchecker",
        documentType: "string",
        typeOfDocuments: "string",
        communicationType: "string",
        communicationProof: "string",
        communicationProofPath: "string",
        dateOfCommunication: "02/03/2025",
        rowId: 0,
        userId: "",
      };
      dispatch(showLoader("Loading data..."));

      apiServices
        .Compliance(payload)
        .then((response) => {
          if (response?.status === 200) {
            setData(response?.data.Table);
          } else {
            console.log("Error fetching data", response);
          }
        })
        .catch((error) => {
          console.error("Error fetching compliance data:", error);
        })
        .finally(() => {
          dispatch(hideLoader());
        });
    };

    fetchComplianceData();
  }, [dispatch]);

  const handleApproval = (rid: number) => {
    const payload = {
      financialYear: "",
      department: "",
      action: "approve",
      documentType: "",
      typeOfDocuments: "",
      communicationType: "",
      communicationProof: "",
      communicationProofPath: "",
      dateOfCommunication: formattedDate,
      rowId: rid,
      userId: "",
    };

    dispatch(showLoader("Approving..."));

    apiServices
      .Compliance(payload)
      .then((response) => {
        if (response?.status === 200) {
          ShowToast("success", response?.data.Table[0]?.Message);
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
      fileName: "MISTemplate",
      filePath: "D:\\FileUpload\\Compliance",
      fileType: ".xlsx",
      contentType: "",
    };

    dispatch(showLoader("Downloading..."));
    console.log("row data", row);

    apiServices
      .ComplianceDownload(payload)
      .then((response) => {
        console.log("response", response);

        if (response?.status === 200 && response?.data) {
          const url = window.URL.createObjectURL(new Blob([response?.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `sample.${payload.fileType}`);
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
    <Card>
      <CardHeader>
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
  );
};

export default ComChecker;
