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
      handleSubmit(values);
      // handleExcelDownload();
    },
  });
  const handleSubmit = (values: FormValues) => {
    console.log("Form Submitted", {
      zone: values.selectedZone?.value,
      branch: values.selectedBranchCode?.value,
      reportType: values.reportType,
      startDate,
      endDate,
      formattedDateRange,
    });
    // API call or Excel generation here
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

      console.log("Payload:", {
        startDate: isoStart,
        endDate: isoEnd,
      });
    } else {
      setStartDate(null);
      setEndDate(null);
      setFormattedDateRange("");
    }
  };
  const dummyClientSummaryData = [
    {
      Zone: "North",
      BranchCode: "BR101",
      ClientCode: "CL001",
      ClientName: "Ravi Kumar",
      OnlineTotalBrok: 1200.5,
      OfflineTotalBrok: 800.75,
      CNTTotalBrok: 350.25,
      OnlineLastTradeDate: "15-Apr-24",
      OfflineLastTradeDate: "10-Mar-24",
      CNTLastTradeDate: "05-Feb-24",
      ActiveStatus: "Active",
    },
    {
      Zone: "South",
      BranchCode: "BR205",
      ClientCode: "CL002",
      ClientName: "Anita Sharma",
      OnlineTotalBrok: 0.0,
      OfflineTotalBrok: 0.0,
      CNTTotalBrok: 0.0,
      OnlineLastTradeDate: "",
      OfflineLastTradeDate: "",
      CNTLastTradeDate: "",
      ActiveStatus: "Inactive",
    },
    {
      Zone: "West",
      BranchCode: "BR309",
      ClientCode: "CL003",
      ClientName: "John D'Souza",
      OnlineTotalBrok: 5250.0,
      OfflineTotalBrok: 1120.0,
      CNTTotalBrok: 400.0,
      OnlineLastTradeDate: "12-May-24",
      OfflineLastTradeDate: "01-Apr-24",
      CNTLastTradeDate: "15-Jan-24",
      ActiveStatus: "Active",
    },
    {
      Zone: "East",
      BranchCode: "BR420",
      ClientCode: "CL004",
      ClientName: "Neha Verma",
      OnlineTotalBrok: 310.0,
      OfflineTotalBrok: 220.0,
      CNTTotalBrok: 130.0,
      OnlineLastTradeDate: "08-Mar-24",
      OfflineLastTradeDate: "22-Feb-24",
      CNTLastTradeDate: "10-Jan-24",
      ActiveStatus: "Active",
    },
    {
      Zone: "Central",
      BranchCode: "BR515",
      ClientCode: "CL005",
      ClientName: "Manish Agarwal",
      OnlineTotalBrok: 0.0,
      OfflineTotalBrok: 150.5,
      CNTTotalBrok: 75.75,
      OnlineLastTradeDate: "",
      OfflineLastTradeDate: "28-Feb-24",
      CNTLastTradeDate: "12-Feb-24",
      ActiveStatus: "Inactive",
    },
  ];
  const dummyclientTradingPatternDetailedData = [
    {
      id: 1,
      Zone: "North",
      BranchCode: "B001",
      ClientCode: "CL1001",
      ClientName: "Rahul Sharma",
      OnlineCMBrok: 1250.75,
      OfflineCMBrok: 980.25,
      CNTCMBrok: 430.5,
      OnlineFuturesBrok: 2100.6,
      OfflineFuturesBrok: 1780.4,
      CNTFuturesBrok: 600.0,
      OnlineOptionsBrok: 3200.25,
      OfflineOptionsBrok: 2900.15,
      CNTOptionsBrok: 850.0,
      OnlineLastTradeDate: "2024-12-15",
      OfflineLastTradeDate: "2024-11-29",
      CNTLastTradeDate: "2024-12-01",
      ActiveStatus: "Active",
    },
    {
      id: 2,
      Zone: "South",
      BranchCode: "B045",
      ClientCode: "CL1045",
      ClientName: "Anita Rao",
      OnlineCMBrok: 890.0,
      OfflineCMBrok: 0,
      CNTCMBrok: 100.0,
      OnlineFuturesBrok: 0,
      OfflineFuturesBrok: 450.75,
      CNTFuturesBrok: 120.0,
      OnlineOptionsBrok: 1100.0,
      OfflineOptionsBrok: 0,
      CNTOptionsBrok: 95.5,
      OnlineLastTradeDate: "2025-01-10",
      OfflineLastTradeDate: "2024-10-20",
      CNTLastTradeDate: "2025-01-12",
      ActiveStatus: "Inactive",
    },
    {
      id: 3,
      Zone: "East",
      BranchCode: "B089",
      ClientCode: "CL1089",
      ClientName: "Suresh Kumar",
      OnlineCMBrok: 450.35,
      OfflineCMBrok: 380.0,
      CNTCMBrok: 220.25,
      OnlineFuturesBrok: 300.0,
      OfflineFuturesBrok: 0,
      CNTFuturesBrok: 50.0,
      OnlineOptionsBrok: 900.0,
      OfflineOptionsBrok: 450.0,
      CNTOptionsBrok: 130.0,
      OnlineLastTradeDate: "2025-02-14",
      OfflineLastTradeDate: "2024-09-15",
      CNTLastTradeDate: "2025-02-10",
      ActiveStatus: "Active",
    },
    {
      id: 4,
      Zone: "West",
      BranchCode: "B076",
      ClientCode: "CL1076",
      ClientName: "Meera Patel",
      OnlineCMBrok: 1600.0,
      OfflineCMBrok: 1500.0,
      CNTCMBrok: 800.0,
      OnlineFuturesBrok: 2300.0,
      OfflineFuturesBrok: 2100.0,
      CNTFuturesBrok: 1000.0,
      OnlineOptionsBrok: 4200.0,
      OfflineOptionsBrok: 4000.0,
      CNTOptionsBrok: 1500.0,
      OnlineLastTradeDate: "2025-03-05",
      OfflineLastTradeDate: "2025-02-20",
      CNTLastTradeDate: "2025-03-01",
      ActiveStatus: "Active",
    },
  ];

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
                        <Col xl={2} className="mb-3">
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
                            onChange={(value: any) => {
                              setSelectedDateRange(value);
                              handleDateChange(value);
                            }}
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
                        ? dummyClientSummaryData
                        : dummyclientTradingPatternDetailedData
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

export default ClientTradingReport;
