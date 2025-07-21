import { TextField, useMediaQuery } from "@mui/material";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardBody, CardHeader, Col, Row, Button } from "reactstrap";
// import * as Yup from "yup";
import { AppDispatch, RootState } from "../../../redux/store";
import DataTable from "../../../components/common/UserInfoTable";
import { regEx } from "../../../helper/method";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { apiServices } from "../../../services";
import { useState } from "react";
import ShowToast from "../../../utils/toastUtils";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import DownloadIcon from "@mui/icons-material/Download";
import * as Yup from "yup";

interface SPIPPeformance {
  activeSubItem: string;
}

const SubScriptionDetails = ({ activeSubItem }: SPIPPeformance) => {
  const [report, setReport] = useState<any[]>([]);

  const isMobile = useMediaQuery("(max-width:600px)");
  const dispatch = useDispatch<AppDispatch>();

  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );

  const formik = useFormik({
    initialValues: {
      riaCode: "",
    },
    validationSchema: Yup.object({
      riaCode: Yup.string().required("Please enter a Client Code"),
    }),
    onSubmit: (values) => {
      const { riaCode } = values;
      console.log("submitClick", riaCode);
      fetchReport(values);
    },
  });

  const fetchReport = (values: any) => {
    setReport([]);

    const userId = user_id.includes("-") ? user_id.split("-")[1] : user_id;
    console.log("userId", userId);

    let payload = {
      clientCode: values?.riaCode, //RA000029
      userType: "B2B",
      loginName: userId, //1315
    };

    dispatch(showLoader(""));
    apiServices
      .SPIPsubScriptionDetail(payload)
      .then((response) => {
        console.log(
          "SPIPsubScriptionDetailResponse-->",
          response?.data.message
        );
        dispatch(hideLoader());
        if (response?.data?.statusCode === 400) {
          setReport([]);
          // ShowToast("error", response?.data?.message);
          return;
        }
        if (response?.status === 200) {
          const filteredResponse = response?.data?.data?.map(
            (item: any, index: number) => ({
              ...item,
              id: index + 1,
            })
          );
          console.log("filterResponse-->", filteredResponse);

          setReport(filteredResponse);
        }
      })
      .catch((error) => {
        dispatch(hideLoader());
        console.log("Error", error);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    console.log("value", name, value);
    if (name === "riaCode") {
      if (regEx.alphaNumeric.test(value)) {
        formik.setFieldValue(name, value.toUpperCase().replace(/\s/g, ""));
      }
    } else {
      formik.handleChange(e);
    }
  };

  const handleExcelDownload = () => {
    // Convert data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(report);

    // Style the header row (first row, r = 0)
    const headerKeys = Object.keys(report[0]);

    headerKeys.forEach((key, colIndex) => {
      console.log(key);
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: colIndex });

      if (worksheet[cellAddress]) {
        worksheet[cellAddress].s = {
          fill: {
            patternType: "solid",
            fgColor: { rgb: "D9E1F2" },
          },
          font: {
            bold: true,
            sz: 14,
            color: { rgb: "000000" },
          },
          alignment: {
            horizontal: "center",
            vertical: "center",
          },
        };
      }
    });

    // Set uniform column widths
    worksheet["!cols"] = headerKeys.map(() => ({ wch: 20 }));

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report_data");

    // Generate timestamp string
    const now = new Date();
    const timeString = now
      .toLocaleTimeString("en-GB", { hour12: false }) // HH:MM:SS
      .replace(/:/g, "-"); // Replace ':' with '-' for valid filename

    const filename = `SPIP_subscription_details${timeString}.xlsx`;

    // Write and save file
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const excelFile = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(excelFile, filename);
  };

  const handleDownload = async (row: any) => {
    console.log("test1111", row);
    const userId = user_id.includes("-") ? user_id.split("-")[1] : user_id;
    console.log("userId", userId);
    const payload = {
      commandName:
        row?.productName === "SPIP" ? "spipInvoice" : "trilogyInvoice",
      loginName: userId,
      quarterId: row?.quarterId,
      clientCode: row?.clientCode,
      invoiceMonth: row?.invoiceMonth,
    };

    try {
      // dispatch(showLoader("Downloading..."));

      const response = await apiServices.GenerateAndDownloadInvoice(payload);

      if (response?.status === 200 && response?.data) {
        // Create blob from response
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);

        // Create a temporary anchor tag
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `${row?.clientCode}_${row?.invoiceMonth}_Invoice.pdf`
        );

        document.body.appendChild(link);
        link.click();

        // Clean up
        link.remove();
        window.URL.revokeObjectURL(url);
      } else {
        ShowToast("info", "Failed to download file");
      }
    } catch (error: any) {
      ShowToast("info", error.message || "An error occurred while downloading");
    } finally {
      dispatch(hideLoader());
    }
  };

  return (
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
                <h4 className="card-title mb-0">Client Subscription Details</h4>
              </CardHeader>
              <CardBody>
                <form onSubmit={formik.handleSubmit}>
                  <Row>
                    <Col
                      xs={12}
                      md={6}
                      lg={4}
                      style={{ marginTop: isMobile ? "16px" : "0" }}
                    >
                      <TextField
                        size="small"
                        id="client-code-input"
                        label="Enter Client Code"
                        variant="outlined"
                        name="riaCode"
                        type="text"
                        value={formik.values.riaCode}
                        onChange={handleCustomChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.riaCode &&
                          Boolean(formik.errors.riaCode)
                        }
                        helperText={
                          formik.touched.riaCode && formik.errors.riaCode
                        }
                        fullWidth
                      />
                    </Col>

                    <Col
                      className="d-flex p-0 m-0 mb-3"
                      style={{ alignItems: "flex-end", gap: "10px" }}
                    >
                      <Button
                        className="btn-font"
                        style={{
                          backgroundColor: "#11395C",
                          height: "36px",
                          marginBottom: "20px",
                          fontSize: "13px",
                          padding: "4px 10px",
                          marginTop: isMobile ? "10px" : "0px",
                          marginLeft: isMobile ? "12px" : "0px",
                        }}
                        type="submit"
                      >
                        Submit
                      </Button>
                      {report.length > 0 && (
                        <Button
                          className="btn-font"
                          style={{
                            backgroundColor: "#11395C",
                            height: "36px",
                            fontSize: "13px",
                            padding: "4px 10px",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            marginBottom: "20px",
                          }}
                          onClick={handleExcelDownload}
                        >
                          Excel <DownloadIcon style={{ fontSize: "16px" }} />
                        </Button>
                      )}
                    </Col>
                  </Row>
                </form>
              </CardBody>
            </Card>
            <Card
              style={{
                borderRadius: "15px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
              }}
            >
              <CardBody>
                <DataTable
                  activeSubItem={activeSubItem}
                  T6Data={report}
                  handleDownload={handleDownload}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default SubScriptionDetails;
