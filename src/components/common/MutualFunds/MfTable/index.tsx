import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import {
  OrderTransaction,
  OrderOngoingSip,
  OrderUpcomingSip,
  MfPortfolio,
  MandateColumns,
  // RecommendationList,
  getRecommendationListColumns,
  NFOList,
  MutualFundOrderColumns,
} from "../../../../helper/tableColumns";
import { MutualFundProps } from "../../../../pages/MutualFund/mfTypes";
import MutualFundModal from "../MfModal";
import { useState } from "react";
import { Button } from "@mui/material";

const MutualFundTable = ({
  rows,
  selectedLabel,
  onSelectFund,
  onRedeemClick,
  onInvestMoreClick,
}: MutualFundProps) => {
  const [open, setOpen] = useState(false);
  const [selectedReturnPeriod, setSelectedReturnPeriod] = useState("oneWeek");

  const returnPeriods = [
    { label: "1W", value: "oneWeek" },
    { label: "1M", value: "oneMonth" },
    { label: "3M", value: "threeMonth" },
    { label: "6M", value: "sixMonth" },
    { label: "1Y", value: "oneYear" },
    { label: "3Y", value: "threeYear" },
    { label: "5Y", value: "fiveYear" },
  ];
  const toggle = () => setOpen(!open);

  const handleRowClick = (params: any) => {
    if (onSelectFund) {
      onSelectFund(params.row.schemeCode.toString());
    }
    console.log(params.row.schemeCode, "params.row.schemeCode");
  };
  const recommendationTypes = [
    "High Returns",
    "Tax Savings",
    "SIP with 100",
    "SIP with 500",
  ];
  const getColumns = () => {
    // You can customize columns based on selectedLabel here
    if (selectedLabel === "MfPortfolio") {
      return MfPortfolio.map((column) => {
        if (column.field === "action") {
          return {
            ...column, // <- important to preserve other column props like `field`, `headerName`, etc.
            renderCell: (_params: any) => (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 1.5, // spacing between buttons
                  width: "100%", // ensure it uses the full cell
                  height: "100%",
                }}
              >
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    color: "#0d47a1",
                    borderColor: "#0d47a1",
                    textTransform: "none",
                    fontWeight: 500,
                    borderRadius: 5,
                    minWidth: "80px", // optional for consistent button width
                  }}
                  // onClick={toggle}
                  onClick={() => {
                    if (onRedeemClick) {
                      onRedeemClick(_params.row); //  send row to parent
                      // handleRedeem(_params);
                    }
                  }}
                >
                  Redeem
                </Button>

                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    backgroundColor: "#11395C",
                    textTransform: "none",
                    fontWeight: 500,
                    borderRadius: 5,
                    minWidth: "70px", // optional for consistent button width
                    "&:hover": {
                      backgroundColor: "#08306b",
                    },
                  }}
                  onClick={() => onInvestMoreClick?.(_params.row)}
                >
                  ADD
                </Button>
              </Box>
            ),
          };
        }
        return column;
      });
    } else if (selectedLabel === "Upcoming SIP") {
      return OrderUpcomingSip.map((column) => ({
        ...column,
      }));
    } else if (selectedLabel === "NFO") {
      return NFOList.map((column) => ({
        ...column,
      }));
    } else if (selectedLabel && recommendationTypes.includes(selectedLabel)) {
      return getRecommendationListColumns(selectedReturnPeriod);
    } else if (selectedLabel === "Transaction") {
      return OrderTransaction.map((column) => ({
        ...column,
      }));
    } else if (selectedLabel === "Ongoing SIP") {
      return OrderOngoingSip.map((column) => ({
        ...column,
      }));
    } else if (selectedLabel === "Mandates") {
      return MandateColumns.map((column) => ({
        ...column,
      }));
    } else if (
      selectedLabel &&
      ["Completed", "In Process", "Failed"].includes(selectedLabel)
    ) {
      return MutualFundOrderColumns.map((column) => ({
        ...column,
      }));
    } else {
      return [];
    }
  };

  // const columns = getColumns();
  const columns =
    selectedLabel && recommendationTypes.includes(selectedLabel)
      ? getRecommendationListColumns(selectedReturnPeriod) // ✅ CALL function here
      : getColumns();

  console.log(columns, selectedLabel);
  // const columns = MutualFundList;

  const getReturnValue = (fund: any) => {
    const periodKeyMap: any = {
      oneWeek: fund.oneWeek,
      oneMonth: fund.oneMonth,
      threeMonth: fund.threeMonth,
      sixMonth: fund.sixMonth,
      oneYear: fund.oneYear,
      threeYear: fund.threeYear,
      fiveYear: fund.fiveYear,
    };
    return parseFloat(periodKeyMap[selectedReturnPeriod]) || 0;
  };

  const sortedFunds =
    selectedLabel && recommendationTypes.includes(selectedLabel)
      ? [...rows].sort(
          (a: any, b: any) => getReturnValue(b) - getReturnValue(a)
        ) // ✅ Descending
      : rows;

  return (
    <>
      <MutualFundModal
        isOpen={open}
        toggle={toggle}
        modalType="redeem"
        // onOrderSuccess={onOrderSuccess}
        // onBack={onBack}
      />{" "}
      {recommendationTypes.includes(selectedLabel || "") && (
        <Box
          sx={{
            display: "flex",
            gap: 1,
            mb: 2,
            justifyContent: "flex-end", // ✅ Move alignment here
          }}
        >
          {returnPeriods.map((period) => (
            <Button
              key={period.value}
              variant={
                selectedReturnPeriod === period.value ? "contained" : "outlined"
              }
              size="small"
              sx={{
                textTransform: "none",
                borderRadius: "20px",
                fontSize: "11px",
                padding: "4px 10px",
                minWidth: "50px",
              }}
              onClick={() => setSelectedReturnPeriod(period.value)} // set correct value
            >
              {period.label}
            </Button>
          ))}
        </Box>
      )}
      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={sortedFunds}
          columns={columns}
          // pageSizeOptions={[5]}
          disableRowSelectionOnClick
          onRowClick={handleRowClick}
          rowHeight={40}
          localeText={{ noRowsLabel: "No Records!" }}
          sx={{
            "& .MuiDataGrid-columnHeader": {
              fontSize: "13px",
              backgroundColor: "#11395C",
              color: "white",
            },
            "& .MuiDataGrid-cell": {
              fontSize: "12px",
              display: "flex",
              alignItems: "center",
            },
            "& .MuiDataGrid-row": {
              cursor: "pointer",
            },
          }}
        />
      </Box>
    </>
  );
};

export default MutualFundTable;
