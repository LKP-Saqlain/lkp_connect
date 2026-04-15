import { Box, Typography } from "@mui/material";
import { SectionTitle } from "../../StylingCss";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useEffect, useState } from "react";
import {
  hideLoader,
  showLoader,
} from "../../../../../redux/slices/loaderSlice";
import { apiServices } from "../../../../../services";
import { AppDispatch } from "../../../../../redux/store";
import { useDispatch } from "react-redux";

const Action = ({ data, activeSubItem }: any) => {
  const [actionStatus, setActionStatus] = useState({});

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
              : "";
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

  const allowedSteps = [
    "Business Profile",
    "Personal Details",
    "KYC Documents",
    "Infrastructure Details",
    "Segment Deposit",
  ];

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
      </Box>
    </Box>
  );
};

export default Action;
