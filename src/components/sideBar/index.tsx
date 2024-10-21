import { useState, useEffect } from "react";
import {
  styled,
  useTheme,
  Theme,
  CSSObject,
  alpha,
} from "@mui/material/styles";
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
import InputBase from "@mui/material/InputBase";
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

const drawerWidth = 300;

// Utility functions for Drawer
const openedMixin = (theme: Theme, drawerWidth: any): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

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
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [activeSubItem, setActiveSubItem] = useState<string | null>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const drawerWidth = isMobile ? 180 : 240;
  const settings = ["Account", "Logout"];

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
  const handleMenuClick = (menuName: string) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const menuItems = [
    { title: "OverView" },
    { title: "Trading Dashboard" },
    {
      title: "Reports",
      subItems: [
        "Annual PNL Statement",
        "Dormant Client Report",
        "Last Trade Data",
        "Quarterly Payout Recovery",
        "SLBM Client Holding",
        "Core Alerts Report",
      ],
    },
    { title: "Revenue Details" },
    { title: "Client Details" },
    { title: "e-KYC Link" },
    { title: "Live Contest" },
    { title: "Marketing Materials" },
    { title: "Regulatory Announcement" },
    { title: "Registration Details" },
    { title: "Stack Study" },
  ];

  const handleSubItemClick = (subItem: string) => {
    // alert("called");
    console.log("value-->", subItem);
    setActiveSubItem(subItem); // Set active sub-item
    isMobile && handleMobileDrawerClose();
  };

  const handleMobileDrawerClose = () => {
    handleDrawerClose();
    handleMenuClick("");
  };
  const renderContent = () => {
    // debugger;
    // if (activeMenu !== "Reports") {
    //   setActiveSubItem();
    // }
    switch (activeMenu) {
      case "OverView" || "":
        return <OverviewComponent />;
      case "Trading Dashboard":
        return <TradeDashboard />;
      case "Revenue Details":
        return <Typography>Client Details render here</Typography>;
      case "Client Details":
        return <Typography>Client Details render here</Typography>;
      case "e-KYC Link":
        return <Typography>e-KYC Link section here</Typography>;
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
          case "SLBM Client Holding":
            return <SLBM />;
          case "Core Alerts Report":
            return <CoreReport />;
          default:
            break;
        }
      default:
        return (
          <>
            <Typography sx={{ fontFamily: "Public Sans, sans-serif" }}>
              Please select a table for KYC
            </Typography>
            <Typography sx={{ fontFamily: "Public Sans, sans-serif" }}>
              No sub-item selected
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
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar alt="A Sharp" src="/static/images/avatar/2.jpg" />
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
              <MenuItem key={setting} onClick={handleCloseUserMenu}>
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
                key={item.title}
                title={item.title}
                open={open}
                subItems={item.subItems}
                handleDrawerOpen={handleDrawerOpen}
                isMobile={isMobile}
                activeMenu={activeMenu}
                handleClick={() => handleMenuClick(item.title)}
                handleSubItemClick={handleSubItemClick}
              />
            ))}
          </List>
        </Drawer>
      )}

      <Box
        component="main"
        sx={{ flexGrow: 1, p: 1, backgroundColor: "#E5E4E2" }}
      >
        <Box>
          {renderContent()} {/* Render the content based on active sub-item */}
        </Box>
      </Box>
    </Box>
  );
};

export default SideBar;
