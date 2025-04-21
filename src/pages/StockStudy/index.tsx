import { useEffect, useState } from "react";
import { Autocomplete, TextField, Button, Box } from "@mui/material";
import "./style.css";
import CashFlow from "../../components/common/stockStudyTable";
import FundamentalOverview from "./Fundamental/fundOverview";
import ShareHolding from "./shareHoldings";
import { regEx } from "../../helper/method";
import { showLoader, hideLoader } from "../../redux/slices/loaderSlice";
import { apiServices } from "../../services";
import { useDispatch } from "react-redux";
import CorporateAction from "./CorporateAction";
import BalanceSheet from "./Fundamental/BalanceSheet";
import Cashflow from "./Fundamental/CashFlow";
import AnnualPNL from "./Fundamental/annualP&L";
import Quarterly from "./Fundamental/QuaterlyP&L";
import Ratios from "./Fundamental/Ratios";
import News from "./News";

interface MenuItem {
  title: string;
  submenus: string[];
  component?: any;
}

const menuData: MenuItem[] = [
  {
    title: "Fundamental",
    submenus: [
      "Overview",
      "Quarterly P&L",
      "Annual P&L",
      "Cash Flow",
      "Balance Sheet",
      "Ratios",
    ],
  },
  {
    title: "Share Holding",
    submenus: [],
    component: (activeMenu: any) => <ShareHolding activeMenu={activeMenu} />,
  },
  { title: "News", submenus: [] },
  { title: "Bulk / Block Deal", submenus: [] },
  {
    title: "Corporate Action",
    submenus: ["Dividend", "Bonus", "Split", "Right", "Board Meeting"],
  },
];

const componentMap: Record<
  string,
  ({ records, activeMenu, activeSubmenu }: any) => JSX.Element
> = {
  Overview: ({ activeMenu, selectedIsin }) => (
    <FundamentalOverview
      activeMenu={activeMenu}
      selectedIsin={selectedIsin}
      // records={records}
    />
  ),
  "Quarterly P&L": ({ activeMenu, selectedIsin }) => (
    <Quarterly activeMenu={activeMenu} selectedIsin={selectedIsin} />
  ),
  "Annual P&L": ({ activeMenu, activeSubmenu, selectedIsin }) => (
    <AnnualPNL
      activeMenu={activeMenu}
      activeSubmenu={activeSubmenu}
      selectedIsin={selectedIsin}
    />
  ),
  "Cash Flow": ({ activeMenu, selectedIsin }) => (
    <Cashflow activeMenu={activeMenu} selectedIsin={selectedIsin} />
  ),
  Ratios: ({ activeMenu }) => <Ratios activeMenu={activeMenu} />,
  "Balance Sheet": ({ activeMenu, activeSubmenu, selectedIsin }) => (
    <BalanceSheet
      activeMenu={activeMenu}
      activeSubmenu={activeSubmenu}
      selectedIsin={selectedIsin}
    />
  ),
};

const ContentArea = ({
  activeMenu,
  activeSubmenu,
  records,
  selectedIsin,
}: any) => {
  let activeComponent = null;

  if (
    activeMenu === "Fundamental" &&
    activeSubmenu &&
    componentMap[activeSubmenu]
  ) {
    activeComponent = componentMap[activeSubmenu]({
      records,
      activeMenu,
      activeSubmenu,
      selectedIsin, // Pass to component
    });
  } else if (
    ["Cash Flow", "Quarterly P&L", "Annual P&L"].includes(activeSubmenu)
  ) {
    activeComponent = <CashFlow />;
  } else if (activeMenu === "Share Holding") {
    activeComponent = (
      <ShareHolding activeMenu={activeMenu} selectedIsin={selectedIsin} />
    );
  } else if (activeMenu === "News") {
    activeComponent = (
      <News activeMenu={activeMenu} selectedIsin={selectedIsin} />
    );
  } else {
    const menuItem = menuData.find((menu) => menu.title === activeMenu);
    activeComponent = menuItem?.component
      ? menuItem.component({ activeMenu, selectedIsin }) // Make sure component accepts this
      : null;
  }

  if (activeMenu === "Corporate Action") {
    activeComponent = (
      <CorporateAction
        activeSubmenu={activeSubmenu}
        selectedIsin={selectedIsin}
      />
    );
  }

  return <div className="content-area">{activeComponent}</div>;
};

const StockStudy = () => {
  const [activeMenu, setActiveMenu] = useState<string>("Fundamental");
  const [activeSubmenu, setActiveSubmenu] = useState<string>("Overview");
  const [inputValue, setInputValue] = useState<string>("");
  const [fundamentalRecords, setFundamentalRecords] = useState<any[]>([]);
  const [pendingSelected, setPendingSelected] = useState<any>(null);
  const [selectedIsin, setSelectedIsin] = useState<string | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(showLoader("Please wait we are processing your request"));
    apiServices
      .ScripSearch()
      .then((response) => {
        dispatch(hideLoader());
        setFundamentalRecords(response?.data?.Table || []);
      })
      .catch((error) => {
        dispatch(hideLoader());
        console.log("error", error);
      });
  }, []);

  const currentSubmenus =
    menuData.find((menuItem) => menuItem.title === activeMenu)?.submenus || [];

  useEffect(() => {
    if (currentSubmenus.length > 0) {
      setActiveSubmenu(currentSubmenus[0]);
    } else {
      setActiveSubmenu("");
    }
  }, [activeMenu, currentSubmenus]);

  const handleSearchClick = () => {
    if (pendingSelected) {
      setSelectedIsin(pendingSelected.ISINCode);
      console.log("Matched ISIN:", pendingSelected.ISINCode);
    } else {
      const matched = fundamentalRecords.find(
        (item) =>
          item.ScripName?.toLowerCase() === inputValue.toLowerCase() ||
          item.BSECode?.toLowerCase() === inputValue.toLowerCase() ||
          item.NSECode?.toLowerCase() === inputValue.toLowerCase()
      );

      if (matched) {
        setSelectedIsin(matched.ISINCode);
        console.log("Matched ISIN:", matched.ISINCode);
      } else {
        setSelectedIsin(null);
        console.log("No matching scrip found");
      }
    }
  };

  return (
    <div
      className="menu-box"
      style={{ fontFamily: "Public Sans", minHeight: "85vh" }}
    >
      <Box className="search-bar" sx={{ display: "flex", gap: 1, mb: 2 }}>
        <Autocomplete
          freeSolo
          options={fundamentalRecords}
          getOptionLabel={(option) =>
            typeof option === "string" ? option : option.ScripName || ""
          }
          filterOptions={(options, state) =>
            options.filter((option) => {
              const input = state.inputValue.toLowerCase();
              return (
                option.ScripName?.toLowerCase().includes(input) ||
                option.BSECode?.toLowerCase().includes(input) ||
                option.NSECode?.toLowerCase().includes(input) ||
                option.ISINCode?.toLowerCase().includes(input)
              );
            })
          }
          value={null} // prevent autocomplete from auto-selecting
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => {
            if (regEx.query.test(newInputValue) || newInputValue === "") {
              setInputValue(newInputValue.toUpperCase());

              if (newInputValue === "") {
                // Clear selection if input is cleared
                setPendingSelected(null);
                setSelectedIsin(null); // ✅ Clear the selected ISIN
                console.log("Cleared ISIN due to empty input");
              }
              console.log(event);
            }
          }}
          onChange={(event, newValue) => {
            if (newValue && typeof newValue !== "string") {
              setPendingSelected(newValue); // queue up
              setInputValue(newValue.ScripName || "");
              console.log("Selected ISIN event:", event);
            } else {
              setPendingSelected(null);
              setSelectedIsin(null); // ✅ Clear on manual clear
              setInputValue(""); // reset the input field
              console.log("Cleared ISIN due to deselection");
            }
          }}
          renderOption={(props, option) => (
            <li {...props} key={option.ISINCode}>
              <Box>{option.ScripName}</Box>
            </li>
          )}
          renderInput={(params) => (
            <TextField {...params} label="Search Scrip" size="small" />
          )}
          sx={{ flex: 1 }}
        />

        <Button
          variant="contained"
          onClick={handleSearchClick}
          sx={{ minWidth: 100 }}
          style={{ backgroundColor: "#11395C" }}
        >
          Search
        </Button>
      </Box>

      <Menu
        items={menuData}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      />
      <Submenu
        items={currentSubmenus}
        activeSubmenu={activeSubmenu}
        setActiveSubmenu={setActiveSubmenu}
      />
      <ContentArea
        records={fundamentalRecords}
        activeMenu={activeMenu}
        activeSubmenu={activeSubmenu}
        selectedIsin={selectedIsin}
      />
    </div>
  );
};

const Menu = ({ items, activeMenu, setActiveMenu }: any) => (
  <div className="menu">
    {items.map((item: MenuItem) => (
      <div
        key={item.title}
        className={`menu-item ${activeMenu === item.title ? "active" : ""}`}
        onClick={() => setActiveMenu(item.title)}
      >
        {item.title}
      </div>
    ))}
  </div>
);

const Submenu = ({ items, activeSubmenu, setActiveSubmenu }: any) => (
  <div className="submenu">
    {items.length > 0 ? (
      items.map((submenu: string) => (
        <div
          key={submenu}
          className={`submenu-item ${
            activeSubmenu === submenu ? "active" : ""
          }`}
          onClick={() => setActiveSubmenu(submenu)}
        >
          {submenu}
        </div>
      ))
    ) : (
      <div className="submenu-item empty-placeholder"></div>
    )}
  </div>
);

export default StockStudy;
