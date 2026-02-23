import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { Button, Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import ModalComponent from "../../../components/common/masterModal";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { apiServices } from "../../../services";
import DataTable from "../../../components/common/UserInfoTable";
import ShowToast from "../../../utils/toastUtils";

interface ScripMaster {
  rid: number;
  isin: string;
  scpnm: string;
  isact: boolean;
}

const ScriptMaster = ({ activeSubItem }: any) => {
  const [modal_grid, setmodal_grid] = useState<boolean>(false);
  const [editUserCheck, setEditUserCheck] = useState(false);
  const [editData, setEditData] = useState<ScripMaster | null>(null);
  const [scripMasterRecords, setScripMasterRecords] = useState<any[]>([]);

  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (user_id) {
      fetchScripMasterRecords();
    }
  }, [user_id]);

  const fetchScripMasterRecords = async () => {
    try {
      dispatch(showLoader(""));

      const payload = { user_id };

      const response = await apiServices.ViewUnlistedScripMaster(payload);

      if (response?.status === 200) {
        const { data } = response?.data;
        setScripMasterRecords(data);
      }
    } catch (error) {
      console.log("Error", error);
    } finally {
      dispatch(hideLoader());
    }
  };

  function tog_grid() {
    setmodal_grid(!modal_grid);
    setEditUserCheck(false);
    setEditData(null);
  }

  const updateScripMasterFields = async (values: any) => {
    console.log("values11223", values, editData);

    const payload = {
      user_id: user_id,
      rowId: editData?.rid ?? null,
      isin: values?.isin,
      scripName: values?.scriptName,
      isActive: values?.isActive,
    };
    try {
      dispatch(showLoader(""));

      const response = await apiServices.UpdateUnlistedScripMaster(payload);

      if (response?.status === 200) {
        setmodal_grid(false);
        ShowToast("success", response?.data?.data?.msg);
        await fetchScripMasterRecords();
      }
    } catch (error) {
      console.log("Error", error);
    } finally {
      dispatch(hideLoader());
    }
  };

  const handleFormSubmit = async (values: any) => {
    const { scriptName, isin, isActive } = values;
    if (editData && Object.keys(editData).length > 0) {
      updateScripMasterFields(values);
      return;
    }
    const payload = {
      user_id,
      isin,
      scripName: scriptName,
      isActive,
    };

    try {
      dispatch(showLoader(""));

      const response = await apiServices.InsertUnlistedScripMaster(payload);

      if (response?.status === 200) {
        setmodal_grid(false);
        ShowToast("success", response?.data?.data?.msg);

        // Refresh grid data
        await fetchScripMasterRecords();
      }
    } catch (error) {
      console.log("Error", error);
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

  const getDeleteUserDetails = async (values: any) => {
    console.log("TestVaues", values);

    const payload = {
      user_id: user_id,
      rowId: values.rid,
    };

    try {
      dispatch(showLoader(""));

      const response = await apiServices.DeleteUnlistedScripMaster(payload);

      if (response?.status === 200) {
        setmodal_grid(false);
        ShowToast("success", response?.data?.data?.msg);
        await fetchScripMasterRecords();
      }
    } catch (error) {
      console.log("Error", error);
    } finally {
      dispatch(hideLoader());
    }
  };

  return (
    <>
      <div className="page-content page-view">
        <div className="container-fluid">
          <Row className="row-font">
            <Col lg={12}>
              <Box>
                <ModalComponent
                  modal_grid={modal_grid}
                  tog_grid={tog_grid}
                  editData={editData}
                  onSubmit={handleFormSubmit}
                  editUserCheck={editUserCheck}
                  isScriptMasterContent={true}
                  activeSubItem={activeSubItem}
                />
              </Box>
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
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {" "}
                    <h4 className="card-title mb-0">{activeSubItem}</h4>
                    <Button
                      type="submit"
                      variant="contained"
                      className="btn-font"
                      onClick={tog_grid}
                      style={{
                        backgroundColor: "#11395C",
                        height: "32px",
                        fontSize: "13px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textTransform: "none",
                        borderRadius: "6px",
                      }}
                    >
                      Add
                    </Button>
                  </div>
                </CardHeader>
                <CardBody>
                  <DataTable
                    activeSubItem={activeSubItem}
                    T6Data={scripMasterRecords}
                    // handleApproval={handleApproval}
                    handleEditClick={handleEditClick}
                    getUserDetails={getDeleteUserDetails}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default ScriptMaster;
