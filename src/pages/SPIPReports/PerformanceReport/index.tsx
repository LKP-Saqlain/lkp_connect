import React from "react";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import {
  Box,
  Button,
  InputLabel,
  MenuItem,
  FormControl,
  TextField,
  Select,
  useMediaQuery,
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AppDispatch } from "../../../redux/store";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
import ShowToast from "../../../utils/toastUtils";
import { apiServices } from "../../../services";
import Tooltip from "@mui/material/Tooltip";

const financialYears = [
  { value: "2024-2025", label: "2024-2025" },
  { value: "2025-2026", label: "2025-2026" },
];

const PerformanceReport = () => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const dispatch = useDispatch<AppDispatch>();

  const formik = useFormik({
    initialValues: {
      finYear: "",
      raCode: "",
    },
    validationSchema: Yup.object({
      finYear: Yup.string().required("Please select a Financial Year"),
      raCode: Yup.string().required("Please enter RA Code"),
    }),
    onSubmit: async ({ finYear, raCode }) => {
      const payload = { raCode, year: finYear };
      try {
        dispatch(showLoader(""));
        const response = await apiServices.GenerateClientPerformancePdf(
          payload
        );
        console.log("pdfResponse-->", response);

        if (response?.status === 200 && response.data) {
          const blob = new Blob([response.data], { type: "application/pdf" });
          const url = URL.createObjectURL(blob);

          const link = document.createElement("a");
          link.href = url;
          link.setAttribute(
            "download",
            `SPIP_PERFORMANCE_${raCode}_${finYear}.pdf`
          );
          document.body.appendChild(link);
          link.click();
          link.remove();
          URL.revokeObjectURL(url);
        } else {
          ShowToast("info", "Failed to download file");
        }
      } catch (error: any) {
        console.log("", error);

        ShowToast(
          "info",
          error?.message || "An error occurred while downloading"
        );
      } finally {
        dispatch(hideLoader());
      }
    },
  });
  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;

    if (name === "clientCode") {
      // Remove all non-alphanumeric characters
      const filteredValue = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
      formik.setFieldValue(name, filteredValue);
    } else {
      formik.handleChange(e);
    }
  };

  return (
    <div className="page-content page-view">
      <div className="container-fluid">
        <Row className="row-font">
          <Col lg={12}>
            <Card
              style={{
                minHeight: "80vh",
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
                <h4 className="card-title mb-0">SPIP Performance Report</h4>
              </CardHeader>
              <CardBody>
                <form onSubmit={formik.handleSubmit}>
                  <Row>
                    <Col xs={12} md={6} lg={4}>
                      {/* <FormControl
                        fullWidth
                        error={
                          formik.touched.finYear &&
                          Boolean(formik.errors.finYear)
                        }
                        sx={{ mb: isMobile ? 2 : 0 }}
                      >
                        <InputLabel id="financial-year-select-label">
                          Financial Year
                        </InputLabel>
                        <Select
                          size="small"
                          labelId="financial-year-select-label"
                          id="financial-year-select"
                          name="finYear "
                          value={formik.values.finYear}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          label="Financial Year  "
                        >
                          {financialYears.map((year) => (
                            <MenuItem key={year.value} value={year.value}>
                              {year.label}
                            </MenuItem>
                          ))}
                        </Select>
                        {formik.touched.finYear && formik.errors.finYear && (
                          <p className="text-error">{formik.errors.finYear}</p>
                        )}
                      </FormControl> */}
                      <FormControl
                        fullWidth
                        error={
                          formik.touched.finYear &&
                          Boolean(formik.errors.finYear)
                        }
                        sx={{ minHeight: 36 }}
                      >
                        <InputLabel
                          id="Department-select-label"
                          sx={{ fontSize: "0.85rem", top: -6 }}
                        >
                          Financial Year
                        </InputLabel>
                        <Select
                          size="small"
                          labelId="Department-select-label"
                          id="finYear"
                          name="finYear"
                          value={formik.values.finYear}
                          label="Financial Year"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          sx={{
                            height: 36,
                            fontSize: "0.85rem",
                            ".MuiSelect-select": {
                              paddingY: "6px",
                            },
                          }}
                        >
                          {financialYears.map((docType) => (
                            <MenuItem key={docType.value} value={docType.value}>
                              {docType.label}
                            </MenuItem>
                          ))}
                        </Select>
                        {formik.touched.finYear && formik.errors.finYear && (
                          <p className="text-error">{formik.errors.finYear}</p>
                        )}
                      </FormControl>
                    </Col>

                    <Col
                      xs={12}
                      md={6}
                      lg={4}
                      style={{ marginTop: isMobile ? "16px" : "0" }}
                    >
                      <TextField
                        size="small"
                        fullWidth
                        id="client-code-input"
                        label="Enter RA Code"
                        name="raCode"
                        value={formik.values.raCode}
                        onChange={handleCustomChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.raCode && Boolean(formik.errors.raCode)
                        }
                        helperText={
                          formik.touched.raCode && formik.errors.raCode
                        }
                      />
                    </Col>

                    <Col
                      xs={12}
                      lg={4}
                      style={{ marginTop: isMobile ? "16px" : "0" }}
                    >
                      <Box textAlign={isMobile ? "center" : "left"}>
                        <Tooltip title={"Download PDF"} arrow placement="top">
                          <Button
                            type="submit"
                            variant="contained"
                            sx={{
                              backgroundColor: "#11395C",
                              width: "10%",
                              height: 36,
                              minHeight: "unset",
                              padding: "6px 12px",
                              textTransform: "none",
                              "&:hover": { backgroundColor: "#0d2e49" },
                            }}
                            className="btn-font"
                          >
                            <span style={{ cursor: "pointer" }}>
                              <PictureAsPdfIcon fontSize="small" />
                            </span>
                          </Button>
                        </Tooltip>
                      </Box>
                    </Col>
                  </Row>
                </form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default PerformanceReport;
