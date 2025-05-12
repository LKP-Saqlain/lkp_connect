import React, { useState } from "react";
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
  FormFeedback,
  Container,
} from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import ShowToast from "../../../utils/toastUtils";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { apiServices } from "../../../services";

const DEPARTMENTS = ["IT", "Account", "RMS"];
const allowedFileFormats = ["doc", "docx", "pdf", "xls", "xlsx"];

const RegAnnMaster = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const formik = useFormik({
    initialValues: {
      dateOfCommunication: "",
      department: "",
      subject: "",
      lkpComments: "",
      circular: null,
    },
    validationSchema: Yup.object({
      dateOfCommunication: Yup.string().required("Date is required"),
      department: Yup.string().required("Department is required"),
      subject: Yup.string().required("Subject is required"),
      lkpComments: Yup.string().required("LKP Comments are required"),
      circular: Yup.mixed().required("Circular file is required"),
    }),
    onSubmit: async (values) => {
      if (!uploadedFile) {
        ShowToast("error", "Please upload the circular file.");
        return;
      }

      const fileExt = uploadedFile.name.split(".").pop()?.toLowerCase();
      if (!fileExt || !allowedFileFormats.includes(fileExt)) {
        ShowToast("error", "Invalid file format.");
        return;
      }

      try {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(uploadedFile);
          reader.onload = () =>
            resolve((reader.result as string).split(",")[1]);
          reader.onerror = reject;
        });

        const payload = {
          options: "INSERT",
          rowId: 0,
          date: values.dateOfCommunication,
          department: values.department,
          subject: values.subject,
          lkpComments: values.lkpComments,
          cirCularFileName: uploadedFile.name,
          circularFileBase64: base64,
        };

        const response = await apiServices.getInUpRegAnnoucement(payload);

        if (response?.status === 200) {
          ShowToast("success", response.data?.message);
          formik.resetForm();
          setUploadedFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        } else {
          throw new Error("Submission failed.");
        }
      } catch (error) {
        console.error(error);
        ShowToast("error", "Error submitting announcement.");
      }
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (!ext || !allowedFileFormats.includes(ext)) {
        formik.setFieldError("circular", "Invalid file format.");
        setUploadedFile(null);
        return;
      }
      setUploadedFile(file);
      formik.setFieldValue("circular", file);
    }
  };

  return (
    <div className="page-content page-view">
      <Container fluid>
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
            <h4 className="card-title mb-0">Master Regulatory Announcement</h4>
          </CardHeader>
          <CardBody>
            <form onSubmit={formik.handleSubmit}>
              <Row>
                <Col md="4">
                  <FormGroup>
                    <Label for="dateOfCommunication">Date</Label>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          format="DD/MM/YYYY"
                          value={
                            formik.values.dateOfCommunication
                              ? dayjs(formik.values.dateOfCommunication)
                              : null
                          }
                          maxDate={dayjs()}
                          minDate={dayjs().subtract(64, "year")}
                          onChange={(date: Dayjs | null) =>
                            formik.setFieldValue(
                              "dateOfCommunication",
                              date?.format("YYYY/MM/DD") || ""
                            )
                          }
                          slotProps={{
                            textField: {
                              error:
                                formik.touched.dateOfCommunication &&
                                Boolean(formik.errors.dateOfCommunication),
                              helperText:
                                formik.touched.dateOfCommunication &&
                                formik.errors.dateOfCommunication,
                              size: "small",
                              fullWidth: true,
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
                      {DEPARTMENTS.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </Input>
                    <FormFeedback>{formik.errors.department}</FormFeedback>
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
                    <FormFeedback>{formik.errors.subject}</FormFeedback>
                  </FormGroup>
                </Col>
              </Row>

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
                    <FormFeedback>{formik.errors.lkpComments}</FormFeedback>
                  </FormGroup>
                </Col>

                <Col md="6">
                  <FormGroup>
                    <Label for="circular">Circular (Upload File)</Label>
                    <Input
                      type="file"
                      name="circular"
                      id="circular"
                      accept=".doc,.docx,.pdf,.xls,.xlsx,"
                      onChange={handleFileChange}
                      onBlur={formik.handleBlur}
                      invalid={
                        formik.touched.circular &&
                        Boolean(formik.errors.circular)
                      }
                    />
                    <FormFeedback>{formik.errors.circular}</FormFeedback>
                  </FormGroup>
                </Col>
              </Row>

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
      </Container>
    </div>
  );
};

export default RegAnnMaster;
