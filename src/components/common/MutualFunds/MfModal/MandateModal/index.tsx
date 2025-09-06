import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Label,
  FormGroup,
  Input,
} from "reactstrap";
import BankCard from "../../../BankRadio";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../../redux/store";
import { apiServices } from "../../../../../services";
import {
  hideLoader,
  showLoader,
} from "../../../../../redux/slices/loaderSlice";
import ShowToast from "../../../../../utils/toastUtils";

const CreateMandateModal = ({
  isOpen,
  toggle,
  banks,
  selectedBank,
  onBankSelect,
  selectedPaymentType,
  clientNo,
  upiId,
  mandate,
}: any) => {
  const [amount, setAmount] = useState(0);
  const [newMandateId, setNewMandateId] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    setAmount(0);
  }, [toggle]);

  const createMandates = async () => {
    if (!selectedBank || !amount) return;

    const payload: any = {
      flag: selectedPaymentType === "upi" ? "19" : "06",
      clientCode: clientNo,
      amount: amount.toString(),
      mandateType: "N",
      accountNo: selectedBank.account,
      accountType: "SB",
      ifsccode: selectedBank.ifsc,
      micrcode: "",
      startdate: formatDate(tomorrow), // Start date is tomorrow
      enddate: "", // Empty or use formatDate(someDate) if needed
    };

    // Add UPI-specific fields if needed
    if (selectedPaymentType === "upi") {
      payload.registrationDate = formatDate(today); // Registration is today
      payload.vpaid = upiId;
    }

    dispatch(showLoader("Creating mandate..."));

    try {
      const response = await apiServices.BSEStar_MfMandateEntry(payload);
      const MandateNumber = response?.data?.data;
      setNewMandateId(MandateNumber);
      console.log(MandateNumber, newMandateId);

      ShowToast("info", response?.data?.message);

      if (mandate) {
        mandate(MandateNumber);
      }
      toggle();
    } catch (error) {
      console.error("Error creating mandate", error);

      ShowToast("error", "Failed to create mandate");
    } finally {
      dispatch(hideLoader());
    }
  };

  const formatDate = (date: Date): string => {
    const d = date.getDate().toString().padStart(2, "0");
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  };

  // Today's date and +1 day
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size="sm">
      <ModalHeader toggle={toggle}>Create New Mandate</ModalHeader>
      <ModalBody>
        <Label style={{ fontWeight: 600, marginBottom: "8px" }}>
          Select Bank account for payment
        </Label>

        {banks.map((bank: any) => (
          <BankCard
            key={bank.id}
            bank={bank}
            selected={selectedBank?.id === bank.id}
            onSelect={onBankSelect}
          />
        ))}

        <FormGroup>
          <Label for="amountInput" style={{ fontWeight: 600 }}>
            Enter Amount
          </Label>
          <Input
            type="number"
            id="amountInput"
            value={amount}
            onChange={(e) => {
              const val = Number(e.target.value);
              const maxLimit = selectedPaymentType === "UPI" ? 15000 : 100000;
              if (val <= maxLimit) {
                setAmount(val);
              } else {
                // optionally ignore or set to maxLimit
                setAmount(maxLimit);
              }
            }}
            placeholder="Enter amount"
            style={{ marginBottom: "12px", maxWidth: "200px" }}
            min={5000}
          />
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
        <Button
          color="primary"
          onClick={createMandates} // ✅ Call the function here
          disabled={!selectedBank || !amount}
        >
          Confirm & Create
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default CreateMandateModal;
