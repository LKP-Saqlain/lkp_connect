import {
  Button,
  Card,
  CardBody,
  Col,
  Input,
  Row,
  InputGroup,
} from "reactstrap";
// import UserCapsules from "../ClientDetails/UserCapsules";
import { useState } from "react";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import dayjs from "dayjs";
import Link from "@mui/material/Link"; // ✅ Correct import
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { hideLoader, showLoader } from "../../redux/slices/loaderSlice";
import { apiServices } from "../../services";
import ShowToast from "../../utils/toastUtils";

const OTDetails = () => {
  // const [selectedCapsule, setSelectedCapsule] = useState("Backoffice Report");
  const [clientCode, setClientCode] = useState("");
  const [links, setLinks] = useState({
    oldBackOffice: "",
    statement: "",
  });

  // const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );
  // const handleClick = (value: string) => {
  //   console.log("You clicked the Chip.", value);
  //   setSelectedCapsule(value);
  // };

  // const handleChange = (event: any) => {
  //   console.log("eventChange", event?.target.value);
  //   const { value } = event?.target;
  //   if (regEx.alphaNumeric.test(value)) {
  //     setClientCode(value.toUpperCase().replace(/\s/g, ""));
  //   }
  // };

  const handleApplyClick = () => {
    if (clientCode === "") {
      alert("Please enter Client Code");
      return;
    }

    const payload = {
      // userId: "EMP-4967",
      userId: user_id,
      clientCode: clientCode,
    };

    dispatch(showLoader("Please wait, we are processing your request..."));

    apiServices
      .GetClientAccessLink(payload)
      .then((response: any) => {
        if (response?.data?.statusCode == 200) {
          setLinks({
            oldBackOffice: response?.data?.data?.oldBackofficeLink || "",
            statement: response?.data?.data?.branchReportLink || "",
          });
        } else {
          ShowToast("error", response?.data?.errorMessages);
        }
        console.log(response?.data, links, "Mapped data", response);
      })

      .catch((Err: any) => {
        const { message } = Err;
        console.log("Error->", message);
        dispatch(hideLoader());
      })
      .finally(() => {
        dispatch(hideLoader());
        // setClientCode("");
      });

    // setSelectedDate(null);
  };

  return (
    <>
      <div className="page-content page-view" style={{ minHeight: "85vh" }}>
        <div className="container-fluid">
          <Row className="row-font">
            <Col lg={12}>
              {/* <CardHeader>
                <h4 className="card-title mb-0">Other Details</h4>
              </CardHeader> */}
              {/* <CardBody> */}
              {/* </CardBody> */}
              {/* <UserCapsules
                selectedCapsule={selectedCapsule}
                handleClick={handleClick}
                // totalCount={totalCount}
                // activeClient={activeClients}
                // inactiveClient={inactiveClients}
                capsuleType="OD"
              /> */}
              <Card
                style={{
                  borderRadius: "15px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                }}
              >
                <CardBody>
                  <InputGroup className="mb-3" style={{ flex: 1 }}>
                    {/* Client Code Input */}
                    <Col
                      xs="6"
                      className="d-flex align-items-center"
                      style={{
                        border: "1px solid #D3D3D3",
                        borderRadius: "8px",
                        width: "350px",
                        margin: "0 20px 0 0",
                      }}
                    >
                      <span
                        style={{
                          minWidth: "150px",
                          color: "#095192",
                          fontWeight: "bold",
                          padding: "0 10px",
                        }}
                      >
                        Client Code
                      </span>

                      <Input
                        value={clientCode}
                        style={{
                          backgroundColor: "#e9ecef",
                          border: "none",
                          height: "100%",
                        }}
                        onChange={(e) => {
                          const value = e.target.value;
                          setClientCode(value);
                          // Reset the links object properly
                          setLinks({
                            oldBackOffice: "",
                            statement: "",
                          });
                        }}
                        maxLength={14}
                        placeholder="Enter Client Code"
                      />
                    </Col>

                    <Button
                      style={{
                        backgroundColor: "#11395C",
                        color: "#fff",
                        borderRadius: "8px",
                        fontFamily: "Poppins",
                      }}
                      onClick={handleApplyClick} // <-- Added onClick event
                    >
                      View
                    </Button>
                  </InputGroup>

                  <Row className="my-5 d-flex align-items-center">
                    {/* <Col md={3}>
                      <h6 className="fw-bold">Link 2</h6>
                    </Col> */}
                    <Col md={9} className="d-flex justify-content-start gap-3">
                      {links.oldBackOffice && (
                        <Link
                          href={links.oldBackOffice}
                          target="_blank"
                          rel="noopener noreferrer"
                          underline="none"
                          style={{
                            display: "inline-block",
                            padding: "10px 18px",
                            backgroundColor: "#095192",
                            color: "#fff",
                            borderRadius: "8px",
                            fontWeight: 500,
                            fontSize: "14px",
                            textDecoration: "none",
                            transition: "all 0.3s ease",
                            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
                          }}
                        >
                          Old Back Office
                        </Link>
                      )}

                      {links.statement && (
                        <Link
                          href={links.statement}
                          target="_blank"
                          rel="noopener noreferrer"
                          underline="none"
                          style={{
                            display: "inline-block",
                            padding: "10px 18px",
                            backgroundColor: "#095192",
                            color: "#fff",
                            borderRadius: "8px",
                            fontWeight: 500,
                            fontSize: "14px",
                            textDecoration: "none",
                            transition: "all 0.3s ease",
                            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
                          }}
                        >
                          Client Statement and Report
                        </Link>
                      )}
                      {/* <Button
                        className="w-25"
                        style={{
                          marginRight: "5px",
                          backgroundColor: "#11395C",
                          borderRadius: "23px",
                        }}
                      >
                        Download Excel
                      </Button>
                      <Button
                        className="w-25"
                        style={{
                          marginRight: "5px",
                          backgroundColor: "#11395C",
                          borderRadius: "23px",
                        }}
                      >
                        Download PDF
                      </Button>
                      <Button
                        className="w-25"
                        style={{
                          marginRight: "5px",
                          backgroundColor: "#11395C",
                          borderRadius: "23px",
                        }}
                      >
                        Email Excel
                      </Button>
                      <Button
                        className="w-25"
                        style={{
                          backgroundColor: "#11395C",
                          borderRadius: "23px",
                        }}
                      >
                        Email PDF
                      </Button> */}
                    </Col>
                  </Row>

                  {/* Contract Note Section */}
                  {/* <Row className="align-items-center mb-3">
                    <Col md={2}>
                      <h6 className="fw-bold">Contract Note</h6>
                    </Col>
                    <Col md={3}>
                      <Input type="date" placeholder="From Date" />
                    </Col>
                    <Col md={3}>
                      <Input type="date" placeholder="To Date" />
                    </Col>
                    <Col md={2}>
                      <Button
                        style={{
                          backgroundColor: "#11395C",
                          borderRadius: "23px",
                        }}
                        className="w-100"
                      >
                        Download
                      </Button>
                    </Col>
                    <Col md={2}>
                      <Button
                        style={{
                          backgroundColor: "#11395C",
                          borderRadius: "23px",
                        }}
                        className="w-100"
                      >
                        Email
                      </Button>
                    </Col>
                  </Row> */}

                  {/* Client Ledger Section */}
                  {/* <Row className="align-items-center">
                    <Col md={2}>
                      <h6 className="fw-bold">Client Ledger</h6>
                    </Col>
                    <Col md={3}>
                      <Input type="date" placeholder="From Date" />
                    </Col>
                    <Col md={3}>
                      <Input type="date" placeholder="To Date" />
                    </Col>
                    <Col md={2}>
                      <Button
                        style={{
                          backgroundColor: "#11395C",
                          borderRadius: "23px",
                        }}
                        className="w-100"
                      >
                        Download
                      </Button>
                    </Col>
                    <Col md={2}>
                      <Button
                        style={{
                          backgroundColor: "#11395C",
                          borderRadius: "23px",
                        }}
                        className="w-100"
                      >
                        Email
                      </Button>
                    </Col>
                  </Row> */}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default OTDetails;
