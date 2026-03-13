import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Label,
  Row,
} from "reactstrap";
import DataTable from "../../components/common/UserInfoTable";
import { hideLoader, showLoader } from "../../redux/slices/loaderSlice";
import { apiServices } from "../../services";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { useFormik } from "formik";
import Select from "react-select";
import UserCapsules from "../ClientDetails/UserCapsules";
import ShowToast from "../../utils/toastUtils";
import { TextField } from "@mui/material";

const Index = ({ activeMenu }: any) => {
  const [data, setData] = useState<any>();
  const [flag, setFlag] = useState<boolean>(false);

  const [currentClient, setCurrentClient] = useState("");
  const [noSortingGroup, setNoSortingGroup] = useState([]);
  const [branchCodeOptions, setBranchCodeOptions] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data,
  );
  const { accessType } = useSelector(
    (state: RootState) => state.AuthUser?.data?.data,
  );

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
    // validationSchema,
    onSubmit: (values) => {
      // Only called if no validation errors
      console.log("values1-->", values);
      GetClientPledgeDetails(values);
      // handleExcelDownload();
    },
  });

  useEffect(() => {
    if (accessType === "ALL" || accessType === "ZONE" || accessType === "") {
      // if (accessType !== "ZONE" && accessType !== "" && accessType === "ALL")
      //   return;
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
        userType:
          str === "APN-7161" ? "APN" : userType === "Employee" ? "EMP" : "APN",
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
    }
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
        user_id: extractUserId,
        option: "BranchByZone",
        userType:
          str === "APN-7161" ? "APN" : userType === "Employee" ? "EMP" : "APN",
        zone: formik.values.selectedZone.value,
      };

      dispatch(showLoader("Please wait, we are processing your request..."));

      apiServices
        .getDropDown(payload)
        .then((res) => {
          console.log("response->", res);
          if (res?.status === 200) {
            let branchDropdown = res?.data.data.map((item: any) => ({
              label: item.val,
              value: item.val,
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
              "Sorry for the inconvenience, please try after some time.",
          );
        });
    }
  }, [formik.values.selectedZone, dispatch]); // This effect runs when `selectedZone` changes

  const GetClientPledgeDetails = (values?: any) => {
    console.log("Values", values);

    const payload = {
      user_id: user_id,
      clientCode: values.clientCode,
      zone: values.selectedZone?.value,
      branchCode: values.selectedBranchCode?.value,
    };
    dispatch(showLoader("Please wait, we are processing your request..."));

    apiServices
      .GetClientPledgeDetails(payload)
      .then((response) => {
        const rawData = response?.data?.data;

        let rows: any[] = [];

        // If backend sends a single object
        if (rawData && !Array.isArray(rawData)) {
          rows = [rawData];
        }
        // If backend sends an array
        else if (Array.isArray(rawData)) {
          rows = rawData;
        }

        const mappedRows = rows.map((item: any, index: number) => ({
          Id: index + 1,
          ...item,
        }));

        console.log("Mapped Client Pledge Details", mappedRows);
        setData(mappedRows);
      })
      .catch((error) => {
        console.error("Error fetching compliance data:", error);
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

    const filtered = data.filter((item: any) => {
      const clientNameMatch = item.cn?.toLowerCase().includes(lowerCaseValue);
      const accountCodeMatch = item.cc
        ?.toString()
        .toLowerCase()
        .includes(lowerCaseValue);

      return clientNameMatch || accountCodeMatch;
    });

    setFilteredData(filtered);
    console.log("filteredSearch Records", filtered);
  };

  const handleClick = (row: any) => {
    const encryptedCode = row?.enc;
    const clientCode = row?.cc;

    if (!encryptedCode || !clientCode) {
      console.warn("Missing client or encrypted code");
      return;
    }

    const url = `https://allocation.lkp.net.in:51528/Pledge/direct?UserId=${encryptedCode}`;
    setCurrentClient(clientCode); // keep this if you want to display client info somewhere

    // Open popup window instead of iframe
    const popupWidth = 900;
    const popupHeight = 500;
    const left = window.screenX + (window.outerWidth - popupWidth) / 2;
    const top = window.screenY + (window.outerHeight - popupHeight) / 2;

    window.open(
      url,
      "PledgePopup",
      `width=${popupWidth},height=${popupHeight},left=${left},top=${top},resizable=yes,scrollbars=yes`,
    );

    console.log("Pledge Encrypted Code:", encryptedCode);
  };

  return (
    <div className="page-content page-view">
      <UserCapsules
        selectedCapsule={"Pledge Request"}
        capsuleType="Pledge Request"
      />
      <Container fluid>
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
              position: "relative", // for absolute positioning inside
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <h4
              className="card-title mb-0"
              style={{
                width: "100%",
                textAlign: "center",
                margin: 0,
              }}
            >
              Client Pledge Request
            </h4>

            {flag && (
              <button
                onClick={() => {
                  setFlag(false);
                  setCurrentClient("");
                }}
                style={{
                  position: "absolute",
                  right: "12px",
                  backgroundColor: "#11395C",
                  color: "white",
                  border: "none",
                  padding: "4px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                Close
              </button>
            )}
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
                          formik.setFieldValue("selectedBranchCode", option)
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
                        htmlFor="client-code"
                        className="form-label text-muted label-font"
                      >
                        Client Code
                      </Label>

                      <TextField
                        id="client-code"
                        name="clientCode"
                        placeholder="Enter Client Code"
                        value={formik.values.clientCode}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        fullWidth
                        error={Boolean(
                          formik.touched.clientCode && formik.errors.clientCode,
                        )}
                        helperText={
                          formik.touched.clientCode && formik.errors.clientCode
                            ? formik.errors.clientCode
                            : ""
                        }
                        InputProps={{
                          sx: {
                            height: "40px",
                            fontSize: "14px",
                          },
                        }}
                        sx={{
                          "& .MuiInputBase-root": {
                            height: "40px",
                          },
                          "& .MuiInputBase-input": {
                            padding: "10px 14px",
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
                        (formik.touched.clientCode && formik.errors.clientCode)
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
                        (formik.touched.clientCode && formik.errors.clientCode)
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

          <Card>
            <CardBody style={flag ? { padding: 0 } : {}}>
              {flag ? (
                <>
                  <div className="mb-3 px-3 py-2 bg-light rounded border d-flex align-items-center">
                    <strong className="me-2 ">Client Code:</strong>
                    <span className="text-dark ">{currentClient || "N/A"}</span>
                  </div>
                  <iframe
                    // src={iframeSrc}
                    width="100%"
                    height="400"
                    style={{ border: "none" }}
                    title="Pledge Frame"
                  />
                </>
              ) : (
                <DataTable
                  activeMenu={activeMenu}
                  // T6Data={data}
                  handleDownload={handleClick}
                  showSearch={Array.isArray(data) && data.length > 0}
                  handleSearchBasedOnInput={handleSearchBasedOnInput}
                  searchValue={searchQuery}
                  T6Data={searchQuery ? filteredData : data}
                />
              )}
            </CardBody>
          </Card>
        </Card>
      </Container>
    </div>
  );
};

export default Index;
