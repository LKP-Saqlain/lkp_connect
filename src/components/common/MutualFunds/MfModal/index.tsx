import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
} from "reactstrap";
import { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import { banks, paymentOptions } from "../../../../pages/MutualFund/mfTypes";

interface MutualFundModalProps {
  isOpen: boolean;
  toggle: () => void;
  modalType: "oneTime" | "sip" | null;
  title?: string;
}

const MutualFundModal = ({
  isOpen,
  toggle,
  modalType,
  title,
}: MutualFundModalProps) => {
  const [amount, setAmount] = useState(500);
  const [selectedPaymentType, setSelectedPaymentType] = useState<string | null>(
    null
  );
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [sipDate, setSipDate] = useState<number | null>(null);
  const [dateSelected, setDateSelected] = useState<number | null>(null);
  const [upiId, setUpiId] = useState("");

  const handleBankSelect = (bankId: string) => {
    setSelectedBank(bankId);
    console.log("Selected Bank:", bankId);
  };

  useEffect(() => {
    if (!isOpen) {
      setAmount(500); // reset amount back to default
    }
    setSelectedBank(null);
    setSelectedPaymentType(null);
    setSipDate(null);
    setDateSelected(null);
  }, [isOpen]);

  const handleInvestClick = () => {
    if (modalType === "sip" && sipDate) {
      setDateSelected(sipDate);
    }
    alert(
      modalType === "oneTime"
        ? `Invested ₹${amount.toLocaleString()} Lumpsum  selected payment method ${selectedPaymentType}`
        : `Invested ₹${amount.toLocaleString()} SIP on date ${sipDate} selected payment method ${selectedPaymentType}`
    );
    // toggle();
  };
  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size="lg">
      <ModalHeader toggle={toggle}>
        {title} - {modalType === "oneTime" ? "Lumpsum Investment" : "Start SIP"}
      </ModalHeader>

      <ModalBody>
        {modalType === "oneTime" ? (
          // ✅ Lumpsum UI
          <div style={{ display: "flex", gap: "20px" }}>
            {/* Left - Amount */}
            <div style={{ flex: 1 }}>
              <Label style={{ fontWeight: 600, marginBottom: "8px" }}>
                {/* Select Bank account for payment
              </Label> */}
                Enter a Lumpsum Amount
              </Label>

              <TextField
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                fullWidth
                InputProps={{
                  style: {
                    fontSize: "20px", // bigger text inside
                    // fontWeight: 600,
                    // padding: "12px 14px", // increases box height
                  },
                }}
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px", // rounded edges
                  },
                }}
              />

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {[100, 500, 1000, 5000, 10000].map((val) => (
                  <Button
                    key={val}
                    variant="outlined"
                    onClick={() => setAmount(amount + val)}
                    style={{
                      //   fontWeight: 600,
                      fontSize: "14px",
                      padding: "6px 8px",
                      borderRadius: "6px",
                      color: "white",
                      backgroundColor: "#22629b",
                    }}
                  >
                    +{val.toLocaleString()}
                  </Button>
                ))}
              </div>
            </div>

            {/* Right - Bank Account */}
            <div style={{ flex: 1 }}>
              <Label style={{ fontWeight: 600, marginBottom: "8px" }}>
                Select Bank account for payment
              </Label>

              {banks.map((bank) => (
                <div
                  key={bank.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    border:
                      selectedBank === bank.id
                        ? "2px solid #004AAD"
                        : "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "4px 8px",
                    cursor: "pointer",
                    transition: "border 0.2s",
                    marginBottom: "10px",
                  }}
                  onClick={() => handleBankSelect(bank.id)}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <img
                      src={bank.logo}
                      alt={bank.name}
                      style={{
                        width: "40px",
                        height: "40px",
                        objectFit: "contain",
                      }}
                    />
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ fontWeight: 600, fontSize: "14px" }}>
                        {bank.name}
                      </span>
                      <span style={{ fontSize: "12px", color: "#666" }}>
                        {bank.account}
                      </span>
                    </div>
                  </div>

                  <input
                    type="radio"
                    name="bank"
                    value={bank.id}
                    checked={selectedBank === bank.id}
                    onChange={() => handleBankSelect(bank.id)}
                    style={{
                      accentColor: "#004AAD",
                      width: "16px",
                      height: "16px",
                    }}
                    onClick={(e) => e.stopPropagation()} // Prevent triggering parent click
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          // ✅ SIP UI (placeholder for now, you’ll fill later)
          <div style={{ display: "flex", gap: "20px" }}>
            {/* SIP Amount Section */}
            <div style={{ flex: 1 }}>
              <Label style={{ fontWeight: 600, marginBottom: "8px" }}>
                Enter an SIP Amount (Minimum Rs. 500)
              </Label>

              <TextField
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                fullWidth
                InputProps={{
                  style: { fontSize: "20px" },
                }}
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
              />

              {/* Quick Add Buttons */}
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {[100, 500, 1000, 2000].map((val) => (
                  <Button
                    key={val}
                    variant="outlined"
                    onClick={() => setAmount(amount + val)}
                    style={{
                      fontSize: "14px",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      color: "white",
                      backgroundColor: "#22629b",
                    }}
                  >
                    +{val.toLocaleString()}
                  </Button>
                ))}
              </div>

              {!dateSelected && (
                <p
                  style={{ fontSize: "12px", marginTop: "8px", color: "#666" }}
                >
                  Minimum gap between 2 SIP instalments: 30 days. Further
                  instalments would start only when 1st SIP payment is
                  successful. To avoid failure of future SIP instalments, enable
                  autopay mandate on this bank account.
                </p>
              )}
            </div>

            {/* SIP Date Section */}
            {dateSelected ? (
              <div style={{ flex: 1 }}>
                <Label style={{ fontWeight: 600, marginBottom: "8px" }}>
                  Select Bank account for payment
                </Label>

                {banks.map((bank) => (
                  <div
                    key={bank.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      border:
                        selectedBank === bank.id
                          ? "2px solid #004AAD"
                          : "1px solid #ddd",
                      borderRadius: "8px",
                      padding: "4px 8px",
                      cursor: "pointer",
                      transition: "border 0.2s",
                      marginBottom: "10px",
                    }}
                    onClick={() => handleBankSelect(bank.id)}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <img
                        src={bank.logo}
                        alt={bank.name}
                        style={{
                          width: "40px",
                          height: "40px",
                          objectFit: "contain",
                        }}
                      />
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontWeight: 600, fontSize: "14px" }}>
                          {bank.name}
                        </span>
                        <span style={{ fontSize: "12px", color: "#666" }}>
                          {bank.account}
                        </span>
                      </div>
                    </div>

                    <input
                      type="radio"
                      name="bank"
                      value={bank.id}
                      checked={selectedBank === bank.id}
                      onChange={() => handleBankSelect(bank.id)}
                      style={{
                        accentColor: "#004AAD",
                        width: "16px",
                        height: "16px",
                      }}
                      onClick={(e) => e.stopPropagation()} // Prevent triggering parent click
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ flex: 1 }}>
                <Label
                  style={{
                    fontWeight: 600,
                    marginBottom: "8px",
                    display: "block",
                  }}
                >
                  SIP Date
                </Label>

                {/* Calendar-like grid */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)", // 7 days like a week
                    gap: "10px",
                  }}
                >
                  {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                    <div
                      key={day}
                      onClick={() => setSipDate(day)}
                      style={{
                        padding: "3px",
                        textAlign: "center",
                        borderRadius: "8px",
                        border:
                          sipDate === day
                            ? "2px solid #004AAD"
                            : "1px solid #ddd",
                        backgroundColor: sipDate === day ? "#E6F0FF" : "#fff",
                        cursor: "pointer",
                        fontWeight: sipDate === day ? 600 : 400,
                        transition: "all 0.2s ease",
                      }}
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Selected date text */}
                {sipDate && (
                  <p
                    style={{
                      marginTop: "10px",
                      fontSize: "14px",
                      color: "#444",
                    }}
                  >
                    Selected SIP Date: <b>{sipDate}</b>
                  </p>
                )}
              </div>
            )}
          </div>
        )}
        {/* payment section */}
        {selectedBank && (
          <div>
            <div>
              <div style={{ marginTop: "12px" }}>
                {modalType === "sip" && sipDate && (
                  <>
                    <div style={{ fontWeight: 500, marginBottom: "6px" }}>
                      Selected SIP Date: <b>{sipDate}th</b>
                    </div>

                    <label
                      style={{
                        fontWeight: 600,
                        marginTop: "12px",
                        display: "block",
                      }}
                    >
                      Select Payment Type
                    </label>
                  </>
                )}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "16px",
                flexWrap: "wrap",
              }}
            >
              {paymentOptions.map((option) => (
                <div
                  key={option.id}
                  onClick={() => setSelectedPaymentType(option.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    border:
                      selectedPaymentType === option.id
                        ? "2px solid #004AAD"
                        : "1px solid #ccc",
                    borderRadius: "8px",
                    padding: "4px 8px",
                    cursor: "pointer",
                    minWidth: "200px",
                    flex: "1 1 200px",
                    transition: "border 0.2s",
                    backgroundColor:
                      selectedPaymentType === option.id ? "#f7faff" : "#fff",
                  }}
                >
                  <img
                    src={option.icon}
                    alt={option.name}
                    style={{ width: "30px", marginRight: "12px" }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{option.name}</div>
                    {option.description && (
                      <div style={{ fontSize: "12px", color: "#666" }}>
                        {option.description}
                      </div>
                    )}
                  </div>
                  <input
                    type="radio"
                    name="paymentType"
                    value={option.id}
                    checked={selectedPaymentType === option.id}
                    onChange={() => setSelectedPaymentType(option.id)}
                    style={{
                      accentColor: "#004AAD",
                      width: "16px",
                      height: "16px",
                      marginLeft: "8px",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              ))}
            </div>

            {/* ✅ Extra UPI Input Field & Verify Button */}
            {selectedPaymentType === "upi" && (
              <div style={{ marginTop: "16px", maxWidth: "400px" }}>
                <Label style={{ fontWeight: 600, marginBottom: "6px" }}>
                  Enter UPI ID
                </Label>
                <div style={{ display: "flex", gap: "10px" }}>
                  <TextField
                    fullWidth
                    placeholder="example@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    InputProps={{
                      style: {
                        padding: "6px 10px", // Optional, if needed
                        fontSize: "14px",
                      },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        height: "40px", // You can fix height to make it shorter
                      },
                    }}
                  />
                  <Button
                    style={{
                      backgroundColor: "#004AAD",
                      color: "#fff",
                      padding: "6px 16px",
                      fontSize: "14px",
                      height: "40px",
                    }}
                    onClick={() => {
                      if (!upiId) {
                        alert("Please enter a UPI ID.");
                      } else {
                        alert(`Verifying UPI ID: ${upiId}`);
                      }
                    }}
                  >
                    Verify
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Note Section */}
        <div
          style={{
            marginTop: "16px",
            padding: "10px",
            fontSize: "12px",
            color: "#2e7d32",
            background: "#e8f5e9",
            borderRadius: "6px",
          }}
        >
          For orders after <b>2:30 PM</b>, NAV would be applicable for the next
          business day. Max limit may vary depending upon the account type.
        </div>
      </ModalBody>

      <ModalFooter>
        {modalType === "sip" && (
          <div style={{ flex: 1, fontSize: "13px", color: "#666" }}>
            <div>
              1st Payment: <b>Today</b>
            </div>
            <div>
              Next Payment: <b>28th May, 2025</b>
            </div>
          </div>
        )}

        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
        <Button
          style={{ backgroundColor: "#1c517f" }}
          onClick={() => {
            handleInvestClick();
            // toggle();
          }}
        >
          {modalType === "oneTime" ? "Invest Now" : "Start SIP"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default MutualFundModal;
