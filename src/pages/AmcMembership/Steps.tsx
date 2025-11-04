import { useEffect, useState } from "react";
import ClientInfo from "./ClientInfo";
import PaymentChoice from "./PaymentChoice";
import Logo from "../../assets/logo.png";
// import LedgerOtp from "./Ledger/LedgerOtp";
import { Card, CardHeader } from "reactstrap";
import ESign from "./CommonSteps/ESign";
import TariffForm from "./CommonSteps/TariffForm";
import Confirmation from "./CommonSteps/Confirmation";
import { useLocation, useNavigate } from "react-router-dom";
import Bsda from "./CommonSteps/Bdsa";

const AmcMembership = () => {
  const [step, setStep] = useState(1);
  const [flow, setFlow] = useState<"ledger" | "online" | null>(null);
  const [clientData, setClientData] = useState<any>(null);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [totalPayable, setTotalPayable] = useState<any>(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Step: Initialize selectedRow from either state or sessionStorage
  useEffect(() => {
    const fromState = location.state?.selectedRow;
    const fromStorage = sessionStorage.getItem("selectedRow");

    if (fromState) {
      setSelectedRow(fromState);
      sessionStorage.setItem("selectedRow", JSON.stringify(fromState)); // persist it
    } else if (fromStorage) {
      setSelectedRow(JSON.parse(fromStorage));
    } else {
      console.warn("No selectedRow found. Redirecting.");
      navigate("/dashboard"); // or show error UI
    }
  }, [location.state, navigate]);

  // Step: Auto-remove from sessionStorage when flow completes (final step)
  useEffect(() => {
    console.log("current step", step);
  }, [step]);

  // ✅ Fix typo: use bSDA_Flag (not bsdA_Flag)
  const isBSDA = selectedRow?.bsdA_Flag === "Y";

  // const handleGoBack = () => {
  //   sessionStorage.removeItem("selectedRow"); // cleanup
  //   navigate("/dashboard");
  // };

  const goToStep2 = () => setStep(isBSDA ? 3 : 2); // dynamic back step

  return (
    <div
      className="page-content page-view"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f7fa", // Light background (optional)
      }}
    >
      <Card
        style={{
          maxWidth: "90%",
          margin: "auto",
          borderRadius: "15px",
          boxShadow: "0px 6.16px 17.68px -0.88px #00000036",
          padding: "1.5rem",
          backgroundColor: "#fff", // White card background
        }}
      >
        {/* Common Header */}
        <CardHeader
          style={{
            backgroundColor: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            padding: "1rem",
            marginBottom: "2rem",
          }}
        >
          <img src={Logo} alt="LKP Logo" style={{ height: "70px" }} />
          <h2
            style={{
              fontWeight: "700",
              color: "#1c3c6b",
              margin: 0,
              flex: 1,
              textAlign: "center",
              marginRight: "150px",
            }}
          >
            {isBSDA && step === 2
              ? "BSDA Consent Required From Client"
              : "Online Lifetime AMC Scheme Activation"}
          </h2>
        </CardHeader>

        {/* Step-based Flow */}
        {step === 1 && selectedRow && (
          <ClientInfo
            onNext={() => setStep(isBSDA ? 2 : 2)} // always go to next (BSDA handled separately)
            selectedRow={selectedRow}
            setClientData={setClientData}
            goToStep4={() => {
              setFlow("online");
              setStep(isBSDA ? 5 : 4);
            }}
          />
        )}

        {isBSDA && step === 2 && (
          <Bsda onNext={() => setStep(3)} clientData={clientData} />
        )}

        {((!isBSDA && step === 2) || (isBSDA && step === 3)) && (
          <PaymentChoice
            clientData={clientData}
            onLedger={() => {
              setFlow("ledger");
              setStep(isBSDA ? 4 : 3);
            }}
            onOnline={() => {
              setFlow("online");
              setStep(isBSDA ? 4 : 3);
            }}
            setTotalPayable={setTotalPayable}
          />
        )}

        {/* {flow === "ledger" && (
            <>
              {step === 3 && (
                <LedgerOtp onNext={next} clientData={clientData} />
              )}
              {step === 4 && (
                <Confirmation
                  onNext={next}
                  // status={1}
                  flow={flow}
                  selectedRow={selectedRow}
                  totalPayable={totalPayable}
                  onBackToStep2={goToStep2}
                  complete={false}
                />
              )}
              {step === 5 && (
                <TariffForm onNext={next} selectedRow={selectedRow} />
              )}
              {step === 6 && <ESign selectedRow={selectedRow} onNext={next} />}
              {step === 7 && (
                <Confirmation
                  flow={flow}
                  selectedRow={selectedRow}
                  totalPayable={totalPayable}
                  onNext={() => {}}
                  onBackToStep2={goToStep2}
                  complete={true}
                />
              )}
            </>
          )} */}

        {flow === "online" && (
          <>
            {/* Step 3 or 4: Confirmation */}
            {step === (isBSDA ? 4 : 3) && (
              <Confirmation
                onNext={() => setStep(isBSDA ? 5 : 4)}
                flow={flow}
                selectedRow={selectedRow}
                totalPayable={totalPayable}
                onBackToStep2={goToStep2}
                complete={false}
              />
            )}

            {/* Step 4 or 5: Tariff Form */}
            {step === (isBSDA ? 5 : 4) && (
              <TariffForm
                onNext={() => setStep(isBSDA ? 6 : 5)}
                selectedRow={selectedRow}
              />
            )}
            {step === (isBSDA ? 6 : 5) && (
              <ESign
                selectedRow={selectedRow}
                onNext={() => setStep(isBSDA ? 7 : 6)}
              />
            )}

            {/* Step 6 or 7: Final Confirmation */}
            {step === (isBSDA ? 7 : 6) && (
              <Confirmation
                flow={flow}
                selectedRow={selectedRow}
                totalPayable={totalPayable}
                onNext={() => {}}
                onBackToStep2={goToStep2}
                complete={true}
              />
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default AmcMembership;
