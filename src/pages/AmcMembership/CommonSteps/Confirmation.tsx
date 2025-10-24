import { Button } from "reactstrap";
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { apiServices } from "../../../services";
import { useEffect, useRef, useState } from "react";

type ConfirmationProps = {
  onNext: () => void;
  // status: 1 | 2 | 3; // 1: success, 2: failure, 3: waiting
  flow: "ledger" | "online";
  selectedRow: any;
  totalPayable: number;
  onBackToStep2: () => void;
};

const Confirmation = ({
  onNext,
  // status,
  flow,
  selectedRow,
  totalPayable,
  onBackToStep2,
}: ConfirmationProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const [timer, setTimer] = useState(300); // 5 minutes = 300 seconds
  // const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<
    "waiting" | "success" | "failure"
  >("waiting");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Derived UI states from paymentStatus
  const isWaiting = paymentStatus === "waiting";
  const isSuccess = paymentStatus === "success";
  const isFailure = paymentStatus === "failure";

  //  Helper: Format seconds → MM:SS
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  //  Function: Activate AMC
  const activateAMC = async (source: string) => {
    const payload = {
      tradingCode: selectedRow?.trading_Code,
      boid: selectedRow?.dP_ID,
      paymentAmount: totalPayable,
      paymentType: flow,
      otP_ID: 1,
      option: "SaveAMC",
    };

    console.log("🚀 Calling ActivateAMC from", source, payload);

    dispatch(showLoader("Please wait, activating AMC..."));

    try {
      const response = await apiServices.ActivateAMC(payload);
      console.log(" ActivateAMC Response:", response);
      setPaymentStatus("success");
    } catch (error) {
      console.error(" Error activating AMC:", error);
      setPaymentStatus("failure");
    } finally {
      dispatch(hideLoader());
    }
  };

  //  Function: Poll payment response (for online)
  const getPaymentResponse = async () => {
    const payload = {
      boid: selectedRow?.dP_ID,
      amount: totalPayable.toString(),
    };
    // {
    //   boid: "1203000001017198",
    //   amount: "2777.84",
    // };

    console.log("Checking payment status...", payload);

    try {
      const response = await apiServices.GetDPAMCPaymentResponse(payload);
      const paymentData = response?.data?.data;
      console.log("Payment Response:", paymentData);

      if (paymentData?.status === "Success" && paymentData?.transDate) {
        const transDate = new Date(paymentData.transDate);
        const now = new Date();

        // Calculate time difference in milliseconds
        const timeDifference = Math.abs(now.getTime() - transDate.getTime());

        // Check if within 5 minutes (5 * 60 * 1000 ms)
        const FIVE_MINUTES = 5 * 60 * 1000;

        if (timeDifference <= FIVE_MINUTES) {
          console.log(
            "Payment Success within 5 minutes, triggering AMC activation..."
          );
          clearInterval(intervalRef.current!);
          setPaymentStatus("success");
          activateAMC("online-success");
        } else {
          setPaymentStatus("failure");
        }
      }
    } catch (error) {
      console.error("Error fetching payment response:", error);
    }
  };

  //  useEffect: Handle ledger flow immediately
  useEffect(() => {
    if (flow === "ledger") {
      setPaymentStatus("success");
      activateAMC("ledger");
    }
    // else {
    //   const now = new Date();
    //   setCurrentTime(now);
    // }
  }, [flow]);

  //  useEffect: Start timer & polling for online
  useEffect(() => {
    if (flow === "online") {
      // Timer countdown
      const timerInterval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timerInterval);
            clearInterval(intervalRef.current!);
            if (paymentStatus === "waiting") {
              console.warn("⏰ Timer finished, marking payment as failed");
              setPaymentStatus("failure");
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Start polling every 5 sec
      intervalRef.current = setInterval(() => {
        getPaymentResponse();
      }, 10000);

      // Cleanup
      return () => {
        clearInterval(timerInterval);
        clearInterval(intervalRef.current!);
      };
    }
  }, [flow, paymentStatus]);

  //  UI
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        backgroundColor: "#fff",
        padding: "1rem",
        minHeight: "350px",
      }}
    >
      {/* ICONS */}
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

      {/* TEXT */}
      {isSuccess && (
        <>
          <h4 style={{ fontWeight: 600, color: "#003366" }}>
            Payment Successful
          </h4>
          <p style={{ marginTop: "0.5rem", color: "#444" }}>
            Your payment of{" "}
            <strong>₹{totalPayable?.toLocaleString("en-IN")}</strong> was
            successful.
          </p>
        </>
      )}

      {isFailure && (
        <h4 style={{ fontWeight: 600, color: "#b30000", marginTop: "1rem" }}>
          Payment Failed or Timed Out
        </h4>
      )}

      {isWaiting && (
        <>
          <h4
            style={{ fontWeight: 600, color: "#003366", marginTop: "1.5rem" }}
          >
            Payment Link Sent via Email & SMS
          </h4>
          <h5
            style={{ fontWeight: 500, color: "#003366", marginTop: "0.5rem" }}
          >
            Waiting for Client to Complete Payment
          </h5>

          {/* Countdown Timer */}
          <p
            style={{
              marginTop: "1.5rem",
              color: "#b30000",
              fontWeight: 600,
            }}
          >
            Time Remaining: {formatTime(timer)}
          </p>
        </>
      )}

      {/* BUTTON */}
      {!isWaiting && (
        <Button
          color="primary"
          style={{
            padding: "0.6rem 2rem",
            borderRadius: "6px",
            backgroundColor: "#003366",
            border: "none",
            marginTop: "1.5rem",
          }}
          onClick={() => {
            if (isSuccess) {
              onNext(); // move to next (Tariff Preview)
            } else if (isFailure) {
              onBackToStep2(); // 👈 return to Step 2 if failed
            }
          }}
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

export default Confirmation;
