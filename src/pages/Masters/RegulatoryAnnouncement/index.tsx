import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  Button,
  // FormGroup,
  // Label,
  // Input,
  CardBody,
  Row,
  // Col,
  // FormFeedback,
  Container,
} from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import ShowToast from "../../../utils/toastUtils";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import dayjs, { Dayjs } from "dayjs";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { apiServices } from "../../../services";
import { Box } from "@mui/material";
import ModalComponent from "../../../components/common/masterModal";
import DataTable from "../../../components/common/UserInfoTable";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";

interface EditData {
  RowID: number;
  Dates: string;
  Department: string;
  Subject: string;
  LKPComments: string;
  CircularFilePath: string;
  IsDELETE: number;
  InsertedOn: string;
  UpdatedOn: string | null;
}

const RegAnnMaster = ({ activeSubItem }: any) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [modal_grid, setmodal_grid] = useState<boolean>(false);
  const [editUserCheck, setEditUserCheck] = useState(false);
  const [editData, setEditData] = useState<EditData | null>(null);
  const [data, setdata] = useState<any[]>([]);

  const dispatch = useDispatch<AppDispatch>();
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const formik = useFormik({
    initialValues: {
      dateOfCommunication: "",
      department: "",
      subject: "",
      lkpComments: "",
      circular: null,
    },
    validationSchema: Yup.object({
      dateOfCommunication: Yup.string().required("Date is required"),
      department: Yup.string().required("Department is required"),
      subject: Yup.string().required("Subject is required"),
      lkpComments: Yup.string().required("LKP Comments are required"),
      circular: Yup.mixed().required("Circular file is required"),
    }),
    onSubmit: async () => {},
  });

  useEffect(() => {
    console.log("test", uploadedFile);
  }, []);

  useEffect(() => {
    dispatch(showLoader(""));
    apiServices
      .viewRegAnnoucement({})
      .then((response) => {
        if (response?.status === 200) {
          console.log("Response-->", response);
          dispatch(hideLoader());
          setdata(response?.data?.Table || []);
        }
      })
      .catch((error) => {
        console.log("Error", error);
      });
  }, [dispatch]);

  function tog_grid() {
    setmodal_grid(!modal_grid);
    setEditUserCheck(false);
    setEditData(null);
  }

  const handleFormSubmit = async (
    data: any,
    apiStatus: any,
    fileBase64: any
  ) => {
    // debugger;
    console.log("Received form data in parent:", data, apiStatus, fileBase64);
    try {
      let base64: string = fileBase64;
      // alert("enter");
      if (data.uploadedFile) {
        // alert("1");
        base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(data.uploadedFile);
          reader.onload = () =>
            resolve((reader.result as string).split(",")[1]);
          reader.onerror = reject;
        });
      }
      const payload = {
        options: editData && editData?.RowID > 0 ? "UPDATE" : "INSERT",
        rowId: editData && editData?.RowID > 0 ? editData?.RowID : 0,
        date: data.dateOfCommunication,
        department: data.TypeOfDepartment,
        subject: data.SubjectType,
        lkpComments: data.LkpComments,
        cirCularFileName:
          data.uploadedFile?.name ?? data.uploadProof?.split("\\").pop() ?? "",
        circularFileBase64: base64 ? base64 : fileBase64 ? fileBase64 : "",
      };
      console.log("Payload-->", payload);

      const response = await apiServices.getInUpRegAnnoucement(payload);
      console.log("ResPonseee-->", response);

      if (response?.status === 200) {
        ShowToast("success", response.data?.message);
        setmodal_grid(false);
        setUploadedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        const viewResponse = await apiServices.viewRegAnnoucement({});
        console.log("viewResponse123", viewResponse?.data);
        setdata(viewResponse?.data?.Table);
      } else {
        throw new Error("Submission failed.");
      }
    } catch (error) {
      console.error(error);
      ShowToast("error", "Error submitting announcement.");
    }
    // setApiStatus(apiStatus);
  };
  const handleEditClick = (data: any, editCheck: boolean) => {
    // debugger;
    console.log("TestModalData", data, editCheck);
    // const formattedDate = data.DateOfCommunication
    //   ? dayjs(data.DateOfCommunication, "DD-MMM-YY").format("DD/MM/YYYY")
    //   : "";
    // const updatedData = { ...data, DateOfCommunication: formattedDate };

    setmodal_grid(true);
    setEditData(data);
    setEditUserCheck(editCheck);
  };

  const getDeleteUserDetails = async (row: any) => {
    console.log("selectedRowwww", row);
    dispatch(showLoader(""));
    let payload = {
      Rowid: row?.RowID,
    };

    const response = await apiServices.DeleteRegulatoryAnnoucement(payload);
    console.log("ResPonseee-->", response);

    if (response?.status === 200) {
      dispatch(hideLoader());
      ShowToast("success", response.data?.message);
      setmodal_grid(false);
      setUploadedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      const viewResponse = await apiServices.viewRegAnnoucement({});
      console.log("viewResponse123", viewResponse?.data);
      setdata(viewResponse?.data?.Table);
    } else {
      throw new Error("Submission failed.");
    }
  };

  const handleDownload = async (row: any) => {
    console.log("roww response", row);

    try {
      // Extract file path and name
      const fullPath = row.CircularFilePath || "";
      const pathParts = fullPath.split("\\");
      const fullFileName = pathParts[pathParts.length - 1]; // e.g. "sample..pdf"
      const filePath = pathParts.slice(0, -1).join("\\"); // e.g. "D:\\PROJECT"

      // Extract file name and extension safely
      const lastDotIndex = fullFileName.lastIndexOf(".");
      const fileName =
        lastDotIndex !== -1
          ? fullFileName.slice(0, lastDotIndex)
          : fullFileName;
      const fileType =
        lastDotIndex !== -1 ? fullFileName.slice(lastDotIndex) : ".pdf"; // default to .pdf if missing

      const payload = {
        fileName,
        filePath,
        fileType,
        contentType: "",
      };

      dispatch(showLoader("Downloading..."));
      const response = await apiServices.ComplianceDownload(payload);

      if (response?.status === 200 && response?.data) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");

        link.href = url;
        link.setAttribute("download", `${fileName}${fileType}`);
        document.body.appendChild(link);
        link.click();
      } else {
        console.error("Download failed", response);
        ShowToast("info", "Error downloading file");
      }
    } catch (error: any) {
      ShowToast(
        "info",
        error?.message || "An error occurred while downloading"
      );
    } finally {
      dispatch(hideLoader());
    }
  };

  return (
    <div className="page-content page-view">
      <Container fluid>
        <Card
          style={{
            minHeight: "80vh",
            borderRadius: "15px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          }}
        >
          <CardHeader
            style={{
              borderRadius: "15px 15px 0 0",
              boxShadow: "0 -4px 8px rgba(0, 0, 0, 0.15)",
              backgroundColor: "#fff",
              padding: "0.2rem 0.8rem",
            }}
          >
            <h4 className="card-title mb-0">Regulatory Announcement</h4>
          </CardHeader>
          <CardBody>
            <form onSubmit={formik.handleSubmit}>
              <Row>
                <ModalComponent
                  modal_grid={modal_grid}
                  tog_grid={tog_grid}
                  editData={editData}
                  onSubmit={handleFormSubmit}
                  editUserCheck={editUserCheck}
                  isRegulatoryContent={true}
                />
              </Row>
            </form>
            <CardBody>
              <Box>
                <Button
                  // type="submit"
                  variant="contained"
                  className="btn-font"
                  onClick={tog_grid}
                  style={{
                    backgroundColor: "#11395C",
                    marginBottom: "1rem",
                  }}
                >
                  Add
                </Button>
              </Box>
              <DataTable
                activeSubItem={activeSubItem}
                T6Data={data}
                handleEditClick={handleEditClick}
                handleDownload={handleDownload}
                // getRowHeight={getRowHeight}
                getUserDetails={getDeleteUserDetails}
              />
            </CardBody>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default RegAnnMaster;
