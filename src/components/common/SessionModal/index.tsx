import React, { useState } from "react";
import { Modal, ModalBody } from "reactstrap";
import { Link } from "react-router-dom";

interface modal {
  show?: any;
  onClose?: () => void;
}
const ModalComponent = ({ show, onClose }: modal) => {
  const [modal_backdrop, setmodal_backdrop] = useState<boolean>(false);

  function tog_backdrop() {
    setmodal_backdrop(!modal_backdrop);
  }

  const handleModalClose = () => {
    onClose?.();
    setmodal_backdrop(false);
  };
  return (
    <>
      <Modal
        isOpen={show}
        toggle={() => {
          tog_backdrop();
        }}
        backdrop={"static"}
        id="staticBackdrop"
        centered
        style={{ fontFamily: "Public Sans, sans-serif" }}
      >
        <ModalBody className="text-center p-5">
          <i className="bx bx-party display-4 text-success"></i>

          <div className="mt-4">
            <h4
              className="mb-3"
              style={{ fontFamily: "Public Sans, sans-serif" }}
            >
              Session Expired!
            </h4>
            {/* <p className="text-muted mb-4">
              {" "}
              The transfer was not successfully received by us. the email of the
              recipient wasn't correct.
            </p> */}
            <div className="hstack gap-2 justify-content-center">
              <Link
                to="#"
                className="btn btn-primary"
                style={{ backgroundColor: "#11395C", borderColor: "#11395C" }}
                onClick={() => handleModalClose()}
              >
                Back to Login Page
              </Link>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default ModalComponent;
