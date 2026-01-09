import {
  Modal,
  ModalBody,
  Button,
  ModalHeader,
  Col,
  Row,
  Input,
} from "reactstrap";
// import RadioInput from "../RadioInput";
import { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { apiServices } from "../../../services";
import ShowToast from "../../../utils/toastUtils";

// New types for clarity and safety
interface BrokerageHistoryItem {
  moduleNo: string;
  md_dt: string;
  desc: string;
  bperc: number;
  rnum: number;
  cc: string;
  seg: string;
}

interface ModalComponentProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
  BrokerageTitle?: any;
  handleFileUpload?: (file: File, type?: any) => void;
  uploadedFileName?: any;
}

const keys = [
  "EquityFutures",
  "EquityOptions",
  "CurrencyFutures",
  "CurrencyOptions",
  "CommodityFutures",
  "CommodityOptions",
  "EquityIntradayPer",
  "EquityDeliveryPer",
  "EquityIntradayMin",
  "EquityDeliveryMin",
];

const ModalComponent = ({
  isOpen,
  onClose,
  BrokerageTitle,
  handleFileUpload,
  uploadedFileName,
}: ModalComponentProps) => {
  const [selectedValue, setSelectedValue] = useState("");
  const [step, setStep] = useState(1); // Step 1 = Select Plan, Step 2 = Confirm Plan
  const [choosePlans, setChoosePlans] = useState<string[]>([]);
  const [allPlans, setAllPlans] = useState<any[]>([]);
  const [history, setHistory] = useState<BrokerageHistoryItem[]>([]);
  const [currentPlan, setCurrentPlan] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [showConsent, setShowConsent] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch<AppDispatch>();

  // Destructure BrokerageTitle early to avoid repeated optional chaining
  const { typ, cc } = BrokerageTitle || {};

  // Fetch brokerage plans
  useEffect(() => {
    if (!typ) return; // Exit early — don't call the API yet

    const payload = { segment: typ };
    console.log("Fetching plans for segment", typ);

    dispatch(showLoader("Please wait..."));

    apiServices
      .GetBrokeragePlans(payload)
      .then((response) => {
        if (response?.status === 200) {
          const plans = response?.data?.data;
          console.log("Fetched Brokerage Plans---raw", plans);
          if (Array.isArray(plans)) {
            const typeList = plans.map((item) => item.Type);
            setChoosePlans(typeList);
            setAllPlans(plans);
          }
        }
      })
      .catch((err) => console.log("Error", err))
      .finally(() => dispatch(hideLoader()));
  }, [typ]);

  useEffect(() => {
    console.log("Test", currentPlan);
  }, [currentPlan]);

  // Fetch brokerage modification history
  useEffect(() => {
    if (!cc || !typ) return; // Exit early if required fields are missing

    const payload = { clientcode: cc, segment: typ };
    console.log("Fetching modification history");

    dispatch(showLoader("Please wait..."));

    apiServices
      .GetBrokerageModificationHistory(payload)
      .then((response) => {
        if (response?.status === 200) {
          const plans = response?.data?.data;
          console.log("Fetched history---raw", plans);
          if (Array.isArray(plans)) {
            setHistory(plans);
            if (plans.length > 0) {
              setCurrentPlan(plans[0]); //  Store the current plan
            }
          }
        }
      })
      .catch((err) => console.error("API error:", err))
      .finally(() => dispatch(hideLoader()));
  }, [cc, typ]);

  // const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   const selectedValue = event.target.value;
  //   setSelectedValue(selectedValue);

  //   const matchedPlan = allPlans.find((plan) => plan.Type === selectedValue);
  //   console.log("Selected Value:", selectedValue);
  //   console.log("Brokerage Plans:", matchedPlan);
  //   console.log("Current History:", currentPlan);

  //   if (!matchedPlan) {
  //     console.warn("No matched plan found.");
  //     setShowConsent(false); // reset just in case
  //     return;
  //   }

  //   let consentNeeded = false;

  //   for (const key of keys) {
  //     const value = matchedPlan[key];

  //     if (value === undefined || value === null) continue;

  //     console.log(`${key}:`, value);

  //     if (value > currentPlan.bperc) {
  //       console.log(`${key} is greater than bperc → show consent`);
  //       consentNeeded = true;
  //       break;
  //     } else if (value < currentPlan.bperc) {
  //       console.log(`${key} is smaller than bperc → no consent`);
  //       continue;
  //     } else {
  //       // If equal, check min field only for Intraday/Delivery
  //       const isIntradayOrDelivery =
  //         key === "EquityIntradayPer" || key === "EquityDeliveryPer";

  //       if (!isIntradayOrDelivery) continue;

  //       const minKey =
  //         key === "EquityIntradayPer"
  //           ? "EquityIntradayMin"
  //           : "EquityDeliveryMin";

  //       const minValue = matchedPlan[minKey];

  //       if (minValue > currentPlan.bpmin) {
  //         console.log(
  //           `${minKey} (${minValue}) > bpmin (${currentPlan.bpmin}) → show consent`
  //         );
  //         consentNeeded = true;
  //         break;
  //       } else {
  //         console.log(`${minKey} is lesser or equal → no consent`);
  //       }
  //     }
  //   }
  //   setShowConsent(consentNeeded);
  // };
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setSelectedValue(selectedValue);

    const matchedPlan = allPlans.find((plan) => plan.Type === selectedValue);
    setSelectedPlan(matchedPlan);
    console.log("Selected Value:", selectedValue);
    console.log("Brokerage Plans:", matchedPlan);
    console.log("Current History:", currentPlan);

    if (!matchedPlan) {
      console.warn("No matched plan found.");
      setShowConsent(false); // reset just in case
      return;
    }

    let consentNeeded = false;

    for (const key of keys) {
      const value = matchedPlan[key];

      if (value === undefined || value === null) continue;

      console.log(`${key}:`, value);

      // --- 1️⃣ strictly higher than current brokerage %
      if (value > currentPlan.bperc) {
        console.log(`${key} is greater than bperc → show consent`);
        consentNeeded = true;
        // setShowConsent(true);
        break;
      }
      // --- 2️⃣ strictly lower → skip
      if (value < currentPlan.bperc) {
        console.log(`${key} is smaller than bperc → no consent`);
        continue;
      }
      // --- 3️⃣ equal → need further checks
      const isIntradayOrDelivery =
        key === "EquityIntradayPer" || key === "EquityDeliveryPer";

      if (isIntradayOrDelivery) {
        // For Intraday/Delivery: compare matching Min vs current min
        const minKey =
          key === "EquityIntradayPer"
            ? "EquityIntradayMin"
            : "EquityDeliveryMin";

        const newMin = matchedPlan[minKey];
        const currMin = currentPlan.bpmin;

        if (newMin !== undefined && currMin !== undefined && newMin > currMin) {
          console.log(
            `${minKey} (${newMin}) > bpmin (${currMin}) → show consent`
          );
          consentNeeded = true;
          // setShowConsent(true);
          break;
        } else {
          console.log(`${minKey} is lesser or equal → no consent`);
        }
      } else {
        //  NEW CONDITION: other keys (not Intraday/Delivery)
        // If there is a segment-specific Min, compare it
        const minKey = key.replace("Per", "Min"); // e.g. EquityFuturesPer -> EquityFuturesMin
        const newMin = matchedPlan[minKey];
        const currMin = currentPlan.bpmin;

        if (
          newMin !== undefined &&
          currMin !== undefined &&
          newMin > currMin // strictly higher than current min
        ) {
          console.log(
            `${key} equals bperc, and ${minKey} (${newMin}) > bpmin (${currMin}) → show consent`
          );
          consentNeeded = true;
          break;
        } else {
          console.log(
            `${key} equals bperc, but no higher minimum → no consent`
          );
        }
      }
    }

    setShowConsent(consentNeeded);
  };

  // Format date to a more readable format
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr.replace(/-/g, " "));
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Handle proceeding with the selected plan
  const handleUpdateBrokeragePlan = () => {
    const latestHistory = history[0];

    const existingPlan = latestHistory?.seg?.toLowerCase().includes("option")
      ? `Rs ${latestHistory?.bperc} per lot`
      : `${latestHistory?.bperc}% of turnover`;

    const activeSince = latestHistory?.md_dt || "";

    const payload = {
      clientcode: BrokerageTitle?.cc || "",
      segment: BrokerageTitle?.typ || "",
      moduleNo: selectedPlan?.m_no || selectedPlan?.ModuleNo,
      existingPlan: `${existingPlan} ( ${activeSince} )`,
      proposedPlan: selectedValue,
      consentfileName: uploadedFileName,
    };

    console.log("Confirmed Brokerage Plan Payload:", payload);

    dispatch(showLoader("Updating plan..."));

    apiServices
      .UpdateClientBrokerageModification(payload)
      .then((response) => {
        if (response?.status === 200) {
          console.log(response?.data?.message);
          ShowToast("success", response?.data?.message);
        } else {
          console.warn("Failed to update brokerage plan", response);
        }
      })
      .catch((err) => {
        console.error("Update API error:", err);
      })
      .finally(() => {
        dispatch(hideLoader());
        onClose();
        setStep(1);
        setSelectedValue("");
      });
  };

  const handleDownload = async () => {
    const fileName = "Brokerage_consent_form";
    const fileType = ".pdf";

    const payload = {
      fileName: fileName,
      filePath: "D:\\FileUpload\\KYCDoc",
      fileType,
      contentType: "",
    };

    dispatch(showLoader("Downloading..."));

    try {
      const response = await apiServices.ComplianceDownload(payload);

      if (response?.status === 200 && response?.data) {
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        link.remove(); //  Clean up
        URL.revokeObjectURL(url); //  Revoke after use
      } else {
        console.error("Error during download", response);
        ShowToast("info", "Error downloading file");
      }
    } catch (error: any) {
      console.error("Download failed", error);
      ShowToast(
        "info",
        error?.message || "An error occurred while downloading"
      );
    } finally {
      dispatch(hideLoader());
    }
  };

  const handleProceedClick = () => {
    if (step === 1 && selectedValue !== "") {
      setStep(2);
    } else {
      // debugger;
      if (showConsent && selectedFile === null) {
        ShowToast("error", "Please Upload Proof");
        return;
      } else {
        handleUpdateBrokeragePlan();
        // alert("else ka else");
      }
    }
  };

  // Handle close action
  const handleCloseClick = () => {
    setStep(1);
    setSelectedValue("");
    onClose();
    setShowConsent(false);
  };

  // const handleFileUploadClick = () => {
  //   if (selectedFile && handleFileUpload) {
  //     // console.log("rowCheck-->", row);

  //     handleFileUpload(selectedFile);
  //     // handleFileUpload(row, selectedFile, formik.values.remark);
  //     setSelectedFile(null);
  //     // setmodal_center(false);
  //     // formik.setFieldValue("remark", "");
  //   } else {
  //     ShowToast("error", "Please select a file to upload.");
  //   }
  // };

  return (
    <Modal
      isOpen={isOpen}
      toggle={handleCloseClick}
      modalClassName="zoomIn"
      centered
      style={{
        maxWidth: "90%",
        width: isMobile ? "100%" : "50%",
        maxHeight: "100vh",
        height: "auto",
        overflowY: "auto",
      }}
    >
      <ModalHeader toggle={handleCloseClick} style={{ color: "#11395C" }}>
        {typ}
      </ModalHeader>

      <ModalBody>
        <Row>
          {step === 1 ? (
            <>
              {/* Top: Select Plan */}
              <Col
                xs={12}
                style={{
                  borderBottom: "2px solid grey",
                  marginBottom: "12px",
                  paddingBottom: "8px",
                }}
              >
                <p
                  className="text-center"
                  style={{
                    color: "#11395C",
                    fontSize: "18px",
                    fontFamily: "Poppins",
                    fontWeight: 600,
                    marginBottom: "12px",
                  }}
                >
                  Brokerage Plans
                </p>
                <Row>
                  <select
                    onChange={handleChange}
                    name="brokeragePlan"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      fontFamily: "Poppins",
                      borderRadius: "10px",
                      border: "1px solid #ccc",
                      fontSize: "14px",
                      backgroundColor: "#ffffff",
                      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                      marginBottom: "10px",
                    }}
                  >
                    <option value="">-- Select a Brokerage Plan --</option>
                    {choosePlans.map((planType, index) => (
                      <option value={planType} key={index}>
                        {planType}
                      </option>
                    ))}
                  </select>
                </Row>
                {showConsent && ( // Replace `true` with your consent condition (e.g., selectedPlan === "XYZ")
                  // shouldShowConsentForm()
                  <div style={{ marginBottom: "5px" }}>
                    <span
                      style={{
                        fontSize: "14px",
                        fontFamily: "Poppins",
                        marginRight: "10px",
                      }}
                    >
                      Consent Form:
                    </span>
                    <a
                      // href="/path/to/consent-form.pdf" // Replace with your actual file path
                      download
                      onClick={handleDownload}
                      style={{
                        color: "#007BFF",
                        textDecoration: "underline",
                        fontSize: "14px",
                        fontFamily: "Poppins",
                        cursor: "pointer",
                      }}
                    >
                      Click here to download
                    </a>
                  </div>
                )}
                {/* Placeholder for conditional rendering */}
              </Col>

              {/* Bottom: History */}
              <Col xs={12}>
                <p
                  className="text-center"
                  style={{
                    color: "#11395C",
                    fontSize: "18px",
                    fontFamily: "Poppins",
                    fontWeight: 600,
                    marginBottom: "12px",
                  }}
                >
                  Modification History
                </p>
                <Row className="justify-content-center">
                  {history.map((item, index) => (
                    <Col
                      xs={12}
                      md={6}
                      key={item.rnum}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        marginBottom: "10px",
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          maxWidth: "360px", // Fixes inconsistent width
                          // padding: "16px",
                          borderRadius: "12px",
                          border: "1px solid rgb(163, 163, 163)",
                          backgroundColor: "#F9FAFB",
                          textAlign: "center", // Center-aligns text
                          // minHeight: "120px", // Ensures even height if needed
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                        }}
                      >
                        <p
                          style={{
                            color: "#11395C",
                            fontSize: "14px",
                            fontFamily: "Poppins",
                            lineHeight: "1.6",
                            margin: 0,
                          }}
                        >
                          {index === 0 && (
                            <strong style={{ color: "#E15759" }}>
                              Current Plan
                            </strong>
                          )}
                          <br />
                          {item.md_dt}
                          <br />
                          {item.desc}
                          {/* 
            Keeping this logic commented intentionally as per your original code
            {item.segment.toLowerCase().includes("option")
              ? `₹ ${item.bperc} per lot`
              : `${item.bperc} % of turnover`} 
          */}
                        </p>
                      </div>
                    </Col>
                  ))}
                </Row>

                {/* Note */}
                <span
                  style={{
                    display: "inline-block",
                    border: "1px solid #EF5350",
                    backgroundColor: "#FFF0F0",
                    padding: "4px 9px",
                    borderRadius: "16px",
                    color: "#C62828",
                    fontSize: "12px",
                    fontFamily: "Poppins",
                    // marginTop: "16px",
                    fontWeight: 500,
                  }}
                >
                  Note: Brokerage Plan can be modified after 90 days
                </span>
              </Col>
            </>
          ) : (
            <>
              {/* Left: Existing Plan */}
              <Col
                xs={12}
                md={6}
                style={{ borderRight: "2px solid grey", marginBottom: "15px" }}
              >
                <p
                  className="text-center"
                  style={{
                    color: "#11395C",
                    fontSize: "17px",
                    fontFamily: "Poppins",
                  }}
                >
                  Existing Plan
                </p>
                <Row>
                  <Col>
                    {history.length > 0 && (
                      <p
                        style={{
                          color: "#11395C",
                          fontSize: "13px",
                          fontFamily: "Poppins",
                        }}
                      >
                        {/* {history[0].bperc} */}
                        {history[0].desc}
                        {/* {history[0].segment.toLowerCase().includes("option")
                          ? "per lot"
                          : "% of turnover"}{" "} */}
                        {/* Plan */}
                        <br />
                        Active since {formatDate(history[0].md_dt)}
                      </p>
                    )}
                  </Col>
                </Row>
              </Col>

              {/* Right: Selected Plan */}
              <Col xs={12} md={6} style={{ marginBottom: "15px" }}>
                <p
                  className="text-center"
                  style={{
                    color: "#11395C",
                    fontSize: "17px",
                    fontFamily: "Poppins",
                  }}
                >
                  Proposed Plan
                </p>
                <Row>
                  <Col xs={12} md={6}>
                    <p
                      style={{
                        color: "#11395C",
                        fontSize: "13px",
                        fontFamily: "Poppins",
                      }}
                    >
                      {selectedValue}
                    </p>
                  </Col>
                </Row>
              </Col>
              {showConsent && (
                <>
                  <div style={{ fontFamily: "Public Sans" }}>
                    <h6 style={{ margin: 0 }}>Upload Consent Form</h6>
                  </div>
                  <Col lg={12} style={{ paddingTop: "16px" }}>
                    <Input
                      name="uploadProof"
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      className="form-control mb-3"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          setSelectedFile(file);
                          handleFileUpload?.(file, typ);
                          // setSelectedFile(null);
                        }
                      }}
                      style={{ width: "100%", minHeight: "40px" }}
                    />
                  </Col>
                </>
              )}
            </>
          )}
        </Row>
        {/* {showConsent && <span>upload file here</span>} */}
      </ModalBody>
      <div className="modal-footer d-flex align-items-center justify-content-center">
        <Button
          color="secondary"
          style={{
            backgroundColor: "#EE4B2B",
            borderColor: "#EE4B2B",
            color: "#fff",
          }}
          onClick={handleCloseClick}
        >
          Cancel
        </Button>
        <Button
          onClick={handleProceedClick}
          disabled={!selectedValue}
          color="secondary"
          style={{
            backgroundColor: step === 1 ? "#01396B" : "#5CAE60",
            borderColor: step === 1 ? "#01396B" : "#5CAE60",
            color: "#fff",
            cursor: !selectedValue ? "not-allowed" : "pointer",
          }}
        >
          {step === 1 ? "Proceed" : "Confirm"}
        </Button>
      </div>
    </Modal>
  );
};

export default ModalComponent;
