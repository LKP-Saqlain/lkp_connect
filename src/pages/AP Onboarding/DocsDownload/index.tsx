import { Card, CardBody, CardHeader } from "reactstrap";
import DataTable from "../../../components/common/UserInfoTable";
import { Container } from "reactstrap";
import PartnerModal from "../../../components/common/PartnerModal";
import { useState } from "react";

let data = [
  {
    id: 1,
    applNo: 1087,
    date: "27-Apr-26",
    aP_Name: "Platipus Perry",
    city: "York New",
    partnerType: null,
    referralName: "",
    applStatus: "Rejected",
  },
];
const DocsDownload = ({ activeSubItem }: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  //   const [modalType, setModalType] = useState<string>("DocsDownload");

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
