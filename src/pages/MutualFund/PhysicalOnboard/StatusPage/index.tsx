import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf } from "react-icons/fa";
import { Card, CardHeader, Button } from "reactstrap";
import Logo from "../../../../assets/logo.png";
import { ELOG_STATUS_LIST } from "../../../../helper/commmon";
import { decryptAES, encryptAES } from "../../../../utils/encryptDecrypt";
import { hideLoader, showLoader } from "../../../../redux/slices/loaderSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../redux/store";
import { apiServices } from "../../../../services";

type Status = "SUCCESS" | "FAILURE" | "PENDING";

const StatusCard = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const dispatch = useDispatch<AppDispatch>();
  const [status, setStatus] = useState<Status | null>(null);
  const [elogCode, setElogCode] = useState<string | null>(null);
  const [clientCode, setClientCode] = useState<string | null>(null);

  const isMobile = window.innerWidth < 600;

  useEffect(() => {
    const pathParts = location.pathname.split("/");
    const encodedClient = pathParts[2];

    if (encodedClient) {
      try {
        const decryptedClient = decryptAES(decodeURIComponent(encodedClient));
        setClientCode(decryptedClient);
        console.log("ClientCode:", decryptedClient);
      } catch (err) {
        console.error("Error decoding/decrypting ClientCode:", err);
      }
    }

    const statusParam = query.get("STATUS") as Status | null;
    const code = query.get("elgstatus");

    if (statusParam) setStatus(statusParam);
    if (code) setElogCode(code);
  }, []);

  /** ICON */
  const renderIcon = () => {
    switch (status) {
      case "SUCCESS":
        return <FaCheckCircle size={60} color="#28a745" />;
      case "FAILURE":
        return <FaTimesCircle size={60} color="#d9534f" />;
      case "PENDING":
        return <FaHourglassHalf size={60} color="#f0ad4e" />;
      default:
        return null;
    }
  };

  /** TEXT */
  const renderText = () => {
    switch (status) {
      case "SUCCESS":
        return "Success";
      case "FAILURE":
        return "Failed";
      case "PENDING":
        return "Pending...";
      default:
        return "";
    }
  };

  /** BUTTON HANDLING BASED ON STATUS */
  const handleButtonClick = () => {
    if (status === "SUCCESS") {
      window.close();
    } else {
      console.log(clientCode, "to try again");
      eLogApi(clientCode);
    }
  };

  const eLogApi = (clientCode: any) => {
    dispatch(showLoader("Processing..."));

    let loopBackUrl = encryptAES(clientCode);
    loopBackUrl = encodeURIComponent(loopBackUrl);
    loopBackUrl = `${window.location.origin}/PhysicalStats/${loopBackUrl}`;
    apiServices
      .ElogForPhysical({
        clientCode,
        loopBackUrl,
      })
      // })
      .then((elogResponse: any) => {
        console.log("ElogForPhysical Response:", elogResponse);
        if (
          elogResponse?.data?.message === "ELOG Link Generated Successfully"
        ) {
          const url = elogResponse?.data?.data;
          window.open(url, "_blank", "noopener,noreferrer");
          console.log("before close");
          window.close();
          window.history.back();
          console.log("after close");
        }
      })
      .catch((error: any) => {
        console.error("FinalApiCalls Error:", error);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  const getElogMessage = (code: string | null) => {
    if (!code) return "";

    const obj = ELOG_STATUS_LIST.find((item) => item.code === code);
    return obj ? obj.message : "Unknown Elog Status";
  };

  return (
    <div
      className="page-content page-view"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f7fa",
        padding: isMobile ? "1rem" : "2rem",
      }}
    >
      <Card
        style={{
          width: isMobile ? "100%" : "90%",
          margin: "auto",
          borderRadius: "15px",
          boxShadow: "0px 6.16px 17.68px -0.88px #00000036",
          padding: isMobile ? "1rem" : "1.5rem",
          backgroundColor: "#fff",
        }}
      >
        {/* Header */}
        <CardHeader
          style={{
            backgroundColor: "#fff",
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: "center",
            justifyContent: "center",
            gap: isMobile ? "8px" : "12px",
            padding: "1rem",
            marginBottom: isMobile ? "1.5rem" : "2rem",
            textAlign: isMobile ? "center" : "left",
          }}
        >
          <img
            src={Logo}
            alt="LKP Logo"
            style={{
              height: isMobile ? "55px" : "70px",
              marginBottom: isMobile ? "0.5rem" : 0,
            }}
          />
          <h2
            style={{
              fontWeight: 700,
              color: "#1c3c6b",
              flex: 1,
              margin: 0,
              textAlign: "center",
              fontSize: isMobile ? "28px" : "34px",
              marginRight: isMobile ? "0" : "150px",
            }}
          >
            Physical Status
          </h2>
        </CardHeader>

        {/* STATUS BOX */}
        <div style={containerStyle}>
          {renderIcon()}
          <h3 style={{ marginTop: "1rem" }}>{renderText()}</h3>

          {elogCode && status !== "SUCCESS" && (
            <p style={{ marginTop: "1rem", color: "#d9534f", fontWeight: 600 }}>
              {getElogMessage(elogCode)}
            </p>
          )}

          {/* {clientCode && status === "FAILURE" && (
            <p>Client Code: {clientCode}</p>
          )} */}

          {/* BUTTON */}
          <Button
            color={status === "SUCCESS" ? "success" : "primary"}
            onClick={handleButtonClick}
            style={buttonStyle}
          >
            {status === "SUCCESS" ? "Close" : "Try Again"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  backgroundColor: "#fff",
  padding: "1rem",
  minHeight: "350px",
};

const buttonStyle: React.CSSProperties = {
  padding: "0.6rem 2rem",
  borderRadius: "6px",
  backgroundColor: "#003366",
  border: "none",
  marginTop: "1.5rem",
};

export default StatusCard;
