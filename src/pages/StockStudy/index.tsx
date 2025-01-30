import { useEffect, useState } from "react";
import "./style.css";
import CashFlow from "../../components/common/stockStudyTable";
import FundamentalOverview from "../../components/common/stockOverview";
import ShareHolding from "./shareHoldings";
import { regEx } from "../../helper/method";
import { showLoader, hideLoader } from "../../redux/slices/loaderSlice";
import { apiServices } from "../../services";
import { useDispatch } from "react-redux";

interface MenuItem {
  title: string;
  submenus: string[];
  component?: JSX.Element;
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
    component: <ShareHolding />,
  },
  {
    title: "News",
    submenus: [],
  },
  {
    title: "Bulk / Block Deal",
    submenus: [],
  },
  {
    title: "Corporate Action",
    submenus: ["Dividend", "Bonus", "Split", "Right", "Board Meeting"],
    component: <div>Corporate Action details go here.</div>,
  },
];

// const componentsMap: Record<string, JSX.Element> = {
//   "Cash Flow": <CashFlow />,
//   "Quarterly P&L": <CashFlow />,
//   "Annual P&L": <CashFlow />,
//   Overview: <FundamentalOverview />,
// };

const SearchBar = ({ handleChange, inputValue }: any) => (
  <div className="search-bar">
    <input
      type="text"
      placeholder="Search..."
      className="search-input"
      value={inputValue}
      onChange={handleChange}
      defaultValue="Reliance Industries Limited"
    />
    <button className="search-button">Search</button>
  </div>
);

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

const ContentArea = ({ activeMenu, activeSubmenu, records }: any) => {
  let activeComponent = null;

  if (activeSubmenu === "Overview") {
    activeComponent = <FundamentalOverview records={records} />;
  } else if (
    ["Cash Flow", "Quarterly P&L", "Annual P&L"].includes(activeSubmenu)
  ) {
    activeComponent = <CashFlow />;
  } else {
    activeComponent =
      menuData.find((menu) => menu.title === activeMenu)?.component || null;
  }

  useEffect(() => {
    console.log("records", records);
  }, [records]);

  return <div className="content-area">{activeComponent}</div>;
};

const StockStudy = () => {
  const [activeMenu, setActiveMenu] = useState<string>("Fundamental");
  const [activeSubmenu, setActiveSubmenu] = useState<string>("Overview");
  const [inputValue, setInputValue] = useState<string>("");
  const [fundamentalRecords, setFundamentalRecords] = useState<[]>([]);

  const dispatch = useDispatch();
  useEffect(() => {
    const fetchFundamentalRecords = async () => {
      dispatch(showLoader("Please wait we are processing your request"));
      apiServices
        .Fundamental({})
        .then((response) => {
          dispatch(hideLoader());
          console.log(
            "fetchFundamentalRecordsResponse",
            response?.data?.fundamentalData
          );
          setFundamentalRecords(response?.data?.fundamentalData);
        })
        .catch((error) => {
          dispatch(hideLoader());
          console.log("error", error);
        });
    };
    fetchFundamentalRecords();
  }, []);

  useEffect(() => {
    console.log("Active Menu:", activeMenu);
  }, [activeMenu]);

  const currentSubmenus =
    menuData.find((menuItem) => menuItem.title === activeMenu)?.submenus || [];

  useEffect(() => {
    if (currentSubmenus.length > 0) {
      setActiveSubmenu(currentSubmenus[0]);
    } else {
      setActiveSubmenu("");
    }
  }, [activeMenu, currentSubmenus]);

  const handleChange = (event: any) => {
    console.log("event", event.target.value);
    const { value } = event.target;

    if (regEx.alphaNumeric.test(value)) {
      // formik.setFieldValue(name, value.toUpperCase().replace(/\s/g, ""));
      setInputValue(value.replace(/\s/g));
    }
  };

  return (
    <div
      className="menu-box"
      style={{
        fontFamily: "Public Sans",
        minHeight: "85vh",
      }}
    >
      <SearchBar handleChange={handleChange} inputValue={inputValue} />
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
      />
    </div>
  );
};

export default StockStudy;
