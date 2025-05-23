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
import { TextField } from "@mui/material";
import { regEx } from "../../../helper/method";

interface preTradeReport {
  activeSubItem: string;
}

const PreTradeReport = ({ activeSubItem }: preTradeReport) => {
  const [noSortingGroup, setNoSortingGroup] = useState([]);
  const [branchCodeOptions, setBranchCodeOptions] = useState([]);
  const [formattedDateRange, setFormattedDateRange] = useState<string>("");
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState<
    [Date | null, Date | null]
  >([null, null]);
  const [preTradeReportData, setPreTradeReportData] = useState<[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [setShowImg, setSetShowImg] = useState<boolean>(false);
  const [fileType, setFileType] = useState<string | null>(null);
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
    clientCode: string;
    dateRange: any;
  }

  const formik = useFormik<FormValues>({
    initialValues: {
      selectedZone: null,
      selectedBranchCode: null,
      isInValue: "",
      clientCode: "",
      dateRange: [],
    },
    validationSchema,
    onSubmit: (values) => {
      // Only called if no validation errors
      if (formattedDateRange === "") {
        ShowToast("error", "Please select Date Range");
        return;
      }
      console.log("values1-->", values, fileType);
      handleViewReport();
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

  const handleViewReport = () => {
    let payload = {
      clientCode: formik.values.clientCode,
      dealerID: "",
      dealerName: "",
      branch: formik.values.selectedBranchCode?.value,
      zone: formik.values.selectedZone?.value,
      startDate: startDate,
      endDate: endDate,
    };
    dispatch(showLoader("Please wait"));
    apiServices
      .GetPreTradeReport(payload)
      .then((res) => {
        console.log("ResponsePreTrade", res);

        if (res?.status === 200) {
          dispatch(hideLoader());
          setPreTradeReportData(res?.data?.data);
          // if (res?.data?.data.length === 0) {
          //   ShowToast("error", res?.data?.message);
          // } else {
          //   ShowToast("success", res?.data?.message);
          // }
        }
      })
      .catch((error) => {
        console.log("error", error);
        dispatch(hideLoader());
      });
  };
  // const handleDownload = async (row: any) => {
  //   const fileExtension = row.userRemarks
  //     ? `.${row.userRemarks.split(".").pop()}`
  //     : "";
  //   const payload = {
  //     fileName: row.userRemarks,
  //     filePath: "D:\\FileUpload\\PreTrade",
  //     fileType: fileExtension,
  //     contentType: "",
  //   };

  //   dispatch(showLoader("Downloading..."));
  //   console.log("row_data", row, payload);

  //   apiServices
  //     .ComplianceDownload(payload)
  //     .then((response) => {
  //       console.log("response", response);

  //       if (response?.status === 200 && response?.data) {
  //         const url = window.URL.createObjectURL(new Blob([response?.data]));
  //         const link = document.createElement("a");
  //         link.href = url;
  //         link.setAttribute(
  //           "download",
  //           `${payload.fileName}${payload.fileType}`
  //         );
  //         document.body.appendChild(link);
  //         link.click();
  //         dispatch(hideLoader());
  //       } else {
  //         console.log("Error during download", response);
  //         ShowToast("info", "Error downloading file");
  //       }
  //     })
  //     .catch((error) => {
  //       ShowToast(
  //         "info",
  //         error.message || "An error occurred while downloading"
  //       );
  //     })
  //     .finally(() => {
  //       dispatch(hideLoader());
  //     });
  // };

  const handlePreview = async (row: any) => {
    setPreviewUrl("");
    const fileExtension = row.userRemarks
      ? `.${row.userRemarks.split(".").pop()?.toLowerCase()}`
      : "";

    const payload = {
      fileName: row.userRemarks,
      filePath: "D:\\FileUpload\\PreTrade",
      fileType: fileExtension,
      contentType: "",
    };

    dispatch(showLoader("Loading Preview..."));

    apiServices
      .ComplianceDownload(payload)
      .then((response) => {
        if (response?.status === 200 && response?.data) {
          const blob = new Blob([response.data]);
          const url = URL.createObjectURL(blob);

          setPreviewUrl(url);
          setSetShowImg(false);
          setFileType(fileExtension);
          console.log("fileURL", url, setShowImg);

          // setFileType(fileExtension);
          // setmodal_center(true); // Open modal to preview
        } else {
          ShowToast("info", "Error fetching file for preview");
        }
      })
      .catch((error) => {
        ShowToast("info", error.message || "Preview failed");
        setPreviewUrl("");
        setSetShowImg(false);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    console.log("value", name, value);
    if (name === "clientCode") {
      if (regEx.alphaNumeric.test(value)) {
        formik.setFieldValue(name, value.toUpperCase().replace(/\s/g, ""));
      }
    } else {
      formik.handleChange(e);
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
                    backgroundColor: "#fff", // optional for contrast
                  }}
                >
                  <h4 className="card-title mb-0">
                    PreTrade Confirmation Report
                  </h4>
                </CardHeader>
                <CardBody>
                  <form onSubmit={formik.handleSubmit}>
                    <Row className="align-items-end">
                      <Col xl={2} lg={3} md={4} sm={6} xs={12} className="mb-3">
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
                      </Col>
                      <Col xl={2} lg={2} className="mb-3">
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
                      </Col>
                      <Col
                        xl={3}
                        lg={2}
                        md={6}
                        sm={12}
                        xs={12}
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
                          onChange={(value: any) => {
                            setSelectedDateRange(value);
                            handleDateChange(value);
                          }}
                          placeholder="Start date & End date"
                          showOneCalendar
                          shouldDisableDate={afterToday()}
                          placement="bottomStart"
                          style={{ width: "100%", fontSize: "12px" }}
                        />
                      </Col>
                      <Col
                        xl={3}
                        lg={2}
                        md={6}
                        sm={12}
                        xs={12}
                        className="mb-3"
                      >
                        <Label
                          htmlFor="client-code-input"
                          className="form-label text-muted label-font"
                        >
                          Client Code
                        </Label>
                        <TextField
                          size="small"
                          id="client-code-input"
                          variant="outlined"
                          placeholder="Enter Client Code"
                          name="clientCode"
                          type="text"
                          value={formik.values.clientCode}
                          onChange={handleCustomChange}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.clientCode &&
                            Boolean(formik.errors.clientCode)
                          }
                          helperText={
                            formik.touched.clientCode &&
                            formik.errors.clientCode
                          }
                          fullWidth
                        />
                      </Col>
                      <Button
                        style={{
                          backgroundColor: "#11395C",
                          fontSize: "12px",
                          minWidth: "140px",
                          width: "15%",
                          marginBottom: "1rem",
                        }}
                        // onClick={handleSubmit}
                        type="submit"
                      >
                        View
                      </Button>
                    </Row>
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
                    T6Data={preTradeReportData}
                    handleDownload={handlePreview}
                    previewUrl={previewUrl}
                    setSetShowImg={setSetShowImg}
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
