import { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, Container } from "reactstrap";
import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { AppDispatch, RootState } from "../../../redux/store";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { apiServices } from "../../../services";
import DataTable from "../../../components/common/UserInfoTable";
import DownloadIcon from "@mui/icons-material/Download";
import ShowToast from "../../../utils/toastUtils";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const DPTransactionIndex = ({ activeSubItem }: any) => {
  const [data, setData] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const dispatch = useDispatch<AppDispatch>();

  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );

  const getFormattedDate = () => {
    return selectedDate ? selectedDate.format("DD-MM-YYYY") : "";
  };

  useEffect(() => {
    const payload = {
      user_id,
      filterDate: getFormattedDate(),
    };

    dispatch(showLoader("Please wait, we are processing your request..."));

    apiServices
      .GetDPTransactionDetails(payload)
      .then((response) => {
        const result = response?.data?.data || [];
        console.log("DP Transaction Data:", result, activeSubItem);

        const formattedData = result.map((item: any, index: number) => ({
          id: index + 1,
          ...item,
        }));

        setData(formattedData);
      })
      .catch((error) => {
        console.error("Error fetching DP transaction data:", error);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  }, [selectedDate]); // triggers when date changes

  //  Export to Excel
  const exportToExcel = (data: any[], fileName: string) => {
    if (!data.length) return;

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DP Transactions");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `${fileName}.xlsx`);
  };

  const handleDownload = (row: any) => {
    const payload = {
      boId: row?.dP_ID,
      fileType: "eSignPDF",
    };

    dispatch(showLoader("Please wait, we are processing your request..."));

    apiServices
      .DPAMCDownloadFile(payload)
      .then((response: any) => {
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `AMC_${row.dP_ID || "file"}.pdf`;
        document.body.appendChild(link);
        link.click();

        link.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch(() => {
        ShowToast("error", "Failed to download PDF");
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
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
              <h4 className="card-title mb-0">DP AMC Transaction</h4>
              <div className="d-flex align-items-center gap-2">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    format="DD/MM/YYYY"
                    value={selectedDate} // dayjs | null
                    maxDate={dayjs()}
                    onChange={(newDate) => setSelectedDate(newDate)} // update state
                    slotProps={{
                      field: { clearable: true },
                      textField: {
                        // size: "small",
                        sx: { width: 180 },
                      },
                    }}
                  />
                </LocalizationProvider>

                <Button
                  type="button"
                  onClick={() => exportToExcel(data, "DP_Transaction_Report")}
                  variant="contained"
                  size="small"
                  startIcon={<DownloadIcon style={{ fontSize: "16px" }} />}
                  sx={{
                    textTransform: "none",
                    backgroundColor: "#11395C",
                    color: "#fff",
                    fontSize: "12px",
                    height: "32px",
                    padding: "0 12px",
                    borderRadius: "6px",
                    "&:hover": { backgroundColor: "#0d2f4c" },
                  }}
                >
                  Export Excel
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardBody>
            <DataTable
              T6Data={data}
              activeSubItem={activeSubItem}
              handleDownload={handleDownload}
            />
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default DPTransactionIndex;
