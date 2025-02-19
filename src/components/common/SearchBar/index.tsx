import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
// import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import { Button as ReactstrapButton } from "reactstrap";
// import { Button as MUIButton } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { Typography } from "@mui/material";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "200px",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "220px",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "18ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

interface SearchAppBarProps {
  onSearchChange: (query: string) => void;
  handleSearchUser?: () => void;
  searchTableValue?: any;
  showExcel?: any;
  handleExcelDownload?: () => void;
  selectedWidget?: any;
  onFilterChange?: (filter: string) => void;
  totalCount?: any;
  activeClient?: any;
  inactiveClient?: any;
  totalLedgerDebitAmt?: any;
  activeSubItem?: any;
  dormantCount?: any;
}

const SearchAppBar: React.FC<SearchAppBarProps> = ({
  onSearchChange,
  handleSearchUser,
  searchTableValue,
  handleExcelDownload,
  selectedWidget,
  // onFilterChange,
  showExcel,
  totalCount,
  activeClient,
  inactiveClient,
  totalLedgerDebitAmt,
  activeSubItem,
  dormantCount,
}) => {
  const [searchValue, setSearchValue] = React.useState(searchTableValue);
  // const [selectedButton, setSelectedButton] = React.useState<string>("ALL");

  // const selectedStyle = {
  //   bgcolor: "#11395C",
  //   color: "#fff",
  //   borderRadius: "7px",
  //   fontFamily: "Poppins",
  //   borderColor: "#ABC4DA",
  //   textTransform: "capitalize",
  // };

  // const nonSelectedStyle = {
  //   bgcolor: "#ABC4DA",
  //   color: "#11395C",
  //   borderRadius: "7px",
  //   fontFamily: "Poppins",
  //   borderColor: "#ABC4DA",
  //   textTransform: "capitalize",
  // };

  console.log(totalLedgerDebitAmt);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    onSearchChange(value); // Pass the value to the parent component
  };
  // const handleSearchClick = () => {
  //   handleSearchUser?.();
  // };
  const handleBlur = () => {
    handleSearchUser?.(); // Call the search function when input loses focus
  };

  // const handleFilterClick = (filter: string) => {
  //   console.log("filterValues", filter);
  //   setSelectedButton(filter); // Update the local state to highlight the button
  //   onFilterChange?.(filter); // Call the parent function with the selected filter
  // };

  React.useEffect(() => {
    console.log("tes1121t", selectedWidget, activeSubItem);
    setSearchValue("");
  }, [selectedWidget, activeSubItem]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between", // Align search and buttons on opposite ends
        alignItems: "center", // Vertically align elements
        flexWrap: "wrap", // Ensure proper alignment on small screens
        paddingBottom: "10px",
      }}
    >
      {/* Search Bar */}
      {/* {selectedWidget && ( */}
      <Search sx={{ border: "1px solid #11395C" }}>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          value={searchValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          placeholder="Search Client Name"
          inputProps={{ "aria-label": "search" }}
        />
      </Search>
      {/* )} */}

      {/* Buttons (Excel and Filters) */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {/* Excel Button */}
        {selectedWidget !== "Upcoming Dormant Client" && showExcel && (
          <ReactstrapButton
            className="btn-font"
            style={{
              backgroundColor: "#11395C",
              color: "#fff",
              borderRadius: "7px",
              fontFamily: "Public Sans",
              borderColor: "#ABC4DA",
              textTransform: "capitalize",
              marginLeft: "10px",
            }}
            onClick={handleExcelDownload}
            type="button"
          >
            Excel
            <DownloadIcon />
          </ReactstrapButton>
        )}
        {[
          "Total Clients",
          "Active Clients",
          "Inactive Clients",
          "Upcoming Dormant Client",
          "Dormant Client",
        ].includes(selectedWidget) &&
          selectedWidget !== "DP Debit Recovery" && (
            <Box sx={{ mr: 2 }}>
              <Typography>{`Record Count - ${new Intl.NumberFormat(
                "en-IN"
              ).format(
                Math.round(
                  selectedWidget === "Total Clients"
                    ? totalCount
                    : selectedWidget === "Active Clients"
                    ? activeClient
                    : selectedWidget === "Inactive Clients"
                    ? inactiveClient
                    : selectedWidget === "Upcoming Dormant Client"
                    ? dormantCount
                    : ""
                )
              )}`}</Typography>
            </Box>
          )}

        {activeSubItem === "DP Debit Recovery" && (
          <Typography>
            {" "}
            {`Total Due Amount - ₹${new Intl.NumberFormat("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(totalLedgerDebitAmt)}`}
          </Typography>
        )}

        {/* Filter Buttons */}
        {/* {selectedWidget === "Upcoming Dormant Client" && (
          <div className="d-flex gap-1">
            {["ALL", "7D", "15D", "1M"].map((filter) => (
              <MUIButton
                key={filter}
                variant="outlined"
                size="small"
                onClick={() => handleFilterClick(filter)} // Call the new function
                sx={
                  selectedButton === filter ? selectedStyle : nonSelectedStyle
                }
              >
                {filter}
              </MUIButton>
            ))}
          </div>
        )} */}
      </Box>
    </Box>
  );
};

export default SearchAppBar;
