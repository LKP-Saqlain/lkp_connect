import { Card, CardBody, Row, Col } from "reactstrap";

const MfinfoCard = ({ funds, CardType, handleSelectedMutualFund }: any) => {
  const handleCardClick = (fund: any) => {
    console.log(fund.schemeCode, "Clicked fund:", fund);
    handleSelectedMutualFund(fund.schemeCode.toString());
  };
  return (
    <div
      style={{
        display: "flex",
        overflowX: "auto",
        gap: "16px",
        // scrollbarWidth: "none", // Firefox
      }}
    >
      {funds.map((fund: any) => (
        <Card
          key={CardType === "Popular Category" ? fund.id : fund.bseSchemeCode}
          onClick={() => handleCardClick(fund)}
          style={{
            flex: CardType !== "Popular Category" ? "0 0 450px" : "0 0 300px", // fixed width for card
            borderRadius: "12px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            backgroundColor: "#E5E5E5",
            cursor: "pointer",
          }}
        >
          <CardBody>
            {/* Header Section */}
            <Row className="align-items-center mb-2">
              <Col xs="auto">
                <img
                  src={fund.amcIcon}
                  alt={"AMC logo"}
                  style={{ width: "40px", height: "40px", borderRadius: "8px" }}
                />
              </Col>
              <Col>
                <div style={{ fontWeight: "600", fontSize: "14px" }}>
                  {fund.schemeName}
                </div>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  {fund.category}
                  {/* &nbsp; {fund.subCategory} */}
                </div>
              </Col>
            </Row>

            <hr style={{ margin: "8px 0" }} />

            {/* Fund Details */}
            {CardType === "Asset Class" && (
              <Row className="text-center">
                <Col>
                  <div style={{ fontSize: "12px", color: "#777" }}>
                    Min. SIP
                  </div>
                  <div style={{ fontWeight: "600", fontSize: "14px" }}>
                    {fund.sipMinimum}
                  </div>
                </Col>
                <Col>
                  <div style={{ fontSize: "12px", color: "#777" }}>
                    AUM (Cr)
                  </div>
                  <div style={{ fontWeight: "600", fontSize: "14px" }}>
                    {fund.aum}
                  </div>
                </Col>
                <Col>
                  <div style={{ fontSize: "12px", color: "#777" }}>
                    Min Lump
                  </div>
                  <div style={{ fontWeight: "600", fontSize: "14px" }}>
                    {fund.lumpsumMinimum || "N.A."}
                  </div>
                </Col>
                <Col>
                  <div style={{ fontSize: "12px", color: "#777" }}>
                    1Y Returns
                  </div>
                  <div
                    style={{
                      fontWeight: "600",
                      color:
                        fund.oneYear == null
                          ? ""
                          : fund.oneYear > 0
                          ? "green"
                          : "red",
                      fontSize: "14px",
                    }}
                  >
                    {fund.oneYear != null
                      ? `${new Intl.NumberFormat("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(fund.oneYear)}%`
                      : "N.A."}
                  </div>
                </Col>
              </Row>
            )}
            {CardType === "Popular Category" && (
              <Row className="align-items-center">
                <Col>
                  <div style={{ fontSize: "12px", color: "#777" }}>
                    3Y Returns
                  </div>
                </Col>
                <Col className="text-end">
                  <div
                    style={{
                      fontWeight: "600",
                      fontSize: "14px",
                      color: fund.threeYear >= 0 ? "green" : "red",
                    }}
                  >
                    {new Intl.NumberFormat("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(fund.threeYear)}
                    %
                  </div>
                </Col>
              </Row>
            )}
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

export default MfinfoCard;
