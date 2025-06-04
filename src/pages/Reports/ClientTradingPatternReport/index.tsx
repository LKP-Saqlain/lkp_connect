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
import UserInfoTable from "../../../components/common/UserInfoTable";

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
    dispatch(showLoader("Please wait"));
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
                id: index + 1, // unique ID for DataGrid
                activeStatus: item.activeStatus,
                client_Branch: item.client_Branch,
                client_ID: item.client_ID,
                client_Name: item.client_Name,
                client_Zone: item.client_Zone,
                cnT_Last_Trade_Date: item.cnT_Last_Trade_Date,
                cnT_Total_Brokerage: item.cnT_Total_Brokerage,
                offline_Last_Trade_Date: item.offline_Last_Trade_Date,
                offline_Total_Brokerage: item.offline_Total_Brokerage,
                online_Last_Trade_Date: item.online_Last_Trade_Date,
                online_Total_Brokerage: item.online_Total_Brokerage,
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
    dispatch(showLoader("Please wait"));
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
                id: index + 1, // unique ID for DataGrid
                activeStatus: item.activeStatus,
                client_Branch: item.client_Branch,
                client_ID: item.client_ID,
                client_Name: item.client_Name,
                client_Zone: item.client_Zone,
                cnT_CM_Brokerage: item.cnT_CM_Brokerage,
                cnT_FUT_Brokerage: item.cnT_FUT_Brokerage,
                cnT_Last_Trade_Date: item.cnT_Last_Trade_Date,
                cnT_OPT_Brokerage: item.cnT_OPT_Brokerage,
                offline_CM_Brokerage: item.offline_CM_Brokerage,
                offline_FUT_Brokerage: item.offline_FUT_Brokerage,
                offline_Last_Trade_Date: item.offline_Last_Trade_Date,
                offline_OPT_Brokerage: item.offline_OPT_Brokerage,
                online_CM_Brokerage: item.online_CM_Brokerage,
                online_FUT_Brokerage: item.online_FUT_Brokerage,
                online_Last_Trade_Date: item.online_Last_Trade_Date,
                online_OPT_Brokerage: item.online_OPT_Brokerage,
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

    dispatch(showLoader(""));
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

      dispatch(showLoader(""));

      apiServices
        .getDropDown(payload)
        .then((res) => {
          console.log("response->", res);
          if (res?.status === 200) {
            let branchDropdown = res?.data.map((item: any) => ({
              label: item.itemVal,
              value: item.itemVal,
            }));
            branchDropdown = [...branchDropdown];

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
                    <div>
                      <Row>
                        <Col xl={2}>
                          <div className="mb-3">
                            <Label
                              htmlFor="zone-select"
                              className="form-label text-muted label-font"
                            >
                              Zone
                            </Label>
                            <Select
                              // value={selectedZone}
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
                          </div>
                        </Col>

                        <Col xl={2}>
                          <div className="mb-3">
                            <Label
                              htmlFor="branch-code-select"
                              className="form-label text-muted label-font"
                            >
                              Branch Code
                            </Label>
                            <Select
                              value={formik.values.selectedBranchCode}
                              onChange={(option) =>
                                formik.setFieldValue(
                                  "selectedBranchCode",
                                  option
                                )
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
                          </div>
                        </Col>
                        <Col className="mb-3">
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
                        <Col xl={3} style={{ marginTop: "33px" }}>
                          <FormControl component="fieldset">
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
                                gap: "8px", // Minimum horizontal spacing between buttons
                              }}
                            >
                              <FormControlLabel
                                value="summarized"
                                control={
                                  <Radio
                                    sx={{
                                      color: "#11395C",
                                      p: 0.5,
                                      "&.Mui-checked": {
                                        color: "#11395C",
                                      },
                                    }}
                                  />
                                }
                                label="Summarized"
                                sx={{ mr: 1 }} // optional: controls spacing to the right
                              />
                              <FormControlLabel
                                value="detailed"
                                control={
                                  <Radio
                                    sx={{
                                      color: "#11395C",
                                      p: 0.5,
                                      "&.Mui-checked": {
                                        color: "#11395C",
                                      },
                                    }}
                                  />
                                }
                                label="Detailed"
                              />
                            </RadioGroup>
                          </FormControl>
                        </Col>
                        <Col className="d-flex flex-column-reverse">
                          <div className="mb-3" />
                          <Button
                            className="btn-font"
                            style={{
                              backgroundColor: "#11395C",
                              height: "40px",
                              width: "180px",
                            }}
                            type="submit"
                          >
                            Submit
                          </Button>
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
