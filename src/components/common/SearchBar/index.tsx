import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
// import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import { Button } from "reactstrap";
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
}

const SearchAppBar: React.FC<SearchAppBarProps> = ({
  onSearchChange,
  handleSearchUser,
  searchTableValue,
  handleExcelDownload,
}) => {
  const [searchValue, setSearchValue] = React.useState(searchTableValue);

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

  return (
    <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "space-between" }}>
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
      {/* <Button
        variant="outlined"
        className="btn-font"
        sx={{
          bgcolor: "#11395C",
          color: "#fff",
          borderRadius: "7px",
          fontFamily: "Public Sans",
          borderColor: "#ABC4DA",
          textTransform: "capitalize",
          ml: 1,
        }}
        onClick={handleSearchClick}
      >
        Search
      </Button> */}
      <Button
        className="btn-font"
        style={{
          backgroundColor: "#11395C",
          height: "40px",
        }}
        onClick={handleExcelDownload}
        type="button"
      >
        Excel
        <DownloadIcon />
      </Button>
    </Box>
  );
};

export default SearchAppBar;
