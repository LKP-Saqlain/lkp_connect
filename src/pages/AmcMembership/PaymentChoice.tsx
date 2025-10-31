import { useEffect, useState } from "react";
import { Row, Col, Button } from "reactstrap";
import { apiServices } from "../../services";
import { hideLoader, showLoader } from "../../redux/slices/loaderSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import ShowToast from "../../utils/toastUtils";
import { capitalizeEachWord } from "../../utils";

interface PaymentChoiceProps {
  clientData: any;
  onLedger: () => void;
  onOnline: () => void;
  goToStep4: () => void;
  setTotalPayable: (amount: number) => void;
}

const PaymentChoice = ({
  onLedger,
  onOnline,
  clientData,
  setTotalPayable,
  goToStep4,
}: PaymentChoiceProps) => {
  const [paymentStatus, setPaymentStatus] = useState<boolean | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );

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

  //----------- remove later--------------
  console.log(isLedgerSufficient, onLedger);

  // Format back into currency with ₹ and commas
  const formatCurrency = (num: number) =>
    `₹ ${num.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  useEffect(() => {
    checkPaymentStatus();
  }, []);

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
  };
  const checkPaymentStatus = async () => {
    const payload = {
      boid: clientData?.dP_ID,
      userId: user_id,
    };
    dispatch(showLoader("Checking payment status..."));
    try {
      const response = await apiServices.GetAMCActivationStatus(payload);
      console.log(
        "GetAMCActivationStatus Payment link response:",
        response?.data?.data[0]
      );
      if (response?.data?.data[0]?.message === "Record Found") {
        setPaymentStatus(true);
      } else {
        setPaymentStatus(false);
      }
    } catch (error) {
    } finally {
      dispatch(hideLoader());
    }
  };

  const handleClick = () => {
    if (paymentStatus === true) {
      onOnline(); // proceed to next step
      goToStep4();
    } else {
      handleOnlinePayment();
    }
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
              {/* <tr>
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
              </tr> */}

              {/* Insufficient balance message */}
              {/* {!isLedgerSufficient && (
                <tr>
                  <td
                    colSpan={2}
                    style={{ padding: "4px 8px", color: "#b30000" }}
                  >
                    Insufficient balance for ledger debit.
                  </td>
                </tr>
              )} */}
            </tbody>
          </table>
        </Col>
      </Row>

      <hr style={dividerStyle} />

      {/* Payment Buttons */}
      <div style={{ textAlign: "center" }}>
        {/* <p style={{ fontWeight: "600", color: "#000" }}>
          Select Payment Method
        </p> */}

        {/* <div style={buttonGroupStyle}>
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
          </button> */}

        {/* <span style={{ fontWeight: "500", color: "#555" }}>or</span> */}

        <Button
          style={{
            backgroundColor: "#003366",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "0.3rem 1.5rem",
          }}
          onClick={handleClick}
        >
          Make Payment
        </Button>
      </div>
      {/* </div> */}
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

// const buttonGroupStyle = {
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
//   gap: "1rem",
//   marginTop: "1rem",
// };

export default PaymentChoice;
