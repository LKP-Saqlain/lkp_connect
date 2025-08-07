import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import ModalComponent from "../../../components/common/masterModal";
import { apiServices } from "../../../services";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import ShowToast from "../../../utils/toastUtils";
import UserInfoTable from "../../../components/common/UserInfoTable";

const VendorMaster = ({ activeSubItem }: any) => {
  const [modal_grid, setmodal_grid] = useState<boolean>(false);
  const [editData, setEditData] = useState<[] | null>(null);
  const [disableFields, setDisableFields] = useState(false);
  const [printLocations, setPrintLocations] = useState([]);
  const [showBankUpload, setShowBankUpload] = useState(false);
  const [vendorData, setVendorData] = useState<any[]>([]);

  const dispatch = useDispatch<AppDispatch>();

  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );

  useEffect(() => {
    if (editData) {
      console.log("Length:", Object.keys(editData).length);
    } else {
      console.log("editData is null or undefined");
    }
  }, [editData]);

  useEffect(() => {
    dispatch(showLoader(""));
    const fetchCities = () => {
      apiServices
        .FetchPinLocation({})
        .then((response) => {
          if (response?.status === 200) {
            console.log("Response-->", response?.data?.data);
            const data = response?.data?.data || [];
            dispatch(hideLoader());
            setPrintLocations(data);
          }
        })
        .catch((error) => {
          console.log("ERROR", error);
        });
    };

    fetchCities();
  }, [dispatch]);

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
          dispatch(hideLoader());
          let data = response?.data;
          console.log("VerifyBankResponse", data);
          if (data?.statusCode === 400) {
            ShowToast("error", "Invalid Credentials!");
            setDisableFields(true);
            setShowBankUpload(false);
          } else {
            if (data?.isSuccess) {
              setShowBankUpload(true);
            }
            ShowToast("success", data?.message);
            setDisableFields(false);
          }
        }
      })
      .catch((error) => {
        console.log("eRRROR", error);
        dispatch(hideLoader());
      });
  };

  const handleFormSubmit = (
    values: any,
    tdsFileBase64: string | null,
    msmeFileBase64: string | null,
    bankFileBase64: string | null,
    tdsFileExtension: string | null,
    msmeFileExtension: string | null,
    bankFileExtension: string | null
  ) => {
    console.log(
      "handleFormSubmitValues",
      values,
      "Extensions",
      tdsFileExtension,
      msmeFileExtension,
      bankFileExtension,
      "TDSBase64",
      tdsFileBase64,
      "MSMEBase64",
      msmeFileBase64,
      "bankFileBase64",
      bankFileBase64
    );

    setmodal_grid(false);

    const {
      vendorName,
      address1,
      address2,
      address3,
      city,
      state,
      pinCode,
      telephoneNo,
      mobileNo,
      emailId,
      websiteName,
      panNo,
      bankName,
      bankAccountNo,
      ifscCode,
      chequePrintName,
      // chqPrintNameFlag,
      chqPrintLocation,
      faxNo,
      paymentBank,
      gstNo,
      tdsFlag,
      msmeFlag,
      msmeType,
      chqPrintLocationFlag,
    } = values;

    const payload = {
      // Vendor Info
      vendorName,
      address1,
      address2,
      address3,
      city,
      state,
      pincode: pinCode,
      teleNo: telephoneNo,
      mobileNo,
      emailID: emailId,
      websiteName,
      panNo,
      gstNo,

      // Bank Info
      bankName,
      bankActNo: bankAccountNo,
      ifscCode,
      paymentBank,
      bankDoc: bankFileBase64 || "",
      bankDocExtn: `.${bankFileExtension}`,

      // Cheque Print Info
      chqPrintName: chequePrintName,
      chqPrintNameFlag: chqPrintLocationFlag === "YES" ? "Y" : "N",
      // chqPrintNameFlag: chqPrintNameFlag,
      chqPrintLocCode: chqPrintLocation?.printLocCode || "",
      chqPrintLocFlag: chqPrintLocation?.printLocation !== "" ? "Y" : "N",

      // Other
      faxNo,
      createdBy: user_id,

      // TDS & MSME
      tdsFlag: tdsFlag === "Yes" ? true : false,
      tdsPath: tdsFileBase64 || "",
      tdsExtn: `.${tdsFileExtension}`,
      msmeFlag: msmeFlag === "Yes" ? true : false,
      msmePath: msmeFileBase64 || "",
      msmeType: msmeFlag === "Yes" ? msmeType : "",
      msmeExtn: `.${msmeFileExtension}`,
    };
    console.log("Final Payload", payload);
    dispatch(showLoader(""));
    apiServices
      .SaveVendorDetails(payload)
      .then((response) => {
        if (response?.status === 200) {
          dispatch(hideLoader());
          console.log("Resposssne-->", response?.data);
          ShowToast("success", response?.data?.data);
          fetchVendorMasterDetails("LKP Securities 22223232323");
        }
      })
      .catch((error) => {
        console.log("Errror", error);
        dispatch(hideLoader());
      });
  };

  const fetchVendorMasterDetails = (vendorName: string) => {
    const payload = { vendorName };
    dispatch(showLoader(""));
    apiServices
      .ViewVendorDetails(payload)
      .then((response) => {
        if (response?.status === 200) {
          const newVendor = response?.data?.data;

          dispatch(hideLoader());

          const formattedNewVendor = {
            id: vendorData.length + 1, // Assign next index as ID
            ...newVendor,
          };

          setVendorData((prevVendorData) => {
            // Check if this vendor already exists by vendorId
            const isAlreadyPresent = prevVendorData.some(
              (vendor) => vendor.vendorId === formattedNewVendor.vendorId
            );

            if (isAlreadyPresent) {
              return prevVendorData; // Avoid duplicates
            }

            return [...prevVendorData, formattedNewVendor];
          });

          console.log("MappedVendorData", formattedNewVendor);
        }
      })
      .catch((error) => {
        console.log("Errror", error);
        dispatch(hideLoader());
      });
  };

  const handleEditClick = (data: any, editCheck: boolean) => {
    // debugger;
    console.log("TestModalData", data, editCheck);
    // const formattedDate = data.DateOfCommunication
    //   ? dayjs(data.DateOfCommunication, "DD-MMM-YY").format("DD/MM/YYYY")
    //   : "";
    // const updatedData = { ...data, DateOfCommunication: formattedDate };

    setmodal_grid(true);
    setEditData(data);
    // setEditUserCheck(editCheck);
  };

  // useEffect(() => {
  //   fetchVendorMasterDetails("LKP Securities");
  // }, []);

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
                    editData={editData}
                    onSubmit={handleFormSubmit}
                    // editUserCheck={editUserCheck}
                    isVendorMasterContent={true}
                    handleVerifyDetails={handleVerifyDetails}
                    setDisableFields={setDisableFields}
                    disableFields={disableFields}
                    printLocations={printLocations}
                    showBankUpload={showBankUpload}
                    activeSubItem={activeSubItem}
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
                  {vendorData?.length > 0 && (
                    <UserInfoTable
                      activeSubItem={activeSubItem}
                      T6Data={vendorData}
                      handleEditClick={handleEditClick}
                    />
                  )}
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
