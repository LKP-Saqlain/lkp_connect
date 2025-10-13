import { Button } from "reactstrap";
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf } from "react-icons/fa";

type ConfirmationProps = {
  onNext: () => void;
  status: 1 | 2 | 3; // 1: success, 2: failure, 3: waiting
};

const Confirmation = ({ onNext, status }: ConfirmationProps) => {
  const isSuccess = status === 1;
  const isFailure = status === 2;
  const isWaiting = status === 3;
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
        minHeight: "300px",
      }}
    >
      {/* Icon */}
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

      {/* Message */}
      {isSuccess && (
        <>
          <h4 style={{ fontWeight: "600", color: "#003366" }}>
            Payment Successful
          </h4>
          <p style={{ marginTop: "0.5rem", color: "#444" }}>
            Almost there! <br />
            Complete the final steps to finish your application.
          </p>
        </>
      )}

      {isFailure && (
        <h4 style={{ fontWeight: "600", color: "#003366" }}>
          Payment Unsuccessful
        </h4>
      )}

      {isWaiting && (
        <>
          <h4
            style={{ fontWeight: "600", color: "#003366", marginTop: "1.5rem" }}
          >
            Payment link sent on Email & SMS
          </h4>
          <h5
            style={{ fontWeight: "600", color: "#003366", marginTop: "1rem" }}
          >
            Waiting for Client to make the Payment
          </h5>
        </>
      )}

      {/* Button (not shown for waiting) */}
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
          onClick={onNext}
        >
          {isSuccess ? "Preview Tariff Form" : "Please Try Again!"}
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
