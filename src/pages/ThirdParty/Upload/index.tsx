import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Input,
  Row,
} from "reactstrap";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import DataTable from "../../../components/common/UserInfoTable";
import { useRef, useState } from "react";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import ShowToast from "../../../utils/toastUtils";
import { apiServices } from "../../../services";

const InvoiceUpload = ({ activeSubItem }: any) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [data, setdata] = useState<any[]>([]);
  const [duplicationState, setDuplicationState] = useState<boolean | null>(
    null
  );
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );
  const dispatch = useDispatch<AppDispatch>();

  const handleUpload = async () => {
    if (!selectedFile) return;
    await apiServices.UnstageTPInvoice({ user_id });
    const formData = new FormData();
    formData.append("user_id", user_id);
    formData.append("InvoiceFile", selectedFile);

    dispatch(showLoader(""));
    apiServices
      .TPInvoiceStaging(formData)
      .then((response) => {
        console.log("TPInvoiceStagingResssponse", response?.data);

        if (response?.data?.statusCode === 200) {
          const rawData = response?.data?.data || [];
          const dataWithIds = rawData.map((item: any, index: number) => ({
            ...item,
            id: `tp_${Date.now()}_${index}`,
          }));
          setdata(dataWithIds);
          console.log("dataTPpload", dataWithIds);
        } else {
          ShowToast("error", response?.data?.message);
        }
      })
      .catch((error) => {
        console.log("Error", error);
        ShowToast("error", "File upload failed.");
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  const unStaging = () => {
    const payload = { user_id };

    dispatch(showLoader(""));

    apiServices
      .UnstageTPInvoice(payload)
      .then((response) => {
        if (
          response?.data?.statusCode === 200 &&
          response?.data?.data?.status
        ) {
          setdata([]); // Clear local data since it's removed from DB
        } else {
        }
      })
      .catch((error) => {
        console.error("Unstaging error:", error);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };
  const handleFinalUpload = () => {
    if (duplicationState === null) return;

    const payload = {
      user_id,
      withDuplicate: duplicationState,
    };

    apiServices
      .TPInvoiceUpload(payload)
      .then((response) => {
        if (response?.data?.statusCode === 200) {
          ShowToast("success", response?.data?.msg);
        } else {
          ShowToast("error", response?.data?.msg || "Upload failed");
        }
      })
      .catch((err) => {
        console.error("Final upload error:", err);
        ShowToast("error", "Something went wrong during final upload.");
      })
      .finally(() => {
        dispatch(hideLoader());
        setShowConfirmModal(false);
        unStaging();
        handleFileDelete();
      });
  };

  const handleDuplicationClick = (isDuplicate: boolean) => {
    setDuplicationState(isDuplicate);
    setShowConfirmModal(true);
  };

  const handleFileDelete = () => {
    dispatch(showLoader(""));
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      unStaging();
      dispatch(hideLoader());
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith(".xlsx")) {
      setSelectedFile(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } else {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      ShowToast("error", "Please upload a valid Excel file (.xlsx)");
    }
  };
  return (
    <div className="page-content page-view">
      <Container fluid>
        <Card
          style={{
            borderRadius: "15px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          }}
        >
          <CardHeader
            style={{
              borderRadius: "15px 15px 0 0",
              boxShadow: "0 -4px 8px rgba(0, 0, 0, 0.15)",
              backgroundColor: "#fff",
              padding: "0.2rem 0.8rem",
            }}
          >
            <h4 className="card-title mb-0">Third Party Invoice Upload </h4>
          </CardHeader>
          <CardBody>
            <Row>
              <Col lg={12} className="mb-3">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    width: "100%",
                    maxWidth: "100%", // use full width
                    flexWrap: "wrap", // allows wrapping if screen gets small
                  }}
                >
                  <Input
                    type="file"
                    innerRef={fileInputRef}
                    accept=".xlsx"
                    className="form-control"
                    onChange={handleFileChange}
                    style={{ width: "250px", minHeight: "40px" }}
                  />

                  <Button
                    style={{
                      backgroundColor: "#11395C",
                      color: "#fff",
                      whiteSpace: "nowrap",
                    }}
                    onClick={handleUpload}
                    disabled={!selectedFile}
                  >
                    Upload
                  </Button>

                  {selectedFile && (
                    <>
                      <span style={{ fontSize: "14px", whiteSpace: "nowrap" }}>
                        Uploaded File: {selectedFile.name}
                      </span>
                      <Button
                        style={{
                          backgroundColor: "#11395C",
                          color: "#fff",
                          padding: "4px 10px",
                          fontSize: "12px",
                          borderRadius: "20px",
                          lineHeight: "1",
                        }}
                        onClick={handleFileDelete}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </Col>
            </Row>
            {data.length > 0 && (
              <>
                <DataTable
                  activeSubItem={activeSubItem}
                  T6Data={data}
                  customCss={true}
                  customHide={true}
                />
                <div style={{ marginTop: "1rem" }}>
                  <Button
                    onClick={() => handleDuplicationClick(true)}
                    style={{
                      backgroundColor: "#db393e",
                      color: "#fff",
                      padding: "4px 10px",
                      borderColor: "#f94a4a",
                    }}
                  >
                    With Duplicate
                  </Button>

                  <Button
                    onClick={() => handleDuplicationClick(false)}
                    style={{
                      backgroundColor: "#11395C",
                      color: "#fff",
                      padding: "4px 10px",
                      marginLeft: "1rem",
                    }}
                  >
                    Without Duplicate
                  </Button>
                  <p>
                    <strong>NOTE:</strong> Rows in red mean they are duplicates.
                  </p>

                  <Modal
                    isOpen={showConfirmModal}
                    toggle={() => setShowConfirmModal(false)}
                    centered
                  >
                    <ModalHeader toggle={() => setShowConfirmModal(false)}>
                      Confirm Upload
                    </ModalHeader>
                    <ModalBody>
                      Are you sure you want to proceed
                      <b> {duplicationState ? "with" : "without"} duplicate </b>
                      records?
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        variant="contained"
                        style={{
                          backgroundColor: "#EE4B2B",
                          borderColor: "#EE4B2B",
                        }}
                        onClick={handleFinalUpload}
                      >
                        Yes, Proceed
                      </Button>
                      <Button
                        variant="contained"
                        style={{
                          backgroundColor: "#11395C",
                          borderColor: "#11395C",
                        }}
                        onClick={() => setShowConfirmModal(false)}
                      >
                        Cancel
                      </Button>
                    </ModalFooter>
                  </Modal>
                </div>
              </>
            )}
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default InvoiceUpload;
