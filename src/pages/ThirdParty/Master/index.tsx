import { Button, Card, CardBody, CardHeader, Container, Row } from "reactstrap";
import ModalComponent from "../../../components/common/masterModal";
import { Box } from "@mui/material";
import DataTable from "../../../components/common/UserInfoTable";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { apiServices } from "../../../services";
import ShowToast from "../../../utils/toastUtils";

interface ThirdPartyEditData {
  ledgerCode: string;
  companyName: string;
  emailId: string;
  emailId1?: string;
  emailId2?: string;
  sacNumber: string;
  state: string;
  gstNumber: string;
  gstStateCode: string;
  pan: string;
  address1: string;
  address2?: string;
  address3?: string;
  mobileNo: string;
  rowId?: number;
}

const ThirdPartyMaster = ({ activeSubItem }: any) => {
  const [modal_grid, setmodal_grid] = useState<boolean>(false);
  const [flag, setFlag] = useState<boolean>(false);
  const [data, setdata] = useState<any[]>([]);
  const [editUserCheck, setEditUserCheck] = useState(false);
  const [editData, setEditData] = useState<ThirdPartyEditData | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );

  useEffect(() => {
    const payload = { user_id };
    dispatch(showLoader(""));
    apiServices
      .ViewThirdPartyMaster(payload)
      .then((response) => {
        if (response?.status === 200) {
          console.log("Response-->", response);
          dispatch(hideLoader());
          setdata(response?.data?.data || []);
          console.log(data, "party");
        }
      })
      .catch((error) => {
        console.log("Error", error);
      });
  }, [dispatch, flag]);

  const handleFormSubmit = async (data: any) => {
    console.log(
      editData,
      "Received form data in parent: from master ThirdpartyM",
      data
    );

    const commonPayload = {
      user_id: user_id,
      ledgerCode: data.ledgerCode,
      companyName: data.companyName,
      emailId: data.emailId,
      emailId1: data.emailId1,
      emailId2: data.emailId2,
      sacNumber: data.sacNumber,
      state: data.state,
      gstNumber: data.gstNumber,
      gstStateCode: data.gstStateCode,
      pan: data.pan,
      address1: data.address1,
      address2: data.address2,
      address3: data.address3,
      mobileNo: data.mobileNo,
    };

    const payload = editUserCheck
      ? { ...commonPayload, rowId: editData?.rowId }
      : commonPayload;

    dispatch(showLoader(""));
    console.log(payload, "thirdpartM payload");

    const apiCall = editUserCheck
      ? apiServices.UpdateThirdPartyMasterRecord(payload)
      : apiServices.InsertThirdPartyMasterRecord(payload);

    apiCall
      .then((response) => {
        if (response?.status === 200) {
          dispatch(hideLoader());
          setdata(response?.data?.data || []);
          ShowToast(
            "success",
            response?.data?.message || "Operation successful"
          );
          setFlag(!flag);
          setmodal_grid(false);
        }
      })
      .catch((error) => {
        dispatch(hideLoader());
        console.log("Error", error);
        ShowToast("error", "Something went wrong");
      });
  };

  const getDeleteUserDetails = async (row: any) => {
    console.log("selectethirdRowwww", row);
    dispatch(showLoader(""));
    let payload = {
      Rowid: row?.rowId,
      user_id: user_id,
    };

    const response = await apiServices.DeleteThirdPartyMasterRecord(payload);
    console.log("ResPonseee-->", response);

    if (response?.status === 200) {
      dispatch(hideLoader());
      ShowToast("success", response.data?.message);
      setFlag(!flag);
    } else {
      throw new Error("Deletion failed.");
    }
  };
  const handleEditClick = (data: any, editCheck: boolean) => {
    console.log("TestModalData", data, editCheck);

    setmodal_grid(true);
    setEditData(data);
    setEditUserCheck(editCheck);
  };
  function tog_grid() {
    setmodal_grid(!modal_grid);
    setEditUserCheck(false);
    setEditData(null);
  }
  return (
    <div className="page-content page-view">
      <Container fluid>
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
            <h4 className="card-title mb-0">Third Party Vendor Master</h4>
          </CardHeader>
          <CardBody>
            <form
            //  onSubmit={formik.handleSubmit}
            >
              <Row>
                <ModalComponent
                  modal_grid={modal_grid}
                  tog_grid={tog_grid}
                  editData={editData}
                  onSubmit={handleFormSubmit}
                  editUserCheck={editUserCheck}
                  isThirdPartyMaster={true}
                />
              </Row>
            </form>
            <CardBody>
              <Box>
                <Button
                  // type="submit"
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
              </Box>
              <DataTable
                activeSubItem={activeSubItem}
                T6Data={data}
                handleEditClick={handleEditClick}
                getUserDetails={getDeleteUserDetails}
              />
            </CardBody>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default ThirdPartyMaster;
