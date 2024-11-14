import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Pagination from "@mui/material/Pagination";
import "./style.css";
import SearchAppBar from "../SearchBar";

interface DormantClientProps {
  tableData?: any[];
  totalRecords?: any;
  dynamicHeader: GridColDef[];
  initialPage?: number; // This can be used if you want to set a default value in case page is not passed.
  page?: number; // Make sure to receive this as a required prop
  pageSize?: number; // Make sure to receive this as a required prop
  onPageChange?: (event: React.ChangeEvent<unknown>, page: number) => void;
  handleSearchBasedOnInput?: (value: string) => void;
  handleSearchUser?: () => void;
  showSearch?: any;
}

const DataTable: React.FC<DormantClientProps> = ({
  tableData = [],
  totalRecords = 0,
  dynamicHeader,
  page = 0, // Use the page prop directly
  pageSize = 25, // Use the pageSize prop directly
  onPageChange,
  handleSearchBasedOnInput,
  handleSearchUser,
  showSearch = false,
}) => {
  // Calculate the rows to display based on current page and page size
  // const rows = React.useMemo(
  //   () =>
  //     tableData
  //       .slice((page - 1) * pageSize, page * pageSize)
  //       .map((item, index) => {
  //         let row: { [key: string]: any } = {
  //           id: (page - 1) * pageSize + index + 1, // Set unique row id
  //         };

  //         dynamicHeader.forEach((header) => {
  //           const field = header.field;
  //           row[field] = item[field] ?? ""; // Assign field or default to empty string
  //         });

  //         // Add extra fields from item that aren’t part of dynamicHeader
  //         Object.keys(item).forEach((key) => {
  //           if (!(key in row)) {
  //             row[key] = item[key];
  //           }
  //         });

  //         return row;
  //       }),
  //   [tableData, page, pageSize, dynamicHeader] // Ensure all dependencies are here
  // );

  React.useEffect(() => {
    console.log("tableData", tableData);
  }, [tableData]);

  // Handle page change
  const handlePaginationChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    console.log("clickedValue", value);
    if (onPageChange) {
      onPageChange(event, value);
    }
  };

  const handleSearchChange = (query: string) => {
    handleSearchBasedOnInput?.(query);
  };

  return (
    <>
      {showSearch && (
        <SearchAppBar
          onSearchChange={handleSearchChange}
          handleSearchUser={handleSearchUser}
        />
      )}
      <Paper
        sx={{
          height: 450,
          width: "100%",
          overflowX: "auto",
          fontFamily: "Public Sans, sans-serif",
        }}
      >
        <DataGrid
          rows={tableData}
          columns={dynamicHeader}
          hideFooterPagination
          rowHeight={30}
          getRowId={(row: any) =>
            row.clientName ? row.clientName : row.alertSequenceNo
          }
          // getRowId={(row: any) => console.log("row", row.TransactionDate)}
          sx={{
            border: 0,
            fontFamily: '"Public Sans", sans-serif',
            "& .MuiDataGrid-columnHeader": {
              fontWeight: 500,
              fontSize: "12px",
            },
            "& .MuiDataGrid-cell": {
              fontFamily: '"Public Sans", sans-serif',
              fontSize: "10px",
            },
          }}
        />
      </Paper>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 0",
        }}
      >
        {totalRecords > 0 && (
          <div
            style={{ fontSize: "13px" }}
          >{`Total ${totalRecords} records available`}</div>
        )}
        <Pagination
          count={Math.ceil(totalRecords / pageSize)}
          page={page}
          onChange={handlePaginationChange}
          color="primary"
          sx={{ display: "flex" }}
        />
      </div>
    </>
  );
};

export default DataTable;
