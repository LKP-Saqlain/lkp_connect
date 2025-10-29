import { Divider } from "@mui/material";
import React from "react";
import { Card, CardBody } from "reactstrap";
import "./TradeCard.css";
import dayjs from "dayjs";
import { capitalizeEachWord } from "../../../utils";
import RemoveIcon from "@mui/icons-material/Remove";
import useZoomLevel from "../../../hooks/useZoomLevel";

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
  bankAccNumber?: any;
  regnDate?: any;
  amount?: number;
  exchSegment?: any;
  selectedTab?: any;
  insertionTime?: any;
}

const TradeCard: React.FC<TradeCardProps> = ({
  stockName,
  exchange,
  // ltp,
  // ltpChange,
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
  exchSegment,
  selectedTab,
  insertionTime,
}) => {
  const zoom = useZoomLevel();

  const containerClass = zoom < 90 ? "trade-prices-2" : "trade-prices";

  const getStatusColor = () => {
    switch (status) {
      case "Open":
        return { bg: "#e6ffe6", color: "#009933", border: "#c2f0c2" };
      case "Closed":
        return { bg: "#ffe6e6", color: "#d32f2f", border: "#f5b3b3" };
      default:
        return { bg: "#fff3e6", color: "#ff6600", border: "#ffd6b3" };
    }
  };

  const formatInsertionTime = (value: string) => {
    if (!value) return "";
    const [datePart, timePart] = value.split(" ");
    const [day, month, year] = datePart.split("-");
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${day}-${monthNames[Number(month) - 1]}-${year} ${timePart}`;
  };

  const { bg, color, border } = getStatusColor();

  const cleanedDate = regnDate
    ?.replace(/\s+/g, " ")
    .replace(/(\d)(AM|PM)$/i, "$1 $2")
    .trim();

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
        <CardBody
          style={{
            padding: "12px 20px",
            // border: "1px solid grey",
            borderRadius: "2px",
            boxShadow: "4px rgba(0, 0, 0, 0.06)", // subtle shadow
          }}
        >
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
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "14px",
                  border: "1px solid black",
                }}
              >
                {clientName}
              </div>
              <div style={{ fontSize: "14px", color: "#666" }}>
                {capitalizeEachWord(status)}
              </div>
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
                  {/* {bankAccNumber} */}
                  xxxxxxxxxx{bankAccNumber.slice(-4)}
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
                  {dayjs(cleanedDate).isValid()
                    ? dayjs(cleanedDate).format("DD-MMM-YYYY")
                    : "Invalid Date"}
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
                  {Number(amount)?.toLocaleString("en-IN", {
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
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
            <div
              className="trade-name"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              {/* Buy/Sell Badge */}
              {buySell && (
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: "12px",
                    color: buySell === "Buy" ? "#0a8a0a" : "#d32f2f",
                    backgroundColor: buySell === "Buy" ? "#e8f5e9" : "#ffebee",
                    border: `1px solid ${
                      buySell === "Buy" ? "#469949" : "#df3434"
                    }`,
                    borderRadius: "5px",
                    padding: "2px 6px",
                    display: "inline-block",
                    minWidth: "25px",
                    textAlign: "center",
                  }}
                >
                  {buySell.charAt(0).toUpperCase()}
                </div>
              )}

              {/* Name + Exchange + Expiry in one row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  flexWrap: "wrap",
                }}
              >
                <span style={{ fontSize: "14px", fontWeight: 700 }}>
                  {name}
                  <span className="trade-exchange">{exchange}</span>
                </span>

                {["F&O", "Commodity", "Currency"].includes(category) &&
                  expiry && (
                    <div className="trade-tag">
                      {(selectedTab === 0 ||
                        selectedTab === 2 ||
                        selectedTab === 3) &&
                        exchSegment &&
                        (() => {
                          const seg = exchSegment.slice(0, 3).toUpperCase();

                          const getColors = (seg: string) => {
                            switch (seg) {
                              case "FUT":
                                return { bg: "#d4edda", color: "#2e7d32" }; // light green
                              case "CE":
                                return { bg: "#d6e9f9", color: "#1e88e5" }; // light blue
                              case "PE":
                                return { bg: "#ffe6cc", color: "#ff8c00" }; // light orange
                              default:
                                return { bg: "#f5f5f5", color: "#000" }; // neutral
                            }
                          };

                          const { bg, color } = getColors(seg);

                          return (
                            <>
                              {/* exchSegment (colored) */}
                              <span
                                className="trade-tag trade-category"
                                style={{
                                  marginRight: ".1rem",
                                  backgroundColor: bg,
                                  color: color,
                                }}
                              >
                                {seg}
                              </span>

                              {/* expiry (same color as exchSegment) */}
                              <span
                                className="trade-tag trade-category"
                                style={{
                                  marginRight: ".1rem",
                                  backgroundColor: bg,
                                  color: color,
                                }}
                              >
                                {expiry}
                              </span>

                              {/* strike (default style) */}
                              {strike && (
                                <span className="trade-tag trade-category">
                                  {strike}
                                </span>
                              )}
                            </>
                          );
                        })()}
                    </div>
                  )}
              </div>
            </div>

            <div
              className={containerClass}
              style={{ color: "#999999", fontSize: "12px" }}
            >
              <div>
                <div style={{ textAlign: "center" }}>Stop Loss</div>
                <div style={{ color: "#666", textAlign: "center" }}>
                  {Number(stopLoss).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>
              <div>
                <div style={{ textAlign: "center" }}>Rec. Price</div>
                <div style={{ color: "#666", textAlign: "center" }}>
                  {Number(recPrice).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>
              <div>
                <div style={{ textAlign: "center" }}>Target Price</div>
                <div style={{ color: "#666", textAlign: "center" }}>
                  {Number(targetPrice).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>
              <div>
                <div style={{ textAlign: "center" }}>Profit Potential</div>
                <div style={{ color: "#666", textAlign: "center" }}>
                  {(
                    ((Number(targetPrice) - Number(recPrice)) /
                      Number(recPrice)) *
                    100
                  ).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                  %
                </div>
              </div>
              <div>
                <div style={{ textAlign: "center" }}>
                  Call Publish Date & Time
                </div>
                <div style={{ color: "#666", textAlign: "center" }}>
                  {formatInsertionTime(insertionTime)}
                </div>
              </div>
            </div>

            <Divider sx={{ mb: 2, mt: 2 }} />
            <div
              className="trade-bottom"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              {partialProfitText && status !== "Open" && (
                <div
                  style={{
                    fontSize: "13px",
                    color: "green",
                    fontWeight: 500,
                    flex: 1,
                  }}
                >
                  {partialProfitText
                    .toLowerCase()
                    .replace(/\b\w/g, (char) => char.toUpperCase())}
                </div>
              )}
              <div
                style={{
                  position: "absolute",
                  bottom: status !== "Open" ? "12px" : "8px",
                  right: "16px",
                  fontWeight: 600,
                  fontSize: "13px",
                  color: color,
                  backgroundColor: bg,
                  border: `1px solid ${border}`,
                  borderRadius: "6px",
                  padding: "2px 8px",
                  display: "inline-block",
                  textAlign: "center",
                  minWidth: "60px",
                }}
              >
                {status}
              </div>
            </div>
          </div>

          {/* Right */}
          <div style={{ textAlign: "right" }}>
            <div className="trade-tags">
              <span className="trade-tag trade-label">{category}</span>
              <span className="trade-tag trade-category">{tag}</span>
            </div>

            <div
              style={{
                fontSize: "12px",
                color: "#999",
                // marginTop: expiry !== "" ? "1.8rem" : "0rem",
              }}
            >
              Valid Till
            </div>

            <div className="trade-datetime">
              {(() => {
                const parsedDate = dayjs(dateTime, "DD-MM-YYYY HH:mm:ss");
                return parsedDate.isAfter(dayjs()) ? (
                  parsedDate.format("DD-MMM-YYYY")
                ) : (
                  <RemoveIcon sx={{ fontSize: "15px", color: "#999" }} />
                );
              })()}
            </div>
          </div>
        </CardBody>
      )}
    </Card>
  );
};

export default TradeCard;
