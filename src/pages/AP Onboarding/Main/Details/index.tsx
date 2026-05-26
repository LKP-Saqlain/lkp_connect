import { Card, CardBody, CardHeader } from "reactstrap";
import DataTable from "../../../../components/common/UserInfoTable";
import { apiServices } from "../../../../services";
import { AppDispatch } from "../../../../redux/store";
import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "../../../../redux/slices/loaderSlice";
import ShowToast from "../../../../utils/toastUtils";

const ApDetails = ({ data, PartnerStatus, activeSubItem }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const handleDownload = async (applNo: any) => {
    console.log(applNo, "Details");
    let payload = {
      applNo: applNo,
    };
    try {
      dispatch(showLoader("Downloading..."));
      const response = await apiServices.DownloadAllDocs(payload);

      if (response?.status === 200 && response?.data) {
        const blob = new Blob([response?.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.setAttribute("download", `${applNo}_Documents`);
        document.body.appendChild(link);
        link.click();
      } else {
        console.error("Download failed", response);
        ShowToast("info", "Error downloading file");
      }
    } catch (error: any) {
      ShowToast(
        "info",
        error?.message || "An error occurred while downloading",
      );
    } finally {
      dispatch(hideLoader());
    }
  };
  return (
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
        <h5 style={{ margin: 0, fontWeight: 500 }}>{activeSubItem} Details</h5>
      </CardHeader>
      <CardBody>
        <DataTable
          T6Data={data}
          activeSubItem="AP Partner Details"
          onStatusClick={PartnerStatus}
          handleDownload={handleDownload}
        />
      </CardBody>
    </Card>
  );
};

export default ApDetails;
