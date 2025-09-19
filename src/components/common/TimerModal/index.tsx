import React from "react";
import { Modal, ModalBody, ModalHeader, ModalFooter, Button } from "reactstrap";

type TimerModalProps = {
  isOpen: boolean;
  toggle: () => void;
  title?: string;
  message?: string;
  timerPage?: boolean;
  secondsLeft?: number;
  formatTime?: (seconds: number) => string;
  selectedPaymentType?: string;
  stopEnach?: boolean;
  selectedMandateId?: string;
  cancelLabel?: string;
  confirmLabel?: string;
  handleFinalConfirm?: () => void;
};

const TimerModal: React.FC<TimerModalProps> = ({
  isOpen,
  toggle,
  title = "Confirmation",
  message = "Please confirm the action.",
  timerPage = false,
  secondsLeft = 0,
  formatTime = (sec) => `${sec}s`,
  selectedPaymentType,
  stopEnach = false,
  selectedMandateId,
  cancelLabel = "Cancel",
  confirmLabel = "Confirm",
  handleFinalConfirm,
}) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size="md">
      <ModalHeader toggle={toggle}>
        {timerPage ? "Waiting For Confirmation" : title}
      </ModalHeader>

      <ModalBody>
        {timerPage ? (
          <div
            style={{
              textAlign: "center",
              padding: "24px 16px",
              fontFamily: "sans-serif",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                margin: "0 auto 16px",
                borderRadius: "50%",
                border: "4px solid #4CAF50",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                fontWeight: "bold",
                color: "#4CAF50",
              }}
            >
              {formatTime(secondsLeft)}
            </div>

            <h4 style={{ marginBottom: "10px" }}>Don't close this page!</h4>
            <p style={{ fontSize: "14px", color: "#333" }}>
              {selectedPaymentType === "upi"
                ? "Check your UPI app"
                : !stopEnach
                ? "Redirecting you to the E-Nach setup."
                : ""}
            </p>

            <div
              style={{
                backgroundColor: "#f8f8f8",
                padding: "12px",
                borderRadius: "8px",
                marginTop: "16px",
                fontSize: "13px",
                color: "#444",
              }}
            >
              Your SIPs will not get registered if you don't complete this
              process.
            </div>

            <p
              style={{
                fontSize: "13px",
                color: "#555",
                marginTop: "20px",
                lineHeight: "1.5",
              }}
            >
              This is a one-time activity in a single step.
              <br />
              {selectedPaymentType === "netbanking" &&
                "Enter Debit card / Netbanking / Aadhaar details to authenticate and proceed."}
            </p>
          </div>
        ) : (
          <div style={{ padding: "16px", fontSize: "14px", color: "#333" }}>
            {message}
          </div>
        )}
      </ModalBody>

      {/* ✅ Only show footer buttons when NOT on timer page */}
      {!timerPage && (
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            {cancelLabel}
          </Button>
          <Button
            color="primary"
            onClick={handleFinalConfirm}
            disabled={!selectedMandateId}
          >
            {confirmLabel}
          </Button>
        </ModalFooter>
      )}
    </Modal>
  );
};

export default TimerModal;
