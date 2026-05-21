import { useEffect, useMemo, useState } from "react";
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

export interface PaymentItem {
  applNo: number | null;
  exchangeName: string;
  segmentId: number | null;
  segmentName: string | null;
  amount: number;
  revisedTotal: number | null;
  remarks: string | null;
  fileName: string | null;
  filePath: string | null;
}

const Payment = ({ data, activeSubItem, toggle, applNo }: any) => {
  const [paymentData, setPaymentData] = useState<any[]>(data || []);
  const [editRow, setEditRow] = useState<any>(null); // selected row
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [conditionData, setConditionData] = useState<PaymentItem[]>([]);

  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data,
  );

  const dispatch = useDispatch<AppDispatch>();

  // ================= EXCHANGE DATA =================
  const exchangeData = paymentData
    .filter(
      (item: any) =>
        !["Security Deposit", "Stamp Paper Charges", "Total"].includes(
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
      ["Security Deposit", "Stamp Paper Charges"].includes(item.exchangeName),
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

  // ================= TOTAL B ================= (FIXED)
  const totalB = useMemo(() => {
    // For Business/Management Approval, use conditionData
    if (
      activeSubItem === "Business Approval" ||
      activeSubItem === "Management Approval"
    ) {
      const totalRow = conditionData.find(
        (item) => item.exchangeName === "Total",
      );
      return totalRow?.revisedTotal ?? 0;
    }

    // For other cases, calculate from othersData
    return othersData.reduce((acc, curr) => {
      if (
        curr.exchangeName === "Security Deposit" ||
        curr.exchangeName === "Stamp Paper Charges"
      ) {
        acc += curr.revisedTotal ?? curr.total ?? 0;
      }
      return acc;
    }, 0);
  }, [activeSubItem, conditionData, othersData]);

  // ================= OTHERS WITH TOTAL ================= (FIXED)
  const othersWithTotal = useMemo(
    () => [
      ...othersData,
      {
        id: "total-B",
        exchangeName: "Total (B)",
        segmentName: "",
        total: "", // Keep empty for display
        revisedTotal: totalB, // Show the calculated total here
        attachment: "",
        remark: "",
        isTotal: true,
      },
    ],
    [othersData, totalB],
  );

  // ================= GRAND TOTAL =================
  // const grandTotal = totalA.total + totalB.total;
  const grandTotal = useMemo(() => {
    const a = totalA?.total ?? 0;
    const b = totalB ?? 0;

    return new Intl.NumberFormat("en-IN").format(a + b);
  }, [totalA?.total, totalB]);
  // ================= HANDLE EDIT =================
  const handleEdit = (row: any) => {
    console.log("TestRow", row);

    setEditRow(row); // save row to state
    setIsEditModalOpen(true); // open modal
  };

  const handleSaveEdit = (updatedRow: any) => {
    console.log("Test11", updatedRow);

    const updatedData = paymentData.map((item) => {
      const itemId = `${item.segmentID}-${item.exchangeName}`;
      if (itemId === updatedRow.id) {
        return {
          ...item,
          revisedTotal: updatedRow.revisedTotal, // Explicitly update revisedTotal
          remark: updatedRow.remark,
          attachment: updatedRow.attachment,
          fileName: updatedRow.fileName,
          fileType: updatedRow.fileType,
          contentType: updatedRow.contentType,
        };
      }
      return item;
    });

    setPaymentData(updatedData);
    setIsEditModalOpen(false);
  };

  const handlePaymentNext = async () => {
    const decisionType = localStorage.getItem("MailDecision");

    if (!decisionType) {
      alert("Please complete Partner Sharing approval first");
      return;
    }
    dispatch(showLoader(""));

    try {
      const filteredData = paymentData.filter((item) =>
        ["Security Deposit", "Stamp Paper Charges"].includes(item.exchangeName),
      );

      const editedRows = filteredData.filter((item) => {
        return (
          item.revisedTotal !== item.total ||
          (item.remark && item.remark.trim() !== "") ||
          item.fileName
        );
      });

      if (!editedRows.length) {
        ShowToast("info", "No changes to update");
        return;
      }

      const buildPayload = (item: any) => ({
        user_id,
        applNo: item.applNo,
        segment: item.segmentName,
        revisedCharges: item.revisedTotal || item.total || 0,
        remarks: item.remark || "",
        fileName: item.fileName || "",
        fileType: item.fileType || "",
        contentType: item.contentType || "",
      });

      const promises: Promise<any>[] = [];

      editedRows.forEach((item) => {
        const name = item.exchangeName?.trim().toLowerCase();

        const payload = buildPayload(item);

        if (name === "security deposit") {
          promises.push(apiServices.UpdateRevisedcharges(payload));
        }

        if (name === "stamp paper charges") {
          promises.push(apiServices.UpdateRevisedStampcharges(payload));
        }
      });

      const responses = await Promise.all(promises);

      const anySuccess = responses.some(
        (res) => res?.data?.data?.msg === "Success",
      );

      if (anySuccess) {
        ShowToast("success", "Updated successfully");
        if (localStorage.getItem("MailDecision") === "true") {
          handleComplianceAlertMail();
        }
        toggle();
      } else {
        ShowToast("error", "Some updates failed");
      }
    } catch (error: any) {
      console.error(error);
      ShowToast("error", error.message || "Something went wrong");
    } finally {
      dispatch(hideLoader());
    }
  };

  const handleComplianceAlertMail = async () => {
    const payload = {
      applNo: applNo, // Replace with dynamic application number
      templateType: "BROK_SAVE",
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

      const transformedData = response?.data?.data.map(
        (item: any, index: number) => {
          // For the Total row, move amount to revisedTotal
          if (item.exchangeName === "Total") {
            return {
              id: index + 1,
              ...item,
              revisedTotal: item.amount, // Move amount to revisedTotal
              amount: null, // Clear amount or keep it, depending on your need
            };
          }

          return {
            id: index + 1,
            ...item,
          };
        },
      );

      setConditionData(transformedData);

      console.log(transformedData, "handleBusinessManageData");
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    console.log("Test123", totalA, totalB, conditionData[2]?.amount);
  }, [totalA, totalB, conditionData]);

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
