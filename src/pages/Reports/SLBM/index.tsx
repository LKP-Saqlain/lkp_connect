import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Label,
  Row,
  Input,
  Button,
} from "reactstrap";
import { regEx } from "../../../helper/method";
import DownloadIcon from "@mui/icons-material/Download";
import { apiServices } from "../../../services";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../redux/store";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
import Select from "react-select";
import DataTable from "../../../components/common/table";
import { GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import { endpoints } from "../../../services/endpoints";
import ShowToast from "../../../utils/toastUtils";
import * as Yup from "yup";
import { useFormik } from "formik";
import "../style.css";

// interface Option {
//   label: string;
//   value: string;
// }

const SlbmHoling = () => {
  const [noSortingGroup, setNoSortingGroup] = useState([]);
  const [branchCodeOptions, setBranchCodeOptions] = useState([]);
  const [userData, setUserData] = useState([]);
  const [totalEntries, setTotalEntries] = useState(null);
  const [responseStatus, setResponseStatus] = useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  const [page, setPage] = useState(1); // Track current page

  const dispatch = useDispatch<AppDispatch>();

  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );

  const validationSchema = Yup.object({
    selectedZone: Yup.object().nullable().required("Zone is required"),
    selectedBranchCode: Yup.object()
      .nullable()
      .required("Branch code is required"),
    // isInValue: Yup.string().required("SYMBOL / ISIN is required"),
  });

  interface FormValues {
    selectedZone: { label: string; value: string } | null;
    selectedBranchCode: { label: string; value: string } | null;
    isInValue: string;
  }

  const formik = useFormik<FormValues>({
    initialValues: {
      selectedZone: null,
      selectedBranchCode: null,
      isInValue: "",
    },
    validationSchema,
    onSubmit: (values) => {
      // Only called if no validation errors
      console.log("values1-->", values);
      handleSubmit(values);
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
      user_id: extractUserId,
      option: "zone",
      userType: userType === "Employee" ? "EMP" : userType,
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
    console.log("formikValuesSLBM", formik.values, formik.errors);
  }, [formik.values]);

  useEffect(() => {
    if (formik.values.selectedZone) {
      const str = user_id;
      const userType = localStorage.getItem("uIdType");
      let extractUserId: string | null = null;

      if (str) {
        const parts = str.split("-");
        if (parts.length > 1) {
          extractUserId = parts[1];
        }
      }
      const payload = {
        user_id: extractUserId,
        option: "BranchByZone",
        userType: userType === "Employee" ? "EMP" : userType,
        zone: formik.values.selectedZone.value,
      };

      dispatch(showLoader(""));

      apiServices
        .getDropDown(payload)
        .then((res) => {
          console.log("response->", res);
          if (res?.status === 200) {
            let branchDropdown = res?.data.map((item: any) => ({
              label: item.itemVal, // Display value in dropdown
              value: item.itemVal, // Actual value of the dropdown item
            }));
            branchDropdown = [
              { label: "ALL", value: "ALL" },
              ...branchDropdown,
            ];

            setBranchCodeOptions(branchDropdown); // Set the updated branch dropdown
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

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log("value", name, value);
    if (regEx.alphaNumeric.test(value)) {
      formik.setFieldValue(name, value);
    }
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    setPage(newPage);
    handleSubmit(event, newPage); // Fetch data for the new page
  };

  const handleSubmit = async (event?: any, value?: any) => {
    console.log("newPage", event, value);
    // formik.setFieldValue("selectedZone", {});
    // formik.setFieldValue("selectedBranchCode", {});
    // formik.setFieldValue("isInValue", "");
    // let Id = localStorage.getItem("Id");
    const pageSize = 10; // Define pageSize

    // Calculate start based on the new page (0-indexed)
    const start = (value - 1) * pageSize;

    const payload = {
      loginName: user_id,
      start: value === undefined ? 0 : start, // Calculate start based on the new page
      pageSize: 10,
      searchKey: "",
      zone: formik.values.selectedZone?.value,
      branchCode: formik.values.selectedBranchCode?.value,
      symbolISIN: formik.values.isInValue,
    };
    dispatch(showLoader(""));
    await apiServices
      .SLBMHoldingsReport(payload)
      .then((response) => {
        console.log("response", response?.data);
        console.log("response", response?.data?.sLBMHoldings[0]);
        const { recordsTotal } = response?.data?.sLBMHoldings[0];
        setTotalEntries(recordsTotal);
        dispatch(hideLoader());
        if (response?.status === 200) {
          setResponseStatus(true);
          setUserData(response.data?.sLBMHoldings);
        }
      })
      .catch((error) => {
        console.log("Error->", error.response);
        // const zoneError = error.response?.data?.errors?.Zone["0"];
        // const branchCodeError = error?.response?.data?.errors?.BranchCode["0"];
        dispatch(hideLoader());
        ShowToast("error", error.response?.data?.message);
        // ShowToast("error", zoneError);
        // ShowToast("error", branchCodeError);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  const slbmColumns: GridColDef[] = [
    { field: "zone", headerName: "Zone", width: 100 },
    { field: "branchCode", headerName: "Branch Code", width: 150 },
    { field: "clientCode", headerName: "Client Code", width: 150 },
    { field: "clientName", headerName: "Client Name", width: 150 },
    { field: "scripName", headerName: "Scrip Name", width: 150 },
    { field: "isin", headerName: "ISIN", width: 150 },
    { field: "qtny", headerName: "Qtny", width: 100 },
    { field: "rmName", headerName: "RM Name", width: 150 },
    { field: "dealerName", headerName: "Dealer Name", width: 150 },
    { field: "slbmStatus", headerName: "SLBM Status", width: 150 },
  ];

  const handleDownloadExcel = async () => {
    // const Id = localStorage.getItem("Id");
    const payload = {
      loginName: user_id,
      start: 0,
      pageSize: 10,
      searchKey: "",
      zone: formik.values.selectedZone?.value,
      branchCode: formik.values.selectedBranchCode?.value,
      symbolISIN: formik.values.isInValue,
    };
    try {
      let token = localStorage.getItem("tkn");
      dispatch(showLoader("Please wait, We are Processing your Request"));
      const response = await axios.post(
        `https://middlewareapi.lkp.net.in${endpoints.SLBMHoldingsReportExcel}`,
        payload,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "file.xlsx"); // Specify the file name
      document.body.appendChild(link);
      link.click();
      dispatch(hideLoader());
    } catch (error: any) {
      console.error("Download error", error?.message);
      dispatch(hideLoader());
      ShowToast(
        "error",
        error?.message ||
          "Sorry for the inconvenience, please try after some time."
      );
    }
  };

  const handleSearchBasedOnInput = (value: string) => {
    console.log("handleSearchBasedOnInputValue", value);
    setSearchValue(value);
  };

  const handleSearchUser = async () => {
    setUserData([]);
    if (searchValue !== "") {
      const pageSize = 10; // Define pageSize

      // Calculate start based on the new page (0-indexed)
      // const start = (value - 1) * pageSize;

      const payload = {
        loginName: user_id,
        start: pageSize, // Calculate start based on the new page
        pageSize: 10,
        searchKey: searchValue !== "" ? searchValue : "",
        zone: formik.values.selectedZone?.value,
        branchCode: formik.values.selectedBranchCode?.value,
        symbolISIN: formik.values.isInValue,
      };
      dispatch(showLoader(""));
      await apiServices
        .SLBMHoldingsReport(payload)
        .then((response) => {
          console.log("response", response?.data);
          console.log("response", response?.data?.sLBMHoldings[0]);
          const { recordsTotal } = response?.data?.sLBMHoldings[0];
          setTotalEntries(recordsTotal);
          dispatch(hideLoader());
          if (response?.status === 200) {
            setResponseStatus(true);
            setUserData(response.data?.sLBMHoldings);
          }
        })
        .catch((error) => {
          console.log("Error->", error.response);
          // const zoneError = error.response?.data?.errors?.Zone["0"];
          // const branchCodeError = error?.response?.data?.errors?.BranchCode["0"];
          dispatch(hideLoader());
          ShowToast("error", error.response?.data?.message);
          // ShowToast("error", zoneError);
          // ShowToast("error", branchCodeError);
        })
        .finally(() => {
          dispatch(hideLoader());
        });
    }
  };

  document.title = "LKP Securities | Dormant Client Report";

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Row className="row-font">
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <h4 className="card-title mb-0">
                    SLBM Client Holding Report
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
                          <div className="mb-3">
                            <Label
                              htmlFor="choices-text-remove-button"
                              className="form-label text-muted label-font"
                            >
                              SYMBOL / ISIN
                            </Label>
                            <Input
                              name="isInValue"
                              type="text"
                              className={`core-report-form-control ${
                                formik.touched.isInValue &&
                                formik.errors.isInValue
                                  ? "is-invalid"
                                  : ""
                              }`} // Add 'is-invalid' class if there's an error
                              value={formik.values.isInValue}
                              placeholder="Please enter SYMBOL/ININ"
                              onChange={handleOnChange}
                              onBlur={formik.handleBlur}
                              id="choices-text-remove-button"
                              invalid={
                                formik.touched.isInValue &&
                                Boolean(formik.errors.isInValue)
                              }
                              data-choices
                              data-choices-limit="3"
                              styles={{
                                control: (base: any) => ({
                                  ...base,
                                  borderColor:
                                    formik.touched.isInValue &&
                                    formik.errors.isInValue
                                      ? "#DC4535"
                                      : base.borderColor,
                                  "&:hover": {
                                    borderColor:
                                      formik.touched.isInValue &&
                                      formik.errors.isInValue
                                        ? "#DC4535"
                                        : base.borderColor,
                                  },
                                }),
                              }}
                            />
                            {formik.touched.isInValue &&
                              formik.errors.isInValue && (
                                <div
                                  className="text-danger"
                                  style={{ fontSize: "12px" }}
                                >
                                  {formik.errors.isInValue}
                                </div>
                              )}
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
                            }}
                            // onClick={handleSubmit}
                            type="submit"
                          >
                            Submit
                          </Button>
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
                            }}
                            onClick={handleDownloadExcel}
                          >
                            Excel
                            <DownloadIcon fontSize="small" />
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
                    dynamicHeader={slbmColumns}
                    tableData={userData}
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
        </div>
      </div>
    </React.Fragment>
  );
};

export default SlbmHoling;
