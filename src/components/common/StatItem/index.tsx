const StatItem = ({ label, value, dynamicColor }: any) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        margin: "10px 0",
        borderBottom: "1px solid #D9D9D9", // Grey underline
        padding: "8px",
      }}
    >
      <span
        style={{
          fontFamily: "Poppins",
          color: "grey",
          fontWeight: "500",
          fontSize: "12px",
          marginBottom: "5px",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "Poppins",
          color:
            dynamicColor === "negative"
              ? "red"
              : dynamicColor === "positive"
              ? "black"
              : dynamicColor === "neutral"
              ? "black"
              : "black",
          fontWeight: "500",
          fontSize: "12px",
          paddingBottom: "2px", // Space between the value and the underline
        }}
      >
        {dynamicColor === "negative" ? `-${value}` : `${value}`}
      </span>
    </div>
  );
};

export default StatItem;
