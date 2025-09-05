import { useEffect, useState } from "react";
import MutualFundTable from "../../../../components/common/MutualFunds/MfTable";
import BasicTabs from "../../../../components/common/MutualFunds/NavTabs";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../redux/store";
import { apiServices } from "../../../../services";
import { hideLoader, showLoader } from "../../../../redux/slices/loaderSlice";

interface MutualFundListProps {
  selectedMfType: string;
  onBack: () => void;
  onSelectFund: (schemeCode: string) => void;
}

const MutualFundList = ({
  selectedMfType,
  onBack,
  onSelectFund,
}: MutualFundListProps) => {
  const [data, setdata] = useState<any[]>([]);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchData = async () => {
      dispatch(showLoader("Please wait we are processing your request"));

      try {
        let response;
        let rawData: any[] = [];
        if (selectedMfType === "NFO") {
          response = await apiServices.MF_NFODetails();
          rawData = response?.data?.data ?? [];
        } else {
          // Mapping of mutual fund types to ProductId
          const productTypeMap: Record<string, number> = {
            "High Returns": 9,
            "Tax Savings": 20,
            "SIP with 100": 19,
            "SIP with 500": 17,
          };

          const productId = productTypeMap[selectedMfType];

          if (!productId) {
            dispatch(hideLoader());
            console.warn("Unsupported MF Type:", selectedMfType);
            return;
          }

          // Base payload reused for all MF_BasketDetialedList calls
          const payload = {
            ProductId: productId,
            BrokerID: 10001662,
            SortColumn: "",
            SortOrder: 1,
            RecordsPerPage: 50,
            PageNumber: 1,
          };

          response = await apiServices.MF_BasketDetialedList(payload);
          rawData = response?.data?.data?.returnsList ?? [];
        }

        dispatch(hideLoader());

        console.log(rawData, "Selected MF Type:", selectedMfType);

        const formattedData = rawData.map((item: any, index: number) => ({
          id: index + 1,
          ...item,
        }));

        setdata(formattedData);
      } catch (error) {
        dispatch(hideLoader());
        console.error("Error fetching data for", selectedMfType, error);
      }
    };

    fetchData();
  }, [selectedMfType, dispatch]);

  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        padding: "20px",
      }}
    >
      <BasicTabs
        heading="Our Recommendation"
        tabs={[]}
        value={0}
        onChange={() => {}}
      />
      {/* Header Row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 600 }}>
          {selectedMfType}
        </h2>
        <button
          onClick={onBack}
          style={{
            backgroundColor: "#11395C",
            color: "white",
            border: "none",
            borderRadius: "6px",
            padding: "6px 12px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          ← Back
        </button>
      </div>
      {/* Table */}
      <MutualFundTable
        rows={data}
        selectedLabel={selectedMfType}
        onSelectFund={onSelectFund}
      />
    </div>
  );
};

export default MutualFundList;
