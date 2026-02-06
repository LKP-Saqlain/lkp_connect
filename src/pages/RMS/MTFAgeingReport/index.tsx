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
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
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
import MailOutlineIcon from "@mui/icons-material/MailOutline";

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
  const [selectedMtfRow, setSelectedMtfRow] = useState<any | null>(null);
  const [isNudgeTableOpen, setIsNudgeTableOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState("");
  const [uploadDetails, setUploadDetails] = useState<UploadDetail[]>([]);
  const [isEmailConfirmOpen, setIsEmailConfirmOpen] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
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
            "Sorry for the inconvenience, please try after some time."
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
              "Sorry for the inconvenience, please try after some time."
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

  const handleMTFRow = (selectedRow: any) => {
    console.log("TestSelectedRow", selectedRow);
    setSelectedMtfRow(selectedRow);
  };

  const closeNudgeTable = () => {
    setIsNudgeTableOpen(false);
    // tog_animationZoom(); // Reopen Nudge modal when closing NudgeTable
  };

  const openNudgeTable = () => {
    // console.log("reportName", reportName);
    setSelectedReport("MTF Stock Ageing Report");
    setIsNudgeTableOpen(true);
  };

  useEffect(() => {
    if (!selectedMtfRow?.cc) return;

    const fetchMTFStockAgeingRecords = () => {
      const payload = {
        user_id: user_id,
        clientCode: selectedMtfRow.cc,
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

    fetchMTFStockAgeingRecords();
  }, [selectedMtfRow?.cc]);

  useEffect(() => {
    console.log("stateUpdate", selectedMtfRow);
  }, [dispatch, selectedMtfRow]);

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

  const handleSendEmail = async () => {
    const payload = {
      user_id: user_id,
    };

    dispatch(showLoader("Sending email..."));

    let hasError = false;

    const callApi = async (
      apiFn: (payload: any) => Promise<any>,
      apiName: string
    ) => {
      try {
        const res = await apiFn(payload);
        if (res?.status !== 200) {
          throw new Error();
        }
      } catch {
        hasError = true;
        ShowToast("error", `${apiName} failed to send email`);
      }
    };

    await callApi(apiServices.SendClientMTFEmail, "Client MTF Email");
    await callApi(apiServices.SendDealerMTFEmail, "Dealer MTF Email");
    await callApi(apiServices.SendRMMTFEmail, "RM MTF Email");
    await callApi(apiServices.SendRHMTFEmail, "RH MTF Email");
    await callApi(apiServices.SendAPMTFEmail, "AP MTF Email");

    dispatch(hideLoader());

    if (!hasError) {
      ShowToast("success", "All emails sent successfully");
    }
  };

  const MTFAgeing = uploadDetails.find((item: any) => item.tp === "MTFAgeing");
  const confirmBtnStyle = {
    height: "25px",
    minWidth: "70px",
    padding: "0 12px",
    fontSize: "13px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
  return (
    <React.Fragment>
      <Modal
        isOpen={isEmailConfirmOpen}
        toggle={() => setIsEmailConfirmOpen(false)}
        centered
        style={{ maxWidth: "400px" }}
      >
        <ModalHeader toggle={() => setIsEmailConfirmOpen(false)}></ModalHeader>
        <i
          style={{ textAlign: "center" }}
          className="ri-alert-line display-5 text-warning"
        ></i>
        <ModalBody
          style={{ padding: "5px", fontSize: "14px", textAlign: "center" }}
        >
          Are you sure you want to send the Email?
        </ModalBody>

        <ModalFooter
          className="justify-content-center"
          style={{
            padding: "8px 12px",
            minHeight: "unset",
          }}
        >
          <Button
            color="secondary"
            style={confirmBtnStyle}
            onClick={() => setIsEmailConfirmOpen(false)}
          >
            No
          </Button>

          <Button
            style={{
              ...confirmBtnStyle,
              backgroundColor: "#11395C",
              borderColor: "#11395C",
            }}
            onClick={() => {
              setIsEmailConfirmOpen(false);
              handleSendEmail();
            }}
          >
            Yes
          </Button>
        </ModalFooter>
      </Modal>

      <div className="page-content page-view">
        <div className="container-fluid">
          <Row className="row-font">
            <NudgeTable
              isOpen={isNudgeTableOpen}
              onClose={closeNudgeTable}
              selectedReport={selectedReport}
              filteredData={{
                "MTF Stock Ageing Report": MTFStockAgeingRecords,
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
                            // minWidth: "100px",
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
                              formik.errors.selectedBranchCode)
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
                          type="button"
                          onClick={() => setIsEmailConfirmOpen(true)}
                        >
                          Email
                          <MailOutlineIcon
                            fontSize="small"
                            sx={{ marginLeft: "2px", marginBottom: "2px" }}
                          />
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
                    openNudgeTable={openNudgeTable}
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
