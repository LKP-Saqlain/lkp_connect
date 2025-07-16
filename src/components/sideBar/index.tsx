import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  CssBaseline,
  Typography,
  Divider,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
  Toolbar,
  List,
  IconButton,
  useMediaQuery,
  Badge,
} from "@mui/material";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { SlSizeFullscreen } from "react-icons/sl";
import { BsFullscreen } from "react-icons/bs";
import Logo from "../../assets/logo.png";
import Logo1 from "../../assets/images/logo1.png";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState, persistor } from "../../redux/store";
import { GetMenu } from "../../redux/thunk/GetMenus";
import { userOverview } from "../../redux/thunk/Overview";
import { hideLoader, showLoader } from "../../redux/slices/loaderSlice";
import ShowToast from "../../utils/toastUtils";
import { apiServices } from "../../services";
import DrawerItem from "../DrawerItem";
import Nudge from "../common/Nudge";
import CustomModal from "../common/DPModal";
import OverviewComponent from "../../pages/Overview";
import TradeDashboard from "../../pages/TradeDashboard";
import ClientDetails from "../../pages/ClientDetails";
import RegOverview from "../../pages/regOverView";
import EkycLinks from "../../pages/ekycLinks";
import StockStudy from "../../pages/StockStudy";
import OTDetails from "../../pages/OT";
import SPIP from "../../pages/SPIPReports";
import SPIPOverview from "../../pages/SPIPReports/SPIPOverview";
import ApnContest from "../../pages/Contest/ApnContest";
import EmpContest from "../../pages/Contest/EmpContest";
import PledgeRequest from "../../pages/PledgeRequest";
import InsertUnlistedShares from "../../pages/UnlistedShare/showUnlistedRecords";
import ShowUnlistedRecords from "../../pages/UnlistedShare/showUnlistedRecords";
import ViewApproverOne from "../../pages/UnlistedShare/ApproverOne";
import ViewApproverTwo from "../../pages/UnlistedShare/ApproverTwo";
import VendorsFile from "../../pages/UnlistedShare/UploadFile";
import MarketingMaterial from "../../pages/Marketing Materials";
import RegisDetails from "../../pages/Registration Details";
import RegulatorAnnouncement from "../../pages/regulatory announcement";
import MasterMenuMarketing from "../../pages/Masters/MarketingMaterialMaster";
import RegAnnMaster from "../../pages/Masters/RegulatoryAnnouncement";
import RegionalHead from "../../pages/KYC Dashboard/RegionalHead";
import BrokerageModificationStatus from "../../pages/KYC Dashboard/BrokerageModStatus";
import KycBrokerage from "../../pages/KYC Dashboard/KycBrokerage";
import PreProofUpload from "../../pages/preTrade/preProofUpload";
import PreTradeReport from "../../pages/preTrade/preTradeReport";
import PreTradeApproval from "../../pages/preTrade/Approval";
import IVR from "../../pages/preTrade/IVR";
import CommEntry from "../../pages/Compilance/commEntry";
import ComChecker from "../../pages/Compilance/commChecker";
import AnnualPNL from "../../pages/Reports/annualPNL";
import DormantClient from "../../pages/Reports/dormantClient";
import LastTrade from "../../pages/Reports/LastTrade";
import QuarterlyPayout from "../../pages/Reports/QPayout";
import SLBM from "../../pages/Reports/SLBM";
import CoreReport from "../../pages/Reports/CoreReport";
import AccStatement from "../../pages/Reports/AnnualAccStatement";
import DPRecovery from "../../pages/Reports/DPRecovery";
import Retrival from "../../pages/Reports/ComplianceReport";
import ClientTradingReport from "../../pages/Reports/ClientTradingPatternReport";
import CTCLReport from "../../pages/Reports/CTCLReport";
import APOverview from "../../pages/Employee/Overview";
import ExclusionList from "../../pages/ExclusionList/";
import { MenuItems } from "../../types";
import "./style.css";

const drawerWidth = 260;

// Utility functions for Drawer
const openedMixin = (theme: Theme, drawerWidth: any): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
  // overflowY: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

interface CustomAppBarProps extends MuiAppBarProps {
  open?: boolean; // Custom open prop
  isNudgeOpen?: any;
}

// Custom AppBar
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open" && prop !== "isNudgeOpen",
})<CustomAppBarProps>(({ theme, open, isNudgeOpen }) => {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const drawerWidth = isMobile ? 180 : 260;
  const collapsedDrawerWidth = isMobile ? 60 : 72;

  const leftMargin = open ? drawerWidth : collapsedDrawerWidth;

  return {
    backgroundColor: "#FAF9F6",
    borderRadius: "15px",
    margin: "15px",
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
    // zIndex: !isNudgeOpen ? "" : "auto", // Exisiting old added new below for FS modal
    zIndex: !isNudgeOpen ? "1000" : "100",
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    width: isMobile
      ? open
        ? `calc(100% - ${drawerWidth + 30}px)`
        : "calc(100% - 30px)"
      : open
      ? `calc(100% - ${leftMargin + 30}px)`
      : `calc(100% - 30px)`,
    marginLeft: isMobile
      ? open
        ? `${drawerWidth}px`
        : "0px"
      : `${leftMargin}px`,
  };
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const width = isMobile ? 180 : drawerWidth;

  return {
    width: width,
    flexShrink: 0,
    whiteSpace: "nowrap",
    ...(open && {
      ...openedMixin(theme, width),
      "& .MuiDrawer-paper": {
        ...openedMixin(theme, width),
        height: "100vh",
        overflowY: "auto",
      },
    }),
    ...(!open && {
      ...closedMixin(theme),
      "& .MuiDrawer-paper": {
        ...closedMixin(theme),
        height: "100vh",
        overflowY: "auto",
      },
    }),
  };
});

const SideBar = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(() => {
    const storedMenu = localStorage.getItem("activeMenu");
    return storedMenu ?? ""; // Will be set later conditionally if needed
  });

  const [activeSubItem, setActiveSubItem] = useState(() => {
    const storedSubItem = localStorage.getItem("activeSubItem");
    return storedSubItem ?? "";
  });
  // const [selectedPerformanceSection, setSelectedPerformanceSection] =
  //   useState("");

  const [selectedViewMore, setSelectedViewMore] = useState<string>("");
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [apiStatus, setApiStatus] = useState<boolean>(false);
  const [dataStatus, setDataStatus] = useState("");

  const [isNudgeOpen, setIsNudgeOpen] = useState(false);
  const [modal_animationZoom, setmodal_animationZoom] = useState(false);
  const [nudgeCount, setNudgeCount] = useState(0);

  const [sideBarNudge, setSideBarNudge] = useState<any[][]>([]);
  const [modal_center, setmodal_center] = useState<boolean>(false);

  // const drawerWidth = isMobile ? 180 : 240;
  // const settings = ["Change User", "Logout"];
  const [userAccess, setUserAccess] = useState<string[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItems[]>([]);
  const [showMyPerformance, setShowMyPerformance] = useState<boolean>(false);
  const [activeClickCount, setActiveClickCount] = useState(0);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { user_id, user_type } = useSelector(
    (state: RootState) => state.UserLogin && state.UserLogin?.data?.data
  );

  const { name, emailID } = useSelector(
    (state: RootState) => state.AuthUser && state.AuthUser?.data?.data
  );
  console.log("reduxStateUserName", name, user_type);

  const EmployeeLastBrokingDate = useSelector(
    (state: RootState) => state.userOverView?.data?.data?.data
  );

  console.log("EMpLastDate", EmployeeLastBrokingDate);

  const apBrokingLastDate = useSelector(
    (state: RootState) => state.APBrokerage?.data?.data?.Table
  );

  console.log("testasdasd", apBrokingLastDate);

  useEffect(() => {
    if (activeMenu !== "" || activeSubItem !== "") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [activeMenu, activeSubItem]);

  useEffect(() => {
    const fetchBrokerage = async () => {
      // const Id = localStorage.getItem("Id");
      const payload = {
        user_id: user_id,
      };
      dispatch(showLoader("Please wait, we are processing your request..."));
      dispatch(userOverview(payload))
        .unwrap()
        .then((response) => {
          console.log("Response", response);
          if (response?.status === 200) {
            dispatch(hideLoader());
          }
        })
        .catch((Err) => {
          const { message } = Err;
          console.log("Error->", message);
          dispatch(hideLoader());
          // formik.setFieldError("password", message);
          ShowToast(
            "error",
            message ||
              "Sorry for the inconvenience, please try after some time."
          );
        })
        .finally(() => {
          dispatch(hideLoader());
        });
    };

    fetchBrokerage();
  }, [dispatch]);

  useEffect(() => {
    const userId = localStorage.getItem("AdminId");

    const updatedSettings = [
      ...(userId === import.meta.env.VITE_ADMIN_CRED_1 ||
      userId === import.meta.env.VITE_ADMIN_CRED_2
        ? ["Change User"]
        : []),
      "Logout",
    ];

    setUserAccess(updatedSettings);
  }, []); // Empty dependency to run only on mount

  // useEffect(() => {
  //   if (selectedViewMore) {
  //     const timeoutId = setTimeout(() => {
  //       setSelectedViewMore("");
  //     }, 3000);
  //     return () => clearTimeout(timeoutId);
  //   }
  // }, [selectedViewMore]);

  useEffect(() => {
    if (
      activeMenu !== "Reports" &&
      activeMenu !== "Referal Lead" &&
      activeMenu !== "Compliance" &&
      activeMenu !== "KYC Dashboard" &&
      activeMenu !== "Masters" &&
      activeMenu !== "RMS" &&
      activeMenu !== "IVR" &&
      activeMenu !== "SPIP" &&
      activeMenu !== "DashBoard" &&
      activeMenu !== "TPD Report" &&
      activeMenu !== "Trading" &&
      activeSubItem
    ) {
      const timeoutId = setTimeout(() => {
        setActiveSubItem("");
      }, 3000);
      return () => clearTimeout(timeoutId);
    }
  }, [activeMenu, activeSubItem]);

  useEffect(() => {
    //this is for Employee user last date
    if (EmployeeLastBrokingDate && EmployeeLastBrokingDate.length > 0) {
      const EmpLastDate =
        EmployeeLastBrokingDate[EmployeeLastBrokingDate.length - 1]?.Dtrandate;
      setDataStatus(EmpLastDate || "No date available"); // Set default value if empty
      console.log("LASTDATE_Employee-->", EmpLastDate);
    } else {
      // this is for Partner user last date
      const apLastDate =
        apBrokingLastDate &&
        apBrokingLastDate[apBrokingLastDate.length - 1]?.Dtrandate;
      console.log("LASTDATE-->", apLastDate);
      setDataStatus(apLastDate || "No date available");
    }
  }, [EmployeeLastBrokingDate, apBrokingLastDate]);

  useEffect(() => {
    if (showMyPerformance) {
      const fetchDashboardNudge = async () => {
        const payload = {
          user_id: user_id,
        };

        try {
          dispatch(
            showLoader("Please wait, we are processing your request...")
          );
          const response = await apiServices.DashboardNudge(payload);
          console.log("dashBoardNudgeData", response?.data);

          const reportTypes = new Set<string>();

          Object.values(response?.data).forEach((table: any) => {
            table.forEach((entry: any) => {
              if (entry.ReportType) {
                reportTypes.add(entry.ReportType);
              }
            });
          });
          console.log("reportTypeSize", reportTypes.size);

          setNudgeCount(reportTypes.size);
          const nudgeData = response?.data;
          setSideBarNudge(nudgeData);

          dispatch(hideLoader());

          if (response?.status === 200) {
            // ShowToast("success", response?.data?.Message);
            // setIsNudgeOpen(!isNudgeOpen);
          } else {
            console.error("Failed");
          }
        } catch (error) {
          dispatch(hideLoader());
          console.error("Error sending email:", error);
        }
      };
      fetchDashboardNudge();
    }
  }, [dispatch, showMyPerformance]);

  console.log("user", user_id);

  const username = localStorage.getItem("userName");
  const firstLetter = username ? username.charAt(0).toUpperCase() : "";

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  const openFullScreen = () => {
    const elem = document.documentElement;
    elem.requestFullscreen?.();
  };

  const closeFullScreen = () => {
    document.exitFullscreen?.();
  };
  useEffect(() => {
    if (activeMenu === "Client Details") {
      setApiStatus(true);
      console.log(apiStatus);
    } else {
      setApiStatus(false);
    }
  }, [activeMenu]);

  useEffect(() => {
    // let userId = localStorage.getItem("Id");
    let payload = {
      user_id: user_id,
      menu_Type: "byUser",
    };

    dispatch(GetMenu(payload))
      .unwrap()
      .then((res) => {
        console.log("response", res);
        console.log("res", res?.data);
        const processedMenus = buildMenuHierarchy(res?.data);
        console.log("menuItems-->", processedMenus);
        setMenuItems(processedMenus);

        const storedMenu = localStorage.getItem("activeMenu");
        const storedSubItem = localStorage.getItem("activeSubItem");

        if (!storedMenu) {
          if (user_type === "Partner") {
            setActiveMenu("My Performance");
          } else if (user_type === "Employee") {
            setActiveMenu("Trading");
          }
        } else {
          // Restore from localStorage
          setActiveMenu(storedMenu);
          if (storedSubItem) {
            setActiveSubItem(storedSubItem);
          }
        }
      })
      .catch((Err) => {
        const { message } = Err;
        console.log("Error->", message);
        ShowToast(
          "error",
          message || "Sorry for the inconvenience, please try after some time."
        );
      })
      .finally(() => {
        dispatch(hideLoader());
      });
    const buildMenuHierarchy = (data: any) => {
      // Create a map of menu items with the `menu_code` as the key
      const menuMap = new Map();
      data.forEach((item: any) => {
        menuMap.set(item.menu_code, { ...item, subItems: [] });
      });

      // Iterate over the data and find child menus
      const menuHierarchy: any = [];
      data.forEach((item: any) => {
        if (item.parent_menu_code === 0) {
          menuHierarchy.push(menuMap.get(item.menu_code));
        } else {
          // Child menu, add to parent
          const parentMenu = menuMap.get(item.parent_menu_code);
          if (parentMenu) {
            parentMenu.subItems.push(menuMap.get(item.menu_code));
          }
        }
      });
      console.log("MenuOrder-->", menuHierarchy);

      return menuHierarchy;
    };
  }, []);

  useEffect(() => {
    if (!isMobile) {
      handleDrawerOpen();
    }
  }, []);

  useEffect(() => {
    if (activeMenu === "IVR" && activeSubItem === "IVR Mapping") {
      setActiveSubItem("");
    }
  }, [activeMenu, activeSubItem]);

  useEffect(() => {
    setIsNudgeOpen(false);
    localStorage.setItem("activeMenu", activeMenu);
    localStorage.setItem("activeSubItem", activeSubItem);
    console.log("MenuMaster", activeMenu, activeSubItem);
    console.log("MenuMaster", isNudgeOpen);
  }, [activeMenu, activeSubItem]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  // Unified handler for toggling the drawer submenus
  // const handleMenuClick = (menuTitle: string, hasSubItems: any) => {
  //   // setActiveMenu((prevActive) => (prevActive === menuTitle ? "" : menuTitle));

  //   // ------------------Exisiting Logic-----------
  //   // setActiveMenu((prevActive) =>
  //   //   prevActive === menuTitle ? menuTitle : menuTitle
  //   // );
  //   // ----------------------------------------------------
  //   setActiveMenu((prevActive) => {
  //     // If double-clicked on the same parent and it has submenus, close it
  //     if (prevActive === menuTitle && hasSubItems) {
  //       return "";
  //     }
  //     // Otherwise, keep current logic: activate the menu
  //     return menuTitle;
  //   });
  // };

  const handleMenuClick = (menuTitle: string, hasSubItems: any) => {
    setActiveMenu((prevActive) => {
      if (prevActive === menuTitle && hasSubItems) {
        // If clicking the same menu with subitems, collapse it and reset subitem
        setActiveSubItem("");
        return "";
      }

      // Always reset subitem when switching to a new main menu
      setActiveSubItem("");

      return menuTitle;
    });
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    console.log("data", event.currentTarget);
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = (value: any) => {
    console.log("values", value);
    if (value === "Logout") {
      persistor.purge();
      localStorage.removeItem("tkn");
      localStorage.removeItem("Id");
      localStorage.removeItem("uIdType");
      localStorage.removeItem("userName");
      localStorage.removeItem("activeMenu");
      localStorage.removeItem("AdminId");
      localStorage.removeItem("activeSubItem");
      sessionStorage.removeItem("dashboardNudgeFetched");
      navigate("/");
    } else if (value === "Change User") {
      setmodal_center(true); // Open the CustomModal
    } else {
      console.log("User clicked on:", value);
    }

    setAnchorElUser(null);
  };

  const handleSubItemClick = (subItem: string) => {
    console.log("SubItemClickvalue-->", subItem);
    // setActiveSubItem(subItem); // Set active sub-item
    if (activeSubItem === subItem) {
      // user clicked same tab again
      setActiveClickCount((prev) => prev + 1);
    } else {
      setActiveSubItem(subItem);
      setActiveClickCount(1); // reset count for new tab
    }
    if (isMobile) {
      setTimeout(() => {
        handleMobileDrawerClose();
      }, 400);
    }
  };

  const handleTradingOpen = (value: any) => {
    console.log("ClickedValue", value);
    if (value === "T6") {
      setActiveMenu("Trading");
      setSelectedViewMore(value);
    }
    if (value === "Dormant") {
      setActiveMenu("Client Details");
      setSelectedViewMore(value);
    }
    if (value === "spipSubExpiry") {
      setActiveMenu("SPIP");
      setActiveSubItem("Client Details Report");
      setSelectedViewMore(value);
    }
  };

  const handleMobileDrawerClose = () => {
    handleDrawerClose();
    // handleMenuClick("");
  };
  const performanceComponents: Record<string, JSX.Element> = {
    Employee: <OverviewComponent handleTradingOpen={handleTradingOpen} />,
    Default: <APOverview handleTradingOpen={handleTradingOpen} />,
  };

  const revenueDetailsSubItems: Record<string, JSX.Element> = {
    "Regulatory Announcement": <RegAnnMaster activeSubItem={activeSubItem} />,
    "Marketing Material": <MasterMenuMarketing activeSubItem={activeSubItem} />,
    "Menu Master": <ExclusionList activeSubItem={activeSubItem} />,
  };

  const kycSubItems: Record<string, JSX.Element> = {
    "RH Approval": <RegionalHead activeSubItem={activeSubItem} />,
    "KYC Approval": <KycBrokerage activeSubItem={activeSubItem} />,
    "Brokerage Modification Status": (
      <BrokerageModificationStatus activeSubItem={activeSubItem} />
    ),
  };

  const reportsSubItems: Record<string, JSX.Element> = {
    "Tax P&L Statement": <AnnualPNL />,
    "Dormant Client Report": <DormantClient activeSubItem={activeSubItem} />,
    "Last Trade Data": <LastTrade />,
    "Quarterly Payout Recovery": (
      <QuarterlyPayout activeSubItem={activeSubItem} />
    ),
    "SLBM Client Holding": <SLBM activeSubItem={activeSubItem} />,
    "Core Alerts Report": <CoreReport />,
    "Account Performance Report": <AccStatement />,
    "DP Debit Recovery": <DPRecovery activeSubItem={activeSubItem} />,
    "Client Trading Pattern Report": (
      <ClientTradingReport activeSubItem={activeSubItem} />
    ),
    "CTCL Wise Activity Report": <CTCLReport activeSubItem={activeSubItem} />,
  };

  // const referalSubItems: Record<string, JSX.Element> = {
  //   "Referal Entry Status": <Main activeSubItem={activeSubItem} />,
  // };

  const complianceSubItems: Record<string, JSX.Element> = {
    "Communication Retrival Entry": <CommEntry activeSubItem={activeSubItem} />,
    "Communication Retrival Checker": (
      <ComChecker activeSubItem={activeSubItem} />
    ),
    "Communication Retrival Report": <Retrival activeSubItem={activeSubItem} />,
    // "UCCCode MATCH": <VendorsFile />,
  };

  const ivrSubItems: Record<string, JSX.Element> = {
    "Pre Trade Proof Upload": <PreProofUpload activeSubItem={activeSubItem} />,
    "Pre Trade Report": <PreTradeReport activeSubItem={activeSubItem} />,
    "Pre Trade Approval": <PreTradeApproval activeSubItem={activeSubItem} />,
    "IVR Mapping": (
      <IVR
        activeMenu={activeMenu}
        activeSubItem={activeSubItem}
        activeClickCount={activeClickCount}
      />
    ),
    "Referal Product Wise MIS Report": (
      <KycBrokerage activeSubItem={activeSubItem} />
    ),
  };
  const tradingSubItems: Record<string, JSX.Element> = {
    "Client Pledge Request": <PledgeRequest activeSubItem={activeSubItem} />,
  };

  // const rmsSubItems: Record<string, JSX.Element> = {
  //   "RMS Allocation": <InsertUnlistedShares activeSubItem={activeSubItem} />,
  // };
  const tpdSubItems: Record<string, JSX.Element> = {
    "Unlisted Shares Entry": (
      <ShowUnlistedRecords activeSubItem={activeSubItem} />
    ),
    "Unlisted Shares Approval 1": (
      <ViewApproverOne activeSubItem={activeSubItem} />
    ),
    "Unlisted Shares Approval 2": (
      <ViewApproverTwo activeSubItem={activeSubItem} />
    ),
    "Unlisted Shares Status": (
      <InsertUnlistedShares activeSubItem={activeSubItem} />
    ),

    "Unlisted Shares File Upload": <VendorsFile />,
  };

  const getSubItemComponent = (
    subItems: Record<string, JSX.Element | null>
  ): JSX.Element | null => subItems[activeSubItem] || null;

  const componentResolver = (menu_order: number): JSX.Element | null => {
    const dynamicMap: Record<number, () => JSX.Element | null> = {
      1: () =>
        user_type === "Employee"
          ? performanceComponents.Employee
          : performanceComponents.Default,
      2: () => (
        <ClientDetails
          handleDrawerClose={handleDrawerClose}
          handleDrawerOpen={handleDrawerOpen}
          apiStatus={apiStatus}
          selectedTrading={selectedViewMore}
          activeMenu={activeMenu}
        />
      ),
      3: () =>
        tradingSubItems[activeSubItem] || (
          <TradeDashboard
            selectedTrading={selectedViewMore}
            showMyPerformance={showMyPerformance}
          />
        ),
      4: () => getSubItemComponent(reportsSubItems),
      5: () => <RegOverview />,
      6: () => getSubItemComponent(revenueDetailsSubItems),
      8: () => getSubItemComponent(complianceSubItems),
      9: () => getSubItemComponent(kycSubItems),
      10: () => <StockStudy />,
      21: () => <RegulatorAnnouncement activeMenu={activeMenu} />,
      22: () => <MarketingMaterial />,
      23: () => <EkycLinks />,
      24: () => <OTDetails />,
      25: () => <RegisDetails activeSubItem={activeSubItem} />,
      26: () => getSubItemComponent(ivrSubItems),
      28: () => (
        <SPIPOverview
          activeSubItem={activeSubItem}
          handleTradingOpen={handleTradingOpen}
        />
      ),
      29: () => (
        <SPIP
          activeSubItem={activeSubItem}
          activeMenu={activeMenu}
          handleTradingOpen={handleTradingOpen}
          selectedViewMore={selectedViewMore}
        />
      ),
      30: () => getSubItemComponent(tpdSubItems),
      31: () => <EmpContest />,
      32: () => <ApnContest activeMenu={activeMenu} />,
    };

    return dynamicMap[menu_order]?.() || null;
  };

  const renderContent = () => {
    const active = menuItems.find((item) => item.menu_name === activeMenu);
    console.log("activeMenu", active);

    return active ? componentResolver(active.menu_order) : null;
  };

  const handleNotificationClick = () => {
    setIsNudgeOpen(true); // Toggle the visibility of Nudge component
    setmodal_animationZoom((prev) => !prev);
    console.log("MenuMaster--->", isNudgeOpen);
  };

  function tog_animationZoom() {
    setmodal_animationZoom((prev) => !prev);
    setIsNudgeOpen(false);
  }

  const toCamelCase = (name: string) => {
    return name
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  useEffect(() => {
    const hasMyPerformance = menuItems.some(
      (menu) => menu.menu_name === "My Performance"
    );
    setShowMyPerformance(hasMyPerformance);
  }, [menuItems]);

  const handleSSOLogin = () => {
    console.log("TestSSOLogin");
    const userEmail = (emailID && emailID) || "";
    let payload = {
      email: userEmail,
    };

    dispatch(showLoader(""));
    apiServices
      .EKycSSOLogin(payload)
      .then((response) => {
        console.log("EKycSSOLoginResponse", response?.data?.data);
        dispatch(hideLoader());
        if (response?.status === 200) {
          if (response?.data?.data?.success) {
            const url = response?.data?.data?.url;
            window.open(url, "_blank", "noopener,noreferrer");
          }
        }
      })
      .catch((Error) => {
        console.log("Errrror", Error);
        dispatch(hideLoader());
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  return (
    <>
      <CustomModal
        tog_center={() => setmodal_center(!modal_center)}
        modal_center={modal_center}
        setmodal_center={setmodal_center}
        Msg={"Change User"}
        activeSubItem={activeSubItem}
        isAdmin={true}
      />

      {isNudgeOpen && (
        <Nudge
          modal_animationZoom={modal_animationZoom}
          tog_animationZoom={tog_animationZoom}
          sideBarNudge={sideBarNudge}
        />
      )}
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="fixed" open={open} isNudgeOpen={isNudgeOpen}>
          <Toolbar>
            {open ? (
              <IconButton onClick={handleDrawerClose}>
                {theme.direction === "rtl" ? (
                  <ChevronRightIcon />
                ) : (
                  <ChevronLeftIcon />
                )}
              </IconButton>
            ) : (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={[
                  { marginRight: isMobile ? 0 : 5 },
                  open && { display: "none" },
                ]}
              >
                <MenuIcon sx={{ color: "black" }} />
              </IconButton>
            )}
            {!open && (
              <Box sx={{ flexGrow: 0, backgroundColor: "#F9F6EE" }}>
                <Box
                  component="img"
                  alt="Logo"
                  src={Logo}
                  width={"auto"}
                  height="50px"
                />
              </Box>
            )}

            <Box sx={{ flexGrow: 1 }} />
            {showMyPerformance && (
              <>
                <Button
                  onClick={handleSSOLogin}
                  style={{
                    height: "25px",
                    width: "80px",
                    borderRadius: "5px",
                    fontSize: "12px",
                    padding: "0",
                    fontFamily: "Public Sans",
                    backgroundColor: "#11395C",
                    color: "#fff",
                  }}
                  className="btn-sm"
                >
                  E-KYC
                </Button>
              </>
            )}
            <Box
              sx={{
                padding: isMobile ? "0" : "10px",
              }}
            >
              {!isMobile ? (
                <div
                  style={{ marginRight: !showMyPerformance ? "2rem" : "0rem" }}
                >
                  <IconButton
                    onClick={isFullScreen ? closeFullScreen : openFullScreen}
                    sx={{ p: 0 }}
                  >
                    {isFullScreen ? (
                      <BsFullscreen style={{ cursor: "pointer" }} />
                    ) : (
                      <SlSizeFullscreen style={{ cursor: "pointer" }} />
                    )}
                  </IconButton>
                </div>
              ) : null}
            </Box>
            {showMyPerformance && (
              <MenuItem>
                <IconButton
                  size="large"
                  aria-label="show 6 new notifications"
                  color="inherit"
                  onClick={handleNotificationClick}
                  sx={{ p: 0 }}
                >
                  <Badge badgeContent={nudgeCount} color="error">
                    <NotificationsIcon sx={{ color: "#11395C" }} />
                  </Badge>
                </IconButton>
              </MenuItem>
            )}
            <Typography
              component="div"
              sx={{
                color: "black",
                fontSize: "10px",
                mr: 1,
                fontFamily: "Public Sans",
              }}
            >
              <Typography sx={{ fontSize: "14px", fontFamily: "Public Sans" }}>
                {toCamelCase(name)}
              </Typography>
              <Typography
                sx={{
                  fontSize: "9px",
                  color: "grey",
                  fontFamily: "Public Sans",
                }}
              >
                {`Data as on- ${dataStatus}`}
              </Typography>
            </Typography>
            <Tooltip title="">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  src="/static/images/avatar/2.jpg"
                  style={{ backgroundColor: "#284c6c" }}
                >
                  {firstLetter}
                </Avatar>
              </IconButton>
            </Tooltip>

            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {userAccess.map((setting) => (
                <MenuItem
                  key={setting}
                  onClick={() => handleCloseUserMenu(setting)}
                >
                  <Typography sx={{ textAlign: "center" }}>
                    {setting}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Toolbar>
        </AppBar>

        {open && (
          <Drawer
            variant="permanent"
            open={open}
            sx={{
              "& .MuiDrawer-paper": {
                backgroundColor: "#11395C",
              },
              position: "relative",
              zIndex: 9,
            }}
          >
            <Divider />
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                // zIndex: 1,
                marginTop: isMobile ? "0px" : "10px",
              }}
            >
              <Box
                component="img"
                alt="Logo"
                src={Logo1}
                width={"auto"}
                height="50px"
                style={{ marginLeft: isMobile ? "0px" : "-60px" }}
              />
            </Box>

            <List>
              {menuItems.map((item) => (
                <DrawerItem
                  key={item.menu_code}
                  title={item.menu_name}
                  open={open}
                  subItems={item.subItems}
                  handleDrawerOpen={handleDrawerOpen}
                  isMobile={isMobile}
                  activeMenu={activeMenu}
                  handleClick={() =>
                    handleMenuClick(item.menu_name, !!item.subItems?.length)
                  }
                  handleSubItemClick={handleSubItemClick}
                />
              ))}
            </List>
          </Drawer>
        )}

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 0.9,
            pt: "72px", // Adjust according to actual AppBar height
            backgroundColor: "#E5E4E2",
            overflow: "hidden",
            // width: "100vw", // Full width of the viewport
            // height: "100vh", // Full height of the viewport
          }}
        >
          {/* <Box>{renderMenu(menuItems, activeMenu, handleTradingOpen)}</Box> */}
          <Box>{renderContent()}</Box>
        </Box>
      </Box>
    </>
  );
};

export default SideBar;
