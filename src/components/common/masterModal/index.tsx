import { Button, Col, Input, Modal, ModalBody, ModalHeader } from "reactstrap";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
// import "./style.css";
import { useFormik } from "formik";
import { useState, useRef, useEffect } from "react";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import * as Yup from "yup";
import { apiServices } from "../../../services";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { TypeOfDepartment } from "../../../helper/tableColumns.tsx";
interface EditData {
  CommunicationProofPath?: string;
}

const ModalComponent = ({
  tog_grid,
  modal_grid,
  onSubmit,
  editData,
  editUserCheck,
  isRegulatoryContent,
}: {
  modal_grid: boolean;
  tog_grid: () => void;
  onSubmit?: (data: any, apiStatus?: any, fileBase64?: any) => void;
  editData?: any;
  editUserCheck: boolean;
  isRegulatoryContent?: any;
}) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileExtension, setFileExtension] = useState("");
  // const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const allowedFormats = ["doc", "docx", "pdf", "xls", "xlsx", "jpg", "jpeg"];

  // const { user_id } = useSelector(
  //   (state: RootState) => state.UserLogin?.data?.data
  // );

  const dispatch = useDispatch<AppDispatch>();

  const getValidationSchema = (editData: EditData) =>
    Yup.object().shape({
      dateOfCommunication: Yup.string().required(
        "Date of Communication is required"
      ),
      TypeOfDepartment: Yup.string().required("Department is requireddd"),
      SubjectType: Yup.string().required("SubjectType is required"),
      LkpComments: Yup.string().required("LKP Comment is required"),
      uploadProof: Yup.mixed().when([], {
        is: () => !editData?.CommunicationProofPath, // Check if empty
        then: (schema) => schema.required("Please Upload Proof"),
        otherwise: (schema) => schema.notRequired(),
      }),
    });

  const formik = useFormik({
    initialValues: {
      dateOfCommunication: null as string | null,
      TypeOfDepartment: "",
      SubjectType: "",
      LkpComments: "",
      uploadProof: "",
    },
    validationSchema: getValidationSchema(editData),
    onSubmit: async (values, { setTouched }) => {
      setTouched({
        dateOfCommunication: true,
        TypeOfDepartment: true,
        SubjectType: true,
        uploadProof: true,
        LkpComments: true,
      });

      let currentTime = dayjs().format("DD/MM/YYYY_hh:mmA");
      let TypeOfDocuments = values.TypeOfDepartment
        ? values.TypeOfDepartment
        : "Unknown";
      let communicationProofPath = `${currentTime}_${TypeOfDocuments}`;

      const formData = {
        ...values,
        uploadedFile,
      };

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
      // Pass form data to the parent component
      onSubmit?.(formData, true, fileBase64);
      if (uploadedFile === null && editData) {
        communicationProofPath =
          editData.CommunicationProofPath || communicationProofPath;

        uploadedFileExt = editData?.DocumentType || fileExtension || "unknown";

        console.log(
          "EditData communicationProofPath",
          communicationProofPath,
          "File Extension:",
          uploadedFileExt
        );
      }
      //   fetchSubmitForm(uploadedFileExt, communicationProofPath);
      // Reset states
      //   setUploadedFile(null); // Reset uploaded file
      formik.resetForm(); // Reset Formik form
    },
  });

  useEffect(() => {
    console.log("editInfoData", editData, editUserCheck, fileExtension);
    // debugger;
    if (editData?.RowId > 0) {
      console.log("editInfoData not zero");
    }
    if (editData) {
      formik.setValues({
        dateOfCommunication: editData.Dates
          ? dayjs(editData.Dates).format("YYYY/MM/DD") // Convert to string
          : "",
        TypeOfDepartment: editData.Department || "",
        SubjectType: editData.Subject || "",
        LkpComments: editData.LKPComments || "",
        uploadProof: editData.CircularFilePath || "",
      });
    }
  }, [editData, editUserCheck]);

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
                // ShowToast("success", "File Successfully Uploaded");
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
  //   formik.setFieldValue("SubjectType", value);
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
      {isRegulatoryContent && (
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
                  </FormControl>
                </div>
              </Col>
              <Col lg={12}>
                <FormControl
                  fullWidth
                  error={
                    formik.touched.TypeOfDepartment &&
                    Boolean(formik.errors.TypeOfDepartment)
                  }
                >
                  <InputLabel id="DocumentType-modal-select-label">
                    Select Department
                  </InputLabel>
                  <Select
                    size="small"
                    labelId="DocumentType-modal-select-label"
                    id="DocumentType-select"
                    name="TypeOfDepartment"
                    value={formik.values.TypeOfDepartment}
                    label="Select Department"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    sx={{ width: "100%", minHeight: "40px" }}
                  >
                    {TypeOfDepartment.map((docType) => (
                      <MenuItem key={docType.value} value={docType.value}>
                        {docType.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.TypeOfDepartment &&
                    formik.errors.TypeOfDepartment && (
                      <p className="text-error">
                        {formik.errors.TypeOfDepartment}
                      </p>
                    )}
                </FormControl>
              </Col>
              <Col lg={12}>
                <TextField
                  fullWidth
                  id="SubjectType"
                  name="SubjectType"
                  label="Enter Subject"
                  variant="outlined"
                  size="small"
                  value={formik.values.SubjectType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.SubjectType &&
                    Boolean(formik.errors.SubjectType)
                  }
                  helperText={
                    formik.touched.SubjectType && formik.errors.SubjectType
                  }
                  // InputProps={{ sx: { fontSize: "14px" } }} // Adjust font size if needed
                />
              </Col>
              <Col lg={12}>
                <TextField
                  fullWidth
                  id="LkpComments"
                  name="LkpComments"
                  label="Enter LKP Comment"
                  variant="outlined"
                  size="small"
                  value={formik.values.LkpComments}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.LkpComments &&
                    Boolean(formik.errors.LkpComments)
                  }
                  helperText={
                    formik.touched.LkpComments && formik.errors.LkpComments
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
      )}
    </Modal>
  );
};

export default ModalComponent;
