import { useState } from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";

const Index = () => {
  const [isOpen, setIsOpen] = useState(true); // or false initially
  //   const [type, setType] = useState("Modal Title"); // adjust as needed

  const handleCloseClick = () => {
    setIsOpen(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={handleCloseClick}
      modalClassName="zoomIn"
      centered
      style={{
        maxHeight: "100vh",
        height: "auto",
        overflowY: "auto",
      }}
    >
      <ModalHeader toggle={handleCloseClick} style={{ color: "#11395C" }}>
        {/* {type} */}
        <p>This is the head of the modal.</p>
      </ModalHeader>
      <ModalBody>
        {/* Your content goes here */}
        <p>This is the body of the modal.</p>
      </ModalBody>
    </Modal>
  );
};

export default Index;
