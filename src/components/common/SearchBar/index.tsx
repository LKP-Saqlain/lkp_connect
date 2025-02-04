import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
// import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import { Button as ReactstrapButton } from "reactstrap";
// import { Button as MUIButton } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

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
}

const SearchAppBar: React.FC<SearchAppBarProps> = ({
  onSearchChange,
  handleSearchUser,
  searchTableValue,
  handleExcelDownload,
  selectedWidget,
  // onFilterChange,
  showExcel,
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

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-start", // Align search and buttons on opposite ends
        alignItems: "center", // Vertically align elements
        flexWrap: "wrap", // Ensure proper alignment on small screens
        paddingBottom: "10px",
      }}
    >
      {/* Search Bar */}
      {![
        "Client Approaching  Dormant Status",
        "Active Clients",
        "Inactive Clients",
      ].includes(selectedWidget) && (
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
      )}

      {/* Buttons (Excel and Filters) */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {/* Excel Button */}
        {selectedWidget !== "Client Approaching  Dormant Status" &&
          showExcel && (
            <ReactstrapButton
              className="btn-font"
              style={{
                backgroundColor: "#11395C",
                color: "#fff",
                borderRadius: "7px",
                fontFamily: "Public Sans",
                borderColor: "#ABC4DA",
                textTransform: "capitalize",
                marginLeft:"10px"
              }}
              onClick={handleExcelDownload}
              type="button"
            >
              Excel
              <DownloadIcon />
            </ReactstrapButton>
          )}

        {/* Filter Buttons */}
        {/* {selectedWidget === "Client Approaching  Dormant Status" && (
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
