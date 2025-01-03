import React from "react";
import { Card, CardBody, CardHeader, Col, Row, Button } from "reactstrap";
import "../style.css";
import DownloadIcon from "@mui/icons-material/Download";
// import PNLNote from "../../../components/common/pnlNote";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../redux/store";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
import { useFormik } from "formik";
import * as Yup from "yup";
import { regEx } from "../../../helper/method";
import useMediaQuery from "@mui/material/useMediaQuery";
import { apiServices } from "../../../services";
import ShowToast from "../../../utils/toastUtils";

const AnnualAccStatement = () => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const dispatch = useDispatch<AppDispatch>();

  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );

  // Formik and Yup setup
  const formik = useFormik({
    initialValues: {
      clientCode: "",
    },
    validationSchema: Yup.object({
      clientCode: Yup.string().required("Please enter a Client Code"),
    }),
    onSubmit: async (values) => {
      const { clientCode } = values;
      console.log("submitClick", clientCode);
      const payload = {
        clientCode: clientCode,
        finYear: "",
        userId: user_id,
      };
      dispatch(showLoader("")); // Show the loader

      apiServices
        .GetPNLAccountDetailsPdf(payload) // <-- specify responseType as 'blob'
        .then((response) => {
          console.log("GetPNLAccountDetailsPdf_response", response?.data);

          // Ensure the response data is a Blob (PDF file)
          if (response && response.data) {
            const file = new Blob([response?.data], {
              type: "application/pdf",
            });

            // Use FileReader to read the PDF data
            const reader = new FileReader();
            reader.onload = function (event) {
              // Log the base64 string representation of the PDF
              console.log("PDF Data:", event?.target?.result);
            };
            reader.readAsDataURL(file);

            // Optionally, trigger the file download as well
            const link = document.createElement("a");
            link.href = URL.createObjectURL(file);
            link.download = `${clientCode}_Performance_Report.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } else {
            console.error("No PDF data received.");
          }
        })
        .catch((Err) => {
          console.error(Err, "error-->");
          const errorMessage =
            Err.response?.data?.message ||
            "Sorry for the inconvenience, please try again later.";
          ShowToast("error", errorMessage);
        })
        .finally(() => {
          // Hide the loader in the finally block
          dispatch(hideLoader());
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
              <Card style={{ minHeight: "85vh" }}>
                <CardHeader>
                  <h4 className="card-title mb-0">
                    Account Performance Report
                  </h4>
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
                          inputProps={{
                            maxLength: 20,
                          }}
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
                            style={{
                              width: isMobile ? "100%" : "50%",
                              backgroundColor: "#11395C",
                            }}
                            startIcon={<DownloadIcon />}
                          >
                            Download PDF
                          </Button>
                        </Box>
                      </Col>
                    </Row>
                  </form>
                </CardBody>
                {/* <PNLNote /> */}
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  );
};

export default AnnualAccStatement;
