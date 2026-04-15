import { useEffect, useState } from "react";
import BussinessProfile from "./BusinessProfile";
import PersonalDetails from "./PersonalDetails";
import { AppDispatch, RootState } from "../../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "../../../../redux/slices/loaderSlice";
import { apiServices } from "../../../../services";
import ApprovalFooter from "../components/ApprovalFooter";
import KycVerification from "./KYC";
import Infra from "./Infra";
import Segments from "./Segments";
import Action from "./Action";
import PartnerSharing from "./PartnerSharing";
import Payment from "./Payment";
import Certificate from "./Certificates";
import Esign from "./Esign";
import { approvalConfig } from "../../../../helper/commmon";

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

const FullInfo = ({ data, toggle, activeSubItem }: any) => {
  const [activeTab, setActiveTab] = useState("");
  const [approvalData, setApprovalData] = useState<any>(null);
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data,
  );

  const currentConfig = approvalConfig[activeSubItem];

  const dispatch = useDispatch<AppDispatch>();
  console.log(data, "FullInfo data");

  useEffect(() => {
    if (!currentConfig) return;

    const disabledTabs = currentConfig.disabledTabs || [];

    const firstEnabledTab = tabs.find((tab) => !disabledTabs.includes(tab));

    if (firstEnabledTab) {
      setActiveTab(firstEnabledTab);
    }
  }, [activeSubItem]);

  useEffect(() => {
    const handleViewApprovalData = async () => {
      const payload = {
        applNo: data.applNo, // Replace with dynamic application number
        viewType: currentConfig.viewType,
        user_id,
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
  }, [data?.applNo, currentConfig?.viewType, user_id]);

  const handleApprovalRemarks = async ({ decision, remarks }: any) => {
    try {
      dispatch(showLoader("Final Approval..."));

      const currentConfig = approvalConfig[activeSubItem];

      const payload: any = {
        applNo: data.applNo,
        userId: user_id,
      };

      //  Add sectionId only if needed
      if (currentConfig.hasSection) {
        const sectionId = tabs.indexOf(activeTab) + 1;
        payload.sectionId = sectionId;
      }

      //  Add status dynamically
      payload[currentConfig.statusKey] = decision === "APPROVE" ? "A" : "R";

      //  Add remark only if allowed
      if (currentConfig.remarkKey && remarks) {
        payload[currentConfig.remarkKey] = remarks;
      }

      console.log("Final Payload:", payload);

      await currentConfig.approveApi(payload);

      const nextTab = getNextTab(activeTab);
      if (nextTab !== activeTab) {
        setActiveTab(nextTab);
      }
    } catch (error) {
      console.error("Approval failed", error);
    } finally {
      dispatch(hideLoader());
    }
  };

  const getNextTab = (currentTab: string) => {
    const currentIndex = tabs.indexOf(currentTab);
    const disabledTabs = currentConfig?.disabledTabs || [];

    for (let i = currentIndex + 1; i < tabs.length; i++) {
      if (!disabledTabs.includes(tabs[i])) {
        return tabs[i];
      }
    }
    return currentTab;
  };

  const businessProfile = approvalData?.businessProfiles?.[0];
  const personalDetails = approvalData?.personalDetails?.[0];
  const kycDocs = approvalData?.kycDocs;
  const infraDetails = approvalData?.infraDetails?.[0];
  const summary = approvalData?.summary;
  const partnerSharingData = approvalData?.partnerSharing;

  const tabComponents: Record<string, JSX.Element> = {
    "Business Profile": <BussinessProfile data={businessProfile} />,
    "Personal Details": <PersonalDetails data={personalDetails} />,
    "KYC Document": <KycVerification data={kycDocs} />,
    "Infrastructure details": <Infra data={infraDetails} />,
    Segments: <Segments data={summary} />,
    Action: <Action data={data} activeSubItem={activeSubItem} />,
    "Partner Sharing": (
      <PartnerSharing data={partnerSharingData} activeSubItem={activeSubItem} />
    ),
    Payment: <Payment data={summary} />,
    "E-signed": <Esign data={summary} applNo={data.applNo} />,
    "Exchange Certificate": <Certificate />,
  };

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
            const disabledTabs = currentConfig?.disabledTabs || [];
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
        {tabComponents[activeTab]}
        <ApprovalFooter
          activeTab={activeTab}
          activeSubItem={activeSubItem}
          onNext={() => {
            const nextTab = getNextTab(activeTab);
            setActiveTab(nextTab);
          }}
          onApproval={handleApprovalRemarks}
        />
      </div>
    </div>
  );
};

export default FullInfo;
