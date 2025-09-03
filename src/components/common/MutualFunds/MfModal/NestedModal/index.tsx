// components/NestedModal.tsx
import { useEffect, useState } from "react";
import CreateMandateModal from "../MandateModal/index";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import { useDispatch } from "react-redux";
import {
  showLoader,
  hideLoader,
} from "../../../../../redux/slices/loaderSlice";
import { apiServices } from "../../../../../services";
import { AppDispatch } from "../../../../../redux/store";
import ShowToast from "../../../../../utils/toastUtils";

interface MandateDetail {
  amount: string;
  mandateId: string;
  status: string;
  [key: string]: any;
}

interface NestedModalProps {
  isOpen: boolean;
  toggle: () => void;
  title?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: (selectedMandate: MandateDetail | null) => void;
  banks: any;
  clientNo: string;
  amount: number | string;
  selectedPaymentType: string | null;
  upiId?: string;
  dateSelected: number | null;
  bseSchemeCode: string | undefined;
}

const NestedModal = ({
  isOpen,
  toggle,
  //   title = "Confirmation",
  confirmLabel = "OK",
  cancelLabel = "Cancel",
  onConfirm,
  banks,
  clientNo,
  selectedPaymentType,
  upiId,
  bseSchemeCode,
  dateSelected,
  amount,
}: NestedModalProps) => {
  const [mandateDetails, setMandateDetails] = useState<MandateDetail[]>([]);
  const [selectedMandateId, setSelectedMandateId] = useState<string | null>(
    null
  );
  const [showCreateMandateModal, setShowCreateMandateModal] = useState(false);
  const [selectedBank, setSelectedBank] = useState<any>(null); // for selection
  const [orderNo, setOrderNo] = useState<any>(null); // for selection
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [timerPage, setTimerPage] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  // Handler for bank selection

  let startDate = "";

  if (dateSelected !== null) {
    const today = new Date();
    const day = String(dateSelected).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();

    startDate = `${day}/${month}/${year}`; // Example: "03/09/2025"
  }

  useEffect(() => {
    const fetchMandates = async () => {
      const payload = {
        clientCodeField: clientNo,
        // clientCodeField: "MT0600508",
        fromDateField: "31/08/2000",
        mandateIdField: "",
        toDateField: "14/09/2035",
      };

      dispatch(showLoader("Verifying UPI..."));

      try {
        const response = await apiServices.BSEStar_MfMandateStatus(payload);
        const allMandates = response?.data?.data?.mandateDetails || [];

        // ✅ Filter only APPROVED mandates
        const approvedMandates = allMandates.filter(
          (m: any) => m.status?.toUpperCase() === "APPROVED"
        );
        console.log(approvedMandates, "approvedMandates");

        setMandateDetails(approvedMandates);
      } catch (error) {
        console.error("Error fetching mandate status", error);
      } finally {
        dispatch(hideLoader());
      }
    };

    if (isOpen) {
      fetchMandates();
    }
  }, [isOpen, dispatch]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedMandateId(null);
      setSecondsLeft(60);
      setTimerPage(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (secondsLeft === 0) {
      toggle(); // close the modal
      setTimerPage(false); // hide the timer page if needed
      handleSinglepayment();
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  useEffect(() => {
    console.log(banks, orderNo, "count");
  }, [banks, orderNo]);

  const formatTime = (totalSeconds: number) => {
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const handleNewMandateCreated = (mandateId: string) => {
    console.log("Returned Mandate ID:", mandateId);
    setSelectedMandateId(mandateId);
  };

  const handleFinalConfirm = () => {
    const selected =
      mandateDetails.find((m) => m.mandateId === selectedMandateId) || null;
    if (onConfirm) onConfirm(selected);
    console.log("cehcke from props", typeof amount, selectedPaymentType);
    setSelectedMandateId(selected?.mandateId ?? null);
    console.log(
      selectedMandateId,
      "SelectedMandateIdSelectedMandateIdSelectedMandateId"
    );
    setTimerPage(true);
    if (selectedPaymentType === "netbanking") {
      setSecondsLeft(80);

      handleXsip();
      setInterval(() => {
        handleENach();
      }, 8000);
    } else {
      setSecondsLeft(60);

      handleXsip();
    }
  };

  const extractOrderNumber = (responseData: string): string | null => {
    const match = responseData.match(/REG NO IS\s*:\s*(\d+)/);
    return match ? match[1] : null;
  };

  const handleXsip = async () => {
    const payload = {
      transactionCode: "NEW",
      schemeCode: bseSchemeCode, //
      clientCode: clientNo, //
      startDate: startDate, //
      frequencyType: "MONTHLY", //
      installmentAmount: amount.toString(), //
      noOfInstallment: "12",
      remarks: "test",
      firstOrderFlag: "Y",
      brokerage: "",
      mandateId: selectedMandateId, //
      ipAdd: "",
      transMode: "D",
      dpTxnMode: "C",
      frequencyAllowed: "1",
      dpc: "Y",
      internalRefNo: "",
      folioNo: "",
      subberCode: "",
      regId: "",
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

    dispatch(showLoader("Verifying UPI..."));

    try {
      const response = await apiServices.BSEStar_XSIPOrderEntry(payload);
      const message = response?.data?.data;
      const orderNumber = extractOrderNumber(message);
      setOrderNo(orderNumber);
      console.log(orderNumber, "extractOrderNumber");
      if (response?.data?.statusCode === 417) {
        ShowToast("error", response?.data?.data);
        toggle();
        setTimerPage(false);
      }
    } catch (error) {
      console.error("Error fetching mandate status", error);
    } finally {
      dispatch(hideLoader());
    }
  };
  const handleENach = async () => {
    const payload = {
      clientCode: clientNo,
      mandateID: selectedMandateId,
      loopbackurl: "http://uat.lkpconnect.net.in/dashboard",
    };
    console.log("handleENach", selectedMandateId);
    dispatch(showLoader("Handling Enach..."));

    try {
      const response = await apiServices.BSEStar_MfMandateENACH(payload);
      const message = response?.data;

      console.log(message, "eNach url");
    } catch (error) {
      console.error("Error fetching mandate status", error);
    } finally {
      dispatch(hideLoader());
    }
  };
  const handleSinglepayment = async () => {
    dispatch(showLoader("Processing payment..."));

    try {
      const Payload = {
        modeofpayment: selectedPaymentType === "upi" ? "UPI" : "DIRECT",
        bankid: "HDF", // hardcoded for now, or use selectedBank?.code
        accountnumber: banks[0]?.account ?? "",
        ifsc: banks[0]?.ifsc ?? "",
        ordernumber: orderNo,
        totalamount: amount.toString(),
        internalrefno: "",
        nefTreference: selectedPaymentType === "upi" ? "" : "1",
        mandateid: "",
        vpaid: selectedPaymentType === "upi" ? upiId : "",
        loopbackURL: "http://uat.lkpconnect.net.in/dashboard",
        allowloopBack: "Y",
        filler1: "",
        filler2: "",
        filler3: "",
        filler4: "",
        filler5: "",
      };

      // Call API
      const response = await apiServices.BSEStar_SinglePayment(Payload);
      const htmlContent = response?.data?.data; // even with \r\n\t inside
      if (response?.data?.statusCode === 417) {
        ShowToast("error", response?.data?.data);
      }
      const newWindow = window.open("", "_blank");
      if (newWindow) {
        newWindow.document.open();
        newWindow.document.write(htmlContent); // browser interprets it fine
        newWindow.document.close();
      }

      // Success alert (customize by modalType if needed)
    } catch (err: any) {
      console.error("Investment failed", err);
      alert("Something went wrong. Please try again.");
    } finally {
      dispatch(hideLoader());
    }
  };

  const handleBankSelect = (bankId: string) => {
    const selected = banks.find((b: any) => b.id === bankId);
    setSelectedBank(selected);
  };

  return (
    <>
      <Modal isOpen={isOpen} toggle={toggle} centered size="md">
        <ModalHeader toggle={toggle}>
          {timerPage ? "Waiting For confirmation" : "Confirmation"}
          {/* {title} */}
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
                  : "Redirecting you to the E-Nach setup."}
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
          ) : mandateDetails.length === 0 ? (
            <p>No mandates available.</p>
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  maxHeight: "360px",
                  overflowY: "auto",
                  paddingRight: "4px",
                }}
              >
                {mandateDetails.map((mandate) => (
                  <div
                    key={mandate.mandateId}
                    onClick={() => setSelectedMandateId(mandate.mandateId)}
                    style={{
                      border:
                        selectedMandateId === mandate.mandateId
                          ? "2px solid #004AAD"
                          : "1px solid #ddd",
                      borderRadius: "6px",
                      padding: "10px 14px",
                      cursor: "pointer",
                      backgroundColor:
                        selectedMandateId === mandate.mandateId
                          ? "#f5faff"
                          : "#fff",
                      transition: "border 0.2s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      fontSize: "13px",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "14px" }}>
                        {mandate.clientName}
                      </div>
                      <div style={{ marginTop: "2px" }}>
                        Mandate ID: <b>{mandate.mandateId}</b>
                      </div>
                      <div style={{ marginTop: "2px" }}>
                        Amount: ₹{parseFloat(mandate.amount).toLocaleString()}
                      </div>
                      <div style={{ marginTop: "2px", color: "#2E7D32" }}>
                        Status: <b>{mandate.status}</b>
                      </div>
                    </div>

                    <div>
                      <input
                        type="radio"
                        name="selectedMandate"
                        value={mandate.mandateId}
                        checked={selectedMandateId === mandate.mandateId}
                        onChange={() => setSelectedMandateId(mandate.mandateId)}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          width: "16px",
                          height: "16px",
                          accentColor: "#004AAD",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <Button
                style={{
                  backgroundColor: "#307e34",
                  color: "#fff",
                  marginTop: "5px",
                }}
                onClick={() => {
                  setShowCreateMandateModal(true);
                  setSelectedMandateId(null);
                }}
              >
                Create New Mandate
              </Button>
            </>
          )}
        </ModalBody>

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
      </Modal>
      <CreateMandateModal
        isOpen={showCreateMandateModal}
        toggle={() => setShowCreateMandateModal(false)}
        banks={banks}
        selectedBank={selectedBank}
        onBankSelect={handleBankSelect}
        selectedPaymentType={selectedPaymentType}
        clientNo={clientNo}
        upiId={upiId}
        mandate={handleNewMandateCreated}
      />
    </>
  );
};

export default NestedModal;
