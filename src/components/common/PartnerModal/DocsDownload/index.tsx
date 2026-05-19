const index = ({ toggle, activeSubItem }: any) => {
  return (
    <div>
      {" "}
      <button
        onClick={toggle}
        style={{
          padding: "6px 16px",
          background: "transparent",
          border: "1px solid #11395C",
          borderRadius: "12px",
          color: "#11395C",
          fontWeight: 600,
          cursor: "pointer",
          marginLeft: "auto",
          minWidth: "120px",
        }}
      >
        Back
      </button>
      <br />
      {activeSubItem}
    </div>
  );
};

export default index;
