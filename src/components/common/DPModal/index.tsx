import { Button, Modal as ReactstrapModal, ModalBody } from "reactstrap";
import { TextField } from "@mui/material";
import { useState } from "react";

interface CustomModalProps {
  tog_center: () => void;
  modal_center: boolean;
  setmodal_center: React.Dispatch<React.SetStateAction<boolean>>;
  getUserDetails?: (value: any) => void;
  row?: any; 
  handleApproval?: (value: any,remark:string,flag:string) => void;
  Msg?: string;
  activeSubItem?: any;
  action: "approve" | "reject"; 
}

const CustomModal = ({
  tog_center,
  modal_center,
  setmodal_center,
  getUserDetails,
  row,
  Msg,
  action,
  handleApproval,
  activeSubItem,
}: CustomModalProps) => {
 
  const [remark, setRemark] = useState("");

  
  const handleText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRemark(e.target.value);
    console.log(remark); 
  };

 
  const handleConfirm = () => {
    
    if (getUserDetails && row) {
      getUserDetails(row); 
    }
    setmodal_center(false); 

    if (action&&row) {
      const entryFlag = action === "approve" ? "A" : "R";
      handleApproval?.(row.id, remark, entryFlag); 
    }
    setRemark(""); 
  };

 
  const handleClose = () => {
    setmodal_center(false); 
    setRemark(""); 
  };

  return (
    <ReactstrapModal isOpen={modal_center} toggle={tog_center} centered>
      <ModalBody className="text-center p-3">
        {activeSubItem !== "Communication Retrival Checker" && (
          <i className="ri-alert-line display-5 text-warning"></i>
        )}

        <div className="mt-4" style={{ fontFamily: "Public Sans" }}>
          {activeSubItem !== "Communication Retrival Entry" &&
            activeSubItem !== "Communication Retrival Checker" && (
              <h6 className="mb-4">
                An email will be sent informing the client about his DP Debit
                dues along with a link for payment.
              </h6>
            )}
          <h6 className="mb-3">{Msg}</h6>
          {activeSubItem === "Communication Retrival Checker" && (
            <TextField
              label="Enter Remark *"
              variant="outlined"
              fullWidth
              size="small"
              value={remark} 
              onChange={handleText} 
            />
          )}
          <div className="hstack gap-2 pt-2 justify-content-center">
            <Button
              className="btn"
              style={{ backgroundColor: "#EE4B2B", borderColor: "#EE4B2B" }}
              onClick={handleClose} 
            >
              Cancel
            </Button>{" "}
            <Button
              className="btn"
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
