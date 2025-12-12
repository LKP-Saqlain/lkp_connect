import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Label,
  Row,
  // Input,
  Button,
} from "reactstrap";
// import { regEx } from "../../../helper/method";
// import DownloadIcon from "@mui/icons-material/Download";
import { apiServices } from "../../../services";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../redux/store";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
import Select from "react-select";
// import DataTable from "../../../components/common/table";
// import axios from "axios";
// import { endpoints } from "../../../services/endpoints";
import ShowToast from "../../../utils/toastUtils";
import * as Yup from "yup";
import { useFormik } from "formik";
import "../style.css";
// import { slbmColumns } from "../../../helper/tableColumns.tsx";
import UserInfoTable from "../../../components/common/UserInfoTable";
import { Autocomplete, TextField } from "@mui/material";

// interface Option {
//   label: string;
//   value: string;
// }

const SlbmHoling = ({ activeSubItem }: any) => {
  const [noSortingGroup, setNoSortingGroup] = useState([]);
  const [branchCodeOptions, setBranchCodeOptions] = useState([]);
  const [userData, setUserData] = useState([]);
  // const [totalEntries, setTotalEntries] = useState(null);
  const [responseStatus, setResponseStatus] = useState(false);
  // const [searchValue, setSearchValue] = React.useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [isinRecords, setIsinRecords] = useState<any[]>([]);
  const [inputText, setInputText] = useState<string>("");

  // const [page, setPage] = useState(1); // Track current page

  const dispatch = useDispatch<AppDispatch>();

  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );
  const { accessType } = useSelector(
    (state: RootState) => state.AuthUser?.data?.data
  );

  const validationSchema = Yup.object({
    selectedZone: Yup.object().nullable().required("Zone is required"),
    selectedBranchCode: Yup.object()
      .nullable()
      .required("Branch code is required"),
    isInValue: Yup.string().required("SYMBOL / ISIN is required"),
  });

  interface FormValues {
    selectedZone: { label: string; value: string } | null;
    selectedBranchCode: { label: string; value: string } | null;
    isInValue: string;
  }
  useEffect(() => {
    if (userData.length > 0) {
      // Run logic when new data is loaded
      console.log("New userData loaded", userData);
      // You could filter, process, or trigger a render here
    }
  }, [userData]);

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
      // handleDownloadExcel();
    },
  });

  useEffect(() => {
    dispatch(showLoader("Please wait we are processing your request"));
    apiServices
      .ScripSearch()
      .then((response) => {
        dispatch(hideLoader());
        console.log("scriptSearchResponse", response?.data?.data);

        setIsinRecords(response?.data?.data || []);
      })
      .catch((error) => {
        dispatch(hideLoader());
        console.log("error", error);
      });
  }, []);

  // useEffect(() => {
  //   if (accessType === "") {
  //     handleSubmit();
  //   }
  // }, [accessType, searchValue]);

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

    dispatch(showLoader("Please wait, we are processing your request..."));
    apiServices
      .getDropDown(payload, customHeaders)
      .then((res) => {
        console.log("Response-->", res);
        if (res?.status === 200) {
          let zoneDropdown = res?.data.map((item: any) => ({
            label: item.itemDesc, // This will be displayed in the dropdown
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

  useEffect(() => {
    console.log("formikValuesSLBM", formik.values, formik.errors);
  }, [formik.values]);
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

      dispatch(showLoader("Please wait, we are processing your request..."));

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

  // const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   console.log("value", name, value);
  //   if (regEx.alphaNumeric.test(value)) {
  //     formik.setFieldValue(name, value);
  //   }
  // };

  // const handlePageChange = (
  //   event: React.ChangeEvent<unknown>,
  //   newPage: number
  // ) => {
  //   setPage(newPage);
  //   handleSubmit(event, newPage); // Fetch data for the new page
  // };

  const handleSubmit = async (event?: any, value?: any) => {
    console.log("newPage", event, value);

    const payload = {
      loginName: user_id,
      start: 0,
      pageSize: "600000",
      searchKey: "",
      zone:
        str === "APN-7161"
          ? formik.values.selectedZone?.value
          : accessType === ""
          ? "ALL"
          : formik.values.selectedZone?.value,
      branchCode:
        str === "APN-7161"
          ? formik.values.selectedBranchCode?.value
          : accessType === ""
          ? "ALL"
          : formik.values.selectedBranchCode?.value,
      symbolISIN: formik.values.isInValue,
    };

    dispatch(showLoader("Please wait, we are processing your request..."));

    await apiServices
      .SLBMHoldingsReport(payload)
      .then((response) => {
        console.log("SLBMHoldingsReportResponse", response?.data?.data);

        // setTotalEntries(response?.data?.sLBMHoldings?.[0]?.recordsTotal);

        dispatch(hideLoader());

        if (response?.status === 200) {
          setResponseStatus(true);

          const apiData = response?.data?.data || [];

          // ADD Id:index+1
          const processedData = apiData.map((item: any, index: number) => ({
            Id: index + 1,
            ...item,
          }));
          console.log("ProcessesData", processedData);

          setUserData(processedData);
          setFilteredData(processedData);
        }
      })
      .catch((error) => {
        dispatch(hideLoader());

        console.error("errorMsg", error?.response?.data?.message);

        const errors = error?.response?.data?.errors;

        if (errors) {
          const zoneError = errors?.zn?.[0];
          const branchError = errors?.bc?.[0];

          if (zoneError) ShowToast("error", zoneError);
          if (branchError) ShowToast("error", branchError);
        } else {
          ShowToast("error", error?.response?.data?.message);
        }
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  const handleSearchBasedOnInput = (value: string) => {
    console.log("handleSearchBasedOnInputValue", value);
    const query = value;
    setSearchQuery(query);

    const lowerCaseValue = value.toLowerCase();

    const filtered = userData.filter((item: any) => {
      const clientNameMatch = item.clientName
        ?.toLowerCase()
        .includes(lowerCaseValue);
      const accountCodeMatch = item.clientCode
        ?.toString()
        .toLowerCase()
        .includes(lowerCaseValue);

      // Optional: keep other fields also searchable
      const otherMatch = Object.keys(item).some((key) =>
        item[key]?.toString().toLowerCase().includes(lowerCaseValue)
      );

      return clientNameMatch || accountCodeMatch || otherMatch;
    });

    setFilteredData(filtered);
    console.log("filteredSearch Records", filtered);
  };

  document.title = "LKP Securities | Dormant Client Report";

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
                    backgroundColor: "#fff",
                    padding: "0.2rem 0.8rem",
                  }}
                >
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
                          </div>
                        </Col>

                        <Col xl={3}>
                          <div className="mb-3" style={{ maxWidth: "300px" }}>
                            <Label
                              htmlFor="branch-code-select"
                              className="form-label text-muted label-font"
                            >
                              Branch Code
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
                          <div className="mb-3">
                            <Label
                              htmlFor="choices-text-remove-button"
                              className="form-label text-muted label-font"
                            >
                              Symbol / ISIN
                            </Label>
                            <Autocomplete
                              freeSolo
                              options={isinRecords}
                              getOptionLabel={(option) =>
                                typeof option === "string"
                                  ? option
                                  : option.scn || ""
                              }
                              filterOptions={(options, state) =>
                                options.filter((option) => {
                                  const input = state.inputValue.toLowerCase();
                                  return (
                                    option.scn?.toLowerCase().includes(input) ||
                                    option.bse?.toLowerCase().includes(input) ||
                                    option.nse?.toLowerCase().includes(input) ||
                                    option.isin?.toLowerCase().includes(input)
                                  );
                                })
                              }
                              value={
                                isinRecords.find(
                                  (item) =>
                                    item.isin === formik.values.isInValue
                                ) || null
                              }
                              inputValue={inputText}
                              onInputChange={(event, newInputValue) => {
                                setInputText(newInputValue);
                                console.log(event);

                                if (newInputValue === "") {
                                  formik.setFieldValue("isInValue", "");
                                }
                              }}
                              onChange={(event, newValue) => {
                                if (newValue && typeof newValue !== "string") {
                                  console.log(event);
                                  formik.setFieldValue(
                                    "isInValue",
                                    newValue.isin || ""
                                  );
                                  setInputText(newValue.isin || "");
                                } else {
                                  formik.setFieldValue("isInValue", "");
                                  setInputText("");
                                }
                              }}
                              renderOption={(props, option) => (
                                <li {...props} key={option.isin}>
                                  {option.scn}
                                </li>
                              )}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder="Please search ISIN"
                                  name="isInValue"
                                  onBlur={formik.handleBlur}
                                  error={
                                    formik.touched.isInValue &&
                                    Boolean(formik.errors.isInValue)
                                  }
                                  helperText={
                                    formik.touched.isInValue &&
                                    formik.errors.isInValue
                                      ? formik.errors.isInValue
                                      : ""
                                  }
                                  size="small"
                                />
                              )}
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
                                ? "-25px"
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
                                ? "-25px"
                                : "",
                          }}
                        >
                          <div className="mb-3" />
                          {/* <Button
                            style={{
                              backgroundColor: "#11395C",
                              fontSize: "12px",
                              height: "40px",
                            }}
                            type="button"
                            onClick={handleDownloadExcel}
                          >
                            Excel
                            <DownloadIcon fontSize="small" />
                          </Button> */}
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
                  {/* <DataTable
                    dynamicHeader={slbmColumns}
                    tableData={userData}
                    totalRecords={totalEntries}
                    page={page}
                    onPageChange={handlePageChange}
                    pageSize={10}
                    handleSearchBasedOnInput={handleSearchBasedOnInput}
                    handleSearchUser={handleSearchUser}
                    showSearch={responseStatus}
                    handleExcelDownload={handleDownloadExcel}
                    searchValue={searchQuery}
                  /> */}
                  <UserInfoTable
                    showSearch={responseStatus}
                    activeSubItem={activeSubItem}
                    T6Data={userData ? filteredData : filteredData}
                    handleSearchBasedOnInput={handleSearchBasedOnInput}
                    searchValue={searchQuery}
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
