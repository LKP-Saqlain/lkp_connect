import { Button, Col, Modal, ModalBody, ModalHeader } from "reactstrap";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
// import { InputAdornment } from "@mui/material";
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
import { regEx } from "../../../helper/method.ts";

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
  isUnlistedContent = false,
}: {
  modal_grid: boolean;
  tog_grid: () => void;
  onSubmit?: (data: any, apiStatus?: any, fileBase64?: any) => void;
  editData?: any;
  editUserCheck: boolean;
  isRegulatoryContent?: any;
  isMarketingMaterial?: boolean;
  isUnlistedContent?: boolean;
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

  // const getUnlistedSchema = (editData: any) =>
  //   Yup.object().shape({
  //     transactionDate: Yup.string().required("Transaction Date is required"),
  //     clientName: Yup.string().required("Client name required"),
  //     securitiesName: Yup.string().required("securitiesName is required"),
  //     noOfShare: Yup.number()
  //       .typeError("Number of share must be a number")
  //       .required("Number of share is required"),
  //     brokPerShare: Yup.number()
  //       .typeError("Brokerage of share must be a number")
  //       .required("Brokerage per share is required"),
  //     sbCode: Yup.string().required("Sub-broker Code is required"),
  //     sbRate: Yup.string().required("Sub-broker Rate is required"),
  //   });

  const getRegulatoryValidationSchema = (editData: EditData) =>
    Yup.object().shape({
      dateOfCommunication: Yup.string().required(
        "Date of Communication is required"
      ),
      TypeOfDepartment: Yup.string().required("Department is required"),
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
    }
    // else if (isUnlistedContent) {
    //   // return getUnlistedSchema(editData);
    // }
    else {
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
    : isMarketingMaterial
    ? {
        fileUpload: "",
        description: "",
        image: "",
      }
    : {
        transactionDate: null as string | null,
        clientName: "",
        securitiesName: "",
        noOfShare: null,
        brokPerShare: null,
        brokIncGST: null,
        gst: null,
        brokExcGST: null,
        sbCode: null,
        sbRate: null,
        sbCommision: null,
        netBrokerage: null,
        rmCode: null,
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
          fetchIsRegulatoryContent(setTouched, values);
          return;
        } else if (isMarketingMaterial) {
          const marketingPayload = {
            fileUpload: values.fileUpload,
            description: values.description,
            image: values.image,
          };
          fetchMarketingMaterialVals(marketingPayload);
          return;
        } else if (isUnlistedContent) {
          const unlistedPayload = {
            transactionDate: values.transactionDate,
            clientName: values.clientName,
            securitiesName: values.securitiesName,
          };
          console.log(unlistedPayload);

          fetchUnlistedContent(setTouched, values);
        }
      } catch (error) {
        console.error("Submission Error", error);
      }
    },
  });

  const fetchUnlistedContent = async (setTouched: any, values: any) => {
    console.log("unlistedValuess", values);

    setTouched({
      transactionDate: true,
      clientName: true,
      securitiesName: true,
      noOfShare: true,
      brokPerShare: true,
      sbCode: true,
      sbRate: true,
    });
    onSubmit?.(values);
    formik.resetForm();
  };
  const fetchIsRegulatoryContent = async (setTouched: any, values: any) => {
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
  };

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
      if (isUnlistedContent) {
        formik.setFieldValue(
          "transactionDate",
          editData?.transactionDate || null
        );
        formik.setFieldValue("clientName", editData?.clientName || null);
        formik.setFieldValue(
          "securitiesName",
          editData?.nameOfSecurities || null
        );
        formik.setFieldValue("noOfShare", editData?.noOfShares || null);
        formik.setFieldValue(
          "brokPerShare",
          editData?.brokeragePerShare || null
        );
        formik.setFieldValue(
          "brokIncGST",
          editData?.brokerageInclusiveGST || null
        );
        formik.setFieldValue("gst", editData?.gst || null);
        formik.setFieldValue(
          "brokExcGST",
          editData?.brokerageExclusiveGST || null
        );
        formik.setFieldValue("sbRate", editData?.sbRate || null);
        formik.setFieldValue("sbCode", editData?.sbCode || null);
        formik.setFieldValue("netBrokerage", editData?.netBrokerage || null);
        formik.setFieldValue("rmCode", editData?.rmCode || null);
        formik.setFieldValue("sbCommision", editData?.sbCommission || null);
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
    console.log("ModalformValues", formik.values);
  }, [formik.values]);

  // const handleChange = (event: any) => {
  //   console.log("eventValue", event.target.value);
  //   const { value } = event.target;
  //   formik.setFieldValue("SubjectType", value);
  // };

  const formatIndianNumber = (number: number) => {
    return new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(number);
  };

  const handleCustomChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    const numericValue = value.replace(/\D/g, ""); // Only digits

    const setSanitizedAlphaNumeric = () => {
      if (regEx.alphaNumeric.test(value)) {
        formik.setFieldValue(name, value.toUpperCase().replace(/\s/g, ""));
      }
    };

    const resetBrokerageFields = () => {
      formik.setFieldValue("brokIncGST", "");
      formik.setFieldValue("gst", "");
      formik.setFieldValue("brokExcGST", "");
      formik.setFieldValue("sbCommision", "");
      formik.setFieldValue("netBrokerage", "");
    };

    if (name === "noOfShare" || name === "brokPerShare") {
      formik.setFieldValue(name, numericValue);
      formik.setFieldError(name, "");

      const noOfShare =
        name === "noOfShare"
          ? parseInt(numericValue || "0")
          : parseInt(formik.values.noOfShare || "0");

      const brokPerShare =
        name === "brokPerShare"
          ? parseInt(numericValue || "0")
          : parseInt(formik.values.brokPerShare || "0");

      if (noOfShare > 0 && brokPerShare > 0) {
        const inCGST = noOfShare * brokPerShare;
        const gst = inCGST * 0.18;
        const exclGST = inCGST - gst;

        formik.setFieldValue("brokIncGST", formatIndianNumber(inCGST));
        formik.setFieldValue("gst", formatIndianNumber(gst));
        formik.setFieldValue("brokExcGST", formatIndianNumber(exclGST));
        if (formik.values.sbCode === null && formik.values.sbRate === null) {
          formik.setFieldValue("netBrokerage", formatIndianNumber(exclGST));
        }

        // Also try recalculating sbCommission and netBrokerage if sbRate is present
        const sbRate = parseFloat(formik.values.sbRate || "0");
        if (sbRate > 0) {
          const sbValue = sbRate * noOfShare;
          const stComm = sbValue * 0.18;
          const subBrokerCommission = sbValue - stComm;
          const brokExcGST = exclGST;

          const netBrokerage = brokExcGST - subBrokerCommission;

          formik.setFieldValue("sbCommision", subBrokerCommission);
          formik.setFieldValue("netBrokerage", netBrokerage);
        } else {
          formik.setFieldValue("sbCommision", "");
          if (!formik.values.sbCode && !formik.values.sbRate) {
            formik.setFieldValue("netBrokerage", formatIndianNumber(exclGST));
          }
          // formik.setFieldValue("netBrokerage", "");
        }
      } else {
        resetBrokerageFields();
      }
    } else if (name === "sbRate") {
      if (regEx.alphaNumeric.test(value)) {
        const sanitizedValue = value.toUpperCase().replace(/\s/g, "");
        formik.setFieldValue(name, sanitizedValue);

        const noOfShare = parseInt(formik.values.noOfShare || "0");
        const sbRate = parseFloat(value);

        if (noOfShare > 0 && !isNaN(sbRate)) {
          const sbValue = sbRate * noOfShare;
          const stComm = sbValue * 0.18;
          const subBrokerCommission = sbValue - stComm;

          const brokExcGST = parseFloat(
            (formik.values.brokExcGST ?? "0").toString().replace(/,/g, "")
          );

          const netBrokerage = brokExcGST - subBrokerCommission;

          formik.setFieldValue("sbCommision", subBrokerCommission);
          formik.setFieldValue("netBrokerage", netBrokerage);
        } else {
          formik.setFieldValue("sbCommision", "");
          formik.setFieldValue("netBrokerage", "");
        }
      }
    } else if (name === "sbCode" || name === "rmCode") {
      setSanitizedAlphaNumeric();
    } else {
      formik.handleChange(event);
    }
  };

  return (
    <Modal
      style={{
        fontFamily: "Public Sans",
        maxWidth: isUnlistedContent ? "700px" : "500px",
        width: "100%",
      }}
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
                                "YYYY-MM-DD"
                              )
                            : null
                        }
                        maxDate={dayjs()}
                        minDate={dayjs().subtract(64, "year")}
                        onChange={(date: Dayjs | null) =>
                          formik.setFieldValue(
                            "dateOfCommunication",
                            date ? date.format("YYYY-MM-DD") : ""
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
                <p
                  style={{
                    fontSize: "12px",
                    color: "#11395C",
                    marginTop: "2px ",
                  }}
                >
                  Please upload an image less than 512px width and 384px height
                  (or 4:3 aspect ratio).
                </p>

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
            {isUnlistedContent && (
              <>
                <Col lg={6}>
                  <TextField
                    fullWidth
                    id="rmCode"
                    name="rmCode"
                    label="Enter RM Code"
                    variant="outlined"
                    size="small"
                    value={formik.values.rmCode}
                    onChange={handleCustomChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.rmCode && Boolean(formik.errors.rmCode)
                    }
                    helperText={formik.touched.rmCode && formik.errors.rmCode}
                  />
                </Col>
                <Col lg={6}>
                  <FormControl fullWidth>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        format="DD/MM/YYYY"
                        value={
                          formik.values.transactionDate
                            ? dayjs(formik.values.transactionDate, "DD/MM/YYYY")
                            : null
                        }
                        maxDate={dayjs()}
                        minDate={dayjs().subtract(64, "year")}
                        onChange={(date: Dayjs | null) =>
                          formik.setFieldValue(
                            "transactionDate",
                            date ? date.format("DD-MM-YYYY") : ""
                          )
                        }
                        slotProps={{
                          textField: {
                            error: Boolean(
                              formik.touched.transactionDate &&
                                formik.errors.transactionDate
                            ),
                            helperText:
                              formik.touched.transactionDate &&
                              formik.errors.transactionDate,
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </FormControl>
                </Col>
                <Col lg={6}>
                  <TextField
                    fullWidth
                    id="clientName"
                    name="clientName"
                    label="Enter Client Name"
                    variant="outlined"
                    size="small"
                    value={formik.values.clientName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.clientName &&
                      Boolean(formik.errors.clientName)
                    }
                    helperText={
                      formik.touched.clientName && formik.errors.clientName
                    }
                  />
                </Col>
                <Col lg={6}>
                  <TextField
                    fullWidth
                    id="securitiesName"
                    name="securitiesName"
                    label="Enter Securities Name"
                    variant="outlined"
                    size="small"
                    value={formik.values.securitiesName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.securitiesName &&
                      Boolean(formik.errors.securitiesName)
                    }
                    helperText={
                      formik.touched.securitiesName &&
                      formik.errors.securitiesName
                    }
                  />
                </Col>
                <Col lg={6}>
                  <TextField
                    fullWidth
                    id="noOfShare"
                    name="noOfShare"
                    // type="number"
                    label="Enter Number of share"
                    variant="outlined"
                    size="small"
                    inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                    value={formik.values.noOfShare}
                    onChange={handleCustomChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.noOfShare &&
                      Boolean(formik.errors.noOfShare)
                    }
                    helperText={
                      formik.touched.noOfShare && formik.errors.noOfShare
                    }
                  />
                </Col>
                <Col lg={6}>
                  <TextField
                    fullWidth
                    id="brokPerShare"
                    name="brokPerShare"
                    // type="number"
                    label="Enter Brokerage per share"
                    variant="outlined"
                    size="small"
                    inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                    value={formik.values.brokPerShare}
                    onChange={handleCustomChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.brokPerShare &&
                      Boolean(formik.errors.brokPerShare)
                    }
                    helperText={
                      formik.touched.brokPerShare && formik.errors.brokPerShare
                    }
                  />
                </Col>
                <Col lg={6}>
                  <TextField
                    fullWidth
                    id="brokIncGST"
                    name="brokIncGST"
                    disabled={true}
                    // label="Brokerage Inclusive GST"
                    variant="outlined"
                    size="small"
                    inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                    value={`${
                      formik.values.brokIncGST || "0"
                    }  /- Brokerage Inclusive GST`}
                    InputProps={{
                      readOnly: true,
                    }}
                    onChange={handleCustomChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.brokIncGST &&
                      Boolean(formik.errors.brokIncGST)
                    }
                    helperText={
                      formik.touched.brokIncGST && formik.errors.brokIncGST
                    }
                  />
                </Col>
                <Col lg={6}>
                  <TextField
                    fullWidth
                    id="gst"
                    name="gst"
                    disabled={true}
                    // label="your GST"
                    variant="outlined"
                    size="small"
                    inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                    value={`${formik.values.gst || "0"}  /- Total GST`}
                    InputProps={{
                      readOnly: true,
                    }}
                    onChange={handleCustomChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.gst && Boolean(formik.errors.gst)}
                    helperText={formik.touched.gst && formik.errors.gst}
                  />
                </Col>
                <Col lg={6}>
                  <TextField
                    fullWidth
                    id="brokExcGST"
                    name="brokExcGST"
                    disabled={true}
                    // label="Brokerage Exclusive GST"
                    variant="outlined"
                    size="small"
                    inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                    value={`${
                      formik.values.brokExcGST || "0"
                    }  /- Brokerage Exclusive GST`}
                    InputProps={{
                      readOnly: true,
                    }}
                    onChange={handleCustomChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.brokExcGST &&
                      Boolean(formik.errors.brokExcGST)
                    }
                    helperText={
                      formik.touched.brokExcGST && formik.errors.brokExcGST
                    }
                  />
                </Col>
                <Col lg={6}>
                  <TextField
                    fullWidth
                    id="sbRate"
                    name="sbRate"
                    label="Enter Sub-broker Rate"
                    variant="outlined"
                    size="small"
                    value={formik.values.sbRate}
                    onChange={handleCustomChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.sbRate && Boolean(formik.errors.sbRate)
                    }
                    helperText={formik.touched.sbRate && formik.errors.sbRate}
                  />
                </Col>
                <Col lg={6}>
                  <TextField
                    fullWidth
                    id="sbCode"
                    name="sbCode"
                    label="Enter Sub-broker Code"
                    variant="outlined"
                    size="small"
                    value={formik.values.sbCode}
                    onChange={handleCustomChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.sbCode && Boolean(formik.errors.sbCode)
                    }
                    helperText={formik.touched.sbCode && formik.errors.sbCode}
                  />
                </Col>

                <Col lg={6}>
                  <TextField
                    fullWidth
                    id="sbCommision"
                    name="sbCommision"
                    // label="Sub-broker Commision"
                    variant="outlined"
                    size="small"
                    disabled={true}
                    inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                    value={`${
                      formik.values.sbCommision || "0"
                    }  /- Sub-Broker Commission`}
                    InputProps={{
                      readOnly: true,
                    }}
                    onChange={handleCustomChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.sbCommision &&
                      Boolean(formik.errors.sbCommision)
                    }
                    helperText={
                      formik.touched.sbCommision && formik.errors.sbCommision
                    }
                  />
                </Col>
                <Col lg={12}>
                  <TextField
                    fullWidth
                    id="netBrokerage"
                    name="netBrokerage"
                    // label="Net. Brokerage"
                    variant="outlined"
                    size="small"
                    disabled={true}
                    inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                    value={`${
                      formik.values.netBrokerage || "0"
                    }  /- Net.Brokerage`}
                    InputProps={{
                      readOnly: true,
                    }}
                    onChange={handleCustomChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.netBrokerage &&
                      Boolean(formik.errors.netBrokerage)
                    }
                    helperText={
                      formik.touched.netBrokerage && formik.errors.netBrokerage
                    }
                  />
                </Col>
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
