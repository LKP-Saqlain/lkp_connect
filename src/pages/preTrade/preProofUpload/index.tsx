import { useEffect } from "react";
import { Card, CardBody, CardHeader, Container } from "reactstrap";
import UserInfoTable from "../../../components/common/UserInfoTable";
import ShowToast from "../../../utils/toastUtils";

interface preProofUpload {
  activeSubItem: string;
}

const ProofUpload = ({ activeSubItem }: preProofUpload) => {
  useEffect(() => {
    console.log("activeItemCheck->", activeSubItem);
  }, [activeSubItem]);

  const handleFileUpload = (clientCode: any, file: File, remark: string) => {
    console.log("Uploading file for", clientCode, file, remark);

    const allowedExtensions = ["jpg", "jpeg", "png", "pdf"];
    const fileExt = file.name.split(".").pop()?.toLowerCase() || "";

    if (!allowedExtensions.includes(fileExt)) {
      ShowToast(
        "error",
        "Please upload a file in JPG, JPEG, PNG, or PDF format."
      );
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const base64WithPrefix = reader.result as string;
      const base64Data = base64WithPrefix.split(",")[1];

      if (!base64Data) {
        ShowToast("error", "Failed to process the file.");
        return;
      }

      const payload = {
        clientCode,
        fileExtension: `.${fileExt}`,
        base64Data,
      };

      console.log("Payload to send:", payload);
    };

    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      ShowToast("error", "Error reading the file.");
    };

    reader.readAsDataURL(file);
  };

  const preProofUploadDummyData = [
    {
      id: 1,
      ClientCode: "CL001",
      tradeDate: "2025-05-01",
      expiryDate: "2025-06-01",
      symbol: "NIFTY",
      series: "EQ",
      instrumentType: "FUTSTK",
      strikePrice: "N/A",
      qty: 150,
      buySell: "Buy",
      tradeOrderNumber: "ORD123456",
    },
    {
      id: 2,
      ClientCode: "CL002",
      tradeDate: "2025-05-02",
      expiryDate: "2025-06-01",
      symbol: "BANKNIFTY",
      series: "EQ",
      instrumentType: "OPTSTK",
      strikePrice: "36000",
      qty: 75,
      buySell: "Sell",
      tradeOrderNumber: "ORD123457",
    },
    {
      id: 3,
      ClientCode: "CL003",
      tradeDate: "2025-05-03",
      expiryDate: "2025-06-01",
      symbol: "RELIANCE",
      series: "EQ",
      instrumentType: "FUTSTK",
      strikePrice: "N/A",
      qty: 50,
      buySell: "Buy",
      tradeOrderNumber: "ORD123458",
    },
    {
      id: 4,
      ClientCode: "CL004",
      tradeDate: "2025-05-04",
      expiryDate: "2025-06-01",
      symbol: "INFY",
      series: "EQ",
      instrumentType: "OPTSTK",
      strikePrice: "1450",
      qty: 100,
      buySell: "Sell",
      tradeOrderNumber: "ORD123459",
    },
    {
      id: 5,
      ClientCode: "CL005",
      tradeDate: "2025-05-05",
      expiryDate: "2025-06-01",
      symbol: "TCS",
      series: "EQ",
      instrumentType: "FUTSTK",
      strikePrice: "N/A",
      qty: 200,
      buySell: "Buy",
      tradeOrderNumber: "ORD123460",
    },
  ];

  return (
    <div className="page-content">
      <Container fluid>
        <Card
          style={{
            borderRadius: "15px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          }}
        >
          <CardHeader
            style={{
              borderRadius: "15px 15px 0 0",
              boxShadow: "0 -4px 8px rgba(0, 0, 0, 0.15)",
              backgroundColor: "#fff", // optional for contrast
            }}
          >
            <h4 className="card-title mb-0">
              PreTrade Confirmation Proof Upload
            </h4>
          </CardHeader>
          <CardBody>
            <UserInfoTable
              activeSubItem={activeSubItem}
              T6Data={preProofUploadDummyData}
              onFileUpload={handleFileUpload}
            />
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default ProofUpload;
