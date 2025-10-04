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
import TimerModal from "../../../TimerModal";
import { formatTime } from "../../../../../helper/commmon";

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
  selectedBank: any;
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
  selectedBank,
}: NestedModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [mandateDetails, setMandateDetails] = useState<MandateDetail[]>([]);
  const [selectedMandateId, setSelectedMandateId] = useState<string | null>(
    null
  );
  const [showCreateMandateModal, setShowCreateMandateModal] = useState(false);
  const [orderNo, setOrderNo] = useState<any>(null); // for selection
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [timerPage, setTimerPage] = useState(false);
  const [stopEnach, setStopEnach] = useState(false);

  // Handler for bank selection

  let startDate = "";

  if (dateSelected !== null) {
    const today = new Date();
    const day = String(dateSelected).padStart(2, "0");
    const nextMonthDate = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      1
    );
    const month = String(nextMonthDate.getMonth() + 1).padStart(2, "0");
    const year = nextMonthDate.getFullYear();
    startDate = `${day}/${month}/${year}`; // e.g., "11/10/2025"
  }

  useEffect(() => {
    console.log(selectedBank, "selectedBank came from mfmodal");
  }, [selectedBank]);

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
      setStopEnach(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!timerPage) return; // don't start timer unless on waiting screen

    if (secondsLeft === 0) {
      toggle(); // close the modal
      setTimerPage(false);
      // handleSinglepayment();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, timerPage]);

  const handleNewMandateCreated = (mandateId: string) => {
    console.log("Returned Mandate ID:", mandateId);
    setSelectedMandateId(mandateId);
    setTimerPage(true);
    setTimeout(() => {
      console.log(selectedMandateId, " selectedMandateId;");
      handleXsip(mandateId);

      if (selectedPaymentType === "netbanking") {
        setSecondsLeft(180);
        if (!stopEnach) {
          triggerENachLoop(mandateId); // Only call if stopEnach is false
        } // Start the recursive loop
      } else {
        setSecondsLeft(60);
      }
    }, 2000);
  };

  const handleFinalConfirm = () => {
    const selected =
      mandateDetails.find((m) => m.mandateId === selectedMandateId) || null;

    if (onConfirm) onConfirm(selected);

    setSelectedMandateId(selected?.mandateId ?? null);
    setTimerPage(true);

    handleXsip();

    if (selectedPaymentType === "netbanking") {
      setSecondsLeft(180);
      if (!stopEnach) {
        triggerENachLoop(); // Only call if stopEnach is false
      } // Start the recursive loop
    } else {
      setSecondsLeft(60);
    }
  };

  // const extractOrderNumber = (responseData: string): string | null => {
  //   const match = responseData.match(/REG NO IS\s*:\s*(\d+)/);
  //   return match ? match[1] : null;
  // };

  const handleXsip = async (mandateId?: any) => {
    const payload = {
      transactionCode: "NEW",
      schemeCode: bseSchemeCode, //
      clientCode: clientNo, //
      startDate: startDate, //
      frequencyType: "MONTHLY", //
      installmentAmount: amount.toString(), //
      noOfInstallment: "300",
      remarks: "test",
      firstOrderFlag: "Y",
      brokerage: "",
      mandateId: mandateId || selectedMandateId, //
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
      const orderNumber = response?.data?.data?.firstOrderTodayOrderNo;
      if (orderNumber) {
        setOrderNo(orderNumber);
        console.log(orderNumber, "Received Order Number");
        // ✅ Now call handleSinglepayment
        setTimeout(() => {
          handleSinglepayment(orderNumber);
        }, 5000);
      }
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

  const triggerENachLoop = async (mandateId?: any, retryCount = 0) => {
    if (retryCount > 8) {
      console.warn("triggerENachLoop Max retry limit reached.");
      return;
    }
    // debugger;
    let mandu = mandateId || selectedMandateId;
    const payload = {
      clientCode: clientNo,
      mandateID: mandu,
      loopbackurl: "https://lkpconnect.net.in/dashboard",
    };
    if (!payload.clientCode || !payload.mandateID || !payload.loopbackurl) {
      console.warn("cechke payload cechke console", payload);
      return; // ⛔ Stop execution
    }
    dispatch(showLoader("Handling Enach..."));

    try {
      const response = await apiServices.BSEStar_MfMandateENACH(payload);
      const message = response?.data;

      console.log(message, "eNach url");

      // ✅ success: open URL and send email
      if (message?.code === 200 && message?.message) {
        const url: string = message.message;
        // window.open(url, "_blank");

        await sendEmail({
          url,
          mandateId: mandateId || selectedMandateId,
          orderNo: orderNo ?? "",
          type: "ENACH",
        });

        return; // stop retrying
      }
    } catch (error) {
      console.error("Error fetching ENach URL", error);
    } finally {
      dispatch(hideLoader());
    }
    dispatch(hideLoader());
    // ⏳ Retry after 4 seconds
    setTimeout(() => triggerENachLoop(mandu, retryCount + 1), 6000);
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
      const response =
        type === "ENACH"
          ? await apiServices.EnachEmailToClient(payload)
          : await apiServices.SinglePaymentEmail(payload);
      let responseMessage = response?.data?.message;
      console.log(response?.data?.data, "Email response");

      if (responseMessage === "Email sent Succesfully") {
        ShowToast("error", responseMessage);
        console.log(response?.data, "Email response from if loop");
        setSecondsLeft(5);
      }
    } catch (error) {
      console.error("Error sending email", error);
    } finally {
      dispatch(hideLoader());
    }
  };

  const handleSinglepayment = async (orderNumber: any) => {
    dispatch(showLoader("Processing payment..."));

    try {
      const payload = {
        modeofpayment:
          selectedPaymentType === "upi"
            ? "UPI"
            : selectedBank?.paymentMode ?? "DIRECT",
        bankid: selectedBank?.code ?? "",
        accountnumber: selectedBank?.account ?? "",
        ifsc: selectedBank?.ifsc ?? "",
        ordernumber: orderNumber ?? "",
        totalamount: amount.toString(),
        internalrefno: "",
        nefTreference: selectedPaymentType === "upi" ? "" : "1",
        mandateid: "",
        vpaid: selectedPaymentType === "upi" ? upiId : "",
        loopbackURL: "https://lkpconnect.net.in/dashboard",
        allowloopBack: "Y",
        filler1: "",
        filler2: "",
        filler3: "",
        filler4: "",
        filler5: "",
      };
      console.log("payload of singlepayment nested", payload);

      const response = await apiServices.BSEStar_SinglePayment(payload);
      const htmlContent = response?.data?.data?.responsestring;
      const statusCode = response?.data?.data?.statuscode;

      if (statusCode === 417 || statusCode === 101) {
        ShowToast("error", htmlContent);
        return;
      }

      if (selectedPaymentType === "upi") {
        ShowToast("info", htmlContent);
      } else {
        // 🔐 Now safely encode
        const encodedHtml = btoa(htmlContent);
        await sendEmail({
          url: encodedHtml,
          mandateId: selectedMandateId ?? "",
          orderNo: orderNumber ?? "",
          type: "SINGLE",
        });
      }
    } catch (err: any) {
      console.error("Investment failed", err);
      ShowToast("error", "Something went wrong. Please try again.");
    } finally {
      dispatch(hideLoader());
    }
  };

  // const handleBankSelect = (bankId: string) => {
  //   const selected = banks.find((b: any) => b.id === bankId);
  //   // setSelectedBank(selected);
  //   console.log("handleBankSelect from nested modal", selected);
  // };

  return (
    <>
      <Modal isOpen={isOpen} toggle={toggle} centered size="md">
        <ModalHeader toggle={toggle}>
          {timerPage ? "Waiting For confirmation" : "Confirmation"}
        </ModalHeader>
        <ModalBody>
          {timerPage ? (
            // ✅ Replace this block with your dynamic TimerModal component
            <TimerModal
              isOpen={isOpen}
              toggle={toggle}
              timerPage={true}
              secondsLeft={secondsLeft}
              formatTime={formatTime}
              selectedPaymentType={selectedPaymentType ?? undefined}
              selectedMandateId={selectedMandateId ?? undefined}
              stopEnach={stopEnach}
              cancelLabel={cancelLabel}
              confirmLabel={confirmLabel}
              handleFinalConfirm={handleFinalConfirm}
            />
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
                    onClick={() => {
                      setSelectedMandateId(mandate.mandateId);
                      setStopEnach(true);
                      console.log("setStopEnach", stopEnach);
                    }}
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
                  setStopEnach(false);
                }}
              >
                Create New Mandate
              </Button>
            </>
          )}
        </ModalBody>

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
      <CreateMandateModal
        isOpen={showCreateMandateModal}
        toggle={() => setShowCreateMandateModal(false)}
        banks={banks}
        selectedBank={selectedBank}
        // onBankSelect={handleBankSelect}
        selectedPaymentType={selectedPaymentType}
        clientNo={clientNo}
        upiId={upiId}
        mandate={handleNewMandateCreated}
      />
    </>
  );
};

export default NestedModal;
