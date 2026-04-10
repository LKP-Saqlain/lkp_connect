import { useEffect, useState } from "react";
import { Tabs, Tab } from "@mui/material";
import { partnerOnboardingTabs } from "../../../helper/commmon";
import { Card, CardBody, CardHeader, Container, Row } from "reactstrap";
import DataTable from "../../../components/common/UserInfoTable";
import PartnerModal from "../../../components/common/PartnerModal";
import { apiServices } from "../../../services";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { AppDispatch, RootState } from "../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
// import EsignTest from "../EsignTest";

const ApDetails = () => {
  const [tabValue, setTabValue] = useState<string>("Summary");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [modalType, setModalType] = useState<string>("");
  const [data, setData] = useState<any>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data,
  );

  const PartnerStatus = (row: any, type: string) => {
    setSelectedRow(row); //  store clicked row
    setIsModalOpen(true);
    setModalType(type);
    console.log("Status button clicked", row, type);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRow(null); // optional reset
  };

  useEffect(() => {
    const handleViewApprovalData = async () => {
      const payload = {
        user_id,
        optionType: "OpsApprove1View", // for Ops Level1=OpsApprove1View ,compliance=ComplView,Ops Level 2=OpsApprove2View,business=BusinessView,management=ManagementView,Head=HeadView
      };

      dispatch(showLoader("Fetching Details..."));

      try {
        const response = await apiServices.ViewAPDashBoard(payload);
        console.log("response ViewAPDashBoard", response?.data?.data?.data);
        const filteredData = (response?.data?.data?.data || []).map(
          (item: any, i: number) => ({ id: i + 1, ...item }),
        );
        console.log("response ViewAPDashBoard filteredData", filteredData);
        //  Save full response data
        setData(filteredData);
      } catch (error) {
        console.error("Error fetching details:", error);
      } finally {
        dispatch(hideLoader());
      }
    };

    handleViewApprovalData();
  }, []);

  return (
    <div className="page-content page-view">
      <Tabs
        value={tabValue}
        onChange={(_, value) => setTabValue(value)}
        TabIndicatorProps={{ style: { display: "none" } }}
        sx={{
          marginTop: "1rem",
          marginLeft: ".7rem",
          marginBottom: "8px",
          backgroundColor: "white",
          borderRadius: "11px",
          width: "fit-content",
          minHeight: 0,
        }}
      >
        {partnerOnboardingTabs.map((label: any) => (
          <Tab
            key={label}
            value={label}
            label={label}
            disableRipple
            sx={{
              textTransform: "none",
              fontWeight: 400,
              borderRadius: "10px",
              px: 3,
              minHeight: 10,
              backgroundColor: tabValue === label ? "#11395C" : "white",
              color: tabValue === label ? "white" : "#11395C",
              "&.Mui-selected": {
                color: "white !important",
              },
              "& .MuiTab-wrapper": {
                color: tabValue === label ? "white" : "#11395C",
              },
            }}
          />
        ))}
      </Tabs>

      {/* 🔹 Example conditional rendering */}
      <Container fluid>
        {/* <Row>{tabValue === "Summary" && <EsignTest />}</Row> */}
        <Row>{tabValue === "Summary" && <div>summary</div>}</Row>
        {tabValue === "Details" && (
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
              <h5 style={{ margin: 0, fontWeight: 500 }}>Details</h5>
            </CardHeader>
            <CardBody>
              <DataTable
                T6Data={data}
                activeSubItem={"Referal Entry Status"}
                onStatusClick={PartnerStatus}
              />
            </CardBody>
          </Card>
        )}
      </Container>
      <PartnerModal
        isOpen={isModalOpen}
        toggle={handleCloseModal}
        data={selectedRow}
        type={modalType}
      />
    </div>
  );
};

export default ApDetails;
