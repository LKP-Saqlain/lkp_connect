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

import UserInfoTable from "../../../components/common/UserInfoTable";

interface FormValues {
  selectedZone: { label: string; value: string } | null;
  selectedBranchCode: { label: string; value: string } | null;
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
    // debugger;
    console.log("Form Submitted", {
      zone: values.selectedZone?.value,
      branch: values.selectedBranchCode?.value,
      startDate,
      endDate,
      formattedDateRange,
    });

    let payload = {
      fromDate: startDate,
      toDate: endDate,
      zone: values.selectedZone?.value,
      branchCode: values.selectedBranchCode?.value,
    };

    dispatch(showLoader("Please wait"));
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
                        <Col xl={3}>
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

                        <Col xl={3}>
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
                        <Col xl={3} className="mb-3">
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

                        <Col className="d-flex flex-column-reverse">
                          <div className="mb-3" />
                          <Button
                            className="btn-font"
                            style={{
                              backgroundColor: "#11395C",
                              height: "40px",
                              width: "220px",
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
                    T6Data={ctclData}
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
