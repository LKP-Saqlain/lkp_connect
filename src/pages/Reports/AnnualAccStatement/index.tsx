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
  const isMobile = useMediaQuery("(max-width:800px)");
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
      const payload = {
        clientCode,
        finYear: "",
        userId: user_id,
      };

      dispatch(showLoader(""));

      try {
        const response: any = await apiServices.GetPNLAccountDetailsPdf(
          payload
        );
        const contentType = response.headers["content-type"];

        if (isJsonResponse(contentType)) {
          handleJsonResponse(response.data);
        } else if (isPdfResponse(contentType)) {
          triggerFileDownload(
            response.data,
            `${clientCode}_Performance_Report.pdf`,
            "application/pdf"
          );
        } else {
          ShowToast("error", "Unexpected response format.");
        }
      } catch (error: any) {
        handleError(error);
      } finally {
        dispatch(hideLoader());
      }
    },
  });

  const isJsonResponse = (contentType: string) =>
    contentType.includes("application/json");

  const isPdfResponse = (contentType: string) =>
    contentType.includes("application/pdf");

  const handleJsonResponse = (data: Blob) => {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      const result = JSON.parse(event.target.result);
      const message = result?.message || "No data found.";
      ShowToast("error", message);
    };
    reader.readAsText(data);
  };

  const triggerFileDownload = (
    data: Blob,
    fileName: string,
    fileType: string
  ) => {
    const file = new Blob([data], { type: fileType });
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleError = (error: any) => {
    console.error("Error -->", error);
    const errorMessage =
      error.response?.data?.message ||
      "Sorry for the inconvenience, please try again later.";
    ShowToast("error", errorMessage);
  };

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
                    backgroundColor: "#fff", // optional for contrast
                  }}
                >
                  <h4 className="card-title mb-0">
                    Account Performance Report
                  </h4>
                </CardHeader>
                <CardBody>
                  <form onSubmit={formik.handleSubmit}>
                    <Row>
                      <Col
                        md={4}
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
                        md={4}
                        style={{ marginTop: isMobile ? "16px" : "0" }}
                      >
                        <Box textAlign={isMobile ? "center" : "left"}>
                          <Button
                            type="submit"
                            variant="contained"
                            className="btn-font"
                            style={{
                              width: isMobile ? "100%" : "60%",
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
