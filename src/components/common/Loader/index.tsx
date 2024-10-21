import React from "react";
import { Backdrop, CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";

const Loader = () => {
  const loading = useSelector((state: any) => state.loader.loading);
  const message = useSelector((state: any) => state.loader.message);

  return (
    <Backdrop
      open={loading}
      style={{
        zIndex: 1300,
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress color="inherit" />
      {message && (
        <div style={{ marginTop: "16px", fontFamily: "Public Sans" }}>
          {message}
        </div>
      )}{" "}
      {/* Add margin for spacing */}
    </Backdrop>
  );
};

export default Loader;
