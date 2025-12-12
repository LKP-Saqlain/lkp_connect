import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Label,
  Row,
  Button,
} from "reactstrap";
// import DownloadIcon from "@mui/icons-material/Download";
import { apiServices } from "../../../services";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../redux/store";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
import Select from "react-select";
// import DataTable from "../../../components/common/table";
// import { GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import { endpoints } from "../../../services/endpoints";
import ShowToast from "../../../utils/toastUtils";
// import * as Yup from "yup";
import { useFormik } from "formik";
import "../style.css";
// import Tooltip from "@mui/material/Tooltip";
import UserInfoTable from "../../../components/common/UserInfoTable";

const ClientStatus = [
  { value: "ALL", label: "ALL" },
  { value: "ACTIVE", label: "ACTIVE" },
  { value: "INACTIVE", label: "INACTIVE" },
  //   { value: "Madrid", label: "Madrid" },
  //   { value: "Toronto", label: "Toronto" },
];

// interface Option {
//   label: string;
//   value: string;
// }

const DormantClient = ({ activeSubItem }: any) => {
  const [noSortingGroup, setNoSortingGroup] = useState([]);
  const [branchCodeOptions, setBranchCodeOptions] = useState([]);
  const [userData, setUserData] = useState([]);
  const [responseStatus, setResponseStatus] = useState(false);
  // const [totalEntries, setTotalEntries] = useState(null);
  // const [searchValue, setSearchValue] = React.useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // const [page, setPage] = useState(1); // Track current page

  // const data = useSelector((state: RootState) => state.dormantReport.data);
  const dispatch = useDispatch<AppDispatch>();

  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );

  const { accessType } = useSelector(
    (state: RootState) => state.AuthUser?.data?.data
  );
  console.log("accessType", accessType);

  // const validationSchema = Yup.object({
  //   selectedZone: Yup.object().nullable().required("Zone is required"),
  //   selectedBranchCode: Yup.object()
  //     .nullable()
  //     .required("Branch code is required"),
  //   selectedClientStatus: Yup.object()
  //     .nullable()
  //     .required("Client status is required"),
  // });

  useEffect(() => {
    const fetchDormantData = async () => {
      const payload = {
        start: 0,
        pageSize: 1000,
        searchKey: "",
        loginName: user_id,
        zone: accessType === "" ? "ALL" : formik.values.selectedZone?.value,
        branchCode:
          accessType === "" ? "ALL" : formik.values.selectedBranchCode?.value,
        clientStatus:
          formik.values.selectedClientStatus?.value === "ACTIVE"
            ? "Y"
            : formik.values.selectedClientStatus?.value === "INACTIVE"
            ? "N"
            : "ALL",
      };

      dispatch(showLoader("Please wait, we are processing your request..."));

      try {
        const response = await apiServices.getDormantReport(payload);
        dispatch(hideLoader());

        if (response?.status === 200) {
          setResponseStatus(true);

          console.log("getDormantReport_response_1", response?.data?.data);
          const processedData = (response?.data.data || []).map(
            (item: any, index: number) => ({
              Id: index + 1, // <= UNIQUE ID
              ...item,
            })
          );

          setUserData(processedData);
          setFilteredData(processedData);
        } else if (response?.status === 400) {
          console.log("getDormantReport_response", response);
        }
      } catch (error: any) {
        console.log("Error->", error?.response?.data?.message);
        ShowToast("error", error?.response?.data?.message);
      } finally {
        dispatch(hideLoader());
      }
    };

    if (accessType === "") {
      fetchDormantData();
    }
  }, [dispatch]);

  useEffect(() => {
    console.log("accessType", accessType, typeof accessType);
  }, [accessType]);

  interface FormValues {
    selectedZone: { label: string; value: string } | null;
    selectedBranchCode: { label: string; value: string } | null;
    selectedClientStatus: { label: string; value: string } | null;
  }

  const formik = useFormik<FormValues>({
    initialValues: {
      selectedZone: null,
      selectedBranchCode: null,
      selectedClientStatus: null,
    },
    // validationSchema,
    onSubmit: (values) => {
      // Only called if no validation errors
      console.log("values1-->", values);
      handleSubmit(values);
      // handleExcelDownload();
    },
  });

  useEffect(() => {
    console.log("formikValls", formik.values, formik.errors);
  }, [formik.values]);

  useEffect(() => {
    if (accessType === "ALL" || accessType === "ZONE") {
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
    }
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

      dispatch(showLoader("Please wait, we are processing your request..."));

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

  // const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = e.target.value;
  //   console.log("value", value);
  //   if (regEx.alphaNumeric.test(value)) {
  //     setPnlValues(value.toUpperCase().replace(/\s/g, ""));
  //   }
  // };
  // const handlePageChange = (
  //   event: React.ChangeEvent<unknown>,
  //   newPage: number
  // ) => {
  //   setPage(newPage);
  //   handleSubmit(event, newPage); // Fetch data for the new page
  // };

  const handleSearchBasedOnInput = (value: string) => {
    console.log("handleSearchBasedOnInputValue", value);
    const query = value;
    setSearchQuery(query);

    const lowerCaseValue = value.toLowerCase();

    const filtered = userData.filter((item: any) => {
      const clientNameMatch = item.clientName
        ?.toLowerCase()
        .includes(lowerCaseValue);
      const accountCodeMatch = item.ctermcode
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

  // const handleSearchUser = async () => {
  //   setUserData([]);
  //   if (searchValue !== "") {
  //     const pageSize = 100; // Define pageSize

  //     // Calculate start based on the new page (0-indexed)
  //     // const start = (value - 1) * pageSize;
  //     const payload = {
  //       start: pageSize, // Calculate start based on the new page
  //       pageSize: 100,
  //       searchKey: searchValue !== "" ? searchValue : "",
  //       loginName: user_id,
  //       zone: accessType === "" ? "ALL" : formik.values.selectedZone?.value,
  //       branchCode:
  //         accessType === "" ? "ALL" : formik.values.selectedBranchCode?.value,
  //       clientStatus:
  //         formik.values.selectedClientStatus?.value === "ACTIVE"
  //           ? "Y"
  //           : formik.values.selectedClientStatus?.value === "INACTIVE"
  //           ? "N"
  //           : "ALL",
  //     };
  //     dispatch(showLoader("Please wait, we are processing your request..."));
  //     await apiServices
  //       .getDormantReport(payload)
  //       .then((response) => {
  //         dispatch(hideLoader());
  //         if (response?.status === 200) {
  //           setResponseStatus(true);
  //           let { recordsTotal } = response?.data[0];
  //           console.log("getDormantReport_response_1", response?.data);
  //           setTotalEntries(recordsTotal);
  //           setUserData(response.data);
  //         }
  //       })
  //       .catch((error) => {
  //         console.error("error", error.status);
  //         if (error.status === 400) {
  //           ShowToast("error", error?.response?.data?.message);
  //         } else {
  //           console.log("Error->", error.response.data.errors.Zone["0"]);
  //           const zoneError = error.response.data.errors.Zone["0"];
  //           const branchCodeError = error.response.data.errors.BranchCode["0"];
  //           dispatch(hideLoader());
  //           ShowToast("error", zoneError);
  //           ShowToast("error", branchCodeError);
  //         }
  //       })
  //       .finally(() => {
  //         dispatch(hideLoader());
  //       });
  //   }
  // };

  const handleSubmit = async (event?: any, value?: any) => {
    console.log("newPage", event, value);

    const pageSize = 1000;

    const start = (value - 1) * pageSize;

    const payload = {
      start: value === undefined ? 0 : start,
      pageSize: 35000,
      searchKey: "",
      loginName: user_id,
      zone: accessType === "" ? "ALL" : formik.values.selectedZone?.value,
      branchCode:
        accessType === "" ? "ALL" : formik.values.selectedBranchCode?.value,
      clientStatus:
        formik.values.selectedClientStatus?.value === "ACTIVE"
          ? "Y"
          : formik.values.selectedClientStatus?.value === "INACTIVE"
          ? "N"
          : "ALL",
    };

    dispatch(showLoader("Please wait, we are processing your request..."));

    try {
      const response = await apiServices.getDormantReport(payload);
      dispatch(hideLoader());

      if (response?.status === 200) {
        setResponseStatus(true);

        console.log("getDormantReport_response_1", response?.data?.data);

        // ***** ADD ID TO EACH ROW *****
        const processedData = (response?.data?.data).map(
          (item: any, index: number) => ({
            Id: index + 1, // Ensure DataGrid always has a unique ID
            ...item,
          })
        );
        console.log("processedData", processedData);

        setUserData(processedData);
        setFilteredData(processedData);
      } else if (response?.status === 400) {
        console.log("getDormantReport_response", response);
      }
    } catch (error: any) {
      dispatch(hideLoader());

      console.log("ERRORS", error?.response?.data);
      ShowToast("error", error?.response?.data?.message);
    } finally {
      dispatch(hideLoader());
    }
  };

  const handleExcelDownload = () => {
    // const Id = localStorage.getItem("Id");
    if (accessType !== "") {
      if (!formik.values.selectedZone || !formik.values.selectedBranchCode) {
        formik.setTouched({
          selectedZone: true,
          selectedBranchCode: true,
        });
        return; // Stop execution if validation fails
      }
    }
    const payload = {
      start: 0,
      pageSize: 35000,
      searchKey: "",
      loginName: user_id,
      zone: accessType === "" ? "ALL" : formik.values.selectedZone?.value,
      branchCode:
        accessType === "" ? "ALL" : formik.values.selectedBranchCode?.value,
      clientStatus:
        formik.values.selectedClientStatus?.value === "ACTIVE"
          ? "Y"
          : formik.values.selectedClientStatus?.value === "INACTIVE"
          ? "N"
          : "ALL",
    };

    let token = localStorage.getItem("tkn");
    dispatch(showLoader("Please wait, we are processing your request..."));
    console.log("payload-->excel", payload);
    axios
      .post(
        `https://middlewareapi.lkp.net.in${endpoints.getDormantExcel}`,
        payload,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "file.xlsx"); // Specify the file name
        document.body.appendChild(link);
        link.click();
        dispatch(hideLoader());
        console.log("response111", response);
      })
      .catch((error) => {
        dispatch(hideLoader());
        if (axios.isAxiosError(error) && error.response) {
          console.log("Error", error);
          // Check if error.response exists
          const validationErrors = error.response.data.errors;
          if (validationErrors) {
            // Create a message to display the validation errors
            const errorMessages = Object.values(validationErrors)
              .flat() // Flatten the array of error messages
              .join(", "); // Join messages into a single string
            ShowToast("error", errorMessages);
          } else {
            // Handle other types of errors
            ShowToast("error", error.message);
            // dispatch(ShowToast(`An error occurred: ${error.message}`));
          }
        } else {
          // Handle general errors not related to Axios
          ShowToast("error", "An unexpected error occurred.");
          // dispatch(ShowToast(`An unexpected error occurred.`));
        }
      });
  };

  document.title = "LKP Securities | Dormant Client Report";

  return (
    <React.Fragment>
      <div className="page-content page-view">
        <div className="container-fluid">
          <Row className="row-font">
            <Col lg={12}>
              {accessType !== "" && (
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
                    <h4 className="card-title mb-0">Dormant Client Report</h4>
                  </CardHeader>
                  <CardBody>
                    <form onSubmit={formik.handleSubmit}>
                      <div>
                        <Row>
                          <Col xl={3}>
                            <div className="mb-3">
                              <Label
                                htmlFor="zone-select"
                                className="form-label text-muted label-font"
                              >
                                Zone
                              </Label>
                              <Select
                                // value={selectedZone}
                                value={formik.values.selectedZone}
                                onChange={(option: any) =>
                                  formik.setFieldValue("selectedZone", option)
                                }
                                onBlur={formik.handleBlur}
                                options={noSortingGroup}
                                className="placeholder-font"
                                isClearable
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
                                  <div className="text-danger error-msg">
                                    {formik.errors.selectedZone}
                                  </div>
                                )}
                            </div>
                          </Col>

                          <Col xl={3}>
                            <div className="mb-3">
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
                                className="placeholder-font"
                                isClearable
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
                                  <div className="text-danger error-msg">
                                    {formik.errors.selectedBranchCode}
                                  </div>
                                )}
                            </div>
                          </Col>

                          <Col xl={3}>
                            <div className="mb-3">
                              <Label
                                htmlFor="client-status-select"
                                className="form-label text-muted label-font"
                              >
                                Client Status
                              </Label>
                              <Select
                                value={formik.values.selectedClientStatus}
                                onChange={(option) =>
                                  formik.setFieldValue(
                                    "selectedClientStatus",
                                    option
                                  )
                                }
                                onBlur={formik.handleBlur}
                                options={ClientStatus}
                                className="placeholder-font"
                                isClearable
                                id="client-status-select"
                                styles={{
                                  control: (base: any) => ({
                                    ...base,
                                    cursor: "pointer",
                                    borderColor:
                                      formik.touched.selectedClientStatus &&
                                      formik.errors.selectedClientStatus
                                        ? "#DC4535"
                                        : base.borderColor,
                                    "&:hover": {
                                      borderColor:
                                        formik.touched.selectedClientStatus &&
                                        formik.errors.selectedClientStatus
                                          ? "#DC4535"
                                          : base.borderColor,
                                    },
                                  }),
                                }}
                              />
                              {formik.touched.selectedClientStatus &&
                                formik.errors.selectedClientStatus && (
                                  <div className="text-danger error-msg">
                                    {formik.errors.selectedClientStatus}
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
                                (formik.touched.selectedClientStatus &&
                                  formik.errors.selectedClientStatus)
                                  ? "-18px"
                                  : "",
                            }}
                          >
                            <div className="mb-3" />
                            <Button
                              className="btn-font"
                              style={{
                                backgroundColor: "#11395C",
                                height: "40px",
                                minWidth: "200px",
                              }}
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
                                (formik.touched.selectedClientStatus &&
                                  formik.errors.selectedClientStatus)
                                  ? "-18px"
                                  : "",
                            }}
                          >
                            <div className="mb-3" />
                            {/* <Button
                              className="btn-font"
                              style={{
                                backgroundColor: "#11395C",
                                height: "40px",
                              }}
                              onClick={handleExcelDownload}
                              type="button"
                            >
                              Excel
                              <DownloadIcon />
                            </Button> */}
                          </Col>
                        </Row>
                      </div>
                    </form>
                  </CardBody>
                </Card>
              )}
              {/* <SearchAppBar /> */}
              <Card
                style={{
                  borderRadius: "15px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                }}
              >
                {accessType === "" && (
                  <CardHeader
                    style={{
                      borderRadius: "15px 15px 0 0",
                      boxShadow: "0 -4px 8px rgba(0, 0, 0, 0.15)",
                      backgroundColor: "#fff", // optional for contrast
                    }}
                  >
                    <h4 className="card-title mb-0">Dormant Client Report</h4>
                  </CardHeader>
                )}
                <CardBody style={{ zIndex: 0 }}>
                  {/* <DataTable
                    dynamicHeader={dormantColumns}
                    tableData={userData}
                    totalRecords={totalEntries}
                    page={page}
                    onPageChange={handlePageChange}
                    pageSize={10}
                    customPageSize={true}
                    handleSearchBasedOnInput={handleSearchBasedOnInput}
                    handleSearchUser={handleSearchUser}
                    showSearch={responseStatus}
                    showExcel={true}
                    handleExcelDownload={handleExcelDownload}
                  /> */}
                  <UserInfoTable
                    showSearch={responseStatus}
                    activeSubItem={activeSubItem}
                    T6Data={userData ? filteredData : filteredData}
                    handleSearchBasedOnInput={handleSearchBasedOnInput}
                    searchValue={searchQuery}
                    showExcel={true}
                    handleExcelDownload={handleExcelDownload}
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

export default DormantClient;
