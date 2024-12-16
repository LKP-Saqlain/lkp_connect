import { GridColDef } from "@mui/x-data-grid";
import Tooltip from "@mui/material/Tooltip";
// import PersonAddIcon from "@mui/icons-material/PersonAdd";
// import { FaUserPen } from "react-icons/fa6";

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
  { field: "ClientName", headerName: "Client Name", width: 200 },
  { field: "LastTradeDate", headerName: "Last TR Date", width: 100 },
  { field: "ClientStatus", headerName: "Status", width: 110 },
  { field: "BranchCode", headerName: "BR Code", width: 80 },
  { field: "ActivationDate", headerName: "Activation Date", width: 120 },
  // { field: "MobileNo", headerName: "Mobile No", width: 120 },
  {
    field: "MobileNo",
    headerName: "Mobile No",
    width: 120,
    renderCell: (params: any) => {
      const mobile = params.value || ""; // Extract the mobile number
      // Mask all except first 2 digits
      const maskedMobile = mobile.replace(
        /^(\d{2})(\d+)/,
        (_: any, prefix: any, rest: any) => {
          console.log(prefix); //addded only for testing purpose
          // return `${prefix}${"X".repeat(rest.length)}`;
          console.log(handleViewDetails);

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
  { field: "MTFStatus", headerName: "MTF Status", width: 120 },
  { field: "POAStatus", headerName: "POA Status", width: 120 },
  // {
  //   field: "viewDetails",
  //   headerName: "Action",
  //   width: 100,
  //   sortable: false, // Disable sorting if desired
  //   filterable: false, // Disable filtering if desired
  //   align: "center",
  //   renderCell: (params: any) => (
  //     // <Button
  //     //   onClick={() => handleViewDetails(params.row)} // Pass the row to the handler
  //     //   variant="contained"
  //     //   color="primary"
  //     //   style={{
  //     //     padding: "2px 9px",
  //     //     backgroundColor: "#11395C",
  //     //     fontSize: "9px",
  //     //     borderRadius: "10px",
  //     //     textTransform: "capitalize",
  //     //     fontFamily: "Public Sans",
  //     //   }}
  //     // >
  //     // <PersonAddIcon
  //     //   onClick={() => handleViewDetails(params.row)}
  //     //   style={{ color: "#11395C", cursor: "pointer" }}
  //     // />
  //     <FaUserPen
  //       onClick={() => handleViewDetails(params.row)}
  //       style={{ color: "#11395C", fontSize: "22px", cursor: "pointer" }}
  //     />
  //   ),
  // },
];

export const getClientDormantStatus = (
  handleViewDetails: (row: ClientRow) => void
): GridColDef[] => [
  { field: "ctermcode", headerName: "Client Code", width: 200 },
  { field: "clientName", headerName: "Client Name", width: 200 },
  { field: "lastTradeDate", headerName: "Last Trade Date", width: 200 },
  {
    field: "dayCount",
    headerName: "Days to Dormant",
    width: 200,
    align: "right",
  },
  {
    field: "mobileNo",
    headerName: "Mobile No",
    width: 200,
    headerAlign: "center",
    align: "center",
    renderCell: (params: any) => {
      const mobile = params.value || ""; // Extract the mobile number
      // Mask all except first 2 digits
      const maskedMobile = mobile.replace(
        /^(\d{2})(\d+)/,
        (_: any, prefix: any, rest: any) => {
          console.log(prefix); //addded only for testing purpose
          // return `${prefix}${"X".repeat(rest.length)}`;
          console.log(handleViewDetails);

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
  // {
  //   field: "viewDetails",
  //   headerName: "Action",
  //   width: 150,
  //   renderCell: (params: any) => (
  //     <Button
  //       onClick={() => handleViewDetails(params.row)}
  //       // onClick={() => console.log("rowValues", params.row)}
  //       variant="contained"
  //       color="primary"
  //       style={{
  //         padding: "2px 9px",
  //         backgroundColor: "#11395C",
  //         fontSize: "10px",
  //         borderRadius: "10px",
  //         textTransform: "capitalize",
  //         fontFamily: "Public Sans",
  //       }}
  //     >
  //       View Details
  //     </Button>
  //   ),
  // },
];
