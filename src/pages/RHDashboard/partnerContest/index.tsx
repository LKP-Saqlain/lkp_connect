import { useEffect, useRef, useState } from "react";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { apiServices } from "../../../services";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Label,
  Row,
} from "reactstrap";
import DataTable from "../../../components/common/UserInfoTable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Button } from "@mui/material";
import { useFormik } from "formik";
import DownloadIcon from "@mui/icons-material/Download";
import ShowToast from "../../../utils/toastUtils";
import { getAPContestReportColumns } from "../../../helper/tableColumns";
import { Tabs, Tab } from "@mui/material";

const PartnerContestReport = ({ activeSubItem }: any) => {
  const [data, setData] = useState<any[]>([]);
  const [noSortingGroup, setNoSortingGroup] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [isZoneReady, setIsZoneReady] = useState(false);
  const lastRequestRef = useRef<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );
  const { accessType } = useSelector(
    (state: RootState) => state.AuthUser?.data?.data
  );

  interface OptionType {
    value: string;
    label: string;
  }

  interface FormValues {
    selectedZone: OptionType | null;
  }

  const formik = useFormik<FormValues>({
    initialValues: {
      selectedZone: null,
    },
    // validationSchema,
    onSubmit: (values) => {
      // Only called if no validation errors
      console.log("values1-->", values);
      // handleSubmit(values);
      // handleDownloadExcel();
    },
  });

  const exportToExcel = (data: any[], fileName: string) => {
    const orderedData = data.map((row) => {
      const orderedRow: any = {};
      getAPContestReportColumns.forEach((col: any) => {
        let cellValue = row[col.field as string];

        // If valueFormatter exists, apply it
        if (col.valueFormatter) {
          cellValue = col.valueFormatter(cellValue);
        }

        orderedRow[col.headerName as string] = cellValue;
      });
      return orderedRow;
    });

    const worksheet = XLSX.utils.json_to_sheet(orderedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employee Report");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `${fileName}.xlsx`);
  };

  useEffect(() => {
    // if (accessType === "ALL") {
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
            setIsZoneReady(true);
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
    // }
  }, [dispatch, accessType]);

  useEffect(() => {
    if (!isZoneReady) return;
    if (tabValue !== 0 && tabValue !== 1) return;

    const selectedZone = formik.values.selectedZone?.value ?? "ALL";
    const quarterPeriod = tabValue === 0 ? "Q3-2526" : "Q4-2526";

    // Create a unique key for this request
    const requestKey = `${selectedZone}_${tabValue}`;

    // Prevent duplicate calls
    if (lastRequestRef.current === requestKey) return;
    lastRequestRef.current = requestKey;

    setData([]);

    const payload = {
      user_id,
      zone: selectedZone,
      quarterPeriod,
    };

    console.log("GetAPContestReport Payload", payload);

    const fetchReport = async () => {
      try {
        dispatch(showLoader("Please wait, we are processing your request..."));

        const response = await apiServices.GetAPContestReport(payload);
        const result = response?.data?.data ?? [];

        setData(
          result.map((item: any, index: number) => ({
            ...item,
            Id: index + 1,
          }))
        );
      } catch (error) {
        console.error("Error fetching compliance data:", error);
      } finally {
        dispatch(hideLoader());
      }
    };

    fetchReport();
  }, [user_id, tabValue, formik.values.selectedZone, isZoneReady]);

  return (
    <div className="page-content page-view">
      <Container fluid>
        <Tabs
          value={tabValue}
          onChange={(_, v) => setTabValue(v)}
          TabIndicatorProps={{ style: { display: "none" } }}
          sx={{
            marginTop: "1rem",
            marginLeft: ".7rem",
            marginBottom: "8px",
            backgroundColor: "white",
            borderRadius: "11px",
            width: "fit-content",
            minHeight: 0,
            // border: "1.5px solid #11395C",
          }}
        >
          <Tab
            label="Q3"
            sx={{
              textTransform: "none",
              fontWeight: 400,
              borderRadius: "10px",
              px: 3,
              minHeight: 10,
              backgroundColor: tabValue === 0 ? "#11395C" : "white",
              color: tabValue === 0 ? "white" : "#11395C",
              "&.Mui-selected": {
                color: "white !important",
              },
              "& .MuiTab-wrapper": {
                color: tabValue === 0 ? "white" : "#11395C",
              },
            }}
          />

          <Tab
            label="Q4"
            sx={{
              textTransform: "none",
              fontWeight: 400,
              borderRadius: "10px",
              px: 3,
              minHeight: 10,
              backgroundColor: tabValue === 1 ? "#11395C" : "white",
              color: tabValue === 1 ? "white" : "#11395C",
              "&.Mui-selected": {
                color: "white !important",
              },
              "& .MuiTab-wrapper": {
                color: tabValue === 1 ? "white" : "#11395C",
              },
            }}
          />
        </Tabs>
        {tabValue === 0 && (
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
                Partner Contest Report{" "}
                <span style={{ fontSize: "12px" }}> (October - December)</span>
              </h4>
            </CardHeader>
            {/* <CardBody style={{ textAlign: "center" }}>
            <h4
              style={{
                fontWeight: "700",
                marginBottom: "15px",
                textAlign: "left",
              }}
            >
              Coming Soon
            </h4>{" "}
          </CardBody> */}
            <CardBody>
              <form onSubmit={formik.handleSubmit}>
                {accessType === "ALL" && (
                  <Row className="align-items-center">
                    {/* Zone selector */}
                    <Col>
                      <Card style={{ marginBottom: "0.7rem" }}>
                        <Row style={{ margin: "5px" }}>
                          <Col xs={12}>
                            <div className="d-flex align-items-center gap-2">
                              {/* Label */}
                              <Label
                                htmlFor="zone-select"
                                className="form-label text-muted label-font mb-0"
                                style={{ minWidth: "50px" }}
                              >
                                Zone
                              </Label>

                              {/* Scrollable buttons */}
                              <div
                                className="d-flex flex-nowrap gap-2 overflow-auto"
                                style={{ maxWidth: "100%" }}
                              >
                                {noSortingGroup.map((zone: any) => {
                                  const isSelected =
                                    formik.values.selectedZone?.value ===
                                    zone.value;

                                  return (
                                    <Button
                                      key={zone.value}
                                      type="button"
                                      style={{
                                        minWidth: "60px",
                                        whiteSpace: "nowrap",
                                        fontSize: "12px",
                                        padding: "2px",
                                        borderRadius: "6px",
                                        border: "1px solid #11395c",
                                        backgroundColor: isSelected
                                          ? "#11395c"
                                          : "#ffffff",
                                        color: isSelected
                                          ? "#ffffff"
                                          : "#11395c",
                                      }}
                                      onClick={() =>
                                        formik.setFieldValue(
                                          "selectedZone",
                                          zone
                                        )
                                      }
                                      onBlur={() =>
                                        formik.setFieldTouched(
                                          "selectedZone",
                                          true
                                        )
                                      }
                                    >
                                      {zone.label}
                                    </Button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Validation */}
                            {formik.touched.selectedZone &&
                              formik.errors.selectedZone && (
                                <div
                                  className="text-danger"
                                  style={{ fontSize: "12px" }}
                                >
                                  {formik.errors.selectedZone}
                                </div>
                              )}
                          </Col>
                        </Row>
                      </Card>
                    </Col>

                    {/* Excel button */}
                    <Col xs="auto">
                      {Array.isArray(data) && data.length > 0 && (
                        <Button
                          variant="outlined"
                          sx={{
                            textTransform: "none",
                            backgroundColor: "#11395C",
                            color: "#FFF",
                            marginBottom: "1rem",
                            marginRight: "1rem",
                            whiteSpace: "nowrap",
                          }}
                          onClick={() =>
                            exportToExcel(data, "Partner_contest_report")
                          }
                        >
                          Excel <DownloadIcon />
                        </Button>
                      )}
                    </Col>
                  </Row>
                )}
              </form>
              <DataTable
                activeSubItem={activeSubItem}
                T6Data={data}
                selectedTab={tabValue}
              />
            </CardBody>
          </Card>
        )}
        {tabValue === 1 && (
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
                Partner Contest Report{" "}
                <span style={{ fontSize: "12px" }}> (January - March)</span>
              </h4>
            </CardHeader>
            {/* <CardBody style={{ textAlign: "center" }}>
            <h4
              style={{
                fontWeight: "700",
                marginBottom: "15px",
                textAlign: "left",
              }}
            >
              Coming Soon
            </h4>{" "}
          </CardBody> */}
            <CardBody>
              <form onSubmit={formik.handleSubmit}>
                {accessType === "ALL" && (
                  <Row className="align-items-center">
                    {/* Zone selector */}
                    <Col>
                      <Card style={{ marginBottom: "0.7rem" }}>
                        <Row style={{ margin: "5px" }}>
                          <Col xs={12}>
                            <div className="d-flex align-items-center gap-2">
                              {/* Label */}
                              <Label
                                htmlFor="zone-select"
                                className="form-label text-muted label-font mb-0"
                                style={{ minWidth: "50px" }}
                              >
                                Zone
                              </Label>

                              {/* Scrollable buttons */}
                              <div
                                className="d-flex flex-nowrap gap-2 overflow-auto"
                                style={{ maxWidth: "100%" }}
                              >
                                {noSortingGroup.map((zone: any) => {
                                  const isSelected =
                                    formik.values.selectedZone?.value ===
                                    zone.value;

                                  return (
                                    <Button
                                      key={zone.value}
                                      type="button"
                                      style={{
                                        minWidth: "60px",
                                        whiteSpace: "nowrap",
                                        fontSize: "12px",
                                        padding: "2px",
                                        borderRadius: "6px",
                                        border: "1px solid #11395c",
                                        backgroundColor: isSelected
                                          ? "#11395c"
                                          : "#ffffff",
                                        color: isSelected
                                          ? "#ffffff"
                                          : "#11395c",
                                      }}
                                      onClick={() =>
                                        formik.setFieldValue(
                                          "selectedZone",
                                          zone
                                        )
                                      }
                                      onBlur={() =>
                                        formik.setFieldTouched(
                                          "selectedZone",
                                          true
                                        )
                                      }
                                    >
                                      {zone.label}
                                    </Button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Validation */}
                            {formik.touched.selectedZone &&
                              formik.errors.selectedZone && (
                                <div
                                  className="text-danger"
                                  style={{ fontSize: "12px" }}
                                >
                                  {formik.errors.selectedZone}
                                </div>
                              )}
                          </Col>
                        </Row>
                      </Card>
                    </Col>

                    {/* Excel button */}
                    <Col xs="auto">
                      {Array.isArray(data) && data.length > 0 && (
                        <Button
                          variant="outlined"
                          sx={{
                            textTransform: "none",
                            backgroundColor: "#11395C",
                            color: "#FFF",
                            marginBottom: "1rem",
                            marginRight: "1rem",
                            whiteSpace: "nowrap",
                          }}
                          onClick={() =>
                            exportToExcel(data, "Partner_contest_report")
                          }
                        >
                          Excel <DownloadIcon />
                        </Button>
                      )}
                    </Col>
                  </Row>
                )}
              </form>
              <DataTable
                activeSubItem={activeSubItem}
                T6Data={data}
                selectedTab={tabValue}
              />
            </CardBody>
          </Card>
        )}
      </Container>
    </div>
  );
};

export default PartnerContestReport;
