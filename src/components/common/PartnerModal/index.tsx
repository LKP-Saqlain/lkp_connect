import { Modal, ModalBody } from "reactstrap";
import Stage from "./Stage/Stage";
import FullInfo from "./FullInfo/index";
import PaymentEdit from "./PaymentEdit";

const PartnerModal = ({ isOpen, toggle, data, type, activeSubItem }: any) => {
  if (!data) return null;
  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      centered
      className={type === "applNo" ? "modal-fullscreen" : ""}
    >
      <ModalBody>
        {type === "stage" && <Stage toggle={toggle} />}
        {type === "applNo" && (
          <FullInfo
            data={data}
            toggle={toggle}
            type={type}
            activeSubItem={activeSubItem}
          />
        )}
        {type === "EditPartnerPayment" && (
          <PaymentEdit toggle={toggle} data={data} />
        )}
      </ModalBody>
    </Modal>
  );
};

export default PartnerModal;
