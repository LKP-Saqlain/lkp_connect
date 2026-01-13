import { useEffect, useState } from "react";
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
// import * as Yup from "yup";
import { useFormik } from "formik";
import ShowToast from "../../../utils/toastUtils";
// import Select from "react-select";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { Tabs, Tab } from "@mui/material";
import { EmployeeTargetReportColumns } from "../../../helper/tableColumns";

const EmployeeTargetReport = ({ activeSubItem }: any) => {
  const [data, setData] = useState<any[]>([]);
  const [noSortingGroup, setNoSortingGroup] = useState([]);
  const [tabValue, setTabValue] = useState(0);
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

  // Define Formik form values
  interface FormValues {
    selectedZone: OptionType | null;
  }

  // const validationSchema = Yup.object({
  //   selectedZone: Yup.object().nullable().required("Zone is required"),
  // });

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

  useEffect(() => {
    if (accessType === "ALL") {
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
    }
  }, [dispatch, accessType]);

  useEffect(() => {
    setData([]);
    if (tabValue !== 0 && tabValue !== 1) return;
    const quarterPeriod = tabValue === 0 ? "Q3-2526" : "Q4-2526";
    const payload = {
      user_id: user_id,
      zone: formik.values.selectedZone?.value || "ALL",
      quarterPeriod,
    };

    dispatch(showLoader("Please wait, we are processing your request..."));

    apiServices
      .GetEmpContestReport(payload)
      .then((response) => {
        const result = response?.data?.data || [];

        console.log("A1 GEmployee Performance", result);

        setData(
          result.map((item: any, index: number) => {
            const totalAchieved = parseFloat(item.tra) || 0;
            const totalTarget = parseFloat(item.trt) || 0;

            const percentage =
              totalTarget !== 0 ? (totalAchieved / totalTarget) * 100 : 0;

            const percentageRounded = Math.round(percentage * 100) / 100;

            return {
              ...item,
              Id: index + 1,
              perRevAch: percentageRounded,
            };
          })
        );
      })
      .catch((error) => {
        console.error("Error fetching compliance data:", error);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  }, [dispatch, user_id, formik.values.selectedZone, tabValue]);

  const exportToExcel = (data: any[], fileName: string) => {
    const orderedData = data.map((row) => {
      const orderedRow: any = {};
      EmployeeTargetReportColumns.forEach((col: any) => {
        orderedRow[col.headerName as string] = row[col.field as string];
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
    console.log("testsad", formik.values);
  }, [formik.values]);

  return (
    <div className="page-content page-view">
      <Container fluid>
        {/* Tabs */}
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

        {/* Card */}
        <Card
          style={{
            borderRadius: "15px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
        >
          {/* Header */}
          <CardHeader
            style={{
              borderRadius: "15px 15px 0 0",
              boxShadow: "0 -4px 8px rgba(0,0,0,0.15)",
              padding: "0.2rem 0.8rem",
            }}
          >
            <h4 className="card-title mb-0">
              Employee Target Report{" "}
              <span style={{ fontSize: "12px" }}>
                {tabValue === 0 ? "(October–December)" : "(January–March)"}
              </span>
            </h4>
          </CardHeader>

          {/* Body */}
          <CardBody>
            <form onSubmit={formik.handleSubmit}>
              {accessType === "ALL" && (
                <Row className="align-items-center">
                  {/* Zone */}
                  <Col>
                    <Card style={{ marginBottom: "0.7rem" }}>
                      <Row style={{ margin: "5px" }}>
                        <Col xs={12}>
                          <div className="d-flex align-items-center gap-2">
                            <Label
                              className="form-label text-muted label-font mb-0"
                              style={{ minWidth: "50px" }}
                            >
                              Zone
                            </Label>

                            <div className="d-flex flex-nowrap gap-2 overflow-auto">
                              {noSortingGroup.map((zone: any) => {
                                const selected =
                                  formik.values.selectedZone?.value ===
                                  zone.value;

                                return (
                                  <Button
                                    key={zone.value}
                                    type="button"
                                    style={{
                                      minWidth: "60px",
                                      fontSize: "12px",
                                      padding: "2px",
                                      borderRadius: "6px",
                                      border: "1px solid #11395c",
                                      backgroundColor: selected
                                        ? "#11395c"
                                        : "#fff",
                                      color: selected ? "#fff" : "#11395c",
                                    }}
                                    onClick={() =>
                                      formik.setFieldValue("selectedZone", zone)
                                    }
                                  >
                                    {zone.label}
                                  </Button>
                                );
                              })}
                            </div>
                          </div>

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

                  {/* Excel */}
                  <Col xs="auto">
                    {Array.isArray(data) && data.length > 0 && (
                      <Button
                        sx={{
                          textTransform: "none",
                          backgroundColor: "#11395C",
                          color: "#FFF",
                          mb: "1rem",
                          mr: "1rem",
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

            {/* Table */}
            <DataTable activeSubItem={activeSubItem} T6Data={data} />
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default EmployeeTargetReport;
