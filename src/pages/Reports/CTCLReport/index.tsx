import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Label,
  Row,
} from "reactstrap";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
import Select from "react-select";
import { AppDispatch, RootState } from "../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { apiServices } from "../../../services";
import ShowToast from "../../../utils/toastUtils";
import { DateRangePicker } from "rsuite";
import moment from "moment";
import DownloadIcon from "@mui/icons-material/Download";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";

import UserInfoTable from "../../../components/common/UserInfoTable";

interface FormValues {
  selectedZone: { label: string; value: string } | null;
  selectedBranchCode: { label: string; value: string } | null;
  reportType: "summarized" | "detailed";
}

const CTCLReport = ({ activeSubItem }: any) => {
  const [noSortingGroup, setNoSortingGroup] = useState([]);
  const [branchCodeOptions, setBranchCodeOptions] = useState([]);
  const [selectedDateRange, setSelectedDateRange] = useState<
    [Date | null, Date | null]
  >([null, null]);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [formattedDateRange, setFormattedDateRange] = useState<string>("");
  const [ctclData, setCtclData] = useState<any[]>([]);
  const [ctclDetailedData, setCtclDetailedData] = useState<any[]>([]);

  const dispatch = useDispatch<AppDispatch>();

  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );
  const { afterToday } = DateRangePicker;
  //   const { accessType } = useSelector(
  //     (state: RootState) => state.AuthUser?.data?.data
  //   );

  const formik = useFormik<FormValues>({
    initialValues: {
      selectedZone: null,
      selectedBranchCode: null,
      reportType: "summarized",
    },
    // validationSchema,
    onSubmit: (values) => {
      if (formattedDateRange === "") {
        ShowToast("error", "Please select Date Range");
        return;
      }
      // Only called if no validation errors
      console.log("values1-->", values);
      handleSubmit(values);
      // handleExcelDownload();
    },
  });
  const handleSubmit = (values: FormValues) => {
    setCtclData([]);
    const { reportType } = values;
    console.log("Form Submitted", {
      zone: values.selectedZone?.value,
      branch: values.selectedBranchCode?.value,
      reportType: values.reportType,
      startDate,
      endDate,
      formattedDateRange,
    });
    if (reportType === "summarized") {
      fetchSummarizedReport();
      return;
    }
    if (reportType === "detailed") {
      fetchDetailedReport();
      return;
    }
  };

  const fetchDetailedReport = () => {
    let payload = {
      fromDate: startDate,
      toDate: endDate,
      zone: formik.values.selectedZone?.value,
      branchCode: formik.values.selectedBranchCode?.value,
    };

    dispatch(showLoader("Please wait, we are processing your request..."));
    apiServices
      .DetailedCTCLActivityReport(payload)
      .then((response) => {
        dispatch(hideLoader());
        console.log("CTCL_Response", response?.data?.data);
        if (response?.status === 200) {
          if (
            Array.isArray(response?.data?.data) &&
            response?.data?.data.length > 0
          ) {
            const formattedData = response?.data?.data.map(
              (item: any, index: any) => ({
                id: index + 1, // unique ID for DataGrid
                zone: item.client_Zone,
                branchCode: item.client_Branch,
                ctclTerminalID: item.ctcL_Terminal_ID,
                CTCLLoginID: item.ctcL_Login_ID,
                CTCLUserName: item.ctcL_Username,
                exchangeSegment: item.segment,
                turnover: parseFloat(item.turnover),
                grossBrokerage: parseFloat(item.gross_Brokerage),
                netBrokerage: parseFloat(item.net_Brokerage),
                last_Trade_Date: item.last_Trade_Date,
                branch_Type: item.branch_Type,
              })
            );

            console.log("Formatted CTCL Detailed Data", formattedData);
            setCtclDetailedData(formattedData); // 👉 save to state
          } else {
            console.warn("No data received from CTCLActivityReport API.");
            setCtclDetailedData([]); // clear state if empty
          }
        }
      })
      .catch((Error) => {
        console.log("ERROR", Error);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  const fetchSummarizedReport = () => {
    let payload = {
      fromDate: startDate,
      toDate: endDate,
      zone: formik.values.selectedZone?.value,
      branchCode: formik.values.selectedBranchCode?.value,
    };

    dispatch(showLoader("Please wait, we are processing your request..."));
    apiServices
      .CTCLActivityReport(payload)
      .then((response) => {
        dispatch(hideLoader());
        console.log("CTCL_Response", response?.data?.data);
        if (response?.status === 200) {
          if (
            Array.isArray(response?.data?.data) &&
            response?.data?.data.length > 0
          ) {
            const formattedData = response?.data?.data.map(
              (item: any, index: any) => ({
                id: index + 1, // unique ID for DataGrid
                zone: item.client_Zone,
                branchCode: item.client_Branch,
                ctclTerminalID: item.ctcL_Terminal_ID,
                CTCLLoginID: item.ctcL_Login_ID,
                CTCLUserName: item.ctcL_Username,
                exchangeSegment: item.segment,
                turnover: parseFloat(item.turnover),
                grossBrokerage: parseFloat(item.gross_Brokerage),
                netBrokerage: parseFloat(item.net_Brokerage),
                last_Trade_Date: item.last_Trade_Date,
                branch_Type: item.branch_Type,
              })
            );

            console.log("Formatted Data for Grid", formattedData);
            setCtclData(formattedData); // 👉 save to state
          } else {
            console.warn("No data received from CTCLActivityReport API.");
            setCtclData([]); // clear state if empty
          }
        }
      })
      .catch((Error) => {
        console.log("ERROR", Error);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  useEffect(() => {
    const userType = localStorage.getItem("uIdType");
    let payload = {
      user_id: user_id,
      option: "zone",
      userType: userType === "Employee" ? "EMP" : "APN",
      zone: "ALL",
    };

    const username = "admin";
    const password = "admin";
    const credentials = `${username}:${password}`;
    const encodedCredentials = btoa(credentials); // Base64 encode
    const LoginauthHeader = `Basic ${encodedCredentials}`;

    const customHeaders = {
      Authorization: LoginauthHeader, // Use LoginauthHeader for this request
    };

    dispatch(showLoader("Please wait, we are processing your request..."));
    apiServices
      .getDropDown(payload, customHeaders)
      .then((res) => {
        console.log("Response-->", res);
        if (res?.status === 200) {
          let zoneDropdown = res?.data.map((item: any) => ({
            label: item.itemVal, // This will be displayed in the dropdown
            value: item.itemVal, // This will be the actual value
          }));
          console.log("dropdown value", zoneDropdown);
          setNoSortingGroup(zoneDropdown);
          if (zoneDropdown.length > 0) {
            formik.setFieldValue("selectedZone", zoneDropdown[0]);
          }
          // setSelectedNoSortingGroup(selectedNoSortingGroup);
        }
      })
      .catch((Err) => {
        const { message } = Err.response.data;
        console.log("Error->", message);
        dispatch(hideLoader());
        // formik.setFieldError("password", message);
        const errorMessage = Err.response.data.message;
        ShowToast(
          "error",
          errorMessage ||
            "Sorry for the inconvenience, please try after some time."
        );
      });

    dispatch(hideLoader());
  }, [dispatch]);

  useEffect(() => {
    if (formik.values.selectedZone) {
      const userType = localStorage.getItem("uIdType");

      let payload = {
        user_id: user_id,
        option: "zone",
        userType: userType === "Employee" ? "EMP" : "APN",
        zone: "ALL",
      };

      dispatch(showLoader("Please wait, we are processing your request..."));

      apiServices
        .getDropDown(payload)
        .then((res) => {
          console.log("response->", res);
          if (res?.status === 200) {
            let branchDropdown = res?.data.map((item: any) => ({
              label: item.itemVal,
              value: item.itemVal,
            }));
            branchDropdown = [
              { label: "ALL", value: "ALL" },
              ...branchDropdown,
            ];

            setBranchCodeOptions(branchDropdown);
            if (branchDropdown.length > 0) {
              formik.setFieldValue("selectedBranchCode", branchDropdown[0]);
            }
          }
          dispatch(hideLoader());
        })
        .catch((Err) => {
          const { message } = Err.response.data;
          console.log("Error->", message);
          dispatch(hideLoader());
          // formik.setFieldError("password", message);
          const errorMessage = Err.response.data.message;
          ShowToast(
            "error",
            errorMessage ||
              "Sorry for the inconvenience, please try after some time."
          );
        });
    }
  }, [formik.values.selectedZone, dispatch]); // This effect runs when `selectedZone` changes

  const handleDateChange = (value: [Date | null, Date | null]) => {
    const [start, end] = value;
    if (start && end) {
      const isoStart = moment(start).format("YYYY-MM-DD");
      const isoEnd = moment(end).format("YYYY-MM-DD");

      setStartDate(isoStart);
      setEndDate(isoEnd);

      const formattedStartDate = moment(start).format("DD/MM/YYYY");
      const formattedEndDate = moment(end).format("DD/MM/YYYY");
      const formattedRange = `${formattedStartDate} - ${formattedEndDate}`;
      setFormattedDateRange(formattedRange);
    } else {
      setStartDate(null);
      setEndDate(null);
      setFormattedDateRange("");
    }
  };

  const handleExcelDownload = () => {
    debugger;
    const selectedData =
      formik.values.reportType === "summarized" ? ctclData : ctclDetailedData;
    const formattedData =
      formik.values.reportType === "summarized"
        ? selectedData.map((item) => ({
            Zone: item.zone,
            "Branch Code": item.branchCode,
            "Branch Type": item.branch_Type,
            "CTCL Login ID": item.CTCLLoginID,
            "CTCL User Name": item.CTCLUserName,
            "Turnover (Cr.)": item.turnover,
            "Gross Brokerage": item.grossBrokerage,
            "Net Brokerage": item.netBrokerage,
            "Last Trade Date": item.last_Trade_Date,
          }))
        : selectedData.map((item) => ({
            Zone: item.zone,
            "Branch Code": item.branchCode,
            "Branch Type": item.branch_Type,
            "CTCL Login ID": item.CTCLLoginID,
            "CTCL User Name": item.CTCLUserName,
            "Exchange / Segment": item.exchangeSegment,
            "Turnover (Cr.)": item.turnover,
            "Gross Brokerage": item.grossBrokerage,
            "Net Brokerage": item.netBrokerage,
            "Last Trade Date": item.last_Trade_Date,
          }));

    // Convert data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    // Style the header row (first row, r = 0)
    const headerKeys = Object.keys(formattedData[0]);

    // Set uniform column widths
    worksheet["!cols"] = headerKeys.map(() => ({ wch: 20 }));

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "CTCL Wist Activity Report Data"
    );

    // Generate timestamp string
    const now = new Date();
    const timeString = now
      .toLocaleTimeString("en-GB", { hour12: false }) // HH:MM:SS
      .replace(/:/g, "-"); // Replace ':' with '-' for valid filename

    const filename = `CtclActivityReport_${timeString}.xlsx`;

    // Write and save file
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const excelFile = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(excelFile, filename);
  };

  const onDateRangeChange = (value: [Date | null, Date | null] | null) => {
    if (
      !value ||
      !Array.isArray(value) ||
      value.length !== 2 ||
      !value[0] ||
      !value[1]
    ) {
      setSelectedDateRange([null, null]);
      handleDateChange([null, null]);
    } else {
      setSelectedDateRange(value);
      handleDateChange(value);
    }
  };
  const selectedData =
    formik.values.reportType === "summarized" ? ctclData : ctclDetailedData;

  return (
    <>
      <div className="page-content page-view">
        <div className="container-fluid">
          <Row className="row-font">
            <Col lg={12}>
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
                  <h4 className="card-title mb-0">CTCL Wise Activity Report</h4>
                </CardHeader>
                <CardBody>
                  <form onSubmit={formik.handleSubmit}>
                    <div>
                      <Row>
                        <Col
                          xs={12}
                          style={{
                            flex: "0 0 auto",
                            minWidth: "140px",
                            maxWidth: "150px",
                          }}
                          className="mb-3"
                        >
                          <Label
                            htmlFor="zone-select"
                            className="form-label text-muted label-font"
                          >
                            Zone
                          </Label>
                          <Select
                            value={formik.values.selectedZone}
                            onChange={(option: any) =>
                              formik.setFieldValue("selectedZone", option)
                            }
                            onBlur={formik.handleBlur}
                            options={noSortingGroup}
                            className="placeholder-font"
                            isClearable
                            id="zone-select"
                            styles={{
                              control: (base: any) => ({
                                ...base,
                                cursor: "pointer",
                                minHeight: "36px",
                                fontSize: "12px",
                                borderColor:
                                  formik.touched.selectedZone &&
                                  formik.errors.selectedZone
                                    ? "#DC4535"
                                    : base.borderColor,
                                "&:hover": {
                                  borderColor:
                                    formik.touched.selectedZone &&
                                    formik.errors.selectedZone
                                      ? "#DC4535"
                                      : base.borderColor,
                                },
                              }),
                            }}
                          />
                          {formik.touched.selectedZone &&
                            formik.errors.selectedZone && (
                              <div className="text-danger error-msg">
                                {formik.errors.selectedZone}
                              </div>
                            )}
                        </Col>

                        <Col
                          xs={12}
                          style={{
                            flex: "0 0 auto",
                            minWidth: "140px",
                            maxWidth: "150px",
                          }}
                          className="mb-3"
                        >
                          <Label
                            htmlFor="branch-code-select"
                            className="form-label text-muted label-font"
                          >
                            Branch Code
                          </Label>
                          <Select
                            value={formik.values.selectedBranchCode}
                            onChange={(option) =>
                              formik.setFieldValue("selectedBranchCode", option)
                            }
                            onBlur={formik.handleBlur}
                            options={branchCodeOptions}
                            className="placeholder-font"
                            isClearable
                            id="branch-code-select"
                            styles={{
                              control: (base: any) => ({
                                ...base,
                                cursor: "pointer",
                                borderColor:
                                  formik.touched.selectedBranchCode &&
                                  formik.errors.selectedBranchCode
                                    ? "#DC4535"
                                    : base.borderColor,
                                "&:hover": {
                                  borderColor:
                                    formik.touched.selectedBranchCode &&
                                    formik.errors.selectedBranchCode
                                      ? "#DC4535"
                                      : base.borderColor,
                                },
                              }),
                            }}
                          />
                          {formik.touched.selectedBranchCode &&
                            formik.errors.selectedBranchCode && (
                              <div className="text-danger error-msg">
                                {formik.errors.selectedBranchCode}
                              </div>
                            )}
                        </Col>
                        <Col
                          xs={12}
                          style={{
                            flex: "0 0 auto",
                            minWidth: "140px",
                            maxWidth: "260px",
                          }}
                          className="mb-3"
                        >
                          <Label
                            htmlFor="date-range-picker"
                            className="form-label text-muted label-font"
                          >
                            Select Date Range
                          </Label>
                          <DateRangePicker
                            id="date-range-picker"
                            size="md"
                            value={
                              selectedDateRange &&
                              selectedDateRange[0] &&
                              selectedDateRange[1]
                                ? [selectedDateRange[0], selectedDateRange[1]]
                                : undefined
                            }
                            onChange={onDateRangeChange}
                            placeholder="Select Date Range"
                            showOneCalendar
                            shouldDisableDate={afterToday()}
                            placement="bottomStart"
                            style={{ width: "100%", fontSize: "12px" }}
                          />
                        </Col>
                        <Col
                          xl="auto"
                          style={{
                            marginTop: "12px", // reduced top space
                            padding: 0,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <FormControl
                            component="fieldset"
                            style={{
                              fontSize: "12px",
                              margin: 0,
                            }}
                          >
                            <RadioGroup
                              row
                              name="reportType"
                              value={formik.values.reportType}
                              onChange={(e) =>
                                formik.setFieldValue(
                                  "reportType",
                                  e.target.value
                                )
                              }
                              sx={{
                                // gap: "4px",
                                margin: 1,
                                padding: 0,
                              }}
                            >
                              <FormControlLabel
                                value="summarized"
                                control={
                                  <Radio
                                    size="small"
                                    sx={{
                                      p: 0.2,
                                      color: "#11395C",
                                      "&.Mui-checked": {
                                        color: "#11395C",
                                      },
                                    }}
                                  />
                                }
                                label={
                                  <span
                                    style={{ fontSize: "12px", padding: 0 }}
                                  >
                                    Summarized
                                  </span>
                                }
                                sx={{ margin: 0 }}
                              />
                              <FormControlLabel
                                value="detailed"
                                control={
                                  <Radio
                                    size="small"
                                    sx={{
                                      p: 0.2,
                                      color: "#11395C",
                                      "&.Mui-checked": {
                                        color: "#11395C",
                                      },
                                    }}
                                  />
                                }
                                label={
                                  <span
                                    style={{ fontSize: "12px", padding: 0 }}
                                  >
                                    Detailed
                                  </span>
                                }
                                sx={{ margin: ctclData.length > 0 ? 0 : 1 }}
                              />
                            </RadioGroup>
                          </FormControl>
                        </Col>
                        <Col
                          className="d-flex p-0 m-0 mb-3"
                          style={{ alignItems: "flex-end", gap: "10px" }}
                        >
                          <Button
                            className="btn-font"
                            style={{
                              backgroundColor: "#11395C",
                              height: "36px",
                              width: ctclData.length > 0 ? "80px" : "100px",
                              fontSize: "13px",
                              padding: "4px 10px",
                              // marginLeft: ctclData.length > 0 ? "4px" : "0px",
                            }}
                            type="submit"
                          >
                            Submit
                          </Button>

                          {selectedData.length > 0 && (
                            <Button
                              className="btn-font"
                              style={{
                                backgroundColor: "#11395C",
                                height: "36px",
                                width:
                                  selectedData.length > 0 ? "80px" : "90px",
                                fontSize: "13px",
                                padding: "4px 10px",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                              }}
                              onClick={handleExcelDownload}
                            >
                              Excel{" "}
                              <DownloadIcon style={{ fontSize: "16px" }} />
                            </Button>
                          )}
                        </Col>
                      </Row>
                    </div>
                  </form>
                </CardBody>
              </Card>
              <Card
                style={{
                  borderRadius: "15px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                }}
              >
                <CardBody style={{ zIndex: 0 }}>
                  <UserInfoTable
                    activeSubItem={activeSubItem}
                    T6Data={
                      formik.values.reportType === "summarized"
                        ? ctclData
                        : formik.values.reportType === "detailed"
                        ? ctclDetailedData
                        : []
                    }
                    reportType={formik.values.reportType}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default CTCLReport;
