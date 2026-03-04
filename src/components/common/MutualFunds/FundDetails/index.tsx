import { Card, Row, Col } from "reactstrap";
import { FaUserTie } from "react-icons/fa";
import { MdOutlineScience } from "react-icons/md";
import { HiOutlineDocumentText } from "react-icons/hi";

const FundDetails = ({ data, fundOverviewData }: any) => {
  // Format launch date
  const formattedLaunchDate = data.launchDate
    ? new Date(data.launchDate).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "N/A";
  const finalData = fundOverviewData || data || {};

  return (
    <div style={{ marginTop: "20px" }}>
      <Row>
        <Col md={12}>
          {/* Fund Metrics Summary */}
          <Card
            style={{
              borderRadius: "12px",
              padding: "16px 24px",
              marginBottom: "20px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            }}
          >
            <Row className="text-center">
              <Col md={2}>
                <strong style={{ fontSize: "13px", color: "#777" }}>NAV</strong>
                <div>
                  {finalData.nav ? Number(finalData.nav).toFixed(2) : "N/A"}
                </div>
              </Col>
              <Col md={2}>
                <strong style={{ fontSize: "13px", color: "#777" }}>AUM</strong>
                <div>
                  {finalData.aum
                    ? `${parseFloat(finalData.aum).toLocaleString("en-IN", {
                        maximumFractionDigits: 0,
                      })} Cr`
                    : "N/A"}
                </div>
              </Col>
              <Col md={2}>
                <strong style={{ fontSize: "13px", color: "#777" }}>
                  Min. SIP
                </strong>
                <div>
                  {finalData.sipMinimum ? `₹${finalData.sipMinimum}` : "N/A"}
                </div>
              </Col>
              <Col md={2}>
                <strong style={{ fontSize: "13px", color: "#777" }}>
                  Min. Lump
                </strong>
                <div>
                  {finalData.lumpsumMinimum
                    ? `₹${finalData.lumpsumMinimum}`
                    : "N/A"}
                </div>
              </Col>
              <Col md={2}>
                <strong style={{ fontSize: "13px", color: "#777" }}>
                  Risk Category
                </strong>
                <div>{finalData.riskCategory || "N/A"}</div>
              </Col>
              <Col md={2}>
                <strong style={{ fontSize: "13px", color: "#777" }}>
                  Scheme Category
                </strong>
                <div>{finalData.schemeCategory || "N/A"}</div>
              </Col>
            </Row>
          </Card>
        </Col>
        {/* Fund Manager */}
        <Col md={6}>
          <Card
            style={{
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "16px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            }}
          >
            <h6
              style={{
                display: "flex",
                alignItems: "center",
                fontWeight: 600,
                marginBottom: "12px",
              }}
            >
              <FaUserTie style={{ marginRight: "8px" }} /> Fund Manager
            </h6>
            {data.fundManager ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 0",
                }}
              >
                <span>{finalData.fundManager}</span>
              </div>
            ) : (
              <div>No Fund Manager Info</div>
            )}
          </Card>
        </Col>

        {/* Investment Objective */}
        <Col md={6}>
          <Card
            style={{
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "16px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            }}
          >
            <h6
              style={{
                display: "flex",
                alignItems: "center",
                fontWeight: 600,
                marginBottom: "12px",
              }}
            >
              <MdOutlineScience style={{ marginRight: "8px" }} /> Investment
              Objective
            </h6>
            <p style={{ fontSize: "14px", color: "#444", lineHeight: "1.6" }}>
              {finalData.investmentObjective || "No objective provided."}
            </p>
          </Card>
        </Col>
      </Row>

      {/* Scheme Information */}
      <Card
        style={{
          borderRadius: "12px",
          padding: "16px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
        }}
      >
        <h6
          style={{
            display: "flex",
            alignItems: "center",
            fontWeight: 600,
            marginBottom: "16px",
          }}
        >
          <HiOutlineDocumentText style={{ marginRight: "8px" }} /> Scheme
          Information
        </h6>
        <Row>
          <Col md={2}>
            <div>
              <strong style={{ fontSize: "13px", color: "#777" }}>
                Launch Date
              </strong>
              <div>{formattedLaunchDate || "-"}</div>
            </div>
          </Col>
          <Col md={2}>
            <div>
              <strong style={{ fontSize: "13px", color: "#777" }}>ISIN</strong>
              <div>{finalData.isin || "-"}</div>
            </div>
          </Col>
          <Col md={2}>
            <div>
              <strong style={{ fontSize: "13px", color: "#777" }}>
                Expense Ratio
              </strong>
              <div>
                {finalData.expenseRatio ? `${finalData.expenseRatio}%` : "-"}
              </div>
            </div>
          </Col>
          <Col md={2}>
            <div>
              <strong style={{ fontSize: "13px", color: "#777" }}>
                Sharpe Ratio
              </strong>
              <div>{finalData.sharpeRatio || "-"}</div>
            </div>
          </Col>
          <Col md={2}>
            <div>
              <strong style={{ fontSize: "13px", color: "#777" }}>Beta</strong>
              <div>{finalData.beta || "-"}</div>
            </div>
          </Col>
          <Col md={2}>
            <div>
              <strong style={{ fontSize: "13px", color: "#777" }}>
                Lock in
              </strong>
              <div>{finalData.lockIn || "-"}</div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default FundDetails;
