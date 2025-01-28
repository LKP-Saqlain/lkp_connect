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
        start: 0, // Calculate start based on the new page
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
      dispatch(showLoader(""));
      // const test = dispatch(fetchDormantReport(payload));
      // console.log("testReduxThnk", test);
      await apiServices
        .getDormantReport(payload)
        .then((response) => {
          dispatch(hideLoader());
          if (response?.status === 200) {
            setResponseStatus(true);
            // let { recordsTotal } = response?.data[0];
            console.log("getDormantReport_response_1", response?.data);
            // setTotalEntries(recordsTotal);
            setUserData(response?.data || []);
            setFilteredData(response?.data || []);
          } else if (response?.status == 400) {
            console.log("getDormantReport_response", response);
          }
        })
        .catch((error) => {
          // console.log("Error->", error.response.data.errors.Zone["0"]);
          console.log("Error->", error?.response?.data?.message);
          // const zoneError = error.response.data.errors.Zone["0"];
          // const branchCodeError = error.response.data.errors.BranchCode["0"];
          dispatch(hideLoader());
          ShowToast("error", error?.response?.data?.message);
          // ShowToast("error", zoneError);
          // ShowToast("error", branchCodeError);
        })
        .finally(() => {
          dispatch(hideLoader());
        });
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
    // const Id = localStorage.getItem("Id");
    if (accessType === "ALL") {
      let payload = {
        user_id: user_id,
        option: "zone",
        userType: "EMP",
        zone: formik.values.selectedZone?.value,
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
          console.log("Error", Err);
        });

      dispatch(hideLoader());
    }
  }, [dispatch, accessType]);

  useEffect(() => {
    if (formik.values.selectedZone) {
      const str = user_id;
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
        userType: "EMP",
        zone: formik.values.selectedZone.value, // Use the selected zone value
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
    // setSearchValue(value);

    const query = value;
    setSearchQuery(query);

    const filtered = userData.filter(
      (item: any) => item.clientName.toLowerCase().includes(query) // Check if the client name includes the query
    );

    setFilteredData(filtered);
    console.log("filteredSearch Records", filteredData);
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
  //     dispatch(showLoader(""));
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
    // let Id = localStorage.getItem("Id");
    const pageSize = 1000; // Define pageSize

    // Calculate start based on the new page (0-indexed)
    const start = (value - 1) * pageSize;
    const payload = {
      start: value === undefined ? 0 : start, // Calculate start based on the new page
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
    dispatch(showLoader(""));
    // const test = dispatch(fetchDormantReport(payload));
    // console.log("testReduxThnk", test);
    await apiServices
      .getDormantReport(payload)
      .then((response) => {
        dispatch(hideLoader());
        if (response?.status === 200) {
          setResponseStatus(true);
          // let { recordsTotal } = response?.data[0];
          console.log("getDormantReport_response_1", response?.data);
          // setTotalEntries(recordsTotal);
          setUserData(response?.data || []);
          setFilteredData(response?.data || []);
        } else if (response?.status == 400) {
          console.log("getDormantReport_response", response);
        }
      })
      .catch((error) => {
        dispatch(hideLoader());

        const errors = error?.response?.data?.errors;

        if (errors) {
          // Extract error messages
          const zoneError = errors?.Zone?.[0];
          const branchError = errors?.BranchCode?.[0];

          // Display the errors in ShowToast
          if (zoneError) {
            ShowToast("error", zoneError);
          }
          if (branchError) {
            ShowToast("error", branchError);
          }
        } else {
          // Default error message for unexpected errors
          ShowToast("error", "An unexpected error occurred. Please try again.");
        }
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  const handleExcelDownload = () => {
    // const Id = localStorage.getItem("Id");

    if (accessType !== "") {
      if (
        !formik.values.selectedZone ||
        !formik.values.selectedBranchCode ||
        !formik.values.selectedClientStatus
      ) {
        formik.setTouched({
          selectedZone: true,
          selectedBranchCode: true,
          selectedClientStatus: true,
        });
        return; // Stop execution if validation fails
      }
    }
    const payload = {
      start: 0,
      pageSize: 1000,
      searchKey: "",
      loginName: user_id,
      zone: formik.values.selectedZone?.value
        ? formik.values.selectedZone?.value
        : "",
      branchCode: formik.values.selectedBranchCode?.value
        ? formik.values.selectedBranchCode?.value
        : "",
      clientStatus:
        formik.values.selectedClientStatus?.value === "ACTIVE"
          ? "Y"
          : formik.values.selectedClientStatus?.value === "INACTIVE"
          ? "N"
          : "ALL",
    };

    let token = localStorage.getItem("tkn");
    dispatch(showLoader("Please wait, We are Processing your Request"));

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

  // const dormantColumns: GridColDef[] = useMemo(
  //   () => [
  //     {
  //       field: "ctermcode",
  //       headerName: "Client Code",
  //       flex: 2,
  //       minWidth: 100,
  //       disableColumnMenu: true,
  //     },
  //     {
  //       field: "clientName",
  //       headerName: "Client Name",
  //       flex: 2,
  //       minWidth: 160,
  //       disableColumnMenu: true,
  //     },
  //     {
  //       field: "lastTradeDate",
  //       headerName: "Last Trade Date",
  //       headerClassName: "header-wrap-custom",
  //       flex: 2,
  //       minWidth: 90,
  //       align: "center",
  //       disableColumnMenu: true,
  //     },
  //     {
  //       field: "active",
  //       headerName: "Active",
  //       width: 70,
  //       align: "center",
  //       headerAlign: "center",
  //       disableColumnMenu: true,
  //     },
  //     {
  //       field: "rmname",
  //       headerName: "RM Name",
  //       minWidth: 140,
  //       disableColumnMenu: true,
  //     },
  //     {
  //       field: "rmstatus",
  //       headerName: "RM Status",
  //       width: 100,
  //       headerClassName: "header-wrap-custom",
  //       align: "center",
  //       disableColumnMenu: true,
  //     },
  //     {
  //       field: "dealerName",
  //       headerName: "Dealer Name",
  //       minWidth: 180,
  //       disableColumnMenu: true,
  //     },
  //     {
  //       field: "dealerSTATUS",
  //       headerName: "Dealer Status",
  //       width: 100,
  //       headerClassName: "header-wrap-custom",
  //       align: "center",
  //       disableColumnMenu: true,
  //     },
  //     {
  //       field: "branchcode",
  //       headerName: "BR Code",
  //       minWidth: 70,
  //       align: "right",
  //       headerAlign: "center",
  //       disableColumnMenu: true,
  //     },
  //     {
  //       field: "zone",
  //       headerName: "Zone",
  //       minWidth: 60,
  //       align: "right",
  //       headerAlign: "center",
  //       disableColumnMenu: true,
  //     },
  //     {
  //       field: "branchtype",
  //       headerName: "Branch Type",
  //       width: 100,
  //       headerClassName: "header-wrap-custom",
  //       align: "center",
  //       headerAlign: "center",
  //       disableColumnMenu: true,
  //     },
  //     {
  //       field: "activationDate",
  //       headerName: "Activation Date",
  //       width: 115,
  //       headerClassName: "header-wrap-custom",
  //       disableColumnMenu: true,
  //       align: "center",
  //       headerAlign: "center",
  //     },
  //     {
  //       field: "mobileNo",
  //       headerName: "Mobile No",
  //       minWidth: 90,
  //       disableColumnMenu: true,
  //       renderCell: (params: any) => {
  //         const mobile = params.value || ""; // Extract the mobile number

  //         // Mask all digits except the first 2 and the last 2
  //         const maskedMobile = mobile.replace(
  //           /^(\d{2})(\d+)(\d{2})$/,
  //           (_: any, prefix: any, middle: any, suffix: any) => {
  //             console.log(prefix, suffix); // Added only for testing purpose
  //             return `${prefix}${"X".repeat(middle.length)}${suffix}`;
  //           }
  //         );

  //         // Return tooltip with the masked mobile number
  //         return (
  //           <Tooltip title={mobile} arrow placement="top">
  //             <span style={{ cursor: "pointer" }}>{maskedMobile}</span>
  //           </Tooltip>
  //         );
  //       },
  //     },
  //     {
  //       field: "email",
  //       headerName: "Email",
  //       minWidth: 210,
  //       disableColumnMenu: true,
  //       renderCell: (params: any) => {
  //         const email = params.value || ""; // Extract the email ID

  //         // Mask the email if it exists
  //         const maskedEmail = email.replace(
  //           /^(.)(.*)(.@.*)$/, // Regex to capture parts of the email
  //           (_: any, firstChar: any, middleChars: any, domain: any) => {
  //             return `${firstChar}${"x".repeat(middleChars.length)}${domain}`;
  //           }
  //         );

  //         // Return tooltip with the original email and masked email for display
  //         return (
  //           <Tooltip title={email} arrow placement="top">
  //             <span style={{ cursor: "pointer" }}>{maskedEmail}</span>
  //           </Tooltip>
  //         );
  //       },
  //     },
  //     // {
  //     //   field: "brokerageGeneratedinFY1920",
  //     //   headerName: "Brok FY1920",
  //     //   width: 100,
  //     //   align: "right",
  //     //   headerAlign: "center",
  //     //   headerClassName: "header-wrap-custom",
  //     //   disableColumnMenu: true,
  //     // },
  //     {
  //       field: "brokerageGeneratedinFY2021",
  //       headerName: "Brok FY2021",
  //       width: 100,
  //       align: "right",
  //       headerAlign: "center",
  //       headerClassName: "header-wrap-custom",
  //       disableColumnMenu: true,
  //       valueFormatter: (params: number) =>
  //         new Intl.NumberFormat("en-IN").format(params),
  //     },
  //     {
  //       field: "brokerageGeneratedinFY2122",
  //       headerName: "Brok FY2122",
  //       width: 100,
  //       align: "right",
  //       headerAlign: "center",
  //       headerClassName: "header-wrap-custom",
  //       disableColumnMenu: true,
  //       valueFormatter: (params: number) =>
  //         new Intl.NumberFormat("en-IN").format(params),
  //     },
  //     {
  //       field: "brokerageGeneratedinFY2223",
  //       headerName: "Brok FY2223",
  //       width: 100,
  //       align: "right",
  //       headerAlign: "center",
  //       headerClassName: "header-wrap-custom",
  //       disableColumnMenu: true,
  //       valueFormatter: (params: number) =>
  //         new Intl.NumberFormat("en-IN").format(params),
  //     },
  //     {
  //       field: "brokerageGeneratedinFY2324",
  //       headerName: "Brok FY2324",
  //       width: 100,
  //       align: "right",
  //       headerAlign: "center",
  //       headerClassName: "header-wrap-custom",
  //       disableColumnMenu: true,
  //       valueFormatter: (params: number) =>
  //         new Intl.NumberFormat("en-IN").format(params),
  //     },
  //   ],
  //   []
  // );

  document.title = "LKP Securities | Dormant Client Report";

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Row className="row-font">
            <Col lg={12}>
              {accessType !== "" && (
                <Card>
                  <CardHeader>
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
                                ZONE
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
                                className="placeholder-font"
                                isClearable
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
                                CLIENT STATUS
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
              <Card>
                {accessType === "" && (
                  <CardHeader>
                    <h4 className="card-title mb-0">Dormant Client Report</h4>
                  </CardHeader>
                )}
                <CardBody>
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
