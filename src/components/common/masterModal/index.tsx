import {
  Button,
  Col,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
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
  Autocomplete,
  Typography,
  Checkbox,
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

type Client = {
  clientCode: string;
  clientName: string;
};

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
  isScriptMasterContent,
  setClientDetail,
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
  isScriptMasterContent?: any;
  setClientDetail?: any;
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
  const [selectedFileB64, setSelectedFileB64] = useState<string | null>(null);
  const [clientList, setClientList] = useState<
    { clientCode: string; clientName: string }[]
  >([]);
  const [scripMasterData, setScripMasterData] = useState<
    { rowId: number; isin: string; scripName: string }[]
  >([]);
  const [inputValue, setInputValue] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingCustomValue, setPendingCustomValue] = useState<string>("");
  const [isOptionSelected, setIsOptionSelected] = useState(false);
  // const [clientDetail, setClientDetail] = useState<ClientDetail | null>(null);

  // const [selectedDealSheetFileB64, setSelectedDealSheetFileB64] = useState<
  //   string | null
  // >(null);
  const [selectedFileObj, setSelectedFileObj] = useState<File | null>(null);

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
  console.log("PAN1111111", authenticationValue, user_id);
  const rmc = user_id.split("-")[1] || "";
  // formik.setFieldValue("rmc", rmc);
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
  //     nsh: Yup.number()
  //       .typeError("Number of share must be a number")
  //       .required("Number of share is required"),
  //     lcps: Yup.number()
  //       .typeError("Brokerage of share must be a number")
  //       .required("Brokerage per share is required"),
  //     sbCode: Yup.string().required("Sub-broker Code is required"),
  //     sbr: Yup.string().required("Sub-broker Rate is required"),
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
      ldc: Yup.string().required("Ledger Code is required"),
      cnm: Yup.string().required("Company Name is required"),
      em: Yup.string()
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
      em1: Yup.string()
        .transform((value) => normalizeEmailInput(value))
        .test(
          "em1",
          "One or more secondary email addresses are invalid",
          (value) => {
            if (!value) return true; // Skip validation if empty
            const emails = value.split(";");
            return emails.every((email) => isValidEmail(email));
          }
        ),

      em2: Yup.string()
        .transform((value) => normalizeEmailInput(value))
        .test(
          "em2",
          "One or more alternate email addresses are invalid",
          (value) => {
            if (!value) return true; // Skip validation if empty
            const emails = value.split(";");
            return emails.every((email) => isValidEmail(email));
          }
        ),
      sac: Yup.string().required("SAC Number is required"),
      ste: Yup.string().required("State is required"),
      gst: Yup.string().required("GST Number is required"),
      gsc: Yup.string().required("GST State Code is required"),
      pan: Yup.string().required("PAN is required"),
      ad1: Yup.string().required("Address is required"),
      // mobileNo: Yup.string().required("Mobile Number is required"),
    });

  const getUnlistedScripMasterSchema = () =>
    Yup.object().shape({
      scriptName: Yup.string().required("scriptName is required"),
      isin: Yup.string().required("ISIN is required"),
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
    } else if (isScriptMasterContent) {
      return getUnlistedScripMasterSchema();
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
        ldc: "",
        cnm: "",
        em: "",
        em1: "",
        em2: "",
        sac: "",
        ste: "",
        gst: "",
        gsc: "",
        pan: "",
        ad1: "",
        ad2: "",
        ad3: "",
        mob: "",
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
    : isScriptMasterContent
    ? {
        scriptName: "",
        isin: "",
        isActive: false,
      }
    : {
        tdt: null as string | null,
        cn: null as Client | string | null,
        cc: null as Client | string | null,
        isin: "",
        nsec: "",
        nsh: null,
        crt: null,
        vrt: null,
        lcps: null,
        big: null, //Brok inclusive GST
        gst: null,
        beg: null,
        sbc: null,
        sbr: null,
        sbcm: null,
        nbg: null,
        rmc: rmc,
        unlistedClientCode: "",
        scriptName: "",
        paymentMode: "",
        issueDate: null as string | null,
        referenceNumber: "",
        bankAccountNumber: "",
        bankName: "",
        clientCode: "",
        clientName: "",
        dpName: "",
        dpid: "",
        ifscCode: "",
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
            transactionDate: values.tdt,
            clientName: values.cn,
            securitiesName: values.nsec,
          };
          console.log(unlistedPayload);
          fetchUnlistedContent(setTouched, values);
          return;
        } else if (isVendorMasterContent) {
          fetchVendorMastertContent(setTouched, values);
          return;
        } else if (isThirdPartyMaster) {
          const thirdPartyPayload = {
            ldc: values.ldc,
            cnm: values.cnm,
            // emailId: values.emailId,
            // em1: values.em1,
            // em2: values.em2,
            em: cleanEmails(values.em),
            em1: cleanEmails(values.em1),
            em2: cleanEmails(values.em2),
            sac: values.sac,
            ste: values.ste,
            gst: values.gst,
            gsc: values.gsc,
            pan: values.pan,
            ad1: values.ad1,
            ad2: values.ad2,
            ad3: values.ad3,
            mob: values.mob,
          };
          console.log(thirdPartyPayload, "thirdPartyPayload");

          fetchSubmissionValues(thirdPartyPayload); // <- You need to define this function
          return;
        } else if (isScriptMasterContent) {
          fetchScripMasterContent(setTouched, values);
          return;
        }
      } catch (error) {
        console.error("Submission Error", error);
      }
    },
  });

  const fetchScripMasterContent = async (setTouched: any, values: any) => {
    console.log("testArgs", setTouched, values);
    setTouched({ scriptName: true, isin: true, isActive: true });
    onSubmit?.(values);
    formik.resetForm();
  };

  useEffect(() => {
    if (editData?.dealSheetB64) {
      const base64Data = editData.dealSheetB64;
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length)
        .fill(null)
        .map((_, i) => byteCharacters.charCodeAt(i));
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });

      const fileName = `Deal_Sheet_${dayjs().format("YYYY-MM-DD")}.pdf`;
      const file = new File([blob], fileName, { type: "application/pdf" });

      setSelectedFileObj(file);
      setSelectedFileB64(`data:application/pdf;base64,${base64Data}`);
    }
  }, [editData]);

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

  const convertFileToBase64WithPrefix = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file); // Keeps full "data:application/pdf;base64,..." prefix
      reader.onload = () => resolve(reader.result?.toString() || "");
      reader.onerror = (error) => reject(error);
    });
  };

  const fetchUnlistedContent = async (setTouched: any, values: any) => {
    console.log("unlistedValuess", values);

    setTouched({
      tdt: true,
      cn: true,
      nsec: true,
      nsh: true,
      lcps: true,
      sbc: true,
      sbr: true,
    });

    if (!selectedFileB64 || selectedFileB64.trim() === "") {
      ShowToast("error", "Please upload a PDF document before submitting.");
      return; // stop execution
    }
    console.log("EditClick", values);

    onSubmit?.(values, selectedFileB64);

    formik.resetForm();
    // formik.setFieldValue("cn", "");
    setClientDetail(null);
    // if (editData && Object.keys(editData).length > 0) return;
    // setClientDetail(null);
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
          dateOfCommunication: editData.dt
            ? dayjs(editData.dt).format("YYYY/MM/DD") // Convert to string
            : "",
          TypeOfDepartment: editData.dept || "",
          SubjectType: editData.sub || "",
          LkpComments: editData.cmt || "",
          uploadProof: editData.cfp || "",
        });
      }
      if (isMarketingMaterial) {
        formik.setValues({
          fileUpload: editData.docs || "",
          description: editData.desc || "",
          image: editData.imgs || "",
        });
      }
      if (isThirdPartyMaster) {
        formik.setValues({
          ldc: editData.ldc || "",
          cnm: editData.cnm || "",
          em: editData.em || "",
          em1: editData.em1 || "",
          em2: editData.em2 || "",
          sac: editData.sac || "",
          ste: editData.ste || "",
          gst: editData.gst || "",
          gsc: editData.gsc || "",
          pan: editData.pan || "",
          ad1: editData.ad1 || "",
          ad2: editData.ad2 || "",
          ad3: editData.ad3 || "",
          mob: editData.mob || "",
        });
      }
      if (isUnlistedContent) {
        formik.setFieldValue("tdt", editData?.tdt || null);
        formik.setFieldValue("cn", editData?.cn || null);
        formik.setFieldValue("cc", editData?.cc || null);
        formik.setFieldValue("nsec", editData?.nsec || null);
        formik.setFieldValue("isin", editData?.isin || null);
        formik.setFieldValue("nsh", editData?.nsh || null);
        formik.setFieldValue("lcps", editData?.lcps || null);
        formik.setFieldValue("big", editData?.big || null);
        formik.setFieldValue("gst", editData?.gst || null);
        formik.setFieldValue("beg", editData?.beg || null);
        formik.setFieldValue("sbr", editData?.sbr || null);
        formik.setFieldValue("sbc", editData?.sbc || null);
        formik.setFieldValue("nbg", editData?.nbg || null);
        formik.setFieldValue("rmc", editData?.rmc || null);
        formik.setFieldValue("sbcm", editData?.sbcm || null);
        formik.setFieldValue("crt", editData?.crt || null);
        formik.setFieldValue("vrt", editData?.vrt || null);
        formik.setFieldValue("paymentMode", editData?.paym || "");
        formik.setFieldValue("referenceNumber", editData?.cqnum || "");
        //new fields

        const formattedIssueDate = editData?.isudt
          ? dayjs(editData.isudt).format("DD-MM-YYYY")
          : "";
        setClientDetail({
          clientCode: editData.cc,
          clientName: editData.cn,
          dpid: editData.dpid,
          dpName: editData.dpnm,
          bankAccountNumber: editData.accno,
          bankName: editData.bnknm,
          ifscCode: editData.ifsc,
        });
        formik.setFieldValue("bankAccountNumber", editData?.accno);
        formik.setFieldValue("bankName", editData?.bnknm);
        formik.setFieldValue("clientCode", editData?.cc);
        formik.setFieldValue("clientName", editData?.cn);
        formik.setFieldValue("dpName", editData?.dpnm);
        formik.setFieldValue("dpid", editData?.dpid);
        formik.setFieldValue("ifscCode", editData?.ifsc);
        formik.setFieldValue("issueDate", formattedIssueDate);
      }
      if (isVendorMasterContent) {
        // if (editData?.bankActNo !== "" && editData?.ifscCode !== "") {
        //   setShowBankUpload(true);
        // }

        formik.setValues({
          vendorName: editData.vnm || "",
          chequePrintName: editData.cpn || "",
          address1: editData.ad1 || "",
          address2: editData.ad2 || "",
          address3: editData.ad3 || "",
          city: editData.cty || "",
          pinCode: editData.pin || "",
          state: editData.ste || "",
          gstNo: editData.gst || editData.gstNumber || "",
          mobileNo: editData.mob || "",
          emailId: editData.em || editData.em || "",
          telephoneNo: editData.tele || "",
          faxNo: editData.fax || "",
          panNo: editData.pan || "",
          panDoc: editData.pdoc || "",
          serviceTaxNo: editData.serviceTaxNo || "",
          websiteName: editData.web || "",
          panFile: editData.panFile || null, //not getting in state so keeping it as it is
          panExtension: "",
          // tdsFlag: editData.tdsFlag ? "Yes" : "No",
          // tdsFile: editData.tdsPath || null,
          msmeFlag: editData.msmf ? "Yes" : "No",
          msmeType: editData.msmt || "",
          msmeFile: editData.msmp || null,
          ifscCode: editData.ifsc || "",
          bankAccountNo: editData.actn || "",
          bankFile: editData.bdoc || null,
          bankFileName: editData?.bankFileName, //not getting in state so keeping it as it is
          tdsFileName: editData?.tdsFileName,
          msmeFileName: editData?.msmeFileName,
          // directAppLevel: editData.directAppLevel || "",
        });
      }
      if (isScriptMasterContent) {
        formik.setFieldValue("scriptName", editData?.scpnm);
        formik.setFieldValue("isin", editData?.isin);
        formik.setFieldValue("isActive", editData?.isact);
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
          const finalFileName = `${formik.values.panNo}_${docType}.${fileExt}`;
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

  const getDownloadableFile = async () => {
    try {
      const fileExtension = editData?.pdoc
        ? `.${editData.pdoc.split(".").pop()?.toLowerCase()}`
        : "";

      const payload = {
        fileName: editData?.pdoc,
        filePath:
          "\\172.17.100.60\\d$\\WebPortal\\Intranet_New\\Files\\VendorMasterMSME",
        fileType: fileExtension,
        contentType: "",
      };
      console.log("Payloadd", payload);

      dispatch(showLoader("Loading Preview..."));

      const response = await apiServices.ComplianceDownload(payload);

      if (response?.status === 200 && response?.data) {
        const fileBlob = new Blob([response.data], {
          type: response.headers["content-type"] || "application/octet-stream",
        });

        const file = new File([fileBlob], editData?.pdoc, {
          type: response.headers["content-type"] || "application/octet-stream",
        });

        formik.setFieldValue("panFile", file);

        // Optional: trigger download directly
        const url = window.URL.createObjectURL(fileBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = editData?.pdoc || "download";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        ShowToast("info", "Error fetching file");
      }
    } catch (error: any) {
      ShowToast("info", error.message || "Download failed");
    } finally {
      dispatch(hideLoader());
    }
  };

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
      formik.setFieldValue("big", "");
      formik.setFieldValue("gst", "");
      formik.setFieldValue("beg", "");
      formik.setFieldValue("sbcm", "");
      formik.setFieldValue("nbg", "");
    };

    if (name === "crt" || name === "vrt") {
      // allow only digits and a single dot
      const decimalValue = value
        .replace(/[^0-9.]/g, "")
        .replace(/(\..*)\./g, "$1");

      formik.setFieldValue(name, decimalValue);

      const crt = parseFloat(
        name === "crt" ? decimalValue : formik.values.crt || "0"
      );
      const vrt = parseFloat(
        name === "vrt" ? decimalValue : formik.values.vrt || "0"
      );

      if (!isNaN(crt) && !isNaN(vrt)) {
        const lcps = crt - vrt;
        formik.setFieldValue("lcps", lcps.toFixed(2)); // This is LKP Commission per share
      }
    }

    // Updated logic to trigger full business rules when only nsh is changed
    else if (name === "nsh") {
      formik.setFieldValue(name, numericValue);
      formik.setFieldError(name, "");

      const nsh = parseInt(numericValue || "0");
      const lcps = parseFloat(formik.values.lcps || "0");

      if (nsh > 0 && lcps > 0) {
        const inclusiveGST = Math.floor(nsh * lcps);
        const gst = Math.floor(inclusiveGST / 1.18);
        const exclusiveGST = Math.floor(inclusiveGST - gst);

        formik.setFieldValue("big", formatIndianNumber(inclusiveGST));
        formik.setFieldValue("gst", formatIndianNumber(exclusiveGST));
        formik.setFieldValue("beg", formatIndianNumber(gst));

        // Leave it blank until sbr is provided
        const sbr = parseFloat(formik.values.sbr || "0");
        if (sbr > 0) {
          const sbValue = sbr * nsh;
          const subBrokerCommission = Math.floor(sbValue / 1.18);

          const beg = exclusiveGST;
          const nbg = Math.floor(beg - subBrokerCommission);

          formik.setFieldValue("sbcm", subBrokerCommission);
          formik.setFieldValue("nbg", formatIndianNumber(nbg));
        } else {
          formik.setFieldValue("sbcm", "");
          formik.setFieldValue("nbg", ""); // keep empty until sbr entered
        }
      } else {
        resetBrokerageFields();
      }
    } else if (name === "sbr") {
      // Allow only digits and one dot
      const decimalValue = value
        .replace(/[^0-9.]/g, "")
        .replace(/(\..*)\./g, "$1");

      formik.setFieldValue(name, decimalValue);

      const nsh = parseInt(formik.values.nsh || "0");
      const sbr = parseFloat(decimalValue);

      if (nsh > 0 && !isNaN(sbr)) {
        const subBrokerValue = sbr * nsh; //1600
        const subBrokerCommission = Math.floor(subBrokerValue / 1.18);
        console.log("sbCoMMISSION", subBrokerCommission);

        // const subBrokerCommission = Math.floor(subBrokerValue - stComm);

        const beg = Math.floor(
          parseFloat((formik.values.beg ?? "0").toString().replace(/,/g, ""))
        );

        const nbg = Math.floor(Math.abs(beg - subBrokerCommission));

        formik.setFieldValue("sbcm", formatIndianNumber(subBrokerCommission));
        formik.setFieldValue("nbg", formatIndianNumber(nbg));
      } else {
        formik.setFieldValue("sbcm", "");
        formik.setFieldValue("nbg", "");
      }
    } else if (name === "sbCode" || name === "rmc") {
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

    //  Uint8Array is NOT generic → use plain Uint8Array
    let fileBytes: Uint8Array = binaryData;

    if (isGzip) {
      fileBytes = pako.ungzip(binaryData);
    }

    // Force creation of a true ArrayBuffer (Blob/File safe)
    const arrayBuffer = new ArrayBuffer(fileBytes.byteLength);
    new Uint8Array(arrayBuffer).set(fileBytes);

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

    return new File(
      [new Uint8Array(arrayBuffer)],
      fileName || `file${extn || ""}`,
      { type: mimeType }
    );
  }

  useEffect(() => {
    if (user_id) {
      const rmc = user_id.split("-")[1] || "";
      formik.setFieldValue("rmc", rmc);
    }
  }, [user_id]);

  useEffect(() => {
    if (
      editUserCheck &&
      activeSubItem !== "Unlisted Scrip Master" &&
      activeSubItem !== "Unlisted Shares Entry"
      // activeSubItem != "Vendor Creation"
    ) {
      const fileExtension =
        editData && editData.pdoc
          ? `.${editData.pdoc.split(".").pop()?.toLowerCase()}`
          : "";
      formik.setFieldValue("panExtension", fileExtension);
      const payload = {
        fileName: editData.pdoc,
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
          console.log("Responseee", response?.data);

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
  }, [editUserCheck, editData, dispatch, activeSubItem]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target;
    const file = fileInput.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    const mimeType = file.type;

    if (fileExtension !== "pdf" || mimeType !== "application/pdf") {
      ShowToast("error", "Please upload PDF file only.");
      fileInput.value = "";
      setSelectedFileB64(null);
      setSelectedFileObj(null);
      return;
    }

    try {
      const base64 = await convertFileToBase64WithPrefix(file);
      setSelectedFileB64(base64);
      setSelectedFileObj(file);
    } catch (error) {
      console.error("File conversion error:", error);
      ShowToast("error", "Failed to process the PDF file.");
      fileInput.value = "";
      setSelectedFileB64(null);
      setSelectedFileObj(null);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFileObj(null);
    setSelectedFileB64(null);
  };

  // const isClientInList = (value: string) => {
  //   return clientList.some(
  //     (client) => client.clientName.toLowerCase() === value.toLowerCase()
  //   );
  // };

  const fetchClientDetails = async (clientCode: string) => {
    try {
      dispatch(showLoader(""));

      const payload = {
        ClientCode: clientCode,
      };

      const res = await apiServices.UnlistedSharesClientDetail(payload);

      if (res?.status === 200) {
        const data = res?.data?.data;
        console.log("clientDetailsData", data);

        setClientDetail(data);
        formik.setFieldValue("bankAccountNumber", data?.bankAccountNumber);
        formik.setFieldValue("bankName", data?.bankName);
        formik.setFieldValue("clientCode", data?.clientCode);
        formik.setFieldValue("clientName", data?.clientName);
        formik.setFieldValue("dpName", data?.dpName);
        formik.setFieldValue("dpid", data?.dpid);
        formik.setFieldValue("ifscCode", data?.ifscCode);
      }
    } catch (error) {
      console.log("Detail API Error:", error);
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    if (!isUnlistedContent || inputValue.trim().length < 2) {
      setClientList([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        dispatch(showLoader(""));

        const res = await apiServices.UnlistedSharesClientSearch({
          searchKey: inputValue.trim(),
        });

        if (res?.status === 200) {
          setClientList(res?.data?.data ?? []);
        }
      } catch (error) {
        console.error("Client search error:", error);
      } finally {
        dispatch(hideLoader());
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [inputValue, isUnlistedContent]);

  useEffect(() => {
    if (!isUnlistedContent) return;

    const fetchScripMaster = async () => {
      try {
        dispatch(showLoader(""));

        const res = await apiServices.UnlistedScripMasterDropdown({
          user_id,
        });

        if (res?.status === 200) {
          const formattedData = (res?.data?.data ?? []).map((item: any) => ({
            rowId: item.rid,
            isin: item.isin,
            scripName: item.scpnm,
          }));

          setScripMasterData(formattedData);
        }
      } catch (error) {
        console.error("Scrip master error:", error);
      } finally {
        dispatch(hideLoader());
      }
    };

    fetchScripMaster();
  }, [isUnlistedContent, user_id]);

  useEffect(() => {
    if (!editData) return;

    const { cc, cn } = editData;

    formik.setFieldValue("cc", cc);
    formik.setFieldValue("cn", cn);

    setClientList((prev) => {
      const exists = prev.some((client) => client.clientCode === cc);

      if (exists) return prev;

      return [
        ...prev,
        {
          clientCode: cc,
          clientName: cn,
        },
      ];
    });
  }, [editData]);

  useEffect(() => {
    if (modal_grid && isUnlistedContent && !editData) {
      // Add mode → clear
      setInputValue("");
      setClientDetail(null);

      formik.setFieldValue("cc", "");
      formik.setFieldValue("cn", "");
    }
  }, [modal_grid, editData, isUnlistedContent]);

  return (
    <>
      <Modal isOpen={showConfirmModal} centered>
        {/* <ModalHeader>Confirmation!</ModalHeader> */}
        <ModalBody style={{ fontSize: "15px" }}>
          Would you like to continue with this Client name/Client Code?
        </ModalBody>
        <ModalFooter>
          <Button
            style={{
              backgroundColor: "#11395C",
              fontSize: "11px",
              minHeight: "30px",
              width: "60px",
            }}
            onClick={() => {
              formik.setFieldValue("cn", pendingCustomValue);
              setShowConfirmModal(false);
            }}
          >
            Yes
          </Button>
          <Button
            style={{
              backgroundColor: "#11395C",
              fontSize: "11px",
              minHeight: "30px",
              width: "60px",
            }}
            onClick={() => {
              formik.setFieldValue("cn", null);
              setInputValue("");
              setPendingCustomValue("");
              setShowConfirmModal(false);
            }}
          >
            No
          </Button>
        </ModalFooter>
      </Modal>

      <Modal
        style={{
          fontFamily: "Public Sans",
          maxWidth: isUnlistedContent || isThirdPartyMaster ? "700px" : "900px",
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
                      <label
                        style={{ fontSize: "12px" }}
                        className="form-label"
                      >
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
                  <Box
                    sx={{
                      border: "1px solid #e5e7eb",
                      borderRadius: 3,
                      p: 2,
                      mb: 1,
                      backgroundColor: "#ffffff",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.18)",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 600,
                        mb: 2,
                        fontSize: "15px",
                        color: "#1f2937",
                      }}
                    >
                      Transaction Details
                    </Typography>

                    <Row className="g-3">
                      {/* RM Code */}
                      <Col lg={6}>
                        {" "}
                        <TextField
                          fullWidth
                          id="rmc"
                          name="rmc"
                          label="Enter RM Code"
                          variant="outlined"
                          size="small"
                          disabled={true}
                          value={formik.values.rmc}
                          onChange={handleCustomChange}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.rmc && Boolean(formik.errors.rmc)
                          }
                          sx={{
                            "& .MuiInputBase-root": {
                              height: 30,
                            },
                            "& .MuiInputLabel-root": {
                              transform: "translate(14px, 6px) scale(1)",
                            },
                            "& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-root.MuiFormLabel-filled":
                              {
                                transform: "translate(14px, -10px) scale(0.75)",
                              },
                          }}
                        />{" "}
                      </Col>

                      {/* Date */}
                      <Col lg={6}>
                        <FormControl fullWidth>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              format="DD/MM/YYYY"
                              value={
                                formik.values.tdt
                                  ? dayjs(formik.values.tdt, "DD/MM/YYYY")
                                  : null
                              }
                              maxDate={dayjs()}
                              minDate={dayjs().subtract(64, "year")}
                              onChange={(date: Dayjs | null) =>
                                formik.setFieldValue(
                                  "tdt",
                                  date ? date.format("DD-MM-YYYY") : ""
                                )
                              }
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                  size: "small",
                                  sx: {
                                    "& .MuiInputBase-root": {
                                      height: 30,
                                      fontSize: "14px",
                                    },
                                    "& .MuiInputLabel-root": {
                                      transform:
                                        "translate(14px, 6px) scale(1)",
                                    },
                                    "& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-root.MuiFormLabel-filled":
                                      {
                                        transform:
                                          "translate(14px, -10px) scale(0.75)",
                                      },
                                  },

                                  error: Boolean(
                                    formik.touched.tdt && formik.errors.tdt
                                  ),
                                  helperText:
                                    formik.touched.tdt && formik.errors.tdt,
                                },
                              }}
                            />
                          </LocalizationProvider>
                        </FormControl>
                      </Col>

                      {/* Client */}
                      <Col lg={6}>
                        {" "}
                        <Col lg={12}>
                          {/* <Autocomplete<Client, false, false, true>
                            freeSolo
                            options={clientList}
                            value={
                              clientList.find(
                                (client) =>
                                  client.clientCode === formik.values.cc
                              ) || null
                            }
                            inputValue={inputValue}
                            onInputChange={(event, newInputValue) => {
                              console.log(event);
                              const cleanedValue = newInputValue.replace(
                                /[^a-zA-Z0-9 ]/g,
                                ""
                              );
                              setInputValue(cleanedValue);
                              formik.setFieldValue("cn", cleanedValue);
                              setIsOptionSelected(false);
                            }}
                            onChange={(event, value) => {
                              console.log(event);
                              if (!value) {
                                setClientDetail(null);
                              }

                              formik.setFieldValue("cn", value);

                              if (value && typeof value !== "string") {
                                setIsOptionSelected(true);
                                fetchClientDetails(value.clientCode);
                                formik.setFieldValue(
                                  "unlistedClientCode",
                                  value.clientCode
                                );
                              }
                            }}
                            onClose={(event, reason) => {
                              if (reason === "blur") {
                                console.log(event);

                                const value = formik.values.cn;

                                // Open modal ONLY if:
                                // 1. Not selected from dropdown
                                // 2. Value is string
                                if (
                                  !isOptionSelected &&
                                  typeof value === "string" &&
                                  value.trim() !== ""
                                ) {
                                  const exists = clientList.some(
                                    (client) =>
                                      client.clientName.toLowerCase() ===
                                      value.toLowerCase()
                                  );

                                  if (!exists) {
                                    setPendingCustomValue(value);
                                    setShowConfirmModal(true);
                                  }
                                }
                              }
                            }}
                            getOptionLabel={(option) => {
                              if (typeof option === "string") return option;
                              return `${option.clientName} (${option.clientCode})`;
                            }}
                            isOptionEqualToValue={(option, value) =>
                              typeof value !== "string" &&
                              option.clientCode === value.clientCode
                            }
                            filterOptions={(x) => x}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Enter Client Name"
                                size="small"
                                sx={{
                                  "& .MuiInputBase-root": {
                                    height: 30,
                                    fontSize: "14px",
                                  },

                                  // "& .MuiInputBase-input": {
                                  //   padding: "14px 8px",
                                  // },

                                  "& .MuiInputLabel-root": {
                                    fontSize: "12px",
                                    transform: "translate(14px, 6px) scale(1)",
                                  },

                                  "& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-root.MuiFormLabel-filled":
                                    {
                                      transform:
                                        "translate(14px, -8px) scale(0.75)",
                                    },
                                }}
                              />
                            )}
                          /> */}

                          <Autocomplete<Client, false, false, true>
                            freeSolo
                            options={clientList}
                            value={
                              clientList.find(
                                (client) =>
                                  client.clientCode === formik.values.cc
                              ) || null
                            }
                            inputValue={inputValue}
                            onInputChange={(event, newInputValue) => {
                              console.log(
                                "newInputValue",
                                event,
                                newInputValue
                              );

                              const cleanedValue = newInputValue.replace(
                                /[^a-zA-Z0-9 ]/g,
                                ""
                              );
                              setInputValue(cleanedValue);
                              console.log("CleanedValue", cleanedValue);

                              formik.setFieldValue("cn", cleanedValue);
                              setIsOptionSelected(false);
                            }}
                            onChange={(event, value) => {
                              console.log(event, value);

                              if (!value) {
                                setClientDetail(null);
                                formik.setFieldValue("cc", "");
                                formik.setFieldValue("cn", "");
                                return;
                              }

                              if (typeof value !== "string") {
                                setIsOptionSelected(true);

                                formik.setFieldValue("cc", value.clientCode);
                                formik.setFieldValue("cn", value.clientName);

                                fetchClientDetails(value.clientCode);
                              }
                            }}
                            onClose={(event, reason) => {
                              if (reason === "blur") {
                                console.log(event);

                                const value = formik.values.cn;

                                // Open modal ONLY if:
                                // 1. Not selected from dropdown
                                // 2. Value is string
                                if (
                                  !isOptionSelected &&
                                  typeof value === "string" &&
                                  value.trim() !== ""
                                ) {
                                  const exists = clientList.some(
                                    (client) =>
                                      client.clientName.toLowerCase() ===
                                      value.toLowerCase()
                                  );

                                  if (!exists) {
                                    setPendingCustomValue(value);
                                    setShowConfirmModal(true);
                                  }
                                }
                              }
                            }}
                            getOptionLabel={(option) =>
                              typeof option === "string"
                                ? option
                                : `${option.clientName} (${option.clientCode})`
                            }
                            isOptionEqualToValue={(option, value) =>
                              option.clientCode === value.clientCode
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Enter Client Name"
                                size="small"
                                sx={{
                                  "& .MuiInputBase-root": {
                                    height: 30,
                                    fontSize: "12px",
                                  },

                                  // "& .MuiInputBase-input": {
                                  //   padding: "14px 8px",
                                  // },

                                  "& .MuiInputLabel-root": {
                                    fontSize: "12px",
                                    transform: "translate(14px, 6px) scale(1)",
                                  },

                                  "& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-root.MuiFormLabel-filled":
                                    {
                                      transform:
                                        "translate(14px, -8px) scale(0.75)",
                                    },
                                }}
                              />
                            )}
                          />
                        </Col>
                      </Col>

                      {/* Security */}
                      {/* <Col lg={6}>
                        {" "}
                        <TextField
                          fullWidth
                          id="nsec"
                          name="nsec"
                          label="Enter Securities Name"
                          variant="outlined"
                          size="small"
                          value={formik.values.nsec}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.nsec && Boolean(formik.errors.nsec)
                          }
                          helperText={formik.touched.nsec && formik.errors.nsec}
                          sx={{
                            "& .MuiInputBase-root": {
                              height: 30,
                            },

                            "& .MuiInputLabel-root": {
                              transform: "translate(14px, 6px) scale(1)",
                            },
                            "& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-root.MuiFormLabel-filled":
                              {
                                transform: "translate(14px, -10px) scale(0.75)",
                              },
                          }}
                        />
                      </Col> */}
                      <Col lg={6}>
                        {/* <Autocomplete
                          options={scripMasterData}
                          value={
                            scripMasterData.find(
                              (item) => item.scripName === formik.values.nsec
                            ) || null
                          }
                          onChange={(event, value) => {
                            formik.setFieldValue(
                              "nsec",
                              value?.scripName || ""
                            );
                            formik.setFieldValue("isin", value?.isin);
                          }}
                          getOptionLabel={(option) =>
                            `${option.scripName} (${option.isin})`
                          }
                          isOptionEqualToValue={(option, value) =>
                            option.rowId === value.rowId
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Select Securities Name"
                              size="small"
                              error={
                                formik.touched.nsec &&
                                Boolean(formik.errors.nsec)
                              }
                              helperText={
                                formik.touched.nsec && formik.errors.nsec
                              }
                              sx={{
                                "& .MuiInputBase-root": {
                                  height: 30,
                                  fontSize: "13px",
                                },
                                "& .MuiInputLabel-root": {
                                  fontSize: "12px",
                                  transform: "translate(14px, 6px) scale(1)",
                                },
                                "& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-root.MuiFormLabel-filled":
                                  {
                                    transform:
                                      "translate(14px, -8px) scale(0.75)",
                                  },
                              }}
                            />
                          )}
                        /> */}
                        <Autocomplete
                          options={scripMasterData}
                          value={
                            scripMasterData.find(
                              (item) => item.isin === formik.values.isin
                            ) || null
                          }
                          onChange={(event, value) => {
                            console.log(event);

                            formik.setFieldValue(
                              "nsec",
                              value?.scripName || ""
                            );
                            formik.setFieldValue("isin", value?.isin || "");
                          }}
                          getOptionLabel={(option) =>
                            `${option.scripName} (${option.isin})`
                          }
                          isOptionEqualToValue={(option, value) =>
                            option.isin === value.isin
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Select Securities Name"
                              size="small"
                              error={
                                formik.touched.nsec &&
                                Boolean(formik.errors.nsec)
                              }
                              helperText={
                                formik.touched.nsec && formik.errors.nsec
                              }
                              sx={{
                                "& .MuiInputBase-root": {
                                  height: 30,
                                  fontSize: "12px",
                                },
                                "& .MuiInputLabel-root": {
                                  fontSize: "12px",
                                  transform: "translate(14px, 6px) scale(1)",
                                },
                                "& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-root.MuiFormLabel-filled":
                                  {
                                    transform:
                                      "translate(14px, -8px) scale(0.75)",
                                  },
                              }}
                            />
                          )}
                        />
                      </Col>
                    </Row>
                  </Box>
                  {/* {shouldShowBankSection && ( */}
                  <Box
                    sx={{
                      border: "1px solid #e5e7eb",
                      borderRadius: 3,
                      p: 2,
                      mb: 1,
                      backgroundColor: "#ffffff",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.18)",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 600,
                        mb: 2,
                        fontSize: "15px",
                        color: "#1f2937",
                      }}
                    >
                      Client DP Details
                    </Typography>

                    <Row className="g-3">
                      <Col lg={6}>
                        <TextField
                          fullWidth
                          label="DP Name"
                          size="small"
                          name="dpName"
                          value={formik.values.dpName}
                          onChange={(e) => {
                            const cleaned = e.target.value.replace(
                              /[^a-zA-Z0-9 ]/g,
                              ""
                            );
                            formik.setFieldValue(
                              "dpName",
                              cleaned.toUpperCase()
                            );
                          }}
                          onBlur={formik.handleBlur}
                          sx={{
                            "& .MuiInputBase-root": {
                              height: 30,
                            },
                            "& .MuiInputLabel-root": {
                              transform: "translate(14px, 6px) scale(1)",
                            },
                            "& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-root.MuiFormLabel-filled":
                              {
                                transform: "translate(14px, -10px) scale(0.75)",
                              },
                          }}
                        />
                      </Col>
                      <Col lg={6}>
                        {" "}
                        <TextField
                          fullWidth
                          label="DP ID"
                          size="small"
                          name="dpid"
                          value={formik.values.dpid}
                          onChange={(e) => {
                            const cleaned = e.target.value.replace(
                              /[^0-9]/g,
                              ""
                            );
                            formik.setFieldValue("dpid", cleaned);
                          }}
                          onBlur={formik.handleBlur}
                          inputProps={{
                            inputMode: "numeric",
                            pattern: "[0-9]*",
                          }}
                          sx={{
                            "& .MuiInputBase-root": {
                              height: 30,
                            },
                            "& .MuiInputLabel-root": {
                              transform: "translate(14px, 6px) scale(1)",
                            },
                            "& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-root.MuiFormLabel-filled":
                              {
                                transform: "translate(14px, -10px) scale(0.75)",
                              },
                          }}
                        />
                      </Col>
                    </Row>
                  </Box>
                  {/* )} */}
                  {/* {shouldShowBankSection && ( */}
                  <Box
                    sx={{
                      border: "1px solid #e5e7eb",
                      borderRadius: 3,
                      p: 2,
                      mb: 1,
                      backgroundColor: "#ffffff",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.18)",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 600,
                        mb: 2,
                        fontSize: "15px",
                        color: "#1f2937",
                      }}
                    >
                      Client Bank Details
                    </Typography>

                    <Row className="g-3">
                      <Col lg={6}>
                        {" "}
                        <TextField
                          fullWidth
                          label="Bank Account Number"
                          size="small"
                          name="bankAccountNumber"
                          value={formik.values.bankAccountNumber}
                          onChange={(e) => {
                            const cleaned = e.target.value.replace(
                              /[^0-9]/g,
                              ""
                            );
                            formik.setFieldValue("bankAccountNumber", cleaned);
                          }}
                          onBlur={formik.handleBlur}
                          inputProps={{
                            inputMode: "numeric",
                            pattern: "[0-9]*",
                            maxLength: 18,
                          }}
                          error={
                            formik.touched.bankAccountNumber &&
                            Boolean(formik.errors.bankAccountNumber)
                          }
                          helperText={
                            formik.touched.bankAccountNumber &&
                            formik.errors.bankAccountNumber
                          }
                          sx={{
                            "& .MuiInputBase-root": { height: 30 },
                            "& .MuiInputLabel-root": {
                              transform: "translate(14px, 6px) scale(1)",
                            },
                            "& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-root.MuiFormLabel-filled":
                              {
                                transform: "translate(14px, -10px) scale(0.75)",
                              },
                          }}
                        />
                      </Col>
                      <Col lg={6}>
                        {" "}
                        <TextField
                          fullWidth
                          label="Bank Name"
                          size="small"
                          name="bankName"
                          value={formik.values.bankName}
                          onChange={(e) => {
                            const cleaned = e.target.value.replace(
                              /[^a-zA-Z ]/g,
                              ""
                            );
                            formik.setFieldValue("bankName", cleaned);
                          }}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.bankName &&
                            Boolean(formik.errors.bankName)
                          }
                          helperText={
                            formik.touched.bankName && formik.errors.bankName
                          }
                          sx={{
                            "& .MuiInputBase-root": {
                              height: 30,
                            },

                            "& .MuiInputLabel-root": {
                              transform: "translate(14px, 6px) scale(1)",
                            },
                            "& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-root.MuiFormLabel-filled":
                              {
                                transform: "translate(14px, -10px) scale(0.75)",
                              },
                          }}
                        />
                      </Col>
                      <Col lg={6}>
                        {" "}
                        <TextField
                          fullWidth
                          label="IFSC Code"
                          size="small"
                          name="ifscCode"
                          value={formik.values.ifscCode}
                          onChange={(e) => {
                            const upper = e.target.value.toUpperCase();
                            const cleaned = upper.replace(/[^A-Z0-9]/g, "");
                            formik.setFieldValue("ifscCode", cleaned);
                          }}
                          onBlur={formik.handleBlur}
                          inputProps={{
                            maxLength: 11,
                          }}
                          error={
                            formik.touched.ifscCode &&
                            Boolean(formik.errors.ifscCode)
                          }
                          helperText={
                            formik.touched.ifscCode && formik.errors.ifscCode
                          }
                          sx={{
                            "& .MuiInputBase-root": { height: 30 },
                            "& .MuiInputLabel-root": {
                              transform: "translate(14px, 6px) scale(1)",
                            },
                            "& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-root.MuiFormLabel-filled":
                              {
                                transform: "translate(14px, -10px) scale(0.75)",
                              },
                          }}
                        />
                      </Col>
                      <Col lg={6}>
                        {" "}
                        <TextField
                          select
                          fullWidth
                          label="Payment Mode"
                          size="small"
                          name="paymentMode"
                          value={formik.values.paymentMode}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.paymentMode &&
                            Boolean(formik.errors.paymentMode)
                          }
                          helperText={
                            formik.touched.paymentMode &&
                            formik.errors.paymentMode
                          }
                          sx={{
                            "& .MuiInputBase-root": {
                              height: 30,
                              fontSize: "12px",
                            },

                            "& .MuiInputLabel-root": {
                              fontSize: "12px",
                              transform: "translate(14px, 6px) scale(1)",
                            },

                            "& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-root.MuiFormLabel-filled":
                              {
                                transform: "translate(14px, -8px) scale(0.75)",
                              },
                          }}
                        >
                          <MenuItem value="NEFT">NEFT</MenuItem>
                          <MenuItem value="CHEQUE">CHEQUE</MenuItem>
                          <MenuItem value="RTGS">RTGS</MenuItem>
                          <MenuItem value="UPI">UPI</MenuItem>
                        </TextField>
                      </Col>
                      <Col lg={6}>
                        {" "}
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            format="DD/MM/YYYY"
                            label="Date of Issue"
                            value={
                              formik.values.issueDate
                                ? dayjs(formik.values.issueDate, "DD/MM/YYYY")
                                : null
                            }
                            // onChange={(newValue) => {
                            //   formik.setFieldValue("issueDate", newValue);
                            // }}
                            onChange={(date: Dayjs | null) =>
                              formik.setFieldValue(
                                "issueDate",
                                date ? date.format("DD-MM-YYYY") : ""
                              )
                            }
                            // maxDate={dayjs()} //    Restricts future dates
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                size: "small",
                                sx: {
                                  "& .MuiInputBase-root": {
                                    height: 30,
                                    fontSize: "15px",
                                  },
                                  "& .MuiInputLabel-root": {
                                    transform: "translate(14px, 6px) scale(1)",
                                  },
                                  "& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-root.MuiFormLabel-filled":
                                    {
                                      transform:
                                        "translate(14px, -10px) scale(0.75)",
                                    },
                                },

                                error:
                                  formik.touched.issueDate &&
                                  Boolean(formik.errors.issueDate),
                                helperText:
                                  formik.touched.issueDate &&
                                  formik.errors.issueDate,
                              },
                            }}
                          />
                        </LocalizationProvider>
                      </Col>
                      <Col lg={6}>
                        {" "}
                        <TextField
                          fullWidth
                          label="Cheque / Reference Number"
                          size="small"
                          name="referenceNumber"
                          value={formik.values.referenceNumber}
                          onChange={(e) => {
                            const cleaned = e.target.value.replace(
                              /[^a-zA-Z0-9]/g,
                              ""
                            );
                            formik.setFieldValue("referenceNumber", cleaned);
                          }}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.referenceNumber &&
                            Boolean(formik.errors.referenceNumber)
                          }
                          helperText={
                            formik.touched.referenceNumber &&
                            formik.errors.referenceNumber
                          }
                          sx={{
                            "& .MuiInputBase-root": {
                              height: 30,
                            },

                            "& .MuiInputLabel-root": {
                              transform: "translate(14px, 6px) scale(1)",
                            },
                            "& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-root.MuiFormLabel-filled":
                              {
                                transform: "translate(14px, -10px) scale(0.75)",
                              },
                          }}
                        />
                      </Col>
                    </Row>
                  </Box>
                  {/* )} */}
                  <Box
                    sx={{
                      border: "1px solid #e5e7eb",
                      borderRadius: 3,
                      p: 2,
                      mb: 1,
                      backgroundColor: "#ffffff",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.18)",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 600,
                        mb: 2,
                        fontSize: "15px",
                        color: "#1f2937",
                      }}
                    >
                      Transaction Calculations
                    </Typography>

                    <Row className="g-3">
                      {/* All rate & brokerage fields here */}
                      <Col lg={6}>
                        <TextField
                          fullWidth
                          id="crt"
                          name="crt"
                          // type="number"
                          label="Enter Client Rate"
                          variant="outlined"
                          size="small"
                          inputProps={{
                            inputMode: "decimal",
                            pattern: "^[0-9]*\\.?[0-9]+$",
                          }}
                          value={formik.values.crt}
                          onChange={handleCustomChange}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.crt && Boolean(formik.errors.crt)
                          }
                          helperText={formik.touched.crt && formik.errors.crt}
                          sx={{
                            "& .MuiInputBase-root": {
                              height: 30,
                            },

                            "& .MuiInputLabel-root": {
                              transform: "translate(14px, 6px) scale(1)",
                            },
                            "& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-root.MuiFormLabel-filled":
                              {
                                transform: "translate(14px, -10px) scale(0.75)",
                              },
                          }}
                        />
                      </Col>
                      <Col lg={6}>
                        <TextField
                          fullWidth
                          id="vrt"
                          name="vrt"
                          // type="number"
                          label="Enter Vendor Rate"
                          variant="outlined"
                          size="small"
                          inputProps={{
                            inputMode: "decimal",
                            pattern: "^[0-9]*\\.?[0-9]+$",
                          }}
                          value={formik.values.vrt}
                          onChange={handleCustomChange}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.vrt && Boolean(formik.errors.vrt)
                          }
                          helperText={formik.touched.vrt && formik.errors.vrt}
                          sx={{
                            "& .MuiInputBase-root": {
                              height: 30,
                            },

                            "& .MuiInputLabel-root": {
                              transform: "translate(14px, 6px) scale(1)",
                            },
                            "& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-root.MuiFormLabel-filled":
                              {
                                transform: "translate(14px, -10px) scale(0.75)",
                              },
                          }}
                        />
                      </Col>
                      <Col lg={6}>
                        <TextField
                          fullWidth
                          id="nsh"
                          name="nsh"
                          // type="number"
                          label="Enter Number of share"
                          variant="outlined"
                          size="small"
                          inputProps={{
                            inputMode: "numeric",
                            pattern: "[0-9]*",
                          }}
                          value={formik.values.nsh}
                          onChange={handleCustomChange}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.nsh && Boolean(formik.errors.nsh)
                          }
                          helperText={formik.touched.nsh && formik.errors.nsh}
                          sx={{
                            "& .MuiInputBase-root": {
                              height: 30,
                            },

                            "& .MuiInputLabel-root": {
                              transform: "translate(14px, 6px) scale(1)",
                            },
                            "& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-root.MuiFormLabel-filled":
                              {
                                transform: "translate(14px, -10px) scale(0.75)",
                              },
                          }}
                        />
                      </Col>
                      <Col lg={6}>
                        <TextField
                          fullWidth
                          id="lcps"
                          name="lcps"
                          // type="number"
                          // label="LKP Commission per share"
                          variant="outlined"
                          disabled={true}
                          size="small"
                          inputProps={{
                            inputMode: "numeric",
                            pattern: "[0-9]*",
                          }}
                          // value={formik.values.lcps}
                          value={`${
                            formik.values.lcps || "0"
                          }  /- LKP Commission per share`}
                          onChange={handleCustomChange}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.lcps && Boolean(formik.errors.lcps)
                          }
                          helperText={formik.touched.lcps && formik.errors.lcps}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              backgroundColor: "#e5e7eb",
                            },
                            "& .MuiInputBase-root": {
                              height: 30,
                            },

                            "& .MuiInputLabel-root": {
                              transform: "translate(14px, 6px) scale(1)",
                            },
                            "& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-root.MuiFormLabel-filled":
                              {
                                transform: "translate(14px, -10px) scale(0.75)",
                              },
                          }}
                        />
                      </Col>
                      <Col lg={6}>
                        <TextField
                          fullWidth
                          id="big"
                          name="big"
                          disabled={true}
                          // label="Brokerage Inclusive GST"
                          variant="outlined"
                          size="small"
                          inputProps={{
                            inputMode: "numeric",
                            pattern: "[0-9]*",
                          }}
                          value={`${
                            formik.values.big || "0"
                          }  /- Brokerage Inclusive GST`}
                          InputProps={{
                            readOnly: true,
                          }}
                          onChange={handleCustomChange}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.big && Boolean(formik.errors.big)
                          }
                          helperText={formik.touched.big && formik.errors.big}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              backgroundColor: "#e5e7eb",
                            },
                            "& .MuiInputBase-root": {
                              height: 30,
                            },

                            "& .MuiInputLabel-root": {
                              transform: "translate(14px, 6px) scale(1)",
                            },
                            "& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-root.MuiFormLabel-filled":
                              {
                                transform: "translate(14px, -10px) scale(0.75)",
                              },
                          }}
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
                          inputProps={{
                            inputMode: "numeric",
                            pattern: "[0-9]*",
                          }}
                          value={`${formik.values.gst || "0"}  /- Total GST`}
                          InputProps={{
                            readOnly: true,
                          }}
                          onChange={handleCustomChange}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.gst && Boolean(formik.errors.gst)
                          }
                          helperText={formik.touched.gst && formik.errors.gst}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              backgroundColor: "#e5e7eb",
                            },
                            "& .MuiInputBase-root": {
                              height: 30,
                            },

                            "& .MuiInputLabel-root": {
                              transform: "translate(14px, 6px) scale(1)",
                            },
                            "& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-root.MuiFormLabel-filled":
                              {
                                transform: "translate(14px, -10px) scale(0.75)",
                              },
                          }}
                        />
                      </Col>
                      <Col lg={6}>
                        <TextField
                          fullWidth
                          id="beg"
                          name="beg"
                          disabled={true}
                          // label="Brokerage Exclusive GST"
                          variant="outlined"
                          size="small"
                          inputProps={{
                            inputMode: "numeric",
                            pattern: "[0-9]*",
                          }}
                          value={`${
                            formik.values.beg || "0"
                          }  /- Brokerage Exclusive GST`}
                          InputProps={{
                            readOnly: true,
                          }}
                          onChange={handleCustomChange}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.beg && Boolean(formik.errors.beg)
                          }
                          helperText={formik.touched.beg && formik.errors.beg}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              backgroundColor: "#e5e7eb",
                            },
                            "& .MuiInputBase-root": {
                              height: 30,
                            },

                            "& .MuiInputLabel-root": {
                              transform: "translate(14px, 6px) scale(1)",
                            },
                            "& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-root.MuiFormLabel-filled":
                              {
                                transform: "translate(14px, -10px) scale(0.75)",
                              },
                          }}
                        />
                      </Col>
                      <Col lg={6}>
                        <TextField
                          fullWidth
                          id="sbr"
                          name="sbr"
                          label="Enter Sub-broker Rate"
                          variant="outlined"
                          size="small"
                          inputProps={{
                            inputMode: "decimal",
                            pattern: "^[0-9]*\\.?[0-9]+$",
                          }}
                          value={formik.values.sbr}
                          onChange={handleCustomChange}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.sbr && Boolean(formik.errors.sbr)
                          }
                          helperText={formik.touched.sbr && formik.errors.sbr}
                          sx={{
                            "& .MuiInputBase-root": {
                              height: 30,
                            },

                            "& .MuiInputLabel-root": {
                              transform: "translate(14px, 6px) scale(1)",
                            },
                            "& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-root.MuiFormLabel-filled":
                              {
                                transform: "translate(14px, -10px) scale(0.75)",
                              },
                          }}
                        />
                      </Col>
                      <Col lg={6}>
                        <TextField
                          fullWidth
                          id="sbc"
                          name="sbc"
                          label="Enter Sub-broker Code"
                          variant="outlined"
                          size="small"
                          value={formik.values.sbc}
                          onChange={handleCustomChange}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.sbc && Boolean(formik.errors.sbc)
                          }
                          helperText={formik.touched.sbc && formik.errors.sbc}
                          sx={{
                            "& .MuiInputBase-root": {
                              height: 30,
                            },

                            "& .MuiInputLabel-root": {
                              transform: "translate(14px, 6px) scale(1)",
                            },
                            "& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-root.MuiFormLabel-filled":
                              {
                                transform: "translate(14px, -10px) scale(0.75)",
                              },
                          }}
                        />
                      </Col>

                      <Col lg={6}>
                        <TextField
                          fullWidth
                          id="sbcm"
                          name="sbcm"
                          // label="Sub-broker Commision"
                          variant="outlined"
                          size="small"
                          disabled={true}
                          inputProps={{
                            inputMode: "numeric",
                            pattern: "[0-9]*",
                          }}
                          value={`${
                            formik.values.sbcm || "0"
                          }  /- Sub-Broker Commission`}
                          InputProps={{
                            readOnly: true,
                          }}
                          onChange={handleCustomChange}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.sbcm && Boolean(formik.errors.sbcm)
                          }
                          helperText={formik.touched.sbcm && formik.errors.sbcm}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              backgroundColor: "#e5e7eb",
                            },
                            "& .MuiInputBase-root": {
                              height: 30,
                            },

                            "& .MuiInputLabel-root": {
                              transform: "translate(14px, 6px) scale(1)",
                            },
                            "& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-root.MuiFormLabel-filled":
                              {
                                transform: "translate(14px, -10px) scale(0.75)",
                              },
                          }}
                        />
                      </Col>
                      <Col lg={6}>
                        <TextField
                          fullWidth
                          id="nbg"
                          name="nbg"
                          // label="Net. Brokerage"
                          variant="outlined"
                          size="small"
                          disabled={true}
                          inputProps={{
                            inputMode: "numeric",
                            pattern: "[0-9]*",
                          }}
                          value={`${
                            formik.values.nbg || "0"
                          }  /- Net.Brokerage`}
                          InputProps={{
                            readOnly: true,
                          }}
                          onChange={handleCustomChange}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.nbg && Boolean(formik.errors.nbg)
                          }
                          helperText={formik.touched.nbg && formik.errors.nbg}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              backgroundColor: "#e5e7eb",
                            },
                            "& .MuiInputBase-root": {
                              height: 30,
                            },

                            "& .MuiInputLabel-root": {
                              transform: "translate(14px, 6px) scale(1)",
                            },
                            "& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-root.MuiFormLabel-filled":
                              {
                                transform: "translate(14px, -10px) scale(0.75)",
                              },
                          }}
                        />
                      </Col>
                      <Col lg={6}>
                        {/* <Label
                          htmlFor="dealSheet"
                          style={{ fontSize: "10px" }}
                          className="form-label"
                        >
                          Upload Document
                        </Label> */}

                        {!selectedFileObj ? (
                          <Input
                            name="uploadProof"
                            type="file"
                            accept=".pdf"
                            className="form-control mb-3"
                            onChange={handleFileChange}
                            // style={{
                            //   width: "100%",
                            //   minHeight: "40px",
                            //   borderColor: "#C4C4C4",
                            // }}

                            sx={{
                              "& .MuiOutlinedInput-root": {
                                backgroundColor: "#e5e7eb",
                              },
                              "& .MuiInputBase-root": {
                                height: 30,
                              },

                              "& .MuiInputLabel-root": {
                                transform: "translate(14px, 6px) scale(1)",
                              },
                              "& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-root.MuiFormLabel-filled":
                                {
                                  transform:
                                    "translate(14px, -10px) scale(0.75)",
                                },
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              background: "#f9f9f9",
                              padding: "8px 12px",
                              borderRadius: "6px",
                              border: "1px solid #dcdcdc",
                              height: "30px",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "12px",
                                color: "#555",
                                fontStyle: "italic",
                                wordBreak: "break-all",
                              }}
                            >
                              📄 {selectedFileObj.name}
                            </span>

                            <CloseIcon
                              // color="#ff4d4f"
                              style={{ cursor: "pointer" }}
                              onClick={handleRemoveFile}
                              fontSize="small"
                            />
                          </div>
                        )}
                      </Col>
                    </Row>
                  </Box>
                </>
              )}
              {isThirdPartyMaster && (
                <>
                  <Col lg={6}>
                    <TextField
                      fullWidth
                      id="ldc"
                      name="ldc"
                      label="Enter Ledger Code"
                      variant="outlined"
                      size="small"
                      value={formik.values.ldc}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.submitCount > 0 && Boolean(formik.errors.ldc)
                      }
                      helperText={formik.submitCount > 0 && formik.errors.ldc}
                    />
                  </Col>

                  <Col lg={6}>
                    <TextField
                      fullWidth
                      id="cnm"
                      name="cnm"
                      label="Enter Company Name"
                      variant="outlined"
                      size="small"
                      value={formik.values.cnm}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.submitCount > 0 && Boolean(formik.errors.cnm)
                      }
                      helperText={formik.submitCount > 0 && formik.errors.cnm}
                    />
                  </Col>

                  <Col lg={4}>
                    <TextField
                      fullWidth
                      id="em"
                      name="em"
                      label="Primary Email"
                      variant="outlined"
                      size="small"
                      value={formik.values.em}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.submitCount > 0 && Boolean(formik.errors.em)
                      }
                      helperText={formik.submitCount > 0 && formik.errors.em}
                    />
                  </Col>

                  <Col lg={4}>
                    <TextField
                      fullWidth
                      id="em1"
                      name="em1"
                      label="Secondary Email"
                      variant="outlined"
                      size="small"
                      value={formik.values.em1}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </Col>

                  <Col lg={4}>
                    <TextField
                      fullWidth
                      id="em2"
                      name="em2"
                      label="Alternate Email"
                      variant="outlined"
                      size="small"
                      value={formik.values.em2}
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
                      id="sac"
                      name="sac"
                      label="SAC Number"
                      variant="outlined"
                      size="small"
                      value={formik.values.sac}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.submitCount > 0 && Boolean(formik.errors.sac)
                      }
                      helperText={formik.submitCount > 0 && formik.errors.sac}
                    />
                  </Col>

                  <Col lg={6}>
                    <TextField
                      fullWidth
                      id="ste"
                      name="ste"
                      label="State"
                      variant="outlined"
                      size="small"
                      value={formik.values.ste}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.submitCount > 0 && Boolean(formik.errors.ste)
                      }
                      helperText={formik.submitCount > 0 && formik.errors.ste}
                    />
                  </Col>

                  <Col lg={6}>
                    <TextField
                      fullWidth
                      id="gst"
                      name="gst"
                      label="GST Number"
                      variant="outlined"
                      size="small"
                      value={formik.values.gst}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.submitCount > 0 && Boolean(formik.errors.gst)
                      }
                      helperText={formik.submitCount > 0 && formik.errors.gst}
                    />
                  </Col>

                  <Col lg={6}>
                    <TextField
                      fullWidth
                      id="gsc"
                      name="gsc"
                      label="GST State Code"
                      variant="outlined"
                      size="small"
                      value={formik.values.gsc}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.submitCount > 0 && Boolean(formik.errors.gsc)
                      }
                      helperText={formik.submitCount > 0 && formik.errors.gsc}
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
                      error={
                        formik.submitCount > 0 && Boolean(formik.errors.pan)
                      }
                      helperText={formik.submitCount > 0 && formik.errors.pan}
                    />
                  </Col>

                  <Col lg={6}>
                    <TextField
                      fullWidth
                      id="mob"
                      name="mob"
                      label="Mobile Number"
                      variant="outlined"
                      size="small"
                      value={formik.values.mob}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.submitCount > 0 && Boolean(formik.errors.mob)
                      }
                      helperText={formik.submitCount > 0 && formik.errors.mob}
                    />
                  </Col>

                  <Col lg={12}>
                    <TextField
                      fullWidth
                      id="ad1"
                      name="ad1"
                      label="Address Line 1"
                      variant="outlined"
                      size="small"
                      value={formik.values.ad1}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.submitCount > 0 && Boolean(formik.errors.ad1)
                      }
                      helperText={formik.submitCount > 0 && formik.errors.ad1}
                    />
                  </Col>

                  <Col lg={6}>
                    <TextField
                      fullWidth
                      id="ad2"
                      name="ad2"
                      label="Address Line 2"
                      variant="outlined"
                      size="small"
                      value={formik.values.ad2}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </Col>

                  <Col lg={6}>
                    <TextField
                      fullWidth
                      id="ad3"
                      name="ad3"
                      label="Address Line 3"
                      variant="outlined"
                      size="small"
                      value={formik.values.ad3}
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
                                <strong>Click to upload</strong> or drag and
                                drop your <strong>.pdf, .docx</strong> file here
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
                              onClick={getDownloadableFile}
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
                          {formik.touched.msmeType &&
                            formik.errors.msmeType && (
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
                                      `msme_document_file${editData?.msmx}`}
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
                                          formik.setFieldValue(
                                            "msmeFile",
                                            null
                                          );
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
                                `bank_document_file${editData?.bdx}`}
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
                            • Only <strong>.jpeg</strong>, <strong>.png</strong>
                            , <strong>.pdf</strong> files are accepted.
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

              {isScriptMasterContent && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <TextField
                      fullWidth
                      size="small"
                      variant="outlined"
                      label="Scrip Name"
                      placeholder="Enter Scrip Name"
                      name="scriptName"
                      value={formik.values.scriptName}
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase();
                        formik.setFieldValue("scriptName", value);
                      }}
                      onKeyDown={(e) => {
                        const allowed = /^[A-Za-z ]$/;
                        if (e.key.length === 1 && !allowed.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.scriptName &&
                        Boolean(formik.errors.scriptName)
                      }
                      helperText={
                        formik.touched.scriptName && formik.errors.scriptName
                      }
                    />
                    <TextField
                      fullWidth
                      size="small"
                      variant="outlined"
                      label="ISIN"
                      placeholder="Enter ISIN"
                      name="isin"
                      value={formik.values.isin}
                      onChange={(e) => {
                        const value = e.target.value
                          .toUpperCase()
                          .replace(/\s/g, "");
                        formik.setFieldValue("isin", value);
                      }}
                      onKeyDown={(e) => {
                        const allowed = /^[A-Za-z0-9]$/;
                        if (e.key.length === 1 && !allowed.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      onBlur={formik.handleBlur}
                      error={formik.touched.isin && Boolean(formik.errors.isin)}
                      helperText={formik.touched.isin && formik.errors.isin}
                      inputProps={{ maxLength: 12 }}
                    />
                  </Box>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="isActive"
                        checked={formik.values.isActive}
                        onChange={formik.handleChange}
                        sx={{
                          color: "#11395C",
                          "&.Mui-checked": {
                            color: "#11395C",
                          },
                        }}
                      />
                    }
                    label="IsActive Script"
                  />
                </Box>
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
    </>
  );
};

export default ModalComponent;
