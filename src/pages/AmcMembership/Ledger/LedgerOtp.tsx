import React, { useState, useEffect, ChangeEvent } from "react";
import { Button, Input } from "reactstrap";

interface LedgerOtpProps {
  onNext: () => void;
}

const LedgerOtp: React.FC<LedgerOtpProps> = ({ onNext }) => {
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [timer, setTimer] = useState<number>(59);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (val: string, index: number) => {
    if (!/^\d?$/.test(val)) return; // Only allow single digit 0–9
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Auto-focus next input if value entered
    if (val && index < 3) {
      const nextInput = document.getElementById(
        `otp-${index + 1}`
      ) as HTMLInputElement | null;
      nextInput?.focus();
    }
  };

  const handleProceed = () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 4) {
      alert("Please enter a valid 4-digit OTP");
      return;
    }
    onNext();
  };

  return (
    <div
      style={{
        textAlign: "center",
        padding: "2rem 1rem",
        color: "#1c3c6b",
      }}
    >
      {/* Title */}
      <h5
        style={{
          fontWeight: 600,
          marginBottom: "1.5rem",
          color: "#1c3c6b",
        }}
      >
        Client Consent by OTP for Ledger Debit
      </h5>

      {/* Subtitle */}
      <p
        style={{
          fontWeight: 600,
          color: "#1c3c6b",
          marginBottom: "0.5rem",
          fontSize: "1rem",
        }}
      >
        Enter OTP
      </p>

      <p
        style={{
          color: "#666",
          fontSize: "0.9rem",
          marginBottom: "2rem",
        }}
      >
        OTP sent to your mobile number - <strong>XXXXXX5856</strong> &amp; Email
        ID - <strong>rahulsharma@gmail.com</strong> to confirm Ledger Debit.
      </p>

      {/* OTP Input */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {otp.map((digit, i) => (
          <Input
            key={i}
            id={`otp-${i}`}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleChange(e.target.value, i)
            }
            style={{
              width: "50px",
              height: "50px",
              textAlign: "center",
              fontSize: "1.5rem",
              border: "none",
              borderBottom: "2px solid #1c3c6b",
              borderRadius: 0,
              outline: "none",
              backgroundColor: "transparent",
            }}
          />
        ))}
      </div>

      {/* Proceed Button */}
      <Button
        color="primary"
        onClick={handleProceed}
        style={{
          backgroundColor: "#0b3155",
          border: "none",
          borderRadius: "6px",
          padding: "0.6rem 2rem",
          fontWeight: 500,
          fontSize: "0.95rem",
        }}
      >
        Proceed
      </Button>

      {/* Timer */}
      <p
        style={{
          color: "#555",
          marginTop: "1rem",
          fontSize: "0.85rem",
        }}
      >
        Resend OTP in <strong>{timer}</strong> seconds
      </p>
    </div>
  );
};

export default LedgerOtp;
