import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Container,
  Card,
  CardHeader,
  CardBody,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Col,
  Button as ReactStrapButton,
} from "reactstrap";
import { Button, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { apiServices } from "../../../services";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import ShowToast from "../../../utils/toastUtils";
import { formatDateTime } from "../../../helper/commmon";
// import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { IoIosSend } from "react-icons/io";
import UserInfoTable from "../../../components/common/UserInfoTable";

interface UploadDetail {
  type: string;
  uon: string;
  uby: string;
}

const MTFFileUpload = ({ activeSubItem }: any) => {
  const [uploadDetails, setUploadDetails] = useState<UploadDetail[]>([]);
  const [isEmailConfirmOpen, setIsEmailConfirmOpen] = useState(false);
  const [mtfEmailRecords, SetMTFEmailRecords] = useState<any[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data,
  );

  const formik = useFormik({
    initialValues: {
      shortfallFile: null,
      ageingFile: null,
    },
    validationSchema: Yup.object({
      shortfallFile: Yup.mixed().required("MTF Shortfall file is required"),
      ageingFile: Yup.mixed().required("MTF Ageing file is required"),
    }),
    onSubmit: (values) => {
      console.log("Form Values:", values);
    },
  });

  useEffect(() => {
    let payload = {
      user_id: user_id,
    };
    dispatch(showLoader(""));
    apiServices
      .ShowMailMTFAgeingData(payload)
      .then((response) => {
        const { data } = response?.data;
        if (response?.status === 200 && Array.isArray(data)) {
          dispatch(hideLoader());

          console.log("Response123232", response?.data);

          const recordsWithId = data.map((item: any, index: number) => ({
            Id: index + 1,
            ...item,
          }));

          SetMTFEmailRecords(recordsWithId);
          console.log("mtfEmailRecords", mtfEmailRecords, recordsWithId);
        }
      })
      .catch((error) => {
        console.log("Errror", error);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  }, [dispatch]);

  useEffect(() => {
    fetchFileUploadedDetails();
  }, []);

  const fetchFileUploadedDetails = () => {
    let payload = {
      option: "MTFAgeing",
    };
    dispatch(showLoader(""));

    apiServices
      .GetFileuploadDetails(payload)
      .then((response) => {
        if (response?.status === 200) {
          dispatch(hideLoader());
          console.log("ResponseeeGetFileuploadDetails", response?.data?.data);
          const data = response?.data?.data || [];
          setUploadDetails(data);
        }
      })
      .catch((error) => {
        console.log("errror", error);
        dispatch(hideLoader());
      });
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: "shortfallFile" | "ageingFile",
  ) => {
    const file = e.currentTarget.files?.[0];

    if (!file) return;

    const fileName = file.name.toLowerCase();

    if (fieldName === "shortfallFile") {
      // ONLY CSV
      if (fileName.endsWith(".csv")) {
        formik.setFieldValue(fieldName, file);
      } else {
        const errorMsg = "Only .csv file is accepted";
        formik.setFieldError(fieldName, errorMsg);
        ShowToast("error", errorMsg); // <<< SHOW TOAST
      }
    }

    if (fieldName === "ageingFile") {
      // ONLY XLS / XLSX
      if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
        formik.setFieldValue(fieldName, file);
      } else {
        const errorMsg = "Only .xlsx or .xls files are accepted";
        formik.setFieldError(fieldName, errorMsg);
        ShowToast("error", errorMsg); // <<< SHOW TOAST
      }
    }

    // Reset the input value so same file can be re-selected
    e.target.value = "";
  };

  const handleUpload = async (
    type: "shortfall" | "ageing",
    file: File | null,
  ) => {
    if (!file) return;

    const formData = new FormData();
    if (type === "shortfall") formData.append("File", file);
    else formData.append("File", file);
    formData.append("User_id", user_id);

    dispatch(showLoader(""));

    try {
      console.log("FormData", formData);

      const response =
        type === "shortfall"
          ? await apiServices.MTFStockAgeingFileUpload(formData)
          : await apiServices.MTFAgeingFileUpload(formData);

      if (response?.status === 200) {
        console.log(`${type} upload response:`, response?.data);
        ShowToast("success", response?.data?.message);
        fetchFileUploadedDetails();
      }
      formik.setFieldValue(
        type === "shortfall" ? "shortfallFile" : "ageingFile",
        null,
      );
    } catch (error) {
      console.error(`${type} upload error:`, error);
      //   alert("Upload failed, please try again.");
    } finally {
      dispatch(hideLoader());
    }
  };

  const renderUploadBox = (
    fieldName: "shortfallFile" | "ageingFile",
    file: File | null,
  ) => (
    <div
      style={{
        position: "relative",
        border: "1px dashed #ced4da",
        padding: "10px",
        borderRadius: "0.25rem",
        backgroundColor: "#f8f9fa",
        width: "100%",
        cursor: "pointer",
        minHeight: "60px",
      }}
      onClick={() => document.getElementById(fieldName)?.click()}
    >
      <input
        type="file"
        id={fieldName}
        name={fieldName}
        accept={fieldName === "shortfallFile" ? ".csv" : ".xlsx,.xls"}
        style={{ display: "none" }}
        onChange={(e) => handleFileChange(e, fieldName)}
      />

      {file ? (
        <>
          {file.name}
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
                formik.setFieldValue(fieldName, null);
              }}
            >
              <CloseIcon fontSize="small" />
            </span>
          </Tooltip>
        </>
      ) : (
        <span style={{ fontSize: "13px" }}>
          <strong>Click to upload</strong> or drag and drop your{" "}
          <strong>
            {fieldName === "shortfallFile" ? ".csv" : ".xlsx / .xls"}
          </strong>{" "}
          file here
        </span>
      )}

      <div className="mt-1">
        <small className="text-muted d-block" style={{ fontSize: "12px" }}>
          • Only{" "}
          {fieldName === "shortfallFile" ? (
            <strong>.csv</strong>
          ) : (
            <>
              <strong>.xlsx</strong> or <strong>.xls</strong>
            </>
          )}{" "}
          files are accepted.
        </small>
      </div>

      {formik.errors[fieldName] && formik.touched[fieldName] && (
        <div className="text-danger mt-1" style={{ fontSize: "0.85rem" }}>
          {formik.errors[fieldName] as string}
        </div>
      )}
    </div>
  );

  const MTFStockAgeing = uploadDetails.find(
    (item: any) => item.tp === "MTFStockAgeing",
  );
  const MTFAgeing = uploadDetails.find((item: any) => item.tp === "MTFAgeing");

  const handleSendEmail = async () => {
    const payload = {
      user_id: user_id,
    };

    dispatch(showLoader("Sending email..."));

    let hasError = false;

    const callApi = async (
      apiFn: (payload: any) => Promise<any>,
      apiName: string,
    ) => {
      try {
        const res = await apiFn(payload);
        if (res?.status !== 200) {
          throw new Error();
        }
      } catch {
        hasError = true;
        ShowToast("error", `${apiName} failed to send email`);
      }
    };

    await callApi(apiServices.SendClientMTFEmail, "Client MTF Email");
    await callApi(apiServices.SendDealerMTFEmail, "Dealer MTF Email");
    await callApi(apiServices.SendRMMTFEmail, "RM MTF Email");
    await callApi(apiServices.SendRHMTFEmail, "RH MTF Email");
    await callApi(apiServices.SendAPMTFEmail, "AP MTF Email");
    //new apis'
    await callApi(apiServices.SendTLMTFEmail, "TL MTF Email");
    await callApi(apiServices.SendBMMTFEmail, "MB MTF Email");
    await callApi(apiServices.SendAHMTFEmail, "AH MTF Email");

    dispatch(hideLoader());

    if (!hasError) {
      ShowToast("success", "All emails sent successfully");
    }
  };

  const confirmBtnStyle = {
    height: "25px",
    minWidth: "70px",
    padding: "0 12px",
    fontSize: "13px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <div className="page-content page-view">
      <Modal
        isOpen={isEmailConfirmOpen}
        toggle={() => setIsEmailConfirmOpen(false)}
        centered
        style={{ maxWidth: "400px" }}
      >
        <ModalHeader toggle={() => setIsEmailConfirmOpen(false)}></ModalHeader>
        <i
          style={{ textAlign: "center" }}
          className="ri-alert-line display-5 text-warning"
        ></i>
        <ModalBody
          style={{ padding: "5px", fontSize: "14px", textAlign: "center" }}
        >
          Are you sure you want to send the Email?
        </ModalBody>

        <ModalFooter
          className="justify-content-center"
          style={{
            padding: "8px 12px",
            minHeight: "unset",
          }}
        >
          <ReactStrapButton
            color="#11395C"
            style={{
              ...confirmBtnStyle,
              borderColor: "#11395C",
              backgroundColor: "#fff",
            }}
            onClick={() => setIsEmailConfirmOpen(false)}
          >
            No
          </ReactStrapButton>

          <ReactStrapButton
            style={{
              ...confirmBtnStyle,
              backgroundColor: "#11395C",
              borderColor: "#11395C",
            }}
            onClick={() => {
              setIsEmailConfirmOpen(false);
              handleSendEmail();
            }}
          >
            Yes
          </ReactStrapButton>
        </ModalFooter>
      </Modal>
      <Container fluid>
        <Card
          style={{
            borderRadius: "15px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          }}
        >
          <CardHeader
            style={{
              borderRadius: "15px 15px 0 0",
              boxShadow: "0 -4px 8px rgba(0, 0, 0, 0.15)",
              backgroundColor: "#fff",
              padding: "0.5rem 0.8rem",
            }}
          >
            <h4 className="card-title mb-0">{activeSubItem}</h4>
          </CardHeader>

          <CardBody>
            <form onSubmit={formik.handleSubmit}>
              {/* Responsive two-column layout */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "20px",
                  justifyContent: "space-between",
                }}
              >
                {/* MTF Shortfall File */}
                <div
                  style={{
                    flex: "1 1 400px",
                    minWidth: "300px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <label className="form-label mb-1">
                    MTF Stock Ageing File
                  </label>
                  {renderUploadBox(
                    "shortfallFile",
                    formik.values.shortfallFile,
                  )}
                  <div style={{ marginTop: "10px" }}>
                    <Button
                      variant="contained"
                      size="small"
                      disabled={
                        formik.values.shortfallFile === null ? true : false
                      }
                      sx={{
                        fontSize: "12px",
                        color: "#fff",
                        bgcolor: "#11395C",
                        textTransform: "none",
                        padding: "6px 12px",
                        width: "100%",
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        handleUpload("shortfall", formik.values.shortfallFile);
                      }}
                    >
                      Upload MTF Stock Ageing File
                    </Button>
                    {MTFStockAgeing && (
                      <div
                        style={{
                          marginTop: "8px",
                          fontSize: "11px",
                          color: "#444",
                        }}
                      >
                        <div>
                          <strong>Last Uploaded By:</strong>{" "}
                          {MTFStockAgeing.uby}
                        </div>
                        <div>
                          <strong>Last Uploaded On:</strong>{" "}
                          {formatDateTime(MTFStockAgeing?.uon)}
                        </div>
                      </div>
                    )}
                  </div>
                  <Col>
                    <div className="mb-2" />
                    <Button
                      style={{
                        backgroundColor: "#11395C",
                        fontSize: "10px",
                        height: "30px",
                        color: "#FFF",
                        textTransform: "none",
                        width: "40%",
                      }}
                      type="button"
                      onClick={() => setIsEmailConfirmOpen(true)}
                    >
                      Sent Email
                      {/* <MailOutlineIcon
                        fontSize="small"
                        sx={{
                          marginLeft: "5px",
                          marginBottom: "2px",
                          fontSize: "16px",
                        }}
                      /> */}
                      <IoIosSend
                        style={{
                          marginLeft: "5px",
                          marginBottom: "1px",
                          fontSize: "20px",
                        }}
                      />
                    </Button>
                  </Col>
                  <div
                    style={{
                      marginTop: "8px",
                      fontSize: "11px",
                      color: "#444",
                    }}
                  >
                    <div>
                      <strong>Note : </strong>{" "}
                      <i style={{ fontSize: "10px" }}>
                        <strong>
                          Email sent to Client / RM / Dealer / AP / RH
                        </strong>
                      </i>
                    </div>
                  </div>
                </div>

                {/* MTF Ageing File */}
                <div
                  style={{
                    flex: "1 1 400px",
                    minWidth: "300px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <label className="form-label mb-1">MTF Ageing File</label>
                  {renderUploadBox("ageingFile", formik.values.ageingFile)}
                  <div style={{ marginTop: "10px" }}>
                    <Button
                      variant="contained"
                      size="small"
                      disabled={
                        formik.values.ageingFile === null ? true : false
                      }
                      sx={{
                        fontSize: "12px",
                        color: "#fff",
                        bgcolor: "#11395C",
                        textTransform: "none",
                        padding: "6px 12px",
                        width: "100%",
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        handleUpload("ageing", formik.values.ageingFile);
                      }}
                    >
                      Upload MTF Ageing File
                    </Button>
                    {MTFAgeing && (
                      <div
                        style={{
                          marginTop: "8px",
                          fontSize: "11px",
                          color: "#444",
                        }}
                      >
                        <div>
                          <strong>Last Uploaded By:</strong> {MTFAgeing.uby}
                        </div>
                        <div>
                          <strong>Last Uploaded On:</strong>{" "}
                          {formatDateTime(MTFAgeing?.uon)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </CardBody>
        </Card>
        <Card
          style={{
            borderRadius: "15px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          }}
        >
          <CardHeader
            style={{
              borderRadius: "15px 15px 0 0",
              boxShadow: "0 -4px 8px rgba(0, 0, 0, 0.15)",
              backgroundColor: "#fff",
              padding: "0.5rem 0.8rem",
            }}
          >
            {" "}
            <h4 className="card-title mb-0">{"MTF Ageing Client List"}</h4>
          </CardHeader>
          <CardBody>
            {" "}
            <UserInfoTable
              activeSubItem={"MTFEmailAgeing"}
              T6Data={mtfEmailRecords}
              // handleMTFRow={handleMTFRow}
              // openNudgeTable={openNudgeTable}
            />
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default MTFFileUpload;
