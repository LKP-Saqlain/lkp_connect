import { Button, Col, Input, Modal, ModalBody, ModalHeader } from "reactstrap";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import "./style.css";
import { useFormik } from "formik";
import { useState, useRef, useEffect } from "react";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import * as Yup from "yup";
import { apiServices } from "../../../services";
import ShowToast from "../../../utils/toastUtils";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../redux/store";

interface EditData {
  CommunicationProofPath?: string;
}

const CommunicationMenu = [
  { value: "Email", label: "Email" },
  { value: "Physical", label: "Physical" },
];

const department = [
  { value: "IT", label: "IT" },
  { value: "Account", label: "Account" },
  { value: "RMS", label: "RMS" },
];

const TypeOfDocuments = [
  { value: "Circular", label: "Circular" },
  { value: "SEBI", label: "SEBI" },
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

  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    console.log("editInfoData", editData, editUserCheck, fileExtension);
    // debugger;
    if (editData?.RowId > 0) {
      console.log("editInfoData not zero");
    }
  }, [editData, editUserCheck]);

  const getValidationSchema = (editData: EditData) =>
    Yup.object().shape({
      TypeOfDocuments: Yup.string().required("Type of Document is required"),
      department: Yup.string().required("Department is required"),
      communicationType: Yup.string().required(
        "Communication Type is required"
      ),
      dateOfCommunication: Yup.string().required(
        "Date of Communication is required"
      ),
      proofOfCommunication: Yup.string().required(
        "Proof of Communication is required"
      ),
      uploadProof: Yup.mixed().when([], {
        is: () => !editData?.CommunicationProofPath, // Check if empty
        then: (schema) => schema.required("Please Upload Proof"),
        otherwise: (schema) => schema.notRequired(),
      }),
    });

  const formik = useFormik({
    initialValues: {
      DocumentType: "", //ADDED
      department: "", //ADDED
      communicationType: "", //ADDED
      dateOfCommunication: null as string | null, //ADDED
      proofOfCommunication: "",
      uploadProof: "",
      TypeOfDocuments: "",
    },
    validationSchema: getValidationSchema(editData),
    onSubmit: async (values) => {
      let currentTime = dayjs().format("DD/MM/YYYY_hh:mmA");
      let TypeOfDocuments = values.TypeOfDocuments
        ? values.TypeOfDocuments
        : "Unknown";
      let communicationProofPath = `${currentTime}_${TypeOfDocuments}`;

      const formData = {
        ...values,
        uploadedFile,
      };
      onSubmit(formData, true); // Pass form data to the parent component

      let uploadedFileExt: string = "";
      if (uploadedFile) {
        try {
          uploadedFileExt = await handleFileUploadAsync(
            uploadedFile,
            communicationProofPath
          ); // Wait for file upload
          setFileExtension(uploadedFileExt);
        } catch (error) {
          console.error("File upload failed", error);
          return; // Stop submission if file upload fails
        }
      }
      fetchSubmitForm(uploadedFileExt, communicationProofPath); // Call submit function after file upload completes
      setUploadedFile(null); // Reset uploaded file
      setFileExtension(""); // Reset file extension
      formik.resetForm();
    },
  });
  const fetchSubmitForm = async (
    uploadedFileExt: string,
    communicationProofPath: string
  ) => {
    console.log("uploadedFileExtension", uploadedFileExt);
    let payload = {
      financialYear: "2024-2025",
      department: formik.values.department ? formik.values.department : "",
      action: editData?.RowId > 0 ? "update" : "insert",
      typeOfDocuments: formik.values.TypeOfDocuments
        ? formik.values.TypeOfDocuments
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
      userId: user_id,
      DocumentType: uploadedFileExt,
    };
    dispatch(showLoader("Please wait"));
    apiServices
      .ComplainceReport(payload)
      .then((response) => {
        dispatch(hideLoader());
        console.log("fileExtension", fileExtension);
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
        TypeOfDocuments: editData.TypeOfDocuments || "",
      });
    }
  }, [editData]);

  const handleFileUploadAsync = (
    file: any,
    communicationProofPath: string
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const fileExt = file.name.split(".").pop()?.toLowerCase() || "";
      // debugger;
      if (allowedFormats.includes(fileExt)) {
        const { name } = file;
        const fileName = name.substring(0, name.lastIndexOf("."));
        console.log("fileName", fileName);

        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = () => {
          const base64String = reader.result as string;
          const base64Only = base64String.split(",")[1] || base64String;

          setUploadedFile(file);
          setFileBase64(base64Only); // Store base64
          setFileExtension(fileExt);

        dispatch(showLoader("Uploading file..."));

          let payload = {
            fileName: communicationProofPath,
            filePath: "D:\\FileUpload\\Compliance",
            // filePath: `D:\\FileUpload\\Compliance\\${communicationProofPath}
            fileType: `.${fileExt}`,
            contentType: base64Only,
          };

          apiServices
            .ComplainceFileUpload(payload)
            .then((response) => {
              dispatch(hideLoader());
              if (response?.status === 200) {
                ShowToast("success", response?.data);
                formik.setFieldError("uploadProof", "");
                resolve(fileExt); // Resolve the promise on success
              } else {
                reject(new Error("File upload failed"));
              }
            })
            .catch((error) => {
              dispatch(hideLoader());
              console.error("ERROR-->", error);
              reject(error); // Reject the promise on error
            });
        };

        reader.onerror = (error) => {
          console.error("Error reading file:", error);
          dispatch(hideLoader());
          reject(error); // Reject the promise on error
        };
      } else {
        alert("Invalid file format! Allowed: DOC, PDF, XLS, XLSX, JPG, JPEG");
        reject(new Error("Invalid file format"));
      }
    });
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
                      format="DD/MM/YYYY"
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
                </FormControl>
              </div>
            </Col>
            <Col xxl={6}>
              <FormControl
                fullWidth
                error={
                  formik.touched.TypeOfDocuments &&
                  Boolean(formik.errors.TypeOfDocuments)
                }
              >
                <InputLabel id="DocumentType-modal-select-label">
                  Type of Documents
                </InputLabel>
                <Select
                  size="small"
                  labelId="DocumentType-modal-select-label"
                  id="DocumentType-select"
                  name="TypeOfDocuments"
                  value={formik.values.TypeOfDocuments}
                  label="Types Of Documentss"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  {TypeOfDocuments.map((docType) => (
                    <MenuItem key={docType.value} value={docType.value}>
                      {docType.label}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.TypeOfDocuments &&
                  formik.errors.TypeOfDocuments && (
                    <p className="text-error">
                      {formik.errors.TypeOfDocuments}
                    </p>
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
                    formik.setFieldValue("uploadProof", file.name);
                    formik.setFieldError("uploadProof", "");
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
