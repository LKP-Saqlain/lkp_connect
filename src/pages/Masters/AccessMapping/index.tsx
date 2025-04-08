import React from "react";
import {
  Card,
  CardHeader,
  Button,
  FormGroup,
  Label,
  Input,
  CardBody,
  Row,
  Col,
} from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
// import { useMediaQuery } from "@mui/material";
import ShowToast from "../../../utils/toastUtils";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const AccessMapping = () => {
  // const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  // const isMobile = useMediaQuery("(max-width: 768px)"); // Check for mobile screen size
  const formik = useFormik({
    initialValues: {
      dateOfCommunication: "",
      department: "",
      subject: "",
      lkpComments: "",
      circular: null, // File upload field
    },
    validationSchema: Yup.object({
      dateOfCommunication: Yup.string().required("Date is required"),
      department: Yup.string().required("Department is required"),
      subject: Yup.string().required("Subject is required"),
      lkpComments: Yup.string().required("LKP Comments are required"),
      circular: Yup.mixed().required("Circular file is required"),
    }),
    onSubmit: (values) => {
      console.log(values);
      ShowToast("success", "Marketing Material submitted successfully!");
    },
  });
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      // setUploadedFile(file);
      formik.setFieldValue("fileUpload", file.name);
    }
  };
  return (
    <div className="page-content">
      <div className="container-fluid">
        <Card style={{ minHeight: "80vh" }}>
          <CardHeader>
            <h4 className="card-title mb-0">Master Regulatory Announcement</h4>
          </CardHeader>
          <CardBody>
            <form onSubmit={formik.handleSubmit}>
              {/* First Row - 3 Fields */}
              <Row>
                <Col md="4">
                  <FormGroup>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <Label for="dateOfCommunication">Date</Label>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          format="DD/MM/YYYY"
                          value={
                            formik.values.dateOfCommunication
                              ? dayjs(
                                  formik.values.dateOfCommunication,
                                  "YYYY/MM/DD"
                                )
                              : null
                          }
                          maxDate={dayjs()}
                          minDate={dayjs().subtract(64, "year")}
                          onChange={(date: Dayjs | null) =>
                            formik.setFieldValue(
                              "dateOfCommunication",
                              date ? date.format("YYYY/MM/DD") : ""
                            )
                          }
                          slotProps={{
                            textField: {
                              error: Boolean(
                                formik.touched.dateOfCommunication &&
                                  formik.errors.dateOfCommunication
                              ),
                              helperText:
                                formik.touched.dateOfCommunication &&
                                formik.errors.dateOfCommunication,
                            },
                          }}
                        />
                      </LocalizationProvider>
                    </div>
                  </FormGroup>
                </Col>

                <Col md="4">
                  <FormGroup>
                    <Label for="department">Department</Label>
                    <Input
                      type="select"
                      name="department"
                      id="department"
                      value={formik.values.department}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      invalid={
                        formik.touched.department &&
                        Boolean(formik.errors.department)
                      }
                    >
                      <option value="">Select Department</option>
                      {["IT", "Account", "RMS"].map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </Input>
                    {formik.touched.department && formik.errors.department && (
                      <div style={{ color: "red" }}>
                        {formik.errors.department}
                      </div>
                    )}
                  </FormGroup>
                </Col>

                <Col md="4">
                  <FormGroup>
                    <Label for="subject">Subject</Label>
                    <Input
                      type="text"
                      name="subject"
                      id="subject"
                      value={formik.values.subject}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      invalid={
                        formik.touched.subject && Boolean(formik.errors.subject)
                      }
                      style={{ height: "2.5rem" }}
                    />
                    {formik.touched.subject && formik.errors.subject && (
                      <div style={{ color: "red" }}>
                        {formik.errors.subject}
                      </div>
                    )}
                  </FormGroup>
                </Col>
              </Row>

              {/* Second Row - 2 Fields */}
              <Row>
                <Col md="6">
                  <FormGroup>
                    <Label for="lkpComments">LKP Comments</Label>
                    <Input
                      type="text"
                      name="lkpComments"
                      id="lkpComments"
                      value={formik.values.lkpComments}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      invalid={
                        formik.touched.lkpComments &&
                        Boolean(formik.errors.lkpComments)
                      }
                    />
                    {formik.touched.lkpComments &&
                      formik.errors.lkpComments && (
                        <div style={{ color: "red" }}>
                          {formik.errors.lkpComments}
                        </div>
                      )}
                  </FormGroup>
                </Col>

                <Col md="6">
                  <FormGroup>
                    <Label for="circular">Circular (Upload File)</Label>
                    <Input
                      type="file"
                      name="circular"
                      id="circular"
                      accept=".doc,.docx,.pdf,.xls,.xlsx,.jpg,.jpeg,.heic"
                      onChange={handleFileChange}
                      onBlur={formik.handleBlur}
                      invalid={
                        formik.touched.circular &&
                        Boolean(formik.errors.circular)
                      }
                    />
                    {formik.touched.circular && formik.errors.circular && (
                      <div style={{ color: "red" }}>
                        {formik.errors.circular}
                      </div>
                    )}
                  </FormGroup>
                </Col>
              </Row>

              {/* Submit Button */}
              <Button
                type="submit"
                color="primary"
                style={{
                  backgroundColor: "#11395C",
                  height: "35px",
                  marginTop: "20px",
                }}
              >
                Submit
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default AccessMapping;
