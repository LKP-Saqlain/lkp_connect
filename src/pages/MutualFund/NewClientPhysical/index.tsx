import { useState } from "react";
import PrimaryHolderDetails from "../../../components/common/MutualFunds/physicalHolderDetails/HolderDetails/Primary";
import SecondaryHolderDetails from "../../../components/common/MutualFunds/physicalHolderDetails/HolderDetails/Secondary";
import { holdingTypeOptions } from "../mfTypes";
import { Card, CardBody, CardHeader, Container } from "reactstrap";
import BankDetails from "../../../components/common/MutualFunds/physicalHolderDetails/BankDetails";
import {
  Button,
  FormControl,
  InputLabel,
  Select,
  Grid,
  MenuItem,
} from "@mui/material";
import NomineeDetails from "../../../components/common/MutualFunds/physicalHolderDetails/NomineeDetail";

const NewClientPhysical = () => {
  const [step, setStep] = useState(0);
  const [navDirection, setNavDirection] = useState<"next" | "prev" | null>(
    null
  );
  const [primaryPan, setPrimaryPan] = useState<string | null>(null);
  const [previousPayload, setPreviousPayload] = useState({});
  const [holdingType, setHoldingType] = useState("");
  const [holderCount, setHolderCount] = useState("");

  const handleGo = () => {
    if (!holdingType) return alert("Please select holding type");

    const count = Number(holderCount);
    if (!count || count < 1 || count > 3)
      return alert("Holder count must be between 1 and 3");
    setPrimaryPan(null);
    setNavDirection(null);
    setStep(1);
  };

  const filteredHolderCountOptions = (() => {
    if (holdingType === "SI") {
      return [{ label: "1", value: "1" }]; // Only one holder allowed
    }
    if (holdingType === "JO" || holdingType === "AS") {
      return [
        { label: "2", value: "2" },
        { label: "3", value: "3" },
      ]; // Minimum 2 for joint cases
    }
    return []; // When no holdingType selected
  })();

  const goNext = () => {
    setNavDirection("next");
    setStep((prev) => prev + 1);
  };

  const goPrev = () => {
    setNavDirection("prev");
    setStep((prev) => prev - 1);
  };

  return (
    <div className="page-content page-view">
      <Container fluid>
        <Card
          style={{
            borderRadius: "15px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            padding: "3px",
            marginBottom: "16px",
            minHeight: "80vh",
          }}
        >
          <CardHeader
            style={{
              fontSize: "20px",
              fontWeight: 600,
              padding: "15px",
            }}
          >
            New Client Physical Onboarding
          </CardHeader>

          <CardBody style={{ padding: "20px" }}>
            {/* STEP 0 */}
            {step === 0 && (
              <Grid container spacing={3} alignItems="center">
                {/* Holding Type */}
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="holding-type-label">
                      Holding Type
                    </InputLabel>
                    <Select
                      labelId="holding-type-label"
                      value={holdingType}
                      onChange={(e) => setHoldingType(e.target.value)}
                      label="Holding Typess"
                    >
                      {holdingTypeOptions.map((item, idx) => (
                        <MenuItem key={idx} value={item.value}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Holder Count */}
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="holder-count-label">
                      Holder Count
                    </InputLabel>
                    <Select
                      labelId="holder-count-label"
                      value={holderCount}
                      onChange={(e) => setHolderCount(e.target.value)}
                      label="Holder Countss"
                    >
                      {filteredHolderCountOptions.map((item, idx) => (
                        <MenuItem key={idx} value={item.value}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Go Button */}
                <Grid item xs={12} sm={2}>
                  <Button
                    onClick={handleGo}
                    variant="contained"
                    fullWidth
                    sx={{
                      bgcolor: "#263b80",
                      "&:hover": { bgcolor: "#1f2f66" },
                      p: 1,
                      fontWeight: 600,
                    }}
                  >
                    Go
                  </Button>
                </Grid>
              </Grid>
            )}

            {/* STEP 1: Primary Holder */}
            {step === 1 && (
              <PrimaryHolderDetails
                setStep={setStep}
                navDirection={navDirection}
                goPrev={goPrev}
                goNext={goNext}
                setPrimaryPan={setPrimaryPan}
                setPreviousPayload={setPreviousPayload}
                primaryPan={primaryPan}
                holdingType={holdingType}
              />
            )}

            {/* STEP 2 & 3: Secondary / Third Holder */}
            {step > 1 && step <= Number(holderCount) && (
              <SecondaryHolderDetails
                holderIndex={step}
                navDirection={navDirection}
                goPrev={goPrev}
                goNext={goNext}
                primaryPan={primaryPan}
                setPreviousPayload={setPreviousPayload}
                previousPayload={previousPayload}
              />
            )}

            {/* Bank */}
            {step === Number(holderCount) + 1 && (
              <BankDetails
                navDirection={navDirection}
                goPrev={goPrev}
                goNext={goNext}
                primaryPan={primaryPan}
                setPreviousPayload={setPreviousPayload}
                previousPayload={previousPayload}
              />
            )}

            {/* Nominee */}
            {step === Number(holderCount) + 2 && (
              <NomineeDetails
                setStep={setStep}
                // navDirection={navDirection}
                goPrev={goPrev}
                primaryPan={primaryPan}
                setPreviousPayload={setPreviousPayload}
                previousPayload={previousPayload}
              />
            )}
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default NewClientPhysical;
