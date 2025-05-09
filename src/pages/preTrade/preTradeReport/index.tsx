import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Label,
  Row,
} from "reactstrap";
import UserInfoTable from "../../../components/common/UserInfoTable";
import ShowToast from "../../../utils/toastUtils";
import Select from "react-select";
import * as Yup from "yup";
import { useFormik } from "formik";
import { apiServices } from "../../../services";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../redux/store";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { DateRangePicker } from "rsuite";
import moment from "moment";
import "../style.css";

interface preTradeReport {
  activeSubItem: string;
}

const PreTradeReport = ({ activeSubItem }: preTradeReport) => {
  const [noSortingGroup, setNoSortingGroup] = useState([]);
  const [branchCodeOptions, setBranchCodeOptions] = useState([]);
  const [formattedDateRange, setFormattedDateRange] = useState<string>("");
  const [selectedDateRange, setSelectedDateRange] = useState<
    [Date | null, Date | null]
  >([null, null]);

  const dispatch = useDispatch<AppDispatch>();
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );

  const { afterToday } = DateRangePicker;

  const validationSchema = Yup.object({
    // selectedZone: Yup.object().nullable().required("Zone is required"),
    // selectedBranchCode: Yup.object()
    //   .nullable()
    //   .required("Branch code is required"),
    // isInValue: Yup.string().required("SYMBOL / ISIN is required"),
    // dateRange: Yup.array()
    //   .of(Yup.date().nullable())
    //   .min(2, "Date range is required")
    //   .required("Date range is required"),
  });

  interface FormValues {
    selectedZone: { label: string; value: string } | null;
    selectedBranchCode: { label: string; value: string } | null;
    isInValue: string;
    dateRange: any;
  }

  const formik = useFormik<FormValues>({
    initialValues: {
      selectedZone: null,
      selectedBranchCode: null,
      isInValue: "",
      dateRange: [],
    },
    validationSchema,
    onSubmit: (values) => {
      // Only called if no validation errors
      console.log("values1-->", values);
      // handleSubmit(values);
      // handleDownloadExcel();
      if (formattedDateRange === "") {
        ShowToast("error", "Please select Date Range");
        return;
      }
    },
  });

  useEffect(() => {
    const str = user_id;
    const userType = localStorage.getItem("uIdType");
    let extractUserId: string | null = null;

    if (str) {
      const parts = str.split("-");
      if (parts.length > 1) {
        extractUserId = parts[1];
      }
    }
    let payload = {
      user_id: str === "APN-7161" ? "5376" : extractUserId,
      option: "zone",
      userType:
        str === "APN-7161" ? "EMP" : userType === "Employee" ? "EMP" : "APN",
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

  const str = user_id;
  useEffect(() => {
    if (formik.values.selectedZone) {
      const userType = localStorage.getItem("uIdType");
      let extractUserId: string | null = null;

      if (str) {
        const parts = str.split("-");
        if (parts.length > 1) {
          extractUserId = parts[1];
        }
      }
      const payload = {
        user_id: str === "APN-7161" ? "5376" : extractUserId,
        option: "BranchByZone",
        userType:
          str === "APN-7161" ? "EMP" : userType === "Employee" ? "EMP" : "APN",
        zone: formik.values.selectedZone.value,
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
    if (value[0] && value[1]) {
      const formattedStartDate = moment(value[0]).format("DD/MM/YYYY");
      const formattedEndDate = moment(value[1]).format("DD/MM/YYYY");
      const formattedRange = `${formattedStartDate} - ${formattedEndDate}`;
      setFormattedDateRange(formattedRange);
      console.log("Selected Date Range:", formattedRange);
    } else {
      setFormattedDateRange("");
    }
  };

  const preProofUploadDummyData = [
    {
      id: 1,
      ClientCode: "CL001",
      tradeDate: "2025-05-01",
      expiryDate: "2025-06-01",
      symbol: "NIFTY",
      series: "EQ",
      instrumentType: "FUTSTK",
      strikePrice: "N/A",
      qty: 150,
      buySell: "Buy",
      tradeOrderNumber: "ORD123456",
    },
    {
      id: 2,
      ClientCode: "CL002",
      tradeDate: "2025-05-02",
      expiryDate: "2025-06-01",
      symbol: "BANKNIFTY",
      series: "EQ",
      instrumentType: "OPTSTK",
      strikePrice: "36000",
      qty: 75,
      buySell: "Sell",
      tradeOrderNumber: "ORD123457",
    },
    {
      id: 3,
      ClientCode: "CL003",
      tradeDate: "2025-05-03",
      expiryDate: "2025-06-01",
      symbol: "RELIANCE",
      series: "EQ",
      instrumentType: "FUTSTK",
      strikePrice: "N/A",
      qty: 50,
      buySell: "Buy",
      tradeOrderNumber: "ORD123458",
    },
    {
      id: 4,
      ClientCode: "CL004",
      tradeDate: "2025-05-04",
      expiryDate: "2025-06-01",
      symbol: "INFY",
      series: "EQ",
      instrumentType: "OPTSTK",
      strikePrice: "1450",
      qty: 100,
      buySell: "Sell",
      tradeOrderNumber: "ORD123459",
    },
    {
      id: 5,
      ClientCode: "CL005",
      tradeDate: "2025-05-05",
      expiryDate: "2025-06-01",
      symbol: "TCS",
      series: "EQ",
      instrumentType: "FUTSTK",
      strikePrice: "N/A",
      qty: 200,
      buySell: "Buy",
      tradeOrderNumber: "ORD123460",
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
                    backgroundColor: "#fff", // optional for contrast
                  }}
                >
                  <h4 className="card-title mb-0">
                    PreTrade Confirmation Report
                  </h4>
                </CardHeader>
                <CardBody>
                  <form onSubmit={formik.handleSubmit}>
                    <div>
                      <Row>
                        <Col xl={3}>
                          <div className="mb-3" style={{ maxWidth: "300px" }}>
                            <Label
                              htmlFor="zone-select"
                              className="form-label text-muted label-font"
                            >
                              ZONE
                            </Label>
                            <Select
                              value={formik.values.selectedZone}
                              onChange={(option: any) =>
                                formik.setFieldValue("selectedZone", option)
                              }
                              onBlur={formik.handleBlur}
                              options={noSortingGroup}
                              isClearable
                              className="placeholder-font"
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
                                <div
                                  className="text-danger"
                                  style={{ fontSize: "12px" }}
                                >
                                  {formik.errors.selectedZone}
                                </div>
                              )}
                          </div>
                        </Col>
                        <Col xl={3}>
                          <div className="mb-3" style={{ maxWidth: "300px" }}>
                            <Label
                              htmlFor="branch-code-select"
                              className="form-label text-muted label-font"
                            >
                              BRANCH CODE
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
                              isClearable
                              className="placeholder-font"
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
                                <div
                                  className="text-danger"
                                  style={{ fontSize: "12px" }}
                                >
                                  {formik.errors.selectedBranchCode}
                                </div>
                              )}
                          </div>
                        </Col>
                        <Col xl={3}>
                          <div className="mb-3" style={{ maxWidth: "300px" }}>
                            <Label
                              htmlFor="date-range-picker"
                              className="form-label text-muted label-font"
                            >
                              SELECT DATE RANGE
                            </Label>
                            <DateRangePicker
                              id="date-range-picker"
                              size="lg"
                              value={
                                selectedDateRange[0] && selectedDateRange[1]
                                  ? [selectedDateRange[0], selectedDateRange[1]]
                                  : undefined
                              }
                              onChange={(value: any) => {
                                setSelectedDateRange(value);
                                handleDateChange(value);
                              }}
                              placeholder="Select Start date & End date"
                              showOneCalendar
                              shouldDisableDate={afterToday()}
                              style={{ width: "100%", fontSize: "12px" }}
                            />
                          </div>
                        </Col>
                        <Col
                          className="d-flex flex-column-reverse"
                          style={{
                            top:
                              (formik.touched.selectedZone &&
                                formik.errors.selectedZone) ||
                              (formik.touched.selectedBranchCode &&
                                formik.errors.selectedBranchCode) ||
                              (formik.touched.isInValue &&
                                formik.errors.isInValue)
                                ? "-18px"
                                : "",
                          }}
                        >
                          <div className="mb-3" />
                          <Button
                            style={{
                              backgroundColor: "#11395C",
                              fontSize: "12px",
                              height: "40px",
                              minWidth: "200px",
                              width: "50%",
                            }}
                            // onClick={handleSubmit}
                            type="submit"
                          >
                            View
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  </form>
                </CardBody>
              </Card>
              <Card
                style={{
                  minHeight: "80vh",
                  borderRadius: "15px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                }}
              >
                <CardBody>
                  <UserInfoTable
                    activeSubItem={activeSubItem}
                    T6Data={preProofUploadDummyData}
                    //  onFileUpload={handleFileUpload}
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

export default PreTradeReport;
