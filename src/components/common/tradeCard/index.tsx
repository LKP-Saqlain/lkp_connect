import { Divider } from "@mui/material";
import React from "react";
import { Card, CardBody, Button } from "reactstrap";

interface TradeCardProps {
  stockName: any;
  exchange: string;
  ltp: number;
  ltpChange: number;
  stopLoss: number;
  recPrice: number;
  targetPrice: number;
  //   profitPotential: number;
  //   potentialLeft: number;
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
  //   profitPotential,
  //   potentialLeft,
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
        return { bg: "#e6ffe6", color: "#009933" };
      case "Closed":
        return { bg: "#ffe6e6", color: "#cc0000" };
      default:
        return { bg: "#fff3e6", color: "#ff6600" };
    }
  };
  const { bg, color } = getStatusColor();

  const splitScripName = (scrip: string) => {
    const parts = scrip.split(" ");
    const dateIndex = parts.findIndex(
      (p, i) =>
        i + 2 < parts.length &&
        /^\d{1,2}$/.test(p) &&
        /^\d{1,2}$/.test(parts[i]) && // day
        /^[A-Za-z]{3}$/.test(parts[i + 1]) && // month
        /^\d{4}$/.test(parts[i + 2]) // year
    );
    if (dateIndex !== -1) {
      const name = parts.slice(0, dateIndex).join(" "); // stock name
      const expiry = parts.slice(dateIndex, dateIndex + 3).join(" "); // 28 Aug 2025
      const strike = parts.slice(dateIndex + 3).join(" "); // CE 280.00 (optional)
      return { name, expiry, strike };
    }

    return { name: scrip, expiry: "", strike: "" };
  };
  const { name, expiry, strike } = splitScripName(stockName);
  return (
    <Card
      style={{
        borderRadius: "10px",
        marginBottom: "40px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        border: "1px solid #eee",
      }}
    >
      <CardBody style={{ padding: "12px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {/* Left Side */}
          <div>
            <div
              style={{
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: "18px" }}>
                  {name}{" "}
                  <span style={{ color: "#666", fontSize: "8px" }}>
                    {exchange}
                  </span>
                  <span style={{ fontSize: "12px", color: "green" }}>
                    {"  "}
                    LTP {ltp} (+{ltpChange}%)
                  </span>
                </div>

                {["F&O", "Commodity", "Currency"].includes(category) &&
                  expiry && (
                    <div
                      style={{
                        backgroundColor: "#FFF3CD",
                        color: "#856404",
                        display: "inline-block",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        fontSize: "8px",
                        marginTop: "2px",
                      }}
                    >
                      {expiry} {strike && <span>{strike}</span>}
                    </div>
                  )}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "220px",
                marginTop: "2px",
                fontSize: "13px",
              }}
            >
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
              {/* <div>
                <div>Profit Potential</div>
                <div style={{ color: "green" }}>{profitPotential}%</div>
              </div>
              <div>
                <div>Potential Left</div>
                <div>{potentialLeft}%</div>
              </div> */}
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

          {/* Right Side */}
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                position: "absolute",
                top: "-25px",
                right: "0px",
                background: bg,
                color: color,
                padding: "3px 8px",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              {status}
            </div>
            <div style={{ margin: "5px 0" }}>
              <span
                style={{
                  fontSize: "12px",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  background: "#ffe6cc",
                  color: "#ff6600",
                  marginRight: "6px",
                }}
              >
                {category}
              </span>
              <span
                style={{
                  fontSize: "12px",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  background: "#e6f7e6",
                  color: "#009933",
                }}
              >
                {tag}
              </span>
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "#999",
                marginTop: expiry !== "" ? "22px" : "0px",
              }}
            >
              Valid Till
            </div>
            <div style={{ fontSize: "12px", color: "#666" }}>{dateTime}</div>
            <Button
              color={buySell === "Sell" ? "danger" : "success"}
              style={{
                marginTop: expiry !== "" ? "28px" : "22px",
                padding: "2px 16px",
                fontSize: "13px",
                borderRadius: "6px",
                // color: "#fff",
              }}
            >
              {buySell}
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default TradeCard;
