import { useEffect, useState } from "react";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { apiServices } from "../../../services";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
  Button,
} from "reactstrap";
import DataTable from "../../../components/common/UserInfoTable";
import ShowToast from "../../../utils/toastUtils";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";

const LedgerReport = ({ activeSubItem }: any) => {
  const dispatch = useDispatch<AppDispatch>();

  // 🧩 State
  const [data, setData] = useState<any[]>([]);
  const [createdDate, setCreatedDate] = useState<Dayjs | null>(dayjs());

  // 📦 Fetch Ledger Report API
  const fetchLedgerReport = async () => {
    if (!createdDate) return;
    const payload = { createdDate: createdDate.format("YYYY-MM-DD") };

    try {
      dispatch(showLoader("Loading Ledger Report..."));

      const response = await apiServices.GetLedgerReport(payload);
      const result = response?.data?.data || [];

      setData(
        result.map((item: any, index: number) => ({
          id: index + 1,
          ...item,
        }))
      );
    } catch (err) {
      ShowToast("error", "Failed to fetch ledger report.");
    } finally {
      dispatch(hideLoader());
    }
  };

  // 🕐 Run once on mount
  useEffect(() => {
    fetchLedgerReport();
  }, []);

  // 📅 Handle date change
  const handleDateChange = (date: Dayjs | null) => {
    setCreatedDate(date);
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
              padding: "0.6rem 1rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h4 className="card-title mb-0">Ledger Debit Report</h4>

            {/* 🔹 Date Picker + Refresh */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Select Date"
                  format="DD/MM/YYYY"
                  value={createdDate}
                  maxDate={dayjs()}
                  onChange={handleDateChange}
                  slotProps={{
                    textField: {
                      size: "small",
                      sx: { minWidth: 180 },
                    },
                  }}
                />
              </LocalizationProvider>

              <Button
                color="primary"
                style={{
                  backgroundColor: "#003366",
                  border: "none",
                  borderRadius: "6px",
                  padding: "0.4rem 1rem",
                }}
                onClick={fetchLedgerReport}
              >
                Load Report
              </Button>
            </div>
          </CardHeader>

          <CardBody>
            {data.length > 0 ? (
              <Row>
                <Col>
                  <DataTable activeSubItem={activeSubItem} T6Data={data} />
                </Col>
              </Row>
            ) : (
              <p
                style={{
                  textAlign: "center",
                  color: "#666",
                  padding: "2rem 0",
                }}
              >
                No data available for the selected date.
              </p>
            )}
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default LedgerReport;
