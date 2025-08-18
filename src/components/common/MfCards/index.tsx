import { Card, CardBody, Row, Col } from "reactstrap";

const MfCards = ({ CardData }: any) => {
  return (
    <Row>
      {CardData.map((item: any) => (
        <Col key={item.id} className="">
          <Card
            style={{
              textAlign: "center",
              borderRadius: "12px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              cursor: "pointer",
              backgroundColor: "#e5e5e5",
            }}
          >
            <CardBody>
              <div
                style={{
                  color: "green",
                  fontSize: "28px",
                  marginBottom: "8px",
                }}
              >
                {item.icon}
              </div>
              <div style={{ fontSize: "14px", fontWeight: 500 }}>
                {item.label}
              </div>
            </CardBody>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default MfCards;
