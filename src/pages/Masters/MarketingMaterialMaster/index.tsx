import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Button, Container } from "reactstrap";

import Box from "@mui/material/Box";
import UserInfoTable from "../../../components/common/UserInfoTable";

import ShowToast from "../../../utils/toastUtils"; // Assuming ShowToast is available
import { apiServices } from "../../../services";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import ModalComponent from "../../../components/common/masterModal";

const MasterMenuMarketing = ({ activeSubItem }: any) => {
  interface MarketingEditData {
    rid: number;
    UploadImages: string;
    Description: string;
    UploadDocuments: string;
  }
  const [userData, setUserData] = useState([]);
  const [modal_grid, setmodal_grid] = useState<boolean>(false);
  const [editUserCheck, setEditUserCheck] = useState(false);
  const [editData, setEditData] = useState<MarketingEditData | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchMaterials = async () => {
      dispatch(showLoader("Please wait..."));
      try {
        const response = await apiServices.ViewMarketingMaterials({});
        console.log("ViewMarketingMaterialsResponse", response?.data?.data);

        const data = response?.data?.data || [];
        const mappedRows = data.map((item: any, index: number) => ({
          // id: index + 1, // MUI DataGrid safe
          Id: index + 1,
          ...item,
        }));
        console.log("aFTERmAPPED", mappedRows);

        setUserData(mappedRows);
        console.log("marketing data", data);
      } catch (error) {
        console.error("Error fetching marketing materials:", error);
      } finally {
        dispatch(hideLoader());
      }
    };

    fetchMaterials();
  }, [dispatch, refreshTrigger]);

  // Initialize state with proper typing
  // const [editData, setEditData] = useState<MarketingEditData | null>(null);

  const handleMarketingFormSubmit = async (formData: any) => {
    console.log("Received from modal:", formData, editData);
    const getFileName = (filePath: string): string => {
      return filePath.split("\\").pop() || filePath;
    };

    try {
      const payload = {
        options: editData && editData.rid > 0 ? "UPDATE" : "INSERT",
        rowId: editData && editData.rid > 0 ? editData.rid : 0,

        uploadDocumentsBase64: formData.documentBase64,
        documentFileName: getFileName(formData.fileUpload),
        uploadImagesBase64: formData.imageBase64,
        imageFileName: getFileName(formData.image),
        description: formData.description,
      };
      console.log("Payload to API:", payload);

      const response = await apiServices.getInUpMarketMaterial(payload);
      if (response?.status === 200) {
        ShowToast("success", response.data.message);
        setRefreshTrigger((prev) => prev + 1); // Trigger refresh
        setmodal_grid(false); // Close modal if needed
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("API error:", error);
      ShowToast("error", "There was an error submitting the materials.");
    }
  };

  const handleDeleteClick = async (row: any) => {
    console.log("handleDeleteClick confirmation", row.rid);

    const payload = {
      RowId: row.rid, // Ensure the correct casing matches API expectations
    };

    try {
      const response = await apiServices.DeleteMarketingMaterials(payload);

      if (response?.status === 200) {
        ShowToast("success", "Marketing material deleted successfully!");
        setRefreshTrigger((prev) => prev + 1); // Trigger refresh
      } else {
        throw new Error("Delete failed");
      }
    } catch (error) {
      console.error("Delete API error:", error);
      ShowToast("error", "There was an error deleting the material.");
    }
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
            minHeight: "30vh",
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
            <h4 className="card-title mb-0"> Marketing Materials</h4>
          </CardHeader>
          <CardBody>
            <ModalComponent
              modal_grid={modal_grid}
              tog_grid={tog_grid}
              editData={editData}
              onSubmit={handleMarketingFormSubmit}
              editUserCheck={editUserCheck}
              isMarketingMaterial={true}
            />

            <Box>
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
            </Box>
            <UserInfoTable
              activeSubItem={activeSubItem}
              T6Data={userData}
              getUserDetails={handleDeleteClick}
              handleEditClick={handleEditClick}
            />
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default MasterMenuMarketing;
