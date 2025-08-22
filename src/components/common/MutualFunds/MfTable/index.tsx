import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { MutualFundList } from "../../../../helper/tableColumns";

function MutualFundTable({ rows }: any) {
  //  const getColumns = () => {
  //     if (selectedWidget === "Clients With Ledger Balance") {
  //       return MutualFundList.map((column) => ({
  //         ...column,
  //         // sortable: false,
  //         // filterable: false,
  //       }));
  //     }
  // const columns = getColumns();
  const columns = MutualFundList;
  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
      />
    </Box>
  );
}

export default MutualFundTable;
