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
import { banks } from "../../../../pages/MutualFund/mfTypes";

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

  const [selectedBank, setSelectedBank] = useState<string | null>(null);

  const handleBankSelect = (bankId: string) => {
    setSelectedBank(bankId);
    console.log("Selected Bank:", bankId);
  };

  useEffect(() => {
    if (!isOpen) {
      setAmount(500); // reset amount back to default
    }
  }, [isOpen]);
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
          <div>
            <h6>SIP Setup Coming Soon...</h6>
            {/* <p>
              Here you can render SIP-specific inputs (amount, frequency, dates
              etc.)
            </p> */}
            {/* <p style={{ fontSize: "12px", marginTop: "8px", color: "#666" }}>
              Please initiate autopay setup after completion of 1st SIP payment
              to avoid failure of future installments.
            </p> */}
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
            alert(
              modalType === "oneTime"
                ? `Invested ₹${amount.toLocaleString()} Lumpsum`
                : "SIP Started"
            );
            toggle();
          }}
        >
          {modalType === "oneTime" ? "Invest Now" : "Start SIP"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default MutualFundModal;
