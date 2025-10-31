import { Card, CardBody, Row, Col } from "reactstrap";

const MfinfoCard = ({
  funds,
  CardType,
  handleSelectedMutualFund,
  selectedReturnPeriod, // ✅ New prop added
}: any) => {
  const handleCardClick = (fund: any) => {
    handleSelectedMutualFund(fund.schemeCode.toString());
  };

  // ✅ Map return period to fund key
  const getReturnValue = (fund: any) => {
    const periodKeyMap: any = {
      "1W": fund.oneWeek,
      "1M": fund.oneMonth,
      "3M": fund.threeMonth,
      "6M": fund.sixMonth,
      "1Y": fund.oneYear,
      "3Y": fund.threeYear,
      "5Y": fund.fiveYear,
    };

    return periodKeyMap[selectedReturnPeriod] || "N.A.";
  };

  const sortedFunds = [...funds].sort((a, b) => {
    const returnA = parseFloat(getReturnValue(a)) || 0;
    const returnB = parseFloat(getReturnValue(b)) || 0;
    return returnB - returnA; // Descending
  });

  return (
    <div
      style={{
        display: "flex",
        overflowX: "auto",
        gap: "16px",
      }}
    >
      {sortedFunds.map((fund: any) => {
        const returnValue = getReturnValue(fund); // ✅ dynamically set
        const returnNumber = parseFloat(returnValue) || 0;

        return (
          <Card
            key={CardType === "Popular Category" ? fund.id : fund.bseSchemeCode}
            onClick={() => handleCardClick(fund)}
            style={{
              flex: CardType !== "Popular Category" ? "0 0 450px" : "0 0 300px",
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
                    alt="AMC logo"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "8px",
                    }}
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
                      {selectedReturnPeriod} Returns
                    </div>
                    <div
                      style={{
                        fontWeight: "600",
                        color:
                          returnNumber == null
                            ? ""
                            : returnNumber > 0
                            ? "green"
                            : "red",
                        fontSize: "14px",
                      }}
                    >
                      {returnNumber != null
                        ? `${new Intl.NumberFormat("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }).format(returnNumber)}%`
                        : "N.A."}
                    </div>
                  </Col>
                </Row>
              )}
              {CardType === "Popular Category" && (
                <Row className="align-items-center">
                  <Col>
                    <div style={{ fontSize: "12px", color: "#777" }}>
                      {selectedReturnPeriod} Returns
                    </div>
                  </Col>
                  <Col className="text-end">
                    <div
                      style={{
                        fontWeight: "600",
                        fontSize: "14px",
                        color: returnNumber >= 0 ? "green" : "red",
                      }}
                    >
                      {isNaN(returnNumber)
                        ? "N.A."
                        : `${new Intl.NumberFormat("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }).format(returnNumber)}%`}
                    </div>
                  </Col>
                </Row>
              )}
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
};

export default MfinfoCard;
