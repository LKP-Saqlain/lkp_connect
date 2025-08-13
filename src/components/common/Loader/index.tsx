import { Backdrop } from "@mui/material";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { simpleQuote } from "../../../helper/tableColumns";
import { CgSpinnerTwoAlt } from "react-icons/cg";

const Loader = () => {
  const loading = useSelector((state: any) => state.loader.loading);

  const [quote, setQuote] = useState<string>("Please wait...");

  useEffect(() => {
    if (loading) {
      const randomIndex = Math.floor(Math.random() * simpleQuote.length);
      setQuote(simpleQuote[randomIndex].text);

      const interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * simpleQuote.length);
        setQuote(simpleQuote[randomIndex].text);
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [loading]);

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
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <CgSpinnerTwoAlt
        style={{
          fontSize: 25,
          fontWeight: 400,
          color: "#fff",
          animation: "spin 1s linear infinite",
        }}
      />
      <div
        style={{
          marginTop: "10px",
          maxWidth: "550px",
          fontStyle: "italic",
          fontFamily: "Poppins",
          fontSize: "11px",
          fontWeight: 500,
          lineHeight: "1.5",
          color: "#f5f5f5",
        }}
      >
        {quote}
      </div>
    </Backdrop>
  );
};

export default Loader;
