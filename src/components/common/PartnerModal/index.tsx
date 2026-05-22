import { Modal, ModalBody } from "reactstrap";
import Stage from "./Stage/Stage";
import FullInfo from "./FullInfo/index";
import PaymentEdit from "./PaymentEdit";
import DocsDownload from "./DocsDownload";

const PartnerModal = ({
  isOpen,
  toggle,
  data,
  type,
  activeSubItem,
  onSave,
}: any) => {
  if (!data) return null;

  const fullScreenTypes = ["applNo", "DocsDownload"];

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      centered
      className={fullScreenTypes.includes(type) ? "modal-fullscreen" : ""}
    >
      <ModalBody>
        {type === "stage" && <Stage toggle={toggle} data={data} />}
        {type === "applNo" && (
          <FullInfo
            data={data}
            toggle={toggle}
            type={type}
            activeSubItem={activeSubItem}
          />
        )}
        {type === "EditPartnerPayment" && (
          <PaymentEdit toggle={toggle} data={data} onSave={onSave} />
        )}
        {type === "DocsDownload" && (
          <DocsDownload
            toggle={toggle}
            data={data}
            activeSubItem={activeSubItem}
          />
        )}
      </ModalBody>
    </Modal>
  );
};

export default PartnerModal;
