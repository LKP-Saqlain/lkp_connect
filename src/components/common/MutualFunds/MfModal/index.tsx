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
import {
  paymentOptions,
  MutualFundModalProps,
  BankDetail,
} from "../../../../pages/MutualFund/mfTypes";
import NestedModal from "./NestedModal/index";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../redux/store";
import { hideLoader, showLoader } from "../../../../redux/slices/loaderSlice";
import { apiServices } from "../../../../services";
import BankCard from "../../BankRadio";
import ShowToast from "../../../../utils/toastUtils";
import { getNextPaymentDateString } from "../../../../helper/commmon";
// import TimerModal from "../../TimerModal";

const MutualFundModal = ({
  isOpen,
  toggle,
  modalType,
  title,
  bseSchemeCode,
  hasToken,
}: MutualFundModalProps) => {
  const [amount, setAmount] = useState<string>("500");
  const [selectedPaymentType, setSelectedPaymentType] = useState<string | null>(
    null
  );
  const [banks, setBanks] = useState<BankDetail[]>([]);
  const [selectedBank, setSelectedBank] = useState<BankDetail | null>(null);
  const [sipDate, setSipDate] = useState<number | null>(null);
  const [dateSelected, setDateSelected] = useState<number | null>(null);
  const [upiId, setUpiId] = useState("");
  const [upiVerified, setUpiVerified] = useState<boolean>();
  const [email, setEmail] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [clientNo, setClientNo] = useState("");
  const [isNestedModalOpen, setNestedModalOpen] = useState(false);
  const toggleNestedModal = () => setNestedModalOpen((prev) => !prev);
  const [upiName, setUpiName] = useState("");

  const dispatch = useDispatch<AppDispatch>();

  const handleBankSelect = (bankId: number) => {
    const selected = banks.find((bank) => bank.id === bankId);
    if (selected) {
      setSelectedBank(selected);
      console.log("Selected Bank:", {
        code: selected.code,
        account: selected.account,
        ifsc: selected.ifsc,
        api_paymentMode: selected.paymentMode,
      });
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setAmount("500");
      setSelectedBank(null);
      setSelectedPaymentType(null);
      setSipDate(null);
      setDateSelected(null);
      setUpiId("");
      setUpiVerified(undefined);
      setUpiName("");
    }
    console.log(bseSchemeCode, "bseSchemeCode");
  }, [isOpen]);

  const extractOrderNumber = (responseData: string): string | null => {
    const match = responseData.match(/ORDER NO: (\d+)/);
    return match ? match[1] : null;
  };

  const createLumpsumOrder = async () => {
    const payload = {
      transCode: "NEW",
      orderId: "",
      clientCode: clientNo,
      schemeCd: bseSchemeCode,
      buySell: "P",
      buySellType: "FRESH",
      orderVal: amount,
      qty: "",
      allRedeem: "N",
      folioNo: "",
      remarks: "test",
      dpc: "Y",
      euinVal: "Y",
      kycStatus: "Y",
      refNo: "",
      subBrCode: "",
      minRedeem: "",
      dpTxn: "C",
      ipAdd: "",
      mobileNo: mobileNo,
      emailID: email,
      mandateID: "",
      param1: "",
      param2: "",
      param3: "",
      filler1: "",
      filler2: "",
      filler3: "",
      filler4: "",
      filler5: "",
      filler6: "",
    };

    dispatch(showLoader("Placing Lumpsum Order..."));

    try {
      const response = await apiServices.BSEStar_MfOrderEntry(payload);

      if (response?.status === 200) {
        const rawData = response?.data?.data;
        console.log("Order Entry Response:", rawData);

        const orderNumber = extractOrderNumber(rawData);
        console.log("orderNo orderNumber is", orderNumber);

        if (response?.data?.statusCode === 417) {
          ShowToast("error", response?.data?.data);
          console.log("Order Entry Response:", rawData);
        }
        if (!orderNumber) {
          throw new Error("Could not extract order number from response");
        }
        return orderNumber;
      } else {
        throw new Error("Lumpsum order API failed");
      }
    } catch (err) {
      console.error("Error placing lumpsum order:", err);
      return null;
    } finally {
      dispatch(hideLoader());
    }
  };

  // const createSipOrder = () => {};

  const handleInvestClick = async () => {
    // First interaction (for SIP) is to confirm SIP date
    if (modalType === "sip" && sipDate && !dateSelected) {
      setDateSelected(sipDate);
      return;
    }

    if (!selectedBank) {
      alert("Please select a bank");
      return;
    }

    if (!selectedPaymentType) {
      alert("Please select a payment method");
      return;
    }

    if (selectedPaymentType === "upi" && (!upiId || !upiVerified)) {
      alert("Please verify your UPI ID first.");
      return;
    }

    if (
      modalType === "sip" &&
      dateSelected &&
      selectedBank &&
      selectedPaymentType
    ) {
      setNestedModalOpen(true);
      return; // Stop here until user confirms in child modal
    }
    dispatch(showLoader("Placing Order..."));

    try {
      let orderNumber = null;

      // if (modalType === "sip") {
      //   orderNumber = await createSipOrder();
      // } else {
      orderNumber = await createLumpsumOrder();
      // }

      if (!orderNumber) {
        throw new Error("Failed to generate order number");
      }

      const isUpi = selectedPaymentType === "upi";

      const paymentPayload = {
        modeofpayment: isUpi ? "UPI" : selectedBank?.paymentMode ?? "DIRECT",
        bankid: selectedBank?.code ?? "",
        // bankid: "HDF",
        accountnumber: selectedBank?.account ?? "",
        // accountnumber: "008291800000871",
        ifsc: selectedBank?.ifsc ?? "",
        // ifsc: "YESB0000082",
        ordernumber: orderNumber,
        totalamount: amount.toString(),
        internalrefno: "",
        nefTreference: isUpi ? "" : "1",
        mandateid: "",
        vpaid: isUpi ? upiId : "",
        loopbackURL: "https://lkpconnect.net.in/dashboard",
        allowloopBack: "Y",
        filler1: "",
        filler2: "",
        filler3: "",
        filler4: "",
        filler5: "",
      };

      const response = await apiServices.BSEStar_SinglePayment(paymentPayload);

      const htmlContent = response?.data?.data?.responsestring;
      if (selectedPaymentType === "upi") {
        ShowToast("info", htmlContent);
      } else {
        // const newWindow = window.open("", "_blank");
        // if (newWindow) {
        //   newWindow.document.open();
        //   newWindow.document.write(htmlContent); // browser interprets it fine
        //   newWindow.document.close();
        // }

        const encodedHtml = btoa(htmlContent);
        await sendEmail({
          url: encodedHtml,
          mandateId: "",
          orderNo: orderNumber,
          type: "SINGLE",
        });
      }
      toggle(); // close modal
    } catch (err) {
      console.error("Investment failed", err);

      setUpiVerified(undefined);
    } finally {
      dispatch(hideLoader());
    }
  };

  const sendEmail = async ({
    url,
    mandateId,
    orderNo,
    type = "ENACH", // or "SINGLE"
  }: {
    url: string;
    mandateId: string;
    orderNo: string;
    type?: "ENACH" | "SINGLE";
  }) => {
    const payload = {
      link: url,
      clientCode: clientNo,
      orderNo,
      mandateId,
      schemeCode: bseSchemeCode,
      option: type === "ENACH" ? "ENACH" : "",
    };

    try {
      const response = await apiServices.SinglePaymentEmail(payload);

      console.log(response, "Email response");
    } catch (error) {
      console.error("Error sending email", error);
    } finally {
      dispatch(hideLoader());
    }
  };

  const clientBankDetails = async () => {
    dispatch(showLoader("Please wait we are processing your request"));

    try {
      const response = await apiServices.ClientProfile();
      const clientData = response?.data?.data;

      // Store mobile and email
      setMobileNo(clientData?.mobileNo || "");
      setEmail(clientData?.email || "");
      setClientNo(clientData?.clientCode || "");
      console.log(
        clientData?.mobileNo,
        clientData?.email,
        "check Cleintdetails",
        clientData?.clientCode
      );

      // Process bank details
      const rawData = clientData?.bankDetails ?? [];
      const formattedData: BankDetail[] = rawData.map(
        (item: any, index: number) => ({
          id: index + 1,
          name: item.bankName,
          account: item.bankAccountNumber,
          ifsc: item.ifsc,
          code: item.bankCode,
          paymentMode: item.payMode,
        })
      );

      setBanks(formattedData);
    } catch (error) {
      console.error("Error fetching bank details:", error);
    } finally {
      dispatch(hideLoader());
    }
  };

  const verifyUpi = async () => {
    if (!upiId) {
      return;
    }

    const payload = { upi: upiId };
    dispatch(showLoader("Verifying UPI..."));

    try {
      const response = await apiServices.VerifyUpi(payload);
      // const isValid = response?.data?.isUpiValid;
      const isValid = response?.data?.message?.includes("True");
      if (isValid) {
        setUpiVerified(true);
        setUpiName(response?.data?.data || ""); // Save the name for display
      } else {
        setUpiVerified(false);
        setUpiName(""); // Clear on failure
      }
    } catch (error) {
      console.error("Error verifying UPI ID:", error);

      setUpiVerified(undefined);
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    clientBankDetails();
  }, [hasToken]);

  return (
    <>
      <Modal isOpen={isOpen} toggle={toggle} centered size="lg">
        <ModalHeader toggle={toggle}>
          {title} - {modalType === "oneTime" ? "Lumpsum " : " SIP"}
        </ModalHeader>

        <ModalBody>
          {/* {modalType === "redeem" && <h1>redemption Arc</h1>} */}
          {modalType === "oneTime" ? (
            //  Lumpsum UI
            <div style={{ display: "flex", gap: "20px" }}>
              {/* Left - Amount */}
              <div style={{ flex: 1 }}>
                <Label style={{ fontWeight: 600, marginBottom: "8px" }}>
                  Enter a Lumpsum Amount
                </Label>

                <TextField
                  type="number"
                  value={amount}
                  onChange={(e) => {
                    // Accept only digits (or empty) so user can backspace fully
                    const val = e.target.value;
                    if (val === "" || /^\d+$/.test(val)) {
                      setAmount(val);
                    }
                  }}
                  onBlur={() => {
                    if (!amount.trim()) {
                      setAmount("500");
                    }
                  }}
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
                      onClick={() =>
                        setAmount(
                          String((parseInt(amount || "0", 10) || 0) + val)
                        )
                      }
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
                        selectedBank === bank
                          ? "2px solid #004AAD"
                          : "1px solid #ddd",
                      borderRadius: "8px",
                      padding: "4px 8px",
                      cursor: "pointer",
                      transition: "border 0.2s",
                      marginBottom: "10px",
                    }}
                    onClick={() => {
                      handleBankSelect(bank.id);
                      setUpiId("");
                      setUpiVerified(undefined);
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      {/* Only show logo if available */}
                      {bank.logo ? (
                        <img
                          src={bank.logo}
                          alt={bank.name}
                          style={{
                            width: "40px",
                            height: "40px",
                            objectFit: "contain",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            backgroundColor: "#eee",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "4px",
                            fontSize: "12px",
                            color: "#888",
                          }}
                        >
                          {bank.code}
                        </div>
                      )}

                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontWeight: 600, fontSize: "14px" }}>
                          {bank.name}
                        </span>
                        <span style={{ fontSize: "12px", color: "#666" }}>
                          {/* {bank.account} */}
                          xxxxxxxxxx{bank.account.slice(-4)}
                        </span>
                      </div>
                    </div>

                    <input
                      type="radio"
                      name="bank"
                      value={bank.id}
                      checked={selectedBank?.id === bank.id}
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
            //  SIP UI (placeholder for now, you’ll fill later)
            <div style={{ display: "flex", gap: "20px" }}>
              {/* SIP Amount Section */}
              <div style={{ flex: 1 }}>
                <Label style={{ fontWeight: 600, marginBottom: "8px" }}>
                  Enter an SIP Amount
                </Label>

                <TextField
                  type="number"
                  value={amount}
                  onChange={(e) => {
                    // Accept only digits (or empty) so user can backspace fully
                    const val = e.target.value;
                    if (val === "" || /^\d+$/.test(val)) {
                      setAmount(val);
                    }
                  }}
                  onBlur={() => {
                    if (!amount.trim()) {
                      setAmount("500");
                    }
                  }}
                  fullWidth
                  InputProps={{
                    style: { fontSize: "20px" },
                  }}
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />

                {/* Quick Add Buttons */}
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {[100, 500, 1000, 2000].map((val) => (
                    <Button
                      key={val}
                      variant="outlined"
                      onClick={() =>
                        setAmount(
                          String((parseInt(amount || "0", 10) || 0) + val)
                        )
                      }
                      style={{
                        fontSize: "14px",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        color: "white",
                        backgroundColor: "#22629b",
                      }}
                    >
                      +{val.toLocaleString()}
                    </Button>
                  ))}
                </div>

                {!dateSelected && (
                  <p
                    style={{
                      fontSize: "12px",
                      marginTop: "8px",
                      color: "#666",
                    }}
                  >
                    Minimum gap between 2 SIP instalments: 30 days. Further
                    instalments would start only when 1st SIP payment is
                    successful. To avoid failure of future SIP instalments,
                    enable autopay mandate on this bank account.
                  </p>
                )}
              </div>

              {/* SIP Date Section */}
              {dateSelected ? (
                <div style={{ flex: 1 }}>
                  <Label style={{ fontWeight: 600, marginBottom: "8px" }}>
                    Select Bank account for payment
                  </Label>

                  {banks.map((bank) => (
                    <BankCard
                      key={bank.id}
                      bank={bank}
                      selected={selectedBank?.id === bank.id}
                      onSelect={handleBankSelect}
                    />
                  ))}
                </div>
              ) : (
                <div style={{ flex: 1 }}>
                  <Label
                    style={{
                      fontWeight: 600,
                      marginBottom: "8px",
                      display: "block",
                    }}
                  >
                    SIP Date
                  </Label>

                  {/* Calendar-like grid */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(7, 1fr)", // 7 days like a week
                      gap: "10px",
                    }}
                  >
                    {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                      <div
                        key={day}
                        onClick={() => setSipDate(day)}
                        style={{
                          padding: "3px",
                          textAlign: "center",
                          borderRadius: "8px",
                          border:
                            sipDate === day
                              ? "2px solid #004AAD"
                              : "1px solid #ddd",
                          backgroundColor: sipDate === day ? "#E6F0FF" : "#fff",
                          cursor: "pointer",
                          fontWeight: sipDate === day ? 600 : 400,
                          transition: "all 0.2s ease",
                        }}
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Selected date text */}
                  {sipDate && (
                    <p
                      style={{
                        marginTop: "10px",
                        fontSize: "14px",
                        color: "#444",
                      }}
                    >
                      Selected SIP Date: <b>{sipDate}</b>
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
          {/* payment section */}
          {selectedBank && (
            <div>
              <div>
                <div style={{ marginTop: "12px" }}>
                  {modalType === "sip" && sipDate && (
                    <>
                      <div style={{ fontWeight: 500, marginBottom: "6px" }}>
                        Selected SIP Date: <b>{sipDate}th</b>
                      </div>

                      <label
                        style={{
                          fontWeight: 600,
                          marginTop: "12px",
                          display: "block",
                        }}
                      >
                        Select Payment Type
                      </label>
                    </>
                  )}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  flexWrap: "wrap",
                }}
              >
                {paymentOptions.map((option) => (
                  <div
                    key={option.id}
                    onClick={() => {
                      setSelectedPaymentType(option.id);
                      setUpiId("");
                      setUpiVerified(undefined);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      border:
                        selectedPaymentType === option.id
                          ? "2px solid #004AAD"
                          : "1px solid #ccc",
                      borderRadius: "8px",
                      padding: "4px 8px",
                      cursor: "pointer",
                      minWidth: "200px",
                      flex: "1 1 200px",
                      transition: "border 0.2s",
                      backgroundColor:
                        selectedPaymentType === option.id ? "#f7faff" : "#fff",
                    }}
                  >
                    <img
                      src={option.icon}
                      alt={option.name}
                      style={{ width: "30px", marginRight: "12px" }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>{option.name}</div>
                      {option.description && (
                        <div style={{ fontSize: "12px", color: "#666" }}>
                          {option.description}
                        </div>
                      )}
                    </div>
                    <input
                      type="radio"
                      name="paymentType"
                      value={option.id}
                      checked={selectedPaymentType === option.id}
                      onChange={() => setSelectedPaymentType(option.id)}
                      style={{
                        accentColor: "#004AAD",
                        width: "16px",
                        height: "16px",
                        marginLeft: "8px",
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                ))}
              </div>

              {/*  Extra UPI Input Field & Verify Button */}
              {selectedPaymentType === "upi" && (
                <div style={{ marginTop: "16px", maxWidth: "400px" }}>
                  <Label style={{ fontWeight: 600, marginBottom: "6px" }}>
                    Enter UPI ID
                  </Label>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <TextField
                      fullWidth
                      placeholder="example@upi"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      disabled={upiVerified}
                      error={upiVerified === false}
                      InputProps={{
                        style: {
                          padding: "6px 10px",
                          fontSize: "14px",
                          backgroundColor: upiVerified ? "#f5f5f5" : "#fff", // light grey if disabled
                          // border: upiVerified === false ? "1px solid red" : "",
                        },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                          height: "40px",
                        },
                      }}
                    />

                    <Button
                      style={{
                        backgroundColor: upiVerified ? "#2E7D32" : "#004AAD", // green if verified
                        color: "#fff",
                        padding: "6px 16px",
                        fontSize: "14px",
                        height: "40px",
                        cursor: upiVerified ? "default" : "pointer",
                      }}
                      disabled={upiVerified}
                      onClick={verifyUpi}
                    >
                      {upiVerified ? "Verified" : "Verify"}
                    </Button>
                    {upiVerified && (
                      <Button
                        style={{
                          minWidth: "60px",
                          height: "40px",
                          padding: "6px",
                          fontSize: "14px",
                          lineHeight: "20px",
                          color: "white",
                          backgroundColor: "#ee4b2b",
                          borderRadius: "8px",
                          cursor: "pointer",
                          border: "1px solid #ee4b2b",
                        }}
                        onClick={() => {
                          setUpiId("");
                          setUpiVerified(undefined); // or false, depending on your state init
                          setUpiName(""); // reset name as well if you have
                        }}
                        aria-label="Cancel UPI Verification"
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                  {upiVerified === true
                    ? upiName // You'll need to store `upiName` in state
                    : upiVerified === false
                    ? "Invalid UPI ID"
                    : ""}
                </div>
              )}
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
            For orders after <b>2:30 PM</b>, NAV would be applicable for the
            next business day. Max limit may vary depending upon the account
            type.
          </div>
        </ModalBody>

        <ModalFooter>
          {modalType === "sip" && dateSelected && (
            <div style={{ flex: 1, fontSize: "13px", color: "#666" }}>
              <div>
                1st Payment: <b>Today</b>
              </div>
              <div>
                Next Payment: <b>{getNextPaymentDateString(dateSelected)}</b>
              </div>
            </div>
          )}

          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
          <Button
            onClick={handleInvestClick}
            style={{ backgroundColor: "#1c517f" }}
          >
            {modalType === "oneTime"
              ? "Invest Now"
              : !dateSelected
              ? "Continue"
              : "Start SIP"}
          </Button>
        </ModalFooter>
      </Modal>

      <NestedModal
        isOpen={isNestedModalOpen}
        toggle={toggleNestedModal}
        // onConfirm={(selected) => {
        //   console.log("Selected mandate:", selected);
        //   finalConfirm(selected)
        // }}
        clientNo={clientNo}
        banks={banks}
        selectedPaymentType={selectedPaymentType}
        upiId={upiId}
        bseSchemeCode={bseSchemeCode}
        dateSelected={dateSelected}
        amount={amount}
        selectedBank={selectedBank}
      />
    </>
  );
};

export default MutualFundModal;
