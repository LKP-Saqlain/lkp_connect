import { useState } from "react";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
} from "@mui/material";
// import { ExpandLess, ExpandMore } from "@mui/icons-material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import HomeIcon from "@mui/icons-material/Home";
import GridViewIcon from "@mui/icons-material/GridView";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import SwitchAccountIcon from "@mui/icons-material/SwitchAccount";
import DomainVerificationIcon from "@mui/icons-material/DomainVerification";
import PollIcon from "@mui/icons-material/Poll";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import CampaignIcon from "@mui/icons-material/Campaign";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import StackedBarChartIcon from "@mui/icons-material/StackedBarChart";
import PostAddIcon from "@mui/icons-material/PostAdd";
import List from "@mui/material/List";
import { MenuItems } from "../../types/index";
// import "./style.css";

type DrawerItemProps = {
  title: string;
  subItems?: MenuItems[];
  activeMenu: string | null;
  open: boolean;
  handleDrawerOpen: () => void;
  handleClick: () => void;
  isMobile: boolean;
  handleSubItemClick: (data: any) => void;
};

const DrawerItem: React.FC<DrawerItemProps> = ({
  title,
  subItems,
  open,
  handleClick,
  activeMenu,
  handleSubItemClick,
}) => {
  const [activeSubItem, setActiveSubItem] = useState<string | null>(null);
  const isMenuOpen = activeMenu === title;

  const getIcon = (title: string) => {
    console.log("title", title);
    switch (title) {
      case "Overview":
        return <HomeIcon sx={{ color: isMenuOpen ? "black" : "#F9F6EE" }} />;
      case "Trading":
        return <PollIcon sx={{ color: isMenuOpen ? "black" : "#F9F6EE" }} />;
      case "Masters":
        return (
          <GridViewIcon sx={{ color: isMenuOpen ? "black" : "#F9F6EE" }} />
        );
      case "Revenue Details":
        return (
          <LibraryBooksIcon sx={{ color: isMenuOpen ? "black" : "#F9F6EE" }} />
        );
      case "RMS":
        return (
          <SwitchAccountIcon sx={{ color: isMenuOpen ? "black" : "#F9F6EE" }} />
        );
      case "Client Details":
        return (
          <SwitchAccountIcon sx={{ color: isMenuOpen ? "black" : "#F9F6EE" }} />
        );
      case "e-KYC Link":
        return (
          <DomainVerificationIcon
            sx={{ color: isMenuOpen ? "black" : "#F9F6EE" }}
          />
        );
      case "Live Contest":
        return <PollIcon sx={{ color: isMenuOpen ? "black" : "#F9F6EE" }} />;
      case "Marketing Materials":
        return (
          <AddBusinessIcon sx={{ color: isMenuOpen ? "black" : "#F9F6EE" }} />
        );
      case "Referal Lead":
        return (
          <CampaignIcon sx={{ color: isMenuOpen ? "black" : "#F9F6EE" }} />
        );
      case "Kyc Dashboard":
        return (
          <StackedBarChartIcon
            sx={{ color: isMenuOpen ? "black" : "#F9F6EE" }}
          />
        );
      case "Registration Details":
        return (
          <HowToRegIcon sx={{ color: isMenuOpen ? "black" : "#F9F6EE" }} />
        );
      case "Stack Study":
        return (
          <StackedBarChartIcon
            sx={{ color: isMenuOpen ? "black" : "#F9F6EE" }}
          />
        );
      case "Reports":
        return <PostAddIcon sx={{ color: isMenuOpen ? "black" : "#F9F6EE" }} />;
      default:
        return (
          <ChevronRightIcon sx={{ color: isMenuOpen ? "black" : "#F9F6EE" }} />
        );
    }
  };

  const handleSubItemSelection = (menuName: string) => {
    setActiveSubItem(menuName);
    handleSubItemClick(menuName);
  };

  return (
    <ListItem disablePadding sx={{ display: "block" }}>
      <ListItemButton
        onClick={handleClick}
        sx={{
          minHeight: 48,
          justifyContent: open ? "initial" : "center",
          px: 2.5,
          backgroundColor: isMenuOpen ? "#f0f0f0" : "transparent",
          "&:hover": {
            backgroundColor: "#f0f0f0",
            "& .MuiListItemText-root, & .MuiSvgIcon-root": {
              color: "black",
            },
          },
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: open ? 1 : "auto",
            justifyContent: "center",
          }}
        >
          {getIcon(title)}
        </ListItemIcon>
        <ListItemText
          primary={title}
          sx={{
            opacity: open ? 1 : 0,
            color: isMenuOpen ? "black" : "#F9F6EE",
            transition: "color 0.5s",
          }}
        />
        {/* {subItems && (isMenuOpen ? <ExpandLess /> : <ExpandMore />)} */}
      </ListItemButton>

      {/* Only show sub-items if the menu is open */}
      {subItems && (
        <Collapse in={isMenuOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {subItems.map((subItem, index) => (
              <ListItemButton
                key={index}
                sx={{
                  pl: 4,
                  color: activeSubItem === subItem.menu_name ? "black" : "#fff",
                  backgroundColor:
                    activeSubItem === subItem.menu_name
                      ? "#708090"
                      : "transparent",
                  "&:hover": {
                    backgroundColor: "#708090",
                    color: "black",
                  },
                }}
                onClick={() => handleSubItemSelection(subItem.menu_name)}
              >
                <ArrowRightIcon />
                <ListItemText
                  primary={subItem.menu_name}
                  primaryTypographyProps={{
                    fontSize: "13px",
                    fontFamily: "Public Sans",
                  }}
                />
              </ListItemButton>
            ))}
          </List>
        </Collapse>
      )}
    </ListItem>
  );
};

export default DrawerItem;
