import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import {
  MutualFundOrder,
  OrderTransaction,
  OrderOngoingSip,
  OrderUpcomingSip,
  MfPortfolio,
} from "../../../../helper/tableColumns";
import { MutualFundProps } from "../../../../pages/MutualFund/mfTypes";
import { Button } from "@mui/material";
import MutualFundModal from "../MfModal";
import { useState } from "react";

const MutualFundTable = ({ rows, selectedLabel }: MutualFundProps) => {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen(!open);

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
                    minWidth: "90px", // optional for consistent button width
                  }}
                  onClick={toggle}
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
                    minWidth: "90px", // optional for consistent button width
                    "&:hover": {
                      backgroundColor: "#08306b",
                    },
                  }}
                >
                  Invest More
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
    } else if (selectedLabel === "MutualFundOrder") {
      return MutualFundOrder.map((column) => ({
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
          }}
        />
      </Box>
    </>
  );
};

export default MutualFundTable;
