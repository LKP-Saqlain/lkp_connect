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

const DocumentType = [
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
    console.log("editInfoData", editData?.RowId, editUserCheck, fileExtension);
    // debugger;
    if (editData?.RowId > 0) {
      console.log("editInfoData not zero");
    }
  }, [editData, editUserCheck]);

  useEffect(() => {
    if (editData) {
      formik.setValues({
        DocumentType: DocumentType.some(
          (item) => item.value === editData.DocumentType
        )
          ? editData.DocumentType
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
        uploadProof: "",
      });
    }
  }, [editData]);

  const validationSchema = Yup.object().shape({
    DocumentType: Yup.string().required("Type of Document is required"),
    department: Yup.string().required("Department is required"),
    communicationType: Yup.string().required("Communication Type is required"),
    dateOfCommunication: Yup.string().required(
      "Date of Communication is required"
    ),
    proofOfCommunication: Yup.string().required(
      "Proof of Communication is required"
    ),
    // uploadProof: Yup.string().required("Please Upload Proof"),
  });

  const formik = useFormik({
    initialValues: {
      DocumentType: "", //ADDED
      department: "", //ADDED
      communicationType: "", //ADDED
      dateOfCommunication: null as string | null, //ADDED
      proofOfCommunication: "",
      uploadProof: "",
    },
    validationSchema,
    onSubmit: (values) => {
      if (uploadedFile) {
        handleFileUpload(uploadedFile); 
      }
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
    let currentTime = dayjs().format("DD/MM/YYYY_hh:mm A"); // Current date and time
    let documentType = formik.values.DocumentType
      ? formik.values.DocumentType
      : "Unknown"; // Use the document type from formik, default to "Unknown"

    let communicationProofPath = `${currentTime}_${documentType}`;

    let payload = {
      financialYear: "2024-2025",
      department: formik.values.department ? formik.values.department : "",
      action: editData?.RowId > 0 ? "update" : "insert",
      DocumentType: fileExtension,
      typeOfDocuments:  formik.values.DocumentType
      ? formik.values.DocumentType
      : "",
      communicationType: formik.values.communicationType
        ? formik.values.communicationType
        : "",
      communicationProof: formik.values.proofOfCommunication
        ? formik.values.proofOfCommunication
        : "",
      communicationProofPath: communicationProofPath,
      dateOfCommunication: formik.values.dateOfCommunication
        ? formik.values.dateOfCommunication
        : "",
      rowId: editData?.RowId ? editData?.RowId : 0,
      userId: "",
    };
    dispatch(showLoader("Please wait"));
    apiServices
      .ComplainceReport(payload)
      .then((response) => {
        dispatch(hideLoader());
        console.log("fileExtension",fileExtension);
        console.log("apiResponseModal", response?.data?.Table[0].MSG);
        let suceessCheck = response?.data?.Table.length;
        if (suceessCheck.length >= 0) {
        }
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
        DocumentType: editData.DocumentType || "",
        department: editData.Department || "",
        communicationType: editData.CommunicationType || "",
        proofOfCommunication: editData.CommunicationProof || "",
        dateOfCommunication: editData.DateOfCommunication
          ? dayjs(editData.DateOfCommunication).format("DD/MM/YYYY") // Convert to string
          : "",
        uploadProof: "",
      });
    }
  }, [editData]);

  const handleFileUpload = (file: any) => {
      const fileExt = file.name.split(".").pop()?.toLowerCase() || "";
      
      if (allowedFormats.includes(fileExt)) {
        // dispatch(showLoader("Uploading file...")); // Show loader before processing

        const { name } = file;
        const fileName = name.substring(0, name.lastIndexOf("."));
        console.log("FileNameOnly", fileName);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        // debugger;
        reader.onload = () => {
          const base64String = reader.result as string;
          const base64Only = base64String.split(",")[1] || base64String;
          setUploadedFile(file);
          setFileBase64(base64Only); // Store base64
          setFileExtension(fileExt);

          dispatch(showLoader("Uploading file..."));

          let payload = {
            fileName: fileName,
            filePath: "D:\\FileUpload\\Compliance",
            fileType: `.${fileExt}`,
            contentType: base64Only,
          };
          apiServices
            .ComplainceFileUpload(payload)
            .then((response) => {
              console.log("Response", response);
              dispatch(hideLoader());
              if (response?.status === 200) {
                ShowToast("success", response?.data);
                formik.setFieldError("uploadProof", "");
              }
            })
            .catch((error) => {
              console.log("ERROR-->", error);
              dispatch(hideLoader());
            })
            .finally(() => {
              dispatch(hideLoader());
            });
        };
        reader.onerror = (error) => {
          console.error("Error reading file:", error);
          dispatch(hideLoader());
        };
      } else {
        alert("Invalid file format! Allowed: DOC, PDF, XLS, XLSX, JPG, JPEG");
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
        formik.setFieldError("uploadProof", "");
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
                      maxDate={dayjs()}
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
                  formik.touched.DocumentType &&
                  Boolean(formik.errors.DocumentType)
                }
              >
                <InputLabel id="DocumentType-modal-select-label">
                  Type of Documents
                </InputLabel>
                <Select
                  size="small"
                  labelId="DocumentType-modal-select-label"
                  id="DocumentType-select"
                  name="DocumentType"
                  value={formik.values.DocumentType}
                  label="Types Of Documentss"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  {DocumentType.map((docType) => (
                    <MenuItem key={docType.value} value={docType.value}>
                      {docType.label}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.DocumentType && formik.errors.DocumentType && (
                  <p className="text-error">{formik.errors.DocumentType}</p>
                )}
              </FormControl>
            </Col>
            <Col xxl={6}>
              <FormControl
                fullWidth
                error={
                  formik.touched.communicationType &&
                  Boolean(formik.errors.communicationType)
                }
              >
                <InputLabel id="communicationType-modal-select-label">
                  Communication Types
                </InputLabel>
                <Select
                  size="small"
                  labelId="communicationType-modal-select-label"
                  id="communicationType-select"
                  name="communicationType"
                  value={formik.values.communicationType}
                  label=" Communicationss Typess"
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
                  Communication Description
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
                name="uploadProof"
                innerRef={fileInputRef}
                type="file"
                accept=".doc,.docx,.pdf,.xls,.xlsx,.jpg,.jpeg"
                className="form-control"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setUploadedFile(file); // Save file to uploadedFile state
                  }
                }}
              />
              {formik.touched.uploadProof && formik.errors.uploadProof && (
                <p className="text-error">{formik.errors.uploadProof}</p>
              )}
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
