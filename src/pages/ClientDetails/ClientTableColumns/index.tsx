import { GridColDef } from "@mui/x-data-grid";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
// import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { FaUserPen } from "react-icons/fa6";

interface ClientRow {
  ClientCode: string;
  ClientName: string;
  LastTradeDate: string;
  ClientStatus: string;
  // Add other fields as necessary
}

export const getClientActivityStatusColumns = (
  handleViewDetails: (row: ClientRow) => void
): GridColDef[] => [
  { field: "ClientCode", headerName: "Client Code", width: 90 },
  { field: "ClientName", headerName: "Client Name", width: 180 },
  { field: "LastTradeDate", headerName: "Last TR Date", width: 100 },
  { field: "ClientStatus", headerName: "Status", width: 80 },
  { field: "BranchCode", headerName: "BR Code", width: 80 },
  { field: "ActivationDate", headerName: "Activation Date", width: 120 },
  // { field: "MobileNo", headerName: "Mobile No", width: 120 },
  {
    field: "MobileNo",
    headerName: "Mobile No",
    width: 90,
    renderCell: (params: any) => {
      const mobile = params.value || ""; // Extract the mobile number
      // Mask all except first 2 digits
      const maskedMobile = mobile.replace(
        /^(\d{2})(\d+)/,
        (_: any, prefix: any, rest: any) => {
          console.log(prefix); //addded only for testing purpose
          // return `${prefix}${"X".repeat(rest.length)}`;
          return `${"X".repeat(rest.length)}`;
        }
      );

      // Return tooltip with the masked mobile number
      return (
        <Tooltip title={mobile} arrow placement="top">
          <span style={{ cursor: "pointer" }}>{maskedMobile}</span>
        </Tooltip>
      );
    },
  },
  { field: "MTFStatus", headerName: "MTF Status", width: 90 },
  { field: "POAStatus", headerName: "POA Status", width: 90 },
  {
    field: "viewDetails",
    headerName: "Action",
    width: 100,
    sortable: false, // Disable sorting if desired
    filterable: false, // Disable filtering if desired
    align: "center",
    renderCell: (params: any) => (
      // <Button
      //   onClick={() => handleViewDetails(params.row)} // Pass the row to the handler
      //   variant="contained"
      //   color="primary"
      //   style={{
      //     padding: "2px 9px",
      //     backgroundColor: "#11395C",
      //     fontSize: "9px",
      //     borderRadius: "10px",
      //     textTransform: "capitalize",
      //     fontFamily: "Public Sans",
      //   }}
      // >
      // <PersonAddIcon
      //   onClick={() => handleViewDetails(params.row)}
      //   style={{ color: "#11395C", cursor: "pointer" }}
      // />
      <FaUserPen
        onClick={() => handleViewDetails(params.row)}
        style={{ color: "#11395C", fontSize: "22px", cursor: "pointer" }}
      />
    ),
  },
];

export const getClientDormantStatus = (
  handleViewDetails: (row: ClientRow) => void
): GridColDef[] => [
  { field: "ClientCode", headerName: "Client Code", width: 218 },
  { field: "ClientName", headerName: "Client Name", width: 218 },
  { field: "LastTradeDate", headerName: "Last Trade Date", width: 218 },
  {
    field: "ClientNotTradedSince",
    headerName: "Client not traded since",
    width: 218,
  },
  {
    field: "Please Select",
    headerName: "Please Select",
    width: 218,
    renderHeader: () => {
      return (
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-standard-label">
            Select Duration
          </InputLabel>
          <Select
            sx={{ width: "300px" }}
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            value={""}
            onChange={(e) => alert(e.target.value)}
            // label="Age"
          >
            <MenuItem value={7}>7days</MenuItem>
            <MenuItem value={15}>15days</MenuItem>
            <MenuItem value={30}>1Month</MenuItem>
            <MenuItem value={90}>3Month</MenuItem>
            <MenuItem value={180}>6Month</MenuItem>
            <MenuItem value={330}>11Month</MenuItem>
            <MenuItem value={360}>12Month</MenuItem>
          </Select>
        </FormControl>
      );
    },
  },
  {
    field: "viewDetails",
    headerName: "Action",
    width: 150,
    renderCell: (params: any) => (
      <Button
        onClick={() => handleViewDetails(params.row)}
        // onClick={() => console.log("rowValues", params.row)}
        variant="contained"
        color="primary"
        style={{
          padding: "2px 9px",
          backgroundColor: "#11395C",
          fontSize: "10px",
          borderRadius: "10px",
          textTransform: "capitalize",
          fontFamily: "Public Sans",
        }}
      >
        View Details
      </Button>
    ),
  },
];
