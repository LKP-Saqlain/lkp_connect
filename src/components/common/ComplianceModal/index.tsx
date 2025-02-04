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
import * as Yup from "yup";
import { apiServices } from "../../../services";
import ShowToast from "../../../utils/toastUtils";

const CommunicationMenu = [
  { value: "Email", label: "Email" },
  { value: "Physical", label: "Physical" },
  { value: "string", label: "string" },
];

const department = [
  { value: "IT", label: "IT" },
  { value: "Account", label: "Account" },
  { value: "RMS", label: "RMS" },
  { value: "ALL", label: "ALL" },
];

const TypeOfDocument = [
  { value: "Circular", label: "Circular" },
  { value: "SEBI", label: "SEBI" },
  { value: "string", label: "string" },
];

const ModalComponent = ({
  tog_grid,
  modal_grid,
  onSubmit,
  editData,
  editUserCheck,
}: {
  modal_grid: boolean;
  tog_grid: () => void;
  onSubmit: (data: any, apiStatus?: any) => void;
  editData: any;
  editUserCheck: boolean;
}) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileExtension, setFileExtension] = useState("");
  // const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const allowedFormats = ["doc", "docx", "pdf", "xls", "xlsx", "jpg", "jpeg"];

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    console.log("editInfoData", editData, fileExtension);
  }, [editData]);

  useEffect(() => {
    if (editData) {
      formik.setValues({
        documentType: TypeOfDocument.some(
          (item) => item.value === editData.typeOfDocuments
        )
          ? editData.typeOfDocuments
          : "",

        department: department.some(
          (item) => item.value === editData.department
        )
          ? editData.department
          : "",

        communicationType: CommunicationMenu.some(
          (item) => item.value === editData.communicationType
        )
          ? editData.communicationType
          : "",

        proofOfCommunication: editData.proofOfCommunication || "",

        dateOfCommunication: editData.dateOfCommunication
          ? dayjs(editData.dateOfCommunication).format("DD/MM/YYYY")
          : "",
      });
    }
  }, [editData]);

  const validationSchema = Yup.object().shape({
    documentType: Yup.string().required("Type of Document is required"),
    department: Yup.string().required("Department is required"),
    communicationType: Yup.string().required("Communication Type is required"),
    dateOfCommunication: Yup.string().required(
      "Date of Communication is required"
    ),
    proofOfCommunication: Yup.string().required(
      "Proof of Communication is required"
    ),
  });

  const formik = useFormik({
    initialValues: {
      documentType: "", //ADDED
      department: "", //ADDED
      communicationType: "", //ADDED
      dateOfCommunication: null as string | null, //ADDED
      proofOfCommunication: "",
    },
    validationSchema,
    onSubmit: (values) => {
      const formData = {
        ...values,
        uploadedFile,
      };
      onSubmit(formData, true); // Pass form data to the parent component
      fetchSubmitForm();
      formik.resetForm();
      setUploadedFile(null); // Reset uploaded file
      setFileExtension(""); // Reset file extension
    },
  });

  const fetchSubmitForm = async () => {
    let payload = {
      financialYear: "2024-2025",
      department: formik.values.department ? formik.values.department : "",
      action: editUserCheck ? "update" : "insert",
      documentType: formik.values.documentType
        ? formik.values.documentType
        : "",
      typeOfDocuments: "ALL",
      communicationType: formik.values.communicationType
        ? formik.values.communicationType
        : "",
      communicationProof: formik.values.proofOfCommunication
        ? formik.values.proofOfCommunication
        : "",
      communicationProofPath: "string",
      dateOfCommunication: formik.values.dateOfCommunication
        ? formik.values.dateOfCommunication
        : "",
      rowId: 0,
      userId: "",
    };
    dispatch(showLoader("Please wait"));
    apiServices
      .ComplainceReport(payload)
      .then((response) => {
        dispatch(hideLoader());
        console.log("apiResponseModal", response?.data?.Table[0].MSG);
        // setUserData(response?.data?.Table);
        if (editUserCheck) {
          ShowToast("success", response?.data?.Table[0].Message);
        } else {
          ShowToast("success", response?.data?.Table[0].MSG);
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

  useEffect(() => {
    if (editData) {
      formik.setValues({
        documentType: editData.TypeOfDocuments || "",
        department: editData.Department || "",
        communicationType: editData.CommunicationType || "",
        proofOfCommunication: editData.CommunicationProof || "",
        dateOfCommunication: editData.DateOfCommunication
          ? dayjs(editData.DateOfCommunication).format("DD/MM/YYYY") // Convert to string
          : "",
      });
    }
  }, [editData]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const fileExt = file.name.split(".").pop()?.toLowerCase() || "";

      if (allowedFormats.includes(fileExt)) {
        dispatch(showLoader("Uploading file...")); // Show loader before processing

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const base64String = reader.result as string;
          setUploadedFile(file);
          setFileBase64(base64String); // Store base64
          setFileExtension(fileExt);
          dispatch(hideLoader());
        };
        reader.onerror = (error) => {
          console.error("Error reading file:", error);
          dispatch(hideLoader());
        };
      } else {
        alert("Invalid file format! Allowed: DOC, PDF, XLS, XLSX, JPG, JPEG");
      }
    }
  };

  useEffect(() => {
    console.log("base64FILE-->", fileBase64);
  }, [fileBase64]);

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

  const handleChange = (event: any) => {
    console.log("eventValue", event.target.value);
    const { value } = event.target;
    formik.setFieldValue("proofOfCommunication", value);
  };

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
        <form onSubmit={formik.handleSubmit}>
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
                    {formik.touched.dateOfCommunication &&
                      formik.errors.dateOfCommunication && (
                        <p className="text-error">
                          {formik.errors.dateOfCommunication}
                        </p>
                      )}
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
                {formik.touched.documentType && formik.errors.documentType && (
                  <p className="text-error">{formik.errors.documentType}</p>
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
                  value={formik.values.proofOfCommunication}
                  type="text"
                  onChange={handleChange}
                  className={`form-control ${
                    formik.touched.proofOfCommunication &&
                    formik.errors.proofOfCommunication
                      ? "is-invalid"
                      : ""
                  }`}
                  id="lastName"
                  placeholder="Enter Proof of Communication"
                />
                {formik.touched.proofOfCommunication &&
                  formik.errors.proofOfCommunication && (
                    <div className="invalid-feedback">
                      {formik.errors.proofOfCommunication}
                    </div>
                  )}
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
                  type="submit"
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
