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
      startdate: startDate, // "2025-10-30"
      enddate: endDate, //"2025-10-30"
    };

    dispatch(showLoader(""));
    apiServices
      .ViewVendorDetailsReport(payload)
      .then((response) => {
        dispatch(hideLoader());

        if (response?.status === 200) {
          const data = response?.data?.data[0];

          if (data) {
            const formattedRow = {
              id: data.vendorId,
              vendorId: data.vendorId,
              vendorName: data.vendorName,
              address1: data.address1,
              address2: data.address2,
              address3: data.address3,
              city: data.city,
              state: data.state,
              pincode: data.pincode,
              mobileNo: data.mobileNo,
              teleNo: data.teleNo,
              emailID: data.emailID,
              websiteName: data.websiteName,
              panNo: data.panNo,
              panDoc: data.panDoc,
              bankName: data.bankName,
              bankActNo: data.bankActNo,
              ifscCode: data.ifscCode,
              bankDoc: data.bankDoc, // base64
              chqPrintNameFlag: data.chqPrintNameFlag,
              chqPrintLocFlag: data.chqPrintLocFlag,
              chqPrintLocCode: data.chqPrintLocCode,
              chqPrintName: data.chqPrintName,
              createdBy: data.createdBy,
              createdDate: formatDate(data.createdDate),
              faxNo: data.faxNo,
              paymentBank: data.paymentBank,
              gstNo: data.gstNo,
              tdsFlag: data.tdsFlag,
              tdsPath: data.tdsPath, // base64
              msmeFlag: data.msmeFlag,
              msmeType: data.msmeType,
              msmePath: data.msmePath, // base64
              bankDocExtn: data.bankDocExtn,
              tdsExtn: data.tdsExtn,
              msmseExtn: data.msmseExtn,
              accApproval: data.accApproval,
              accRemark: data.accRemark,
            };

            setVendorRows([formattedRow]); // store entire record
            console.log("Formatted Vendor Data:", formattedRow);
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
