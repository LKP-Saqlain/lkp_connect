import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

interface CkycModalProps {
  isOpen: boolean;
  toggle: () => void;
  onProceedCkyc: () => void;
  onProceedLkp: () => void;
}

const CkycModal = ({
  isOpen,
  toggle,
  onProceedCkyc,
  onProceedLkp,
}: CkycModalProps) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size="sm">
      <ModalHeader toggle={toggle}>CKYC Verification</ModalHeader>

      <ModalBody>
        <div
          style={{
            background: "#fff3cd",
            border: "1px solid #ffeeba",
            borderRadius: "8px",
            padding: "12px",
          }}
        >
          <p className="fw-bold text-dark mb-1">
            PAN does not exist with CKYC.
          </p>
          <p className="text-muted mb-0">
            Would you like to proceed with CKYC or continue with LKP?
          </p>
        </div>
      </ModalBody>

      <ModalFooter>
        <div className="container-fluid">
          <div className="row g-2">
            <div className="col-6">
              <Button
                color="primary"
                onClick={() => {
                  onProceedLkp();
                  toggle();
                }}
              >
                Proceed with LKP
              </Button>
            </div>

            <div className="col-6">
              <Button
                color="warning"
                onClick={() => {
                  onProceedCkyc();
                  toggle();
                }}
              >
                Proceed with CKYC
              </Button>
            </div>
          </div>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default CkycModal;
