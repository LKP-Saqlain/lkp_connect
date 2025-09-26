import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import {
  OrderTransaction,
  OrderOngoingSip,
  OrderUpcomingSip,
  MfPortfolio,
  MandateColumns,
  RecommendationList,
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
}: MutualFundProps) => {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen(!open);

  const handleRowClick = (params: any) => {
    if (onSelectFund) {
      onSelectFund(params.row.schemeCode.toString());
    }
    console.log(params.row.schemeCode, "params.row.schemeCode");
  };

  const getColumns = () => {
    // You can customize columns based on selectedLabel here
    const recommendationTypes = [
      "High Returns",
      "Tax Savings",
      "SIP with 100",
      "SIP with 500",
    ];
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
                    minWidth: "90px", // optional for consistent button width
                  }}
                  // onClick={toggle}
                  onClick={() => {
                    if (onRedeemClick) {
                      onRedeemClick(_params.row); // ✅ send row to parent
                      // handleRedeem(_params);
                    }
                  }}
                >
                  Redeem
                </Button>

                {/* <Button
                  variant="contained"
                  size="small"
                  sx={{
                    backgroundColor: "#11395C",
                    textTransform: "none",
                    fontWeight: 500,
                    borderRadius: 5,
                    minWidth: "90px", // optional for consistent button width
                    "&:hover": {
                      backgroundColor: "#08306b",
                    },
                  }}
                  onClick={(e) => handleInvestMoreClick(_params, e)}
                >
                  Invest More
                </Button> */}
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
      return RecommendationList.map((column) => ({
        ...column,
      }));
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

  const columns = getColumns();
  console.log(columns, selectedLabel);
  // const columns = MutualFundList;
  return (
    <>
      <MutualFundModal isOpen={open} toggle={toggle} modalType="redeem" />
      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          // pageSizeOptions={[5]}
          disableRowSelectionOnClick
          onRowClick={handleRowClick}
          rowHeight={40}
          localeText={{ noRowsLabel: "No Records!" }}
          sx={{
            "& .MuiDataGrid-columnHeader": {
              fontSize: "12px",
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
