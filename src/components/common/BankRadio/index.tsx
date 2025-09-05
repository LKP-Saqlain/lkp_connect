// components/common/BankCard.tsx

interface BankCardProps {
  bank: any;
  selected: boolean;
  onSelect: (bankId: any) => void;
}

const BankCard = ({ bank, selected, onSelect }: BankCardProps) => {
  const handleClick = () => {
    onSelect(bank.id);
  };

  return (
    <div
      onClick={handleClick}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        border: selected ? "2px solid #004AAD" : "1px solid #ddd",
        borderRadius: "8px",
        padding: "6px 10px",
        cursor: "pointer",
        transition: "border 0.2s",
        marginBottom: "10px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {bank.logo ? (
          <img
            src={bank.logo}
            alt={bank.name}
            style={{ width: "40px", height: "40px", objectFit: "contain" }}
          />
        ) : (
          <div
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: "#eee",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "4px",
              fontSize: "12px",
              color: "#888",
            }}
          >
            {bank.code}
          </div>
        )}

        <div>
          <div style={{ fontWeight: 600, fontSize: "14px" }}>{bank.name}</div>
          <div style={{ fontSize: "12px", color: "#666" }}>
            xxxxxxxxxx{bank.account.slice(-4)}
          </div>
        </div>
      </div>

      <input
        type="radio"
        name="bank"
        value={bank.id}
        checked={selected}
        onChange={handleClick}
        onClick={(e) => e.stopPropagation()}
        style={{ accentColor: "#004AAD", width: "16px", height: "16px" }}
      />
    </div>
  );
};

export default BankCard;
