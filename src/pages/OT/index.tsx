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
import { regEx } from "../../helper/method";

const OTDetails = () => {
  const [selectedCapsule, setSelectedCapsule] = useState("Backoffice Report");
  const [value, setValue] = useState("");

  const handleClick = (value: string) => {
    console.log("You clicked the Chip.", value);
    setSelectedCapsule(value);
  };

  const handleChange = (event: any) => {
    console.log("eventChange", event?.target.value);
    const { value } = event?.target;
    if (regEx.alphaNumeric.test(value)) {
      setValue(value.toUpperCase().replace(/\s/g, ""));
    }
  };

  const handleAppyClick = () => {
    if (value === "") {
      alert("Please enter Client Code");
    } else {
      alert(`Your Client Code is ${value}`);
    }
    setValue("");
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
              <Card>
                <CardBody>
                  <Col
                    xs="6"
                    md="6"
                    className="align-items-center mb-4"
                    style={{
                      border: "1px solid #D3D3D3",
                      borderRadius: "8px",
                      margin: "5px",
                      paddingLeft: "10px",
                    }}
                  >
                    <Col className="d-flex align-items-center">
                      <span
                        style={{
                          minWidth: "90px",
                          color: "#11395C",
                          fontWeight: "bold",
                          marginRight: "10px",
                        }}
                      >
                        Client Code
                      </span>
                      <InputGroup style={{ flex: 1 }}>
                        <Input
                          value={value}
                          style={{
                            backgroundColor: "#e9ecef",
                            border: "none",
                            borderRadius: "0px 0px 0px 0px",
                          }}
                          onChange={handleChange}
                          maxLength={14}
                          placeholder="Enter Client Code"
                        />
                        <Button
                          style={{
                            backgroundColor: "#11395C",
                            color: "#fff",
                            fontWeight: "normal",
                            borderRadius: "0 8px 8px 0",
                            fontFamily: "Poppins",
                          }}
                          onClick={handleAppyClick}
                        >
                          Apply
                        </Button>
                      </InputGroup>
                    </Col>
                  </Col>

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
