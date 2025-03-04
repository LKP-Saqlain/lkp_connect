import { useState, useEffect } from "react";
import DataTable from "../../../components/common/UserInfoTable";
import { Card, CardBody, CardHeader } from "reactstrap";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs"; // Import Day.js for date handling
import { RegulatorAnnouncements } from "../../../helper/commmon";
import './index.css'

const RegulatorAnnouncement = ({ activeSubItem }: any) => {
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);

  useEffect(() => {
    console.log("MaintestData", RegulatorAnnouncements);
  }, []);

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
            activeSubItem={activeSubItem}
            T6Data={RegulatorAnnouncements}
            getRowHeight={getRowHeight}
          />
        </CardBody>
      </Card>
    </>
  );
};

export default RegulatorAnnouncement;
