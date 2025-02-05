import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Pagination from "@mui/material/Pagination";
import "./style.css";
import SearchAppBar from "../SearchBar";
import useMediaQuery from "@mui/material/useMediaQuery";

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
  showExcel?: any;
  handleExcelDownload?: () => void;
  customFlag?: any;
  customPageSize?: any;
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
  handleExcelDownload,
  showExcel,
  customFlag,
  customPageSize,
}) => {
  const isMobile = useMediaQuery("(max-width:600px)");

  const paginationStyles = {
    display: "flex",
    justifyContent: isMobile ? "center" : "flex-end",
    "& .MuiPaginationItem-root": {
      backgroundColor: "white", // Change the default background color
      color: "black", // Change the text color
    },
    "& .Mui-selected": {
      backgroundColor: "#11395C", // Change background for selected item
      color: "white", // Change text color for selected item
    },
    "& .MuiPaginationItem-root:hover": {
      backgroundColor: "lightgray", // Background color on hover
    },
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN").format(value);
  };

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

  const customPage = customPageSize ? 100 : pageSize;

  return (
    <>
      {showSearch && (
        <SearchAppBar
          onSearchChange={handleSearchChange}
          handleSearchUser={handleSearchUser}
          handleExcelDownload={handleExcelDownload}
          showExcel={showExcel}
        />
      )}
      <Paper
        sx={{
          height: "70vh",
          width: "100%",
          overflowX: "auto",
          fontFamily: "Public Sans, sans-serif",
        }}
      >
        <DataGrid
        disableRowSelectionOnClick
          rows={tableData}
          columns={dynamicHeader}
          hideFooterPagination
          rowHeight={30}
          getRowId={(row: any) =>
            row.clientName
              ? row.clientName
              : row.alertSequenceNo
              ? row.alertSequenceNo
              : row.BOID
              ? row.BOID || `${row.BOName}-${row.TotalDebit}-${Math.random()}`
              : ""
          }
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? "even-row" : "odd-row"
          }
          // getRowId={(row: any) => console.log("row", row.TransactionDate)}
          sx={{
            border: 0,
            fontFamily: '"Public Sans", sans-serif',
            "& .MuiDataGrid-columnHeader": {
              backgroundColor: "#6C757D", // Set the header background color to grey
              color: "#fff", // Optionally set the text color to white for better contrast
              fontWeight: 500,
              fontSize: "12px",
            },
            "& .MuiDataGrid-cell": {
              fontFamily: '"Public Sans", sans-serif',
              fontSize: "11px",
            },
            "& .MuiDataGrid-footerContainer": {
              display: "none", // Completely hide the footer container
            },
          }}
        />
      </Paper>
      <div
        style={{
          display: "flex",
          justifyContent: isMobile ? "center" : "space-between",
          flexDirection: isMobile ? "column" : "row",
          alignItems: "center",
          padding: isMobile ? "5px 0" : "10px 0",
        }}
      >
        {totalRecords > 0 && (
          <div
            style={{
              fontSize: isMobile ? "11px" : "13px",
              marginBottom: isMobile ? "5px" : "0",
            }}
          >
            {`Total ${formatCurrency(totalRecords)} records available`}
          </div>
        )}
        {!customFlag && (
          <Pagination
            count={Math.ceil(totalRecords / customPage)}
            page={page}
            onChange={handlePaginationChange}
            color="primary"
            sx={paginationStyles}
          />
        )}
      </div>
    </>
  );
};

export default DataTable;
