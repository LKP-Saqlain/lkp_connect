import { useState } from "react";
import { Box, Typography } from "@mui/material";
import DataTable from "../../../UserInfoTable";
import PartnerModal from "../../../PartnerModal"; // your modal component

const Payment = ({ data }: any) => {
  const [editRow, setEditRow] = useState<any>(null); // selected row
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  let idCounter = 1;

  // ================= EXCHANGE DATA =================
  const exchangeData = data
    .filter(
      (item: any) =>
        !["Security Deposit", "Stamp Paper charges", "Total"].includes(
          item.exchangeName,
        ),
    )
    .map((item: any) => ({ ...item, id: idCounter++ }));

  // ================= OTHERS DATA =================
  const othersData = data
    .filter((item: any) =>
      ["Security Deposit", "Stamp Paper charges"].includes(item.exchangeName),
    )
    .map((item: any) => ({ ...item, id: idCounter++ }));

  // ================= TOTAL A =================
  const totalA = exchangeData.reduce(
    (acc: any, curr: any) => {
      acc.total += curr.total;
      return acc;
    },
    { total: 0 },
  );

  const exchangeWithTotal = [
    ...exchangeData,
    {
      id: idCounter++,
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
    (acc: any, curr: any) => {
      acc.total += curr.total;
      return acc;
    },
    { total: 0 },
  );

  const othersWithTotal = [
    ...othersData,
    {
      id: idCounter++,
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
        <DataTable
          T6Data={othersWithTotal}
          customHide
          activeSubItem="AP PaymentOtherData"
          selectedWidget="Criteria and Rewards"
          handleEditClick={handleEdit} // pass handleEdit
        />
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

      {/* ================= EDIT MODAL ================= */}
      {editRow && (
        <PartnerModal
          isOpen={isEditModalOpen}
          toggle={() => setIsEditModalOpen(false)}
          data={editRow}
          type="EditPartnerPayment"
        />
      )}
    </Box>
  );
};

export default Payment;
