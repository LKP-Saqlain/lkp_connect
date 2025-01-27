import { GridColDef } from "@mui/x-data-grid";
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
  {
    disableColumnMenu: true,
    field: "ClientCode",
    headerName: "Client Code",
    flex: 1,
  },
  {
    disableColumnMenu: true,
    field: "ClientName",
    headerName: "Client Name",
    flex: 2,
  },
  {
    field: "LastTradeDate",
    headerClassName: "header-wrap-custom",
    headerName: "Last Trade Date",
    flex: 1,
    disableColumnMenu: true,
    align: "center",
  },
  {
    field: "ClientStatus",
    headerName: "Status",
    flex: 0.8,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
  },
  {
    field: "BranchCode",
    headerName: "BR Code",
    flex: 0.8,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
  },
  {
    field: "ActivationDate",
    headerName: "Activation Date",
    headerClassName: "header-wrap-custom",
    // flex: 1,
    width: 110,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
  },
  // { field: "MobileNo", headerName: "Mobile No", width: 120 },
  {
    field: "MobileNo",
    headerName: "Mobile No",
    width: 110,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
    renderCell: (params: any) => {
      const mobile = params.value || ""; // Extract the mobile number

      // Mask all digits except the first 2 and the last 2
      const maskedMobile = mobile.replace(
        /^(\d{2})(\d+)(\d{2})$/,
        (_: any, prefix: any, middle: any, suffix: any) => {
          console.log(prefix, suffix, handleViewDetails); // Added only for testing purpose
          return `${prefix}${"X".repeat(middle.length)}${suffix}`;
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
  {
    field: "MTFStatus",
    headerName: "MTF Status",
    flex: 1,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
  },
  {
    field: "POAStatus",
    headerName: "POA Status",
    flex: 1,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
  },
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
  {
    field: "ctermcode",
    headerName: "Client Code",
    flex: 2,
    disableColumnMenu: true,
  },
  {
    field: "clientName",
    headerName: "Client Name",
    flex: 2,
    disableColumnMenu: true,
  },
  {
    field: "lastTradeDate",
    headerName: "Last Trade Date",
    flex: 2,
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
  },
  {
    field: "dayCount",
    headerName: "Days to Dormant",
    flex: 2,
    align: "right",
    disableColumnMenu: true,
  },
  {
    field: "mobileNo",
    headerName: "Mobile No",
    flex: 2,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    renderCell: (params: any) => {
      const mobile = params.value || ""; // Extract the mobile number

      // Mask all digits except the first 2 and the last 2
      const maskedMobile = mobile.replace(
        /^(\d{2})(\d+)(\d{2})$/,
        (_: any, prefix: any, middle: any, suffix: any) => {
          console.log(prefix, suffix, handleViewDetails); // Added only for testing purpose
          return `${prefix}${"X".repeat(middle.length)}${suffix}`;
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
