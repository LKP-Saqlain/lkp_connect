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
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import UserInfoTable from "../../../components/common/UserInfoTable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface FormValues {
  selectedZone: { label: string; value: string } | null;
  selectedBranchCode: { label: string; value: string } | null;
  reportType: "summarized" | "detailed";
}

const ClientTradingReport = ({ activeSubItem }: any) => {
  const [noSortingGroup, setNoSortingGroup] = useState([]);
  const [branchCodeOptions, setBranchCodeOptions] = useState([]);
  const [selectedDateRange, setSelectedDateRange] = useState<
    [Date | null, Date | null]
  >([null, null]);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [formattedDateRange, setFormattedDateRange] = useState<string>("");
  const [summarizedData, setSummarizedData] = useState<any[]>([]);
  const [detailedData, setDetailedData] = useState<any[]>([]);

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
      // Only called if no validation errors
      console.log("values1-->", values);
      if (formattedDateRange === "") {
        ShowToast("error", "Please select Date Range");
        return;
      }
      handleSubmit(values);
      // handleExcelDownload();
    },
  });
  const handleSubmit = (values: FormValues) => {
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
      fetchSummarizedReport(values);
      return;
    }
    if (reportType === "detailed") {
      fetchDetailedReport(values);
      return;
    }
    // API call or Excel generation here
  };

  const fetchSummarizedReport = (values: any) => {
    let payload = {
      user_id: user_id, // user_id,
      fromDate: startDate ? startDate : "",
      toDate: endDate ? endDate : "",
      zone: values.selectedZone?.value ? values.selectedZone?.value : "",
      branchCode: values.selectedBranchCode?.value
        ? values.selectedBranchCode?.value
        : "",
      clientCode: "",
    };
    dispatch(showLoader("Please wait, we are processing your request..."));
    apiServices
      .TradingPatternReport(payload)
      .then((response) => {
        console.log("TradingPatternReport->", response?.data?.data);
        if (response?.status === 200) {
          dispatch(hideLoader());

          if (
            Array.isArray(response?.data?.data) &&
            response?.data?.data.length > 0
          ) {
            const formattedData = response?.data?.data.map(
              (item: any, index: any) => ({
                Id: index + 1, // unique ID for DataGrid
                act_sts: item.act_sts,
                bt: item.bt,
                bc: item.bc,
                cc: item.cc,
                cn: item.cn,
                zn: item.zn,
                cnt_ltd: item.cnt_ltd,
                cnt_tot_brk: item.cnt_tot_brk,
                off_ltd: item.off_ltd,
                off_tot_brk: item.off_tot_brk,
                on_ltd: item.on_ltd,
                on_tot_brk: item.on_tot_brk,
                mob: item.mob,
                rm_mob: item.rm_mob,
                rm: item.rm,
              })
            );

            console.log("Formatted Data for Grid", formattedData);
            setSummarizedData(formattedData);
            // ShowToast("success", response?.data?.message);
          } else {
            console.warn("No data received from CTCLActivityReport API.");
            setSummarizedData([]);
          }
        }
      })
      .catch((Error) => {
        console.log("error->", Error);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };
  const fetchDetailedReport = (values: any) => {
    let payload = {
      user_id: user_id, // user_id,
      fromDate: startDate,
      toDate: endDate,
      zone: values.selectedZone?.value,
      branchCode: values.selectedBranchCode?.value,
      clientCode: "",
    };
    dispatch(showLoader("Please wait, we are processing your request..."));
    apiServices
      .DetailedTradingPatternReport(payload)
      .then((response) => {
        console.log("DetailedTradingPatternReport->", response?.data?.data);
        if (response?.status === 200) {
          dispatch(hideLoader());
          if (
            Array.isArray(response?.data?.data) &&
            response?.data?.data.length > 0
          ) {
            const formattedData = response?.data?.data.map(
              (item: any, index: number) => ({
                Id: index + 1, // unique ID for DataGrid
                act_sts: item.act_sts,
                bc: item.bc,
                bt: item.bt,
                cc: item.cc,
                cn: item.cn,
                zn: item.zn,
                cnt_cm_brk: item.cnt_cm_brk,
                cnt_fut_brk: item.cnt_fut_brk,
                cnt_ltd: item.cnt_ltd,
                cnt_opt_brk: item.cnt_opt_brk,
                off_cm_brk: item.off_cm_brk,
                off_fut_brk: item.off_fut_brk,
                off_ltd: item.off_ltd,
                off_opt_brk: item.off_opt_brk,
                on_cm_brk: item.on_cm_brk,
                on_fut_brk: item.on_fut_brk,
                on_ltd: item.on_ltd,
                on_opt_brk: item.on_opt_brk,
                mob: item.mob,
                rm_mob: item.rm_mob,
                rm: item.rm,
              })
            );

            console.log("Formatted Data for Grid", formattedData);
            setDetailedData(formattedData);
            // ShowToast("success", response?.data?.message);
          } else {
            console.warn("No data received from CTCLActivityReport API.");
            setDetailedData([]);
          }
        }
      })
      .catch((Error) => {
        console.log("error->", Error);
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
            label: item.itemDesc, // This will be displayed in the dropdown
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
        option: "BranchByZone",
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

  const handleExcelDownload = () => {
    // Convert data to a worksheet
    const selectedData =
      formik.values.reportType === "summarized" ? summarizedData : detailedData;

    const formattedData =
      formik.values.reportType === "summarized"
        ? selectedData.map((item) => ({
            Zone: item.zn,
            "Branch Code": item.bc,
            "Branch Type": item.bt,
            "Client Code": item.cc,
            "Client Name": item.cn,
            "Online Total Brok": item.on_tot_brk,
            "Offline Total Brok": item.off_tot_brk,
            "CNT Total Brok": item.cnt_tot_brk,
            "Online Last Trade Date": item.on_ltd,
            "Offline Last Trade Date": item.off_ltd,
            "CNT Last Trade Date": item.cnt_ltd,
            "Active Status": item.act_sts,
          }))
        : selectedData.map((item) => ({
            Zone: item.zn,
            "Branch Code": item.bc,
            "Branch Type": item.bt,
            "Client Code": item.cc,
            "Client Name": item.cn,
            "Online CM Brok": item.on_cm_brk,
            "Offline CM Brok": item.off_cm_brk,
            "CNT CM Brok": item.cnt_cm_brk,
            "Online Futures Brok": item.on_fut_brk,
            "Offline Futures Brok": item.off_fut_brk,
            "CNT Futures Brok": item.cnt_fut_brk,
            "Online Options Brok": item.on_opt_brk,
            "Offline Options Brok": item.off_opt_brk,
            "CNT Options Brok": item.cnt_opt_brk,
            "Online Last Trade Date": item.on_ltd,
            "Offline Last Trade Date": item.off_ltd,
            "CNT Last Trade Date": item.cnt_ltd,
            "Active Status": item.act_sts,
          }));

    // 🧾 Convert to worksheet with only selected fields
    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    // 🎨 Style header row
    const headerKeys = Object.keys(formattedData[0]);
    // headerKeys.forEach((key, colIndex) => {
    //   console.log(key);
    //   const cellAddress = XLSX.utils.encode_cell({ r: 0, c: colIndex });
    //   if (worksheet[cellAddress]) {
    //     worksheet[cellAddress].s = {
    //       fill: {
    //         patternType: "solid",
    //         fgColor: { rgb: "D9E1F2" },
    //       },
    //       font: {
    //         bold: true,
    //         sz: 14,
    //         color: { rgb: "000000" },
    //       },
    //       alignment: {
    //         horizontal: "center",
    //         vertical: "center",
    //       },
    //     };
    //   }
    // });

    // Set uniform column widths
    worksheet["!cols"] = headerKeys.map(() => ({ wch: 20 }));

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "");

    // Generate timestamp string
    const now = new Date();
    const timeString = now.toLocaleTimeString("en-GB", { hour12: true }); // HH:mm:ss

    const filename =
      formik.values.reportType === "summarized"
        ? `SummarizedReport-${timeString}.xlsx`
        : `DetailedReport-${timeString}.xlsx`;

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

  const selectedData =
    formik.values.reportType === "summarized" ? summarizedData : detailedData;

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
                  <h4 className="card-title mb-0">
                    Client Trading Pattern Report
                  </h4>
                </CardHeader>
                <CardBody>
                  <form onSubmit={formik.handleSubmit}>
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
                              formik.setFieldValue("reportType", e.target.value)
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
                                <span style={{ fontSize: "12px", padding: 0 }}>
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
                                <span style={{ fontSize: "12px", padding: 0 }}>
                                  Detailed
                                </span>
                              }
                              sx={{ margin: selectedData.length > 0 ? 0 : 1 }}
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
                            width: selectedData.length > 0 ? "80px" : "100px",
                            fontSize: "13px",
                            padding: "4px 10px",
                            // marginLeft: selectedData.length > 0 ? "4px" : "0px",
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
                              width: selectedData.length > 0 ? "80px" : "90px",
                              fontSize: "13px",
                              padding: "4px 10px",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                            onClick={handleExcelDownload}
                          >
                            Excel <DownloadIcon style={{ fontSize: "16px" }} />
                          </Button>
                        )}
                      </Col>
                    </Row>
                    {/* </div> */}
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
                        ? summarizedData
                        : formik.values.reportType === "detailed"
                        ? detailedData
                        : []
                    }
                    // T6Data={summarizedData}
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

export default ClientTradingReport;
