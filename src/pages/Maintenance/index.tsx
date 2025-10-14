// import TestImg from "../../assets/images/sample.webp";
const Maintenance = () => {
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
        src={
          "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=1200&q=80"
        }
        alt="Maintenance"
        style={{ maxWidth: "500px" }}
      />
      <h1 style={{ fontSize: "2.5rem", marginBottom: "10px" }}>
        We’ll be back soon!
      </h1>
      <p style={{ fontSize: "1rem", maxWidth: "600px" }}>
        Our site is undergoing a brief maintenance to serve you better. <br />{" "}
        we truly appreciate your understanding and patience. <br />
        our site will be available again shortly🚀
      </p>
      <p style={{ marginTop: "10px", fontWeight: "bold" }}>— Team WebPortal</p>
    </div>
  );
};

export default Maintenance;
