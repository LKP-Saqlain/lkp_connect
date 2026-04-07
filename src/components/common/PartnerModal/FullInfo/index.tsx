import { useEffect, useState } from "react";
import BussinessProfile from "./BusinessProfile";
import PersonalDetails from "./PersonalDetails";
import { AppDispatch } from "../../../../redux/store";
import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "../../../../redux/slices/loaderSlice";
import { apiServices } from "../../../../services";
import ApprovalFooter from "../components/ApprovalFooter";
import KycVerification from "./KYC";
import Infra from "./Infra";
import Segments from "./Segments";
import Action from "./Action";

const tabs = [
  "Business Profile",
  "Personal Details",
  "KYC Document",
  "Infrastructure details",
  "Segments",
  "Action",
  "Partner Sharing",
  "Payment",
  "E-signed",
  "Exchange Certificate",
];

const FullInfo = ({ data, toggle }: any) => {
  const [activeTab, setActiveTab] = useState("Business Profile");
  const [approvalData, setApprovalData] = useState<any>(null);

  const dispatch = useDispatch<AppDispatch>();
  console.log(data, "FullInfo data");

  useEffect(() => {
    const handleViewApprovalData = async () => {
      const payload = {
        applNo: 10128,
        viewType: "OpsApprove1ViewDetails",
        user_id: "EMP-5376",
      };

      dispatch(showLoader("Fetching Details..."));

      try {
        const response = await apiServices.ViewApprovalData(payload);

        // ✅ Save full response data
        setApprovalData(response?.data?.data);
      } catch (error) {
        console.error("Error fetching details:", error);
      } finally {
        dispatch(hideLoader());
      }
    };

    handleViewApprovalData();
  }, []);

  const getNextTab = (currentTab: string) => {
    const currentIndex = tabs.indexOf(currentTab);
    return tabs[currentIndex + 1] || currentTab;
  };

  const businessProfile = approvalData?.businessProfiles?.[0];
  const personalDetails = approvalData?.personalDetails?.[0];
  const kycDocs = approvalData?.kycDocs;
  const infraDetails = approvalData?.infraDetails?.[0];
  const summary = approvalData?.summary;

  return (
    <div style={{}}>
      {/* Top InfoBar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#fff",
          borderRadius: "10px",
          padding: "12px 24px",
          boxShadow: "0 2px 8px rgb(0 0 0 / 0.1)",
          marginBottom: "16px",
          fontSize: "14px",
          color: "#11395C",
          fontWeight: 500,
          gap: "30px",
          flexWrap: "wrap",
          rowGap: "12px",

          // ✅ Fix sticky
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ minWidth: "180px" }}>
          <span style={{ fontWeight: 600 }}>Application No - </span>
          {businessProfile?.applNo}
        </div>

        <div style={{ minWidth: "180px" }}>
          <span style={{ fontWeight: 600 }}>Name - </span>
          {businessProfile?.apName}
        </div>

        <div style={{ minWidth: "180px" }}>
          <span style={{ fontWeight: 600 }}>Mobile no - </span>
          {businessProfile?.mobile}
        </div>

        <div style={{ minWidth: "180px" }}>
          <span style={{ fontWeight: 600 }}>Email id - </span>
          {businessProfile?.emailId}
        </div>

        {/* Back button */}
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

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            overflowX: "auto",
            paddingBottom: "8px",
            marginBottom: "16px",
          }}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            const disabledTabs = [
              // "Partner Sharing",
              "Payment",
              "E-signed",
              "Exchange Certificate",
            ];
            const isDisabled = disabledTabs.includes(tab);

            return (
              <button
                key={tab}
                onClick={() => !isDisabled && setActiveTab(tab)}
                disabled={isDisabled}
                style={{
                  padding: "8px 20px",
                  borderRadius: "20px",
                  border: isDisabled ? "none" : "1px solid #11395C",
                  cursor: isDisabled ? "default" : "pointer",
                  backgroundColor: isActive
                    ? "#11395C"
                    : isDisabled
                      ? "#f0f0f0"
                      : "#ffffff",
                  color: isActive
                    ? "#ffffff"
                    : isDisabled
                      ? "#a3a3a3"
                      : "#11395C",
                  fontWeight: isActive ? 600 : 400,
                  whiteSpace: "nowrap",
                  boxShadow: isActive ? "0 2px 6px rgb(0 0 0 / 0.15)" : "none",
                  transition: "background-color 0.3s, color 0.3s",
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>
      {/* Content placeholder */}
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "12px",
          minHeight: "250px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        {activeTab === "Business Profile" && businessProfile && (
          <BussinessProfile data={businessProfile} />
        )}
        {activeTab === "Personal Details" && (
          <PersonalDetails data={personalDetails} />
        )}

        {activeTab === "KYC Document" && <KycVerification data={kycDocs} />}
        {activeTab === "Infrastructure details" && (
          <Infra data={infraDetails} />
        )}
        {activeTab === "Segments" && <Segments data={summary} />}
        {activeTab === "Action" && <Action />}
        <ApprovalFooter
          activeTab={activeTab}
          onSubmit={({ decision, remarks }) => {
            console.log({ decision, remarks, activeTab });

            //  Move to next tab
            const nextTab = getNextTab(activeTab);
            setActiveTab(nextTab);

            //  call API here if needed
          }}
        />
      </div>
    </div>
  );
};

export default FullInfo;
