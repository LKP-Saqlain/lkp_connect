import { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import DataTable from "../../../UserInfoTable";
import PartnerModal from "../../../PartnerModal"; // your modal component
import {
  hideLoader,
  showLoader,
} from "../../../../../redux/slices/loaderSlice";
import { AppDispatch, RootState } from "../../../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { apiServices } from "../../../../../services";
import ShowToast from "../../../../../utils/toastUtils";

const Payment = ({ data, activeSubItem, toggle, applNo }: any) => {
  const [paymentData, setPaymentData] = useState<any[]>(data || []);
  const [editRow, setEditRow] = useState<any>(null); // selected row
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [conditionData, setConditionData] = useState([]);

  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data,
  );

  const dispatch = useDispatch<AppDispatch>();
  // let idCounter = 1;

  // ================= EXCHANGE DATA =================
  const exchangeData = paymentData
    .filter(
      (item: any) =>
        !["Security Deposit", "Stamp Paper charges", "Total"].includes(
          item.exchangeName,
        ),
    )
    .map((item: any) => ({
      ...item,
      id: `${item.segmentID}-${item.exchangeName}`,
    }));

  // ================= OTHERS DATA =================
  const othersData = paymentData
    .filter((item: any) =>
      ["Security Deposit", "Stamp Paper charges"].includes(item.exchangeName),
    )
    .map((item: any) => ({
      ...item,
      id: `${item.segmentID}-${item.exchangeName}`,
    }));

  // ================= TOTAL A =================
  const totalA = exchangeData.reduce(
    (acc: any, curr: any) => {
      acc.total += curr.revisedTotal || curr.total || 0;
      return acc;
    },
    { total: 0 },
  );

  const exchangeWithTotal = [
    ...exchangeData,
    {
      id: "total-A",
      exchangeName: "Total (A)",
      segmentName: "",
      amount: "",
      gst: "",
      total: totalA.total,
      isTotal: true,
    },
  ];

  // ================= TOTAL B =================
  const totalB = othersData.reduce(
    (acc, curr) => {
      if (curr.exchangeName === "Security Deposit") {
        acc.total += curr.revisedTotal || 0; // ONLY revisedTotal
      } else {
        acc.total += curr.total || 0;
      }
      return acc;
    },
    { total: 0 },
  );

  const othersWithTotal = [
    ...othersData,
    {
      id: "total-B",
      exchangeName: "Total (B)",
      total: totalB.total,
      revisedTotal: "",
      attachment: "",
      remark: "",
      isTotal: true,
    },
  ];

  // ================= GRAND TOTAL =================
  const grandTotal = totalA.total + totalB.total;

  // ================= HANDLE EDIT =================
  const handleEdit = (row: any) => {
    console.log(row);

    setEditRow(row); // save row to state
    setIsEditModalOpen(true); // open modal
  };

  const handleSaveEdit = (updatedRow: any) => {
    const updatedData = paymentData.map((item) =>
      `${item.segmentID}-${item.exchangeName}` === updatedRow.id
        ? { ...item, ...updatedRow }
        : item,
    );

    setPaymentData(updatedData);
    setIsEditModalOpen(false);
  };

  const handlePaymentNext = async () => {
    const securityDepositRow = paymentData.find(
      (item) => item.exchangeName === "Security Deposit",
    );

    if (!securityDepositRow) {
      console.log("Security Deposit not found");
      return;
    }

    const formattedPayload = {
      user_id,
      applNo: securityDepositRow.applNo,
      segment: securityDepositRow.segmentName,
      revisedCharges:
        securityDepositRow.revisedTotal || securityDepositRow.total || 0,
      remarks: securityDepositRow.remark || "",

      // ✅ FIXED
      fileName: securityDepositRow.fileName || "",
      fileType: securityDepositRow.fileType || "",
      contentType: securityDepositRow.contentType || "",
    };
    dispatch(showLoader("Verifying OTP..."));
    try {
      const response = await apiServices.UpdateRevisedcharges(formattedPayload);
      if (response?.data?.data?.msg === "Success") {
        ShowToast("success", response?.data?.message);
        toggle();
      }

      console.log(formattedPayload, "Final Payload", response);
    } catch (error) {
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    if (
      activeSubItem === "Business Approval" ||
      activeSubItem === "Management Approval"
    ) {
      handleBusinessManageData();
    }
  }, [activeSubItem]);

  const handleBusinessManageData = async () => {
    const payload = {
      applNo: applNo,
    };
    dispatch(showLoader("Verifying OTP..."));
    try {
      const response = await apiServices.GetRevisedPaySummary(payload);
      setConditionData(
        response?.data?.data.map((item: any, index: number) => ({
          id: index + 1,
          ...item,
        })),
      );

      console.log(
        response?.data?.data[0].map((item: any, index: number) => ({
          id: index + 1,
          ...item,
        })),
        "handleBusinessManageData",
      );
    } catch (error) {
    } finally {
      dispatch(hideLoader());
    }
  };

  return (
    <Box>
      {/* ================= TABLE A ================= */}
      <Box mb={4}>
        <DataTable
          T6Data={exchangeWithTotal}
          customHide
          activeSubItem="AP PaymentExchangeData"
          selectedWidget="Criteria and Rewards"
        />
      </Box>

      {/* ================= TABLE B ================= */}
      <Box mb={4}>
        {activeSubItem !== "Business Approval" &&
          activeSubItem !== "Management Approval" && (
            <DataTable
              T6Data={othersWithTotal}
              customHide
              activeSubItem="AP PaymentOtherData"
              selectedWidget="Criteria and Rewards"
              handleEditClick={handleEdit} // pass handleEdit
            />
          )}
        {(activeSubItem === "Business Approval" ||
          activeSubItem === "Management Approval") && (
          <DataTable
            T6Data={conditionData}
            customHide
            activeSubItem="AP PaymentOtherConditionData"
            selectedWidget="Criteria and Rewards"
          />
        )}
      </Box>

      {/* ================= GRAND TOTAL ================= */}
      <Box
        mb={2}
        sx={{
          width: "300px",
          background: "#d9e6f2",
          padding: "10px",
          display: "flex",
          justifyContent: "space-between",
          fontWeight: 600,
        }}
      >
        <Typography>Total (A+B)</Typography>
        <Typography>{grandTotal}</Typography>
      </Box>
      {/* ================= SAVE BUTTON ================= */}
      {activeSubItem === "Ops Level 2 Approval" && (
        <Button
          variant="contained"
          onClick={handlePaymentNext}
          sx={{
            mt: 3,
            background: "#1F5A96",
            textTransform: "none",
            borderRadius: 2,
            px: 4,
            height: 40,
            // opacity: !isFormValid ? 0.6 : 1,
          }}
        >
          Save & proceed
        </Button>
      )}

      {/* ================= EDIT MODAL ================= */}
      {editRow && (
        <PartnerModal
          isOpen={isEditModalOpen}
          toggle={() => setIsEditModalOpen(false)}
          data={editRow}
          type="EditPartnerPayment"
          onSave={handleSaveEdit}
        />
      )}
    </Box>
  );
};

export default Payment;
