import { Button, Col, Input, Modal, ModalBody, ModalHeader } from "reactstrap";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
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
import {
  CommunicationMenu,
  department,
  TypeOfDocuments,
} from "../../../helper/tableColumns.tsx";
interface EditData {
  cpp?: string;
}

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
    (state: RootState) => state.UserLogin?.data?.data,
  );

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    console.log("editInfoData", editData, editUserCheck, fileExtension);
    // debugger;
    if (editData?.rid > 0) {
      console.log("editInfoData not zero");
    }
  }, [editData, editUserCheck]);

  const getValidationSchema = (editData: EditData) =>
    Yup.object().shape({
      TypeOfDocuments: Yup.string().required("Type of Document is required"),
      department: Yup.string().required("Department is required"),
      communicationType: Yup.string().required(
        "Communication Type is required",
      ),
      dateOfCommunication: Yup.string().required(
        "Date of Communication is required",
      ),
      proofOfCommunication: Yup.string().required(
        "Proof of Communication is required",
      ),
      uploadProof: Yup.mixed().when([], {
        is: () => !editData?.cpp, // Check if empty
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
      // debugger;
      // if (formik.errors.uploadProof !== "") {
      //   ShowToast("error", "Please upload a proof document");
      //   return; // Stop submission if there's an error in uploadProof
      // }

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
            communicationProofPath,
          ); // Wait for file upload
          setFileExtension(uploadedFileExt);
        } catch (error) {
          console.error("File upload failed", error);
          return; // Stop submission if file upload fails
        }
      }
      if (uploadedFile === null && editData) {
        communicationProofPath = editData.cpp || communicationProofPath;

        uploadedFileExt = editData?.dtype || fileExtension || "unknown";

        console.log(
          "EditData communicationProofPath",
          communicationProofPath,
          "File Extension:",
          uploadedFileExt,
        );
      }
      fetchSubmitForm(uploadedFileExt, communicationProofPath);
      // Reset states
      setUploadedFile(null); // Reset uploaded file
      formik.resetForm(); // Reset Formik form
    },
  });

  const formatDateForEdit = (date: any) => {
    if (!date) return "";
    return date.replace(/\//g, "-"); // "2025/12/23" → "2025-12-23"
  };

  const fetchSubmitForm = async (
    uploadedFileExt: string,
    communicationProofPath: string,
  ) => {
    console.log("uploadedFileExtension", uploadedFileExt);

    const payload = {
      financialYear: "2024-2025",
      department: formik.values.department || "",
      typeOfDocuments: formik.values.TypeOfDocuments || "",
      communicationType: formik.values.communicationType || "",
      communicationProof: formik.values.proofOfCommunication || "",
      communicationProofPath,
      dateOfCommunication: editUserCheck
        ? formatDateForEdit(formik.values.dateOfCommunication)
        : formik.values.dateOfCommunication || "",
      rowId: editUserCheck ? editData?.rid || 0 : 0, //  rowId only meaningful for update
      userId: user_id,
      DocumentType: uploadedFileExt,
    };

    dispatch(showLoader("Please wait, we are processing your request..."));

    const apiCall = editUserCheck
      ? apiServices.UpdateComplianceData(payload)
      : apiServices.InsertComplianceData(payload);

    apiCall
      .then((response) => {
        console.log("apiResponseModal", response?.data);
        dispatch(hideLoader());
      })
      .catch((error) => {
        console.error("Error", error);
        dispatch(hideLoader());
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  useEffect(() => {
    if (editData) {
      formik.setValues({
        DocumentType: editData.dtype || "",
        department: editData.dept || "",
        communicationType: editData.ctype || "",
        proofOfCommunication: editData.cdesc || "",
        dateOfCommunication: editData.doc
          ? dayjs(editData.doc).format("YYYY/MM/DD") // Convert to string
          : "",
        uploadProof: "",
        TypeOfDocuments: editData.tod || "",
      });
    }
  }, [editData]);

  useEffect(() => {
    console.log("errorFormik", formik.errors);
  }, [formik.errors]);

  const handleFileUploadAsync = (
    file: any,
    communicationProofPath: string,
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
                ShowToast("success", "File Successfully Uploaded");
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
    dispatch(showLoader("Please wait, we are processing your request...")); // Show loader before deleting

    setTimeout(() => {
      setUploadedFile(null);
      setFileExtension("");
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset the file input value
        // formik.setFieldError("uploadProof", "");
        formik.setFieldError("uploadProof", "Please upload a proof document");
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
  const toggle = () => {
    handleCancel();
    tog_grid();
  };

  useEffect(() => {
    console.log("formValues", formik.values);
  }, [formik.values]);

  // const handleChange = (event: any) => {
  //   console.log("eventValue", event.target.value);
  //   const { value } = event.target;
  //   formik.setFieldValue("proofOfCommunication", value);
  // };

  return (
    <Modal
      style={{ fontFamily: "Public Sans", maxWidth: "500px", width: "100%" }}
      isOpen={modal_grid}
      toggle={toggle}
      centered
    >
      <ModalHeader
        className="modal-title"
        toggle={toggle}
        style={{ padding: "10px 15px" }}
      >
        {editUserCheck ? "Edit Entry" : "Add Entry"}
      </ModalHeader>
      <ModalBody
        style={{ maxHeight: "70vh", overflowY: "auto", padding: "10px 15px" }}
      >
        <form onSubmit={formik.handleSubmit}>
          <div className="row g-2">
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
                              "YYYY-MM-DD",
                            )
                          : null
                      }
                      maxDate={dayjs()}
                      minDate={dayjs().subtract(64, "year")}
                      onChange={(date: Dayjs | null) =>
                        formik.setFieldValue(
                          "dateOfCommunication",
                          date ? date.format("YYYY-MM-DD") : "",
                        )
                      }
                      slotProps={{
                        textField: {
                          error: Boolean(
                            formik.touched.dateOfCommunication &&
                            formik.errors.dateOfCommunication,
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
            <Col lg={12}>
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
                  label="Type Of Documen"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  sx={{ width: "100%", minHeight: "40px" }}
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
            <Col lg={12}>
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
                  label=" Communication Type"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  sx={{ width: "100%", minHeight: "40px" }}
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
            {/* <Col lg={12}>
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
            </Col> */}
            <Col lg={12}>
              <TextField
                fullWidth
                id="proofOfCommunication"
                name="proofOfCommunication"
                label="Communication Description"
                variant="outlined"
                size="small"
                value={formik.values.proofOfCommunication}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.proofOfCommunication &&
                  Boolean(formik.errors.proofOfCommunication)
                }
                helperText={
                  formik.touched.proofOfCommunication &&
                  formik.errors.proofOfCommunication
                }
                // InputProps={{ sx: { fontSize: "14px" } }} // Adjust font size if needed
              />
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
                style={{ width: "100%", minHeight: "40px" }}
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
                  // sx={{
                  //   fontFamily: "Public Sans",
                  //   width: "100%",
                  //   minHeight: "40px",
                  // }}
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
                    fontSize: "11px",
                    minHeight: "35px",
                    width: "80px",
                  }}
                  type="submit"
                >
                  Submit
                </Button>
                <Button
                  style={{
                    backgroundColor: "#11395C",
                    fontSize: "11px",
                    minHeight: "35px",
                    width: "80px",
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
