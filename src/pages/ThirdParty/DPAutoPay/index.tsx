import React, { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Label,
  Row,
} from "reactstrap";
import { Tabs, Tab, TextField } from "@mui/material";
import { Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { apiServices } from "../../../services";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import ShowToast from "../../../utils/toastUtils";
import * as Yup from "yup";
import { useFormik } from "formik";
import { DateRangePicker } from "rsuite";
import moment from "moment";
import { regEx } from "../../../helper/method";
import UserInfoTable from "../../../components/common/UserInfoTable";

const ALLOWED_EXTENSIONS = [".xlsx", ".xls"];
const { afterToday } = DateRangePicker;

const AutoPayReport = ({ activeSubItem }: any) => {
  const [inputKey, setInputKey] = useState<number>(0);
  const [tabValue, setTabValue] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>("");
  const [formattedDateRange, setFormattedDateRange] = useState<string>("");
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState<
    [Date | null, Date | null]
  >([null, null]);
  const [mandateData, setMandateData] = useState<[]>([]);
  const [mandateJVData, setMandateJVData] = useState<[]>([]);
  const [downloadMandateData, setDownloadMandateData] = useState<[]>([]);
  const dispatch = useDispatch();
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );

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
    clientCode: string;
    dateRange: any;
  }

  const formik = useFormik<FormValues>({
    initialValues: {
      clientCode: "",
      dateRange: [],
    },
    validationSchema,
    onSubmit: (values) => {
      // Only called if no validation errors

      console.log("values1-->", values);
      if (tabValue === 1) {
        handleViewReport();
      }
      if (tabValue === 2) {
        if (formattedDateRange === "") {
          ShowToast("error", "Please select Date Range");
          return;
        }
        // if (values?.clientCode === "") {
        //   ShowToast("error", "Please enter Client Code");
        //   return;
        // }
        handleDownloadReport();
      }
      if (tabValue === 3) {
        handleDownloadRecipt();
      }
    },
  });

  const handleDownloadRecipt = () => {
    let payload = {
      User_id: user_id,
    };
    dispatch(showLoader("Please wait, we are processing your request..."));
    apiServices
      .GetMandateJVReportData(payload)
      .then((res) => {
        console.log("ResponsePreTrade", res);

        if (res?.status === 200) {
          dispatch(hideLoader());
          // setPreTradeReportData(res?.data?.data);
          const rawData = res?.data?.data || [];
          console.log("GetPreTradeReportResponse", rawData);
          const filteredData = rawData.filter((item: any) => {
            return item !== null;
          });
          const finalData = filteredData.map((item: any, index: number) => ({
            ...item,
            Id: index + 1,
          }));
          console.log("FinalData222", finalData);
          setMandateJVData(finalData);
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

  const handleViewReport = () => {
    let payload = {
      clientCode: formik.values.clientCode ? formik.values.clientCode : "ALL",
      // startDate: startDate,
      // endDate: endDate,
      User_id: user_id,
    };
    dispatch(showLoader("Please wait, we are processing your request..."));
    apiServices
      .GetClientMandateData(payload)
      .then((res) => {
        console.log("ResponsePreTrade", res);

        if (res?.status === 200) {
          dispatch(hideLoader());
          // setPreTradeReportData(res?.data?.data);
          const rawData = res?.data?.data || [];
          console.log("GetPreTradeReportResponse", rawData);
          const filteredData = rawData.filter((item: any) => {
            return item !== null;
          });
          const finalData = filteredData.map((item: any, index: number) => ({
            ...item,
            Id: index + 1,
          }));
          console.log("FinalData", finalData);
          setMandateData(finalData);
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

  const handleDownloadReport = () => {
    let payload = {
      user_id: user_id,
      clientcode: formik.values.clientCode ? formik.values.clientCode : "ALL",
      startDate: startDate,
      endDate: endDate,
    };
    dispatch(showLoader("Please wait, we are processing your request..."));
    apiServices
      .GetClientMandateExectionData(payload)
      .then((res) => {
        console.log("ResponsePreTrade", res);

        if (res?.status === 200) {
          dispatch(hideLoader());
          // setPreTradeReportData(res?.data?.data);
          const rawData = res?.data?.data || [];
          console.log("GetClientMandateExectionDataResponse", rawData);
          const filteredData = rawData.filter((item: any) => {
            return item !== null;
          });
          const finalData = filteredData.map((item: any, index: number) => ({
            ...item,
            Id: index + 1,
          }));
          console.log("FinalData1", finalData);
          setDownloadMandateData(finalData);
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

  const resetForm = () => {
    setSelectedFile(null);
    setFileError("");
    setInputKey((prev) => prev + 1); // reset input field
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFileChange(e.dataTransfer.files?.[0] || null);
  };

  const isValidExtension = (fileName: string): boolean => {
    return ALLOWED_EXTENSIONS.some((ext) =>
      fileName.toLowerCase().endsWith(ext)
    );
  };

  const handleFileChange = (file: File | null) => {
    console.log("UploadFile11", file);

    if (!file) return;

    if (!isValidExtension(file.name)) {
      setFileError("Only .xlsx and .xls files are allowed.");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setFileError("");
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e.target.files?.[0] || null);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("File", selectedFile);
    formData.append("User_id", user_id);
    console.log("FormData111", formData);

    dispatch(showLoader(""));
    apiServices
      .UploadHdfcMerchantFile(formData)

      .then((response) => {
        console.log("SLBMResponse1-->", response?.data);
        if (response?.data?.statusCode === 200) {
          //     console.log(payload, "slbm payload");
          ShowToast("success", response?.data?.message);
          resetForm();
        } else {
          ShowToast("error", response?.data?.message);
        }
      })
      .catch((error) => {
        console.log("Error", error);
        ShowToast("error", "File upload failed.");
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

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

  const handleDownload = async () => {
    const payload = {
      user_id: user_id,
    };

    dispatch(showLoader("Downloading file, please wait..."));

    try {
      const response = await apiServices.DownloadDpMandateTrans(payload);

      if (response?.data?.message === "No records found.") {
        ShowToast("error", response.data.message);
        return;
      }

      if (!response?.data) {
        ShowToast("error", "No data received from server");
        return;
      }

      const blob = new Blob([response.data], {
        type: "text/plain",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "DP_Mandate_Report.txt";
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error", error);
      ShowToast("error", "File download failed");
    } finally {
      dispatch(hideLoader());
    }
  };

  return (
    <React.Fragment>
      <div className="page-content page-view">
        <div className="container-fluid">
          <Tabs
            value={tabValue}
            onChange={(_, v) => setTabValue(v)}
            TabIndicatorProps={{ style: { display: "none" } }}
            sx={{
              mt: "1rem",
              ml: ".7rem",
              mb: "8px",
              backgroundColor: "white",
              borderRadius: "11px",
              width: "fit-content",
              minHeight: 0,
            }}
          >
            {[
              "Upload",
              "DP Mandate Data",
              "DP Mandate Execution",
              "Download Receipt",
            ].map((label, index) => (
              <Tab
                key={label}
                label={label}
                sx={{
                  textTransform: "none",
                  fontWeight: 400,
                  borderRadius: "10px",
                  px: 3,
                  minHeight: 10,
                  backgroundColor: tabValue === index ? "#11395C" : "white",
                  color: tabValue === index ? "white" : "#11395C",
                  "&.Mui-selected": { color: "white" },
                }}
              />
            ))}
          </Tabs>
          {tabValue === 0 && (
            <div className="page-content">
              <div className="container-fluid">
                <Row style={{ fontFamily: "Public Sans", marginTop: "1rem" }}>
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
                        <h4 className="card-title mb-0">
                          {" "}
                          DP AutoPay File Upload
                        </h4>
                      </CardHeader>
                      <CardBody>
                        <Row>
                          <Col lg={6}>
                            <Label htmlFor="formFile" className="form-label">
                              Upload File
                            </Label>
                            <div
                              onDrop={handleDrop}
                              onDragOver={handleDragOver}
                              style={{
                                position: "relative",
                                width: "100%",
                              }}
                            >
                              <input
                                type="file"
                                id="customFileUpload"
                                key={inputKey}
                                style={{ display: "none" }}
                                accept=".xlsx,.xls"
                                onChange={handleInputChange}
                              />

                              <Button
                                type="button"
                                onClick={() =>
                                  document
                                    .getElementById("customFileUpload")
                                    ?.click()
                                }
                                style={{
                                  backgroundColor: "#f8f9fa",
                                  color: "#333",
                                  border: "1px dashed #ced4da",
                                  height: "40px",
                                  width: "110%",
                                  borderRadius: "0.25rem",
                                  fontSize: "0.9rem",
                                  textAlign: "left",
                                  paddingLeft: "12px",
                                  paddingRight: selectedFile ? "40px" : "12px",
                                  overflow: "hidden",
                                  position: "relative",
                                  display: "flex",
                                  alignItems: "center",
                                  cursor: "pointer",
                                }}
                              >
                                {selectedFile ? (
                                  <>
                                    {selectedFile.name}
                                    <Tooltip title="Remove file" arrow>
                                      <span
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          resetForm();
                                        }}
                                        style={{
                                          position: "absolute",
                                          right: "8px",
                                          top: "50%",
                                          transform: "translateY(-50%)",
                                          cursor: "pointer",
                                          color: "#dc3545",
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        <CloseIcon fontSize="small" />
                                      </span>
                                    </Tooltip>
                                  </>
                                ) : (
                                  <span>
                                    <strong>Click to upload</strong> or drag and
                                    drop an <strong>.xlsx</strong> or{" "}
                                    <strong>.xls</strong> file
                                  </span>
                                )}
                              </Button>

                              {fileError && (
                                <div
                                  className="text-danger mt-1"
                                  style={{ fontSize: "0.85rem" }}
                                >
                                  {fileError}
                                </div>
                              )}

                              <div className="mt-1">
                                <small className="text-muted d-block">
                                  • Only <strong>.xlsx</strong> and{" "}
                                  <strong>.xls</strong> files are accepted.
                                </small>
                                {/* <small className="text-muted d-block">
                          • Max size: <strong>20MB</strong>.
                        </small> */}
                              </div>
                            </div>
                          </Col>
                        </Row>

                        <Row>
                          <Col lg={4} className="mt-3">
                            <Button
                              onClick={handleFileUpload}
                              style={{
                                backgroundColor: "#11395C",
                                color: "white",
                                width: "150px",
                              }}
                            >
                              Upload File
                            </Button>
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </div>
            </div>
          )}
          {tabValue === 1 && (
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
                        <h4 className="card-title mb-0">{"DP Mandate Data"}</h4>
                      </CardHeader>
                      <CardBody>
                        <form onSubmit={formik.handleSubmit}>
                          <Row className="align-items-end">
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
                            {/* {mandateData.length > 0 && (
                              <Button
                                style={{
                                  backgroundColor: "#11395C",
                                  fontSize: "12px",
                                  minWidth: "140px",
                                  width: "15%",
                                  marginBottom: "1rem",
                                  marginLeft: "1rem",
                                }}
                                type="button"
                                onClick={handleDownload}
                              >
                                Download
                              </Button>
                            )} */}
                          </Row>
                        </form>
                        <UserInfoTable
                          activeSubItem={activeSubItem}
                          T6Data={mandateData}
                        />
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </div>
            </div>
          )}
          {tabValue === 2 && (
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
                          {"DP Mandate Execution"}
                        </h4>
                      </CardHeader>
                      <CardBody>
                        <form onSubmit={formik.handleSubmit}>
                          <Row className="align-items-end">
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
                                    ? [
                                        selectedDateRange[0],
                                        selectedDateRange[1],
                                      ]
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
                            {/* {downloadMandateData.length > 0 && (
                              <Button
                                style={{
                                  backgroundColor: "#11395C",
                                  fontSize: "12px",
                                  minWidth: "140px",
                                  width: "15%",
                                  marginBottom: "1rem",
                                  marginLeft: "1rem",
                                }}
                                type="button"
                                onClick={handleDownload}
                              >
                                Download
                              </Button>
                            )} */}
                          </Row>
                        </form>
                        <UserInfoTable
                          activeSubItem={"Download DP Mandate Report"}
                          T6Data={downloadMandateData}
                        />
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </div>
            </div>
          )}
          {tabValue === 3 && (
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
                          {"Download Receipt"}
                        </h4>
                      </CardHeader>
                      <CardBody>
                        <form onSubmit={formik.handleSubmit}>
                          <Row className="align-items-end">
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
                            {mandateJVData.length > 0 && (
                              <Button
                                style={{
                                  backgroundColor: "#11395C",
                                  fontSize: "12px",
                                  minWidth: "140px",
                                  width: "15%",
                                  marginBottom: "1rem",
                                  marginLeft: "1rem",
                                }}
                                type="button"
                                onClick={handleDownload}
                              >
                                Download
                              </Button>
                            )}
                          </Row>
                        </form>
                        <UserInfoTable
                          activeSubItem={"DPMandateJVData"}
                          T6Data={mandateJVData}
                        />
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </div>
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default AutoPayReport;
