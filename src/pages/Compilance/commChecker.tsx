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
  const dispatch = useDispatch<AppDispatch>();

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
      financialYear: "string",
      department: "string",
      action: "approve",
      documentType: "string",
      typeOfDocuments: "string",
      communicationType: "string",
      communicationProof: "string",
      communicationProofPath: "string",
      dateOfCommunication: "02/03/2025",
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
          ShowToast("info", "Error approving item");
        }
      })
      .catch((error) => {
        ShowToast("info", error);
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
        />
      </CardBody>
    </Card>
  );
};

export default ComChecker;
