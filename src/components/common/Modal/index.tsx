import { Modal, ModalBody, Button, ModalHeader, Col, Row } from "reactstrap";
import RadioInput from "../RadioInput";
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
  modificationDate: string;
  brokeragePerc: number;
  rowNum: number;
  clientcode: string;
  segment: string;
}

interface ModalComponentProps {
  isOpen: boolean;
  onClose: () => void;
  BrokerageTitle?: any;
}

const ModalComponent = ({
  isOpen,
  onClose,
  BrokerageTitle,
}: ModalComponentProps) => {
  const [selectedValue, setSelectedValue] = useState("");
  const [step, setStep] = useState(1); // Step 1 = Select Plan, Step 2 = Confirm Plan
  const [choosePlans, setChoosePlans] = useState<string[]>([]);
  const [history, setHistory] = useState<BrokerageHistoryItem[]>([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch<AppDispatch>();

  // Destructure BrokerageTitle early to avoid repeated optional chaining
  const { type, clientcode } = BrokerageTitle || {};

  // Fetch brokerage plans
  useEffect(() => {
    if (!type) return; // Exit early — don't call the API yet

    const payload = { segment: type };
    console.log("Fetching plans for segment", type);

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
          }
        }
      })
      .catch((err) => console.log("Error", err))
      .finally(() => dispatch(hideLoader()));
  }, [type]);

  // Fetch brokerage modification history
  useEffect(() => {
    if (!clientcode || !type) return; // Exit early if required fields are missing

    const payload = { clientcode, segment: type };
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
          }
        }
      })
      .catch((err) => console.error("API error:", err))
      .finally(() => dispatch(hideLoader()));
  }, [clientcode, type]);

  // Handle change in plan selection
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
    console.log("Selected value:", event.target.value);
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

    const existingPlan = latestHistory?.segment
      ?.toLowerCase()
      .includes("option")
      ? `Rs ${latestHistory?.brokeragePerc} per lot`
      : `${latestHistory?.brokeragePerc}% of turnover`;

    const activeSince = latestHistory?.modificationDate || "";

    const payload = {
      clientcode: BrokerageTitle?.clientcode || "",
      segment: BrokerageTitle?.type || "",
      moduleNo: latestHistory?.moduleNo || "",
      existingPlan: `${existingPlan} (Active since ${activeSince})`,
      proposedPlan: selectedValue,
    };

    console.log("Confirmed Brokerage Plan Payload:", payload);

    dispatch(showLoader("Updating plan..."));

    apiServices
      .UpdateClientBrokerageModification(payload)
      .then((response) => {
        if (response?.status === 200) {
          console.log(response?.data?.data);
          ShowToast("success", response?.data?.data);
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
  const handleProceedClick = () => {
    if (step === 1 && selectedValue !== "") {
      setStep(2);
    } else {
      handleUpdateBrokeragePlan();
    }
  };

  // Handle close action
  const handleCloseClick = () => {
    setStep(1);
    setSelectedValue("");
    onClose();
  };

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
        {type}
      </ModalHeader>

      <ModalBody>
        <Row>
          {step === 1 ? (
            <>
              {/* Left: Select Plan */}
              <Col
                xs={12}
                md={6}
                style={{ borderRight: "2px solid grey", marginBottom: "15px" }}
              >
                <p
                  className="text-center"
                  style={{
                    color: "#11395C",
                    fontSize: "16px",
                    fontFamily: "Poppins",
                  }}
                >
                  Brokerage Plans
                </p>
                <Row>
                  {choosePlans.map((planType, index) => (
                    <Col xs={12} md={6} key={planType}>
                      <p
                        style={{
                          color: "#11395C",
                          fontFamily: "Poppins",
                          padding: "5px 0 10px",
                        }}
                      >
                        <RadioInput
                          onChange={handleChange}
                          value={planType}
                          id={`plan${index}`}
                          name="brokeragePlan"
                          label={planType}
                        />
                      </p>
                    </Col>
                  ))}
                </Row>
                <span
                  style={{
                    border: "1px solid #FE4747",
                    padding: "6px",
                    borderRadius: "16px",
                    color: "#FE4747",
                    fontSize: "9px",
                    fontFamily: "Poppins",
                  }}
                >
                  Note : Brokerage Plan can be modified after 90 days
                </span>
              </Col>

              {/* Right: History */}
              <Col xs={12} md={6}>
                <p
                  className="text-center"
                  style={{
                    color: "#11395C",
                    fontSize: "16px",
                    fontFamily: "Poppins",
                  }}
                >
                  Modification History
                </p>
                <Row>
                  {history.map((item) => (
                    <Col
                      xs={12}
                      md={6}
                      key={item.modificationDate + item.moduleNo}
                    >
                      <p
                        style={{
                          color: "#11395C",
                          fontSize: "12px",
                          fontFamily: "Poppins",
                          padding: "5px 0 10px",
                        }}
                      >
                        {item.modificationDate} <br />
                        {item.segment.toLowerCase().includes("option")
                          ? `₹ ${item.brokeragePerc} per lot`
                          : `${item.brokeragePerc} % of turnover`}
                      </p>
                    </Col>
                  ))}
                </Row>
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
                    fontSize: "16px",
                    fontFamily: "Poppins",
                  }}
                >
                  Existent Plans
                </p>
                <Row>
                  <Col>
                    {history.length > 0 && (
                      <p
                        style={{
                          color: "#11395C",
                          fontSize: "12px",
                          fontFamily: "Poppins",
                        }}
                      >
                        {history[0].brokeragePerc}{" "}
                        {history[0].segment.toLowerCase().includes("option")
                          ? "per lot"
                          : "% of turnover"}{" "}
                        Plan <br />
                        Active since {formatDate(history[0].modificationDate)}
                      </p>
                    )}
                  </Col>
                </Row>
              </Col>

              {/* Right: Selected Plan */}
              <Col xs={12} md={6}>
                <p
                  className="text-center"
                  style={{
                    color: "#11395C",
                    fontSize: "16px",
                    fontFamily: "Poppins",
                  }}
                >
                  Proposed Plans
                </p>
                <Row>
                  <Col xs={12} md={6}>
                    <p
                      style={{
                        color: "#11395C",
                        fontSize: "12px",
                        fontFamily: "Poppins",
                      }}
                    >
                      {selectedValue}
                    </p>
                  </Col>
                </Row>
              </Col>
            </>
          )}
        </Row>
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
          }}
        >
          {step === 1 ? "Proceed" : "Confirm"}
        </Button>
      </div>
    </Modal>
  );
};

export default ModalComponent;
