import {
  Row,
  Col,
  InputGroup,
  InputGroupText,
  Input,
  Button,
} from "reactstrap";
export const CopyableLink = ({
  linkName,
  logo,
  link,
  buttonText,
  onCopy,
  customClass,
}: {
  linkName: string;
  logo: string;
  link: string;
  buttonText: string;
  onCopy: () => void;
  customClass?: any;
}) => (
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
          {!customClass && (
            <img
              src={logo}
              height="50px"
              width="50px"
              style={{ marginRight: "10px" }}
              alt={`${linkName} logo`}
            />
          )}
          {customClass ? "RE-EKYC LINK" : "EKYC Link"}
        </InputGroupText>
        <Input
          value={link}
          style={{
            backgroundColor: "#e9ecef",
            border: "none",
            borderRadius: "8px 0 0 8px",
            fontFamily: "Public Sans",
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
          onClick={onCopy}
        >
          {buttonText}
        </Button>
      </InputGroup>
    </Col>
  </Row>
);
