import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
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
import AccessMapping from "../../pages/Masters/AccessMapping";
import RMSAllocation from "../../pages/RMS/Allocation";
import SLBMHoldings from "../../pages/RMS/SLBMHoldings";
import { persistor } from "../../redux/store";
import { RootState, AppDispatch } from "../../redux/store";
import ShowToast from "../../utils/toastUtils";
import { useDispatch, useSelector } from "react-redux";
import { GetMenu } from "../../redux/thunk/GetMenus";
import ClientDetails from "../../pages/ClientDetails";

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
  const [activeMenu, setActiveMenu] = useState<string>("");
  const [activeSubItem, setActiveSubItem] = useState<string>("");
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  // const drawerWidth = isMobile ? 180 : 240;
  const settings = ["Logout"];
  const [menuItems, setMenuItems] = useState<MenuItems[]>([]);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );
  console.log("user", user_id);

  const username = localStorage.getItem("userName");
  const firstLetter = username ? username.charAt(0).toUpperCase() : "";

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
    // apiServices
    //   .dashGetMenus(payload)
    //   .then((res) => {
    //     console.log("res", res?.data);
    //     const processedMenus = buildMenuHierarchy(res?.data);
    //     console.log("menuItems-->", processedMenus);
    //     setMenuItems(processedMenus);
    //   })
    //   .catch((error) => {
    //     console.log("Error", error);
    //   });

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

      return menuHierarchy;
    };
  }, []);

  useEffect(() => {
    console.log("MenuMaster", activeMenu, activeSubItem);
  }, [activeMenu, activeSubItem]);

  useEffect(() => {
    handleDrawerOpen();
  }, []);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  // Unified handler for toggling the drawer submenus
  const handleMenuClick = (menuTitle: string) => {
    setActiveMenu((prevActive) => (prevActive === menuTitle ? "" : menuTitle));
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
      navigate("/");
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
    // isMobile && handleMobileDrawerClose();
  };

  const handleMobileDrawerClose = () => {
    handleDrawerClose();
    // handleMenuClick("");
  };
  const renderContent = () => {
    console.log("activeMenu", activeMenu);
    switch (activeMenu) {
      case "Overview":
        return <OverviewComponent />;
      case "Trading":
        return <TradeDashboard />;
      case "Revenue Details":
      case "Masters":
        switch (activeSubItem) {
          case "Menu Master":
            return <Typography>Menu Master Content</Typography>;
          case "User Access Mapping":
            return <AccessMapping />;
          default:
            return null;
        }
      case "Reports":
        switch (activeSubItem) {
          case "Annual PNL Statement":
            return <AnnualPNL />;
          case "Dormant Client Report":
            return <DormantClient />;
          case "Last Trade Data":
            return <LastTrade />;
          case "Quarterly Payout Recovery":
            return <QuarterlyPayout />;
          case "SLBM ClientHolding":
            return <SLBM />;
          case "Core Alerts Report":
            return <CoreReport />;
          default:
            return null;
        }
      case "RMS":
        switch (activeSubItem) {
          case "RMS Allocation":
            return <RMSAllocation />;
          case "Upload SLBM Holding":
            return <SLBMHoldings />;
          default:
            return null;
        }
      case "Referal Lead":
        switch (activeSubItem) {
          case "Referal Entry":
            return (
              <ClientDetails
                handleDrawerClose={handleDrawerClose}
                handleDrawerOpen={handleDrawerOpen}
              />
            );
          case "Referal Entry Status":
            return "";
          default:
            return null;
        }
      case "Client Details":
        return <Typography>Client Details render here</Typography>;
      case "e-KYC Link":
        return <Typography>e-KYC Link section here</Typography>;
      default:
        return (
          <>
            <Typography sx={{ fontFamily: "Public Sans, sans-serif" }}>
              Welcome to LKP Dashboard
            </Typography>
            <Typography sx={{ fontFamily: "Public Sans, sans-serif" }}>
              Please select anyone from left
            </Typography>
          </>
        );
    }
  };
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} sx={{ backgroundColor: "#F9F6EE" }}>
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
              sx={[{ marginRight: 5 }, open && { display: "none" }]}
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
          <Typography
            sx={{
              color: "black",
              fontSize: "10px",
              mr: 1,
              fontFamily: "Public Sans",
            }}
          >
            <Typography
              sx={{
                textAlign: "end",
                fontFamily: "Public Sans",
                fontSize: "18px",
                fontWeight: 400,
              }}
            >
              {" "}
              Welcome
            </Typography>
            {localStorage.getItem("userName")}
          </Typography>
          <Tooltip title="">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar src="/static/images/avatar/2.jpg">{firstLetter}</Avatar>
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
            {settings.map((setting) => (
              <MenuItem
                key={setting}
                onClick={() => handleCloseUserMenu(setting)}
              >
                <Typography sx={{ textAlign: "center" }}>{setting}</Typography>
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
          backgroundColor: "#E5E4E2",
          overflow: "hidden",
        }}
      >
        <Box>{renderContent()}</Box>
      </Box>
    </Box>
  );
};

export default SideBar;
