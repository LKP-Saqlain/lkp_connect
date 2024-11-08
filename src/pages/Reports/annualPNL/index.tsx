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

const financialYears = [{ value: "2023-2024", label: "2023-2024" }];

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
      clientCode: Yup.string()
        // .matches(/^[a-zA-Z0-9]*$/, "Only alphanumeric characters allowed")
        .required("Please enter a Client Code"),
    }),
    onSubmit: async (values) => {
      const { finYear, clientCode } = values;
      console.log("submitClick", finYear, clientCode);
      // let uId = localStorage.getItem("Id");
      const payload = {
        clientCode: clientCode,
        finYear: finYear,
        userId: user_id,
      };
      try {
        let token = localStorage.getItem("tkn");
        dispatch(showLoader("Please wait, We are Processing your Request"));
        const response = await axios.post(
          `https://middlewareapi.lkp.net.in${endpoints.GetPNL}`,
          payload,
          {
            responseType: "blob",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "file.xlsx");
        document.body.appendChild(link);
        link.click();
        dispatch(hideLoader());
        formik.resetForm();
      } catch (error) {
        console.error("Download error", error);
        dispatch(hideLoader());
      }
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
          <Row style={{ fontFamily: "Public Sans" }}>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <h4 className="card-title mb-0">Annual PNL Statement</h4>
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
                              label="Financial Year"
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
                            sx={{
                              width: isMobile ? "100%" : "50%",
                              backgroundColor: "#11395C",
                              "&:hover": {
                                backgroundColor: "#0d2d4a",
                              },
                            }}
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
