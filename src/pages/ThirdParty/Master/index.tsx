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
  ldc: string;
  cnm: string;
  em: string;
  em1?: string;
  em2?: string;
  sac: string;
  ste: string;
  gst: string;
  gsc: string;
  pan: string;
  ad1: string;
  ad2?: string;
  ad3?: string;
  mob: string;
  rid?: number;
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
        dispatch(hideLoader());

        if (response?.status === 200) {
          const rows = response?.data?.data || [];

          const formattedData = rows.map((item: any, index: any) => ({
            Id: index + 1,
            ...item,
          }));

          setdata(formattedData);

          console.log("Formatted Party Data:", formattedData);
        }
      })
      .catch((error) => {
        dispatch(hideLoader());
        console.error("Error", error);
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
      ledgerCode: data.ldc,
      companyName: data.cnm,
      emailId: data.em,
      emailId1: data.em1,
      emailId2: data.em2,
      sacNumber: data.sac,
      state: data.ste,
      gstNumber: data.gst,
      gstStateCode: data.gsc,
      pan: data.pan,
      address1: data.ad1,
      address2: data.ad2,
      address3: data.ad3,
      mobileNo: data.mob,
    };

    const payload = editUserCheck
      ? { ...commonPayload, rowId: editData?.rid }
      : commonPayload;
    debugger;
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
          ShowToast("success", response?.data?.msg || "Operation successful");
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
    console.log("Selected Third Party Row:", row);

    if (row.approvalStatus === "Approved") {
      ShowToast("error", "Approved entries cannot be deleted.");
      return;
    }

    try {
      dispatch(showLoader("Deleting..."));

      const payload = {
        Rowid: row?.rid,
        user_id: user_id,
      };

      const response = await apiServices.DeleteThirdPartyMasterRecord(payload);

      console.log("Delete Response →", response);

      if (response?.status === 200) {
        ShowToast("success", response.data?.msg || "Deleted successfully.");
        setFlag((prev) => !prev); // toggle for refresh
      } else {
        throw new Error(response?.data?.msg || "Deletion failed.");
      }
    } catch (error: any) {
      console.error("Delete Error:", error);
      ShowToast("error", error.message || "An unexpected error occurred.");
    } finally {
      dispatch(hideLoader());
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
