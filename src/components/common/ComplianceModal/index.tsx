import { Button, Col, Input, Modal, ModalBody, ModalHeader } from "reactstrap";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import "./style.css";
import { useFormik } from "formik";
import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";

const CommunicationMenu = [
  { value: "Email", label: "Email" },
  { value: "Physical", label: "Physical" },
];

const department = [
  { value: "IT", label: "IT" },
  { value: "Account", label: "Account" },
  { value: "RMS", label: "RMS" },
];

const TypeOfDocument = [
  { value: "Circular", label: "Circular" },
  { value: "SEBI", label: "SEBI" },
];

const ModalComponent = ({
  tog_grid,
  modal_grid,
}: {
  modal_grid: boolean;
  tog_grid: () => void;
}) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileExtension, setFileExtension] = useState("");
  // const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const allowedFormats = ["doc", "docx", "pdf", "xls", "xlsx", "jpg", "jpeg"];

  const dispatch = useDispatch<AppDispatch>();

  const formik = useFormik({
    initialValues: {
      documentType: "", // Default value for Type of Document
      department: "",
      communicationType: "",
      dateOfCommunication: "",
    },
    validate: (values) => {
      const errors = {};
      // if (!values.finYear) errors.finYear = "Financial Year is required";
      // if (!values.department) errors.department = "Department is required";
      console.log("values", values);

      return errors;
    },
    onSubmit: (values) => {
      console.log("Submitted values:", values);
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const fileExt = file.name.split(".").pop()?.toLowerCase() || "";

      if (allowedFormats.includes(fileExt)) {
        dispatch(showLoader("")); // Show loader before setting state
        console.log(fileExtension);

        setTimeout(() => {
          setUploadedFile(file);
          setFileExtension(fileExt);
          dispatch(hideLoader()); // Hide loader after file processing
        }, 1000);
      } else {
        alert("Invalid file format! Allowed: DOC, PDF, XLS, XLSX, JPG, JPEG");
      }
    }
  };

  const handleFileDelete = () => {
    dispatch(showLoader("")); // Show loader before deleting

    setTimeout(() => {
      setUploadedFile(null);
      setFileExtension("");
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset the file input value
      }
      dispatch(hideLoader()); // Hide loader after reset
    }, 500);
  };

  const handleCancel = () => {
    formik.resetForm(); // Reset form fields
    setUploadedFile(null); // Reset uploaded file
    setFileExtension(""); // Reset file extension
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the file input field
    }
    tog_grid(); // Close the modal
  };

  useEffect(() => {
    console.log("formValues", formik.values);
  }, [formik.values]);

  return (
    <Modal
      style={{ fontFamily: "Public Sans" }}
      isOpen={modal_grid}
      toggle={tog_grid}
      centered
    >
      <ModalHeader className="modal-title" toggle={tog_grid}>
        Add Entry
      </ModalHeader>
      <ModalBody>
        <form action="#">
          <div className="row g-3">
            <Col lg={12}>
              <div>
                <FormControl fullWidth>
                  <label style={{ fontSize: "12px" }} className="form-label">
                    Date of Communication
                  </label>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      // format="DD/MM/YYYY"
                      value={
                        formik.values.dateOfCommunication
                          ? dayjs(
                              formik.values.dateOfCommunication,
                              "DD/MM/YYYY"
                            )
                          : null
                      }
                      maxDate={dayjs().subtract(0, "year")}
                      minDate={dayjs().subtract(64, "year")}
                      onChange={(date: Dayjs | null) =>
                        formik.setFieldValue(
                          "dateOfCommunication",
                          date ? date.format("DD/MM/YYYY") : ""
                        )
                      }
                      // slotProps={{
                      //   textField: {
                      //     error: Boolean(
                      //       formik.touched.dateOfCommunication &&
                      //         formik.errors.dateOfCommunication
                      //     ),
                      //     helperText:
                      //       formik.touched.dateOfCommunication &&
                      //       formik.errors.dateOfCommunication,
                      //   },
                      // }}
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>
            </Col>
            <Col xxl={6}>
              <FormControl
                fullWidth
                error={
                  formik.touched.documentType &&
                  Boolean(formik.errors.documentType)
                }
              >
                <InputLabel id="documentType-modal-select-label">
                  Type of Document
                </InputLabel>
                <Select
                  size="small"
                  labelId="documentType-modal-select-label"
                  id="documentType-select"
                  name="documentType"
                  value={formik.values.documentType}
                  label="documentType"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  {TypeOfDocument.map((docType) => (
                    <MenuItem key={docType.value} value={docType.value}>
                      {docType.label}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.communicationType &&
                  formik.errors.communicationType && (
                    <p className="text-error">
                      {formik.errors.communicationType}
                    </p>
                  )}
              </FormControl>
            </Col>
            <Col xxl={6}>
              <FormControl
                fullWidth
                error={
                  formik.touched.department && Boolean(formik.errors.department)
                }
              >
                <InputLabel
                // id="communicationType-modal-select-label"
                // sx={{
                //   backgroundColor: "white",
                // }}
                >
                  Communication Type
                </InputLabel>
                <Select
                  size="small"
                  labelId="communicationType-modal-select-label"
                  id="communicationType-select"
                  name="communicationType"
                  value={formik.values.communicationType}
                  label="communicationType"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  {CommunicationMenu.map((dept) => (
                    <MenuItem key={dept.value} value={dept.value}>
                      {dept.label}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.communicationType &&
                  formik.errors.communicationType && (
                    <p className="text-error">
                      {formik.errors.communicationType}
                    </p>
                  )}
              </FormControl>
            </Col>
            <Col xxl={6}>
              <div>
                <label
                  style={{ fontSize: "12px" }}
                  htmlFor="lastName"
                  className="form-label"
                >
                  Proof of Communication Description
                </label>
                <Input
                  type="text"
                  className="form-control"
                  id="lastName"
                  placeholder="Enter Proof of Communication"
                />
              </div>
            </Col>
            <Col lg={12}>
              <label style={{ fontSize: "12px" }} className="form-label">
                Upload Proof of Communication
              </label>
              <Input
                innerRef={fileInputRef}
                type="file"
                accept=".doc,.docx,.pdf,.xls,.xlsx,.jpg,.jpeg"
                className="form-control"
                onChange={handleFileUpload}
              />
              {uploadedFile && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "10px",
                  }}
                >
                  <p>File: {uploadedFile.name}</p>
                  <Button
                    variant="contained"
                    style={{ backgroundColor: "#11395C" }}
                    onClick={handleFileDelete}
                  >
                    Delete
                  </Button>
                </div>
              )}
            </Col>
            <Col lg={12}>
              <FormControl
                fullWidth
                error={
                  formik.touched.department && Boolean(formik.errors.department)
                }
              >
                <InputLabel id="department-select-label">Department</InputLabel>
                <Select
                  size="small"
                  labelId="department-select-label"
                  id="department-select"
                  name="department"
                  value={formik.values.department}
                  label="Department"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  sx={{ fontFamily: "Public Sans" }}
                >
                  {department.map((dept) => (
                    <MenuItem key={dept.value} value={dept.value}>
                      {dept.label}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.department && formik.errors.department && (
                  <p className="text-error">{formik.errors.department}</p>
                )}
              </FormControl>
            </Col>
            <Col lg={12}>
              <div className="hstack gap-2 justify-content-end">
                <Button
                  style={{
                    backgroundColor: "#11395C",
                    padding: "6px 12px",
                    fontSize: "11px",
                    height: "35px",
                    width: "auto",
                  }}
                  onClick={tog_grid}
                >
                  Submit
                </Button>
                <Button
                  style={{
                    backgroundColor: "#11395C",
                    padding: "6px 12px",
                    fontSize: "11px",
                    height: "35px",
                    width: "auto",
                  }}
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </div>
            </Col>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
};

export default ModalComponent;
