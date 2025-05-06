import { useState, useEffect } from "react";
import DataTable from "../../components/common/UserInfoTable";
import { Card, CardBody, CardHeader } from "reactstrap";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs"; // Import Day.js for date handling
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { hideLoader, showLoader } from "../../redux/slices/loaderSlice";
import { apiServices } from "../../services";
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
        console.log("Fetched Regulatory Announcements:", response?.data?.Table);
        setRegAnnouncements(response?.data?.Table || []);
      } catch (error) {
        console.error("Error fetching regulatory announcements:", error);
      } finally {
        dispatch(hideLoader());
      }
    };

    fetchRegAnnouncement();
  }, [dispatch]);

  const handleDownload = async (row: any) => {
    console.log("roww response", row.CircularFilePath);
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
      <Card>
        <CardHeader
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
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
    </>
  );
};

export default RegulatoryAnnouncement;
