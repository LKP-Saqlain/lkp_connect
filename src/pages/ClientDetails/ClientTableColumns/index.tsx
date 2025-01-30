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
interface ReferralData {
  dummyId: number,
  month: string;
  directChannelDIY: number;
  DirectSalesTeam: number;
  APReferrals: number;
  EmployeeReferrals: number;
  REChannel: number;
  Total: number;
  datatype:any
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
export const getAccountDetails: GridColDef[] = [
  {
    field: "month",
    headerName: "Month",
    flex: 1.1,
    disableColumnMenu: true,
    headerAlign: "center",

  },
  {
    field: "directChannelDIY",
    headerName: "Direct Channel (DIY)",
    flex: 1.9,
    disableColumnMenu: true,
    headerAlign: "center",
  },
  {
    field: "DirectSalesTeam",
    headerName: "Direct Sales team",
    flex: 1.7,
    disableColumnMenu: true,
    headerAlign: "center",
  },
  {
    field: "APReferrals",
    headerName: "AP Referrals",
    flex: 1.4,
    disableColumnMenu: true,
    headerAlign: "center",
  },
  {
    field: "EmployeeReferrals",
    headerName: "Employee Referrals",
    flex: 1.8,
    disableColumnMenu: true,
    headerAlign: "center",
  },
  {
    field: "REChannel",
    headerName: "R&E Channel",
    flex: 1.5,
    disableColumnMenu: true,
    headerAlign: "center",
  },
  {
    field: "Total",
    headerName: "Total",
    flex: 1,
    disableColumnMenu: true,
    headerAlign: "center",
  }
];


export const monthlyData: ReferralData[] = [
  { dummyId: 1, month: "Sep-24", directChannelDIY: 111, DirectSalesTeam: 352, APReferrals: 951, EmployeeReferrals: 15, REChannel: 25, Total: 1454, datatype: "weekly" },
  { dummyId: 2, month: "Feb-24", directChannelDIY: 105, DirectSalesTeam: 491, APReferrals: 920, EmployeeReferrals: 36, REChannel: 18, Total: 1570, datatype: "monthly" },
  { dummyId: 3, month: "Dec-24", directChannelDIY: 96, DirectSalesTeam: 381, APReferrals: 1101, EmployeeReferrals: 26, REChannel: 20, Total: 1624, datatype: "yearly" },
  { dummyId: 4, month: "May-23", directChannelDIY: 118, DirectSalesTeam: 289, APReferrals: 1135, EmployeeReferrals: 19, REChannel: 22, Total: 1584, datatype: "Daily" },
  { dummyId: 5, month: "Aug-23", directChannelDIY: 87, DirectSalesTeam: 368, APReferrals: 808, EmployeeReferrals: 27, REChannel: 28, Total: 1318, datatype: "tilldate" },
  { dummyId: 6, month: "Jan-24", directChannelDIY: 97, DirectSalesTeam: 437, APReferrals: 968, EmployeeReferrals: 23, REChannel: 26, Total: 1551, datatype: "weekly" },
  { dummyId: 7, month: "Jun-23", directChannelDIY: 90, DirectSalesTeam: 475, APReferrals: 1045, EmployeeReferrals: 13, REChannel: 24, Total: 1647, datatype: "monthly" },
  { dummyId: 8, month: "Oct-23", directChannelDIY: 79, DirectSalesTeam: 406, APReferrals: 1110, EmployeeReferrals: 31, REChannel: 19, Total: 1645, datatype: "yearly" },
  { dummyId: 9, month: "Jul-24", directChannelDIY: 113, DirectSalesTeam: 444, APReferrals: 1034, EmployeeReferrals: 29, REChannel: 21, Total: 1641, datatype: "Daily" },
  { dummyId: 10, month: "Mar-24", directChannelDIY: 80, DirectSalesTeam: 385, APReferrals: 1009, EmployeeReferrals: 34, REChannel: 23, Total: 1531, datatype: "tilldate" },
  { dummyId: 11, month: "May-23", directChannelDIY: 104, DirectSalesTeam: 289, APReferrals: 1004, EmployeeReferrals: 38, REChannel: 20, Total: 1455, datatype: "yearly" },
  { dummyId: 12, month: "Jan-23", directChannelDIY: 95, DirectSalesTeam: 424, APReferrals: 1127, EmployeeReferrals: 32, REChannel: 16, Total: 1694, datatype: "monthly" },
  { dummyId: 13, month: "Dec-24", directChannelDIY: 83, DirectSalesTeam: 350, APReferrals: 1013, EmployeeReferrals: 21, REChannel: 28, Total: 1495, datatype: "yearly" },
  { dummyId: 14, month: "Oct-23", directChannelDIY: 90, DirectSalesTeam: 389, APReferrals: 926, EmployeeReferrals: 17, REChannel: 29, Total: 1451, datatype: "Daily" },
  { dummyId: 15, month: "Mar-23", directChannelDIY: 105, DirectSalesTeam: 442, APReferrals: 1182, EmployeeReferrals: 25, REChannel: 20, Total: 1774, datatype: "weekly" },
  { dummyId: 16, month: "Jul-23", directChannelDIY: 80, DirectSalesTeam: 333, APReferrals: 1044, EmployeeReferrals: 15, REChannel: 27, Total: 1499, datatype: "monthly" },
  { dummyId: 17, month: "Apr-23", directChannelDIY: 120, DirectSalesTeam: 410, APReferrals: 985, EmployeeReferrals: 30, REChannel: 24, Total: 1569, datatype: "yearly" },
  { dummyId: 18, month: "Jun-23", directChannelDIY: 97, DirectSalesTeam: 475, APReferrals: 1135, EmployeeReferrals: 34, REChannel: 21, Total: 1762, datatype: "Daily" },
  { dummyId: 19, month: "Aug-23", directChannelDIY: 113, DirectSalesTeam: 421, APReferrals: 1108, EmployeeReferrals: 29, REChannel: 18, Total: 1689, datatype: "tilldate" },
  { dummyId: 20, month: "Sep-23", directChannelDIY: 90, DirectSalesTeam: 488, APReferrals: 1007, EmployeeReferrals: 26, REChannel: 22, Total: 1633, datatype: "weekly" },
  { dummyId: 21, month: "Feb-24", directChannelDIY: 81, DirectSalesTeam: 361, APReferrals: 1053, EmployeeReferrals: 27, REChannel: 24, Total: 1546, datatype: "monthly" },
  { dummyId: 22, month: "Apr-24", directChannelDIY: 115, DirectSalesTeam: 453, APReferrals: 1127, EmployeeReferrals: 29, REChannel: 22, Total: 1746, datatype: "yearly" },
  { dummyId: 23, month: "Jul-24", directChannelDIY: 85, DirectSalesTeam: 378, APReferrals: 1067, EmployeeReferrals: 17, REChannel: 25, Total: 1572, datatype: "Daily" },
  { dummyId: 24, month: "Nov-23", directChannelDIY: 104, DirectSalesTeam: 352, APReferrals: 975, EmployeeReferrals: 31, REChannel: 16, Total: 1578, datatype: "tilldate" },
  { dummyId: 25, month: "Aug-23", directChannelDIY: 94, DirectSalesTeam: 390, APReferrals: 1052, EmployeeReferrals: 27, REChannel: 28, Total: 1591, datatype: "weekly" },
  { dummyId: 26, month: "Mar-24", directChannelDIY: 110, DirectSalesTeam: 397, APReferrals: 1164, EmployeeReferrals: 32, REChannel: 22, Total: 1725, datatype: "monthly" },
  { dummyId: 27, month: "Sep-24", directChannelDIY: 108, DirectSalesTeam: 388, APReferrals: 952, EmployeeReferrals: 22, REChannel: 19, Total: 1589, datatype: "yearly" },
  { dummyId: 28, month: "Oct-23", directChannelDIY: 91, DirectSalesTeam: 434, APReferrals: 1098, EmployeeReferrals: 33, REChannel: 21, Total: 1677, datatype: "Daily" },
  { dummyId: 29, month: "Nov-23", directChannelDIY: 104, DirectSalesTeam: 398, APReferrals: 1152, EmployeeReferrals: 27, REChannel: 24, Total: 1705, datatype: "tilldate" },
  { dummyId: 30, month: "Jun-23", directChannelDIY: 89, DirectSalesTeam: 485, APReferrals: 1145, EmployeeReferrals: 29, REChannel: 19, Total: 1767, datatype: "weekly" },
  { dummyId: 31, month: "Feb-23", directChannelDIY: 102, DirectSalesTeam: 418, APReferrals: 1087, EmployeeReferrals: 28, REChannel: 20, Total: 1655, datatype: "monthly" },
  { dummyId: 32, month: "Jan-24", directChannelDIY: 115, DirectSalesTeam: 405, APReferrals: 1110, EmployeeReferrals: 26, REChannel: 23, Total: 1679, datatype: "yearly" },
  { dummyId: 33, month: "May-23", directChannelDIY: 97, DirectSalesTeam: 361, APReferrals: 1023, EmployeeReferrals: 29, REChannel: 28, Total: 1638, datatype: "Daily" },
  { dummyId: 34, month: "Apr-24", directChannelDIY: 110, DirectSalesTeam: 350, APReferrals: 1101, EmployeeReferrals: 34, REChannel: 21, Total: 1616, datatype: "tilldate" },
  { dummyId: 35, month: "Dec-23", directChannelDIY: 98, DirectSalesTeam: 366, APReferrals: 1065, EmployeeReferrals: 33, REChannel: 20, Total: 1582, datatype: "weekly" },
  { dummyId: 36, month: "Mar-24", directChannelDIY: 92, DirectSalesTeam: 413, APReferrals: 1056, EmployeeReferrals: 27, REChannel: 28, Total: 1616, datatype: "monthly" },
  { dummyId: 37, month: "Jul-23", directChannelDIY: 109, DirectSalesTeam: 424, APReferrals: 1076, EmployeeReferrals: 21, REChannel: 19, Total: 1649, datatype: "yearly" },
  { dummyId: 38, month: "Sep-24", directChannelDIY: 95, DirectSalesTeam: 471, APReferrals: 1123, EmployeeReferrals: 27, REChannel: 22, Total: 1738, datatype: "Daily" },
  { dummyId: 39, month: "May-24", directChannelDIY: 109, DirectSalesTeam: 425, APReferrals: 1128, EmployeeReferrals: 23, REChannel: 25, Total: 1710, datatype: "tilldate" },
  { dummyId: 40, month: "Nov-23", directChannelDIY: 94, DirectSalesTeam: 433, APReferrals: 980, EmployeeReferrals: 35, REChannel: 19, Total: 1561, datatype: "weekly" },
  { dummyId: 41, month: "Oct-24", directChannelDIY: 111, DirectSalesTeam: 411, APReferrals: 1065, EmployeeReferrals: 24, REChannel: 28, Total: 1739, datatype: "monthly" },
  { dummyId: 42, month: "Aug-23", directChannelDIY: 116, DirectSalesTeam: 402, APReferrals: 1102, EmployeeReferrals: 20, REChannel: 21, Total: 1641, datatype: "yearly" },
  { dummyId: 43, month: "Mar-24", directChannelDIY: 113, DirectSalesTeam: 366, APReferrals: 950, EmployeeReferrals: 32, REChannel: 28, Total: 1589, datatype: "Daily" },
  { dummyId: 44, month: "Sep-24", directChannelDIY: 105, DirectSalesTeam: 450, APReferrals: 1010, EmployeeReferrals: 33, REChannel: 26, Total: 1624, datatype: "tilldate" },
  { dummyId: 45, month: "Apr-23", directChannelDIY: 120, DirectSalesTeam: 389, APReferrals: 1084, EmployeeReferrals: 28, REChannel: 25, Total: 1646, datatype: "weekly" },
  { dummyId: 46, month: "May-23", directChannelDIY: 106, DirectSalesTeam: 421, APReferrals: 1019, EmployeeReferrals: 36, REChannel: 19, Total: 1681, datatype: "monthly" },
  { dummyId: 47, month: "Feb-24", directChannelDIY: 114, DirectSalesTeam: 450, APReferrals: 1089, EmployeeReferrals: 23, REChannel: 22, Total: 1698, datatype: "yearly" },
  { dummyId: 48, month: "Jan-24", directChannelDIY: 101, DirectSalesTeam: 415, APReferrals: 990, EmployeeReferrals: 34, REChannel: 27, Total: 1567, datatype: "Daily" },
  { dummyId: 49, month: "Jun-24", directChannelDIY: 106, DirectSalesTeam: 378, APReferrals: 1025, EmployeeReferrals: 35, REChannel: 29, Total: 1573, datatype: "tilldate" },
  { dummyId: 50, month: "Mar-23", directChannelDIY: 113, DirectSalesTeam: 421, APReferrals: 1157, EmployeeReferrals: 24, REChannel: 26, Total: 1741, datatype: "weekly" },
  { dummyId: 51, month: "Jul-24", directChannelDIY: 98, DirectSalesTeam: 412, APReferrals: 1100, EmployeeReferrals: 31, REChannel: 21, Total: 1662, datatype: "last7days" },
  { dummyId: 52, month: "Aug-23", directChannelDIY: 110, DirectSalesTeam: 376, APReferrals: 1120, EmployeeReferrals: 33, REChannel: 19, Total: 1758, datatype: "Daily" },
  { dummyId: 53, month: "Dec-23", directChannelDIY: 106, DirectSalesTeam: 388, APReferrals: 1082, EmployeeReferrals: 22, REChannel: 24, Total: 1622, datatype: "monthly" },
  { dummyId: 54, month: "Oct-23", directChannelDIY: 94, DirectSalesTeam: 402, APReferrals: 1130, EmployeeReferrals: 28, REChannel: 23, Total: 1677, datatype: "yearly" },
  { dummyId: 55, month: "Nov-23", directChannelDIY: 85, DirectSalesTeam: 396, APReferrals: 1056, EmployeeReferrals: 27, REChannel: 22, Total: 1590, datatype: "last7days" },
  { dummyId: 56, month: "Sep-23", directChannelDIY: 113, DirectSalesTeam: 419, APReferrals: 1077, EmployeeReferrals: 33, REChannel: 20, Total: 1762, datatype: "tilldate" },
  { dummyId: 57, month: "Jul-23", directChannelDIY: 95, DirectSalesTeam: 425, APReferrals: 1055, EmployeeReferrals: 24, REChannel: 25, Total: 1604, datatype: "last7days" },
  { dummyId: 58, month: "Apr-24", directChannelDIY: 111, DirectSalesTeam: 413, APReferrals: 1190, EmployeeReferrals: 21, REChannel: 28, Total: 1763, datatype: "weekly" },
  { dummyId: 59, month: "Feb-24", directChannelDIY: 119, DirectSalesTeam: 401, APReferrals: 1144, EmployeeReferrals: 29, REChannel: 19, Total: 1712, datatype: "Daily" },
  { dummyId: 60, month: "Oct-24", directChannelDIY: 113, DirectSalesTeam: 400, APReferrals: 1062, EmployeeReferrals: 33, REChannel: 20, Total: 1728, datatype: "last7days" },
  { dummyId: 61, month: "Jun-23", directChannelDIY: 106, DirectSalesTeam: 387, APReferrals: 1060, EmployeeReferrals: 30, REChannel: 27, Total: 1716, datatype: "monthly" },
  { dummyId: 62, month: "Jan-24", directChannelDIY: 94, DirectSalesTeam: 417, APReferrals: 1073, EmployeeReferrals: 32, REChannel: 21, Total: 1637, datatype: "yearly" },
  { dummyId: 63, month: "May-23", directChannelDIY: 101, DirectSalesTeam: 444, APReferrals: 1090, EmployeeReferrals: 25, REChannel: 22, Total: 1682, datatype: "Daily" },
  { dummyId: 64, month: "Mar-24", directChannelDIY: 108, DirectSalesTeam: 408, APReferrals: 1069, EmployeeReferrals: 28, REChannel: 23, Total: 1636, datatype: "last7days" },
  { dummyId: 65, month: "Feb-24", directChannelDIY: 110, DirectSalesTeam: 399, APReferrals: 1145, EmployeeReferrals: 26, REChannel: 22, Total: 1702, datatype: "weekly" },
  { dummyId: 66, month: "Jan-23", directChannelDIY: 94, DirectSalesTeam: 400, APReferrals: 1052, EmployeeReferrals: 33, REChannel: 20, Total: 1602, datatype: "tilldate" },
  { dummyId: 67, month: "Dec-23", directChannelDIY: 107, DirectSalesTeam: 418, APReferrals: 1125, EmployeeReferrals: 29, REChannel: 22, Total: 1701, datatype: "last7days" },
  { dummyId: 68, month: "Sep-24", directChannelDIY: 109, DirectSalesTeam: 432, APReferrals: 1080, EmployeeReferrals: 30, REChannel: 23, Total: 1742, datatype: "yearly" },
  { dummyId: 69, month: "Oct-23", directChannelDIY: 113, DirectSalesTeam: 409, APReferrals: 1161, EmployeeReferrals: 21, REChannel: 28, Total: 1732, datatype: "monthly" },
  { dummyId: 70, month: "May-24", directChannelDIY: 95, DirectSalesTeam: 389, APReferrals: 1023, EmployeeReferrals: 22, REChannel: 25, Total: 1554, datatype: "Daily" },
  { dummyId: 71, month: "Apr-23", directChannelDIY: 100, DirectSalesTeam: 421, APReferrals: 1068, EmployeeReferrals: 29, REChannel: 24, Total: 1642, datatype: "last7days" },
  { dummyId: 72, month: "Jun-23", directChannelDIY: 119, DirectSalesTeam: 421, APReferrals: 1125, EmployeeReferrals: 27, REChannel: 26, Total: 1718, datatype: "weekly" },
  { dummyId: 73, month: "Jul-24", directChannelDIY: 104, DirectSalesTeam: 426, APReferrals: 1088, EmployeeReferrals: 30, REChannel: 22, Total: 1670, datatype: "last7days" },
  { dummyId: 74, month: "May-24", directChannelDIY: 111, DirectSalesTeam: 413, APReferrals: 1155, EmployeeReferrals: 21, REChannel: 19, Total: 1713, datatype: "yearly" },
  { dummyId: 75, month: "Apr-24", directChannelDIY: 103, DirectSalesTeam: 395, APReferrals: 1132, EmployeeReferrals: 28, REChannel: 23, Total: 1681, datatype: "tilldate" },
  { dummyId: 76, month: "Mar-24", directChannelDIY: 108, DirectSalesTeam: 398, APReferrals: 1062, EmployeeReferrals: 31, REChannel: 21, Total: 1620, datatype: "last7days" },
  { dummyId: 77, month: "Feb-23", directChannelDIY: 119, DirectSalesTeam: 409, APReferrals: 1064, EmployeeReferrals: 22, REChannel: 24, Total: 1638, datatype: "Daily" },
  { dummyId: 78, month: "Aug-23", directChannelDIY: 92, DirectSalesTeam: 379, APReferrals: 1037, EmployeeReferrals: 34, REChannel: 23, Total: 1565, datatype: "monthly" },
  { dummyId: 79, month: "Jan-24", directChannelDIY: 99, DirectSalesTeam: 404, APReferrals: 1149, EmployeeReferrals: 28, REChannel: 22, Total: 1702, datatype: "last7days" },
  { dummyId: 80, month: "Nov-23", directChannelDIY: 106, DirectSalesTeam: 413, APReferrals: 1035, EmployeeReferrals: 27, REChannel: 23, Total: 1604, datatype: "weekly" },
  { dummyId: 81, month: "Oct-23", directChannelDIY: 108, DirectSalesTeam: 429, APReferrals: 1076, EmployeeReferrals: 25, REChannel: 24, Total: 1662, datatype: "yearly" },
  { dummyId: 82, month: "Jul-23", directChannelDIY: 112, DirectSalesTeam: 410, APReferrals: 1025, EmployeeReferrals: 23, REChannel: 26, Total: 1601, datatype: "last7days" },
  { dummyId: 83, month: "Dec-23", directChannelDIY: 95, DirectSalesTeam: 384, APReferrals: 1074, EmployeeReferrals: 29, REChannel: 22, Total: 1604, datatype: "tilldate" },
  { dummyId: 84, month: "May-24", directChannelDIY: 107, DirectSalesTeam: 390, APReferrals: 1123, EmployeeReferrals: 32, REChannel: 27, Total: 1679, datatype: "monthly" }
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
