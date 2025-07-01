import { Button, Col, Modal, ModalBody, ModalHeader } from "reactstrap";
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
import ShowToast from "../../../utils/toastUtils";
import FileUploadField from "../fileUploadField/index.tsx";

interface IsMarketingMaterialEditData {
  CommunicationProofPath?: string;
  fileUpload?: File;
  image?: File;
}

interface EditData {
  CommunicationProofPath?: string;
}

const ModalComponent = ({
  tog_grid,
  modal_grid,
  onSubmit,
  editData,
  editUserCheck,
  isRegulatoryContent = false,
  isMarketingMaterial = false,
}: {
  modal_grid: boolean;
  tog_grid: () => void;
  onSubmit?: (data: any, apiStatus?: any, fileBase64?: any) => void;
  editData?: any;
  editUserCheck: boolean;
  isRegulatoryContent?: any;
  isMarketingMaterial?: boolean;
}) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFileM, setUploadedFileM] = useState<File | null>(null);
  const [uploadedImageM, setUploadedImageM] = useState<File | null>(null);
  const [fileExtension, setFileExtension] = useState("");
  // const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRefImage = useRef<HTMLInputElement>(null);
  const fileInputRefDocument = useRef<HTMLInputElement>(null);

  const allowedFormats = ["doc", "docx", "pdf", "xls", "xlsx", "jpg", "jpeg"];

  // const { user_id } = useSelector(
  //   (state: RootState) => state.UserLogin?.data?.data
  // );

  const dispatch = useDispatch<AppDispatch>();

  const getMarketingMaterialValidationSchema = (
    editData?: IsMarketingMaterialEditData
  ) =>
    Yup.object().shape({
      description: Yup.string().required("Please provide a description."),
      fileUpload: editData?.fileUpload
        ? Yup.mixed().notRequired()
        : Yup.mixed().required("Please upload a marketing file."),
      image: editData?.image
        ? Yup.mixed().notRequired()
        : Yup.mixed().required("Please upload an image."),
    });

  const getRegulatoryValidationSchema = (editData: EditData) =>
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

  const getValidationSchema = (editData?: EditData) => {
    if (isRegulatoryContent) {
      return getRegulatoryValidationSchema(editData!);
    } else if (isMarketingMaterial) {
      return getMarketingMaterialValidationSchema(editData);
    } else {
      return Yup.object(); // fallback schema (or handle general case)
    }
  };

  const initialValues = isRegulatoryContent
    ? {
        dateOfCommunication: null as string | null,
        TypeOfDepartment: "",
        SubjectType: "",
        LkpComments: "",
        uploadProof: "",
      }
    : {
        fileUpload: "",
        description: "",
        image: "",
      };

  const formik = useFormik({
    initialValues,
    validationSchema: getValidationSchema(editData),
    onSubmit: async (values, { setTouched }) => {
      try {
        if (isRegulatoryContent) {
          const regulatoryPayload = {
            dateOfCommunication: values.dateOfCommunication,
            TypeOfDepartment: values.TypeOfDepartment,
            SubjectType: values.SubjectType,
            LkpComments: values.LkpComments,
            uploadProof: values.uploadProof,
          };
          console.log(regulatoryPayload);
        } else if (isMarketingMaterial) {
          const marketingPayload = {
            fileUpload: values.fileUpload,
            description: values.description,
            image: values.image,
          };
          fetchMarketingMaterialVals(marketingPayload);
          return;
        }
      } catch (error) {
        console.error("Submission Error", error);
      }

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

  const fetchMarketingMaterialVals = async (values: any) => {
    console.log("marketingMaterialData", values);

    const isEdit = !!editData;

    if (!isEdit && (!uploadedFileM || !uploadedImageM)) {
      ShowToast("error", "Please upload both document and image files.");
      return;
    }
    const readFileAsBase64 = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const base64 = (reader.result as string).split(",")[1];
          resolve(base64);
        };
        reader.onerror = reject;
      });
    };
    try {
      let docBase64 = "";
      let imgBase64 = "";

      if (uploadedFileM) {
        docBase64 = await readFileAsBase64(uploadedFileM);
      }

      if (uploadedImageM) {
        imgBase64 = await readFileAsBase64(uploadedImageM);
      }
      const formData = {
        ...values, // includes description, etc.
        documentBase64: docBase64,
        imageBase64: imgBase64,
      };

      onSubmit?.(formData);

      // Reset form after submit
      formik.resetForm();
      setUploadedFileM(null);
      setUploadedImageM(null);
      formik.setFieldValue("fileUpload", "");
      if (fileInputRefDocument.current) fileInputRefDocument.current.value = "";
      setUploadedImageM(null);
      formik.setFieldValue("image", "");
      if (fileInputRefImage.current) fileInputRefImage.current.value = "";
    } catch (error) {
      console.error("Error submitting materials:", error);
      ShowToast("error", "There was an error submitting the materials.");
    }
  };

  useEffect(() => {
    console.log("editInfoData", editData, editUserCheck, fileExtension);
    // debugger;
    if (editData?.RowId > 0) {
      console.log("editInfoData not zero");
    }
    if (editData) {
      if (isRegulatoryContent) {
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
      if (isMarketingMaterial) {
        formik.setValues({
          fileUpload: editData.UploadDocuments || "",
          description: editData.Description || "",
          image: editData.UploadImages || "",
        });
      }
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

  const handleFileDelete =
    (field: "fileUpload" | "image" | "uploadProof") => () => {
      console.log("Test1123", field);
      // return (event: React.MouseEvent<HTMLButtonElement>) => {
      // const { name, value } = event.target;
      dispatch(showLoader("Please wait, we are processing your request..."));
      setTimeout(() => {
        if (isRegulatoryContent) {
          setUploadedFile(null);
          setFileExtension("");
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
            formik.setFieldError(
              "uploadProof",
              "Please upload a proof document"
            );
          }
          dispatch(hideLoader());
        }

        if (isMarketingMaterial) {
          if (field === "fileUpload") {
            setUploadedFileM(null);
            formik.setFieldValue("fileUpload", "");
            if (fileInputRefDocument.current)
              fileInputRefDocument.current.value = "";
          }
          if (field === "image") {
            setUploadedImageM(null);
            formik.setFieldValue("image", "");
            if (fileInputRefImage.current) fileInputRefImage.current.value = "";
          }

          dispatch(hideLoader());
        }
      }, 500);
      // };
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

      <ModalBody
        style={{ maxHeight: "70vh", overflowY: "auto", padding: "10px 15px" }}
      >
        <form onSubmit={formik.handleSubmit}>
          <div className="row g-2">
            {isRegulatoryContent && (
              <>
                <Col lg={12}>
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
                </Col>

                <Col lg={12}>
                  <FormControl
                    fullWidth
                    error={
                      formik.touched.TypeOfDepartment &&
                      Boolean(formik.errors.TypeOfDepartment)
                    }
                  >
                    <InputLabel id="Department-select-label">
                      Select Department
                    </InputLabel>
                    <Select
                      size="small"
                      labelId="Department-select-label"
                      id="TypeOfDepartment"
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
                  />
                </Col>

                <FileUploadField
                  label="Upload Proof of Communication"
                  fieldName="uploadProof"
                  fileRef={fileInputRef}
                  file={uploadedFile}
                  onDelete={handleFileDelete("uploadProof")}
                  error={formik.errors.uploadProof}
                  touched={formik.touched.uploadProof}
                  onChange={(file) => {
                    setUploadedFile(file);
                    formik.setFieldValue("uploadProof", file.name);
                    formik.setFieldError("uploadProof", "");
                  }}
                />
              </>
            )}

            {isMarketingMaterial && (
              <>
                <FileUploadField
                  label="Upload Images"
                  fieldName="image"
                  fileRef={fileInputRefImage}
                  file={uploadedImageM}
                  onDelete={handleFileDelete("image")}
                  error={formik.errors.image}
                  touched={formik.touched.image}
                  onChange={(file) => {
                    setUploadedImageM(file);
                    formik.setFieldValue("image", file.name);
                    formik.setFieldError("image", "");
                  }}
                  accept=".png,.jpg,.jpeg"
                />

                <Col lg={12}>
                  <label style={{ fontSize: "12px" }} className="form-label">
                    Description
                  </label>
                  <TextField
                    fullWidth
                    id="description"
                    name="description"
                    label="Description"
                    variant="outlined"
                    size="small"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.description &&
                      Boolean(formik.errors.description)
                    }
                    helperText={
                      formik.touched.description && formik.errors.description
                    }
                  />
                </Col>

                <FileUploadField
                  label="Upload Documents"
                  fieldName="fileUpload"
                  fileRef={fileInputRefDocument}
                  file={uploadedFileM}
                  onDelete={handleFileDelete("fileUpload")}
                  error={formik.errors.fileUpload}
                  touched={formik.touched.fileUpload}
                  onChange={(file) => {
                    setUploadedFileM(file);
                    formik.setFieldValue("fileUpload", file.name);
                    formik.setFieldError("fileUpload", "");
                  }}
                  accept=".pdf,.ppt,.pptx"
                />
              </>
            )}

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
