import React from "react";
import { Card, CardBody, CardHeader, Col, Row, Button } from "reactstrap";
import "../style.css";
import DownloadIcon from "@mui/icons-material/Download";
import PNLNote from "../../../components/common/pnlNote";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../redux/store";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { endpoints } from "../../../services/endpoints";
import { regEx } from "../../../helper/method";
import useMediaQuery from "@mui/material/useMediaQuery";
import ShowToast from "../../../utils/toastUtils";

const financialYears = [
  { value: "2023-2024", label: "2023-2024" },
  // { value: "2024-2025", label: "2024-2025" },
];

const AnnualPNL = () => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const dispatch = useDispatch<AppDispatch>();

  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );

  // Formik and Yup setup
  const formik = useFormik({
    initialValues: {
      finYear: "",
      clientCode: "",
    },
    validationSchema: Yup.object({
      finYear: Yup.string().required("Please select a Financial Year"),
      clientCode: Yup.string().required("Please enter a Client Code"),
    }),
    onSubmit: (values) => {
      const { finYear, clientCode } = values;
      console.log("submitClick", finYear, clientCode);

      const payload = {
        clientCode,
        finYear,
        userId: user_id, // replace with your actual user_id
      };

      const token = localStorage.getItem("tkn");
      dispatch(showLoader("Please wait, We are Processing your Request"));
      let apiUrl = "";
      if (finYear === "2023-2024") {
        apiUrl = `https://middlewareapi.lkp.net.in${endpoints.GetPNL}`; // Old API
      } else {
        apiUrl = `https://middlewareapi.lkp.net.in${endpoints.GetPNLStatement}`; // New API
      }

      axios
        .post(apiUrl, payload, {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const contentType = response.headers["content-type"] || "";

          if (contentType.includes("application/json")) {
            // Parse JSON error message
            const reader = new FileReader();
            reader.onload = (event: any) => {
              const result = JSON.parse(event.target.result);
              const message = result?.message || "No data found.";
              ShowToast("error", message);
            };
            reader.readAsText(response.data);
          } else if (
            contentType.includes(
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            )
          ) {
            // Download the Excel file
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "file.xlsx");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } else {
            // Unexpected content type
            ShowToast("error", "Unexpected response format.");
          }
        })
        .catch((error) => {
          console.error("Download error", error);
          ShowToast("error", "Download failed. Please try again later.");
        })
        .finally(() => {
          dispatch(hideLoader());
          // formik.resetForm(); // Uncomment if you want to reset the form
        });
    },
  });

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    console.log("value", name, value);
    if (name === "clientCode") {
      if (regEx.alphaNumeric.test(value)) {
        formik.setFieldValue(name, value.toUpperCase().replace(/\s/g, ""));
      }
    } else {
      formik.handleChange(e);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Row className="row-font">
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <h4 className="card-title mb-0">Tax PNL Statement</h4>
                </CardHeader>
                <CardBody>
                  <form onSubmit={formik.handleSubmit}>
                    <Row>
                      <Col xs={12} md={6} lg={4}>
                        <Box sx={{ minWidth: 120 }}>
                          <FormControl
                            fullWidth
                            error={
                              formik.touched.finYear &&
                              Boolean(formik.errors.finYear)
                            }
                          >
                            <InputLabel id="financial-year-select-label">
                              Financial Year
                            </InputLabel>
                            <Select
                              size="small"
                              labelId="financial-year-select-label"
                              id="financial-year-select"
                              name="finYear"
                              value={formik.values.finYear}
                              label=" Financial  Yearss"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            >
                              {financialYears.map((year) => (
                                <MenuItem key={year.value} value={year.value}>
                                  {year.label}
                                </MenuItem>
                              ))}
                            </Select>
                            {formik.touched.finYear &&
                              formik.errors.finYear && (
                                <p className="text-error">
                                  {formik.errors.finYear}
                                </p>
                              )}
                          </FormControl>
                        </Box>
                      </Col>
                      <Col
                        xs={12}
                        md={6}
                        lg={4}
                        style={{ marginTop: isMobile ? "16px" : "0" }}
                      >
                        <TextField
                          size="small"
                          id="client-code-input"
                          label="Client Code"
                          variant="outlined"
                          name="clientCode"
                          type="text"
                          value={formik.values.clientCode}
                          onChange={handleCustomChange}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.clientCode &&
                            Boolean(formik.errors.clientCode)
                          }
                          helperText={
                            formik.touched.clientCode &&
                            formik.errors.clientCode
                          }
                          fullWidth
                        />
                      </Col>
                      <Col
                        xs={12}
                        lg={4}
                        style={{ marginTop: isMobile ? "16px" : "0" }}
                      >
                        <Box textAlign={isMobile ? "center" : "left"}>
                          <Button
                            type="submit"
                            variant="contained"
                            className="btn-font"
                            sx={{
                              width: isMobile ? "100%" : "50%",
                            }}
                            style={{ backgroundColor: "#11395C" }}
                            startIcon={<DownloadIcon />}
                          >
                            Excel
                          </Button>
                        </Box>
                      </Col>
                    </Row>
                  </form>
                </CardBody>
                <PNLNote />
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  );
};

export default AnnualPNL;
