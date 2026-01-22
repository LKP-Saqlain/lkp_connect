import { useState, useEffect, ChangeEvent } from "react";
import { useDispatch } from "react-redux";
import { Button, Input } from "reactstrap";
import { AppDispatch } from "../../../redux/store";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { apiServices } from "../../../services";

interface LedgerOtpProps {
  onNext: () => void;
  clientData: any;
}

const LedgerOtp = ({ onNext, clientData }: LedgerOtpProps) => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState<number>(59);
  const [otpVerify, setOtpVerify] = useState<boolean>(false);
  const [otpSent, setOtpSent] = useState<boolean>(false);
  // const [serverOtp, setServerOtp] = useState<string | null>(null); // for debugging (remove in prod)
  const dispatch = useDispatch<AppDispatch>();

  // Timer countdown
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);
  console.log(clientData, "mobile and email OTP");

  // 🔹 Send OTP on component mount
  useEffect(() => {
    const sendOtp = async () => {
      const payload = {
        mobileNo: clientData?.mob,
        // mobileNo: "99693727591",
        otp: "",
        action: "Send",
        emailId: clientData?.em,
      };

      dispatch(showLoader("Sending OTP to your registered mobile..."));

      try {
        const response = await apiServices.ProcessOTP(payload);
        console.log("📩 OTP Sent Response:", response);

        if (response?.data?.isSuccess) {
          setOtpSent(true);
          // setServerOtp(response?.data?.data?.otp || null); // debug only
          setTimer(59); // restart timer
        } else {
          console.warn(" Failed to send OTP");
        }
      } catch (error) {
        console.error(" Error sending OTP:", error);
      } finally {
        dispatch(hideLoader());
      }
    };

    sendOtp();
  }, [dispatch, clientData]);

  // 🔹 Handle OTP input
  const handleChange = (val: string, index: number) => {
    if (!/^\d?$/.test(val)) return; // only allow single digit
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // auto-focus next input
    if (val && index < otp.length - 1) {
      const nextInput = document.getElementById(
        `otp-${index + 1}`
      ) as HTMLInputElement | null;
      nextInput?.focus();
    }
  };

  // 🔹 Handle Verify OTP
  const handleProceed = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 4) {
      alert("Please enter a valid 4-digit OTP");
      return;
    }

    const payload = {
      mobileNo: clientData?.mob,
      // mobileNo: "99693727591",
      otp: enteredOtp,
      action: "Verify",
      emailId: clientData?.em,
    };

    dispatch(showLoader("Verifying OTP..."));

    try {
      const response = await apiServices.ProcessOTP(payload);
      console.log(" Verify OTP Response:", response);

      const isVerified = response?.data?.data?.isVerified === 1;
      setOtpVerify(isVerified);

      if (isVerified) {
        console.log(" OTP Verified Successfully");
        onNext(); // move forward
      } else {
        alert("Invalid OTP, please try again");
      }
    } catch (error) {
      console.error(" Error verifying OTP:", error);
    } finally {
      dispatch(hideLoader());
    }
  };

  // 🔹 Handle Resend OTP
  const handleResend = async () => {
    if (timer > 0) return; // prevent early resend
    setOtp(["", "", "", "", "", ""]); // reset OTP input
    setOtpVerify(false);
    setOtpSent(false);

    const payload = {
      mobileNo: clientData?.mob,
      // mobileNo: "99693727591",
      otp: "",
      action: "Send",
      emailId: clientData?.em,
    };

    dispatch(showLoader("Resending OTP..."));

    try {
      const response = await apiServices.ProcessOTP(payload);
      console.log(" Resend OTP Response:", response);

      if (response?.data?.isSuccess) {
        setOtpSent(true);
        setTimer(59);
        alert("OTP resent successfully");
      }
    } catch (error) {
      console.error(" Error resending OTP:", error);
    } finally {
      dispatch(hideLoader());
    }
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
      <h5 style={{ fontWeight: 600, marginBottom: "1.5rem" }}>
        Client Consent by OTP for Ledger Debit
      </h5>

      {/* Subtitle */}
      <p style={{ fontWeight: 600, color: "#1c3c6b", marginBottom: "0.5rem" }}>
        Enter OTP
      </p>

      <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: "2rem" }}>
        OTP sent to your mobile number -{" "}
        <strong>
          {clientData?.mob ? `XXXXXX${clientData.mob.slice(-4)}` : "XXXXXX5856"}
        </strong>{" "}
        <br />
        &amp; Email ID - <strong>
          {clientData?.em || "user@email.com"}
        </strong>{" "}
        to confirm Ledger Debit.
      </p>

      {/* OTP Input Boxes */}
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
              backgroundColor: "transparent",
              borderRadius: 0,
            }}
          />
        ))}
      </div>

      {/* Proceed Button */}
      <Button
        color="primary"
        onClick={handleProceed}
        disabled={!otpSent}
        style={{
          backgroundColor: "#0b3155",
          border: "none",
          borderRadius: "6px",
          padding: "0.3rem 2rem",
          fontWeight: 500,
          fontSize: "0.95rem",
        }}
      >
        {otpVerify ? "Verified " : "Proceed"}
      </Button>

      {/* Timer + Resend */}
      <p
        style={{
          color: "#555",
          marginTop: "1rem",
          fontSize: "0.85rem",
          cursor: timer === 0 ? "pointer" : "default",
        }}
        onClick={handleResend}
      >
        {timer > 0 ? (
          <>
            Resend OTP in <strong>{timer}</strong> seconds
          </>
        ) : (
          <span style={{ color: "#0b3155", fontWeight: 600 }}>Resend OTP</span>
        )}
      </p>

      {/* Debug info (optional) */}
      {/* {serverOtp && (
        <p style={{ fontSize: "0.8rem", color: "gray" }}>
          (Test OTP: <strong>{serverOtp}</strong>)
        </p>
      )} */}
    </div>
  );
};

export default LedgerOtp;
