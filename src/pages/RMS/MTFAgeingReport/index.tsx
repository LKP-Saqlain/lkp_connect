import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../redux/store";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
import { apiServices } from "../../../services";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Label,
  Row,
} from "reactstrap";
import Select from "react-select";
import * as Yup from "yup";
import { useFormik } from "formik";
import ShowToast from "../../../utils/toastUtils";
import { TextField } from "@mui/material";
import UserInfoTable from "../../../components/common/UserInfoTable";
import NudgeTable from "../../../components/common/NudgeTable";
import { formatDateTime } from "../../../helper/commmon";

interface UploadDetail {
  type: string;
  uon: string;
  uby: string;
}

const MTFAgeingReport = ({ activeSubItem }: any) => {
  const [noSortingGroup, setNoSortingGroup] = useState([]);
  const [branchCodeOptions, setBranchCodeOptions] = useState([]);
  const [ageingRecords, setAgeingRecords] = useState<any[]>([]);
  const [MTFStockAgeingRecords, setMTFStockAgeingRecords] = useState<any[]>([]);
  const [isNudgeTableOpen, setIsNudgeTableOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState("");
  const [uploadDetails, setUploadDetails] = useState<UploadDetail[]>([]);

  const dispatch = useDispatch<AppDispatch>();

  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data,
  );

  const validationSchema = Yup.object({
    selectedZone: Yup.object().nullable().required("Zone is required"),
    selectedBranchCode: Yup.object()
      .nullable()
      .required("Branch code is required"),
    // clientCode: Yup.string()
    //   .required("Client Code is required")
    //   .matches(/^[A-Z0-9]+$/, "Only uppercase letters and numbers allowed"),
  });

  interface FormValues {
    selectedZone: { label: string; value: string } | null;
    selectedBranchCode: { label: string; value: string } | null;
    clientCode: string;
  }

  const formik = useFormik<FormValues>({
    initialValues: {
      selectedZone: null,
      selectedBranchCode: null,
      clientCode: "",
    },
    validationSchema,
    onSubmit: (values) => {
      // Only called if no validation errors
      console.log("values1-->", values);
      handleSubmit();
      // handleDownloadExcel();
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
          let zoneDropdown = res?.data.data.map((item: any) => ({
            label: item.desc, // This will be displayed in the dropdown
            value: item.val, // This will be the actual value
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
            "Sorry for the inconvenience, please try after some time.",
        );
      });

    dispatch(hideLoader());
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
            let branchDropdown = res?.data.data.map((item: any) => ({
              label: item.val, // Display value in dropdown
              value: item.val, // Actual value of the dropdown item
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
              "Sorry for the inconvenience, please try after some time.",
          );
        });
    }
  }, [formik.values.selectedZone, dispatch]);

  const handleSubmit = () => {
    const payload = {
      user_id,
      zone: formik.values.selectedZone?.value,
      branchCode: formik.values.selectedBranchCode?.value,
      clientCode: formik.values.clientCode?.trim() || "ALL",
    };

    dispatch(showLoader("Fetching data..."));

    apiServices
      .ViewMTFAgeingReport(payload)
      .then((response) => {
        dispatch(hideLoader());

        const data = response?.data?.data;

        if (response?.status === 200 && Array.isArray(data)) {
          const recordsWithId = data.map((item: any, index: number) => ({
            Id: index + 1,
            ...item,
          }));

          setAgeingRecords(recordsWithId);

          console.log("Total Records Received:", recordsWithId.length);
          console.log("Sample Record:", recordsWithId);
          if (recordsWithId.length === 0) {
            ShowToast("error", response?.data?.message || "No records found");
          }
        } else {
          ShowToast("error", "Unexpected response format");
        }
      })
      .catch((error) => {
        console.error("Error fetching MTF Ageing Report:", error);
        dispatch(hideLoader());
        ShowToast("error", "Failed to fetch data");
      });
  };

  const handleMTFRow = (selectedRow: any, field: string) => {
    setMTFStockAgeingRecords([]);
    // setSelectedMtfRow(selectedRow);

    if (field === "cc") {
      setSelectedReport("MTF Stock Ageing Report");
      fetchStockAgeing(selectedRow);
    } else {
      setSelectedReport("MTF Stock Ageing Sale Report");
      fetchSaleCalculation(selectedRow);
    }

    setIsNudgeTableOpen(true);
  };

  const closeNudgeTable = () => {
    setIsNudgeTableOpen(false);
    // tog_animationZoom(); // Reopen Nudge modal when closing NudgeTable
  };

  const fetchStockAgeing = (selectedRow: any) => {
    const payload = {
      user_id: user_id,
      clientCode: selectedRow.cc,
    };
    dispatch(showLoader(""));

    apiServices
      .ViewMTFStockAgeingReport(payload)
      .then((response) => {
        dispatch(hideLoader());
        const data = response?.data?.data;

        if (response?.status === 200 && Array.isArray(data)) {
          const recordsWithId = data.map((item: any, index: number) => ({
            Id: index + 1,
            ...item,
          }));

          setMTFStockAgeingRecords(recordsWithId);
          console.log("MTF_Ageing_Records-->", recordsWithId);
        }
      })
      .catch((error) => {
        console.log("Error", error);
        dispatch(hideLoader());
      });
  };

  const fetchSaleCalculation = (selectedRow: any) => {
    const payload = {
      user_id: user_id,
      clientCode: selectedRow.cc,
    };
    dispatch(showLoader(""));
    apiServices
      .GetMTFShortfallSellQty(payload)
      .then((response) => {
        dispatch(hideLoader());
        const data = response?.data?.data;

        if (response?.status === 200 && Array.isArray(data)) {
          const recordsWithId = data.map((item: any, index: number) => ({
            Id: index + 1,
            ...item,
          }));

          setMTFStockAgeingRecords(recordsWithId);
          console.log("MTF_Ageing_Records-->", recordsWithId);
        }
      })
      .catch((error) => {
        console.log("Error", error);
        dispatch(hideLoader());
      });
  };

  useEffect(() => {
    fetchFileUploadedDetails();
  }, []);

  const fetchFileUploadedDetails = () => {
    let payload = {
      option: "MTFAgeing",
    };
    dispatch(showLoader(""));

    apiServices
      .GetFileuploadDetails(payload)
      .then((response) => {
        if (response?.status === 200) {
          dispatch(hideLoader());
          console.log("ResponseeeGetFileuploadDetails", response?.data?.data);
          const data = response?.data?.data || [];
          setUploadDetails(data);
        }
      })
      .catch((error) => {
        console.log("errror", error);
        dispatch(hideLoader());
      });
  };

  const MTFAgeing = uploadDetails.find((item: any) => item.tp === "MTFAgeing");
  return (
    <React.Fragment>
      <div className="page-content page-view">
        <div className="container-fluid">
          <Row className="row-font">
            <NudgeTable
              isOpen={isNudgeTableOpen}
              onClose={closeNudgeTable}
              selectedReport={selectedReport}
              filteredData={{
                "MTF Stock Ageing Report": MTFStockAgeingRecords,
                "MTF Stock Ageing Sale Report": MTFStockAgeingRecords,
              }}
            />
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
                    <Row className="align-items-end">
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
                              formik.setFieldValue("selectedBranchCode", option)
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
                        <div className="mb-3" style={{ maxWidth: "300px" }}>
                          <Label
                            htmlFor="client-code"
                            className="form-label text-muted label-font"
                          >
                            Enter Client Code
                          </Label>

                          <TextField
                            fullWidth
                            id="client-code"
                            name="clientCode"
                            placeholder="Enter Client Code"
                            variant="outlined"
                            size="small"
                            value={formik.values.clientCode}
                            onChange={(e) => {
                              const cleanedValue = e.target.value
                                .replace(/[^A-Za-z0-9]/g, "") // Remove special chars
                                .toUpperCase(); // Force uppercase
                              formik.setFieldValue("clientCode", cleanedValue);
                            }}
                            onBlur={formik.handleBlur}
                            InputProps={{
                              style: {
                                textTransform: "uppercase",
                                fontSize: "14px",
                              },
                            }}
                          />
                        </div>
                      </Col>

                      <Col
                        xl={2}
                        className="d-flex flex-column-reverse"
                        style={{
                          top:
                            (formik.touched.selectedZone &&
                              formik.errors.selectedZone) ||
                            (formik.touched.selectedBranchCode &&
                              formik.errors.selectedBranchCode) ||
                            (formik.touched.clientCode &&
                              formik.errors.clientCode)
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
                            minWidth: "100px",
                          }}
                          // onClick={handleSubmit}
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
                  minHeight: "80vh",
                  borderRadius: "15px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                }}
              >
                <CardBody>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "2px",
                      width: "100%",
                    }}
                  >
                    {/* LEFT SIDE */}
                    <div
                      style={{
                        fontSize: "12px",
                        color: "grey",
                        fontStyle: "italic",
                      }}
                    >
                      * Click on the{" "}
                      <span style={{ fontWeight: 900, fontStyle: "italic" }}>
                        Client Code
                      </span>{" "}
                      for more details
                    </div>

                    {/* RIGHT SIDE */}
                    {MTFAgeing && (
                      <div
                        style={{
                          fontSize: "11px",
                          color: "#444",
                          textAlign: "left",
                        }}
                      >
                        <div>
                          <strong>Last Uploaded By :</strong> {MTFAgeing.uby}
                        </div>
                        <div>
                          <strong>Last Uploaded On :</strong>{" "}
                          {formatDateTime(MTFAgeing?.uon)}
                        </div>
                      </div>
                    )}
                  </div>

                  <UserInfoTable
                    activeSubItem={activeSubItem}
                    T6Data={ageingRecords}
                    handleMTFRow={handleMTFRow}
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

export default MTFAgeingReport;
