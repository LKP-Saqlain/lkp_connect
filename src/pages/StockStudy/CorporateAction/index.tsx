import Dividends from "./Dividends";
// import Bonus from "./Bonus"; // Assuming you have a Bonus component
// import Split from "./Split"; // Assuming you have a Split component
// import Right from "./Right"; // Assuming you have a Right component
// import BoardMeeting from "./BoardMeeting"; // Assuming you have a BoardMeeting component

const CorporateAction = ({ activeSubmenu }: { activeSubmenu: string }) => {
  switch (activeSubmenu) {
    case "Dividend":
      return <Dividends />;

    // case "Bonus":
    //   return <Bonus />;

    // case "Split":
    //   return <Split />;

    // case "Right":
    //   return <Right />;

    // case "Board Meeting":
    //   return <BoardMeeting />;

    default:
      return (
        <div style={{ backgroundColor: "red" }}>
          <h5>No active submenu or unknown submenu: {activeSubmenu}</h5>
          {/* Placeholder for dynamic content like DataTable or records */}
          {/* {(records.map(item) => {
            return <DataTable dynamicHeader={...} />;
          })} */}
        </div>
      );
  }
};

export default CorporateAction;
