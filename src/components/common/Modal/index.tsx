import { Modal, ModalBody } from "reactstrap";
import { Link } from "react-router-dom";

interface ModalComponentProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

const ModalComponent = ({ isOpen, onClose, message }: ModalComponentProps) => {
  return (
    <>
      <Modal isOpen={isOpen} toggle={onClose} backdrop={"static"} centered>
        <ModalBody className="text-center p-5">
          <i className="bx bx-party display-4 text-success"></i>

          <div className="mt-4">
            {/* <h4 className="mb-3">You've made it!</h4> */}
            <h4 className="mb-4">{message}</h4>
            <div className="hstack gap-2 justify-content-center">
              <Link to="#" className="btn btn-success" onClick={onClose}>
                Close
              </Link>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default ModalComponent;
