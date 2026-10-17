import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import { TextField } from "@mui/material";
import { DateRangePicker } from "rsuite";
import { useFormik } from "formik";

import { hideLoader, showLoader } from "../../redux/slices/loaderSlice";
import { apiServices } from "../../services";
import DataTable from "../../components/common/UserInfoTable";
import { AppDispatch, RootState } from "../../redux/store";
import ComDropDown from "../../components/common/Dropdown/commonDropdown";
import { exportToExcel } from "../../utils";
import DownloadIcon from "@mui/icons-material/Download";

const MTF_FUND_YIELD_EXCEL_COLUMNS = [
  { headerName: "Client Code", field: "clientcode" },
  { headerName: "Client Name", field: "clientname" },
  { headerName: "Branch Code", field: "branchcode" },
  { headerName: "Zone", field: "zone" },
  { headerName: "Branch Type", field: "branchType" },
  { headerName: "MTF Funded Amount", field: "mtfFundedAmt" },
  { headerName: "MTF Interest", field: "mtfInterest" },
  { headerName: "Debit Fund Amount", field: "debitFundAmt" },
  { headerName: "Debit Interest", field: "debitInterest" },
  { headerName: "Short Margin Funded Amount", field: "shortmgnFundedAmt" },
  { headerName: "Short Margin Interest", field: "shortMarginInterest" },
  { headerName: "Total Fund Amount", field: "totalFundAmt" },
  { headerName: "Total Interest Amount", field: "totalInterestAmt" },
  { headerName: "Brokerage", field: "brokerage" },
  { headerName: "Sub Brokerage", field: "subBrokerage" },
  { headerName: "Net Brokerage", field: "netBrokerage" },
  { headerName: "Total Income", field: "totalIncome" },
  { headerName: "Yield (%)", field: "yieldPerc" },
];

const MTFYield = ({ activeSubItem }: any) => {
  const [mtfYieldRecords, setMtfYieldRecords] = useState<any[]>([]);
  const [selectedZone, setSelectedZone] = useState<string>("ALL");

  // Keep dates as Date objects for the RSuite DateRangePicker.
  const [selectedDateRange, setSelectedDateRange] = useState<
    [Date, Date] | null
  >(null);

  const dispatch = useDispatch<AppDispatch>();

  const { accessType, user_id } = useSelector(
    (state: RootState) => state.AuthUser?.data?.data,
  );

  const formik = useFormik({
    initialValues: {
      clientCode: "",
    },
    onSubmit: () => {
      getMTFYieldRecords();
    },
  });

  // Format dates as YYYY-MM-DD using local calendar dates.
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const onDateRangeChange = (range: Date[] | null) => {
    if (range && range.length === 2 && range[0] && range[1]) {
      setSelectedDateRange([range[0], range[1]]);
    } else {
      setSelectedDateRange(null);
    }
  };

  const getMTFYieldRecords = () => {
    if (!selectedDateRange) {
      return;
    }

    const payload = {
      user_id,
      clientcode: formik.values.clientCode.trim() || "ALL",
      zone: selectedZone,
      fromDate: formatDate(selectedDateRange[0]),
      toDate: formatDate(selectedDateRange[1]),
    };

    dispatch(showLoader(""));

    apiServices
      .GetMTFYieldReport(payload)
      .then((response) => {
        if (response?.status === 200) {
          const data = response?.data?.data || [];

          const processedData = data.map((item: any, index: number) => ({
            Id: index + 1,
            ...item,
          }));

          setMtfYieldRecords(processedData);
        } else {
          setMtfYieldRecords([]);
        }
      })
      .catch((error) => {
        console.error("MTF Yield API Error:", error);
        setMtfYieldRecords([]);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  // Fetch initially when a valid date range is selected,
  // and refetch when the zone changes.
  useEffect(() => {
    if (selectedDateRange) {
      getMTFYieldRecords();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedZone]);

  return (
    <div className="page-content page-view">
      <div className="container-fluid">
        <Row className="row-font">
          <Col lg={12}>
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
                <h4 className="card-title mb-0">{activeSubItem}</h4>
              </CardHeader>

              <CardBody>
                {accessType === "ALL" && (
                  <ComDropDown
                    onZoneChange={(z) => setSelectedZone(z?.value || "ALL")}
                  />
                )}{" "}
                <form onSubmit={formik.handleSubmit}>
                  <Row className="g-3 align-items-start my-2">
                    <>
                      <Col md={3}>
                        <TextField
                          size="small"
                          id="client-code-input"
                          label="Enter Client Code"
                          variant="outlined"
                          name="clientCode"
                          type="text"
                          value={formik.values.clientCode}
                          onChange={(e) => {
                            const formattedValue = e.target.value
                              .toUpperCase()
                              .replace(/[^A-Z0-9]/g, "");

                            formik.setFieldValue("clientCode", formattedValue);
                          }}
                          onBlur={formik.handleBlur}
                          fullWidth
                          inputProps={{
                            maxLength: 15,
                          }}
                        />
                      </Col>
                    </>
                    <Col md={3}>
                      <DateRangePicker
                        id="date-range-picker"
                        size="md"
                        value={selectedDateRange || undefined}
                        onChange={onDateRangeChange}
                        placeholder="Select Date Range"
                        showOneCalendar
                        shouldDisableDate={DateRangePicker.afterToday()}
                        placement="bottomStart"
                        style={{ width: "100%", fontSize: "12px" }}
                        cleanable
                      />
                    </Col>
                    <Col md={2}>
                      <Button
                        type="submit"
                        style={{ backgroundColor: "#11395C", color: "#FFFFFF" }}
                        disabled={!selectedDateRange}
                      >
                        Search
                      </Button>
                    </Col>
                    <Col xs="auto">
                      {Array.isArray(mtfYieldRecords) &&
                        mtfYieldRecords.length > 0 && (
                          <Button
                            style={{
                              backgroundColor: "#11395C",
                              color: "#FFFFFF",
                            }}
                            onClick={() =>
                              exportToExcel(
                                mtfYieldRecords,
                                MTF_FUND_YIELD_EXCEL_COLUMNS,
                                "MTF_Yield_Records",
                              )
                            }
                          >
                            Excel <DownloadIcon />
                          </Button>
                        )}
                    </Col>
                  </Row>
                </form>
                <div className="mt-3">
                  <DataTable
                    activeSubItem={activeSubItem}
                    T6Data={mtfYieldRecords}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default MTFYield;
