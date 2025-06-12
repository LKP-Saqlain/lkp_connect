import { TextField, useMediaQuery } from "@mui/material";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { Card, CardBody, CardHeader, Col, Row, Button } from "reactstrap";
import * as Yup from "yup";
import { AppDispatch } from "../../../redux/store";
import DataTable from "../../../components/common/UserInfoTable";
import { regEx } from "../../../helper/method";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { apiServices } from "../../../services";
import { useState } from "react";

interface SPIPPeformance {
  activeSubItem: string;
}

export const spipPerformanceReport = [
  {
    id: 1,
    month: "June 2025",
    clientCode: "C00123",
    clientName: "John Doe",
    status: "Active",
    scripName: "RELIANCE",
    securityName: "Reliance Industries Ltd",
    buyQty: 100,
    buyRate: 2500.5,
    buyValue: 250050,
    sellQty: 50,
    sellRate: 2550.75,
    sellValue: 127537.5,
    openQty: 50,
    marketRate: 2560.0,
    marketValue: 128000,
    profitLoss: 7487.5,
    plPercent: "2.99%",
  },
  {
    id: 2,
    month: "June 2025",
    clientCode: "C00456",
    clientName: "Jane Smith",
    status: "Active",
    scripName: "TCS",
    securityName: "Tata Consultancy Services",
    buyQty: 200,
    buyRate: 3500.0,
    buyValue: 700000,
    sellQty: 150,
    sellRate: 3600.5,
    sellValue: 540075,
    openQty: 50,
    marketRate: 3620.0,
    marketValue: 181000,
    profitLoss: 21075,
    plPercent: "3.01%",
  },
];

const SPIPClientDetails = ({ activeSubItem }: SPIPPeformance) => {
  const [report, setReport] = useState<any[]>([]);

  const isMobile = useMediaQuery("(max-width:600px)");
  const dispatch = useDispatch<AppDispatch>();

  // const { user_id } = useSelector(
  //   (state: RootState) => state.UserLogin?.data?.data
  // );

  const formik = useFormik({
    initialValues: {
      clientCode: "",
    },
    validationSchema: Yup.object({
      clientCode: Yup.string().required("Please enter a Client Code"),
    }),
    onSubmit: (values) => {
      const { clientCode } = values;
      console.log("submitClick", clientCode);
      fetchReport(values);
    },
  });

  const fetchReport = (values: any) => {
    let payload = {
      branchCode: "", //0408
      clientCode: values?.clientCode,
      option: "RAPortal",
    };

    dispatch(showLoader(""));
    apiServices
      .SPIPB2BClientDetails(payload)
      .then((response) => {
        console.log("SPIPSummaryResponse-->", response?.data?.data);
        dispatch(hideLoader());
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
    if (name === "clientCode") {
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
                <h4 className="card-title mb-0">Client Details</h4>
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
                  // handleApproval={handleApproval}
                  // handleDownload={handlePreview}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default SPIPClientDetails;
