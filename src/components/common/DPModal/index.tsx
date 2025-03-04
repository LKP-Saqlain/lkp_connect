import { Button, Modal as ReactstrapModal, ModalBody } from "reactstrap";
import { TextField } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

interface CustomModalProps {
  tog_center: () => void;
  modal_center: boolean;
  setmodal_center: React.Dispatch<React.SetStateAction<boolean>>;
  getUserDetails?: (value: any) => void;
  row?: any;
  handleApproval?: (value: any, remark: string, entryFlag: string) => void;
  Msg?: string;
  activeSubItem?: any;
  action?: "approve" | "reject";
  expiredtime?: boolean;
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
  expiredtime,
}: CustomModalProps) => {
  const navigate = useNavigate();

  const handleSessionClear = () => {
    localStorage.clear();
    sessionStorage.clear();
    setmodal_center(false);
    navigate("/");
  };

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

  // const handleSessionClear = () => {
  //   setmodal_center(false);
  //   localStorage.removeItem("tkn");
  //   localStorage.removeItem("Id");
  //   localStorage.removeItem("uIdType");
  //   localStorage.removeItem("userName");
  //   localStorage.removeItem("activeMenu");
  //   localStorage.removeItem("activeSubItem");
  //   navigate("/");
  // };

  return (
    <ReactstrapModal
      isOpen={modal_center}
      toggle={tog_center}
      centered
      backdrop={expiredtime ? "static" : undefined} // Disable clicking outside for expired token modal
      keyboard={expiredtime ? false : undefined}
    >
      <ModalBody className="text-center p-3">
        {activeSubItem !== "Communication Retrival Checker" &&
          activeSubItem !== "UCCCode MATCH" && (
            <i className="ri-alert-line display-5 text-warning"></i>
          )}

        <div className="mt-4" style={{ fontFamily: "Public Sans" }}>
          {activeSubItem === "DP Debit Recovery" ? (
            <>
              <h6 className="mb-4">
                An email will be sent informing the client about his DP Debit
                dues along with a link for payment.
              </h6>
              <h6 className="mb-3">{Msg}</h6>
            </>
          ) : (
            <h6 className="mb-3">{Msg}</h6>
          )}
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
            {expiredtime || activeSubItem === "UCCCode MATCH" ? (
              <Button
                className="btn"
                style={{
                  width: "80px",
                  backgroundColor: "#11395C",
                  borderColor: "#11395C",
                }}
                onClick={
                  expiredtime
                    ? handleSessionClear
                    : () => console.log("clicked Regulator Announcements")
                }
              >
                OK
              </Button>
            ) : (
              <>
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
              </>
            )}
          </div>
        </form>
      </ModalBody>
    </ReactstrapModal>
  );
};

export default CustomModal;
