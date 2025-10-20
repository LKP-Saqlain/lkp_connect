import { useEffect } from "react";
import { Row, Col, Button } from "reactstrap";
import { apiServices } from "../../services";
import { hideLoader, showLoader } from "../../redux/slices/loaderSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import ShowToast from "../../utils/toastUtils";
import { capitalizeEachWord } from "../../utils";

interface PaymentChoiceProps {
  clientData: any;
  onLedger: () => void;
  onOnline: () => void;
  setTotalPayable: (amount: number) => void;
}

const PaymentChoice = ({
  onLedger,
  onOnline,
  clientData,
  setTotalPayable,
}: PaymentChoiceProps) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    console.log(" clientData from payment:", clientData);
  }, [clientData]);

  // Fixed AMC details
  const amcFee = "₹ 1,770";
  const amcBreakup = "₹ 1500 + GST";

  // Helper to safely parse numbers from currency or numeric strings
  const parseCurrency = (val: any) =>
    val
      ? Number(
          String(val)
            .replace(/[^\d.-]/g, "")
            .replace(/,/g, "")
        )
      : 0;

  // Extract dynamic values from API response
  const existingOutstanding = parseCurrency(
    clientData?.existing_dp_outstanding
  );
  const ledgerBalance = parseCurrency(clientData?.ledgerbalance);
  const amcAmount = parseCurrency(amcFee);

  // Compute totals
  const totalPayable = existingOutstanding + amcAmount;

  useEffect(() => {
    setTotalPayable(totalPayable);
  }, [totalPayable, setTotalPayable]);

  // Determine if ledger payment is possible
  const isLedgerSufficient = ledgerBalance >= totalPayable;

  // Format back into currency with ₹ and commas
  const formatCurrency = (num: number) =>
    `₹ ${num.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const handleOnlinePayment = async () => {
    const payload = {
      boid: clientData?.dP_ID,
    };
    dispatch(showLoader("Sending payment link to your email..."));
    try {
      const response = await apiServices.SendDPAMCEmail(payload);
      console.log(" Payment link response:", response);
      if (response?.data?.isSuccess) {
        ShowToast("success", capitalizeEachWord(response?.data?.data));
        onOnline(); // proceed to next step
      } else {
      }
    } catch (error) {
    } finally {
      dispatch(hideLoader());
    }
    // onOnline();
  };

  return (
    <>
      {/* Payment Details */}
      <Row style={{ padding: "0 1rem" }}>
        <Col md="12" className="mb-3">
          <p>
            <strong>Existing DP Outstanding:</strong>{" "}
            <span style={{ color: "#333" }}>
              {formatCurrency(existingOutstanding)}
            </span>
          </p>

          <hr style={dividerStyle} />

          <p>
            <strong>Lifetime AMC Fee:</strong>{" "}
            <span style={{ color: "#333" }}>
              {amcFee} <small>({amcBreakup})</small>
            </span>
          </p>

          <hr style={dividerStyle} />

          <p>
            <strong>Total Payable Amount:</strong>{" "}
            <span style={{ color: "#333", fontWeight: 600 }}>
              {formatCurrency(totalPayable)}
            </span>
          </p>

          <div style={ledgerBoxStyle}>
            <strong>Ledger Balance:</strong>{" "}
            <span
              style={{
                color: isLedgerSufficient ? "#1c3c6b" : "#b30000",
                fontWeight: 600,
              }}
            >
              {formatCurrency(ledgerBalance)}
            </span>
            {!isLedgerSufficient && (
              <p style={{ color: "#b30000", marginTop: "5px" }}>
                Insufficient balance for ledger payment.
              </p>
            )}
          </div>
        </Col>
      </Row>

      <hr style={dividerStyle} />

      {/* Payment Buttons */}
      <div style={{ textAlign: "center" }}>
        <p style={{ fontWeight: "600", color: "#000" }}>
          Select Payment Method
        </p>

        <div style={buttonGroupStyle}>
          <Button
            style={{
              backgroundColor: isLedgerSufficient ? "#003366" : "#d3d3d3",
              color: isLedgerSufficient ? "#fff" : "#000",
              border: "none",
              borderRadius: "6px",
              padding: "0.6rem 1.5rem",
              cursor: isLedgerSufficient ? "pointer" : "not-allowed",
            }}
            onClick={onLedger}
            disabled={!isLedgerSufficient}
          >
            Debit from Ledger
          </Button>

          <span style={{ fontWeight: "500", color: "#555" }}>or</span>

          <Button
            style={{
              backgroundColor: "#003366",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              padding: "0.6rem 1.5rem",
            }}
            onClick={handleOnlinePayment}
          >
            Online Payment
          </Button>
        </div>
      </div>
    </>
  );
};

// 🔹 Shared styles
const dividerStyle = {
  border: "none",
  borderTop: "1px dotted #999",
  margin: "1rem 0",
};

const ledgerBoxStyle = {
  backgroundColor: "#f8f9fa",
  padding: "0.75rem 1rem",
  borderRadius: "8px",
  marginTop: "1rem",
  border: "1px solid #eee",
};

const buttonGroupStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "1rem",
  marginTop: "1rem",
};

export default PaymentChoice;
