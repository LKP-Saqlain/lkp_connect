import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Pagination from "@mui/material/Pagination";
import "./style.css";

interface DormantClient {
  tableData?: any[];
  totalRecords?: any;
  dynamicHeader: GridColDef[];
  handlePageChange?: (event: React.ChangeEvent<unknown>, value: number) => void;
}

export default function DataTable({
  tableData = [],
  totalRecords,
  dynamicHeader,
  handlePageChange,
}: DormantClient) {
  const [page, setPage] = React.useState(1);
  const pageSize = 10; // Define page size
  const totalRows = tableData.length; // Total number of rows

  // Calculate the rows to display based on current page
  // const rows = tableData
  //   .slice((page - 1) * pageSize, page * pageSize)
  //   .map((item, index) => ({
  //     id: (page - 1) * pageSize + index + 1, // Correct the id based on the page
  //     clientCode: item.ctermcode ? item.ctermcode : item.accountcode,
  //     clientName: item.clientName,
  //     broFY2223: item.brokerageGeneratedinFY2223,
  //     broFY2324: item.brokerageGeneratedinFY2324,
  //     active: item.active,
  //     lastTradeDate: item.lastTradeDate,
  //     rmName: item.rmname ? item.rmname : item.rm,
  //     rmStatus: item.rmstatus,
  //     dealerName: item.dealerName,
  //     dealerStatus: item.dealerSTATUS,
  //     branchCode: item.branchcode,
  //     zone: item.zone,
  //     branchType: item.branchtype,
  //     activationDate: item.activationDate,
  //     mobileNo: item.mobileNo,
  //     email: item.email,
  //     broFY1920: item.brokerageGeneratedinFY1920,
  //     broFY2021: item.brokerageGeneratedinFY2021,
  //     broFY1922: item.brokerageGeneratedinFY2122,
  //   }));

  // Calculate the rows to display based on current page
  const rows = tableData
    .slice((page - 1) * pageSize, page * pageSize)
    .map((item, index) => {
      // Define row as an indexable object with string keys
      let row: { [key: string]: any } = {
        id: (page - 1) * pageSize + index + 1, // Add unique row id
      };
      // Loop through all headers in dynamicHeader and assign the corresponding field from item
      dynamicHeader.forEach((header) => {
        const field = header.field; // Field name from header
        row[field] = field in item ? item[field] : ""; // Check if field exists in item, otherwise fallback to empty string
      });

      // Optionally: Add any additional fields that are not part of dynamicHeader
      Object.keys(item).forEach((key) => {
        if (!row[key]) {
          row[key] = item[key]; // Add extra fields that are not in dynamicHeader
        }
      });

      return row;
    });

  // Handle page change
  // const handlePageChange = (
  //   event: React.ChangeEvent<unknown>,
  //   value: number
  // ) => {
  //   setPage(value);
  // };
  React.useEffect(() => {
    console.log("records", totalRecords, tableData);
  }, [totalRecords, tableData]);
  return (
    <>
      <Paper
        sx={{
          height: 450,
          width: "100%",
          overflowX: "auto",
          fontFamily: "Public Sans, sans-serif",
        }}
      >
        <DataGrid
          rows={rows}
          columns={dynamicHeader}
          //   pageSize={pageSize} // Set the page size
          hideFooterPagination // Hide the default pagination
          sx={{
            border: 0,
            fontFamily: '"Public Sans", sans-serif',
            "& .MuiDataGrid-columnHeader": {
              fontWeight: 500,
              fontSize: "15px",
            },
            "& .MuiDataGrid-cell": {
              fontFamily: '"Public Sans", sans-serif',
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
        {totalRecords && totalRecords !== null && (
          <div>{`Total ${totalRecords} records available`}</div>
        )}
        <Pagination
          count={Math.ceil(totalRecords / pageSize)}
          page={page}
          onChange={handlePageChange}
          color="primary"
          sx={{ display: "flex" }}
        />
      </div>
    </>
  );
}
