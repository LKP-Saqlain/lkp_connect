// import { Backdrop, CircularProgress } from "@mui/material";
import { Backdrop } from "@mui/material";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { quotes } from "../../../helper/tableColumns";
import { CgSpinnerTwoAlt } from "react-icons/cg";

const Loader = () => {
  const loading = useSelector((state: any) => state.loader.loading);
  // const message = useSelector((state: any) => state.loader.message);

  const [quote, setQuote] = useState<{ text: string; author: string } | null>(
    null
  );

  useEffect(() => {
    if (loading) {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      console.log("RandomIndex", randomIndex);
      setQuote(quotes[randomIndex]);

      // Optional: Rotate quotes every 5 seconds
      const interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        setQuote(quotes[randomIndex]);
      }, 4000);

      // Cleanup interval on unmount
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
        backgroundColor: "rgba(0, 0, 0, 0.8)", // darker backdrop
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
      {/* <CircularProgress color="inherit" size={35} /> */}

      {quote && (
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
          “{quote.text}”
          <div
            style={{
              marginTop: "2px",
              fontSize: "9px",
              fontStyle: "italic",
              fontWeight: 400,
              color: "#ccc",
            }}
          >
            — {quote.author}
          </div>
        </div>
      )}
    </Backdrop>
  );
};

export default Loader;
