import { useEffect } from "react";
import MutualFundTable from "../../../../components/common/MutualFunds/MfTable";
import { mutualFundRows } from "../../../../helper/commmon";
import BasicTabs from "../../../../components/common/MutualFunds/NavTabs";

interface MutualFundListProps {
  selectedMfType: string;
  onBack: () => void;
}

const MutualFundList = ({ selectedMfType, onBack }: MutualFundListProps) => {
  useEffect(() => {
    console.log("Selected MF Type:", selectedMfType);
  }, [selectedMfType]);

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
      <MutualFundTable rows={mutualFundRows} />
    </div>
  );
};

export default MutualFundList;
