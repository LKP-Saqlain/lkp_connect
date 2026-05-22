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
import { Box } from "@mui/material";

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

const sectionIdMap: Record<string, number> = {
  "Business Profile": 2,
  "Personal Details": 3,
  "KYC Document": 4,
  "Infrastructure details": 5,
  Segments: 6,
  "Partner Sharing": 7,
  Payment: 8,
  "E-signed": 9,
};
const FullInfo = ({ data, toggle, activeSubItem }: any) => {
  const [activeTab, setActiveTab] = useState("");
  const [approvalData, setApprovalData] = useState<any>(null);
  const [referralCode, setReferralCode] = useState("");
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data,
  );

  const currentConfig = approvalConfig[activeSubItem];

  const dispatch = useDispatch<AppDispatch>();
  console.log(data, "FullInfo data");
  const remarkMap: Record<string, string | undefined> = {
    "Business Profile": approvalData?.businessProfiles?.[0]?.processRemarks,

    "Personal Details": approvalData?.personalDetails?.[0]?.processRemarks,

    "Infrastructure details": approvalData?.infraDetails?.[0]?.processRemarks,

    Segments: approvalData?.segments?.[0]?.processRemarks,

    "Partner Sharing": approvalData?.partnerSharing?.[0]?.processRemarks,

    Payment: approvalData?.summary?.[0]?.processRemarks,
  };

  useEffect(() => {
    if (!currentConfig) return;

    const hiddenApprovalTabs = currentConfig.hideApprovalForTabs || [];
    const skipTabs = currentConfig.skipTabsInFlow || [];

    const firstValidTab = tabs.find(
      (tab) => !hiddenApprovalTabs.includes(tab) && !skipTabs.includes(tab),
    );

    if (firstValidTab) {
      setActiveTab(firstValidTab);
    }
  }, [activeSubItem]);

  const handleViewApprovalData = async () => {
    const payload = {
      applNo: data.applNo, // Replace with dynamic application number
      // viewType: currentConfig.viewType,
      viewType: "OpsApprove1ViewDetails",
      user_id,
    };

    dispatch(showLoader("Fetching Details..."));

    try {
      const response = await apiServices.ViewApprovalData(payload);

      setApprovalData(response?.data?.data);
    } catch (error) {
      console.error("Error fetching details:", error);
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    handleViewApprovalData();
  }, [data?.applNo, currentConfig?.viewType, user_id]);

  useEffect(() => {
    ["MailDecision", "decisionType"].forEach((key) => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
      }
    });
  }, [data]);

  const handleApprovalRemarks = async ({ decision, remarks }: any) => {
    const decisionType = localStorage.getItem("decisionType");

    if (
      !decisionType &&
      decision !== "REJECT" &&
      (activeSubItem === "Business Approval" ||
        activeSubItem === "Management Approval")
    ) {
      alert("Please complete Partner Sharing approval first");
      return;
    }

    let templateType = "";

    // =========================
    // Business Approval
    // =========================
    if (activeSubItem === "Business Approval") {
      // Current action is reject
      if (decision === "REJECT") {
        templateType = "BROK_REJ";
      }

      // Current action approve -> depend on localStorage
      else if (decision === "APPROVE") {
        if (decisionType === "APPROVE") {
          templateType = "BROK_APPROVE";
        } else if (decisionType === "REJECT") {
          templateType = "BROK_REJ";
        }
      }
    }

    // =========================
    // Management Approval
    // =========================
    if (activeSubItem === "Management Approval") {
      // Current reject always reject mail
      if (decision === "REJECT") {
        templateType = "MG_REJECT";
      }

      // APPROVE => do nothing
    }

    try {
      dispatch(showLoader("Final Approval..."));

      const currentConfig = approvalConfig[activeSubItem];

      const payload: any = {
        applNo: data.applNo,
        userId: user_id,
      };
      if (activeSubItem === "Ops Level 1 Approval") {
        payload.referralCode = referralCode.split("-")[0];
      }
      //  Add sectionId only if needed
      if (currentConfig.hasSection) {
        const sectionId = sectionIdMap[activeTab];
        if (sectionId) {
          payload.sectionId = sectionId;
        }
      }

      //  Add status dynamically
      payload[currentConfig.statusKey] = decision === "APPROVE" ? "A" : "R";

      //  Add remark only if allowed
      if (currentConfig.remarkKey && remarks) {
        payload[currentConfig.remarkKey] = remarks;
      }

      console.log("Final Payload:", payload);

      await currentConfig.approveApi(payload);

      // Send mail only on Payment tab
      if (templateType && activeTab === "Payment") {
        await handleAlertMail(templateType);
      }

      const nextTab = getNextTab(activeTab);
      if (nextTab !== activeTab) {
        setActiveTab(nextTab);
      } else {
        toggle();
      }
    } catch (error) {
      console.error("Approval failed", error);
    } finally {
      dispatch(hideLoader());
    }
  };

  const handleAlertMail = async (templateType: string) => {
    const payload = {
      applNo: data.applNo,
      templateType,
    };

    dispatch(showLoader("Fetching Details..."));

    console.log("payload for mail", payload);

    try {
      const response = await apiServices.SendMailToApprover(payload);
      console.log(response);
    } catch (error) {
      console.error("Error fetching details:", error);
    } finally {
      dispatch(hideLoader());
    }
  };

  const getNextTab = (currentTab: string) => {
    const currentIndex = tabs.indexOf(currentTab);
    const skipTabs = currentConfig?.skipTabsInFlow || [];

    for (let i = currentIndex + 1; i < tabs.length; i++) {
      if (!skipTabs.includes(tabs[i])) {
        return tabs[i];
      }
    }
    return currentTab;
  };
  const goToNextTab = () => {
    const nextTab = getNextTab(activeTab);
    if (nextTab !== activeTab) {
      setActiveTab(nextTab);
    }
  };

  const businessProfile = approvalData?.businessProfiles?.[0];
  const personalDetails = approvalData?.personalDetails?.[0];
  const kycDocs = approvalData?.kycDocs;
  const infraDetails = approvalData?.infraDetails?.[0];
  const summary = approvalData?.summary;
  const segments = approvalData?.segments;
  const partnerSharingData = approvalData?.partnerSharing;
  const esignDocs = approvalData?.esignDocs;

  const tabComponents: Record<string, JSX.Element> = {
    "Business Profile": (
      <BussinessProfile
        data={businessProfile}
        kycDocs={kycDocs}
        activeSubItem={activeSubItem}
        setReferralCode={setReferralCode}
      />
    ),
    "Personal Details": (
      <PersonalDetails data={personalDetails} kycDocs={kycDocs} />
    ),
    "KYC Document": <KycVerification data={kycDocs} />,
    "Infrastructure details": <Infra data={infraDetails} />,
    Segments: <Segments data={segments} />,
    Action: (
      <Action data={data} activeSubItem={activeSubItem} toggle={toggle} />
    ),
    "Partner Sharing": (
      <PartnerSharing
        data={partnerSharingData}
        activeSubItem={activeSubItem}
        applNo={data.applNo}
        goToNextTab={goToNextTab}
        kycDocs={kycDocs}
      />
    ),
    Payment: (
      <Payment
        data={summary}
        activeSubItem={activeSubItem}
        toggle={toggle}
        applNo={data.applNo}
      />
    ),
    "E-signed": (
      <Esign
        data={summary}
        applNo={data.applNo}
        kycDocs={kycDocs}
        esignDocs={esignDocs}
        handleViewApprovalData={handleViewApprovalData}
      />
    ),
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
            const disabledTabs = currentConfig?.skipTabsInFlow || [];
            const isDisabled = disabledTabs.includes(tab);
            const approvedTabs = currentConfig?.hideApprovalForTabs || [];
            const isApproved = approvedTabs.includes(tab);
            const hasRemark = !!remarkMap[tab];

            return (
              <button
                key={tab}
                onClick={() => !isDisabled && setActiveTab(tab)}
                disabled={isDisabled}
                style={{
                  padding: "8px 20px",
                  borderRadius: "20px",
                  cursor: isDisabled ? "default" : "pointer",
                  border: isDisabled
                    ? "none"
                    : isActive
                      ? "2px solid #11395C"
                      : hasRemark
                        ? "1px solid #f59e0b"
                        : isApproved
                          ? "1px solid #27a12d"
                          : "1px solid #11395C",

                  backgroundColor: isActive
                    ? "#11395C"
                    : isDisabled
                      ? "#f3f3f3"
                      : hasRemark
                        ? "#fff7ed"
                        : isApproved
                          ? "#eaf7ec"
                          : "#ffffff",

                  color: isActive
                    ? "#ffffff"
                    : isDisabled
                      ? "#a3a3a3"
                      : hasRemark
                        ? "#c2410c"
                        : isApproved
                          ? "#1f7a2e"
                          : "#11395C",

                  fontWeight: isActive ? 600 : 400,

                  whiteSpace: "nowrap",
                  boxShadow: isActive
                    ? "0 2px 6px rgba(0,0,0,0.15)"
                    : isApproved
                      ? "0 0 0 1px rgba(39,161,45,0.2)"
                      : "none",

                  transition: "all 0.2s ease-in-out",
                  position: "relative",
                }}
              >
                {hasRemark && isActive && (
                  <span
                    style={{
                      position: "absolute",
                      top: "6px",
                      right: "6px",
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "#f59e0b",
                    }}
                  />
                )}
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
        {remarkMap[activeTab] && (
          <Box
            mb={2}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              background: "#fff8e6",
              border: "1px solid #f5d27a",
              borderLeft: "5px solid #f59e0b",
              borderRadius: "12px",
              padding: "12px 16px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#92400e",
                whiteSpace: "nowrap",
              }}
            >
              Reviewer Remark:
            </Box>

            <Box
              sx={{
                fontSize: "14px",
                color: "#4b5563",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                flex: 1,
              }}
              title={remarkMap[activeTab]}
            >
              {remarkMap[activeTab]}
            </Box>
          </Box>
        )}
        {tabComponents[activeTab]}
        {!currentConfig?.hideApprovalForTabs?.includes(activeTab) && (
          <ApprovalFooter
            activeTab={activeTab}
            activeSubItem={activeSubItem}
            onNext={() => {
              const nextTab = getNextTab(activeTab);
              setActiveTab(nextTab);
            }}
            onApproval={handleApprovalRemarks}
          />
        )}
      </div>
    </div>
  );
};

export default FullInfo;
