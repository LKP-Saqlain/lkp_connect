import { Modal, ModalBody } from "reactstrap";
import Stage from "./Stage/Stage";
import FullInfo from "./FullInfo/index";

const PartnerModal = ({ isOpen, toggle, data, type }: any) => {
  if (!data) return null;
  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      centered
      className={type === "stage" ? "" : "modal-fullscreen"}
    >
      <ModalBody>
        {type === "stage" && <Stage toggle={toggle} />}
        {type === "appNo" && (
          <FullInfo data={data} toggle={toggle} type={type} />
        )}
      </ModalBody>
    </Modal>
  );
};

export default PartnerModal;
