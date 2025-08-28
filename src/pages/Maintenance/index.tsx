import TestImg from "../../assets/images/sample.webp";
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
      <img src={TestImg} alt="Maintenance" style={{ maxWidth: "280px" }} />
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
