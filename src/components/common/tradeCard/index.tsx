import { Divider } from "@mui/material";
import React from "react";
import { Card, CardBody, Button } from "reactstrap";
import "./TradeCard.css";

interface TradeCardProps {
  stockName?: any;
  exchange?: string;
  ltp?: number;
  ltpChange?: number;
  stopLoss?: number;
  recPrice?: number;
  targetPrice?: number;
  //   profitPotential?: number;
  //   potentialLeft?: number;
  status?: "Open" | "Closed" | "Part Profit";
  category?: any;
  tag?: string;
  dateTime?: string;
  partialProfitText?: string;
  buySell?: string;
  type: string;
  // :wrench: ADD THESE FOR 'Mandate' TYPE
  mandateId?: number;
  clientName?: string;
  bankName?: string;
  bankAccNumber?: string;
  regnDate?: string;
  amount?: number;
}

const TradeCard: React.FC<TradeCardProps> = ({
  stockName,
  exchange,
  ltp,
  ltpChange,
  stopLoss,
  recPrice,
  targetPrice,
  status,
  category,
  tag,
  dateTime,
  partialProfitText,
  buySell,
  type,

  // New props for Mandate
  clientName,
  mandateId,
  bankName,
  bankAccNumber,
  regnDate,
  amount,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case "Open":
        return { bg: "#e6ffe6", color: "#009933", border: "#c2f0c2" };
      case "Closed":
        return { bg: "#ffe6e6", color: "#cc0000", border: "#f5b3b3" };
      default:
        return { bg: "#fff3e6", color: "#ff6600", border: "#ffd6b3" };
    }
  };
  const { bg, color, border } = getStatusColor();

  const splitScripName = (scrip: string) => {
    const parts = scrip.split(" ");
    const dateIndex = parts.findIndex(
      (p, i) =>
        i + 2 < parts.length &&
        /^\d{1,2}$/.test(p) &&
        /^\d{1,2}$/.test(parts[i]) &&
        /^[A-Za-z]{3}$/.test(parts[i + 1]) &&
        /^\d{4}$/.test(parts[i + 2])
    );
    if (dateIndex !== -1) {
      const name = parts.slice(0, dateIndex).join(" ");
      const expiry = parts.slice(dateIndex, dateIndex + 3).join(" ");
      const strike = parts.slice(dateIndex + 3).join(" ");
      return { name, expiry, strike };
    }
    return { name: scrip, expiry: "", strike: "" };
  };

  // const { name, expiry, strike } = splitScripName(stockName);
  let name = "";
  let expiry = "";
  let strike = "";
  if (type !== "Mandate" && stockName) {
    const result = splitScripName(stockName);
    name = result.name;
    expiry = result.expiry;
    strike = result.strike;
  }
  return (
    <Card className={type != "Mandate" ? "trade-card" : ""}>
      {type === "Mandate" ? (
        <CardBody style={{ padding: "12px 20px" }}>
          <div>
            {/* Top row: Client Name & Status */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "6px",
              }}
            >
              <div style={{ fontWeight: 600, fontSize: "14px" }}>
                {clientName}
              </div>
              <div style={{ fontSize: "14px", color: "#666" }}>{status}</div>
            </div>
            {/* Detail Grid: Bank Info, Mandate ID, Regn Date, Amount */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "16px",
              }}
            >
              {/* Bank Info */}
              <div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "#999",
                    marginBottom: "4px",
                  }}
                >
                  Bank Info
                </div>
                <div style={{ fontSize: "13px", color: "#333" }}>
                  {bankName}
                </div>
                <div style={{ fontSize: "13px", color: "#333" }}>
                  {bankAccNumber}
                </div>
              </div>
              {/* Mandate ID */}
              <div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "#999",
                    marginBottom: "4px",
                  }}
                >
                  Mandate ID
                </div>
                <div style={{ fontSize: "13px", color: "#333" }}>
                  {mandateId}
                </div>
              </div>
              {/* Regn Date */}
              <div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "#999",
                    marginBottom: "4px",
                  }}
                >
                  Registration Date
                </div>
                <div style={{ fontSize: "13px", color: "#333" }}>
                  {regnDate}
                </div>
              </div>
              {/* Amount */}
              <div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "#999",
                    marginBottom: "4px",
                  }}
                >
                  Amount
                </div>
                <div style={{ fontSize: "13px", color: "#333" }}>
                  ₹
                  {amount?.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>
            </div>
          </div>{" "}
        </CardBody>
      ) : (
        <CardBody className="trade-card-body">
          {/* Left */}
          <div className="trade-left">
            <div className="trade-name">
              {name} <span className="trade-exchange">{exchange}</span>
              <span className="trade-ltp">
                LTP {ltp} (+{ltpChange}%)
              </span>
            </div>

            {["F&O", "Commodity", "Currency"].includes(category) && expiry && (
              <div className="trade-expiry">
                {expiry} {strike && <span>{strike}</span>}
              </div>
            )}

            <div className="trade-prices">
              <div>
                <div>Stop Loss</div>
                {Number(stopLoss).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <div>
                <div>Rec. Price</div>
                {Number(recPrice).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <div>
                <div>Target Price</div>
                {Number(targetPrice).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>

            <Divider sx={{ mb: 2, mt: 2 }} />

            {partialProfitText && (
              <div
                style={{
                  marginTop: "8px",
                  fontSize: "13px",
                  color: "green",
                  fontWeight: 500,
                }}
              >
                {partialProfitText}
              </div>
            )}
          </div>

          {/* Right */}
          <div style={{ textAlign: "right" }}>
            <div
              className="trade-status"
              style={{
                background: bg,
                color: color,
                borderTop: `1px solid ${border}`,
                borderLeft: `1px solid ${border}`,
                borderRight: `1px solid ${border}`,
              }}
            >
              {status}
            </div>

            <div className="trade-tags">
              <span className="trade-tag trade-category">{category}</span>
              <span className="trade-tag trade-label">{tag}</span>
            </div>

            <div className="trade-valid-till">Valid Till</div>
            <div className="trade-datetime">{dateTime}</div>

            {buySell && (
              <Button
                color={buySell === "Sell" ? "danger" : "success"}
                className="trade-button"
              >
                {buySell}
              </Button>
            )}
          </div>
        </CardBody>
      )}
    </Card>
  );
};

export default TradeCard;
