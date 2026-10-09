import { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Label,
  Row,
} from "reactstrap";
import { TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { apiServices } from "../../../services";
import { RootState, AppDispatch } from "../../../redux/store";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import ShowToast from "../../../utils/toastUtils";
import UserInfoTable from "../../../components/common/UserInfoTable";
import { regEx } from "../../../helper/method";
import "../style.css";

interface preTradeReport {
  activeSubItem: string;
}

const PreTradeReport = ({ activeSubItem }: preTradeReport) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [preTradeReportData, setPreTradeReportData] = useState<any[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [setShowImg, setSetShowImg] = useState<boolean>(false);
  const [fileType, setFileType] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();

  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data,
  );
  const validationSchema = Yup.object({
    clientCode: Yup.string(),
  });

  interface FormValues {
    clientCode: string;
  }

  const formik = useFormik<FormValues>({
    initialValues: {
      clientCode: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!selectedDate) {
        ShowToast("error", "Please select a trade date");
        return;
      }

      await handleViewReport(values);
    },
  });

  const handleViewReport = async (values: FormValues) => {
    if (!selectedDate) {
      ShowToast("error", "Please select a trade date");
      return;
    }

    const payload = {
      userId: user_id,
      clientCode: values.clientCode.trim(),
      tradedate: selectedDate.format("YYYY-MM-DD"),
    };

    dispatch(showLoader("Please wait, we are processing your request..."));

    try {
      const res = await apiServices.GetPreTradeReport(payload);

      if (res?.status === 200) {
        const rawData = Array.isArray(res.data) ? res.data : [];

        const finalData = rawData
          .filter((item: any) => item !== null)
          .map((item: any, index: number) => ({
            ...item,
            Id: item.rid ?? index + 1,
          }));

        setPreTradeReportData(finalData);

        if (finalData.length === 0) {
          ShowToast("info", "No records found for the selected criteria");
        }
      } else {
        setPreTradeReportData([]);
        ShowToast("error", "Failed to fetch PreTrade report");
      }
    } catch (error) {
      console.error("GetPreTradeReport error:", error);
      setPreTradeReportData([]);
      ShowToast("error", "Something went wrong while fetching the report");
    } finally {
      dispatch(hideLoader());
    }
  };
  // const handleDownload = async (row: any) => {
  //   const fileExtension = row.userRemarks
  //     ? `.${row.userRemarks.split(".").pop()}`
  //     : "";
  //   const payload = {
  //     fileName: row.userRemarks,
  //     filePath: "D:\\FileUpload\\PreTrade",
  //     fileType: fileExtension,
  //     contentType: "",
  //   };

  //   dispatch(showLoader("Downloading..."));
  //   console.log("row_data", row, payload);

  //   apiServices
  //     .ComplianceDownload(payload)
  //     .then((response) => {
  //       console.log("response", response);

  //       if (response?.status === 200 && response?.data) {
  //         const url = window.URL.createObjectURL(new Blob([response?.data]));
  //         const link = document.createElement("a");
  //         link.href = url;
  //         link.setAttribute(
  //           "download",
  //           `${payload.fileName}${payload.fileType}`
  //         );
  //         document.body.appendChild(link);
  //         link.click();
  //         dispatch(hideLoader());
  //       } else {
  //         console.log("Error during download", response);
  //         ShowToast("info", "Error downloading file");
  //       }
  //     })
  //     .catch((error) => {
  //       ShowToast(
  //         "info",
  //         error.message || "An error occurred while downloading"
  //       );
  //     })
  //     .finally(() => {
  //       dispatch(hideLoader());
  //     });
  // };

  const handlePreview = async (row: any) => {
    console.log("handlePreview", row);

    setPreviewUrl("");
    const fileExtension = row.userRemarks
      ? `.${row.userRemarks.split(".").pop()?.toLowerCase()}`
      : "";

    console.log("approvalExtension", fileExtension);
    setFileType(fileExtension);

    const payload = {
      fileName: row.userRemarks,
      filePath: "D:\\FileUpload\\PreTrade",
      fileType: fileExtension ? fileExtension : fileType ? fileType : "",
      contentType: "",
    };

    dispatch(showLoader("Loading Preview..."));

    apiServices
      .ComplianceDownload(payload)
      .then((response) => {
        if (response?.status === 200 && response?.data) {
          const blob = new Blob([response.data]);
          const url = URL.createObjectURL(blob);

          setPreviewUrl(url);
          setSetShowImg(false);
          console.log("fileURL", url, setShowImg);

          // setFileType(fileExtension);
          // setmodal_center(true); // Open modal to preview
        } else {
          ShowToast("info", "Error fetching file for preview");
        }
      })
      .catch((error) => {
        ShowToast("info", error.message || "Preview failed");
        setPreviewUrl("");
        setSetShowImg(false);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    console.log("value", name, value);
    if (name === "clientCode") {
      if (regEx.alphaNumeric.test(value)) {
        formik.setFieldValue(name, value.toUpperCase().replace(/\s/g, ""));
      }
    } else {
      formik.handleChange(e);
    }
  };

  return (
    <>
      <div className="page-content page-view">
        <div className="container-fluid">
          <Row className="row-font">
            <Col lg={12}>
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
                    backgroundColor: "#fff", // optional for contrast
                  }}
                >
                  <h4 className="card-title mb-0">
                    PreTrade Confirmation Report
                  </h4>
                </CardHeader>
                <CardBody>
                  <form onSubmit={formik.handleSubmit}>
                    <Row className="align-items-end">
                      <Col xl={3} lg={4} md={6} sm={12} className="mb-3">
                        <Label className="form-label text-muted label-font">
                          Trade Date
                        </Label>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            value={selectedDate}
                            onChange={(newValue) => setSelectedDate(newValue)}
                            maxDate={dayjs()}
                            format="DD-MM-YYYY"
                            slotProps={{
                              textField: {
                                size: "small",
                                fullWidth: true,
                                placeholder: "Select trade date",
                              },
                            }}
                          />
                        </LocalizationProvider>
                      </Col>

                      <Col xl={3} lg={4} md={6} sm={12} className="mb-3">
                        <Label
                          htmlFor="client-code-input"
                          className="form-label text-muted label-font"
                        >
                          Client Code
                        </Label>

                        <TextField
                          size="small"
                          id="client-code-input"
                          variant="outlined"
                          placeholder="Enter Client Code"
                          name="clientCode"
                          type="text"
                          value={formik.values.clientCode}
                          onChange={handleCustomChange}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.clientCode &&
                            Boolean(formik.errors.clientCode)
                          }
                          helperText={
                            formik.touched.clientCode &&
                            formik.errors.clientCode
                          }
                          fullWidth
                        />
                      </Col>

                      <Col xs="auto" className="mb-3">
                        <Button
                          type="submit"
                          style={{
                            backgroundColor: "#11395C",
                            fontSize: "12px",
                            minWidth: "120px",
                            height: "40px",
                          }}
                        >
                          View
                        </Button>
                      </Col>
                    </Row>
                  </form>
                </CardBody>
              </Card>
              <Card
                style={{
                  minHeight: "80vh",
                  borderRadius: "15px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                }}
              >
                <CardBody>
                  <UserInfoTable
                    activeSubItem={activeSubItem}
                    T6Data={preTradeReportData}
                    handleDownload={handlePreview}
                    previewUrl={previewUrl}
                    setSetShowImg={setSetShowImg}
                    fileExtension={fileType}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default PreTradeReport;
