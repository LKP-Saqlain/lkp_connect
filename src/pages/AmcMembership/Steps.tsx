import { useEffect, useState } from "react";
import ClientInfo from "./ClientInfo";
import PaymentChoice from "./PaymentChoice";
import Logo from "../../assets/logo.png";
import LedgerOtp from "./Ledger/LedgerOtp";
import { Card, CardHeader, Container } from "reactstrap";
import ESign from "./CommonSteps/ESign";
import TariffForm from "./CommonSteps/TariffForm";
import Confirmation from "./CommonSteps/Confirmation";

const AmcMembership = () => {
  const [step, setStep] = useState(1);
  const [flow, setFlow] = useState<"ledger" | "online" | null>(null);

  const next = () => setStep((s) => s + 1);

  useEffect(() => {
    console.log("current step is ", step);
  }, [step]);

  return (
    <>
      <div className="page-content page-view">
        <Container fluid>
          <Card
            style={{
              borderRadius: "15px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
              padding: "1.5rem",
              backgroundColor: "#fff",
              margin: "0 auto",
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
              <img src={Logo} alt="LKP Logo" style={{ height: "40px" }} />
              <h5
                style={{
                  fontWeight: "600",
                  color: "#1c3c6b",
                  margin: 0,
                  flex: 1,
                  textAlign: "center",
                }}
              >
                Online Lifetime AMC Scheme Activation
              </h5>
            </CardHeader>
            {step === 1 && <ClientInfo onNext={next} />}
            {step === 2 && (
              <PaymentChoice
                onLedger={() => {
                  setFlow("ledger");
                  next();
                }}
                onOnline={() => {
                  setFlow("online");
                  next();
                }}
              />
            )}

            {flow === "ledger" && (
              <>
                {step === 3 && <LedgerOtp onNext={next} />}
                {step === 4 && <Confirmation onNext={next} status={1} />}
                {step === 5 && <TariffForm onNext={next} />}
                {step === 6 && <ESign />}
              </>
            )}

            {flow === "online" && (
              <>
                {step === 3 && <Confirmation onNext={next} status={3} />}
                {step === 4 && <TariffForm onNext={next} />}
                {step === 5 && <ESign />}
              </>
            )}
          </Card>
        </Container>
      </div>
    </>
  );
};

export default AmcMembership;
