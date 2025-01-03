import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Label,
  Row,
  Input,
  Button,
} from "reactstrap";
import { regEx } from "../../../helper/method";
import DownloadIcon from "@mui/icons-material/Download";
import { apiServices } from "../../../services";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import DataTable from "../../../components/common/table";
import { GridColDef } from "@mui/x-data-grid";
import "./style.css";
import { FormData } from "../../../types";
import axios from "axios";
import ShowToast from "../../../utils/toastUtils";

import Select from "react-select";
import { endpoints } from "../../../services/endpoints";

const accNo = [
  { value: "15770340001410", label: "15770340001410" },
  { value: "57500001047915", label: "57500001047915" },
];
const PaymentType = [
  { value: "ALL", label: "ALL" },
  { value: "NEFT", label: "NEFT" },
  { value: "RTGS", label: "RTGS" },
  { value: "IMPS", label: "IMPS" },
  { value: "OTHER", label: "OTHER" },
  { value: "UPI", label: "UPI" },
  { value: "Fund Trans", label: "Fund Trans" },
];

const CoreReport = () => {
  const [lkpAccDropDownValue, setLkpAccDropDownValue] = useState<any>(null);
  const [paymentType, setPaymentType] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [userData, setUserData] = useState([]);
  const [totalEntries, setTotalEntries] = useState(null);

  const [page, setPage] = useState(1); // Track current page

  const [formData, setFormData] = useState<FormData>({
    clientCode: "",
    accNo: "",
    chequeNo: "",
  });

  const dispatch = useDispatch();

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log("value", value, name);

    if (name === "ClientCode") {
      if (regEx.alphaNumeric.test(value)) {
        setFormData((prevState) => ({
          ...prevState,
          clientCode: value.toUpperCase().replace(/\s/g, ""),
        }));
      }
    } else if (name === "AccNo") {
      if (regEx.number.test(value)) {
        setFormData((prevState) => ({
          ...prevState,
          accNo: value.replace(/\s/g, ""),
        }));
      }
    } else if (name === "checkNo") {
      if (regEx.alphaNumeric.test(value)) {
        setFormData((prevState) => ({
          ...prevState,
          chequeNo: value.toUpperCase().replace(/\s/g, ""),
        }));
      }
    }
  };

  const handleDownloadExcel = async () => {
    const payload = {
      clientCode: formData.clientCode || "",
      clientAccNo: formData.accNo || "",
      chequeNo: formData.chequeNo || "",
      lkpAccNo: lkpAccDropDownValue || "",
      paymentType: paymentType || "",
      valueDate: selectedDate || "",
      userId: "",
      option: "",
    };

    try {
      let token = localStorage.getItem("tkn");
      dispatch(showLoader("Please wait, We are Processing your Request"));

      const response = await axios.post(
        `https://middlewareapi.lkp.net.in${endpoints.GetCoreAlertsReport}`,
        payload,
        {
          responseType: "blob", // Ensures the response is treated as a binary file
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Check if the response is a valid Blob
      if (response.data.size === 0) {
        throw new Error("Received empty response from server");
      }

      // Create a URL for the Blob and download it
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "file.xlsx"); // Ensure the file name has a proper extension
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // Clean up the DOM
      window.URL.revokeObjectURL(url); // Free up memory by revoking the URL
      dispatch(hideLoader());
    } catch (error) {
      console.error("Download error", error);
      dispatch(hideLoader());
    }
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    console.log(event);

    setPage(newPage);
    // handleSubmit(event, newPage); // Fetch data for the new page
    handleSubmit();
  };

  const handleSubmit = () => {
    if (selectedDate === null) {
      ShowToast("error", "Please select Date");
      return;
    }
    // Prepare the payload
    const payload = {
      clientCode: formData.clientCode || "",
      clientAccNo: formData.accNo || "",
      chequeNo: formData.chequeNo || "",
      lkpAccNo: lkpAccDropDownValue || "",
      paymentType: paymentType || "",
      valueDate: selectedDate || "",
      userId: "",
      option: "",
    };

    dispatch(showLoader("")); // Show the loader

    apiServices
      .GetCoreAlertsReport(payload)
      .then((response) => {
        console.log("GetCoreAlertsReport_response", response?.data.length);

        // Check for success status
        if (response?.status === 200) {
          setUserData(response?.data);
          const userRecords = response?.data.length;
          setTotalEntries(userRecords);
        }
      })
      .catch((Err) => {
        console.log(Err, "error-->");
        const errorMessage =
          Err.response?.data?.message ||
          "Sorry for the inconvenience, please try after some time.";
        console.log("Error->", errorMessage);
        ShowToast("error", errorMessage);
      })
      .finally(() => {
        // Hide the loader in the finally block
        dispatch(hideLoader());
      });
  };

  const Corecolumns: GridColDef[] = [
    { field: "clientCode", headerName: "Client Code", width: 80 },
    { field: "alertSequenceNo", headerName: "Alert Sequence No", width: 80 },
    { field: "virtualAccount", headerName: "Virtual Account", width: 80 },
    {
      field: "lkP_AccountNumber",
      headerName: "LKP Account Number",
      width: 180,
    },
    { field: "debitCredit", headerName: "Debit/Credit", width: 80 },
    { field: "amount", headerName: "Amount", width: 100 },
    { field: "client_Name", headerName: "Client Name", width: 80 },
    {
      field: "client_AccountNumber",
      headerName: "Client Account Number",
      width: 180,
    },
    { field: "client_Bank", headerName: "Client Bank", width: 80 },
    { field: "client_IFSC", headerName: "Client IFSC", width: 80 },
    { field: "chequeNo", headerName: "Cheque No", width: 80 },
    {
      field: "userReferenceNumber",
      headerName: "User Reference Number",
      width: 180,
    },
    { field: "payment_Type", headerName: "Payment Type", width: 80 },
    { field: "valueDate", headerName: "Value Date", width: 80 },
    {
      field: "transactionDescription",
      headerName: "Transaction Description",
      width: 200,
    },
    { field: "transactionDate", headerName: "Transaction Date", width: 80 },
  ];

  document.title = "LKP Securities | Core Alert Report";

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Row className="row-font">
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <h4 className="card-title mb-0">Core Alert Report</h4>
                </CardHeader>
                <CardBody>
                  <div>
                    <Row>
                      <Col xl={4}>
                        <div className="mb-3">
                          <Label
                            htmlFor="choices-text-remove-button"
                            className="form-label text-muted label-font"
                          >
                            CLIENT CODE
                          </Label>
                          <Input
                            // invalid={true}
                            name="ClientCode"
                            type="text"
                            className="core-report-form-control"
                            value={formData.clientCode}
                            onChange={handleOnChange}
                            // id="choices-text-remove-button"
                            data-choices
                            data-choices-limit="3"
                            placeholder="example : 12345"
                          />
                          {/* <FormFeedback>
                            Oh noes! that name is already taken
                          </FormFeedback> */}
                        </div>
                      </Col>
                      <Col xl={4}>
                        <div className="mb-3">
                          <Label
                            htmlFor="choices-text-remove-button"
                            className="form-label text-muted label-font"
                          >
                            ACCOUNT NO.
                          </Label>
                          <Input
                            name="AccNo"
                            type="text"
                            className="core-report-form-control"
                            value={formData.accNo}
                            onChange={handleOnChange}
                            id="choices-text-remove-button"
                            data-choices
                            data-choices-limit="3"
                            placeholder="Please enter Account Number"
                          />
                        </div>
                      </Col>
                      <Col xl={4}>
                        <div className="mb-3">
                          <Label
                            htmlFor="choices-text-remove-button"
                            className="form-label text-muted label-font"
                          >
                            CHEQUE NO.
                          </Label>
                          <Input
                            name="checkNo"
                            type="text"
                            className="core-report-form-control"
                            value={formData.chequeNo}
                            onChange={handleOnChange}
                            id="choices-text-remove-button"
                            data-choices
                            data-choices-limit="3"
                            placeholder="Please enter Cheque Number"
                          />
                        </div>
                      </Col>
                      <Col xl={4}>
                        <Label
                          htmlFor="choices-text-remove-button"
                          className="form-label text-muted label-font"
                        >
                          VALUE DATE
                        </Label>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            className="w-full"
                            format="DD/MM/YYYY"
                            // Convert string date back to Dayjs object for DatePicker
                            value={
                              selectedDate
                                ? dayjs(selectedDate, "DD/MM/YYYY")
                                : null
                            }
                            sx={{
                              marginBottom: 4,
                              width: "100%",
                              height: "40px",
                            }}
                            maxDate={dayjs()} // Prevent selecting future dates
                            onChange={(date: Dayjs | null) => {
                              // Format the selected date to DD/MM/YYYY and store it in state
                              setSelectedDate(
                                date ? date.format("DD/MM/YYYY") : null
                              );
                            }}
                            // renderInput={(params) => (
                            //   <TextField {...params} fullWidth />
                            // )}
                          />
                        </LocalizationProvider>
                      </Col>
                      <Col xl={4}>
                        <div className="mb-3">
                          <Label
                            htmlFor="choices-single-no-sorting"
                            className="form-label text-muted label-font"
                          >
                            LKP ACCOUNT NO.
                          </Label>
                          <Select
                            className="placeholder-font"
                            value={lkpAccDropDownValue}
                            onChange={(selectedOption: any) =>
                              setLkpAccDropDownValue(selectedOption)
                            }
                            options={accNo}
                          />
                        </div>
                      </Col>
                      <Col xl={4}>
                        <div className="mb-3">
                          <Label
                            htmlFor="choices-single-no-sorting"
                            className="form-label text-muted label-font"
                          >
                            PAYMENT TYPE
                          </Label>
                          <Select
                            className="placeholder-font"
                            value={paymentType}
                            onChange={(selectedOption: any) =>
                              setPaymentType(selectedOption)
                            }
                            options={PaymentType}
                          />
                        </div>
                      </Col>

                      <Col
                        xl={3}
                        className="d-flex justify-content-between align-items-center"
                      >
                        <Button
                          className="w-100 m-2"
                          style={{
                            backgroundColor: "#11395C",
                            fontSize: "12px",
                          }}
                          onClick={handleSubmit}
                        >
                          Submit
                        </Button>
                        <Button
                          className="w-100 d-flex justify-content-center align-items-center"
                          style={{
                            backgroundColor: "#11395C",
                            fontSize: "12px",
                          }}
                          onClick={handleDownloadExcel}
                        >
                          Excel
                          <DownloadIcon fontSize="small" />
                        </Button>
                      </Col>
                    </Row>
                  </div>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <DataTable
                    dynamicHeader={Corecolumns}
                    tableData={userData}
                    totalRecords={totalEntries}
                    page={page}
                    onPageChange={handlePageChange}
                    pageSize={10}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  );
};

export default CoreReport;
