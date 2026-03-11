import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Label,
  FormGroup,
  Input,
} from "reactstrap";
import BankCard from "../../../BankRadio";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../../redux/store";
import { apiServices } from "../../../../../services";
import {
  hideLoader,
  showLoader,
} from "../../../../../redux/slices/loaderSlice";
import ShowToast from "../../../../../utils/toastUtils";
import { TextField } from "@mui/material";
import { BankDetail } from "../../../../../pages/MutualFund/mfTypes";

const CreateMandateModal = ({
  isOpen,
  toggle,
  banks,
  selectedBank,
  onBankSelect,
  selectedPaymentType,
  clientNo,
  upiId,
  mandate,
  selectedType,
  minAmount,
  modalType,
  setAccount,
}: any) => {
  const [amount, setAmount] = useState(
    // selectedPaymentType === "upi" ? 15000 : 100000
    0
  );
  const [newMandateId, setNewMandateId] = useState("");
  const [accountType, setAccountType] = useState("demat");
  const [paymentType, setPaymentType] = useState("upi");
  const [upiInput, setUpiInput] = useState("");
  const [upiName, setUpiName] = useState("");
  const [upiVerified, setUpiVerified] = useState<boolean>();
  const [inputBank, setInputBank] = useState<BankDetail | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const freshMandate = modalType === "Report";

  useEffect(() => {
    setAmount(selectedPaymentType === "upi" ? 15000 : 100000);
  }, [toggle]);

  useEffect(() => {
    const minLimit = paymentType === "upi" ? 15000 : 50000;
    setAmount(minLimit);
  }, [paymentType]);

  const createMandates = async () => {
    if (!selectedBank || !amount) return;

    const payload: any = {
      flag: selectedPaymentType === "upi" ? "19" : "06",
      clientCode: clientNo,
      amount: amount.toString(),
      mandateType: selectedPaymentType === "upi" ? "U" : "N",
      accountNo: selectedBank.account,
      accountType: "SB",
      ifsccode: selectedBank.ifsc,
      micrcode: "",
      startdate: formatDate(tomorrow), // Start date is tomorrow
      enddate: "", // Empty or use formatDate(someDate) if needed
      dpFlag: selectedType === "physical" ? "P" : "",
    };

    // Add UPI-specific fields if needed
    if (selectedPaymentType === "upi") {
      payload.registrationDate = formatDate(today); // Registration is today
      payload.vpaid = upiId;
    }

    dispatch(showLoader("Creating mandate..."));

    try {
      const response = await apiServices.BSEStar_MfMandateEntry(payload);
      const MandateNumber = response?.data?.data;
      setNewMandateId(MandateNumber);
      console.log(MandateNumber, newMandateId);

      ShowToast("info", response?.data?.message);

      if (mandate) {
        mandate(MandateNumber);
      }
      toggle();
    } catch (error) {
      console.error("Error creating mandate", error);

      ShowToast("error", "Failed to create mandate");
    } finally {
      dispatch(hideLoader());
    }
  };

  const verifyUpi = async () => {
    if (!upiInput) {
      return;
    }

    const payload = { upi: upiInput };
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

  const formatDate = (date: Date): string => {
    const d = date.getDate().toString().padStart(2, "0");
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  };

  // Today's date and +1 day
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate());

  const createReportMandates = async () => {
    if (!inputBank || !amount) return;

    const payload: any = {
      flag: paymentType === "upi" ? "19" : "06",
      clientCode: clientNo,
      amount: amount.toString(),
      mandateType: paymentType === "upi" ? "U" : "N",
      accountNo: inputBank.account,
      accountType: "SB",
      ifsccode: inputBank.ifsc,
      micrcode: "",
      startdate: formatDate(tomorrow), // Start date is tomorrow
      enddate: "", // Empty or use formatDate(someDate) if needed
      dpFlag: accountType === "physical" ? "P" : "",
    };

    // Add UPI-specific fields if needed
    if (paymentType === "upi") {
      payload.registrationDate = formatDate(today); // Registration is today
      payload.vpaid = upiInput;
    }
    console.log(payload, "createReportMandates");

    dispatch(showLoader("Creating mandate..."));

    try {
      const response = await apiServices.BSEStar_MfMandateEntry(payload);
      const MandateNumber = response?.data?.data;
      // setNewMandateId(MandateNumber);
      console.log(MandateNumber, newMandateId);

      ShowToast("info", response?.data?.message);

      // if (mandate) {
      //   mandate(MandateNumber);
      // }
      toggle();
    } catch (error) {
      console.error("Error creating mandate", error);

      ShowToast("error", "Failed to create mandate");
    } finally {
      dispatch(hideLoader());
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      centered
      size={freshMandate ? "md" : "sm"}
    >
      <ModalHeader toggle={toggle}>Create New Mandate</ModalHeader>
      {freshMandate ? (
        <>
          <ModalBody>
            {/* Account Type */}
            <FormGroup>
              <Label className="fw-bold mb-2">Account Type</Label>

              <div className="d-flex gap-4">
                <Label check className="d-flex align-items-center gap-2">
                  <Input
                    type="radio"
                    name="accountType"
                    checked={accountType === "demat"}
                    onChange={() => {
                      setAccountType("demat");
                      setAccount("demat");
                    }}
                  />
                  Demat
                </Label>

                <Label check className="d-flex align-items-center gap-2">
                  <Input
                    type="radio"
                    name="accountType"
                    checked={accountType === "physical"}
                    onChange={() => {
                      setAccountType("physical");
                      setAccount("physical");
                    }}
                  />
                  Physical
                </Label>
              </div>
            </FormGroup>

            {/* Amount + Bank Layout */}
            <div className="d-flex gap-4 mt-3">
              {/* Amount */}
              <div style={{ flex: 1 }}>
                <FormGroup>
                  <Label className="fw-bold">Mandate Amount</Label>

                  {/* <TextField
                    type="number"
                    value={amount}
                    placeholder={`Minimum ₹${minAmount}`}
                    onChange={(e) => setAmount(Number(e.target.value))}
                  /> */}
                  {/* <TextField
                    type="number"
                    id="amountInput"
                    value={amount}
                    placeholder={`Enter amount (min ${minAmount})`}
                    style={{ marginBottom: "12px", maxWidth: "200px" }}
                    onChange={(e) => {
                      let val = Number(e.target.value);
                      const minLimit = paymentType === "upi" ? 15000 : 50000;
                      const maxLimit = paymentType === "upi" ? 100000 : 500000;
                      // Enforce min and max dynamically
                      if (val < minLimit) val = minLimit;
                      if (val > maxLimit) val = maxLimit;
                      setAmount(val);
                    }}
                  /> */}
                  <TextField
                    type="number"
                    id="amountInput"
                    value={amount}
                    placeholder={`Enter amount`}
                    style={{ marginBottom: "12px", minWidth: "200px" }}
                    inputProps={{
                      min: paymentType === "upi" ? 15000 : 50000,
                      max: paymentType === "upi" ? 100000 : 500000,
                    }}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      // const minLimit = paymentType === "upi" ? 15000 : 50000;
                      // const maxLimit = paymentType === "upi" ? 100000 : 500000;

                      // Optional: only clamp on blur for better UX
                      setAmount(val);
                    }}
                    onBlur={() => {
                      const minLimit = paymentType === "upi" ? 15000 : 50000;
                      const maxLimit = paymentType === "upi" ? 100000 : 500000;
                      let val = amount;
                      if (val < minLimit) val = minLimit;
                      if (val > maxLimit) val = maxLimit;
                      setAmount(val);
                    }}
                  />
                </FormGroup>
              </div>

              {/* Bank Selection */}
              {/* <div style={{ flex: 1 }}>
                <Label className="fw-bold mb-2">Select Bank</Label>
                {banks?.map((bank: any) => (
                  <BankCard
                    key={bank.id}
                    bank={bank}
                    selected={selectedBank?.id === bank.id}
                    onSelect={() => {
                      setInputBank(bank);
                      console.log(inputBank);
                    }}
                  />
                ))}
              </div> */}
              <div style={{ flex: 1 }}>
                <Label className="fw-bold mb-2">Select Bank</Label>
                {banks?.map((bank: any) => (
                  <BankCard
                    key={bank.id}
                    bank={bank}
                    selected={selectedBank?.id} // depends on selectedBank
                    onSelect={() => {
                      console.log(bank);
                      setInputBank(bank);
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <FormGroup className="mt-4">
              <Label className="fw-bold mb-2">Payment Method</Label>

              <div className="d-flex gap-4">
                <Label check className="d-flex align-items-center gap-2">
                  <Input
                    type="radio"
                    name="paymentType"
                    checked={paymentType === "upi"}
                    onChange={() => setPaymentType("upi")}
                  />
                  UPI
                </Label>

                <Label check className="d-flex align-items-center gap-2">
                  <Input
                    type="radio"
                    name="paymentType"
                    checked={paymentType === "netbanking"}
                    onChange={() => {
                      setPaymentType("netbanking");
                      setUpiInput("");
                      setUpiName("");
                      setUpiVerified(undefined);
                    }}
                  />
                  Net Banking
                </Label>
              </div>
            </FormGroup>

            {/* UPI Field */}
            {paymentType === "upi" && (
              <div style={{ marginTop: "16px", maxWidth: "400px" }}>
                <Label style={{ fontWeight: 600, marginBottom: "6px" }}>
                  Enter UPI ID
                </Label>
                <div style={{ display: "flex", gap: "10px" }}>
                  <TextField
                    fullWidth
                    placeholder="example@upi"
                    // value={upiId}
                    value={upiInput}
                    onChange={(e) => setUpiInput(e.target.value)}
                    disabled={upiVerified}
                    error={upiVerified === false}
                    InputProps={{
                      style: {
                        // padding: "6px 10px",
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
                    onClick={() => {
                      verifyUpi();
                      console.log(upiInput, "verified");
                    }}
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
                        setUpiInput("");
                        setUpiVerified(undefined); // or false, depending on your state init
                        // setUpiName(""); // reset name as well if you have
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
          </ModalBody>

          <ModalFooter>
            <Button color="secondary" onClick={toggle}>
              Cancel
            </Button>

            <Button
              color="success"
              onClick={() => {
                createReportMandates();
              }}
              disabled={
                paymentType === "upi"
                  ? !upiVerified || !amount || !inputBank
                  : !amount || !inputBank
              }
            >
              Confirm & Create
            </Button>
          </ModalFooter>
        </>
      ) : (
        <>
          <ModalBody>
            <Label style={{ fontWeight: 600, marginBottom: "8px" }}>
              {/* Select Bank account for payment */}
              Selected Bank Account
            </Label>

            {banks?.map((bank: any) => (
              <BankCard
                key={bank.id}
                bank={bank}
                selected={selectedBank?.id === bank.id}
                onSelect={onBankSelect}
              />
            ))}

            <FormGroup>
              <Label for="amountInput" style={{ fontWeight: 600 }}>
                Enter Amount
              </Label>
              <Input
                type="number"
                id="amountInput"
                value={amount}
                placeholder={`Enter amount (min ${minAmount})`}
                style={{ marginBottom: "12px", maxWidth: "200px" }}
                min={minAmount}
                onChange={(e) => {
                  let val = Number(e.target.value);
                  const maxLimit =
                    selectedPaymentType === "upi" ? 15000 : 100000;
                  // Enforce min and max dynamically
                  if (val < minAmount) val = minAmount;
                  if (val > maxLimit) val = maxLimit;
                  setAmount(val);
                }}
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={toggle}>
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={createMandates} //  Call the function here
              disabled={!selectedBank || !amount}
            >
              Confirm & Create
            </Button>
          </ModalFooter>
        </>
      )}{" "}
    </Modal>
  );
};

export default CreateMandateModal;
