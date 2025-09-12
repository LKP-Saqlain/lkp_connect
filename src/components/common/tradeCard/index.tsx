import { Divider } from "@mui/material";
import React from "react";
import { Card, CardBody, Button } from "reactstrap";
import "./TradeCard.css";

interface TradeCardProps {
  stockName: any;
  exchange: string;
  ltp: number;
  ltpChange: number;
  stopLoss: number;
  recPrice: number;
  targetPrice: number;
  status: "Open" | "Closed" | "Part Profit";
  category: string;
  tag: string;
  dateTime: string;
  partialProfitText?: string;
  buySell?: string;
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

  const { name, expiry, strike } = splitScripName(stockName);

  return (
    <Card className="trade-card">
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
    </Card>
  );
};

export default TradeCard;
