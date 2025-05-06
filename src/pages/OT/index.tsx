import {
  Button,
  Card,
  CardBody,
  Col,
  Input,
  Row,
  InputGroup,
} from "reactstrap";
import UserCapsules from "../ClientDetails/UserCapsules";
import { useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const OTDetails = () => {
  const [selectedCapsule, setSelectedCapsule] = useState("Backoffice Report");
  const [clientCode, setClientCode] = useState("");
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);

  const handleClick = (value: string) => {
    console.log("You clicked the Chip.", value);
    setSelectedCapsule(value);
  };

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

    const formattedDate = selectedDate
      ? selectedDate.format("MM-YYYY")
      : "No Date Selected";

    console.log("Selected Capsule:", selectedCapsule);
    console.log("Client Code:", clientCode);
    console.log("Selected Month & Year:", formattedDate);

    alert(
      `Your Client Code is ${clientCode} && Your Selected Month & Year: ${formattedDate}`
    );

    setClientCode("");
    setSelectedDate(null);
  };

  return (
    <>
      <div className="page-content" style={{ minHeight: "85vh" }}>
        <div className="container-fluid">
          <Row className="row-font">
            <Col lg={12}>
              {/* <CardHeader>
                <h4 className="card-title mb-0">Other Details</h4>
              </CardHeader> */}
              {/* <CardBody> */}
              {/* </CardBody> */}
              <UserCapsules
                selectedCapsule={selectedCapsule}
                handleClick={handleClick}
                // totalCount={totalCount}
                // activeClient={activeClients}
                // inactiveClient={inactiveClients}
                capsuleType="OD"
              />
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
                          color: "#11395C",
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
                        onChange={(e) => setClientCode(e.target.value)}
                        maxLength={14}
                        placeholder="Enter Client Code"
                      />
                    </Col>

                    {/* Month & Year Picker */}
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Month & Year"
                        views={["month", "year"]}
                        value={selectedDate}
                        onChange={(newValue) => setSelectedDate(newValue)}
                        sx={{ width: 210, margin: "0 20px" }}
                      />
                    </LocalizationProvider>

                    {/* Apply Button */}
                    <Button
                      style={{
                        backgroundColor: "#11395C",
                        color: "#fff",
                        borderRadius: "8px",
                        fontFamily: "Poppins",
                      }}
                      onClick={handleApplyClick} // <-- Added onClick event
                    >
                      Apply
                    </Button>
                  </InputGroup>

                  {/* Client Details */}
                  <Row className="mb-4">
                    <Col md={4}>
                      <h6 className="fw-bold">Client Name</h6>
                      <p>Rahul Sharma</p>
                    </Col>
                    <Col md={4}>
                      <h6 className="fw-bold">Client Code</h6>
                      <p>552145651</p>
                    </Col>
                    <Col md={4}>
                      <h6 className="fw-bold">Mobile No</h6>
                      <p>956478412</p>
                    </Col>
                  </Row>

                  {/* Buttons for P&L Report */}
                  <Row className="mb-4 d-flex align-items-center">
                    <Col md={3}>
                      <h6 className="fw-bold">Text P&L Report</h6>
                    </Col>
                    <Col md={9} className="d-flex justify-content-between">
                      <Button
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
                      </Button>
                    </Col>
                  </Row>

                  {/* Contract Note Section */}
                  <Row className="align-items-center mb-3">
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
                  </Row>

                  {/* Client Ledger Section */}
                  <Row className="align-items-center">
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
                  </Row>
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
