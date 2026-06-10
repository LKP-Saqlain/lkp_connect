import { useEffect, useState } from "react";
import Certificate from "../FullInfo/Certificates";

import FinalDocs from "./FInalDocs";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../redux/store";
import { hideLoader, showLoader } from "../../../../redux/slices/loaderSlice";
import { apiServices } from "../../../../services";

const index = ({ toggle, data }: any) => {
  const tabs = ["Final Document", "Exchange Certificate"];
  const [activeTab, setActiveTab] = useState("Final Document");
  const [infoData, setInfoData] = useState<any>({});
  const dispatch = useDispatch<AppDispatch>();

  const tabComponents: Record<string, JSX.Element> = {
    "Final Document": <FinalDocs ApplNo={infoData?.ApplNo} />,
    "Exchange Certificate": <Certificate ApplNo={infoData?.ApplNo} />,
  };

  useEffect(() => {
    handleComplianceAlertMail();
  }, []);

  const handleComplianceAlertMail = async () => {
    const payload = {
      applNo: data?.applNo.toString(),
      signerType: "GetDetailsByApplNo",
    };
    dispatch(showLoader("Fetching Details..."));
    console.log("payload for mail", payload);

    try {
      const response = await apiServices.GetDetailsByAppl(payload);
      console.log(response?.data?.data[0], "GetDetailsByAppl");

      const responseData = response?.data?.data[0] || [];

      setInfoData(responseData);
    } catch (error) {
      console.error("Error fetching details:", error);
    } finally {
      dispatch(hideLoader());
    }
  };

  return (
    <div>
      {/* ================= STICKY HEADER ================= */}
      <div
        style={{
          background: "#fff",
          borderRadius: "10px",
          padding: "12px 24px",
          boxShadow: "0 2px 8px rgb(0 0 0 / 0.1)",
          marginBottom: "16px",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        {/* ===== TOP ROW ===== */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "30px",
            flexWrap: "wrap",
            rowGap: "12px",
            marginBottom: "16px",
            fontSize: "14px",
            color: "#11395C",
            fontWeight: 500,
          }}
        >
          {/* INFO SECTION */}
          <div
            style={{
              display: "flex",
              gap: "30px",
              flexWrap: "wrap",
              rowGap: "12px",
            }}
          >
            <div style={{ minWidth: "180px" }}>
              <span style={{ fontWeight: 600 }}>Application No - </span>
              {infoData?.ApplNo}
            </div>

            <div style={{ minWidth: "180px" }}>
              <span style={{ fontWeight: 600 }}>Name - </span>
              {infoData?.AP_Name}
            </div>

            <div style={{ minWidth: "180px" }}>
              <span style={{ fontWeight: 600 }}>Mobile no - </span>
              {infoData?.Mobile}
            </div>

            <div style={{ minWidth: "180px" }}>
              <span style={{ fontWeight: 600 }}>Email id - </span>
              {infoData?.EmailId}
            </div>
          </div>

          {/* BACK BUTTON */}
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
              minWidth: "120px",
              height: "40px",
            }}
          >
            Back
          </button>
        </div>

        {/* ===== TAB ROW ===== */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            overflowX: "auto",
          }}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "8px 20px",
                  borderRadius: "20px",
                  cursor: "pointer",
                  border: isActive ? "2px solid #11395C" : "1px solid #11395C",

                  backgroundColor: isActive ? "#11395C" : "#ffffff",

                  color: isActive ? "#ffffff" : "#11395C",

                  fontWeight: isActive ? 600 : 400,

                  whiteSpace: "nowrap",
                  boxShadow: isActive ? "0 2px 6px rgba(0,0,0,0.15)" : "none",

                  transition: "all 0.2s ease-in-out",
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "12px",
          minHeight: "250px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        {tabComponents[activeTab]}
      </div>
    </div>
  );
};

export default index;
