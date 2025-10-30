import {
  Button,
  Col,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import {
  Box,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  FormControl,
  FormHelperText,
} from "@mui/material";
// import { InputAdornment } from "@mui/material";
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
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import {
  TypeOfDepartment,
  TypeOfExclusionClient,
} from "../../../helper/tableColumns.tsx";
import ShowToast from "../../../utils/toastUtils";
import FileUploadField from "../fileUploadField/index.tsx";
import { regEx } from "../../../helper/method.ts";
import Tooltip from "@mui/material/Tooltip";
import CloseIcon from "@mui/icons-material/Close";
// import VisibilityIcon from "@mui/icons-material/Visibility"; // or use FontAwesome/React Icons
import CustomModal from "../../../components/common/DPModal";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import pako from "pako";

interface IsMarketingMaterialEditData {
  CommunicationProofPath?: string;
  fileUpload?: File;
  image?: File;
}

interface EditData {
  CommunicationProofPath?: string;
}

const vendorFields = [
  { name: "city", label: "City" },
  { name: "pinCode", label: "Pin Code" },
  { name: "state", label: "State" },
  { name: "gstNo", label: "GST No" },
  { name: "mobileNo", label: "Mobile No" },
  { name: "emailId", label: "Email ID" },
  { name: "telephoneNo", label: "Telephone No" },
  { name: "faxNo", label: "Fax No" },
  { name: "websiteName", label: "Website Name" },
  { name: "panNo", label: "PAN No" },
] as const;

const bankFields = [
  {
    name: "bankAccountNo",
    label: "Bank A/C No",
  },
  {
    name: "ifscCode",
    label: "IFSC Code",
  },
];

type VendorFieldName = (typeof vendorFields)[number]["name"];

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
  isVendorMasterContent,
  activeSubItem,
  setDisableFields,
}: {
  modal_grid: boolean;
  tog_grid: () => void;
  onSubmit?: (
    data: any,
    apiStatus?: any,
    fileBase64?: any,
    bankFileBase64?: any,
    tdsFileExtension?: any,
    msmeFileExtension?: any,
    bankFileExtension?: any
  ) => void;
  editData?: any;
  editUserCheck?: boolean;
  isRegulatoryContent?: any;
  isMarketingMaterial?: boolean;
  isUnlistedContent?: boolean;
  isClientExclusion?: boolean;
  isThirdPartyMaster?: boolean;
  ExcludeOptions?: any;
  isVendorMasterContent?: any;
  activeSubItem?: any;
  setDisableFields?: any;
  setShowBankUpload?: any;
}) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedPanFile, setUploadedPanFile] = useState<File | null>(null);
  const [uploadedMSMEFile, setUploadedMSMEFile] = useState<File | null>(null);
  const [uploadedBankFile, setUploadedBankFile] = useState<File | null>(null);
  const [uploadedFileM, setUploadedFileM] = useState<File | null>(null);
  const [uploadedImageM, setUploadedImageM] = useState<File | null>(null);
  const [fileExtension, setFileExtension] = useState("");
  const [panFileExtension, setPanFileExtension] = useState("");
  const [msmeFileExtension, setmsmeFileExtension] = useState("");
  const [bankFileExtension, setBankFileExtension] = useState("");
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [panFileBase64, setPanFileBase64] = useState<string | null>(null);
  const [msmeFileBase64, setMsmeFileBase64] = useState<string | null>(null);
  const [bankFileBase64, setbankFileBase64] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRefImage = useRef<HTMLInputElement>(null);
  const fileInputRefDocument = useRef<HTMLInputElement>(null);
  const [setShowImg, setSetShowImg] = useState<boolean>(false);
  const [modal_center, setModalCenter] = useState(false);

  const allowedFormats = [
    "doc",
    "docx",
    "pdf",
    "xls",
    "xlsx",
    "jpg",
    "jpeg",
    "png",
  ];

  const { authenticationValue, user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );
  console.log("PAN", authenticationValue);
  const rmCode = user_id.split("-")[1] || "";
  // formik.setFieldValue("rmCode", rmCode);
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
      // mobileNo: Yup.string().required("Mobile Number is required"),
    });

  const getValidationSchema = (editData?: EditData) => {
    // debugger;
    if (isRegulatoryContent) {
      return getRegulatoryValidationSchema(editData!);
    } else if (isMarketingMaterial) {
      return getMarketingMaterialValidationSchema(editData);
    } else if (isClientExclusion) {
      return getClientExclusionValidationSchema();
    } else if (isThirdPartyMaster) {
      return getThirdPartyValidationSchema();
    } else if (isVendorMasterContent) {
      return getVendorMasterValidationSchema();
    } else {
      return Yup.object(); // fallback schema (or handle general case)
    }
  };

  const getVendorMasterValidationSchema = () =>
    Yup.object().shape({
      vendorName: Yup.string().required("Vendor Name is required"),
      chequePrintName: Yup.string().required(
        "Bank Beneficiary Name is required"
      ),
      address1: Yup.string().required("Address 1 is required"),
      // address2: Yup.string().required("Address2 is required"),
      // address3: Yup.string().required("Address3 is required"),
      city: Yup.string().required("City is required"),
      pinCode: Yup.string().required("Pin Code is required"),
      state: Yup.string().required("State is required"),
      // gstNo: Yup.string().required("GST No is required"),
      mobileNo: Yup.string().required("Mobile No is required"),
      emailId: Yup.string()
        .email("Invalid email")
        .required("Email ID is required"),
      // faxNo: Yup.string().required("FAX No is required"),
      // telephoneNo: Yup.string().required("Telephone No No is required"),
      panNo: Yup.string().required("PAN No is required"),
      // serviceTaxNo: Yup.string().required("Service Tax No is required"),
      // websiteName: Yup.string().required("website Name is required"),
      // tdsFlag: Yup.string().required("TDS flag is required"),
      // tdsFile: Yup.mixed().when("tdsFlag", {
      //   is: (val: string) => val === "Yes",
      //   then: (schema) => schema.required("TDS document is required"),
      //   otherwise: (schema) => schema.notRequired(),
      // }),
      msmeFlag: Yup.string().required("MSME flag is required"),
      msmeType: Yup.string().when("msmeFlag", {
        is: (val: string) => val === "Yes",
        then: (schema) => schema.required("MSME Type is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      msmeFile: Yup.mixed().when("msmeFlag", {
        is: (val: string) => val === "Yes",
        then: (schema) => schema.required("MSME document is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      panFile: Yup.mixed().nullable().required("PAN document is required"),
      ifscCode: Yup.string().required("IFSC Code is required"),
      bankAccountNo: Yup.string().required("Bank A/C No is required"),
      // bankFile: Yup.mixed().when("$showBankUpload", {
      //   is: true,
      //   then: (schema) => schema.required("Bank file is required"),
      //   otherwise: (schema) => schema.notRequired(),
      // }),
      bankFile: Yup.mixed().nullable().required("Bank document is required"),
    });

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
    : isVendorMasterContent
    ? {
        vendorName: "",
        chequePrintName: "",
        address1: "",
        address2: "",
        address3: "",
        city: "",
        pinCode: "",
        state: "",
        gstNo: "",
        mobileNo: "",
        emailId: "",
        telephoneNo: "",
        faxNo: "",
        panNo: "",
        panFile: null,
        panExtension: "",
        panDoc: "",
        serviceTaxNo: "",
        websiteName: "",
        // tdsFlag: "",
        // tdsFile: null,
        tdsFileName: "",
        msmeFlag: "",
        msmeType: "",
        msmeFile: null,
        msmeFileName: "",
        ifscCode: "",
        bankAccountNo: "",
        bankFile: null,
        bankFileName: "",
        // directAppLevel: "",
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
        rmCode: rmCode,
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
        } else if (isVendorMasterContent) {
          fetchVendorMastertContent(setTouched, values);
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

  const fetchVendorMastertContent = async (setTouched: any, values: any) => {
    console.log("fetchVendorMasterValues", setTouched, values);

    let hasError = false;

    // Always prepare to show touched fields if they're conditionally required
    const touchedFields: any = {};

    // if (showBankUpload === true) {
    //   touchedFields.bankFile = true;
    //   if (!values.bankFile) {
    //     formik.setFieldError("bankFile", "Bank File is required");
    //     hasError = true;
    //   }
    // }

    // Set touched fields for all relevant fields
    setTouched(touchedFields);

    if (hasError) return;

    // Call the actual submit function
    onSubmit?.(
      values,
      panFileBase64,
      msmeFileBase64,
      bankFileBase64,
      panFileExtension,
      msmeFileExtension,
      bankFileExtension
    );

    // Reset form
    formik.resetForm();
  };

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
    console.log(
      "editInfoData",
      editData,
      editUserCheck,
      fileExtension,
      setShowImg
    );
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
      if (isVendorMasterContent) {
        // if (editData?.bankActNo !== "" && editData?.ifscCode !== "") {
        //   setShowBankUpload(true);
        // }

        formik.setValues({
          vendorName: editData.vendorName || "",
          chequePrintName: editData.chqPrintName || "",
          address1: editData.address1 || "",
          address2: editData.address2 || "",
          address3: editData.address3 || "",
          city: editData.city || "",
          pinCode: editData.pincode || "",
          state: editData.state || "",
          gstNo: editData.gstNo || editData.gstNumber || "",
          mobileNo: editData.mobileNo || "",
          emailId: editData.emailID || editData.emailId || "",
          telephoneNo: editData.teleNo || "",
          faxNo: editData.faxNo || "",
          panNo: editData.panNo || editData.pan || "",
          panDoc: editData.panDoc || editData.panDoc || "",
          serviceTaxNo: editData.serviceTaxNo || "",
          websiteName: editData.websiteName || "",
          panFile: editData.panFile || null,
          panExtension: "",
          // tdsFlag: editData.tdsFlag ? "Yes" : "No",
          // tdsFile: editData.tdsPath || null,
          msmeFlag: editData.msmeFlag ? "Yes" : "No",
          msmeType: editData.msmeType || "",
          msmeFile: editData.msmePath || null,
          ifscCode: editData.ifscCode || "",
          bankAccountNo: editData.bankActNo || "",
          bankFile: editData.bankDoc || null,
          bankFileName: editData?.bankFileName,
          tdsFileName: editData?.tdsFileName,
          msmeFileName: editData?.msmeFileName,
          // directAppLevel: editData.directAppLevel || "",
        });
      }
    }
  }, [editData, editUserCheck]);

  const handleFileUploadAsync = (
    file: any,
    communicationProofPath?: string,
    isUploadedFile?: string
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      console.log("args-->", file, communicationProofPath, isUploadedFile);
      const fileExt = file.name.split(".").pop()?.toLowerCase() || "";
      if (allowedFormats.includes(fileExt)) {
        if (isUploadedFile && file.size > 1024 * 1024) {
          ShowToast("error", "File size must be less than 1MB.");
          reject(new Error("File size exceeds 1MB"));
          return; // stop execution
        }

        const { name } = file;
        const fileName = name.substring(0, name.lastIndexOf("."));
        console.log("fileName", fileName);

        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = () => {
          const base64String = reader.result as string;
          const base64Only = base64String.split(",")[1] || base64String;

          // Determine document type from isUploadedFile
          let docType = "";
          if (isUploadedFile === "msmeFile") docType = "MSME";
          if (isUploadedFile === "panFile") docType = "PAN";
          else if (isUploadedFile === "bankFile") docType = "BANK";

          // Final file name: authenticationValue_<DOC_TYPE>.<extension>
          const finalFileName = `${authenticationValue}_${docType}.${fileExt}`;
          console.log("customFileName", finalFileName);

          if (isUploadedFile === "panFile") {
            setUploadedPanFile(file);
            setPanFileBase64(base64Only);
            setPanFileExtension(fileExt);
            formik.setFieldValue("panDoc", finalFileName);
          } else if (isUploadedFile === "msmeFile") {
            setUploadedMSMEFile(file);
            setMsmeFileBase64(base64Only);
            setmsmeFileExtension(fileExt);
            formik.setFieldValue("msmeFileName", finalFileName);
          } else if (isUploadedFile === "bankFile") {
            setUploadedBankFile(file);
            setbankFileBase64(base64Only);
            setBankFileExtension(fileExt);
            formik.setFieldValue("bankFileName", finalFileName);
          } else {
            setUploadedFile(file);
            setFileBase64(base64Only);
            setFileExtension(fileExt);
          }

          const customFileName = `${authenticationValue}_TDS.${fileExt}`;
          console.log("filleName", customFileName);

          dispatch(showLoader(""));
          let payload = {
            fileName:
              isUploadedFile !== "" ? finalFileName : communicationProofPath,
            filePath:
              isUploadedFile === "msmeFile" || isUploadedFile === "panFile"
                ? "\\172.17.100.60\\d$\\WebPortal\\Intranet_New\\Files\\VendorMasterMSME"
                : "D:\\FileUpload\\Compliance",
            // filePath: `D:\\FileUpload\\Compliance\\${communicationProofPath}
            fileType:
              isUploadedFile === "msmeFile" ? `.${fileExt}` : `.${fileExt}`,
            contentType:
              isUploadedFile === "msmeFile" ? `${base64Only}` : `${base64Only}`,
          };
          console.log("payload-->", payload);

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
    setDisableFields?.(false);
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
    console.log("name-->", name, "value-->", value);

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
      // allow only digits and a single dot
      const decimalValue = value
        .replace(/[^0-9.]/g, "")
        .replace(/(\..*)\./g, "$1");

      formik.setFieldValue(name, decimalValue);

      const clientRate = parseFloat(
        name === "clientRate" ? decimalValue : formik.values.clientRate || "0"
      );
      const vendorRate = parseFloat(
        name === "vendorRate" ? decimalValue : formik.values.vendorRate || "0"
      );

      if (!isNaN(clientRate) && !isNaN(vendorRate)) {
        const brokPerShare = clientRate - vendorRate;
        formik.setFieldValue("brokPerShare", brokPerShare.toFixed(2)); // keep decimals
      }
    }

    // Updated logic to trigger full business rules when only noOfShare is changed
    else if (name === "noOfShare") {
      formik.setFieldValue(name, numericValue);
      formik.setFieldError(name, "");

      const noOfShare = parseInt(numericValue || "0");
      const brokPerShare = parseFloat(formik.values.brokPerShare || "0");

      if (noOfShare > 0 && brokPerShare > 0) {
        const inclusiveGST = Math.floor(noOfShare * brokPerShare);
        const gst = Math.floor(inclusiveGST / 1.18);
        const exclusiveGST = Math.floor(inclusiveGST - gst);

        formik.setFieldValue("brokIncGST", formatIndianNumber(inclusiveGST));
        formik.setFieldValue("gst", formatIndianNumber(exclusiveGST));
        formik.setFieldValue("brokExcGST", formatIndianNumber(gst));

        // Leave it blank until sbRate is provided
        const sbRate = parseFloat(formik.values.sbRate || "0");
        if (sbRate > 0) {
          const sbValue = sbRate * noOfShare;
          const subBrokerCommission = Math.floor(sbValue / 1.18);

          const brokExcGST = exclusiveGST;
          const netBrokerage = Math.floor(brokExcGST - subBrokerCommission);

          formik.setFieldValue("sbCommision", subBrokerCommission);
          formik.setFieldValue(
            "netBrokerage",
            formatIndianNumber(netBrokerage)
          );
        } else {
          formik.setFieldValue("sbCommision", "");
          formik.setFieldValue("netBrokerage", ""); // keep empty until sbRate entered
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
    } else if (name === "bankAccountNo") {
      if (regEx.number.test(value)) {
        formik.setFieldValue(name, value.toUpperCase().replace(/\s/g, ""));
      }
    } else if (name === "ifscCode") {
      const formattedValue = value.toUpperCase().replace(/\s/g, "");

      // Enforce maximum length of 11 characters
      if (formattedValue.length <= 11) {
        formik.setFieldValue(name, formattedValue);

        const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
        if (formattedValue.length === 11 && ifscRegex.test(formattedValue)) {
          console.log("Valid IFSC Code");
        } else {
          console.log("Invalid IFSC Code");
        }
      }
    } else if (name === "gstNo") {
      if (regEx.alphaNumeric.test(value)) {
        formik.setFieldValue(name, value.toUpperCase().replace(/\s/g, ""));
      }
    } else if (name === "pinCode") {
      const digitsOnly = value.replace(/\D/g, ""); // Remove non-numeric
      if (digitsOnly.length <= 6) {
        formik.setFieldValue(name, digitsOnly);
      }
    } else if (name === "mobileNo" || name === "telephoneNo") {
      const digitsOnly = value.replace(/\D/g, ""); // Remove non-numeric
      if (digitsOnly.length <= 10) {
        formik.setFieldValue(name, digitsOnly);
      }
    } else if (name === "faxNo" || name === "serviceTaxNo") {
      const digitsOnly = value.replace(/\D/g, "");
      formik.setFieldValue(name, digitsOnly);
    } else if (name === "panNo") {
      const formattedValue = value.toUpperCase().replace(/\s/g, "");
      if (
        regEx.alphaNumeric.test(formattedValue) &&
        formattedValue.length <= 11
      ) {
        formik.setFieldValue(name, formattedValue);
      }
    } else {
      formik.handleChange(event);
    }
  };

  useEffect(() => {
    console.log("FORMIK_VALUESS", formik.values, formik.errors);
  }, [formik]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    fieldName: "bankFile" | "msmeFile" | "panFile"
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUploadAsync(file, file.name, fieldName)
        .then(() => {
          formik.setFieldValue(fieldName, file);
        })
        .catch(() => {
          formik.setFieldError(fieldName, "Failed to upload file.");
          ShowToast("error", "Failed to upload file.");
        });
    }
  };

  const handlePreviewFile = (
    file: File | null | undefined,
    isUploadedFile?: string
  ) => {
    // Get the correct file from formik.values if not directly passed
    const selectedFile =
      isUploadedFile === "panFile"
        ? formik.values.panFile
        : isUploadedFile === "msmeFile"
        ? formik.values.msmeFile
        : isUploadedFile === "bankFile"
        ? formik.values.bankFile
        : file;
    console.log("File111111", file, isUploadedFile);

    if (!selectedFile || !selectedFile.name) {
      ShowToast("info", "No valid file to download");
      return;
    }

    const fileName = selectedFile.name;
    const url = URL.createObjectURL(selectedFile);

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (editData?.msmePath) {
      const file = base64ToFileAuto(
        editData.msmePath,
        editData?.msmseExtn, // keep exact key from API
        formik.values.msmeFileName
      );
      console.log("MSME Base64", editData.msmePath.slice(0, 50));
      if (file) formik.setFieldValue("msmeFile", file);
    }

    if (editData?.bankDoc) {
      const file = base64ToFileAuto(
        editData.bankDoc,
        editData?.bankDocExtn,
        formik.values.bankFileName
      );
      console.log("Bank Base64", editData.bankDoc.slice(0, 50));
      if (file) formik.setFieldValue("bankFile", file);
    }
  }, [editData]);

  function base64ToFileAuto(
    base64: string,
    extn?: string,
    fileName?: string
  ): File | null {
    if (!base64) return null;

    // Decode base64 to binary
    const binaryString = atob(base64);
    const binaryData = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      binaryData[i] = binaryString.charCodeAt(i);
    }

    // Detect if it's GZIP (first two bytes 0x1F 0x8B)
    const isGzip = binaryData[0] === 0x1f && binaryData[1] === 0x8b;
    let fileBytes = binaryData;

    if (isGzip) {
      // Decompress GZIP
      fileBytes = pako.ungzip(binaryData);
    }

    // Map extn to MIME
    const mimeType =
      extn?.toLowerCase() === ".pdf" || extn?.toLowerCase() === "pdf"
        ? "application/pdf"
        : extn?.toLowerCase() === ".jpg" ||
          extn?.toLowerCase() === "jpg" ||
          extn?.toLowerCase() === ".jpeg" ||
          extn?.toLowerCase() === "jpeg"
        ? "image/jpeg"
        : extn?.toLowerCase() === ".png" || extn?.toLowerCase() === "png"
        ? "image/png"
        : "application/octet-stream";

    return new File([fileBytes], fileName || `file${extn || ""}`, {
      type: mimeType,
    });
  }

  useEffect(() => {
    if (user_id) {
      const rmCode = user_id.split("-")[1] || "";
      formik.setFieldValue("rmCode", rmCode);
    }
  }, [user_id]);

  useEffect(() => {
    if (editUserCheck && activeSubItem !== "Unlisted Shares Entry") {
      const fileExtension =
        editData && editData.panDoc
          ? `.${editData.panDoc.split(".").pop()?.toLowerCase()}`
          : "";
      formik.setFieldValue("panExtension", fileExtension);
      const payload = {
        fileName: editData.panDoc,
        filePath:
          "\\172.17.100.60\\d$\\WebPortal\\Intranet_New\\Files\\VendorMasterMSME",
        fileType: fileExtension,
        contentType: "",
      };

      console.log("approvalExtension", payload);

      dispatch(showLoader("Loading Preview..."));

      apiServices
        .ComplianceDownload(payload)
        .then((response) => {
          if (response?.status === 200 && response?.data) {
            const fileBlob = new Blob([response.data], {
              type:
                response.headers["content-type"] || "application/octet-stream",
            });

            const file = new File([fileBlob], editData.panDoc, {
              type:
                response.headers["content-type"] || "application/octet-stream",
            });

            formik.setFieldValue("panFile", file);
          } else {
            ShowToast("info", "Error fetching file for preview");
          }
        })
        .catch((error) => {
          ShowToast("info", error.message || "Preview failed");
        })
        .finally(() => {
          dispatch(hideLoader());
        });
    }
  }, [editUserCheck, editData, activeSubItem, dispatch]);

  return (
    <Modal
      style={{
        fontFamily: "Public Sans",
        maxWidth: isUnlistedContent || isThirdPartyMaster ? "900px" : "900px",
        width: "100%",
      }}
      isOpen={modal_grid}
      toggle={toggle}
      backdrop="static"
      keyboard={false}
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
            <CustomModal
              activeSubItem={activeSubItem}
              tog_center={() => setModalCenter(false)}
              modal_center={modal_center}
              setmodal_center={setModalCenter}
              Msg=""
              // expiredtime={true}
              setSetShowImg={setSetShowImg}
              setShowImg={true}
            />
            {isRegulatoryContent && (
              <>
                <Col lg={12}>
                  <FormControl fullWidth>
                    <label style={{ fontSize: "12px" }} className="form-label">
                      <span>
                        Date of Communication{" "}
                        <span style={{ color: "red" }}>*</span>
                      </span>
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
                  // label="Upload Proof of Communication"
                  label={
                    <span>
                      Upload Proof of Communication{" "}
                      <span style={{ color: "red" }}>*</span>
                    </span>
                  }
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
                  label={
                    <span>
                      Upload Image <span style={{ color: "red" }}>*</span>
                    </span>
                  }
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
                    <span>
                      Description <span style={{ color: "red" }}>*</span>
                    </span>
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
                    inputProps={{ maxLength: 80 }}
                    helperText={
                      formik.touched.description && formik.errors.description
                    }
                  />
                </Col>

                <FileUploadField
                  label={
                    <span>
                      Upload Document <span style={{ color: "red" }}>*</span>
                    </span>
                  }
                  // label="Upload Documents *"
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
                    disabled={true}
                    value={formik.values.rmCode}
                    onChange={handleCustomChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.rmCode && Boolean(formik.errors.rmCode)
                    }
                    // helperText={formik.touched.rmCode && formik.errors.rmCode}
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
                    inputProps={{
                      inputMode: "decimal",
                      pattern: "^[0-9]*\\.?[0-9]+$",
                    }}
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
                    inputProps={{
                      inputMode: "decimal",
                      pattern: "^[0-9]*\\.?[0-9]+$",
                    }}
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
            {isVendorMasterContent && (
              <>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  <Box sx={{ flex: "1 1 45%" }}>
                    <TextField
                      fullWidth
                      size="small"
                      variant="outlined"
                      name="vendorName"
                      label="Vendor Name"
                      placeholder="Enter Vendor Name"
                      value={formik.values.vendorName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.vendorName &&
                        Boolean(formik.errors.vendorName)
                      }
                      helperText={
                        formik.touched.vendorName && formik.errors.vendorName
                      }
                    />
                  </Box>
                  <Box sx={{ flex: "1 1 45%" }}>
                    <TextField
                      fullWidth
                      size="small"
                      variant="outlined"
                      label={"Bank Beneficiary Name"}
                      placeholder="Enter Bank Beneficiary Name"
                      name="chequePrintName"
                      value={formik.values.chequePrintName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.chequePrintName &&
                        Boolean(formik.errors.chequePrintName)
                      }
                      helperText={
                        formik.touched.chequePrintName &&
                        formik.errors.chequePrintName
                      }
                    />
                  </Box>
                </Box>

                {/* Address Fields */}
                <Box
                  component="form"
                  sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                >
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {/* Address Fields */}
                    {["address1", "address2", "address3"].map(
                      (field: any, idx: any) => (
                        <Box key={field} sx={{ flex: "1 1 45%" }}>
                          <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            name={field}
                            label={`Address ${idx + 1}`}
                            placeholder={`Please enter Address ${idx + 1}`}
                            value={(formik.values as any)[field]}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                              (formik.touched as any)[field] &&
                              Boolean((formik.errors as any)[field])
                            }
                            helperText={
                              (formik.touched as any)[field] &&
                              (formik.errors as any)[field]
                            }
                          />
                        </Box>
                      )
                    )}

                    {vendorFields.map(({ name, label }) => (
                      <Box key={name} sx={{ flex: "1 1 45%" }}>
                        <TextField
                          fullWidth
                          size="small"
                          variant="outlined"
                          name={name}
                          label={label}
                          placeholder={`Please enter ${label}`}
                          value={formik.values[name as VendorFieldName] || ""}
                          onChange={handleCustomChange}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched[name as VendorFieldName] &&
                            Boolean(formik.errors[name as VendorFieldName])
                          }
                          helperText={
                            formik.touched[name as VendorFieldName] &&
                            formik.errors[name as VendorFieldName]
                          }
                        />
                      </Box>
                    ))}
                  </Box>
                  <Row>
                    <Col lg={6}>
                      <Label htmlFor="panFileUpload" className="form-label">
                        Upload PAN Document
                      </Label>
                      <div
                        style={{ position: "relative", width: "127%" }}
                        onDrop={(e) => handleDrop(e, "panFile")}
                        onDragOver={handleDragOver}
                      >
                        <input
                          type="file"
                          id="panFileUpload"
                          accept=".pdf,.jpg,.jpeg,.png"
                          style={{ display: "none" }}
                          onChange={async (e) => {
                            const file = e.currentTarget.files?.[0];
                            if (file) {
                              try {
                                await handleFileUploadAsync(
                                  file,
                                  file.name,
                                  "panFile"
                                );
                                formik.setFieldValue("panFile", file);
                              } catch (error) {
                                formik.setFieldError(
                                  "panFile",
                                  "Failed to upload file."
                                );
                              }
                            }
                            e.target.value = "";
                          }}
                        />

                        <Button
                          type="button"
                          onClick={() =>
                            document.getElementById("panFileUpload")?.click()
                          }
                          style={{
                            backgroundColor: "#f8f9fa",
                            color: "#333",
                            border: "1px dashed #ced4da",
                            height: "38px",
                            width: "80%",
                            borderRadius: "0.25rem",
                            fontSize: "0.9rem",
                            textAlign: "left",
                            paddingLeft: "12px",
                            paddingRight: formik.values.panFile
                              ? "40px"
                              : "12px",
                            overflow: "hidden",
                            position: "relative",
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                          }}
                        >
                          {formik.values.panFile ? (
                            <>
                              {uploadedPanFile?.name || `pan_document_file`}
                              <Tooltip title="Delete file" arrow>
                                <span
                                  style={{
                                    position: "absolute",
                                    right: "8px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    cursor: "pointer",
                                    color: "#dc3545",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    formik.setFieldValue("panFile", null);
                                    setUploadedPanFile(null);
                                    setPanFileExtension("");
                                    setPanFileBase64(null);
                                  }}
                                >
                                  <CloseIcon fontSize="small" />
                                </span>
                              </Tooltip>
                            </>
                          ) : (
                            <span style={{ fontSize: "13px" }}>
                              <strong>Click to upload</strong> or drag and drop
                              your <strong>.pdf, .docx</strong> file here
                            </span>
                          )}
                        </Button>

                        {formik.errors.panFile && (
                          <div
                            className="text-danger mt-1"
                            style={{ fontSize: "0.85rem" }}
                          >
                            {formik.errors.panFile}
                          </div>
                        )}

                        <div className="mt-1">
                          <small
                            className="text-muted d-block"
                            style={{ fontSize: "12px" }}
                          >
                            • Only <strong>.pdf</strong>, <strong>.docx</strong>{" "}
                            files are accepted.
                          </small>
                        </div>
                      </div>
                    </Col>
                    <Col
                      lg={6}
                      style={{
                        // border: "1px solid blue",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {formik.values.panFile && (
                        <Tooltip title="download File" arrow>
                          {/* <VisibilityIcon
                                onClick={() =>
                                  handlePreviewFile(
                                    formik.values.msmeFile,
                                    "msmeFile"
                                  )
                                }
                                style={{
                                  cursor: "pointer",
                                  fontSize: "30px",
                                  color: "#11395C",
                                  marginTop: "14px",
                                }}
                              /> */}

                          <DownloadForOfflineIcon
                            onClick={() =>
                              handlePreviewFile(
                                formik.values.panFile,
                                "panFile"
                              )
                            }
                            style={{
                              cursor: "pointer",
                              fontSize: "30px",
                              color: "#11395C",
                              marginTop: "14px",
                            }}
                          />
                        </Tooltip>
                      )}
                    </Col>
                  </Row>

                  {/* MSME Flag */}
                  <FormControl sx={{ height: "40px", mt: 1 }}>
                    <FormLabel sx={{ fontSize: "12px" }}>MSME Flag</FormLabel>
                    <RadioGroup
                      row
                      name="msmeFlag"
                      value={formik.values.msmeFlag}
                      onChange={(e) => {
                        formik.setFieldValue("msmeFlag", e.target.value);
                        if (e.target.value === "No") {
                          formik.setFieldValue("msmeType", "");
                          formik.setFieldValue("msmeFile", null);
                          setUploadedMSMEFile(null);
                          setmsmeFileExtension("");
                          setMsmeFileBase64(null);
                        }
                      }}
                    >
                      <FormControlLabel
                        value="Yes"
                        control={<Radio />}
                        label="Yes"
                      />
                      <FormControlLabel
                        value="No"
                        control={<Radio />}
                        label="No"
                      />
                    </RadioGroup>
                    {formik.touched.msmeFlag && formik.errors.msmeFlag && (
                      <FormHelperText error>
                        {formik.errors.msmeFlag}
                      </FormHelperText>
                    )}
                  </FormControl>

                  {/* If MSME is Yes */}
                  {formik.values.msmeFlag === "Yes" && (
                    <>
                      {/* MSME Type Selection */}
                      <FormControl sx={{ height: "40px", mt: 1, mb: 1 }}>
                        <FormLabel sx={{ fontSize: "12px" }}>
                          MSME Type
                        </FormLabel>
                        <RadioGroup
                          row
                          name="msmeType"
                          value={formik.values.msmeType}
                          onChange={(e) =>
                            formik.setFieldValue("msmeType", e.target.value)
                          }
                        >
                          <FormControlLabel
                            value="Micro"
                            control={<Radio />}
                            label="Micro"
                          />
                          <FormControlLabel
                            value="Small"
                            control={<Radio />}
                            label="Small"
                          />
                          <FormControlLabel
                            value="Medium"
                            control={<Radio />}
                            label="Medium"
                          />
                        </RadioGroup>
                        {formik.touched.msmeType && formik.errors.msmeType && (
                          <FormHelperText error>
                            {formik.errors.msmeType}
                          </FormHelperText>
                        )}
                      </FormControl>

                      {/* MSME Upload - Same UI as TDS Upload */}
                      <Row>
                        <Col lg={6}>
                          <Label
                            htmlFor="msmeFileUpload"
                            className="form-label"
                          >
                            Upload MSME Certificate
                          </Label>
                          <div
                            style={{ position: "relative", width: "127%" }}
                            onDrop={(e) => handleDrop(e, "msmeFile")}
                            onDragOver={handleDragOver}
                          >
                            <input
                              type="file"
                              id="msmeFileUpload"
                              accept=".pdf,.jpg,.jpeg,.png"
                              style={{ display: "none" }}
                              onChange={async (e) => {
                                const file = e.currentTarget.files?.[0];
                                if (file) {
                                  try {
                                    await handleFileUploadAsync(
                                      file,
                                      file.name,
                                      "msmeFile"
                                    );
                                    formik.setFieldValue("msmeFile", file);
                                  } catch (error) {
                                    formik.setFieldError(
                                      "msmeFile",
                                      "Failed to upload file."
                                    );
                                  }
                                }
                                e.target.value = "";
                              }}
                            />

                            <Button
                              type="button"
                              onClick={() =>
                                document
                                  .getElementById("msmeFileUpload")
                                  ?.click()
                              }
                              style={{
                                backgroundColor: "#f8f9fa",
                                color: "#333",
                                border: "1px dashed #ced4da",
                                height: "38px",
                                width: "80%",
                                borderRadius: "0.25rem",
                                fontSize: "0.9rem",
                                textAlign: "left",
                                paddingLeft: "12px",
                                paddingRight: formik.values.msmeFile
                                  ? "40px"
                                  : "12px",
                                overflow: "hidden",
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                cursor: "pointer",
                              }}
                            >
                              {formik.values.msmeFile ? (
                                <>
                                  {uploadedMSMEFile?.name ||
                                    `msme_document_file${editData?.msmseExtn}`}
                                  <Tooltip title="Delete file" arrow>
                                    <span
                                      style={{
                                        position: "absolute",
                                        right: "8px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        cursor: "pointer",
                                        color: "#dc3545",
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        formik.setFieldValue("msmeFile", null);
                                        setUploadedMSMEFile(null);
                                        setmsmeFileExtension("");
                                        setMsmeFileBase64(null);
                                      }}
                                    >
                                      <CloseIcon fontSize="small" />
                                    </span>
                                  </Tooltip>
                                </>
                              ) : (
                                <span style={{ fontSize: "13px" }}>
                                  <strong>Click to upload</strong> or drag and
                                  drop your <strong>.pdf, .docx</strong> file
                                  here
                                </span>
                              )}
                            </Button>

                            {formik.errors.msmeFile && (
                              <div
                                className="text-danger mt-1"
                                style={{ fontSize: "0.85rem" }}
                              >
                                {formik.errors.msmeFile}
                              </div>
                            )}

                            <div className="mt-1">
                              <small
                                className="text-muted d-block"
                                style={{ fontSize: "12px" }}
                              >
                                • Only <strong>.pdf</strong>,{" "}
                                <strong>.docx</strong> files are accepted.
                              </small>
                            </div>
                          </div>
                        </Col>
                        <Col
                          lg={6}
                          style={{
                            // border: "1px solid blue",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {formik.values.msmeFile && (
                            <Tooltip title="download File" arrow>
                              {/* <VisibilityIcon
                                onClick={() =>
                                  handlePreviewFile(
                                    formik.values.msmeFile,
                                    "msmeFile"
                                  )
                                }
                                style={{
                                  cursor: "pointer",
                                  fontSize: "30px",
                                  color: "#11395C",
                                  marginTop: "14px",
                                }}
                              /> */}

                              <DownloadForOfflineIcon
                                onClick={() =>
                                  handlePreviewFile(
                                    formik.values.msmeFile,
                                    "msmeFile"
                                  )
                                }
                                style={{
                                  cursor: "pointer",
                                  fontSize: "30px",
                                  color: "#11395C",
                                  marginTop: "14px",
                                }}
                              />
                            </Tooltip>
                          )}
                        </Col>
                      </Row>
                    </>
                  )}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1.5,
                    mt: 3,
                  }}
                >
                  {bankFields.map(({ name, label }) => (
                    <Box key={name} sx={{ flex: "1 1 38%" }}>
                      <TextField
                        fullWidth
                        size="small"
                        variant="outlined"
                        name={name}
                        label={label}
                        placeholder={`Enter ${label}`}
                        value={(formik.values as any)[name]}
                        onChange={handleCustomChange}
                        onBlur={formik.handleBlur}
                        error={
                          (formik.touched as any)[name] &&
                          Boolean((formik.errors as any)[name])
                        }
                        helperText={
                          (formik.touched as any)[name] &&
                          (formik.errors as any)[name]
                        }
                      />
                    </Box>
                  ))}

                  {/* <Box sx={{ flex: "1 1 5%" }}>
                    <Button
                      type="button"
                      variant="contained"
                      size="small"
                      style={{
                        backgroundColor: "#11395C",
                        height: "36px",
                        width: "100px",
                      }}
                      onClick={handleVerifyBank}
                    >
                      Verify
                    </Button>
                  </Box> */}
                </Box>
                <Row className="mt-1">
                  <Col lg={6}>
                    <Label htmlFor="bankFileUpload" className="form-label">
                      Upload Bank Document
                    </Label>
                    <div
                      style={{ position: "relative", width: "125%" }}
                      onDrop={(e) => handleDrop(e, "bankFile")}
                      onDragOver={handleDragOver}
                    >
                      <input
                        type="file"
                        id="bankFileUpload"
                        accept=".jpeg,.jpg,.png,.pdf"
                        style={{ display: "none" }}
                        onChange={async (e) => {
                          const file = e.currentTarget.files?.[0];
                          if (file) {
                            try {
                              await handleFileUploadAsync(
                                file,
                                file.name,
                                "bankFile"
                              );
                              formik.setFieldValue("bankFile", file);
                            } catch (error) {
                              formik.setFieldError(
                                "bankFile",
                                "Failed to upload file."
                              );
                            }
                          }
                          e.target.value = "";
                        }}
                      />

                      <Button
                        type="button"
                        onClick={() =>
                          document.getElementById("bankFileUpload")?.click()
                        }
                        style={{
                          backgroundColor: "#f8f9fa",
                          color: "#333",
                          border: "1px dashed #ced4da",
                          height: "38px",
                          width: "80%",
                          borderRadius: "0.25rem",
                          fontSize: "0.9rem",
                          textAlign: "left",
                          paddingLeft: "12px",
                          paddingRight: formik.values.bankFile
                            ? "40px"
                            : "12px",
                          overflow: "hidden",
                          position: "relative",
                          display: "flex",
                          alignItems: "center",
                          cursor: "pointer",
                        }}
                      >
                        {formik.values.bankFile ? (
                          <>
                            {uploadedBankFile?.name ||
                              `bank_document_file${editData?.bankDocExtn}`}
                            <Tooltip title="Delete file" arrow>
                              <span
                                style={{
                                  position: "absolute",
                                  right: "8px",
                                  top: "50%",
                                  transform: "translateY(-50%)",
                                  cursor: "pointer",
                                  color: "#dc3545",
                                  display: "flex",
                                  alignItems: "center",
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  formik.setFieldValue("bankFile", null);
                                  setUploadedBankFile?.(null);
                                  setBankFileExtension("");
                                  setbankFileBase64(null);
                                }}
                              >
                                <CloseIcon fontSize="small" />
                              </span>
                            </Tooltip>
                          </>
                        ) : (
                          <span style={{ fontSize: "12px" }}>
                            <strong>Upload</strong> or drag and drop your{" "}
                            <strong>.jpeg, .jpg, .png, .pdf</strong> file here
                          </span>
                        )}
                      </Button>

                      {formik.errors.bankFile && (
                        <div
                          className="text-danger mt-1"
                          style={{ fontSize: "0.85rem" }}
                        >
                          {formik.errors.bankFile}
                        </div>
                      )}

                      <div className="mt-1">
                        <small
                          className="text-muted d-block"
                          style={{ fontSize: "12px" }}
                        >
                          • Only <strong>.jpeg</strong>, <strong>.png</strong>,{" "}
                          <strong>.pdf</strong> files are accepted.
                        </small>
                      </div>
                    </div>
                  </Col>
                  <Col
                    lg={6}
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {formik.values.bankFile && (
                      <Tooltip title="download file" arrow>
                        <DownloadForOfflineIcon
                          onClick={() =>
                            handlePreviewFile(
                              formik.values.bankFile,
                              "bankFile"
                            )
                          }
                          style={{
                            cursor: "pointer",
                            fontSize: "30px",
                            color: "#11395C",
                            marginTop: "14px",
                          }}
                        />
                      </Tooltip>
                    )}
                  </Col>
                </Row>
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
