import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import { AppDispatch, RootState } from "../../../../../redux/store";
import {
  hideLoader,
  showLoader,
} from "../../../../../redux/slices/loaderSlice";
import ShowToast from "../../../../../utils/toastUtils";
import { encryptAES } from "../../../../../utils/encryptDecrypt";
import { apiServices } from "../../../../../services";

type MFType = "physical" | "demat" | "";

interface Props {
  isOpen: boolean;
  toggle: () => void;
  selectedType: MFType;
  onTypeSelect: (type: "physical" | "demat") => void;
  ClientCode: string;
  onPhysicalOnboard: () => void;
  handleTradingOpen?: any;
}

const TypeMFModal: React.FC<Props> = ({
  isOpen,
  toggle,
  selectedType,
  onTypeSelect,
  onPhysicalOnboard,
  ClientCode,
  handleTradingOpen,
}) => {
  const [type, setType] = useState<MFType>("");
  const [physicalAllowed, setPhysicalAllowed] = useState<boolean | null>(null);
  const [elogOtp, setElogOtp] = useState<boolean | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );
  // Reset when modal opens + sync with selectedType from parent
  useEffect(() => {
    if (isOpen) {
      setType(selectedType || "");
      setPhysicalAllowed(null);
    }
  }, [isOpen, selectedType]);

  // API call – Only when user selects PHYSICAL
  const verifyPhysical = async () => {
    try {
      dispatch(showLoader("Verifying Client Code..."));

      const payload = {
        searchKey: ClientCode,
        loginId: user_id,
      };

      const response = await apiServices.GetClientsCodeAndName(payload);
      const data = response?.data;

      if (!data?.isSuccess || !data?.data?.length) {
        ShowToast("error", "Unable to verify client type");
        setPhysicalAllowed(false);
        return;
      }

      const { physicaldemat: clientType, elogstatus } = data.data[0];

      // CASE 1: PHYSICAL + ELOG → allowed
      if (clientType === "PHYSICAL" && elogstatus === "ELOG") {
        setPhysicalAllowed(true);
        return;
      }

      // CASE 2: PHYSICAL + NOELOG → trigger eLog OTP
      if (clientType === "PHYSICAL" && elogstatus === "NOELOG") {
        setPhysicalAllowed(false);
        setElogOtp(true);
        return;
      }

      // CASE 3: DEMAT (regardless of elogstatus) → NEVER allow Physical
      if (clientType === "DEMAT") {
        setPhysicalAllowed(false);
        return;
      }

      // Fallback safety
      setPhysicalAllowed(false);
    } catch (error) {
      console.error(error);
      setPhysicalAllowed(false);
    } finally {
      dispatch(hideLoader()); // always hide loader
    }
  };

  const eLogApi = (clientCode: any) => {
    dispatch(showLoader("Processing..."));

    let loopBackUrl = encryptAES(clientCode);
    loopBackUrl = encodeURIComponent(loopBackUrl);
    loopBackUrl = `${window.location.origin}/PhysicalStats/${loopBackUrl}`;
    apiServices
      .ElogForPhysical({
        clientCode,
        loopBackUrl,
      })
      // })
      .then((elogResponse: any) => {
        console.log("ElogForPhysical Response:", elogResponse);
        if (
          elogResponse?.data?.message === "ELOG Link Generated Successfully"
        ) {
          const url = elogResponse?.data?.data;
          window.open(url, "_blank", "noopener,noreferrer");
          console.log("before close", onPhysicalOnboard);
          // window.close();
          // window.history.back();
          console.log("after close");
        } else {
          ShowToast("error", elogResponse?.data?.message);
        }
      })
      .catch((error: any) => {
        console.error("FinalApiCalls Error:", error);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  const handleTypeChange = (value: MFType) => {
    setType(value);
    if (value === "physical") verifyPhysical();
  };

  const confirmSelection = () => {
    if (type === "physical" && !physicalAllowed) return;
    onTypeSelect(type as "physical" | "demat");
    toggle();
  };

  const isConfirmDisabled =
    type === "" || (type === "physical" && physicalAllowed === false);

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size="sm">
      <ModalHeader toggle={toggle}>Select MF Type</ModalHeader>

      <ModalBody>
        <Label className="fw-bold mb-3">Choose Investment Type:</Label>

        <FormGroup check className="mb-2">
          <Input
            type="radio"
            name="mfType"
            value="physical"
            checked={type === "physical"}
            onChange={() => handleTypeChange("physical")}
          />
          <Label check className="ms-2 fw-medium">
            Physical
          </Label>
        </FormGroup>

        <FormGroup check>
          <Input
            type="radio"
            name="mfType"
            value="demat"
            checked={type === "demat"}
            onChange={() => handleTypeChange("demat")}
          />
          <Label check className="ms-2 fw-medium">
            Demat
          </Label>
        </FormGroup>

        {/* ---- NOT ELIGIBLE UI ---- */}
        {type === "physical" && physicalAllowed === false && (
          <div
            style={{
              marginTop: "20px",
              padding: "12px",
              background: "#fff3cd",
              borderRadius: "8px",
              border: "1px solid #ffeeba",
            }}
          >
            <p className="text-dark fw-bold mb-1">
              Physical investment is not enabled for this client.
            </p>

            <p className="text-muted mb-2">
              You can continue with Demat or proceed with Physical onboarding.
            </p>

            <div className="d-flex gap-2">
              <Button
                color="primary"
                onClick={() => {
                  onTypeSelect("demat");
                  toggle();
                  // setPhysicalAllowed(false)
                }}
              >
                Continue with Demat
              </Button>

              <Button
                color="warning"
                onClick={() => {
                  if (elogOtp) {
                    eLogApi(ClientCode);
                  } else {
                    // onPhysicalOnboard();
                    handleTradingOpen("ClientOnboarding");
                  }
                  toggle();
                }}
              >
                Physical Onboarding
              </Button>
            </div>
          </div>
        )}
      </ModalBody>

      {/* Hide footer when PHYSICAL is not allowed */}
      {!(type === "physical" && physicalAllowed === false) && (
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
          <Button
            style={{ backgroundColor: "#1c517f" }}
            onClick={confirmSelection}
            disabled={isConfirmDisabled}
          >
            Confirm
          </Button>
        </ModalFooter>
      )}
    </Modal>
  );
};

export default TypeMFModal;
