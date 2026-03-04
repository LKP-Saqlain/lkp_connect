import { useEffect, useState } from "react";
import ClientInfo from "../AmcMembershipQ4/ClientInfo";
import PaymentChoice from "../AmcMembershipQ4/PaymentChoice";
import Logo from "../../assets/logo.png";
import LedgerOtp from "../AmcMembershipQ4/Ledger/LedgerOtp";
import { Card, CardHeader } from "reactstrap";
import ESign from "../AmcMembershipQ4/CommonSteps/ESign";
import TariffForm from "../AmcMembershipQ4/CommonSteps/TariffForm";
import Confirmation from "../AmcMembershipQ4/CommonSteps/Confirmation";
import { useLocation, useNavigate } from "react-router-dom";
import Bsda from "../AmcMembershipQ4/CommonSteps/Bdsa";
import { decryptAES } from "../../utils/encryptDecrypt";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { hideLoader, showLoader } from "../../redux/slices/loaderSlice";
import { apiServices } from "../../services";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

const AmcMembership = () => {
  const [step, setStep] = useState(1);
  const [flow, setFlow] = useState<"ledger" | "online" | null>(null);
  const [clientData, setClientData] = useState<any>(null);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [totalPayable, setTotalPayable] = useState<any>(null);
  const [passUserId, setPassUserId] = useState<string>("");

  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const location = useLocation();
  const navigate = useNavigate();

  // Step: Initialize selectedRow from either state or sessionStorage
  useEffect(() => {
    const fromState = location.state?.selectedRow;
    const fromStorage = sessionStorage.getItem("selectedRow");
    const queryParams = new URLSearchParams(location.search);
    const isAMCLink = window.location.pathname.includes("AMCLink");

    if (isAMCLink && queryParams.get("boid") && queryParams.get("user")) {
      // External link scenario or pasted link
      const decryptedBOID = decryptAES(
        decodeURIComponent(queryParams.get("boid")!)
      );
      const decryptedUserId = decryptAES(
        decodeURIComponent(queryParams.get("user")!)
      );
      setPassUserId(decryptedUserId);

      fetchData({ decryptedBOID, decryptedUserId });
      // Data will be saved to sessionStorage inside fetchData
    } else if (fromState) {
      // Internal navigation with state
      setSelectedRow(fromState);
    } else if (fromStorage) {
      // Returning user, sessionStorage exists
      setSelectedRow(JSON.parse(fromStorage));
    } else {
      console.warn("No selectedRow found. Redirecting.");
      navigate("/dashboard");
    }
  }, [location.state, location.search]);

  const fetchData = ({ decryptedBOID, decryptedUserId }: any) => {
    const payload = {
      zone: "ALL",
      branchCode: "Q4",
      tradingCode: decryptedBOID,
      userId: decryptedUserId,
      // userId: "EMP-5376",
    };
    dispatch(showLoader("Please wait, we are processing your request..."));
    apiServices
      .GetClientModuleDataForAmc(payload)
      .then((response) => {
        console.log("Responseee-->", response?.data);

        const withoutLifetime =
          response?.data?.data?.withoutLifetimeAMC[0] || [];
        console.log("testeststasd", withoutLifetime);

        setSelectedRow(withoutLifetime);
        sessionStorage.setItem("selectedRow", JSON.stringify(withoutLifetime));
      })
      .catch((error) => {
        console.error("Error fetching compliance data:", error);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  // Step: Auto-remove from sessionStorage when flow completes (final step)
  useEffect(() => {
    console.log("current step", step);
  }, [step]);

  //  Fix typo: use bSDA_Flag (not bsdA_Flag)
  const isBSDA = selectedRow?.bsda === "Active";

  // const handleGoBack = () => {
  //   sessionStorage.removeItem("selectedRow"); // cleanup
  //   navigate("/dashboard");
  // };

  const goToStep2 = () => setStep(isBSDA ? 3 : 2); // dynamic back step
  useEffect(() => {
    console.log("TESTeFFECT", selectedRow);
  }, [selectedRow]);
  return (
    <div
      className="page-content page-view"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f7fa",
        padding: isMobile ? "1rem" : "2rem",
      }}
    >
      <Card
        style={{
          width: isMobile ? "100%" : "90%",
          margin: "auto",
          borderRadius: "15px",
          boxShadow: "0px 6.16px 17.68px -0.88px #00000036",
          padding: isMobile ? "1rem" : "1.5rem",
          backgroundColor: "#fff",
        }}
      >
        {/* Common Header */}
        <CardHeader
          style={{
            backgroundColor: "#fff",
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: "center",
            justifyContent: "center",
            gap: isMobile ? "8px" : "12px",
            padding: "1rem",
            marginBottom: isMobile ? "1.5rem" : "2rem",
            textAlign: isMobile ? "center" : "left",
          }}
        >
          <img
            src={Logo}
            alt="LKP Logo"
            style={{
              height: isMobile ? "55px" : "70px",
              marginBottom: isMobile ? "0.5rem" : 0,
            }}
          />
          <h2
            style={{
              fontWeight: 700,
              color: "#1c3c6b",
              margin: 0,
              flex: 1,
              textAlign: "center",
              fontSize: isMobile ? "28px" : "34px",
              marginRight: isMobile ? "0" : "150px",
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
            passUserId={passUserId}
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

        {flow === "ledger" && (
          <>
            {step === (isBSDA ? 4 : 3) && (
              <LedgerOtp
                onNext={() => setStep(isBSDA ? 5 : 4)}
                clientData={clientData}
              />
            )}
            {step === (isBSDA ? 5 : 4) && (
              <Confirmation
                onNext={() => setStep(isBSDA ? 6 : 5)}
                // status={1}
                flow={flow}
                selectedRow={selectedRow}
                totalPayable={totalPayable}
                onBackToStep2={goToStep2}
                complete={false}
              />
            )}
            {step === (isBSDA ? 6 : 5) && (
              <TariffForm
                onNext={() => setStep(isBSDA ? 7 : 6)}
                selectedRow={selectedRow}
              />
            )}
            {step === (isBSDA ? 7 : 6) && (
              <ESign
                selectedRow={selectedRow}
                onNext={() => setStep(isBSDA ? 8 : 7)}
              />
            )}
            {step === (isBSDA ? 8 : 7) && (
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
