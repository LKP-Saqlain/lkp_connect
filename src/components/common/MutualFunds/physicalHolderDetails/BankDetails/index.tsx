import { Box } from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { useEffect, useRef } from "react";
import {
  showLoader,
  hideLoader,
} from "../../../../../redux/slices/loaderSlice";
import { apiServices } from "../../../../../services";
import BankSection from "./BankSection";
import {
  bankSchema,
  optionalBankSchema,
} from "../../../../../pages/MutualFund/mfTypes";
import ShowToast from "../../../../../utils/toastUtils";

const initialBank = {
  bankAccNo: "",
  reBankAccNo: "",
  ifscCode: "",
  accountType: "",
  bankName: "",
  micrCode: "",
  isVerified: false,
};

const BankDetails = ({
  navDirection,
  goPrev,
  goNext,
  primaryPan,
  setPreviousPayload,
  previousPayload,
}: any) => {
  const dispatch = useDispatch();
  const formikRef = useRef<any>(null);

  /* ------------ FETCH PREVIOUS BANK DATA ------------ */
  const previousData = (setValues: any) => {
    const payload = {
      panno: primaryPan,
      // panno: "testt1234b",
    };

    dispatch(showLoader("Fetching Previous Data..."));

    apiServices
      .GetPhysicalClientDetails(payload)
      .then((response: any) => {
        const data = response?.data?.data;
        console.log("Previous Bank Data:", data);

        setValues((prev: any) => ({
          ...prev,
          default: {
            ...prev.default,
            bankAccNo: data?.accountNo1 || "",
            reBankAccNo: data?.accountNo1 || "",
            ifscCode: data?.ifscCode1 || "",
            micrCode: data?.micrNo1 || "",
            accountType: data?.accountType1 || "",
            bankName: "",
            isVerified: false,
          },
          optional: {
            ...prev.optional,
            bankAccNo: data?.accountNo2 || "",
            reBankAccNo: data?.accountNo2 || "",
            ifscCode: data?.ifscCode2 || "",
            micrCode: data?.micrNo2 || "",
            accountType: data?.accountType2 || "",
            bankName: "",
            isVerified: false,
          },
        }));
      })
      .catch(() => {
        ShowToast("error", "Failed to fetch bank data");
      })
      .finally(() => dispatch(hideLoader()));
  };

  /* ------------ EFFECT (CORRECT PLACE) ------------ */
  useEffect(() => {
    if (navDirection === "prev" && formikRef.current) {
      previousData(formikRef.current.setValues);
    }
    console.log("previousPayload--->", previousPayload);
  }, [navDirection]);

  const SendData = (values: any) => {
    console.log("SendData values: ", values, previousPayload);

    const payload = {
      ...previousPayload,
      // DEFAULT BANK (Bank 1)
      accountType1: values.default.accountType || "",
      accountNo1: values.default.bankAccNo || "",
      micrNo1: values.default.micrCode || "",
      ifscCode1: values.default.ifscCode || "",
      defaultBankFlag1: "Y",
      // OPTIONAL BANK (Bank 2)
      accountType2: values.optional.accountType || "",
      accountNo2: values.optional.bankAccNo || "",
      micrNo2: values.optional.micrCode || "",
      ifscCode2: values.optional.ifscCode || "",
      defaultBankFlag2: "",
      // clientType: "p", // remove at end
    };

    console.log("Final Bank Payload:", payload);

    dispatch(showLoader("Submitting Bank Details..."));

    apiServices
      .PhysicalManualOnboarding(payload)
      .then((response: any) => {
        const data = response?.data?.data;

        if (data.includes("Successfully")) {
          setPreviousPayload((prev: any) => ({
            ...prev,
            ...payload,
          }));
          ShowToast("success", data);
          goNext();
        } else {
          ShowToast("error", "Error While Submitting data");
        }
      })
      .catch((error: any) => {
        console.error("Bank Submit Error:", error);
        ShowToast("error", "Failed to submit bank details");
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  return (
    <Formik
      innerRef={formikRef}
      initialValues={{
        default: { ...initialBank },
        optional: { ...initialBank },
      }}
      validationSchema={Yup.object({
        default: bankSchema,
        optional: optionalBankSchema,
      })}
      onSubmit={(values) => {
        console.log("Submitted Bank Values:", values);
        SendData(values);
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        setFieldValue,
        handleSubmit,
      }) => {
        /* ------------ VERIFY BANK ------------ */
        const verifyBank = async (type: "default" | "optional") => {
          const bank = values[type];

          if (bank.isVerified) return;

          if (
            !bank.bankName ||
            !bank.accountType ||
            !bank.ifscCode ||
            !bank.bankAccNo ||
            !bank.reBankAccNo
          ) {
            ShowToast("error", "Please fill all required details");
            return;
          }

          if (bank.bankAccNo !== bank.reBankAccNo) {
            ShowToast("error", "Account numbers do not match");
            return;
          }

          dispatch(showLoader("Verifying Bank Details..."));

          try {
            const response = await apiServices.VerifyBankDetails({
              bankAccNo: bank.bankAccNo,
              ifscCode: bank.ifscCode,
            });
            if (response?.data?.isSuccess) {
              setFieldValue(`${type}.isVerified`, !!response?.data?.isSuccess);
            } else {
              setFieldValue(`${type}.isVerified`, false);
              ShowToast("error", "Bank Verification Failed");
            }
          } catch {
            setFieldValue(`${type}.isVerified`, false);
          } finally {
            dispatch(hideLoader());
          }
        };

        return (
          <form onSubmit={handleSubmit}>
            {/* DEFAULT BANK */}
            <BankSection
              title="Bank Details - (Default)"
              values={values.default}
              errors={errors.default || {}}
              touched={touched.default || {}}
              disabled={values.default.isVerified}
              onChange={(e) => {
                handleChange({
                  ...e,
                  target: {
                    ...e.target,
                    name: `default.${e.target.name}`,
                  },
                });
                setFieldValue("default.isVerified", false);
              }}
              onVerify={() => verifyBank("default")}
            />

            {/* OPTIONAL BANK */}
            <Box mt={4}>
              <BankSection
                title="Bank Details - (Optional)"
                values={values.optional}
                errors={errors.optional || {}}
                touched={touched.optional || {}}
                disabled={values.optional.isVerified}
                onChange={(e) => {
                  handleChange({
                    ...e,
                    target: {
                      ...e.target,
                      name: `optional.${e.target.name}`,
                    },
                  });
                  setFieldValue("optional.isVerified", false);
                }}
                onVerify={() => verifyBank("optional")}
              />
            </Box>

            {/* NAVIGATION */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "20px",
              }}
            >
              <button
                type="button"
                onClick={goPrev}
                style={{
                  padding: "8px 20px",
                  background: "#a0a0a0",
                  color: "#fff",
                  borderRadius: "6px",
                  border: "none",
                }}
              >
                Prev
              </button>

              <button
                type="submit"
                disabled={!values.default.isVerified}
                style={{
                  padding: "8px 20px",
                  background: values.default.isVerified ? "#1c3c6b" : "#b0b0b0",
                  color: "#fff",
                  borderRadius: "6px",
                  border: "none",
                  cursor: values.default.isVerified ? "pointer" : "not-allowed",
                }}
              >
                Next
              </button>
            </div>
          </form>
        );
      }}
    </Formik>
  );
};

export default BankDetails;
