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
  // const ledgerBalance = "435345";
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
      <Row
        style={{
          padding: "0 1rem",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Col
          md="12"
          className="mb-3"
          style={{
            textAlign: "left",
            maxWidth: "400px", // slightly wider for a balanced table look
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              color: "#333",
              fontSize: "14px",
            }}
          >
            <tbody>
              {/* Existing DP Outstanding */}
              <tr>
                <td style={{ padding: "6px 8px", fontWeight: 600 }}>
                  Existing DP Outstanding:
                </td>
                <td style={{ fontWeight: 600, padding: "6px 8px" }}>
                  {formatCurrency(existingOutstanding)}
                </td>
              </tr>

              <tr>
                <td colSpan={2}>
                  <hr style={dividerStyle} />
                </td>
              </tr>

              {/* Lifetime AMC Fee */}
              <tr>
                <td style={{ padding: "6px 8px", fontWeight: 600 }}>
                  Lifetime AMC Fee:
                </td>
                <td style={{ fontWeight: 600, padding: "6px 8px" }}>
                  {amcFee} <small>({amcBreakup})</small>
                </td>
              </tr>

              <tr>
                <td colSpan={2}>
                  <hr style={dividerStyle} />
                </td>
              </tr>

              {/* Total Payable Amount */}
              <tr>
                <td style={{ padding: "6px 8px", fontWeight: 600 }}>
                  Total Payable Amount:
                </td>
                <td
                  style={{
                    padding: "6px 8px",
                    fontWeight: 600,
                    // color: "#1c3c6b",
                  }}
                >
                  {formatCurrency(totalPayable)}
                </td>
              </tr>

              <tr>
                <td colSpan={2}>
                  <hr style={dividerStyle} />
                </td>
              </tr>

              {/* Ledger Balance */}
              <tr>
                <td style={{ padding: "6px 8px", fontWeight: 600 }}>
                  Ledger Balance:
                </td>
                <td
                  style={{
                    padding: "6px 8px",
                    fontWeight: 700,
                    color: isLedgerSufficient ? "#1c3c6b" : "#b30000",
                  }}
                >
                  {formatCurrency(ledgerBalance)}
                </td>
              </tr>

              {/* Insufficient balance message */}
              {!isLedgerSufficient && (
                <tr>
                  <td
                    colSpan={2}
                    style={{ padding: "4px 8px", color: "#b30000" }}
                  >
                    Insufficient balance for ledger debit.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Col>
      </Row>

      <hr style={dividerStyle} />

      {/* Payment Buttons */}
      <div style={{ textAlign: "center" }}>
        <p style={{ fontWeight: "600", color: "#000" }}>
          Select Payment Method
        </p>

        <div style={buttonGroupStyle}>
          <button
            style={{
              backgroundColor: isLedgerSufficient ? "#003366" : "#d3d3d3",
              color: isLedgerSufficient ? "#fff" : "#000",
              border: "none",
              borderRadius: "6px",
              padding: "0.3rem 1.5rem",
              cursor: isLedgerSufficient ? "pointer" : "not-allowed",
            }}
            onClick={onLedger}
            disabled={!isLedgerSufficient}
          >
            Debit from Ledger
          </button>

          <span style={{ fontWeight: "500", color: "#555" }}>or</span>

          <Button
            style={{
              backgroundColor: "#003366",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              padding: "0.3rem 1.5rem",
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

// const ledgerBoxStyle = {
//   backgroundColor: "#f8f9fa",
//   padding: "0.75rem 1rem",
//   borderRadius: "8px",
//   marginTop: "1rem",
//   border: "1px solid #eee",
// };

const buttonGroupStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "1rem",
  marginTop: "1rem",
};

export default PaymentChoice;
