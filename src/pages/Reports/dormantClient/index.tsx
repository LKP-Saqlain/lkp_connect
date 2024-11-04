import React, { useEffect, useMemo, useState } from "react";
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
import PNLNote from "../../../components/common/pnlNote";
import { apiServices } from "../../../services";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../redux/store";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
import Select from "react-select";
import DataTable from "../../../components/common/table";
import { GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import { endpoints } from "../../../services/endpoints";
import { fetchDormantReport } from "../../../redux/thunk/Reports/dormantReport";
import ShowToast from "../../../utils/toastUtils";
import * as Yup from "yup";
import { useFormik } from "formik";

const ClientStatus = [
  { value: "ALL", label: "ALL" },
  { value: "ACTIVE", label: "ACTIVE" },
  { value: "INACTIVE", label: "INACTIVE" },
  //   { value: "Madrid", label: "Madrid" },
  //   { value: "Toronto", label: "Toronto" },
];

interface Option {
  label: string;
  value: string;
}

const Id = localStorage.getItem("Id");
const uIdType = localStorage.getItem("uIdType");

const DormantClient = () => {
  const [selectedNoSortingGroup, setSelectedNoSortingGroup] =
    useState<any>(null);
  const [selectedZone, setSelectedZone] = useState<Option | null>(null);
  const [selectedBranchCode, setSelectedBranchCode] = useState<Option | null>(
    null
  );
  const [selectedClientStatus, setSelectedClientStatus] =
    useState<Option | null>(null);
  const [noSortingGroup, setNoSortingGroup] = useState([]);
  const [branchCodeOptions, setBranchCodeOptions] = useState([]);
  const [pnlValues, setPnlValues] = useState<any>("");
  const [userData, setUserData] = useState([]);
  const [totalEntries, setTotalEntries] = useState(null);

  const [page, setPage] = useState(1); // Track current page
  const [pageSize, setPageSize] = useState(10); // Initial page size

  // const data = useSelector((state: RootState) => state.dormantReport.data);
  const dispatch = useDispatch();

  const validationSchema = Yup.object({
    selectedZone: Yup.object().nullable().required("Zone is required"),
    selectedBranchCode: Yup.object()
      .nullable()
      .required("Branch code is required"),
    selectedClientStatus: Yup.object()
      .nullable()
      .required("Client status is required"),
  });

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
    validationSchema,
    onSubmit: (values) => {
      // Only called if no validation errors
      console.log("values1-->", values);
      handleSubmit(values);
    },
  });

  useEffect(() => {
    console.log("formikValls", formik.values, formik.errors);
  }, [formik.values]);

  useEffect(() => {
    let payload = {
      user_id: Id,
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
    const response = apiServices
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
  }, [dispatch]);

  useEffect(() => {
    if (formik.values.selectedZone) {
      const str = localStorage.getItem("Id");
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

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log("value", value);
    if (regEx.alphaNumeric.test(value)) {
      setPnlValues(value.toUpperCase().replace(/\s/g, ""));
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
    let Id = localStorage.getItem("Id");
    const pageSize = 10; // Define pageSize

    // Calculate start based on the new page (0-indexed)
    const start = (value - 1) * pageSize;
    const payload = {
      start: value === undefined ? 0 : start, // Calculate start based on the new page
      pageSize: 10,
      searchKey: "",
      loginName: Id,
      zone: formik.values.selectedZone?.value,
      branchCode: formik.values.selectedBranchCode?.value,
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
    const result = await apiServices
      .getDormantReport(payload)
      .then((response) => {
        dispatch(hideLoader());
        if (response?.status === 200) {
          let { recordsTotal } = response?.data[0];

          console.log("getDormantReport_response_1", response?.data);
          setTotalEntries(recordsTotal);
          setUserData(response.data);
        } else if (response?.status == 400) {
          console.log("getDormantReport_response", response);
        }
      })
      .catch((error) => {
        console.log("Error->", error.response.data.errors.Zone["0"]);
        const zoneError = error.response.data.errors.Zone["0"];
        const branchCodeError = error.response.data.errors.BranchCode["0"];
        dispatch(hideLoader());
        ShowToast("error", zoneError);
        ShowToast("error", branchCodeError);
      });
  };

  const handleExcelDownload = () => {
    const Id = localStorage.getItem("Id");
    const payload = {
      start: 0,
      pageSize: 20,
      searchKey: "",
      loginName: Id,
      zone: formik.values.selectedZone?.value,
      branchCode: formik.values.selectedBranchCode?.value,
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

  const dormantColumns: GridColDef[] = useMemo(
    () => [
      { field: "ctermcode", headerName: "Client Code", width: 150 },
      { field: "clientName", headerName: "Client Name", width: 150 },
      {
        field: "brokerageGeneratedinFY2223",
        headerName: "Bro FY2223",
        width: 150,
      },
      {
        field: "brokerageGeneratedinFY2324",
        headerName: "Bro FY2324",
        width: 150,
      },
      { field: "active", headerName: "Active", width: 100 },
      { field: "lastTradeDate", headerName: "Last Trade Date", width: 150 },
      { field: "rmname", headerName: "RM Name", width: 150 },
      { field: "rmstatus", headerName: "RM Status", width: 120 },
      { field: "dealerName", headerName: "Dealer Name", width: 150 },
      { field: "dealerSTATUS", headerName: "Dealer Status", width: 120 },
      { field: "branchcode", headerName: "Branch Code", width: 150 },
      { field: "zone", headerName: "Zone", width: 120 },
      { field: "branchtype", headerName: "Branch Type", width: 150 },
      { field: "activationDate", headerName: "Activation Date", width: 180 },
      { field: "mobileNo", headerName: "Mobile No", width: 150 },
      { field: "email", headerName: "Email", width: 200 },
      {
        field: "brokerageGeneratedinFY1920",
        headerName: "Brok FY1920",
        width: 150,
      },
      {
        field: "brokerageGeneratedinFY2021",
        headerName: "Brok FY2021",
        width: 150,
      },
      {
        field: "brokerageGeneratedinFY2122",
        headerName: "Brok FY1922",
        width: 150,
      },
    ],
    []
  );

  document.title = "LKP Securities | Dormant Client Report";

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Row style={{ fontFamily: "Public Sans" }}>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <h4 className="card-title mb-0">Dormant Client Report</h4>
                </CardHeader>
                <CardBody>
                  <form onSubmit={formik.handleSubmit}>
                    <div>
                      <Row>
                        <Col xl={3}>
                          <div className="mb-3" style={{ maxWidth: "300px" }}>
                            <Label
                              htmlFor="zone-select"
                              className="form-label text-muted"
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
                              className="form-label text-muted"
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
                              htmlFor="client-status-select"
                              className="form-label text-muted"
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
                                <div
                                  className="text-danger"
                                  style={{ fontSize: "12px" }}
                                >
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
                            style={{
                              backgroundColor: "#11395C",
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
                          <Button
                            style={{ backgroundColor: "#11395C" }}
                            onClick={handleExcelDownload}
                            // type="submit"
                          >
                            Excel
                            <DownloadIcon />
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
                    dynamicHeader={dormantColumns}
                    tableData={userData}
                    totalRecords={totalEntries}
                    page={page}
                    onPageChange={handlePageChange}
                    pageSize={pageSize}
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
