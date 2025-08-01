import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import ModalComponent from "../../../components/common/masterModal";
import { apiServices } from "../../../services";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import ShowToast from "../../../utils/toastUtils";

const VendorMaster = ({ activeSubItem }: any) => {
  const [modal_grid, setmodal_grid] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    console.log("Test", activeSubItem);
  }, []);

  function tog_grid() {
    setmodal_grid(!modal_grid);
    // setEditUserCheck(false);
    // setEditData(null);
  }

  const handleVerifyDetails = (accNo: string, ifscCode: string) => {
    console.log("BankValues", accNo, ifscCode);

    let payload = {
      bankAccNo: accNo,
      ifscCode: ifscCode,
    };
    dispatch(showLoader(""));
    apiServices
      .VerifyBankDetails(payload)
      .then((response) => {
        if (response?.status === 200) {
          console.log("VerifyBankResponse", response);
          let data = response?.data?.data;
          ShowToast("success", data?.message);
          dispatch(hideLoader());
        }
      })
      .catch((error) => {
        console.log("eRRROR", error);
        dispatch(hideLoader());
      });
  };

  return (
    <React.Fragment>
      <div className="page-content page-view">
        <div className="container-fluid">
          <Row className="row-font">
            <Col lg={12}>
              <Card
                style={{
                  minHeight: "80vh",
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
                  <h4 className="card-title mb-0">Vendor Entry Report</h4>
                </CardHeader>
                <CardBody>
                  <ModalComponent
                    modal_grid={modal_grid}
                    tog_grid={tog_grid}
                    // editData={editData}
                    // onSubmit={handleFormSubmit}
                    // editUserCheck={editUserCheck}
                    isVendorMasterContent={true}
                    handleVerifyDetails={handleVerifyDetails}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    className="btn-font"
                    onClick={tog_grid}
                    style={{
                      backgroundColor: "#11395C",
                      marginBottom: "1rem",
                    }}
                  >
                    Add
                  </Button>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  );
};

export default VendorMaster;
