import { Button, Modal as ReactstrapModal, ModalBody } from "reactstrap";
import { TextField } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";

interface CustomModalProps {
  tog_center: () => void;
  modal_center: boolean;
  setmodal_center: React.Dispatch<React.SetStateAction<boolean>>;
  getUserDetails?: (value: any) => void;
  row?: any;
  handleApproval?: (value: any, remark: string, entryFlag: string) => void;
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
  const formik = useFormik({
    initialValues: { remark: "" },
    validationSchema:
      activeSubItem === "Communication Retrival Checker"
        ? Yup.object({
            remark: Yup.string().trim().required("Remark is required"),
          })
        : Yup.object(),
    onSubmit: (values) => {
      if (getUserDetails && row) {
        getUserDetails(row);
      }
      setmodal_center(false);

      if (action && row) {
        const entryFlag = action === "approve" ? "A" : "R";
        handleApproval?.(row, values.remark, entryFlag);
        formik.resetForm();
      }
    },
  });

  const handleClose = () => {
    setmodal_center(false);
    formik.resetForm();
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
        </div>

        <form onSubmit={formik.handleSubmit}>
          {activeSubItem === "Communication Retrival Checker" && (
            <TextField
              label="Enter Remark *"
              variant="outlined"
              fullWidth
              size="small"
              value={formik.values.remark}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name="remark"
              error={formik.touched.remark && Boolean(formik.errors.remark)}
              helperText={formik.touched.remark && formik.errors.remark}
            />
          )}

          <div className="hstack gap-2 pt-2 justify-content-center">
            <Button
              className="btn"
              style={{ backgroundColor: "#EE4B2B", borderColor: "#EE4B2B" }}
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              className="btn"
              style={{ width: "80px", backgroundColor: "#11395C" }}
              type="submit"
            >
              Yes
            </Button>
          </div>
        </form>
      </ModalBody>
    </ReactstrapModal>
  );
};

export default CustomModal;
