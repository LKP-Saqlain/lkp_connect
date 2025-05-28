import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import { useMediaQuery, Box } from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Logo1 from "../../assets/images/logo1.png";
import Logo from "../../assets/logo.png";
import DrawerItem from "../DrawerItem/index";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import OverviewComponent from "../../pages/Overview";
import TradeDashboard from "../../pages/TradeDashboard";
import AnnualPNL from "../../pages/Reports/annualPNL";
import DormantClient from "../../pages/Reports/dormantClient";
// import Table from "../../components/common/table";
import LastTrade from "../../pages/Reports/LastTrade";
import QuarterlyPayout from "../../pages/Reports/QPayout";
import SLBM from "../../pages/Reports/SLBM";
import CoreReport from "../../pages/Reports/CoreReport";
// import { apiServices } from "../../services";
import { MenuItems } from "../../types";
// import MenuMaster from "../../pages/Masters/MenuMaster";
// import AccessMapping from "../../pages/Masters/AccessMapping";
// import RMSAllocation from "../../pages/RMS/Allocation";
// import SLBMHoldings from "../../pages/RMS/SLBMHoldings";
import { persistor } from "../../redux/store";
import { RootState, AppDispatch } from "../../redux/store";
import ShowToast from "../../utils/toastUtils";
import { useDispatch, useSelector } from "react-redux";
import { GetMenu } from "../../redux/thunk/GetMenus";
import ClientDetails from "../../pages/ClientDetails";
import RegOverview from "../../pages/regOverView";
import AccStatement from "../../pages/Reports/AnnualAccStatement";
import { SlSizeFullscreen } from "react-icons/sl";
import { BsFullscreen } from "react-icons/bs";
import EkycLinks from "../../pages/ekycLinks";
import StockStudy from "../../pages/StockStudy";
import DPRecovery from "../../pages/Reports/DPRecovery";
import Retrival from "../../pages/Reports/ComplianceReport";
import OTDetails from "../../pages/OT";
import CommEntry from "../../pages/Compilance/commEntry";
import ComChecker from "../../pages/Compilance/commChecker";
import Main from "../../pages/refCard";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Nudge from "../common/Nudge";
import { hideLoader, showLoader } from "../../redux/slices/loaderSlice";
import { apiServices } from "../../services";
import MarketingMaterial from "../../pages/Marketing Materials";
import RegisDetails from "../../pages/Registration Details";
import RegulatorAnnouncement from "../../pages/regulatory announcement";
import CustomModal from "../common/DPModal";
import { userOverview } from "../../redux/thunk/Overview";
import MasterMenuMarketing from "../../pages/Masters/MarketingMaterialMaster";
import RegAnnMaster from "../../pages/Masters/RegulatoryAnnouncement";
import APOverview from "../../pages/Employee/Overview";
// import useClearStorageOnTabClose from "../../components/customHooks/clearStorage";
// import { subDays, format } from "date-fns";
import RegionalHead from "../../pages/KYC Dashboard/RegionalHead/index";
import BrokerageModificationStatus from "../../pages/KYC Dashboard/BrokerageModStatus";
import KycBrokerage from "../../pages/KYC Dashboard/KycBrokerage";
import PreProofUpload from "../../pages/preTrade/preProofUpload";
import PreTradeReport from "../../pages/preTrade/preTradeReport";
import PreTradeApproval from "../../pages/preTrade/Approval";
import IVR from "../../pages/preTrade/IVR";
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
  shouldForwardProp: (prop) => prop !== "open",
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
      ? "calc(100% - 30px)" // Always full width minus margin on mobile
      : open
      ? `calc(100% - ${leftMargin + 30}px)`
      : `calc(100% - 30px)`,
    marginLeft: isMobile ? 0 : `${leftMargin}px`,
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
        overflowY: "auto", // 👈 Enables vertical scroll
      },
    }),
    ...(!open && {
      ...closedMixin(theme),
      "& .MuiDrawer-paper": {
        ...closedMixin(theme),
        height: "100vh",
        overflowY: "auto", // 👈 Enables vertical scroll
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

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { user_id, user_type } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );

  const { name } = useSelector(
    (state: RootState) => state.AuthUser?.data?.data
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
      dispatch(showLoader("Please wait"));
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
  // useClearStorageOnTabClose();   //use to remove local and session storage when tab is changed

  // useEffect(() => {
  //   const checkReactAlive = () => {
  //     if (document.readyState === "complete") {
  //       alert("LKP Site is UP");
  //     } else {
  //       alert("LKP site might be down!");
  //     }
  //   };

  //   const interval = setInterval(checkReactAlive, 5000);

  //   window.onerror = () => {
  //     alert("LKP SITE IS CRASED!");
  //   };

  //   return () => clearInterval(interval);
  // }, []);

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

      // if (apLastDate) {
      //   setDataStatus(apLastDate);
      //   console.log("testasdasd", apLastDate);
      // }
      //  else {
      //   const yesterday = format(subDays(new Date(), 1), "dd-MM-yyyy");
      //   setDataStatus(yesterday);
      //   console.log("Setting yesterday's date:", yesterday);
      // }
    }
  }, [EmployeeLastBrokingDate, apBrokingLastDate]);

  useEffect(() => {
    if (showMyPerformance) {
      const fetchDashboardNudge = async () => {
        const payload = {
          user_id: user_id,
        };

        try {
          dispatch(showLoader(""));
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

        // if (
        //   user_type === "Partner" &&
        //   processedMenus[0].menu_name === "My Performance"
        // ) {
        //   setActiveMenu("My Performance");
        // } else if (
        //   user_type === "Employee" &&
        //   processedMenus[0].menu_name === "Trading"
        // ) {
        //   setActiveMenu("Trading");
        // }
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
        // dispatch(hideLoader());
        // formik.setFieldError("password", message);
        ShowToast(
          "error",
          message || "Sorry for the inconvenience, please try after some time."
        );
      })
      .finally(() => {
        // dispatch(hideLoader());
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
  const handleMenuClick = (menuTitle: string, hasSubItems: any) => {
    // setActiveMenu((prevActive) => (prevActive === menuTitle ? "" : menuTitle));

    // ------------------Exisiting Logic-----------
    // setActiveMenu((prevActive) =>
    //   prevActive === menuTitle ? menuTitle : menuTitle
    // );
    // ----------------------------------------------------
    setActiveMenu((prevActive) => {
      // If double-clicked on the same parent and it has submenus, close it
      if (prevActive === menuTitle && hasSubItems) {
        return "";
      }
      // Otherwise, keep current logic: activate the menu
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
    console.log("value-->", subItem);
    setActiveSubItem(subItem); // Set active sub-item
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
  };

  const handleMobileDrawerClose = () => {
    handleDrawerClose();
    // handleMenuClick("");
  };

  // const ComplianceSubComponents: any = {
  //   "Communication Retrival Entry": (props: any) => <CommEntry {...props} />,
  //   "Communication Retrival Checker": (props: any) => <ComChecker {...props} />,
  //   "Communication Retrival Report": (props: any) => <Retrival {...props} />,
  // };

  // const reportsSubComponents: any = {
  //   "Tax P&L Statement": AnnualPNL,
  //   "Dormant Client Report": (props: any) => <DormantClient {...props} />,
  //   "Last Trade Data": LastTrade,
  //   "Quarterly Payout Recovery": (props: any) => <QuarterlyPayout {...props} />,
  //   "SLBM ClientHolding": (props: any) => <SLBM {...props} />,
  //   "Core Alerts Report": CoreReport,
  //   "Account Performance Report": AccStatement,
  //   "DP Debit Recovery": (props: any) => <DPRecovery {...props} />,
  // };

  // const refferalLeadComponents: any = {
  //   "Referal Entry Status": (props: any) => <Main {...props} />,
  //   "Referal Entry": (props: any) => <RegionalHead {...props} />,
  //   "Referal Lead Updation": (props: any) => (
  //     <BrokerageModificationStatus {...props} />
  //   ),
  //   "Referal Product Wise MIS Report": (props: any) => (
  //     <KycBrokerage {...props} />
  //   ),
  // };
  // const masterSubComponents: any = {
  //   "Menu Master": (props: any) => <MasterMenuMarketing {...props} />,
  //   "User Access Mapping": (props: any) => <RegAnnMaster {...props} />,
  // };

  // const rmsSubComponents: any = {
  //   "RMS Allocation": (props: any) => <PreProofUpload {...props} />,
  //   "Upload SLBM Holding": (props: any) => <PreTradeReport {...props} />,
  // };

  // const componentMap: any = {
  //   "My Performance": user_type === "Employee" ? OverviewComponent : APOverview,
  //   Trading: (props: any) => <TradeDashboard {...props} />,
  //   RMS: ({ activeSubItem }: any) => {
  //     const SubComponent = rmsSubComponents[activeSubItem];
  //     return SubComponent ? (
  //       <SubComponent activeSubItem={activeSubItem} />
  //     ) : (
  //       // <div>No SubComponent for: {activeSubItem}</div>
  //       <div></div>
  //     );
  //   },
  //   "Client Details": (props: any) => (
  //     <ClientDetails
  //       handleDrawerClose={props.handleDrawerClose}
  //       handleDrawerOpen={props.handleDrawerOpen}
  //       apiStatus={props.apiStatus}
  //       selectedTrading={props.selectedViewMore}
  //       activeMenu={props.activeMenu}
  //     />
  //   ),
  //   "Zone Overview": RegOverview,
  //   "Stock Study": StockStudy,
  //   Reports: ({ activeSubItem }: any) => {
  //     const SubComponent = reportsSubComponents[activeSubItem];
  //     return SubComponent ? (
  //       <SubComponent activeSubItem={activeSubItem} />
  //     ) : (
  //       // <div>No SubComponent for: {activeSubItem}</div>
  //       <div></div>
  //     );
  //   },
  //   Compliance: ({ activeSubItem }: any) => {
  //     const SubComponent = ComplianceSubComponents[activeSubItem];

  //     return SubComponent ? (
  //       <SubComponent activeSubItem={activeSubItem} />
  //     ) : (
  //       <div>No SubComponent for: {activeSubItem}</div>
  //       // <div></div>
  //     );
  //   },
  //   Masters: ({ activeSubItem }: any) => {
  //     const SubComponent = masterSubComponents[activeSubItem];
  //     return SubComponent ? (
  //       <SubComponent activeSubItem={activeSubItem} />
  //     ) : (
  //       <div>No SubComponent for: {activeSubItem}</div>
  //       // <div></div>
  //     );
  //   },
  //   "Referal Lead": ({ activeSubItem }: any) => {
  //     const SubComponent = refferalLeadComponents[activeSubItem];
  //     return SubComponent ? (
  //       <SubComponent activeSubItem={activeSubItem} />
  //     ) : (
  //       <div>No SubComponent for: {activeSubItem}</div>
  //       // <div></div>
  //     );
  //   },
  //   "Regulatory Announcement": (props: any) => (
  //     <RegulatorAnnouncement {...props} />
  //   ),
  //   EKYC: (props: any) => <EkycLinks {...props} />,
  //   "Other Details": OTDetails,
  //   "Registration Details": (props: any) => <RegisDetails {...props} />,
  //   "Marketing Materials": MarketingMaterial,
  // };

  // const renderComponent = (
  //   menuItem: any,
  //   handleTradingOpen: (value: any) => void
  // ) => {
  //   console.log("Test12--->", menuItem.menu_name);

  //   const Component = componentMap[menuItem.menu_name];

  //   if (!Component) {
  //     return <div>There is no Data (Component) for: {menuItem.menu_name}</div>;
  //   }

  //   // Pass Props here for dynamic
  //   const props =
  //     menuItem.menu_name === "My Performance"
  //       ? {
  //           handleTradingOpen: (val: string) => {
  //             setSelectedPerformanceSection(val); // local state update
  //             handleTradingOpen(val); // trigger parent logic
  //           },
  //           selectedPerformanceSection,
  //         }
  //       : menuItem.menu_name === "Reports"
  //       ? { activeSubItem }
  //       : menuItem.menu_name === "Compliance"
  //       ? { activeSubItem }
  //       : menuItem.menu_name === "Referal Lead"
  //       ? { activeSubItem }
  //       : menuItem.menu_name === "Masters"
  //       ? { activeSubItem }
  //       : menuItem.menu_name === "Regulatory Announcement"
  //       ? { activeMenu }
  //       : menuItem.menu_name === "Registration Details"
  //       ? { activeSubItem }
  //       : menuItem.menu_name === "Trading"
  //       ? { selectedViewMore }
  //       : menuItem.menu_name === "Client Details"
  //       ? {
  //           handleDrawerClose,
  //           handleDrawerOpen,
  //           apiStatus,
  //           selectedViewMore,
  //           activeMenu,
  //         }
  //       : menuItem.menu_name === "RMS"
  //       ? { activeSubItem }
  //       : {};

  //   return <Component {...props} />;
  // };

  // const renderSubItems = (
  //   subItems: any,
  //   activeMenu: string,
  //   handleTradingOpen: (value: any) => void
  // ) => {
  //   return subItems
  //     .sort((a: any, b: any) => a.menu_order - b.menu_order)
  //     .map((subItem: any) => (
  //       <Box key={subItem.menu_code} sx={{ ml: 2 }}>
  //         {/* <Button onClick={() => handleMenuClick(subItem.menu_name)}>
  //           {subItem.menu_name}
  //         </Button> */}

  //         {/* Render component if it's active */}
  //         {activeMenu === subItem.menu_name &&
  //           renderComponent(subItem, handleTradingOpen)}
  //       </Box>
  //     ));
  // };

  // const renderMenu = (
  //   menuData: any,
  //   activeMenu: string,
  //   handleTradingOpen: (value: any) => void
  // ) => {
  //   console.log("renderMenuData1", menuData);

  //   return (
  //     menuData
  //       // .filter((item: any) => !item.isParent)
  //       .sort((a: any, b: any) => a.menu_order - b.menu_order)
  //       .map((menuItem: any) => (
  //         // {console.log("renderMenuData2", menuItem)}
  //         <Box key={menuItem.menu_code} sx={{ mb: 2 }}>
  //           {/* Render component if it's active */}
  //           {activeMenu === menuItem.menu_name &&
  //             renderComponent(menuItem, handleTradingOpen)}

  //           {/* Render sub-items if present */}
  //           {menuItem.subItems &&
  //             menuItem.subItems.length > 0 &&
  //             renderSubItems(menuItem.subItems, activeMenu, handleTradingOpen)}
  //         </Box>
  //       ))
  //   );
  // };

  const renderContent = () => {
    console.log("activeMenu", activeMenu, "activeSubItem", activeSubItem);
    // const hasOverview = menuItems.some((item) => item.menu_name === "Overview");
    // if (!activeMenu && hasOverview) {
    //   setActiveMenu("Overview");
    //   return <OverviewComponent />;
    // }
    switch (activeMenu) {
      case "My Performance":
        return user_type === "Employee" ? (
          <OverviewComponent handleTradingOpen={handleTradingOpen} />
        ) : (
          <APOverview handleTradingOpen={handleTradingOpen} />
        );
      case "Zone Overview":
        return <RegOverview />;
      case "Stock Study":
        return <StockStudy />;
      case "Trading":
        return (
          <TradeDashboard
            selectedTrading={selectedViewMore}
            showMyPerformance={showMyPerformance}
          />
        );
      case "Revenue Details":
      case "Masters":
        switch (activeSubItem) {
          case "Menu Master":
            return <MasterMenuMarketing />;
          case "User Access Mapping":
            return <RegAnnMaster />;
          default:
            return null;
        }
      case "KYC Dashboard":
        switch (activeSubItem) {
          case "RH Approval":
            return <RegionalHead activeSubItem={activeSubItem} />;
          case "KYC Approval":
            return <KycBrokerage activeSubItem={activeSubItem} />;
          case "Brokerage Modification Status":
            return (
              <BrokerageModificationStatus activeSubItem={activeSubItem} />
            );
          default:
            return null;
        }
      case "Reports":
        switch (activeSubItem) {
          case "Tax P&L Statement":
            return <AnnualPNL />;
          case "Dormant Client Report":
            return <DormantClient activeSubItem={activeSubItem} />;
          case "Last Trade Data":
            return <LastTrade />;
          case "Quarterly Payout Recovery":
            return <QuarterlyPayout activeSubItem={activeSubItem} />;
          case "SLBM ClientHolding":
            return <SLBM activeSubItem={activeSubItem} />;
          case "Core Alerts Report":
            return <CoreReport />;
          case "Account Performance Report":
            return <AccStatement />;
          case "DP Debit Recovery":
            return <DPRecovery activeSubItem={activeSubItem} />;
          default:
            return null;
        }
      case "RMS":
        switch (activeSubItem) {
          case "RMS Allocation":
            return;
          case "Upload SLBM Holding":
            return;
          default:
            return null;
        }
      case "Referal Lead":
        switch (activeSubItem) {
          case "Referal Entry Status":
            return <Main activeSubItem={activeSubItem} />;
          default:
            return null;
        }
      case "Compliance":
        switch (activeSubItem) {
          case "Communication Retrival Entry":
            return <CommEntry activeSubItem={activeSubItem} />;
          case "Communication Retrival Checker":
            return <ComChecker activeSubItem={activeSubItem} />;
          case "Communication Retrival Report":
            return <Retrival activeSubItem={activeSubItem} />;
          default:
            return null;
        }
      case "Client Details":
        return (
          <ClientDetails
            handleDrawerClose={handleDrawerClose}
            handleDrawerOpen={handleDrawerOpen}
            apiStatus={apiStatus}
            selectedTrading={selectedViewMore}
            activeMenu={activeMenu}
          />
        );
      case "Regulatory Announcement":
        return <RegulatorAnnouncement activeMenu={activeMenu} />;
      case "Marketing Materials":
        return <MarketingMaterial />;
      case "EKYC":
        return <EkycLinks />;
      case "Other Details":
        return <OTDetails />;
      case "Registration Details":
        return <RegisDetails activeSubItem={activeSubItem} />;
      case "IVR":
        switch (activeSubItem) {
          case "Pre Trade Proof Upload":
            return <PreProofUpload activeSubItem={activeSubItem} />;
          case "Pre Trade Report":
            return <PreTradeReport activeSubItem={activeSubItem} />;
          case "Pre Trade Approval":
            return <PreTradeApproval activeSubItem={activeSubItem} />;
          case "IVR Mapping":
            return <IVR activeSubItem={activeSubItem} />;
          case "Referal Product Wise MIS Report":
            return <KycBrokerage activeSubItem={activeSubItem} />;
          default:
            return null;
        }
        return <></>;
    }
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
                >
                  <Badge badgeContent={nudgeCount} color="error">
                    <NotificationsIcon sx={{ color: "#11395C" }} />
                  </Badge>
                </IconButton>
              </MenuItem>
            )}
            <Typography
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
