import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import NomineeSection from "./NomineeSection";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../../redux/store";
import {
  hideLoader,
  showLoader,
} from "../../../../../redux/slices/loaderSlice";
import { apiServices } from "../../../../../services";
import ShowToast from "../../../../../utils/toastUtils";
import { encryptAES } from "../../../../../utils/encryptDecrypt";

const TOTAL_NOMINEES = 3;

const NomineeDetails = ({
  goPrev,
  previousPayload,
  primaryPan,
  setStep,
}: any) => {
  const [data, setData] = useState<Record<string, any>>({});
  const [validity, setValidity] = useState<Record<number, boolean>>({
    1: false, // mandatory
    2: true, // optional
    3: true, // optional
  });
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );
  const dispatch = useDispatch<AppDispatch>();

  const handleChange = ({ field, value }: { field: string; value: any }) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveStatus = (index: number, valid: boolean) => {
    setValidity((prev) => ({ ...prev, [index]: valid }));
  };

  // Calculate total applicable %
  const totalApplicable = Array.from({ length: TOTAL_NOMINEES }, (_, i) => {
    const key = `nominee${i + 1}Applicable`;
    return Number(data[key]) || 0;
  }).reduce((a, b) => a + b, 0);

  const canProceed = validity[1] && totalApplicable === 100;

  const handleNext = () => {
    if (!validity[1]) {
      alert("Nominee 1 is mandatory. Please complete nominee 1 details.");
      return;
    }

    if (totalApplicable !== 100) {
      alert(
        `Total Applicable % must be exactly 100. Currently it is ${totalApplicable}%.`
      );
      return;
    }
    console.log("FINAL NOMINEE DATA:", data);

    // proceed to submit / next step
    SendData(data);
  };

  const SendData = (values: any) => {
    const payload = {
      ...previousPayload,
      ...data,
    };
    console.log(values, "Final Payload :", payload);

    dispatch(showLoader("Fetching Previous Data..."));

    apiServices
      .PhysicalManualOnboarding(payload)
      .then((response: any) => {
        const data = response?.data?.data;

        if (data.includes("Successfully")) {
          FinalApiCalls();
          ShowToast("success", data);
        } else {
          ShowToast("error", "Error While processing data");
        }
      })
      .catch((error: any) => {
        console.error("PhysicalClientInfo Error:", error);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  const FinalApiCalls = async () => {
    const payload = {
      clientCode: "",
      panno: primaryPan,
      loginId: user_id,
      // loginId: "EMP-5123",
    };
    try {
      dispatch(showLoader("Processing..."));
      // 1️⃣ Registration
      const regResponse = await apiServices.PhysicalClientRegistration(payload);
      console.log("Registration Response:", regResponse);

      const regData = regResponse?.data || {};
      const message = String(regData?.message || "").toLowerCase();
      const ClientCode = regData?.data?.data?.clientCode;
      const isRegistered =
        message.includes("registered successfully") ||
        message.includes("save successfully");

      console.log("Registered?", regData?.data?.data, isRegistered, ClientCode);

      if (!isRegistered) {
        console.warn("Registration NOT successful → skipping Elog");
        return; // stop further execution
      }
      if (!ClientCode) {
        console.warn("ClientCode Missing");
        // return; // stop further execution
      }

      // 2️⃣ Call Elog API
      let loopBackUrl = encryptAES(ClientCode);
      loopBackUrl = encodeURIComponent(loopBackUrl);
      loopBackUrl = `${window.location.origin}/PhysicalStats/${loopBackUrl}`;

      const elogResponse = await apiServices.ElogForPhysical({
        ClientCode,
        loopBackUrl,
      });

      console.log("ElogForPhysical Response:", elogResponse);

      if (elogResponse?.data?.message === "ELOG Link Generated Successfully") {
        const url = elogResponse?.data?.data;
        window.open(url, "_blank", "noopener,noreferrer");
        setStep(0);
      }
    } catch (error) {
      console.error("FinalApiCalls Error:", error);
    } finally {
      dispatch(hideLoader());
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Nominee Details
      </Typography>

      {/* Show current total applicable */}

      <NomineeSection
        data={data}
        onChange={handleChange}
        onSaveStatus={handleSaveStatus}
      />

      {/*  Validation Feedback */}
      <Box mt={2}>
        <Typography
          variant="body2"
          sx={{
            color: totalApplicable === 100 ? "green" : "error.main",
            fontWeight: 500,
          }}
        >
          Total Applicable : {totalApplicable}%
          {totalApplicable !== 100 && " (Must be exactly 100%)"}
        </Typography>
      </Box>

      {/* Navigation Buttons */}
      <Box mt={4} display="flex" justifyContent="space-between">
        <Button variant="contained" color="inherit" onClick={goPrev}>
          Prev
        </Button>

        <Button
          variant="contained"
          color="primary"
          disabled={!canProceed}
          onClick={handleNext}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default NomineeDetails;
