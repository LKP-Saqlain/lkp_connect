import { useState } from "react";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
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
// import "./style.css";

type DrawerItemProps = {
  title: string;
  subItems?: string[];
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
  handleDrawerOpen,
  handleClick,
  isMobile,
  activeMenu,
  handleSubItemClick,
}) => {
  const isMenuOpen = activeMenu === title; // Check if the current item is open
  const [subMenuOpen, setSubMenuOpen] = useState(false);

  const handleSubMenuToggle = () => {
    console.log("titleCheck", title);
    setSubMenuOpen((prev) => !prev);
    handleClick();
  };

  const getIcon = (title: string) => {
    switch (title) {
      case "OverView":
        return <HomeIcon sx={{ color: isMenuOpen ? "black" : "#F9F6EE" }} />;
      case "Trading Dashboard":
        return (
          <GridViewIcon sx={{ color: isMenuOpen ? "black" : "#F9F6EE" }} />
        );
      case "Revenue Details":
        return (
          <LibraryBooksIcon sx={{ color: isMenuOpen ? "black" : "#F9F6EE" }} />
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
      case "Regulatory Announcement":
        return (
          <CampaignIcon sx={{ color: isMenuOpen ? "black" : "#F9F6EE" }} />
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
  return (
    <>
      <ListItem disablePadding sx={{ display: "block" }}>
        <ListItemButton
          onClick={handleSubMenuToggle}
          sx={{
            minHeight: 48,
            justifyContent: open ? "initial" : "center",
            px: 2.5,
            backgroundColor: isMenuOpen ? "#f0f0f0" : "transparent", // Background for selected item
            "&:hover": {
              backgroundColor: "#f0f0f0", // Same hover background for all items
              "& .MuiListItemText-root, & .MuiSvgIcon-root": {
                color: "black", // Change text/icon color on hover
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
              color: isMenuOpen ? "black" : "#F9F6EE", // Change text color based on activeMenu
              transition: "color 0.5s",
            }}
            onClick={handleDrawerOpen}
            primaryTypographyProps={{
              fontSize: "14px",
              fontFamily: "Public Sans",
            }}
          />
          {/* {title === "Reports" && subItems && subMenuOpen ? (
            <ExpandLess />
          ) : (
            <ExpandMore />
          )} */}
        </ListItemButton>
        {subItems && (
          <Collapse in={subMenuOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {subItems.map((subItem, index) => (
                <ListItemButton
                  key={index}
                  sx={{ pl: 4, color: "#fff" }}
                  onClick={() => handleSubItemClick(subItem)}
                >
                  <ArrowRightIcon></ArrowRightIcon>
                  <ListItemText
                    primary={subItem}
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
    </>
  );
};

export default DrawerItem;
