import { TextField, useMediaQuery } from "@mui/material";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardBody, CardHeader, Col, Row, Button } from "reactstrap";
import * as Yup from "yup";
import { AppDispatch, RootState } from "../../../redux/store";
import DataTable from "../../../components/common/UserInfoTable";
import { regEx } from "../../../helper/method";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { apiServices } from "../../../services";
import { useState } from "react";
import ShowToast from "../../../utils/toastUtils";

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
      riaCode: Yup.string().required("Please enter a RIA Code"),
    }),
    onSubmit: (values) => {
      const { riaCode } = values;
      console.log("submitClick", riaCode);
      fetchReport(values);
    },
  });

  const fetchReport = (values: any) => {
    let payload = {
      clientCode: values?.riaCode, //RA000029
      userType: "B2B",
      loginName: user_id, //1315
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
          ShowToast("error", response?.data?.message);
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
                        label="Enter RIA Code"
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
                        }}
                        type="submit"
                      >
                        Submit
                      </Button>
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
                <DataTable activeSubItem={activeSubItem} T6Data={report} />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default SubScriptionDetails;
