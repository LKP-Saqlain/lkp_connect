import { Box, Typography, Button } from "@mui/material";
import { SectionTitle } from "../../StylingCss";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useEffect, useState } from "react";
import {
  hideLoader,
  showLoader,
} from "../../../../../redux/slices/loaderSlice";
import { apiServices } from "../../../../../services";
import { AppDispatch, RootState } from "../../../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import ShowToast from "../../../../../utils/toastUtils";

const Action = ({ data, activeSubItem, toggle }: any) => {
  const [actionStatus, setActionStatus] = useState({});
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data,
  );

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const handleActionStatusData = async () => {
      const optionType =
        activeSubItem === "Ops Level 1 Approval"
          ? "Ops1ApprovalStatus"
          : activeSubItem === "Compliance Approval"
            ? "ComplianceApprovalStatus"
            : activeSubItem === "Ops Level 2 Approval"
              ? "Ops2ApprovalStatus"
              : "Ops2ApprovalStatus";
      const payload = {
        applNo: data.applNo, // Replace with dynamic application number
        optionType,
      };

      dispatch(showLoader("Fetching Details..."));

      try {
        const response = await apiServices.GetApprovalStatus(payload);

        console.log(response?.data?.data, "reso");

        setActionStatus(response?.data?.data);
      } catch (error) {
        console.error("Error fetching details:", error);
      } finally {
        dispatch(hideLoader());
      }
    };

    handleActionStatusData();
  }, []);

  const handleRejectionMail = async () => {
    const optionType =
      activeSubItem === "Ops Level 1 Approval"
        ? "OpsLevel1"
        : activeSubItem === "Compliance Approval"
          ? "Compliance"
          : "";
    const payload = {
      applNo: data.applNo, // Replace with dynamic application number
      optionType,
      user_id,
    };
    dispatch(showLoader("Fetching Details..."));

    try {
      const response = await apiServices.SendRejectionMail(payload);
      ShowToast("error", response?.data?.message);
    } catch (error) {
      console.error("Error fetching details:", error);
    } finally {
      dispatch(hideLoader());
    }
  };
  const handleComplianceAlertMail = async () => {
    const templateType =
      activeSubItem === "Ops Level 1 Approval"
        ? "COMPL-ALERT"
        : activeSubItem === "Compliance Approval"
          ? "OPS_BROK"
          : "";
    const payload = {
      applNo: data.applNo, // Replace with dynamic application number
      templateType,
    };
    dispatch(showLoader("Fetching Details..."));
    console.log("payload for compliance alert mail", payload);

    try {
      const response = await apiServices.SendMailToApprover(payload);
      console.log(response);

      ShowToast("success", "Approved.");
    } catch (error) {
      console.error("Error fetching details:", error);
    } finally {
      dispatch(hideLoader());
    }
  };

  const allowedSteps = [
    "Business Profile",
    "Personal Details",
    "KYC Documents",
    "Infrastructure Details",
    "Segment Deposit",
  ];
  const filteredSteps = Array.isArray(actionStatus)
    ? actionStatus.filter((item: any) => allowedSteps.includes(item.stepName))
    : [];

  const allApproved =
    filteredSteps.length > 0 &&
    filteredSteps.every((item: any) => item.approveStatus === "A");

  const hasRejected =
    filteredSteps.length > 0 &&
    filteredSteps.some((item: any) => item.approveStatus === "R");

  return (
    <Box pb={3}>
      <SectionTitle>Action</SectionTitle>

      <Box display="flex" flexDirection="column" gap={2}>
        {Array.isArray(actionStatus) &&
          actionStatus
            .filter((item: any) => allowedSteps.includes(item.stepName))
            .map((item: any) => {
              const isApproved = item.approveStatus === "A";

              return (
                <Box
                  key={item.sectionDetails}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  p={1}
                  border="1px solid #D0D5DD"
                  borderRadius="12px"
                  bgcolor="#fff"
                >
                  <Typography fontWeight={500}>{item.stepName}</Typography>

                  {isApproved ? (
                    <CheckCircleIcon sx={{ color: "#1f9647", fontSize: 30 }} />
                  ) : (
                    <CancelIcon sx={{ color: "#E02424", fontSize: 30 }} />
                  )}
                </Box>
              );
            })}
        {/* <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            sx={{
              borderColor: "#1F5A96",
              color: "#1F5A96",
              textTransform: "none",
              borderRadius: "10px",
              px: 3,
            }}
            onClick={() => {
              if (allApproved) {
                ShowToast("success", "All steps approved.");
              } else {
                handleRejectionMail();
              }
              toggle();
            }}
          >
            {allApproved ? "Approve" : "Send for Rework"}
          </Button>
        </Box> */}
        <Box display="flex" gap={2}>
          {hasRejected && (
            <Button
              variant="outlined"
              sx={{
                borderColor: "#1F5A96",
                color: "#1F5A96",
                textTransform: "none",
                borderRadius: "10px",
                px: 3,
              }}
              onClick={() => {
                handleRejectionMail();
                toggle();
              }}
            >
              Send for Rework
            </Button>
          )}

          {allApproved &&
            (activeSubItem === "Ops Level 1 Approval" ||
              activeSubItem === "Compliance Approval") && (
              <Button
                variant="outlined"
                sx={{
                  borderColor: "#1f9647",
                  color: "#1f9647",
                  textTransform: "none",
                  borderRadius: "10px",
                  px: 3,
                }}
                onClick={() => {
                  handleComplianceAlertMail();
                  toggle();
                }}
              >
                Approve
              </Button>
            )}
        </Box>
      </Box>
    </Box>
  );
};

export default Action;
