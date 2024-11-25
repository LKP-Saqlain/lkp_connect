import { GridColDef } from "@mui/x-data-grid";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
} from "@mui/material";

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
  {
    field: "viewDetails",
    headerName: "Action",
    width: 100,
    sortable: false, // Disable sorting if desired
    filterable: false, // Disable filtering if desired
    renderCell: (params: any) => (
      <Button
        onClick={() => handleViewDetails(params.row)} // Pass the row to the handler
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
  { field: "ClientCode", headerName: "Client Code", width: 90 },
  { field: "ClientName", headerName: "Client Name", width: 120 },
  { field: "LastTradeDate", headerName: "Last Trade Date", width: 120 },
  { field: "ClientStatus", headerName: "Client Status", width: 100 },
  { field: "BranchCode", headerName: "Branch Code", width: 100 },
  { field: "ActivationDate", headerName: "Activation Date", width: 120 },
  { field: "EMail", headerName: "Email", width: 120 },
  { field: "MobileNo", headerName: "Mobile No", width: 120 },
  { field: "PANNO", headerName: "PAN No", width: 120 },
  { field: "MTFStatus", headerName: "MTF Status", width: 80 },
  { field: "POAStatus", headerName: "POA Status", width: 80 },
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
