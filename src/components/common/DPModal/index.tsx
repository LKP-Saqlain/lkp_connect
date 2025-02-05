import { Button, Modal as ReactstrapModal, ModalBody } from "reactstrap";
// import { Link } from "react-router-dom";

interface CustomModalProps {
  tog_center: () => void;
  modal_center: boolean;
  setmodal_center: React.Dispatch<React.SetStateAction<boolean>>;
  getUserDetails?: (value: any) => void;
  row?: any; // The selected row data
}

const CustomModal = ({
  tog_center,
  modal_center,
  setmodal_center,
  getUserDetails,
  row,
}: CustomModalProps) => {
  const handleConfirm = () => {
    // debugger;
    if (getUserDetails && row) {
      getUserDetails(row); // Call the function with the row data
    }
    setmodal_center(false); // Close the modal
  };

  return (
    <ReactstrapModal isOpen={modal_center} toggle={tog_center} centered>
      <ModalBody className="text-center p-5">
        <i className="ri-alert-line display-5 text-warning"></i>

        <div className="mt-4" style={{ fontFamily: "Public Sans" }}>
          <h6 className="mb-4">
            An email will be sent informing the client about his DP Debit dues
            along with link for payment.
          </h6>
          <h6 className="mb-3">Are you sure you want to send the email?</h6>
          <div className="hstack gap-2 justify-content-center">
            <Button
              className="btn"
              style={{ backgroundColor: "#EE4B2B", borderColor: "#EE4B2B" }}
              onClick={() => setmodal_center(false)}
            >
              Cancel
            </Button>{" "}
            <Button
              className="btn p-6"
              style={{ width: "80px", backgroundColor: "#11395C" }}
              onClick={handleConfirm}
            >
              Yes
            </Button>
          </div>
        </div>
      </ModalBody>
    </ReactstrapModal>
  );
};

export default CustomModal;
