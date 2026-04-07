const stages = [
  { label: "In Progress", date: "19-Mar-2026", active: true },
  { label: "Submitted – Under Review", date: "19-Mar-2026", active: true },
  { label: "Rejected", date: "20-Mar-2026", active: true },
  { label: "Under Review - Compliance", date: "22-Mar-2026", active: true },
  { label: "Commercial Approved", active: false },
  { label: "Payment Confirmed", active: false },
  { label: "Documents Submitted", active: false },
  { label: "Exchange Registration In Progress", active: false },
  { label: "Activated", active: false },
];

const Stage = ({ toggle }: { toggle: () => void }) => {
  return (
    <div style={{ width: "100%", maxWidth: 500, margin: "0 auto" }}>
      {/* Header */}
      <div
        style={{
          background: "#f5f6f8",
          borderRadius: "16px 16px 0 0",
          padding: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: "#11395C",
          fontWeight: 600,
          fontSize: 16,
          boxShadow: "0 2px 5px rgb(0 0 0 / 0.1)",
        }}
      >
        <div>Application Status</div>
        <button
          onClick={toggle}
          aria-label="Close"
          style={{
            background: "transparent",
            border: "none",
            color: "#11395C",
            fontWeight: 700,
            fontSize: 24,
            cursor: "pointer",
            lineHeight: 1,
            padding: 0,
            width: 32,
            height: 32,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "50%",
            transition: "background-color 0.2s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#e6f0fa")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          &times;
        </button>
      </div>

      {/* Stage List */}
      <div
        style={{
          background: "#f5f6f8",
          padding: 16,
          borderRadius: "0 0 16px 16px",
        }}
      >
        {stages.map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: item.active ? "#cfe0f1" : "#e6e6e6",
              padding: "12px 14px",
              borderRadius: "12px",
              marginBottom: 10,
              opacity: item.active ? 1 : 0.7,
            }}
          >
            {/* Left side */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: item.active ? "#00b386" : "#bdbdbd",
                }}
              />
              <span
                style={{
                  fontSize: 14,
                  color: "#11395C",
                  fontWeight: 500,
                }}
              >
                {item.label}
              </span>
            </div>

            {/* Date */}
            {item.date && (
              <span
                style={{
                  fontSize: 13,
                  color: "#11395C",
                  fontWeight: 500,
                }}
              >
                {item.date}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stage;
