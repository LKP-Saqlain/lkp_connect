import { useEffect, useState } from "react";
import ClientInfo from "./ClientInfo";
import PaymentChoice from "./PaymentChoice";
import Logo from "../../assets/logo.png";
// import LedgerOtp from "./Ledger/LedgerOtp";
import { Card, CardHeader, Container } from "reactstrap";
import ESign from "./CommonSteps/ESign";
import TariffForm from "./CommonSteps/TariffForm";
import Confirmation from "./CommonSteps/Confirmation";
import { useLocation, useNavigate } from "react-router-dom";

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

  const next = () => setStep((s) => s + 1);

  // const handleGoBack = () => {
  //   sessionStorage.removeItem("selectedRow"); // cleanup
  //   navigate("/dashboard");
  // };

  const goToStep2 = () => setStep(2);
  const goToStep4 = () => setStep(4);

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
      <Container fluid>
        <Card
          style={{
            maxWidth: "90%",
            maxHeight: "90%",
            margin: "auto",
            borderRadius: "15px",
            // boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            boxShadow: " 0px 6.16px 17.68px -0.88px #00000036",
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
            <img src={Logo} alt="LKP Logo" style={{ height: "50px" }} />
            <h4
              style={{
                fontWeight: "700",
                color: "#1c3c6b",
                margin: 0,
                flex: 1,
                textAlign: "center",
                marginRight: "150px",
              }}
            >
              Online Lifetime AMC Scheme Activation
            </h4>
            {/* <Button
              color="primary"
              style={{
                borderRadius: "6px",
                backgroundColor: "#003366",
                border: "none",
              }}
              onClick={handleGoBack}
            >
              Back to Dashboard
            </Button> */}
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
              setTotalPayable={setTotalPayable}
              goToStep4={goToStep4}
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
              {step === 3 && (
                <Confirmation
                  onNext={next}
                  // status={3}
                  flow={flow}
                  selectedRow={selectedRow}
                  totalPayable={totalPayable}
                  onBackToStep2={goToStep2}
                  complete={false}
                />
              )}
              {step === 4 && (
                <TariffForm onNext={next} selectedRow={selectedRow} />
              )}
              {step === 5 && <ESign selectedRow={selectedRow} onNext={next} />}
              {step === 6 && (
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
      </Container>
    </div>
  );
};

export default AmcMembership;
