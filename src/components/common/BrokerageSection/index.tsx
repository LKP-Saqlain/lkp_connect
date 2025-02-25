import { Card, CardBody, Row, Col } from "reactstrap";
import {
  BrokSlabItems,
  BrokSlabItemsPennypal,
} from "../../../helper/tableColumns.tsx";

// Define the type for props
interface BrokerageSectionProps {
  customBrokerage?: boolean; // Optional prop to conditionally render the section
}

export const BrokerageSection = ({
  customBrokerage = false,
}: BrokerageSectionProps): JSX.Element => {
  const itemsToMap = customBrokerage ? BrokSlabItemsPennypal : BrokSlabItems;

  const cardBodyStyle = {
    height: !customBrokerage ? "185px" : "85px", // Example: 250px for customBrokerage, 185px by default
  };

  return (
    <Row>
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
            style={cardBodyStyle}
          >
            <p
              style={{
                fontFamily: "Poppins",
                color: "#fff",
                fontWeight: "bold",
                fontSize: !customBrokerage ? "20px" : "12px",
                textAlign: "center",
              }}
            >
              Default <br />
              Brokerage <br />
            </p>
          </CardBody>
        </Card>
      </Col>
      <Col md={9}>
        <Row style={{ marginTop: "10px" }}>
          {itemsToMap.map((item) => (
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
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      </Col>
    </Row>
  );
};
