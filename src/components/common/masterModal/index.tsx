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
import {
  TypeOfDepartment,
  TypeOfExclusionClient,
} from "../../../helper/tableColumns.tsx";
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
  isClientExclusion = false,
  isThirdPartyMaster = false,
  ExcludeOptions,
}: {
  modal_grid: boolean;
  tog_grid: () => void;
  onSubmit?: (data: any, apiStatus?: any, fileBase64?: any) => void;
  editData?: any;
  editUserCheck?: boolean;
  isRegulatoryContent?: any;
  isMarketingMaterial?: boolean;
  isUnlistedContent?: boolean;
  isClientExclusion?: boolean;
  isThirdPartyMaster?: boolean;
  ExcludeOptions?: any;
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

  const getClientExclusionValidationSchema = () =>
    Yup.object().shape({
      excludeType: Yup.string().required("Branch/Client Type is required"),
      excludeCode: Yup.string().required("Branch/Client Code is required"),
      excludeFrom: Yup.string().required("Exclude From selection is required"),
      excludeRemark: Yup.string().required("Remark is required"),
    });

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const normalizeEmailInput = (value: string) => {
    if (!value) return "";

    return value
      .split(/[\s,|/\\;]+/) // split by space, comma, slash, pipe, semicolon
      .filter((email) => email.trim() !== "") // remove empty entries
      .map((email) => email.trim()) // trim each email
      .join(";"); // rejoin with single semicolons
  };

  const getThirdPartyValidationSchema = () =>
    Yup.object().shape({
      ledgerCode: Yup.string().required("Ledger Code is required"),
      companyName: Yup.string().required("Company Name is required"),
      emailId: Yup.string()
        .transform((value) => normalizeEmailInput(value))
        .test(
          "multiple-emails",
          "One or more email addresses are invalid",
          (value) => {
            if (!value) return false;

            const emails = value.split(";");
            return emails.every((email) => isValidEmail(email));
          }
        )
        .required("Email ID is required"),
      emailId1: Yup.string()
        .transform((value) => normalizeEmailInput(value))
        .test(
          "emailId1",
          "One or more secondary email addresses are invalid",
          (value) => {
            if (!value) return true; // Skip validation if empty
            const emails = value.split(";");
            return emails.every((email) => isValidEmail(email));
          }
        ),

      emailId2: Yup.string()
        .transform((value) => normalizeEmailInput(value))
        .test(
          "emailId2",
          "One or more alternate email addresses are invalid",
          (value) => {
            if (!value) return true; // Skip validation if empty
            const emails = value.split(";");
            return emails.every((email) => isValidEmail(email));
          }
        ),
      sacNumber: Yup.string().required("SAC Number is required"),
      state: Yup.string().required("State is required"),
      gstNumber: Yup.string().required("GST Number is required"),
      gstStateCode: Yup.string().required("GST State Code is required"),
      pan: Yup.string().required("PAN is required"),
      address1: Yup.string().required("Address is required"),
      mobileNo: Yup.string().required("Mobile Number is required"),
    });

  const getValidationSchema = (editData?: EditData) => {
    if (isRegulatoryContent) {
      return getRegulatoryValidationSchema(editData!);
    } else if (isMarketingMaterial) {
      return getMarketingMaterialValidationSchema(editData);
    } else if (isClientExclusion) {
      return getClientExclusionValidationSchema();
    } else if (isThirdPartyMaster) {
      return getThirdPartyValidationSchema();
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
    : isMarketingMaterial
    ? {
        fileUpload: "",
        description: "",
        image: "",
      }
    : isClientExclusion
    ? {
        excludeType: "",
        excludeCode: "",
        excludeFrom: "",
        excludeRemark: "",
      }
    : isThirdPartyMaster
    ? {
        ledgerCode: "",
        companyName: "",
        emailId: "",
        emailId1: "",
        emailId2: "",
        sacNumber: "",
        state: "",
        gstNumber: "",
        gstStateCode: "",
        pan: "",
        address1: "",
        address2: "",
        address3: "",
        mobileNo: "",
      }
    : {
        transactionDate: null as string | null,
        clientName: "",
        securitiesName: "",
        noOfShare: null,
        clientRate: null,
        vendorRate: null,
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
  const cleanEmails = (email: any) => normalizeEmailInput(email);
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
        } else if (isClientExclusion) {
          const exclusionClientPayload = {
            excludeType: values.excludeType,
            excludeCode: values.excludeCode,
            excludeFrom: values.excludeFrom,
            excludeRemark: values.excludeRemark,
          };
          console.log(exclusionClientPayload, "exclusionClientPayload");
          fetchSubmissionValues(exclusionClientPayload);
          return;
        } else if (isUnlistedContent) {
          const unlistedPayload = {
            transactionDate: values.transactionDate,
            clientName: values.clientName,
            securitiesName: values.securitiesName,
          };
          console.log(unlistedPayload);
          fetchUnlistedContent(setTouched, values);
          return;
        } else if (isThirdPartyMaster) {
          const thirdPartyPayload = {
            ledgerCode: values.ledgerCode,
            companyName: values.companyName,
            // emailId: values.emailId,
            // emailId1: values.emailId1,
            // emailId2: values.emailId2,
            emailId: cleanEmails(values.emailId),
            emailId1: cleanEmails(values.emailId1),
            emailId2: cleanEmails(values.emailId2),
            sacNumber: values.sacNumber,
            state: values.state,
            gstNumber: values.gstNumber,
            gstStateCode: values.gstStateCode,
            pan: values.pan,
            address1: values.address1,
            address2: values.address2,
            address3: values.address3,
            mobileNo: values.mobileNo,
          };
          console.log(thirdPartyPayload, "thirdPartyPayload");

          fetchSubmissionValues(thirdPartyPayload); // <- You need to define this function
          return;
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
  const fetchSubmissionValues = (values: any) => {
    console.log("fetchValuessforSubmission", values);
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
      if (isThirdPartyMaster) {
        formik.setValues({
          ledgerCode: editData.ledgerCode || "",
          companyName: editData.companyName || "",
          emailId: editData.emailId || "",
          emailId1: editData.emailId1 || "",
          emailId2: editData.emailId2 || "",
          sacNumber: editData.sacNumber || "",
          state: editData.state || "",
          gstNumber: editData.gstNumber || "",
          gstStateCode: editData.gstStateCode || "",
          pan: editData.pan || "",
          address1: editData.address1 || "",
          address2: editData.address2 || "",
          address3: editData.address3 || "",
          mobileNo: editData.mobileNo || "",
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
          editData?.lkpCommissionPerShare || null
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
        formik.setFieldValue("clientRate", editData?.clientRate || null);
        formik.setFieldValue("vendorRate", editData?.vendorRate || null);
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

    if (name === "clientRate" || name === "vendorRate") {
      formik.setFieldValue(name, numericValue);

      const clientRate = parseInt(
        name === "clientRate" ? numericValue : formik.values.clientRate || "0"
      );
      const vendorRate = parseInt(
        name === "vendorRate" ? numericValue : formik.values.vendorRate || "0"
      );

      if (!isNaN(clientRate) && !isNaN(vendorRate)) {
        const brokPerShare = clientRate - vendorRate;
        formik.setFieldValue("brokPerShare", brokPerShare.toString());
      }
    }

    // Updated logic to trigger full business rules when only noOfShare is changed
    else if (name === "noOfShare") {
      formik.setFieldValue(name, numericValue);
      formik.setFieldError(name, "");

      const noOfShare = parseInt(numericValue || "0");
      const brokPerShare = parseInt(formik.values.brokPerShare || "0");

      if (noOfShare > 0 && brokPerShare > 0) {
        const inclusiveGST = Math.floor(noOfShare * brokPerShare);
        const gst = Math.floor(inclusiveGST / 1.18);
        const exclusiveGST = Math.floor(inclusiveGST - gst);

        formik.setFieldValue("brokIncGST", formatIndianNumber(inclusiveGST));
        formik.setFieldValue("gst", formatIndianNumber(exclusiveGST));
        formik.setFieldValue("brokExcGST", formatIndianNumber(gst));

        if (formik.values.sbCode === null && formik.values.sbRate === null) {
          formik.setFieldValue(
            "netBrokerage",
            formatIndianNumber(exclusiveGST)
          );
        }

        const sbRate = parseFloat(formik.values.sbRate || "0");
        if (sbRate > 0) {
          const sbValue = sbRate * noOfShare;
          const stComm = sbValue / 1.18;
          const subBrokerCommission = Math.floor(sbValue - stComm);
          const brokExcGST = exclusiveGST;
          const netBrokerage = Math.floor(brokExcGST - subBrokerCommission);

          formik.setFieldValue("sbCommision", subBrokerCommission);
          formik.setFieldValue("netBrokerage", netBrokerage);
        } else {
          formik.setFieldValue("sbCommision", "");
          if (!formik.values.sbCode && !formik.values.sbRate) {
            formik.setFieldValue(
              "netBrokerage",
              formatIndianNumber(exclusiveGST)
            );
          }
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
          const subBrokerValue = sbRate * noOfShare; //1600
          const subBrokerCommission = Math.floor(subBrokerValue / 1.18);
          console.log("sbCoMMISSION", subBrokerCommission);

          // const subBrokerCommission = Math.floor(subBrokerValue - stComm);

          const brokExcGST = Math.floor(
            parseFloat(
              (formik.values.brokExcGST ?? "0").toString().replace(/,/g, "")
            )
          );

          const netBrokerage = Math.floor(
            Math.abs(brokExcGST - subBrokerCommission)
          );

          formik.setFieldValue(
            "sbCommision",
            formatIndianNumber(subBrokerCommission)
          );
          formik.setFieldValue(
            "netBrokerage",
            formatIndianNumber(netBrokerage)
          );
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
        maxWidth: isUnlistedContent || isThirdPartyMaster ? "700px" : "500px",
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
                  Please upload an image 512px width and 384px height (or 4:3
                  aspect ratio).
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
            {isClientExclusion && (
              <>
                {/* excludeType */}
                <Col lg={12}>
                  <FormControl
                    fullWidth
                    error={
                      formik.touched.excludeType &&
                      Boolean(formik.errors.excludeType)
                    }
                  >
                    <InputLabel id="exclude-type-label">
                      Select Branch/Client Type
                    </InputLabel>
                    <Select
                      size="small"
                      labelId="exclude-type-label"
                      id="excludeType"
                      name="excludeType"
                      value={formik.values.excludeType}
                      label="Select Branch/Client Type"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      sx={{ width: "100%", minHeight: "40px" }}
                    >
                      {TypeOfExclusionClient.map((docType) => (
                        <MenuItem key={docType.value} value={docType.value}>
                          {docType.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched.excludeType &&
                      formik.errors.excludeType && (
                        <p className="text-error">
                          {formik.errors.excludeType}
                        </p>
                      )}
                  </FormControl>
                </Col>

                {/* excludeCode */}
                <Col lg={12}>
                  <TextField
                    fullWidth
                    id="excludeCode"
                    name="excludeCode"
                    label="Enter Branch/Client Code"
                    variant="outlined"
                    size="small"
                    value={formik.values.excludeCode}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.excludeCode &&
                      Boolean(formik.errors.excludeCode)
                    }
                    helperText={
                      formik.touched.excludeCode && formik.errors.excludeCode
                    }
                  />
                </Col>

                {/* excludeFrom */}
                <Col lg={12}>
                  <FormControl
                    fullWidth
                    error={
                      formik.touched.excludeFrom &&
                      Boolean(formik.errors.excludeFrom)
                    }
                  >
                    <InputLabel id="exclude-from-label">
                      Exclude From
                    </InputLabel>
                    <Select
                      size="small"
                      labelId="exclude-from-label"
                      id="excludeFrom"
                      name="excludeFrom"
                      value={formik.values.excludeFrom}
                      label="Exclude From"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      sx={{ width: "100%", minHeight: "40px" }}
                    >
                      {ExcludeOptions.map(
                        (docType: { value: string; label: string }) => (
                          <MenuItem key={docType.value} value={docType.value}>
                            {docType.label}
                          </MenuItem>
                        )
                      )}
                    </Select>
                    {formik.touched.excludeFrom &&
                      formik.errors.excludeFrom && (
                        <p className="text-error">
                          {formik.errors.excludeFrom}
                        </p>
                      )}
                  </FormControl>
                </Col>

                {/* excludeRemark */}
                <Col lg={12}>
                  <TextField
                    fullWidth
                    id="excludeRemark"
                    name="excludeRemark"
                    label="Enter Remark"
                    variant="outlined"
                    size="small"
                    value={formik.values.excludeRemark}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.excludeRemark &&
                      Boolean(formik.errors.excludeRemark)
                    }
                    helperText={
                      formik.touched.excludeRemark &&
                      formik.errors.excludeRemark
                    }
                  />
                </Col>
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
                    id="clientRate"
                    name="clientRate"
                    // type="number"
                    label="Enter Client Rate"
                    variant="outlined"
                    size="small"
                    inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                    value={formik.values.clientRate}
                    onChange={handleCustomChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.clientRate &&
                      Boolean(formik.errors.clientRate)
                    }
                    helperText={
                      formik.touched.clientRate && formik.errors.clientRate
                    }
                  />
                </Col>
                <Col lg={6}>
                  <TextField
                    fullWidth
                    id="vendorRate"
                    name="vendorRate"
                    // type="number"
                    label="Enter Vendor Rate"
                    variant="outlined"
                    size="small"
                    inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                    value={formik.values.vendorRate}
                    onChange={handleCustomChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.vendorRate &&
                      Boolean(formik.errors.vendorRate)
                    }
                    helperText={
                      formik.touched.vendorRate && formik.errors.vendorRate
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
                    // label="LKP Commission per share"
                    variant="outlined"
                    disabled={true}
                    size="small"
                    inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                    // value={formik.values.brokPerShare}
                    value={`${
                      formik.values.brokPerShare || "0"
                    }  /- LKP Commission per share`}
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
            {isThirdPartyMaster && (
              <>
                <Col lg={6}>
                  <TextField
                    fullWidth
                    id="ledgerCode"
                    name="ledgerCode"
                    label="Enter Ledger Code"
                    variant="outlined"
                    size="small"
                    value={formik.values.ledgerCode}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.submitCount > 0 &&
                      Boolean(formik.errors.ledgerCode)
                    }
                    helperText={
                      formik.submitCount > 0 && formik.errors.ledgerCode
                    }
                  />
                </Col>

                <Col lg={6}>
                  <TextField
                    fullWidth
                    id="companyName"
                    name="companyName"
                    label="Enter Company Name"
                    variant="outlined"
                    size="small"
                    value={formik.values.companyName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.submitCount > 0 &&
                      Boolean(formik.errors.companyName)
                    }
                    helperText={
                      formik.submitCount > 0 && formik.errors.companyName
                    }
                  />
                </Col>

                <Col lg={4}>
                  <TextField
                    fullWidth
                    id="emailId"
                    name="emailId"
                    label="Primary Email"
                    variant="outlined"
                    size="small"
                    value={formik.values.emailId}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.submitCount > 0 && Boolean(formik.errors.emailId)
                    }
                    helperText={formik.submitCount > 0 && formik.errors.emailId}
                  />
                </Col>

                <Col lg={4}>
                  <TextField
                    fullWidth
                    id="emailId1"
                    name="emailId1"
                    label="Secondary Email"
                    variant="outlined"
                    size="small"
                    value={formik.values.emailId1}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Col>

                <Col lg={4}>
                  <TextField
                    fullWidth
                    id="emailId2"
                    name="emailId2"
                    label="Alternate Email"
                    variant="outlined"
                    size="small"
                    value={formik.values.emailId2}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Col>
                <p
                  style={{
                    fontSize: "12px",
                    color: "#0c273f",
                    marginTop: "1px",
                  }}
                >
                  For multiple email addresses, use{" "}
                  <span
                    style={{
                      fontWeight: 800,
                    }}
                  >
                    space
                  </span>{" "}
                  to separate them.
                </p>

                <Col lg={6}>
                  <TextField
                    fullWidth
                    id="sacNumber"
                    name="sacNumber"
                    label="SAC Number"
                    variant="outlined"
                    size="small"
                    value={formik.values.sacNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.submitCount > 0 && Boolean(formik.errors.sacNumber)
                    }
                    helperText={
                      formik.submitCount > 0 && formik.errors.sacNumber
                    }
                  />
                </Col>

                <Col lg={6}>
                  <TextField
                    fullWidth
                    id="state"
                    name="state"
                    label="State"
                    variant="outlined"
                    size="small"
                    value={formik.values.state}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.submitCount > 0 && Boolean(formik.errors.state)
                    }
                    helperText={formik.submitCount > 0 && formik.errors.state}
                  />
                </Col>

                <Col lg={6}>
                  <TextField
                    fullWidth
                    id="gstNumber"
                    name="gstNumber"
                    label="GST Number"
                    variant="outlined"
                    size="small"
                    value={formik.values.gstNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.submitCount > 0 && Boolean(formik.errors.gstNumber)
                    }
                    helperText={
                      formik.submitCount > 0 && formik.errors.gstNumber
                    }
                  />
                </Col>

                <Col lg={6}>
                  <TextField
                    fullWidth
                    id="gstStateCode"
                    name="gstStateCode"
                    label="GST State Code"
                    variant="outlined"
                    size="small"
                    value={formik.values.gstStateCode}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.submitCount > 0 &&
                      Boolean(formik.errors.gstStateCode)
                    }
                    helperText={
                      formik.submitCount > 0 && formik.errors.gstStateCode
                    }
                  />
                </Col>

                <Col lg={6}>
                  <TextField
                    fullWidth
                    id="pan"
                    name="pan"
                    label="PAN"
                    variant="outlined"
                    size="small"
                    value={formik.values.pan}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.submitCount > 0 && Boolean(formik.errors.pan)}
                    helperText={formik.submitCount > 0 && formik.errors.pan}
                  />
                </Col>

                <Col lg={6}>
                  <TextField
                    fullWidth
                    id="mobileNo"
                    name="mobileNo"
                    label="Mobile Number"
                    variant="outlined"
                    size="small"
                    value={formik.values.mobileNo}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.submitCount > 0 && Boolean(formik.errors.mobileNo)
                    }
                    helperText={
                      formik.submitCount > 0 && formik.errors.mobileNo
                    }
                  />
                </Col>

                <Col lg={12}>
                  <TextField
                    fullWidth
                    id="address1"
                    name="address1"
                    label="Address Line 1"
                    variant="outlined"
                    size="small"
                    value={formik.values.address1}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.submitCount > 0 && Boolean(formik.errors.address1)
                    }
                    helperText={
                      formik.submitCount > 0 && formik.errors.address1
                    }
                  />
                </Col>

                <Col lg={6}>
                  <TextField
                    fullWidth
                    id="address2"
                    name="address2"
                    label="Address Line 2"
                    variant="outlined"
                    size="small"
                    value={formik.values.address2}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Col>

                <Col lg={6}>
                  <TextField
                    fullWidth
                    id="address3"
                    name="address3"
                    label="Address Line 3"
                    variant="outlined"
                    size="small"
                    value={formik.values.address3}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
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
