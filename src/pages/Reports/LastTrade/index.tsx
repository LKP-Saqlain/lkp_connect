import React, { useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Label,
  Row,
  Button,
} from "reactstrap";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
import axios from "axios";
import * as Yup from "yup";
import { useFormik } from "formik";

import Select from "react-select";
import { endpoints } from "../../../services/endpoints";

const ClientStatus = [
  { value: "ALL", label: "ALL" },
  { value: "ACTIVE", label: "ACTIVE" },
  { value: "INACTIVE", label: "INACTIVE" },
  //   { value: "Madrid", label: "Madrid" },
  //   { value: "Toronto", label: "Toronto" },
];

const LastTrade = () => {
  // const [pnlValues, setPnlValues] = useState<any>("");

  const dispatch = useDispatch();

  const validationSchema = Yup.object({
    clientStatus: Yup.object()
      .nullable()
      .required("Please select Client Status"),
  });

  interface FormValues {
    clientStatus: { label: string; value: string } | null;
  }

  const formik = useFormik<FormValues>({
    initialValues: {
      clientStatus: null,
    },
    validationSchema,
    onSubmit: (values) => {
      // Only called if no validation errors
      console.log("values1-->", values);
      handleExcel();
    },
  });

  useEffect(() => {
    console.log("formikValls", formik.values, formik.errors);
  }, [formik.values]);

  // const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = e.target.value;
  //   console.log("value", value);
  //   if (regEx.alphaNumeric.test(value)) {
  //     setPnlValues(value.toUpperCase().replace(/\s/g, ""));
  //   }
  // };

  const getUserIdFromLocalStorage = (key: any) => {
    const str = localStorage.getItem(key);
    if (str) {
      const parts = str.split("-");
      return parts.length > 1 ? parts[1] : null;
    }
    return null;
  };

  const downloadFile = (data: any, filename: any) => {
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Clean up the link element
  };

  const handleExcel = async () => {
    dispatch(showLoader("Please wait, We are Processing your Request"));

    try {
      const extractUserId = getUserIdFromLocalStorage("Id");

      const payload = {
        user_id: extractUserId,
        active: formik.values.clientStatus?.value,
      };

      const token = localStorage.getItem("tkn");

      // Make the API call
      const response = await axios.post(
        `https://middlewareapi.lkp.net.in${endpoints.lastTradeDate}`,
        payload,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      downloadFile(response.data, "file.xlsx");
    } catch (error) {
      console.error("Download error", error);
    } finally {
      dispatch(hideLoader());
    }
  };

  document.title = "LKP Securities | Last Trade Status";

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Row style={{ fontFamily: "Public Sans" }}>
            <Col lg={12}>
              <Card style={{ minHeight: "85vh" }}>
                <CardHeader>
                  <h4 className="card-title mb-0">Last Trade</h4>
                </CardHeader>
                <CardBody>
                  <form onSubmit={formik.handleSubmit}>
                    <div>
                      <Row>
                        <Col xl={4}>
                          <div className="mb-3">
                            <Label
                              htmlFor="choices-single-no-sorting"
                              className="form-label text-muted"
                            >
                              Select Client Status
                            </Label>
                            <Select
                              value={formik.values.clientStatus}
                              onChange={(option: any) =>
                                formik.setFieldValue("clientStatus", option)
                              }
                              onBlur={formik.handleBlur}
                              options={ClientStatus}
                              styles={{
                                control: (base: any) => ({
                                  ...base,
                                  borderColor:
                                    formik.touched.clientStatus &&
                                    formik.errors.clientStatus
                                      ? "#DC4535"
                                      : base.borderColor,
                                  "&:hover": {
                                    borderColor:
                                      formik.touched.clientStatus &&
                                      formik.errors.clientStatus
                                        ? "#DC4535"
                                        : base.borderColor,
                                  },
                                }),
                              }}
                            />
                            {formik.touched.clientStatus &&
                              formik.errors.clientStatus && (
                                <div
                                  className="text-danger"
                                  style={{ fontSize: "12px" }}
                                >
                                  {formik.errors.clientStatus}
                                </div>
                              )}
                          </div>
                        </Col>

                        <Col
                          xl={4}
                          className="d-flex flex-column-reverse"
                          style={{
                            top:
                              formik.touched.clientStatus &&
                              formik.errors.clientStatus
                                ? "-18px"
                                : "",
                          }}
                        >
                          <div className="mb-3" />
                          <Button
                            className="w-50"
                            style={{ backgroundColor: "#11395C" }}
                            // onClick={handleExcel}
                            type="submit"
                          >
                            Submit
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  </form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  );
};

export default LastTrade;
