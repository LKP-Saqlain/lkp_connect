import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import ModalComponent from "../../../components/common/masterModal";
import { apiServices } from "../../../services";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import ShowToast from "../../../utils/toastUtils";
import UserInfoTable from "../../../components/common/UserInfoTable";

export interface VendorData {
  vid: number;
  vendorName: string;
  address1: string;
  address2: string;
  address3: string;
  city: string;
  state: string;
  pincode: string;
  mobileNo: string;
  teleNo: string;
  emailID: string;
  websiteName: string;
  panNo: string;
  bankName: string;
  bankActNo: string;
  ifscCode: string;
  bdoc: string;
  chqPrintNameFlag: string;
  chqPrintLocCode: string;
  chqPrintLocFlag: string;
  createdBy: string;
  chqPrintName: string;
  createdDate: string; // if you want actual Date type, use Date instead
  faxNo: string;
  paymentBank: string;
  gstNo: string;
  tdsFlag: boolean;
  tdsPath: string;
  msmeFlag: boolean;
  msmeType: string;
  msmp: string;
  bdx: string; //bankDoc extension flag
  tdsExtn: string;
  msmx: string; // spelling matches your provided data
  id: number;
}

const VendorMaster = ({ activeSubItem }: any) => {
  const [modal_grid, setmodal_grid] = useState<boolean>(false);
  const [editData, setEditData] = useState<VendorData | null>(null);
  const [vendorData, setVendorData] = useState<any[]>([]);
  const [editUserCheck, setEditUserCheck] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );

  useEffect(() => {
    fetchVendorMasterDetails();
  }, []);

  useEffect(() => {
    if (editData) {
      console.log("Length:", Object.keys(editData).length);
    } else {
      console.log("editData is null or undefined");
    }
  }, [editData]);

  // useEffect(() => {
  //   dispatch(showLoader(""));
  //   const fetchCities = () => {
  //     apiServices
  //       .FetchPinLocation({})
  //       .then((response) => {
  //         if (response?.status === 200) {
  //           console.log("Response-->", response?.data?.data);
  //           // const data = response?.data?.data || [];
  //           dispatch(hideLoader());
  //         }
  //       })
  //       .catch((error) => {
  //         console.log("ERROR", error);
  //       });
  //   };

  //   fetchCities();
  // }, [dispatch]);

  function tog_grid() {
    setmodal_grid(!modal_grid);
    setEditUserCheck(false);
    setEditData(null);
  }

  const handleFormSubmit = (
    values: any,
    panFileBase64: string | null,
    msmeFileBase64: string | null,
    bankFileBase64: string | null,
    panFileExtension: string | null,
    msmeFileExtension: string | null,
    bankFileExtension: string | null
    // isEditVendorContent?: any
  ) => {
    console.log(
      "handleFormSubmitValues",
      values,
      "panFileBase64-->",
      panFileBase64,
      "panFileExtension-->",
      panFileExtension,
      "bankfileExtension",
      bankFileExtension
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
      panDoc,
      // bankName,
      bankAccountNo,
      ifscCode,
      chequePrintName,
      // chqPrintNameFlag,
      chqPrintLocation,
      faxNo,
      paymentBank,
      gstNo,
      // tdsFlag,
      msmeFlag,
      msmeType,
      chqPrintLocationFlag,
    } = values;

    if (editUserCheck) {
      console.log("EditedData on Submit", editData);

      let payload = {
        vendorName: vendorName,
        address1: address1,
        address2: address2,
        address3: address3,
        city: city,
        state: state,
        pincode: pinCode,
        teleNo: telephoneNo,
        mobileNo: mobileNo,
        emailID: emailId,
        websiteName: websiteName,
        panNo: panNo,
        panDoc,
        bankName: chequePrintName ? chequePrintName : "",
        bankActNo: bankAccountNo,
        ifscCode: ifscCode,
        bankDoc: bankFileBase64 ? bankFileBase64 : editData?.bdoc,
        chqPrintNameFlag: chqPrintLocationFlag === "YES" ? "Y" : "N",
        chqPrintLocCode: chqPrintLocation?.printLocCode || "",
        chqPrintLocFlag: chqPrintLocation?.printLocation !== "" ? "Y" : "N",
        createdBy: user_id,
        chqPrintName: chequePrintName,
        faxNo: faxNo,
        paymentBank: paymentBank ? paymentBank : "",
        // utilityFlag: "string",
        gstNo: gstNo,
        // tdsFlag: tdsFlag === "Yes" ? true : false,
        // tdsPath: tdsFileBase64 ? tdsFileBase64 : editData?.tdsPath,
        msmeFlag: msmeFlag === "Yes" ? true : false,
        msmePath: msmeFileBase64 ? msmeFileBase64 : editData?.msmp,
        msmeType: msmeFlag === "Yes" ? msmeType : "",
        bankDocExtn: bankFileExtension ? bankFileExtension : editData?.bdx,
        // tdsExtn: tdsFileExtension ? tdsFileExtension : editData?.tdsExtn,
        msmeExtn: msmeFileExtension ? msmeFileExtension : editData?.msmx,
        vendorID: editData?.vid,
      };
      console.log("EditPayload-->", payload);
      dispatch(showLoader(""));
      apiServices
        .UpdateVendorDetails(payload)
        .then((response) => {
          if (response?.status === 200) {
            console.log("updateVendorDetailsResponse", response);
            dispatch(hideLoader());
            // fetchVendorMasterDetails();
          }
        })
        .catch((error) => {
          console.log("errrrror", error);
          dispatch(hideLoader());
        });
      setEditUserCheck(false);
      // fetchVendorMasterDetails();
      // return;
    }

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
      panDoc,
      gstNo,

      // Bank Info
      bankName: chequePrintName ? chequePrintName : "",
      bankActNo: bankAccountNo,
      ifscCode,
      paymentBank: paymentBank ? paymentBank : "",
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
          console.log(
            "Resposssne-->",
            response?.data,
            response?.data?.statusCode
          );
          ShowToast("success", response?.data?.data);
          // if (response?.data?.statusCode === 500) {
          //   ShowToast("error", response?.data?.message);
          // }
          fetchVendorMasterDetails();
        }
      })
      .catch((error) => {
        console.log("Errror", error);
        dispatch(hideLoader());
      });
  };

  const fetchVendorMasterDetails = () => {
    const payload = { vendorName: "ALL", User_id: user_id };
    dispatch(showLoader(""));

    apiServices
      .ViewVendorDetails(payload)
      .then((response) => {
        if (response?.status === 200) {
          const newVendors = response?.data?.data || [];

          const formattedVendors = newVendors.map(
            (vendor: any, index: number) => ({
              ...vendor,
              Id: index + 1,
            })
          );

          setVendorData(formattedVendors);
          dispatch(hideLoader());

          console.log("Mapped Vendor Data:", formattedVendors);
        }
      })
      .catch((error) => {
        console.error("Error fetching vendor details:", error);
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
    setEditUserCheck(editCheck);
  };

  const getUserDetails = async (row: any) => {
    console.log("ValueComm", typeof row);
    // handleEmailSend(value?.BOID);
    console.log("Delete Data", row);
    // setDeletedRow(row);

    let payload = {
      vendorID: row?.vid,
    };
    apiServices
      .DeleteVendorDetails(payload)
      .then((response) => {
        if (response?.status === 200) {
          console.log("Response", response);
          fetchVendorMasterDetails();
        }
      })
      .catch((error) => {
        console.log("ERROR", error);
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
                    editData={editData}
                    onSubmit={handleFormSubmit}
                    editUserCheck={editUserCheck}
                    isVendorMasterContent={true}
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
                      getUserDetails={getUserDetails}
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
