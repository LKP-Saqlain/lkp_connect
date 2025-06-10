import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  useMediaQuery,
} from "@mui/material";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Button,
  Label,
} from "reactstrap";
import * as Yup from "yup";
import { AppDispatch, RootState } from "../../../redux/store";

const financialYears = [
  { value: "2023-2024", label: "2023-2024" },
  { value: "2024-2025", label: "2024-2025" },
];

const SPIPPerformanceDashboard = () => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const dispatch = useDispatch<AppDispatch>();

  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );

  const formik = useFormik({
    initialValues: {
      finYear: "",
      clientCode: "",
    },
    validationSchema: Yup.object({
      finYear: Yup.string().required("Please select a Financial Year"),
      clientCode: Yup.string().required("Please enter a Terminal Code"),
    }),
    onSubmit: (values) => {
      const { finYear, clientCode } = values;
      console.log("submitClick", finYear, clientCode);
    },
  });

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
                <h4 className="card-title mb-0">SPIP Performance Dashboard</h4>
              </CardHeader>
              <CardBody>
                <form>
                  <Row>
                    <Col xs={12} md={6} lg={4} className="mb-3">
                      {" "}
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
                          {formik.touched.finYear && formik.errors.finYear && (
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
                        label="Terminal Code"
                        variant="outlined"
                        name="clientCode"
                        type="text"
                        value={formik.values.clientCode}
                        // onChange={handleCustomChange}
                        // onChange={handleCustomChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.clientCode &&
                          Boolean(formik.errors.clientCode)
                        }
                        helperText={
                          formik.touched.clientCode && formik.errors.clientCode
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
                        }}
                        type="submit"
                      >
                        Submit
                      </Button>

                      {/* {selectedData.length > 0 && (
                        <Button
                          className="btn-font"
                          style={{
                            backgroundColor: "#11395C",
                            height: "36px",
                            width: selectedData.length > 0 ? "80px" : "90px",
                            fontSize: "13px",
                            padding: "4px 10px",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                          onClick={handleExcelDownload}
                        >
                          Excel <DownloadIcon style={{ fontSize: "16px" }} />
                        </Button>
                      )} */}
                    </Col>
                  </Row>
                  {/* </div> */}
                </form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default SPIPPerformanceDashboard;
