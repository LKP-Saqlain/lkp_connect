import Dividends from "./Dividends";
import Bonus from "./Bonus";
import Split from "./Spilt"; // Assuming you have a Split component
// import Right from "./Right"; // Assuming you have a Right component
import BoardMeeting from "./BoardMeeting"; // Assuming you have a BoardMeeting component

const CorporateAction = ({ activeSubmenu }: { activeSubmenu: string }) => {
  switch (activeSubmenu) {
    case "Dividend":
      return <Dividends />;

    case "Bonus":
      return <Bonus />;

    case "Split":
      return <Split />;

    // case "Right":
    //   return <Right />;

    case "Board Meeting":
      return <BoardMeeting />;

    default:
      return (
        <div>
          <h6>No active data available for: {activeSubmenu}</h6>
          <p>Please select a valid submenu item.</p>
        </div>
      );
  }
};

export default CorporateAction;
