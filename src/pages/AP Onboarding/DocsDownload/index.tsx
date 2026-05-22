import { Card, CardBody, CardHeader } from "reactstrap";
import DataTable from "../../../components/common/UserInfoTable";
import { Container } from "reactstrap";
import PartnerModal from "../../../components/common/PartnerModal";
import { useEffect, useState } from "react";
import { apiServices } from "../../../services";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";

const DocsDownload = ({ activeSubItem }: any) => {
  const [data, setData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data,
  );

  useEffect(() => {
    handleComplianceAlertMail();
  }, []);

  const handleComplianceAlertMail = async () => {
    const payload = {
      user_id,
      optionType: "ComplianceEsignView",
    };
    dispatch(showLoader("Fetching Details..."));
    console.log("payload for mail", payload);

    try {
      const response = await apiServices.ViewAPDashBoard(payload);
      const filteredData = (response?.data?.data?.data || []).map(
        (item: any, i: number) => ({ id: i + 1, ...item }),
      );
      console.log("response GetDetailsByAppl filteredData", filteredData);
      //  Save full response data
      setData(filteredData);
    } catch (error) {
      console.error("Error fetching details:", error);
    } finally {
      dispatch(hideLoader());
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRow(null); // optional reset
  };
  const PartnerStatus = (row: any, type: string) => {
    setSelectedRow(row); //  store clicked row
    setIsModalOpen(true);

    console.log("Status button clicked", row, type);
  };
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
            <h5 style={{ margin: 0, fontWeight: 500 }}>
              {activeSubItem} Details
            </h5>
          </CardHeader>
          <CardBody>
            <DataTable
              T6Data={data}
              activeSubItem={activeSubItem}
              onStatusClick={PartnerStatus}
            />
          </CardBody>
        </Card>{" "}
      </Container>
      <PartnerModal
        isOpen={isModalOpen}
        toggle={handleCloseModal}
        data={selectedRow}
        type={"DocsDownload"}
        activeSubItem={activeSubItem}
      />
    </div>
  );
};

export default DocsDownload;
