import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import { useFormik } from "formik";
import {
  FormControl,
  FormHelperText,
  TextField,
  // useMediaQuery,
} from "@mui/material";
import { DateRangePicker } from "rsuite";
const { afterToday } = DateRangePicker;
import moment from "moment";
import { regEx } from "../../../helper/method";
import { apiServices } from "../../../services";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import UserInfoTable from "../../../components/common/UserInfoTable";
import pako from "pako";
import ShowToast from "../../../utils/toastUtils";

const VendorReport = ({ activeSubItem }: any) => {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [formattedDateRange, setFormattedDateRange] = useState<string>("");
  const [selectedDateRange, setSelectedDateRange] = useState<
    [Date | null, Date | null]
  >([null, null]);
  const [vendorRows, setVendorRows] = useState<any[]>([]);

  const dispatch = useDispatch<AppDispatch>();

  const formik = useFormik({
    initialValues: {
      vendorName: "",
      startDate: "",
      endDate: "",
    },
    // validationSchema: Yup.object({
    //   vendorName: Yup.string().required("Please enter Client Code"),
    //   // startDate: Yup.string().required("Start date is required"),
    //   // endDate: Yup.string().required("End date is required"),
    // }),
    onSubmit: (values) => {
      const { vendorName } = values;
      console.log("submitClick", vendorName);
      console.log("Form Submitted", {
        startDate,
        endDate,
        formattedDateRange,
      });
      fetchReport();
    },
  });

  useEffect(() => {
    console.log("dataaaass", startDate, endDate, formik.values.vendorName);
  }, [formik, startDate, endDate]);

  const fetchReport = () => {
    let payload = {
      vendorName: formik.values.vendorName || "ALL",
      startdate: startDate,
      enddate: endDate,
    };

    dispatch(showLoader(""));
    apiServices
      .ViewVendorDetailsReport(payload)
      .then((response) => {
        dispatch(hideLoader());

        if (response?.status === 200) {
          const rows = response?.data?.data || [];

          if (rows.length > 0) {
            const formattedRows = rows.map((data: any) => ({
              Id: data.vid,
              vendorId: data.vid,
              vendorName: data.vnm,
              address1: data.ad1,
              address2: data.ad2,
              address3: data.ad3,
              city: data.cty,
              state: data.ste,
              pincode: data.pin,
              mobileNo: data.mob,
              teleNo: data.tele,
              emailID: data.em,
              websiteName: data.web,
              panNo: data.pan,
              panDoc: data.pdoc,
              bankName: data.bnk,
              bankActNo: data.actn,
              ifscCode: data.ifsc,
              bankDoc: data.bdoc,
              chqPrintNameFlag: data.cpf,
              chqPrintLocFlag: data.cplf,
              chqPrintLocCode: data.cplc,
              chqPrintName: data.cpn,
              createdBy: data.cby,
              createdDate: formatDate(data.cdt),
              faxNo: data.fax,
              paymentBank: data.pbnk,
              gstNo: data.gst,
              tdsFlag: data.tdsf,
              tdsPath: data.tdsp,
              msmeFlag: data.msmf,
              msmeType: data.msmt,
              msmePath: data.msmp,
              bankDocExtn: data.bdx,
              tdsExtn: data.tdsx,
              msmseExtn: data.msmx,
              accApproval: data.app,
              accRemark: data.armk,
            }));

            setVendorRows(formattedRows);
            console.log("Vendor Data:", formattedRows);
          }
        }
      })
      .catch((error) => {
        dispatch(hideLoader());
        console.error("Error fetching vendor report:", error);
      });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .replace(/ /g, "-");
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

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    console.log("value", name, value);
    if (name === "riaCode") {
      if (regEx.alphaNumeric.test(value)) {
        formik.setFieldValue(name, value.toUpperCase().replace(/\s/g, ""));
      }
    } else {
      formik.handleChange(e);
    }
  };

  const handleDateChange = (value: [Date | null, Date | null]) => {
    const [start, end] = value;
    if (start && end) {
      const isoStart = moment(start).format("YYYY-MM-DD");
      const isoEnd = moment(end).format("YYYY-MM-DD");

      setStartDate(isoStart);
      setEndDate(isoEnd);
      formik.setFieldValue("startDate", isoStart);
      formik.setFieldValue("endDate", isoEnd);
      // Clear touched state and errors for both if valid
      formik.setFieldError("startDate", "");
      formik.setFieldError("endDate", "");
      const formattedRange = `${moment(start).format("DD/MM/YYYY")} - ${moment(
        end
      ).format("DD/MM/YYYY")}`;
      setFormattedDateRange(formattedRange);
    } else {
      setStartDate(null);
      setEndDate(null);
      formik.setFieldValue("startDate", "");
      formik.setFieldValue("endDate", "");
      setFormattedDateRange("");
    }
  };

  const handleDownload = (
    row: any,
    docType: "TDS" | "MSME" | "BANK" | "PAN"
  ) => {
    let base64Data = "";
    let fileExt = "";
    let fileName = "";
    console.log("row111111", docType, row);

    if (docType === "PAN") {
      const fileExtension =
        row && row.panDoc
          ? `.${row.panDoc.split(".").pop()?.toLowerCase()}`
          : "";

      const payload = {
        fileName: row.panDoc,
        filePath:
          "\\172.17.100.60\\d$\\WebPortal\\Intranet_New\\Files\\VendorMasterMSME",
        fileType: fileExtension,
        contentType: "",
      };

      dispatch(showLoader("Loading Preview..."));

      apiServices
        .ComplianceDownload(payload)
        .then((response) => {
          if (response?.status === 200 && response?.data) {
            const fileBlob = new Blob([response.data], {
              type:
                response.headers["content-type"] || "application/octet-stream",
            });

            const url = URL.createObjectURL(fileBlob);
            const link = document.createElement("a");
            link.href = url;
            link.download = row.panDoc || `PAN_Document${fileExtension}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          } else {
            ShowToast("info", "Error fetching file for preview");
          }
        })
        .catch((error) => {
          ShowToast("info", error.message || "Preview failed");
        })
        .finally(() => {
          dispatch(hideLoader());
        });

      return;
    }
    switch (docType) {
      case "TDS":
        base64Data = row.tdsPath;
        fileExt = row.tdsExtn?.toLowerCase();
        fileName = `TDS_Document.${fileExt}`;
        break;

      case "MSME":
        base64Data = row.msmePath;
        fileExt = row.msmseExtn?.toLowerCase();
        fileName = `MSME_Document.${fileExt}`;
        break;

      case "BANK":
        base64Data = row.bankDoc;
        fileExt = row.bankDocExtn?.toLowerCase();
        fileName = `Bank_Document.${fileExt}`;
        break;

      default:
        console.error("Invalid document type");
        return;
    }

    if (!base64Data) {
      console.error("No document data found");
      return;
    }

    // Remove prefix if present (e.g., data:image/png;base64,...)
    const cleanBase64 = base64Data.includes("base64,")
      ? base64Data.split("base64,")[1]
      : base64Data;

    // Decode base64 to binary
    const binaryString = atob(cleanBase64);
    let binaryData = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      binaryData[i] = binaryString.charCodeAt(i);
    }

    // Detect GZIP (first two bytes 0x1F 0x8B)
    const isGzip = binaryData[0] === 0x1f && binaryData[1] === 0x8b;
    if (isGzip) {
      binaryData = pako.ungzip(binaryData);
    }

    // Map extn to MIME type
    let mimeType =
      fileExt === "pdf"
        ? "application/pdf"
        : fileExt === "jpg" || fileExt === "jpeg"
        ? "image/jpeg"
        : fileExt === "png"
        ? "image/png"
        : "application/octet-stream";

    // Create Blob and download
    const blob = new Blob([binaryData], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Cleanup
  };

  return (
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
                <h4 className="card-title mb-0">{activeSubItem}</h4>
              </CardHeader>
              <CardBody>
                <form onSubmit={formik.handleSubmit}>
                  <Row>
                    <Col xs={12} md={6} lg={4}>
                      <FormControl
                        fullWidth
                        error={
                          (formik.touched.startDate &&
                            Boolean(formik.errors.startDate)) ||
                          (formik.touched.endDate &&
                            Boolean(formik.errors.endDate))
                        }
                        sx={{
                          backgroundColor: "white",
                          // px: 0.5,
                          fontSize: "0.85rem",
                        }}
                      >
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
                          onBlur={() => {
                            formik.setFieldTouched("startDate", true);
                            formik.setFieldTouched("endDate", true);
                          }}
                        />
                        <FormHelperText>
                          {formik.touched.startDate && formik.errors.startDate
                            ? formik.errors.startDate
                            : formik.touched.endDate && formik.errors.endDate
                            ? formik.errors.endDate
                            : ""}
                        </FormHelperText>
                      </FormControl>
                    </Col>

                    <Col xs={12} md={6} lg={4}>
                      <FormControl
                        fullWidth
                        error={
                          formik.touched.vendorName &&
                          Boolean(formik.errors.vendorName)
                        }
                      >
                        <TextField
                          size="small"
                          id="client-code-input"
                          label="Enter Client Code"
                          variant="outlined"
                          name="vendorName"
                          type="text"
                          value={formik.values.vendorName}
                          onChange={handleCustomChange}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.vendorName &&
                            Boolean(formik.errors.vendorName)
                          }
                          helperText={
                            formik.touched.vendorName &&
                            formik.errors.vendorName
                          }
                          fullWidth
                        />
                      </FormControl>
                    </Col>

                    <Col xs={12} sm={6} md={3} lg={2}>
                      <Button
                        className="btn-font w-100"
                        style={{
                          backgroundColor: "#11395C",
                          height: "36px",
                          fontSize: "13px",
                          padding: "4px 10px",
                        }}
                        type="submit"
                      >
                        Submit
                      </Button>
                    </Col>
                  </Row>
                </form>
              </CardBody>
            </Card>
            <Card
              style={{
                borderRadius: "15px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
              }}
            >
              <CardBody>
                <UserInfoTable
                  activeSubItem={activeSubItem}
                  T6Data={vendorRows}
                  handleDownload={handleDownload}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default VendorReport;
