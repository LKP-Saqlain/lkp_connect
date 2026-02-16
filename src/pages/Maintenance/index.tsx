interface MaintenanceProps {
  isUpdate?: boolean;
  onRefresh?: () => void;
}

const Maintenance = ({ isUpdate = false, onRefresh }: MaintenanceProps) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#fff",
        textAlign: "center",
        padding: "50px",
        fontFamily: "Public Sans",
      }}
    >
      <img
        src="https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=1200&q=80"
        alt="Maintenance"
        style={{ maxWidth: "500px" }}
      />

      {isUpdate ? (
        <>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "10px" }}>
            A New Version Is Available
          </h1>
          <p style={{ fontSize: "1rem", maxWidth: "600px" }}>
            The application has been updated. Please refresh to continue using
            the latest version.
          </p>
          <button
            onClick={onRefresh}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              background: "#1976d2",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Refresh Application
          </button>
        </>
      ) : (
        <>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "10px" }}>
            We’ll be back soon!
          </h1>
          <p style={{ fontSize: "1rem", maxWidth: "600px" }}>
            Our site is undergoing maintenance. We appreciate your patience.
          </p>
        </>
      )}

      <p style={{ marginTop: "10px", fontWeight: "bold" }}>— Team WebPortal</p>
    </div>
  );
};

export default Maintenance;
