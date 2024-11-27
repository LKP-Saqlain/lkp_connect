import {
  Card,
  CardBody,
  Row,
  Col,
  InputGroup,
  InputGroupText,
  Input,
  Button,
} from "reactstrap";
import { BrokSlabItems } from "../../components/common/Capsules";
import { FiEdit } from "react-icons/fi";

const EKYCLink = () => {
  return (
    <Card style={{ minHeight: "85vh", padding: "16px" }}>
      {/* EKYC Link Input */}
      <Row
        className="align-items-center mb-4"
        style={{
          border: "1px solid #D3D3D3",
          borderRadius: "8px",
          margin: "5px",
          padding: "10px 0px",
        }}
      >
        <Col xs="12" md="12">
          <InputGroup>
            <InputGroupText
              style={{
                minWidth: "90px",
                backgroundColor: "transparent",
                border: "none",
                color: "#11395C",
                fontWeight: "bold",
              }}
            >
              EKYC Link
            </InputGroupText>
            <Input
              placeholder="Enter EKYC link"
              style={{
                backgroundColor: "#e9ecef",
                border: "none",
                borderRadius: "8px 0 0 8px",
              }}
              readOnly
            />
            <Button
              style={{
                backgroundColor: "#11395C",
                color: "#fff",
                fontWeight: "bold",
                borderRadius: "0 8px 8px 0",
              }}
              onClick={() =>
                navigator.clipboard.writeText("Your EKYC link here")
              }
            >
              Copy
            </Button>
          </InputGroup>
        </Col>
        <Row>
          {/* Brokerage Slab (Left Column) */}
          <Col md={3}>
            <Card
              style={{
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
                backgroundColor: "#11395C",
                borderRadius: "23px",
                marginTop: "10px",
              }}
            >
              <CardBody
                className="d-flex justify-content-center align-items-center"
                style={{ height: "185px" }}
              >
                <p
                  style={{
                    fontFamily: "Poppins",
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: "20px",
                    textAlign: "center",
                  }}
                >
                  Default <br />
                  Brokerage <br />
                  Slab
                </p>
              </CardBody>
            </Card>
          </Col>

          {/* Brokerage Items (Right Column) */}
          <Col md={9}>
            <Row style={{ marginTop: "10px" }}>
              {BrokSlabItems.map((item) => (
                <Col md={3} key={item.id}>
                  <Card
                    style={{
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                      border: "1px solid rgba(0, 0, 0, 0.1)",
                      borderRadius: "10px",
                    }}
                  >
                    <CardBody className="d-flex justify-content-between align-items-center">
                      <div>
                        <p
                          style={{
                            fontFamily: "Poppins",
                            color: "#333",
                            fontWeight: "500",
                            fontSize: "12px",
                            margin: "5px 0",
                          }}
                        >
                          {item.label}
                        </p>
                        <p
                          style={{
                            fontFamily: "Poppins",
                            color:
                              item.subvalue === "Inactive" ? "#FF0606" : "#777",
                            fontSize: "14px",
                            margin: 0,
                          }}
                        >
                          {item.subvalue}
                        </p>
                      </div>
                      {/* <FiEdit
                        style={{
                          cursor: "pointer",
                          fontSize: "16px",
                          color: "#777",
                        }}
                      /> */}
                    </CardBody>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Row>
      <Row
        className="align-items-center mb-4"
        style={{
          border: "1px solid #D3D3D3",
          borderRadius: "8px",
          margin: "5px",
          padding: "10px 0px",
        }}
      >
        <Col xs="12" md="12">
          <InputGroup>
            <InputGroupText
              style={{
                minWidth: "90px",
                backgroundColor: "transparent",
                border: "none",
                color: "#11395C",
                fontWeight: "bold",
              }}
            >
              EKYC Link
            </InputGroupText>
            <Input
              placeholder="Enter EKYC link"
              style={{
                backgroundColor: "#e9ecef",
                border: "none",
                borderRadius: "8px 0 0 8px",
              }}
              readOnly
            />
            <Button
              style={{
                backgroundColor: "#11395C",
                color: "#fff",
                fontWeight: "bold",
                borderRadius: "0 8px 8px 0",
              }}
              onClick={() =>
                navigator.clipboard.writeText("Your EKYC link here")
              }
            >
              Copy
            </Button>
          </InputGroup>
        </Col>
        <Row>
          {/* Brokerage Slab (Left Column) */}
          <Col md={3}>
            <Card
              style={{
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
                backgroundColor: "#11395C",
                borderRadius: "23px",
                marginTop: "10px",
              }}
            >
              <CardBody
                className="d-flex justify-content-center align-items-center"
                style={{ height: "185px" }}
              >
                <p
                  style={{
                    fontFamily: "Poppins",
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: "20px",
                    textAlign: "center",
                  }}
                >
                  Default <br />
                  Brokerage <br />
                  Slab
                </p>
              </CardBody>
            </Card>
          </Col>

          {/* Brokerage Items (Right Column) */}
          <Col md={9}>
            <Row style={{ marginTop: "10px" }}>
              {BrokSlabItems.map((item) => (
                <Col md={3} key={item.id} className="">
                  <Card
                    style={{
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                      border: "1px solid rgba(0, 0, 0, 0.1)",
                      borderRadius: "10px",
                    }}
                  >
                    <CardBody className="d-flex justify-content-between align-items-center">
                      <div>
                        <p
                          style={{
                            fontFamily: "Poppins",
                            color: "#333",
                            fontWeight: "500",
                            fontSize: "12px",
                            margin: "5px 0",
                          }}
                        >
                          {item.label}
                        </p>
                        <p
                          style={{
                            fontFamily: "Poppins",
                            color:
                              item.subvalue === "Inactive" ? "#FF0606" : "#777",
                            fontSize: "14px",
                            margin: 0,
                          }}
                        >
                          {item.subvalue}
                        </p>
                      </div>
                      {/* <FiEdit
                        style={{
                          cursor: "pointer",
                          fontSize: "16px",
                          color: "#777",
                        }}
                      /> */}
                    </CardBody>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Row>

      {/* RE-EKYC Link Input */}
      <Row className="align-items-center mt-4">
        <Col xs="12" md="12">
          <InputGroup>
            <InputGroupText
              style={{
                minWidth: "90px",
                backgroundColor: "transparent",
                border: "none",
                color: "#11395C",
                fontWeight: "bold",
              }}
            >
              RE-EKYC Link
            </InputGroupText>
            <Input
              placeholder="Enter EKYC link"
              style={{
                backgroundColor: "#e9ecef",
                border: "none",
                borderRadius: "8px 0 0 8px",
              }}
              readOnly
            />
            <Button
              style={{
                backgroundColor: "#11395C",
                color: "#fff",
                fontWeight: "bold",
                borderRadius: "0 8px 8px 0",
              }}
              onClick={() =>
                navigator.clipboard.writeText("Your RE-EKYC link here")
              }
            >
              Copy
            </Button>
          </InputGroup>
        </Col>
      </Row>
    </Card>
  );
};

export default EKYCLink;
