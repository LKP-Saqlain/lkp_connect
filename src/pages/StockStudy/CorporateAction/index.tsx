import Dividends from "./Dividends";
import Bonus from "./Bonus";
import Split from "./Spilt";
import BoardMeeting from "./BoardMeeting";
import { TableCell, TableRow } from "@mui/material";
// import Right from "./Right"; // Uncomment when implemented

const CorporateAction = ({ activeSubmenu, selectedIsin }: any) => {
  console.log("main corporate file", selectedIsin);

  switch (activeSubmenu) {
    case "Dividend":
      return <Dividends selectedIsin={selectedIsin} />;

    case "Bonus":
      return <Bonus selectedIsin={selectedIsin} />;

    case "Split":
      return <Split selectedIsin={selectedIsin} />;

    case "Board Meeting":
      return <BoardMeeting selectedIsin={selectedIsin} />;

    // case "Right":
    //   return <Right selectedIsin={selectedIsin} />;

    default:
      return (
        <TableRow>
          <TableCell align="center">No data available !</TableCell>
        </TableRow>
      );
  }
};

export default CorporateAction;
