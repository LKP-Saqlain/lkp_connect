import {
  FormControl,
  FormHelperText,
  TextField,
  // useMediaQuery,
} from "@mui/material";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardBody, CardHeader, Col, Row, Button } from "reactstrap";
// import * as Yup from "yup";
import { AppDispatch, RootState } from "../../../redux/store";
import DataTable from "../../../components/common/UserInfoTable";
import { regEx } from "../../../helper/method";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { apiServices } from "../../../services";
import { useState } from "react";
// import ShowToast from "../../../utils/toastUtils";
import { DateRangePicker } from "rsuite";
const { afterToday } = DateRangePicker;
import moment from "moment";

interface SPIPPeformance {
  activeSubItem: string;
}

const SPIPClientWiseReport = ({ activeSubItem }: SPIPPeformance) => {
  const [report, setReport] = useState<any[]>([]);
  const [selectedDateRange, setSelectedDateRange] = useState<
    [Date | null, Date | null]
  >([null, null]);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [formattedDateRange, setFormattedDateRange] = useState<string>("");

  // const isMobile = useMediaQuery("(max-width:600px)");
  const dispatch = useDispatch<AppDispatch>();

  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );

  const formik = useFormik({
    initialValues: {
      riaCode: "",
      startDate: "",
      endDate: "",
    },
    // validationSchema: Yup.object({
    //   riaCode: Yup.string().required("Please enter Client Code"),
    //   // startDate: Yup.string().required("Start date is required"),
    //   // endDate: Yup.string().required("End date is required"),
    // }),
    onSubmit: (values) => {
      const { riaCode } = values;
      console.log("submitClick", riaCode);
      console.log("Form Submitted", {
        startDate,
        endDate,
        formattedDateRange,
      });
      fetchReport(values);
    },
  });

  const fetchReport = (values: any) => {
    const userId = user_id.includes("-") ? user_id.split("-")[1] : user_id;
    console.log("userId", userId);
    let payload = {
      option: "ClientWiseFeesReport",
      loginName: userId,
      loginType: "B2B",
      branchCode: "", //1200
      clientCode: values?.riaCode, //RA000654
      zone: "", //0001
      fromDate: startDate,
      toDate: endDate,
      // fromDate: "2024-09-30",
      // toDate: "2025-06-06",
    };

    dispatch(showLoader(""));
    apiServices
      .SPIPFeesSharingReport(payload)
      .then((response) => {
        console.log(
          "SPIPsubScriptionDetailResponse-->",
          response?.data.message
        );
        dispatch(hideLoader());
        if (response?.data?.statusCode === 400) {
          setReport([]);
          // ShowToast("error", response?.data?.message);
          return;
        }
        if (response?.status === 200) {
          const filteredResponse = response?.data?.data?.map(
            (item: any, index: number) => ({
              ...item,
              Id: index + 1,
            })
          );
          console.log("filterResponse-->", filteredResponse);

          setReport(filteredResponse);
        }
      })
      .catch((error) => {
        dispatch(hideLoader());
        console.log("Error", error);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
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
                <h4 className="card-title mb-0">
                  Client-Wise Fees Sharing Report
                </h4>
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
                          formik.touched.riaCode &&
                          Boolean(formik.errors.riaCode)
                        }
                      >
                        <TextField
                          size="small"
                          id="client-code-input"
                          label="Enter Client Code"
                          variant="outlined"
                          name="riaCode"
                          type="text"
                          value={formik.values.riaCode}
                          onChange={handleCustomChange}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.riaCode &&
                            Boolean(formik.errors.riaCode)
                          }
                          helperText={
                            formik.touched.riaCode && formik.errors.riaCode
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
                <DataTable
                  activeSubItem={activeSubItem}
                  T6Data={report}
                  // handleApproval={handleApproval}
                  // handleDownload={handlePreview}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default SPIPClientWiseReport;
