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
import MarketingMaterial from "../../pages/refCard/Marketing Materials";
import RegisDetails from "../../pages/refCard/Registration Details";
import RegulatorAnnouncement from "../../pages/refCard/regulatory announcement";
import CustomModal from "../common/DPModal";
// import useClearStorageOnTabClose from "../../components/customHooks/clearStorage";

const drawerWidth = 240;

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
}

// Custom AppBar
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<CustomAppBarProps>(({ theme, open }) => {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const width = isMobile ? 180 : drawerWidth;

  return {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      marginLeft: width,
      width: `calc(100% - ${width}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
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
      "& .MuiDrawer-paper": openedMixin(theme, width),
    }),
    ...(!open && {
      ...closedMixin(theme),
      "& .MuiDrawer-paper": closedMixin(theme),
    }),
  };
});

const SideBar = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(() => {
    return localStorage.getItem("activeMenu") || "Overview"; // Default to Overview
  });
  const [activeSubItem, setActiveSubItem] = useState(() => {
    return localStorage.getItem("activeSubItem") || "";
  });
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
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );

  const { name } = useSelector(
    (state: RootState) => state.AuthUser?.data?.data
  );
  console.log("reduxStateUserName", name);

  const lastBrokingValues = useSelector(
    (state: RootState) => state.userOverView?.data?.data?.data
  );

  // useClearStorageOnTabClose();   //use to remove local and session storage when tab is changed

  useEffect(() => {
    // const userId = localStorage.getItem("Id");

    const updatedSettings = [
      // ...(userId === import.meta.env.VITE_ADMIN_CRED_1 ||
      // userId === import.meta.env.VITE_ADMIN_CRED_2
      //   ? ["Change User"]
      //   : []),
      "Logout",
    ];

    setUserAccess(updatedSettings);
  }, []); // Empty dependency to run only on mount

  useEffect(() => {
    if (selectedViewMore) {
      const timeoutId = setTimeout(() => {
        setSelectedViewMore("");
      }, 3000);
      return () => clearTimeout(timeoutId);
    }
  }, [selectedViewMore]);

  useEffect(() => {
    if (
      activeMenu !== "Reports" &&
      activeMenu !== "Referal Lead" &&
      activeMenu !== "Compliance" &&
      activeMenu !== "Kyc Dashboard" &&
      activeSubItem
    ) {
      const timeoutId = setTimeout(() => {
        setActiveSubItem("");
      }, 3000);
      return () => clearTimeout(timeoutId);
    }
  }, [activeMenu, activeSubItem]);

  useEffect(() => {
    if (lastBrokingValues && lastBrokingValues.length > 0) {
      const brokingValue =
        lastBrokingValues[lastBrokingValues.length - 1]?.Dtrandate;
      setDataStatus(brokingValue || "No date available"); // Set default value if empty
    } else {
      setDataStatus("No data available");
    }
  }, [lastBrokingValues]); // Runs when `lastBrokingValues` changes

  useEffect(() => {
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
  }, [dispatch]);

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

        if (processedMenus[0].menu_name === "Overview") {
          setActiveMenu("Overview");
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
    console.log("MenuMaster", activeMenu, activeSubItem);
  }, [activeMenu, activeSubItem]);

  useEffect(() => {
    if (!isMobile) {
      handleDrawerOpen();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("activeMenu", activeMenu);
  }, [activeMenu]);

  useEffect(() => {
    localStorage.setItem("activeSubItem", activeSubItem);
  }, [activeSubItem]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  // Unified handler for toggling the drawer submenus
  const handleMenuClick = (menuTitle: string) => {
    // setActiveMenu((prevActive) => (prevActive === menuTitle ? "" : menuTitle));
    setActiveMenu((prevActive) =>
      prevActive === menuTitle ? menuTitle : menuTitle
    );
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

  const ComplianceSubComponents: any = {
    "UCCCode MATCH": (props: any) => <RegulatorAnnouncement {...props} />,
    "KRA PAN STATUS": (props: any) => <RegisDetails {...props} />,
    "Communication Retrival Entry": (props: any) => <CommEntry {...props} />,
    "Communication Retrival Checker": (props: any) => <ComChecker {...props} />,
    "Communication Retrival Report": (props: any) => <Retrival {...props} />,
  };

  const reportsSubComponents: any = {
    "Tax PNL Statement": AnnualPNL,
    "Dormant Client Report": (props: any) => <DormantClient {...props} />,
    "Last Trade Data": LastTrade,
    "Quarterly Payout Recovery": (props: any) => <QuarterlyPayout {...props} />,
    "SLBM ClientHolding": SLBM,
    "Core Alerts Report": CoreReport,
    "Account Performance Report": AccStatement,
    "DP Debit Recovery": (props: any) => <DPRecovery {...props} />,
  };

  const refferalLeadComponents: any = {
    "Referal Entry": EkycLinks,
    "Referal Entry Status": (props: any) => <Main {...props} />,
    "Referal Lead Updation": (props: any) => <OTDetails {...props} />,
    "Referal Product Wise MIS Report": (props: any) => (
      <MarketingMaterial {...props} />
    ),
  };

  const componentMap: any = {
    Overview: OverviewComponent,
    Trading: TradeDashboard,
    "Client Details": ClientDetails,
    "Zone Overview": RegOverview,
    "Stock Study": StockStudy,
    Reports: ({ activeSubItem }: any) => {
      const SubComponent = reportsSubComponents[activeSubItem];
      return SubComponent ? (
        <SubComponent activeSubItem={activeSubItem} />
      ) : (
        // <div>No SubComponent for: {activeSubItem}</div>
        <div></div>
      );
    },
    Compliance: ({ activeSubItem }: any) => {
      const SubComponent = ComplianceSubComponents[activeSubItem];
      return SubComponent ? (
        <SubComponent activeSubItem={activeSubItem} />
      ) : (
        <div>No SubComponent for: {activeSubItem}</div>
        // <div></div>
      );
    },
    "Referal Lead": ({ activeSubItem }: any) => {
      const SubComponent = refferalLeadComponents[activeSubItem];
      return SubComponent ? (
        <SubComponent activeSubItem={activeSubItem} />
      ) : (
        <div>No SubComponent for: {activeSubItem}</div>
        // <div></div>
      );
    },
  };

  const renderComponent = (
    menuItem: any,
    handleTradingOpen: (value: any) => void
  ) => {
    console.log("Test12--->", typeof menuItem.menu_name);

    const Component = componentMap[menuItem.menu_name];

    if (!Component) {
      return <div>Component missing for: {menuItem.menu_name}</div>;
    }

    // Pass Props here for dynamic
    const props =
      menuItem.menu_name === "Overview"
        ? { handleTradingOpen: () => handleTradingOpen("T6") }
        : menuItem.menu_name === "Reports"
        ? { activeSubItem }
        : menuItem.menu_name === "Compliance"
        ? { activeSubItem }
        : menuItem.menu_name === "Referal Lead"
        ? { activeSubItem }
        : {};

    return <Component {...props} />;
  };

  const renderSubItems = (
    subItems: any,
    activeMenu: string,
    handleTradingOpen: (value: any) => void
  ) => {
    return subItems
      .sort((a: any, b: any) => a.menu_order - b.menu_order)
      .map((subItem: any) => (
        <Box key={subItem.menu_code} sx={{ ml: 2 }}>
          {/* <Button onClick={() => handleMenuClick(subItem.menu_name)}>
            {subItem.menu_name}
          </Button> */}

          {/* Render component if it's active */}
          {activeMenu === subItem.menu_name &&
            renderComponent(subItem, handleTradingOpen)}
        </Box>
      ));
  };

  const renderMenu = (
    menuData: any,
    activeMenu: string,
    handleTradingOpen: (value: any) => void
  ) => {
    console.log("renderMenuData1", menuData);

    return (
      menuData
        // .filter((item: any) => !item.isParent)
        .sort((a: any, b: any) => a.menu_order - b.menu_order)
        .map((menuItem: any) => (
          // {console.log("renderMenuData2", menuItem)}
          <Box key={menuItem.menu_code} sx={{ mb: 2 }}>
            {/* Render component if it's active */}
            {activeMenu === menuItem.menu_name &&
              renderComponent(menuItem, handleTradingOpen)}

            {/* Render sub-items if present */}
            {menuItem.subItems &&
              menuItem.subItems.length > 0 &&
              renderSubItems(menuItem.subItems, activeMenu, handleTradingOpen)}
          </Box>
        ))
    );
  };

  // const renderContent = () => {
  //   console.log("activeMenu", activeMenu, "activeSubItem", activeSubItem);
  //   // const hasOverview = menuItems.some((item) => item.menu_name === "Overview");
  //   // if (!activeMenu && hasOverview) {
  //   //   setActiveMenu("Overview");
  //   //   return <OverviewComponent />;
  //   // }
  //   switch (activeMenu) {
  //     case "Overview": --------DONE
  //       return <OverviewComponent handleTradingOpen={handleTradingOpen} />;
  //     case "Zone Overview":--------DONE
  //       return <RegOverview />;
  //     case "Stock Study":--------DONE
  //       return <StockStudy />;
  //     case "Trading":--------DONE
  //       return <TradeDashboard selectedTrading={selectedViewMore} />;
  //     case "Revenue Details":
  //     case "Masters":
  //       switch (activeSubItem) {
  //         case "Menu Master":
  //           return <Typography>Menu Master Content</Typography>;
  //         case "User Access Mapping":
  //           return <AccessMapping />;
  //         default:
  //           return null;
  //       }
  //     case "Reports":
  //       switch (activeSubItem) {
  //         case "Tax PNL Statement":
  //           return <AnnualPNL />;
  //         case "Dormant Client Report":
  //           return <DormantClient activeSubItem={activeSubItem} />;
  //         case "Last Trade Data":
  //           return <LastTrade />;
  //         case "Quarterly Payout Recovery":
  //           return <QuarterlyPayout activeSubItem={activeSubItem} />;
  //         case "SLBM ClientHolding":
  //           return <SLBM />;
  //         case "Core Alerts Report":
  //           return <CoreReport />;
  //         case "Account Performance Report":
  //           return <AccStatement />;
  //         case "DP Debit Recovery":
  //           return <DPRecovery activeSubItem={activeSubItem} />;
  //         default:
  //           return null;
  //       }
  //     case "Compliance":
  //       switch (activeSubItem) {
  //         case "UCCCode MATCH":
  //           return <RegulatorAnnouncement activeSubItem={activeSubItem} />;
  //         case "KRA PAN STATUS":
  //           return <RegisDetails activeSubItem={activeSubItem} />;
  //         case "Communication Retrival Report":
  //           return <Retrival activeSubItem={activeSubItem} />;
  //         case "Communication Retrival Entry":
  //           return <CommEntry activeSubItem={activeSubItem} />;
  //         case "Communication Retrival Checker":
  //           return <ComChecker activeSubItem={activeSubItem} />;
  //         default:
  //           return null;
  //       }

  //     case "RMS":
  //       switch (activeSubItem) {
  //         case "RMS Allocation":
  //           return <RMSAllocation />;
  //         case "Upload SLBM Holding":
  //           return <SLBMHoldings />;
  //         default:
  //           return null;
  //       }
  //     case "Referal Lead":
  //       switch (activeSubItem) {
  //         case "Referal Entry":
  //           return <EkycLinks />;
  //         case "Referal Entry Status":
  //           return <Main activeSubItem={activeSubItem} />;
  //         case "Referal Lead Updation":
  //           return <OTDetails />;
  //         //  (
  //         //   <>
  //         //     <Typography sx={{ fontFamily: "Public Sans, sans-serif" }}>
  //         //       Welcome to LKP Dashboard
  //         //     </Typography>
  //         //     <Typography sx={{ fontFamily: "Public Sans, sans-serif" }}>
  //         //       Please select anyone from left
  //         //     </Typography>
  //         //   </>
  //         // );
  //         case "Referal Product Wise MIS Report":
  //           return <MarketingMaterial />;
  //         default:
  //           return null;
  //       }
  //     case "Client Details":
  //       return (
  //         <ClientDetails
  //           handleDrawerClose={handleDrawerClose}
  //           handleDrawerOpen={handleDrawerOpen}
  //           apiStatus={apiStatus}
  //           selectedTrading={selectedViewMore}
  //           activeMenu={activeMenu}
  //         />
  //       );
  //     case "Kyc Dashboard":
  //       switch (activeSubItem) {
  //         case "Kyc Summary":
  //           return "";
  //         default:
  //           return null;
  //       }
  //   }
  // };

  const handleNotificationClick = () => {
    setIsNudgeOpen(!isNudgeOpen); // Toggle the visibility of Nudge component
    setmodal_animationZoom((prev) => !prev);
  };

  function tog_animationZoom() {
    setmodal_animationZoom((prev) => !prev);
    setIsNudgeOpen(false);
  }

  // const handleUserClick = () => {
  //   let payload = {
  //     user_id: `EMP-${userChangeValue}`,
  //     user_type: "Employee",
  //     auth_type: "PAN",
  //     auth_value: "IHNPS0213M",
  //   };
  //   dispatch(showLoader(""));
  //   dispatch(AuthUser(payload))
  //     .unwrap()
  //     .then((response) => {
  //       console.log("2FAresponse", response);
  //       if (response?.status === 200) {
  //         const { token, name } = response?.data;

  //         setTimeout(() => {
  //           console.log("2FA_Response", response?.data);
  //           localStorage.setItem("authenticated", "true");
  //           localStorage.setItem("tkn", token);
  //           localStorage.setItem("userName", name);
  //           dispatch(updateUserId(`EMP-${userChangeValue}`));
  //           setUserChangeValue("");
  //           window.location.reload();
  //         }, 250);
  //         // navigate("/dashboard");
  //       }
  //     })
  //     .catch((error) => {
  //       const { message } = error;
  //       console.log("Error->", message);
  //       dispatch(hideLoader());
  //       // formik.setFieldError("password", message);
  //       ShowToast(
  //         "error",
  //         message || "Sorry for the inconvenience, please try after some time."
  //       );
  //     })
  //     .finally(() => {
  //       dispatch(hideLoader());
  //     });
  // };

  // useEffect(() => {
  //   setmodal_animationZoom((prev) => !prev);
  //   tog_animationZoom();
  // }, [isNudgeOpen]); // Empty dependency array ensures it only runs once when the component mounts

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
        <AppBar
          position="fixed"
          open={open}
          sx={{ backgroundColor: "#FAF9F6" }}
        >
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
                // border: "2px solid black",
                padding: isMobile ? "0" : "10px",
                marginRight: isMobile ? "0" : "2rem",
              }}
            >
              {/* <SlSizeFullscreen style={{ color: "black", cursor: "pointer" }} />
            <BsFullscreen style={{ color: "black", cursor: "pointer" }} /> */}
              {!isMobile ? (
                <div>
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
            <Typography
              sx={{
                color: "black",
                fontSize: "10px",
                mr: 1,
                fontFamily: "Public Sans",
              }}
            >
              {/* <Typography
              sx={{
                textAlign: "end",
                fontFamily: "Public Sans",
                fontSize: "18px",
                fontWeight: 400,
              }}
            >
              {" "}
              Welcome
            </Typography> */}
              <Typography sx={{ fontSize: "14px", fontFamily: "Public Sans" }}>
                {/* {localStorage.getItem("userName")} */}
                {name}
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
            }}
          >
            <Divider />
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
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
                  handleClick={() => handleMenuClick(item.menu_name)}
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
            p: 1,
            mt: 8,
            backgroundColor: "#E5E4E2",
            overflow: "hidden",
            // width: "100vw", // Full width of the viewport
            // height: "100vh", // Full height of the viewport
          }}
        >
          <Box>{renderMenu(menuItems, activeMenu, handleTradingOpen)}</Box>
        </Box>
      </Box>
    </>
  );
};

export default SideBar;
