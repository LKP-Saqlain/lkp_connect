import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Label,
  Row,
  Button,
} from "reactstrap";
import { apiServices } from "../../../services";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../redux/store";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
import Select from "react-select";
import DataTable from "../../../components/common/table";
import { GridColDef } from "@mui/x-data-grid";
import ShowToast from "../../../utils/toastUtils";
import * as Yup from "yup";
import { useFormik } from "formik";
import "../style.css";

const FinancialYears = [{ value: "2024-2025", label: "2024-2025" }];
const FinancialQuarters = [
  { value: "Q1", label: "Q1" },
  { value: "Q2", label: "Q2" },
  { value: "Q3", label: "Q3" },
  { value: "Q4", label: "Q4" },
];

const QuarterlyPayout = () => {
  const [qPayoutData, setQpayoutData] = useState([]);
  const [totalEntries, setTotalEntries] = useState(null);
  const [searchValue, setSearchValue] = React.useState("");
  const [responseStatus, setResponseStatus] = useState(false);

  const [page, setPage] = useState(1); // Track current page
  // const [pageSize, setPageSize] = useState(10); // Initial page size

  const dispatch = useDispatch<AppDispatch>();

  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );
  const validationSchema = Yup.object({
    selectedFinancialYear: Yup.object()
      .nullable()
      .required("Financial Year is Required"),
    quarter: Yup.object()
      .nullable()
      .required("Please select Financial Quarter"),
  });

  interface FormValues {
    selectedFinancialYear: { label: string; value: string } | null;
    quarter: { label: string; value: string } | null;
  }

  const formik = useFormik<FormValues>({
    initialValues: {
      selectedFinancialYear: null,
      quarter: null,
    },
    validationSchema,
    onSubmit: (values) => {
      // Only called if no validation errors
      console.log("values1-->", values);
      handleSubmit(values);
    },
  });

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    setPage(newPage);
    handleSubmit(event, newPage); // Fetch data for the new page
  };

  const handleSubmit = async (event?: any, value?: any) => {
    console.log(event);
    // const Id = localStorage.getItem("Id");
    const pageSize = 10; // Define pageSize

    // Calculate start based on the new page (0-indexed)
    const start = (value - 1) * pageSize;

    const payload = {
      start: value === undefined ? 0 : start,
      pageSize: 10,
      searchKey: "",
      userId: user_id,
      financialQtr: `2024-${formik.values.quarter?.value}`,
    };
    dispatch(showLoader(""));
    await apiServices
      .GetQuaterlyPayoutGrid(payload)
      .then((response) => {
        console.log("responseQpayout", response?.data);
        const { recordsTotal } = response?.data[0];
        setTotalEntries(recordsTotal);
        dispatch(hideLoader());
        if (response?.status === 200) {
          setResponseStatus(true);
          setQpayoutData(response.data);
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
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  const qpayoutColumns: GridColDef[] = [
    { field: "accountcode", headerName: "Client Code", width: 130 },
    { field: "clientName", headerName: "Client Name", width: 130 },
    { field: "rm", headerName: "RM", width: 130 },
    { field: "branchcode", headerName: "Branch Code", width: 130 },
    { field: "zone", headerName: "Zone", width: 100 },
    {
      field: "payout_Amt",
      headerName: "Payout Amt",
      width: 130,
      align: "right",
      headerAlign: "center",
    },
    {
      field: "receipt_Amt",
      headerName: "Receipt Amt",
      width: 130,
      align: "right",
      headerAlign: "center",
    },
    // { field: "payout_Amt", headerName: "Pending Amt", width: 130 }, //COMMENTED THIS BCOZ TABLE BREAKS
    {
      field: "extra_Payin",
      headerName: "Extra Payin",
      width: 130,
      align: "right",
      headerAlign: "center",
    },
  ];

  const handleSearchBasedOnInput = (value: string) => {
    console.log("handleSearchBasedOnInputValue", value);
    setSearchValue(value);
  };

  const handleSearchUser = async () => {
    const pageSize = 10; // Define pageSize

    // Calculate start based on the new page (0-indexed)
    // const start = (value - 1) * pageSize;

    const payload = {
      start: pageSize,
      pageSize: 10,
      searchKey: searchValue !== "" ? searchValue : "",
      userId: user_id,
      financialQtr: `2024-${formik.values.quarter?.value}`,
    };
    dispatch(showLoader(""));
    await apiServices
      .GetQuaterlyPayoutGrid(payload)
      .then((response) => {
        console.log("responseQpayout", response?.data);
        const { recordsTotal } = response?.data[0];
        setTotalEntries(recordsTotal);
        dispatch(hideLoader());
        if (response?.status === 200) {
          setQpayoutData(response.data);
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
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  document.title = "LKP Securities | Quarterly Payout Recovery Report";

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Row className="row-font">
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <h4 className="card-title mb-0">
                    Quarterly Payout Recovery Report
                  </h4>
                </CardHeader>
                <CardBody>
                  <form onSubmit={formik.handleSubmit}>
                    <div>
                      <Row>
                        <Col xl={3}>
                          <div className="mb-3">
                            <Label
                              htmlFor="choices-single-no-sorting"
                              className="form-label text-muted placeholder-font"
                            >
                              Financial Year
                            </Label>
                            <Select
                              value={formik.values.selectedFinancialYear}
                              onChange={(option) =>
                                formik.setFieldValue(
                                  "selectedFinancialYear",
                                  option
                                )
                              }
                              onBlur={formik.handleBlur}
                              options={FinancialYears}
                              className="placeholder-font"
                              styles={{
                                control: (base: any) => ({
                                  ...base,
                                  borderColor:
                                    formik.touched.selectedFinancialYear &&
                                    formik.errors.selectedFinancialYear
                                      ? "#DC4535"
                                      : base.borderColor,
                                  "&:hover": {
                                    borderColor:
                                      formik.touched.selectedFinancialYear &&
                                      formik.errors.selectedFinancialYear
                                        ? "#DC4535"
                                        : base.borderColor,
                                  },
                                }),
                              }}
                            />
                            {formik.touched.selectedFinancialYear &&
                              formik.errors.selectedFinancialYear && (
                                <div className="text-danger error-msg ">
                                  {formik.errors.selectedFinancialYear}
                                </div>
                              )}
                          </div>
                        </Col>

                        <Col xl={3}>
                          <div className="mb-3">
                            <Label
                              htmlFor="branch-code-select"
                              className="form-label text-muted placeholder-font"
                            >
                              QUARTER
                            </Label>
                            <Select
                              value={formik.values.quarter}
                              onChange={(option) =>
                                formik.setFieldValue("quarter", option)
                              }
                              options={FinancialQuarters}
                              isClearable
                              className="placeholder-font"
                              id="branch-code-select"
                              styles={{
                                control: (base: any) => ({
                                  ...base,
                                  borderColor:
                                    formik.touched.quarter &&
                                    formik.errors.quarter
                                      ? "#DC4535"
                                      : base.borderColor,
                                  "&:hover": {
                                    borderColor:
                                      formik.touched.quarter &&
                                      formik.errors.quarter
                                        ? "#DC4535"
                                        : base.borderColor,
                                  },
                                }),
                              }}
                            />
                            {formik.touched.quarter &&
                              formik.errors.quarter && (
                                <div className="text-danger error-msg ">
                                  {formik.errors.quarter}
                                </div>
                              )}
                          </div>
                        </Col>
                        <Col
                          xl={3}
                          className="d-flex flex-column-reverse"
                          style={{
                            top:
                              (formik.touched.selectedFinancialYear &&
                                formik.errors.selectedFinancialYear) ||
                              (formik.touched.quarter && formik.errors.quarter)
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
              <Card>
                <CardBody>
                  <DataTable
                    dynamicHeader={qpayoutColumns}
                    tableData={qPayoutData}
                    totalRecords={totalEntries}
                    page={page}
                    onPageChange={handlePageChange}
                    pageSize={10}
                    handleSearchBasedOnInput={handleSearchBasedOnInput}
                    handleSearchUser={handleSearchUser}
                    showSearch={responseStatus}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
          {/* <DataTable /> */}
        </div>
      </div>
    </React.Fragment>
  );
};

export default QuarterlyPayout;
