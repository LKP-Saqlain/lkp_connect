import Dividends from "./Dividends";
import Bonus from "./Bonus";
import Split from "./Spilt";
import BoardMeeting from "./BoardMeeting";
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
        <div>
          <h6>No active data available for: {activeSubmenu}</h6>
          <p>Please select a valid submenu item.</p>
        </div>
      );
  }
};

export default CorporateAction;
