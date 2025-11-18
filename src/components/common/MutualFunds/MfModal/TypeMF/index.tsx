import React, { useState, useEffect } from "react";
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

type MFType = "physical" | "demat" | "";

interface TypeMFModalProps {
  isOpen: boolean;
  toggle: () => void;
  selectedType: MFType;
  onTypeSelect: (type: "physical" | "demat") => void;
}

const TypeMFModal: React.FC<TypeMFModalProps> = ({
  isOpen,
  toggle,
  selectedType,
  onTypeSelect,
}) => {
  const [type, setType] = useState<MFType>("");

  // Sync the local state when modal opens or selectedType changes
  useEffect(() => {
    setType(selectedType);
  }, [selectedType, isOpen]);

  const confirmSelection = () => {
    if (type === "physical" || type === "demat") {
      onTypeSelect(type);
      toggle();
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size="sm">
      <ModalHeader toggle={toggle}>Select MF Type</ModalHeader>

      <ModalBody>
        <Label style={{ fontWeight: 600, marginBottom: "10px" }}>
          Choose Investment Type:
        </Label>

        {/* Physical */}
        <FormGroup check className="mb-2">
          <Input
            type="radio"
            name="mfType"
            value="physical"
            checked={type === "physical"}
            onChange={() => setType("physical")}
          />
          <Label check className="ms-2 fw-medium">
            Physical
          </Label>
        </FormGroup>

        {/* Demat */}
        <FormGroup check>
          <Input
            type="radio"
            name="mfType"
            value="demat"
            checked={type === "demat"}
            onChange={() => setType("demat")}
          />
          <Label check className="ms-2 fw-medium">
            Demat
          </Label>
        </FormGroup>
      </ModalBody>

      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
        <Button
          style={{ backgroundColor: "#1c517f" }}
          onClick={confirmSelection}
          disabled={!type}
        >
          Confirm
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default TypeMFModal;
