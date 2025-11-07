import { useEffect, useRef, useState } from "react";
import { Button } from "reactstrap";
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf } from "react-icons/fa";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";
import { AppDispatch } from "../../../redux/store";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
import { apiServices } from "../../../services";

type ConfirmationProps = {
  onNext: () => void;
  onBackToStep2: () => void;
  flow: "ledger" | "online";
  selectedRow: any;
  totalPayable: number;
  complete: boolean;
};

const Confirmation = ({
  onNext,
  onBackToStep2,
  flow,
  selectedRow,
  totalPayable,
  complete,
}: ConfirmationProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const [timer, setTimer] = useState(600); // 10 minutes
  const [paymentStatus, setPaymentStatus] = useState<
    "waiting" | "success" | "failure"
  >("waiting");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isCheckingRef = useRef(false);
  const isActivatingRef = useRef(false);

  const isWaiting = paymentStatus === "waiting";
  const isSuccess = paymentStatus === "success";
  const isFailure = paymentStatus === "failure";
  const isComplete = complete === true;

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Activate AMC function
  const activateAMC = async (source: string) => {
    if (isActivatingRef.current) return;
    isActivatingRef.current = true;
    const payload = {
      tradingCode: selectedRow?.trading_Code,
      boid: selectedRow?.dP_ID,
      paymentAmount: totalPayable.toFixed(2),
      paymentType: flow,
      otP_ID: 1,
      option: "SaveAMC",
    };

    console.log("Activating AMC from", source, payload);

    dispatch(showLoader("Please wait, activating AMC..."));

    try {
      await apiServices.ActivateAMC(payload);
      setPaymentStatus("success");
    } catch (error) {
      console.error("Error activating AMC:", error);
      setPaymentStatus("failure");
    } finally {
      dispatch(hideLoader());
    }
  };

  // Polling payment response (online flow)
  const getPaymentResponse = async () => {
    if (isCheckingRef.current || isActivatingRef.current) return;
    isCheckingRef.current = true;
    const payload = {
      boid: selectedRow?.dP_ID,
      amount: totalPayable.toFixed(2),
    };

    try {
      const response = await apiServices.GetDPAMCPaymentResponse(payload);
      const paymentData = response?.data?.data;

      if (paymentData?.status === "Success" && paymentData?.transDate) {
        const transDate = dayjs(
          paymentData.transDate,
          "DD/MM/YYYY HH:mm:ss"
        ).toDate();
        const now = new Date();
        const TEN_MINUTES = 10 * 60 * 1000;

        if (Math.abs(now.getTime() - transDate.getTime()) <= TEN_MINUTES) {
          clearInterval(intervalRef.current!);
          setPaymentStatus("success");
          // Optionally trigger AMC activation here
        } else {
          setPaymentStatus("failure");
        }
      }
    } catch (error) {
      console.error("Error fetching payment response:", error);
    } finally {
      isCheckingRef.current = false;
    }
  };

  // Ledger flow: activate AMC immediately
  useEffect(() => {
    if (flow === "ledger") {
      setPaymentStatus("success");
      activateAMC("ledger");
    }
  }, [flow]);

  // Online flow: countdown timer and polling
  useEffect(() => {
    if (flow !== "online") return;

    const timerInterval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          clearInterval(intervalRef.current!);
          if (paymentStatus === "waiting") setPaymentStatus("failure");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    intervalRef.current = setInterval(getPaymentResponse, 7000);

    return () => {
      clearInterval(timerInterval);
      clearInterval(intervalRef.current!);
    };
  }, [flow, paymentStatus]);

  useEffect(() => {
    if (complete) setPaymentStatus("success");
  }, [complete]);

  // Render
  if (isComplete) {
    return (
      <div style={containerStyle}>
        <FaCheckCircle
          size={60}
          color="#28a745"
          style={{ margin: "2rem 0 1rem" }}
        />
        <h4 style={messageStyle}>
          Thank You for subscribing to the lifetime DP AMC Scheme.
        </h4>
        <Button style={buttonStyle} onClick={() => window.close()}>
          Close Tab
        </Button>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {/* Icons */}
      {isSuccess && (
        <FaCheckCircle
          size={60}
          color="#28a745"
          style={{ margin: "2rem 0 1rem" }}
        />
      )}
      {isFailure && (
        <FaTimesCircle
          size={60}
          color="#f44336"
          style={{ margin: "2rem 0 1rem" }}
        />
      )}
      {isWaiting && (
        <div style={{ position: "relative", width: 60, height: 60 }}>
          <div className="spinner" />
          <FaHourglassHalf
            size={20}
            color="#003366"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        </div>
      )}

      {/* Text */}
      {isSuccess && !isComplete && (
        <>
          <h4 style={messageStyle}>Payment Successful</h4>
          <p style={{ marginTop: "0.5rem", color: "#444" }}>
            Your payment of{" "}
            <strong>₹{totalPayable.toLocaleString("en-IN")}</strong> was
            successful.
          </p>
        </>
      )}
      {isFailure && (
        <h4 style={{ color: "#b30000", marginTop: "1rem" }}>
          Payment Failed or Timed Out
        </h4>
      )}
      {isWaiting && (
        <>
          <h4 style={messageStyle}>Payment Link Sent via Email & SMS</h4>
          <h5
            style={{ fontWeight: 500, color: "#003366", marginTop: "0.5rem" }}
          >
            Waiting for Client to Complete Payment
          </h5>
          <p
            style={{
              marginTop: "1.5rem",
              color: "#b30000",
              fontWeight: 600,
              fontSize: "17px",
            }}
          >
            Time Remaining: {formatTime(timer)}
          </p>
        </>
      )}

      {/* Button */}
      {!isWaiting && !isComplete && (
        <Button
          style={buttonStyle}
          onClick={() => (isSuccess ? onNext() : onBackToStep2())}
        >
          {isSuccess ? "Preview Tariff Form" : "Try Again"}
        </Button>
      )}

      {/* Spinner CSS */}
      <style>
        {`
          .spinner {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            border: 6px solid #e0e0e0;
            border-top-color: #003366;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

// Shared styles
const containerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  backgroundColor: "#fff",
  padding: "1rem",
  minHeight: "350px",
};

const messageStyle: React.CSSProperties = {
  fontWeight: 600,
  color: "#003366",
  maxWidth: "320px",
};

const buttonStyle: React.CSSProperties = {
  padding: "0.6rem 2rem",
  borderRadius: "6px",
  backgroundColor: "#003366",
  border: "none",
  marginTop: "1.5rem",
};

export default Confirmation;
