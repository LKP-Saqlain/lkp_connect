import { useState, useEffect } from "react";
import DataTable from "../../components/common/UserInfoTable";
import { Card, CardBody, CardHeader, Container } from "reactstrap";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs"; // Import Day.js for date handling
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { hideLoader, showLoader } from "../../redux/slices/loaderSlice";
import { apiServices } from "../../services";
import ShowToast from "../../utils/toastUtils";
// import ShowToast from "../../utils/toastUtils";

const RegulatoryAnnouncement = ({ activeMenu }: any) => {
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
  const [regAnnouncements, setRegAnnouncements] = useState<any[]>([]);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchRegAnnouncement = async () => {
      dispatch(showLoader("Please wait..."));
      try {
        const response = await apiServices.viewRegAnnoucement({});
        console.log("Fetched Regulatory Announcements:", response?.data);
        const rows = response?.data.data || [];

        const mappedRows = rows.map((item: any, index: number) => ({
          Id: index + 1, // REQUIRED if using MUI DataGrid
          ...item,
        }));
        console.log("Regulatory AnnouncementsResponse", mappedRows);
        setRegAnnouncements(mappedRows);
      } catch (error) {
        console.error("Error fetching regulatory announcements:", error);
      } finally {
        dispatch(hideLoader());
      }
    };

    fetchRegAnnouncement();
  }, [dispatch]);

  const handleDownload = async (row: any) => {
    console.log("roww response", row);

    try {
      // Extract file path and name
      const fullPath = row.CircularFilePath || "";
      const pathParts = fullPath.split("\\");
      const fullFileName = pathParts[pathParts.length - 1]; // e.g. "sample..pdf"
      const filePath = pathParts.slice(0, -1).join("\\"); // e.g. "D:\\PROJECT"

      // Extract file name and extension safely
      const lastDotIndex = fullFileName.lastIndexOf(".");
      const fileName =
        lastDotIndex !== -1
          ? fullFileName.slice(0, lastDotIndex)
          : fullFileName;
      const fileType =
        lastDotIndex !== -1 ? fullFileName.slice(lastDotIndex) : ".pdf"; // default to .pdf if missing

      const payload = {
        fileName,
        filePath,
        fileType,
        contentType: "",
      };

      dispatch(showLoader("Downloading..."));
      const response = await apiServices.ComplianceDownload(payload);

      if (response?.status === 200 && response?.data) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");

        link.href = url;
        link.setAttribute("download", `${fileName}${fileType}`);
        document.body.appendChild(link);
        link.click();
      } else {
        console.error("Download failed", response);
        ShowToast("info", "Error downloading file");
      }
    } catch (error: any) {
      ShowToast(
        "info",
        error?.message || "An error occurred while downloading"
      );
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    if (selectedDate) {
      console.log("Selected Date:", selectedDate.format("MM-YYYY"));
    }
  }, [selectedDate]);

  const getRowHeight = () => {
    return "auto";
  };

  return (
    <>
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
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderRadius: "15px 15px 0 0",
                boxShadow: "0 -4px 8px rgba(0, 0, 0, 0.15)",
                backgroundColor: "#fff",
                padding: "0.2rem 0.8rem",
              }}
            >
              <h4 className="card-title mb-0">Regulatory Announcement</h4>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Month & Year"
                  views={["month", "year"]}
                  value={selectedDate}
                  onChange={(newValue) => setSelectedDate(newValue)}
                  sx={{ width: 210 }}
                  maxDate={dayjs()}
                />
              </LocalizationProvider>
            </CardHeader>
            <CardBody>
              <DataTable
                activeMenu={activeMenu}
                T6Data={regAnnouncements}
                handleDownload={handleDownload}
                getRowHeight={getRowHeight}
                customCss={true}
              />
            </CardBody>
          </Card>
        </Container>
      </div>
    </>
  );
};

export default RegulatoryAnnouncement;
