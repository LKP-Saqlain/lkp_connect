// components/NestedModal.tsx
import { useEffect, useRef, useState } from "react";
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
import {
  MandateDetail,
  NestedModalProps,
} from "../../../../../pages/MutualFund/mfTypes";
import dayjs from "dayjs";
// import { encryptAES } from "../../../../../utils/encryptDecrypt";

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
  selectedType,
  onOrderSuccess,
  onBack,
  redeemFolioNumber,
}: NestedModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [mandateDetails, setMandateDetails] = useState<MandateDetail[]>([]);
  const [selectedMandateId, setSelectedMandateId] = useState<string | null>(
    null
  );
  const [showCreateMandateModal, setShowCreateMandateModal] = useState(false);
  const [orderNo, setOrderNo] = useState<any>(null); // for selection
  const internalRefNoRef = useRef<string>("");
  const sipRefNo = useRef<string>("");
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [timerPage, setTimerPage] = useState(false);
  const [stopEnach, setStopEnach] = useState(false);
  const is2FALinkOpenedRef = useRef(false);
  const physical2FAIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const apiTimerRef = useRef<NodeJS.Timeout | null>(null);
  const openLinkTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startPollingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
    return () => {
      physical2FAIntervalRef.current &&
        clearInterval(physical2FAIntervalRef.current);

      apiTimerRef.current && clearInterval(apiTimerRef.current);

      openLinkTimeoutRef.current && clearTimeout(openLinkTimeoutRef.current);

      startPollingTimeoutRef.current &&
        clearTimeout(startPollingTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const fetchMandates = async () => {
      const payload = {
        clientCodeField: clientNo,
        // clientCodeField: "MT0600508",
        fromDateField: "31/08/2000",
        mandateIdField: "",
        toDateField: "14/09/2035",
        dpFlag: selectedType === "physical" ? "P" : "",
      };

      dispatch(showLoader("Verifying UPI..."));

      try {
        const response = await apiServices.BSEStar_MfMandateStatus(payload);
        const allMandates = response?.data?.data || [];

        //  Filter only APPROVED mandates
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
      onBack && onBack();
      onOrderSuccess && onOrderSuccess();
      console.log("timer process done go back to orders page");
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

  const handleFinalConfirm = async () => {
    const selected =
      mandateDetails.find((m) => m.mandateId === selectedMandateId) || null;

    if (onConfirm) onConfirm(selected);

    setSelectedMandateId(selected?.mandateId ?? null);
    setTimerPage(true);

    const xsipSuccess = await handleXsip();

    if (!xsipSuccess) {
      return; //
    }

    if (selectedPaymentType === "netbanking") {
      setSecondsLeft(180);
      if (!stopEnach) {
        triggerENachLoop(); // Only call if stopEnach is false
      } // Start the recursive loop
    } else {
      setSecondsLeft(60);
    }
  };

  const handleXsip = async (mandateId?: any): Promise<boolean> => {
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
      transMode: selectedType === "physical" ? "P" : "D",
      dpTxnMode: selectedType === "physical" ? "P" : "C",
      frequencyAllowed: "1",
      dpc: "Y",
      internalRefNo: "",
      folioNo: redeemFolioNumber || "",
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
      const referenceNumber = response?.data?.data?.uniqueRefNumber;
      const sipReferenceNumber = response?.data?.data?.sipReg_ID;
      console.log(response?.data, "xsip");
      if (response?.data?.message === "SUCCESS") {
        if (referenceNumber && sipReferenceNumber) {
          internalRefNoRef.current = referenceNumber;
          sipRefNo.current = sipReferenceNumber;
          if (selectedType === "demat" && orderNumber && orderNumber !== "0") {
            setOrderNo(orderNumber);

            console.log(orderNumber, "Received Order Number");
            //  Now call handleSinglepayment
            setTimeout(() => {
              handleSinglepayment(orderNumber);
            }, 2000);
          }
          if (selectedType === "physical") {
            // Reset flags before starting
            clearPhysicalFlowTimers();
            if (response?.data?.message === "SUCCESS") {
              physical2FAIntervalRef.current = setInterval(() => {
                handlePhyicalOrder2FA({ referenceNumber });
              }, 10_000);
            }
          }
        }
        return true;
      } else {
        ShowToast("error", response?.data?.data?.bseRemarks);
        setStopEnach(true);
        toggle();
        setShowCreateMandateModal(false);
        setTimerPage(false);
        return false;
      }
    } catch (error) {
      console.error("Error fetching mandate status", error);
      return false;
    } finally {
      dispatch(hideLoader());
      return false;
    }
  };

  const handlePhyicalOrder2FA = async ({ referenceNumber }: any) => {
    if (is2FALinkOpenedRef.current) return;

    const payload = {
      clientcode: clientNo,
      loopbackURL:
        "https://middlewareapi.lkp.net.in/api/MF/PhysicalOrder2FAResponse",
      internalrefno: referenceNumber,
    };

    dispatch(showLoader("Verifying UPI..."));

    try {
      const response = await apiServices.PhyicalOrder2FA(payload);
      const url = response?.data?.responseString;

      if (url && url.includes("bsestarmf")) {
        is2FALinkOpenedRef.current = true;

        // stop polling PhysicalOrder2FA
        if (physical2FAIntervalRef.current) {
          clearInterval(physical2FAIntervalRef.current);
          physical2FAIntervalRef.current = null;
        }

        // ⏱ Open link after 5 seconds
        if (!openLinkTimeoutRef.current) {
          openLinkTimeoutRef.current = setTimeout(() => {
            window.open(url, "_blank", "noopener,noreferrer");

            if (!startPollingTimeoutRef.current) {
              startPollingTimeoutRef.current = setTimeout(() => {
                handle2FAResponse();
              }, 5000);
            }
          }, 5000);
        }
      }
    } catch (error) {
      console.error("Physical 2FA error", error);
    } finally {
      dispatch(hideLoader());
    }
  };
  const clearPhysicalFlowTimers = () => {
    if (physical2FAIntervalRef.current) {
      clearInterval(physical2FAIntervalRef.current);
      physical2FAIntervalRef.current = null;
    }

    if (apiTimerRef.current) {
      clearInterval(apiTimerRef.current);
      apiTimerRef.current = null;
    }

    if (openLinkTimeoutRef.current) {
      clearTimeout(openLinkTimeoutRef.current);
      openLinkTimeoutRef.current = null;
    }

    if (startPollingTimeoutRef.current) {
      clearTimeout(startPollingTimeoutRef.current);
      startPollingTimeoutRef.current = null;
    }

    is2FALinkOpenedRef.current = false;
  };

  const handle2FAResponse = () => {
    if (apiTimerRef.current) return;
    const TOTAL_TIME = 120;
    const API_INTERVAL = 10;

    let elapsed = 0;

    apiTimerRef.current = setInterval(() => {
      elapsed += API_INTERVAL;
      getPhysicalResponse();

      if (elapsed >= TOTAL_TIME) {
        console.log("Stopping SIP API polling (timeout)");
        clearInterval(apiTimerRef.current!);
        apiTimerRef.current = null;
      }
    }, API_INTERVAL * 1000);
  };

  const getPhysicalResponse = async () => {
    const payload = {
      internalrefno: internalRefNoRef.current,
    };

    dispatch(showLoader("Verifying UPI..."));

    try {
      const response = await apiServices.GetPhysicalResponse(payload);

      if (response?.data?.physical2FAFlag) {
        clearPhysicalFlowTimers();
        handleChildOrder();
      }
    } finally {
      dispatch(hideLoader());
    }
  };

  const handleChildOrder = async () => {
    const payload = {
      clientCode: clientNo,
      date: dayjs().format("DD MMM YYYY").toUpperCase(),
      regnNo: sipRefNo.current,
    };
    dispatch(showLoader("Verifying UPI..."));
    try {
      const response = await apiServices.ChildOrder(payload);
      let sipOrderNo = response?.data?.childOrderDetails[0]?.orderNumber;
      console.log(
        response?.data?.childOrderDetails[0],
        "handleChildOrder OrderNumber",
        sipOrderNo
      );
      setTimeout(() => {
        handleSinglepayment(sipOrderNo);
      }, 1000);
    } catch (error) {
    } finally {
      dispatch(hideLoader());
    }
  };

  const triggerENachLoop = async (mandateId?: any, retryCount = 0) => {
    if (retryCount > 12) {
      console.warn("triggerENachLoop Max retry limit reached.");
      return;
    }
    if (stopEnach) {
      console.log("ENach stopped manually.");
      return;
    }
    // debugger;
    let mandu = mandateId || selectedMandateId;
    const payload = {
      clientCode: clientNo,
      mandateID: mandu,
      loopbackurl: "https://lkpconnect.net.in/dashboard",
      dpFlag: selectedType === "physical" ? "P" : "",
    };
    if (!payload.clientCode || !payload.mandateID || !payload.loopbackurl) {
      console.warn("cechke payload cechke console", payload);
      return; //  Stop execution
    }
    dispatch(showLoader("Handling Enach..."));

    try {
      const response = await apiServices.BSEStar_MfMandateENACH(payload);
      const message = response?.data;

      console.log(message, "eNach url");

      //  success: open URL and send email
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
    //  Retry after 4 seconds
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

      if (
        responseMessage === "Email sent Succesfully" &&
        selectedType === "demat"
      ) {
        ShowToast("info", responseMessage);
        onOrderSuccess && onOrderSuccess();
        onBack && onBack();
        console.log(response?.data, "Email response from if loop");
        // setSecondsLeft(59); // check
      }
      if (
        responseMessage === "Email sent successfully" &&
        selectedType === "demat"
      ) {
        onOrderSuccess && onOrderSuccess();
        onBack && onBack();
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
        dpFlag: selectedType === "physical" ? "P" : "",
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
        onOrderSuccess && onOrderSuccess();
        onBack && onBack();
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
            //  Replace this block with your dynamic TimerModal component
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
                {mandateDetails.map((mandate) => {
                  const isDisabled =
                    parseFloat(mandate.amount) <= Number(amount);

                  return (
                    <div
                      key={mandate.mandateId}
                      onClick={() => {
                        if (isDisabled) return; // Prevent selection
                        setSelectedMandateId(mandate.mandateId);
                        setStopEnach(true);
                      }}
                      style={{
                        border:
                          selectedMandateId === mandate.mandateId
                            ? "2px solid #004AAD"
                            : "1px solid #ddd",
                        borderRadius: "6px",
                        padding: "10px 14px",
                        cursor: isDisabled ? "not-allowed" : "pointer",
                        backgroundColor: isDisabled
                          ? "#f5f5f5"
                          : selectedMandateId === mandate.mandateId
                          ? "#f5faff"
                          : "#fff",
                        opacity: isDisabled ? 0.6 : 1,
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
                          disabled={isDisabled} //  Disable radio
                          onChange={() => {
                            if (!isDisabled) {
                              setSelectedMandateId(mandate.mandateId);
                            }
                          }}
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            width: "16px",
                            height: "16px",
                            accentColor: "#004AAD",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </ModalBody>

        {!timerPage && (
          <ModalFooter
            style={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <Button
              style={{
                backgroundColor: "#307e34",
                color: "#fff",
                marginTop: "5px",
                border: "none",
              }}
              onClick={() => {
                setShowCreateMandateModal(true);
                setSelectedMandateId(null);
                setStopEnach(false);
              }}
            >
              Create New Mandate
            </Button>

            <div>
              <Button
                color="secondary"
                onClick={toggle}
                style={{ marginRight: "8px" }}
              >
                {cancelLabel}
              </Button>
              <Button
                color="primary"
                onClick={handleFinalConfirm}
                disabled={!selectedMandateId}
              >
                {confirmLabel}
              </Button>
            </div>
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
        selectedType={selectedType}
        minAmount={amount}
      />
    </>
  );
};

export default NestedModal;
