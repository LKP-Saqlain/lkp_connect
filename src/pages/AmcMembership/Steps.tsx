import { useEffect, useState } from "react";
import ClientInfo from "./ClientInfo";
import PaymentChoice from "./PaymentChoice";
import Logo from "../../assets/logo.png";
import LedgerOtp from "./Ledger/LedgerOtp";
import { Button, Card, CardHeader, Container } from "reactstrap";
import ESign from "./CommonSteps/ESign";
import TariffForm from "./CommonSteps/TariffForm";
import Confirmation from "./CommonSteps/Confirmation";
import { useLocation, useNavigate } from "react-router-dom";

const AmcMembership = () => {
  const [step, setStep] = useState(1);
  const [flow, setFlow] = useState<"ledger" | "online" | null>(null);
  const [clientData, setClientData] = useState<any>(null);
  const [selectedRow, setSelectedRow] = useState<any>(null);

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
    if (step === 6) {
      sessionStorage.removeItem("selectedRow");
    }
  }, [step]);

  const next = () => setStep((s) => s + 1);

  const handleGoBack = () => {
    sessionStorage.removeItem("selectedRow"); // cleanup
    navigate("/dashboard");
  };

  return (
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
            <Button
              color="primary"
              style={{
                borderRadius: "6px",
                backgroundColor: "#003366",
                border: "none",
              }}
              onClick={handleGoBack}
            >
              Back to Dashboard
            </Button>
          </CardHeader>

          {/* Step-based Flow */}
          {step === 1 && selectedRow && (
            <ClientInfo
              onNext={next}
              selectedRow={selectedRow}
              setClientData={setClientData}
            />
          )}

          {step === 2 && (
            <PaymentChoice
              clientData={clientData}
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
              {step === 3 && (
                <LedgerOtp onNext={next} clientData={clientData} />
              )}
              {step === 4 && <Confirmation onNext={next} status={1} />}
              {step === 5 && (
                <TariffForm onNext={next} selectedRow={selectedRow} />
              )}
              {step === 6 && <ESign selectedRow={selectedRow} />}
            </>
          )}

          {flow === "online" && (
            <>
              {step === 3 && <Confirmation onNext={next} status={3} />}
              {step === 4 && (
                <TariffForm onNext={next} selectedRow={selectedRow} />
              )}
              {step === 5 && <ESign selectedRow={selectedRow} />}
            </>
          )}
        </Card>
      </Container>
    </div>
  );
};

export default AmcMembership;
