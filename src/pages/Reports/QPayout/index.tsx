import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  // Label,
  Row,
  // Button,
} from "reactstrap";
import { apiServices } from "../../../services";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../redux/store";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
// import Select from "react-select";
// import DataTable from "../../../components/common/table";
// import { GridColDef } from "@mui/x-data-grid";
import ShowToast from "../../../utils/toastUtils";
// import * as Yup from "yup";
// import { useFormik } from "formik";
import "../style.css";
import UserInfoTable from "../../../components/common/UserInfoTable";

// const FinancialYears = [{ value: "2024-2025", label: "2024-2025" }];
// const FinancialQuarters = [
//   { value: "Q1", label: "Q1" },
//   { value: "Q2", label: "Q2" },
//   { value: "Q3", label: "Q3" },
//   { value: "Q4", label: "Q4" },
// ];

const QuarterlyPayout = ({ activeSubItem }: any) => {
  const [qPayoutData, setQpayoutData] = useState([]);
  // const [totalEntries, setTotalEntries] = useState(null);
  // const [searchValue, setSearchValue] = React.useState("");
  const [responseStatus, setResponseStatus] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // const [page, setPage] = useState(1); // Track current page
  // const [pageSize, setPageSize] = useState(10); // Initial page size

  const dispatch = useDispatch<AppDispatch>();

  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );

  // useEffect(() => {
  //   if (responseStatus && searchValue.length === 0) {
  //     handleSubmit();
  //   }
  // }, [responseStatus, searchValue]);

  // const validationSchema = Yup.object({
  //   selectedFinancialYear: Yup.object()
  //     .nullable()
  //     .required("Financial Year is Required"),
  //   quarter: Yup.object()
  //     .nullable()
  //     .required("Please select Financial Quarter"),
  // });

  // interface FormValues {
  //   selectedFinancialYear: { label: string; value: string } | null;
  //   quarter: { label: string; value: string } | null;
  // }

  // const formik = useFormik<FormValues>({
  //   initialValues: {
  //     selectedFinancialYear: null,
  //     quarter: null,
  //   },
  //   // validationSchema,
  //   onSubmit: (values) => {
  //     // Only called if no validation errors
  //     console.log("values1-->", values);
  //     // handleSubmit(values);
  //   },
  // });

  // const handlePageChange = (
  //   event: React.ChangeEvent<unknown>,
  //   newPage: number
  // ) => {
  //   setPage(newPage);
  //   handleSubmit(event, newPage); // Fetch data for the new page
  // };

  // const handleSubmit = async (event?: any, value?: any) => {};

  const isSmallScreen = window.innerWidth < 768;

  console.log(isSmallScreen);

  const handleSearchBasedOnInput = (value: string) => {
    console.log("handleSearchBasedOnInputValue", value);
    // setSearchValue(value);
    const query = value;
    setSearchQuery(query);

    const lowerCaseValue = value.toLowerCase();

    const filtered = qPayoutData.filter((item: any) =>
      Object.keys(item).some((key) =>
        item[key]?.toString().toLowerCase().includes(lowerCaseValue)
      )
    );

    setFilteredData(filtered);
    console.log("filteredSearch Records", filteredData);
  };

  // const handleSearchUser = async () => {
  //   const pageSize = 10; // Define pageSize
  //   setQpayoutData([]);
  //   // Calculate start based on the new page (0-indexed)
  //   // const start = (value - 1) * pageSize;

  //   const payload = {
  //     start: pageSize,
  //     pageSize: 10,
  //     searchKey: searchValue !== "" ? searchValue : "",
  //     userId: user_id,
  //     financialQtr: `2024-${formik.values.quarter?.value}`,
  //   };
  //   dispatch(showLoader(""));
  //   await apiServices
  //     .GetQuaterlyPayoutGrid(payload)
  //     .then((response) => {
  //       console.log("responseQpayout", response?.data);
  //       const { recordsTotal } = response?.data[0];
  //       setTotalEntries(recordsTotal);
  //       dispatch(hideLoader());
  //       if (response?.status === 200) {
  //         setQpayoutData(response.data);
  //       }
  //     })
  //     .catch((Err) => {
  //       const { message } = Err.response.data;
  //       console.log("Error->", message);
  //       dispatch(hideLoader());
  //       // formik.setFieldError("password", message);
  //       const errorMessage = Err.response.data.message;
  //       ShowToast(
  //         "error",
  //         errorMessage ||
  //           "Sorry for the inconvenience, please try after some time."
  //       );
  //     })
  //     .finally(() => {
  //       dispatch(hideLoader());
  //     });
  // };

  useEffect(() => {
    const fetchQPayout = async () => {
      console.log(event);
      setQpayoutData([]);
      setResponseStatus(false);
      // const Id = localStorage.getItem("Id");
      // const pageSize = 10; // Define pageSize

      // Calculate start based on the new page (0-indexed)
      // const start = (value - 1) * pageSize;

      // Get the current month and year
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
      let year = currentDate.getFullYear();
      let previousQuarter;

      // Determine the current quarter based on your custom mapping
      if (currentMonth >= 3 && currentMonth <= 5) {
        previousQuarter = 4;
        year -= 1; // Q4 belongs to the previous year
      } else if (currentMonth >= 6 && currentMonth <= 8) {
        previousQuarter = 1;
      } else if (currentMonth >= 9 && currentMonth <= 11) {
        previousQuarter = 2;
      } else {
        previousQuarter = 3;
      }

      // Construct the financial quarter string
      // const financialQtr = `${year}-Q${previousQuarter}`;   //no data in 2025 so added 2024
      const financialQtr = `${2024}-Q${previousQuarter}`;

      const payload = {
        start: 0,
        pageSize: 30000,
        searchKey: "",
        userId: user_id,
        financialQtr: financialQtr,
      };
      dispatch(showLoader(""));
      await apiServices
        .GetQuaterlyPayoutGrid(payload)
        .then((response) => {
          console.log("responseQpayout", response?.data);
          // const { recordsTotal } = response?.data[0];
          // setTotalEntries(recordsTotal);
          dispatch(hideLoader());
          if (response?.status === 200) {
            setResponseStatus(true);
            setQpayoutData(response?.data || []);
            setFilteredData(response?.data || []);
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
    fetchQPayout();
  }, [dispatch]);

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
                    Quarterly Payout Recovery Report - (Jan 25 - Mar 25)
                  </h4>
                </CardHeader>
                <CardBody>
                  {/* <DataTable
                    dynamicHeader={qpayoutColumns}
                    tableData={qPayoutData}
                    totalRecords={totalEntries}
                    page={page}
                    onPageChange={handlePageChange}
                    pageSize={10}
                    handleSearchBasedOnInput={handleSearchBasedOnInput}
                    handleSearchUser={handleSearchUser}
                    showSearch={responseStatus}
                    showExcel={false}
                  /> */}

                  <UserInfoTable
                    showSearch={responseStatus}
                    activeSubItem={activeSubItem}
                    T6Data={qPayoutData ? filteredData : filteredData}
                    handleSearchBasedOnInput={handleSearchBasedOnInput}
                    searchValue={searchQuery}
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
