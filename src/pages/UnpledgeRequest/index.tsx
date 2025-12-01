import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Label,
  Row,
} from "reactstrap";
import { DateRangePicker } from "rsuite";
import moment from "moment";
import { TextField } from "@mui/material";
import { useFormik } from "formik";
import ShowToast from "../../utils/toastUtils";
import { apiServices } from "../../services";
import { hideLoader, showLoader } from "../../redux/slices/loaderSlice";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { regEx } from "../../helper/method";
import UserInfoTable from "../../components/common/UserInfoTable";

interface Unpledge {
  activeSubItem: string;
}

const UnpledgeRequest = ({ activeSubItem }: Unpledge) => {
  const [selectedDateRange, setSelectedDateRange] = useState<
    [Date | null, Date | null]
  >([null, null]);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [formattedDateRange, setFormattedDateRange] = useState<string>("");
  const [unpledgeData, setUnpledgeData] = useState<[]>([]);

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
    clientCode: string;
  }

  useEffect(() => {
    console.log(
      "testss",
      activeSubItem,
      startDate,
      endDate,
      formattedDateRange
    );
  }, [activeSubItem, startDate, endDate, formattedDateRange]);

  const formik = useFormik<FormValues>({
    initialValues: {
      clientCode: "",
    },
    validationSchema,
    onSubmit: (values) => {
      // Only called if no validation errors
      if (formattedDateRange === "") {
        ShowToast("error", "Please select Date Range");
        return;
      }
      console.log("values1-->", values);
      handleUnpledgeReport();
    },
  });

  const handleUnpledgeReport = () => {
    const payload = {
      userId: user_id,
      clientCode: formik.values.clientCode,
      fromDate: startDate, //"2025-05-01"
      toDate: endDate, //"2025-08-19"
    };
    dispatch(showLoader(""));
    apiServices
      .GetUnPledgeReport(payload)
      .then((response) => {
        if (response?.status === 200) {
          dispatch(hideLoader());
          console.log("GetUnPledgeReportResponse", response?.data);

          const result = response?.data?.Table || [];
          console.log("A1 GetAPContestReport Data", result);
          setUnpledgeData(
            result.map((item: any, index: any) => ({
              ...item,
              id: index + 1,
            }))
          );
          console.log("====================================");
          console.log("filteteredData", result);
          console.log("====================================");
        }
      })
      .then((error) => {
        console.log("testt", error);
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

  return (
    <React.Fragment>
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
                  <h4 className="card-title mb-0">Unpledge Request Report</h4>
                </CardHeader>
                <CardBody>
                  <form onSubmit={formik.handleSubmit}>
                    <Row className="align-items-end">
                      <Col
                        xl={4}
                        lg={4}
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
                        xl={4}
                        lg={4}
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
                    T6Data={unpledgeData}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  );
};

export default UnpledgeRequest;
