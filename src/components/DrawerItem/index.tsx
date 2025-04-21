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
import BallotIcon from "@mui/icons-material/Ballot";
import PostAddIcon from "@mui/icons-material/PostAdd";
import List from "@mui/material/List";
import { MenuItems } from "../../types/index";
import StoreIcon from "@mui/icons-material/Store";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import DvrIcon from "@mui/icons-material/Dvr";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import LinkIcon from "@mui/icons-material/Link";
import DetailsIcon from "@mui/icons-material/Details";
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
      case "Zone Overview":
        return (
          <StoreIcon
            sx={{ color: isMenuOpen ? "black" : "#F9F6EE", fontSize: "20px" }}
          />
        );
      case "My Performance":
        return (
          <SupervisedUserCircleIcon
            sx={{ color: isMenuOpen ? "black" : "#F9F6EE", fontSize: "20px" }}
          />
        );
      case "Compliance":
        return (
          <ReceiptLongIcon
            sx={{ color: isMenuOpen ? "black" : "#F9F6EE", fontSize: "20px" }}
          />
        );
      case "DashBoard":
        return (
          <DvrIcon
            sx={{ color: isMenuOpen ? "black" : "#F9F6EE", fontSize: "20px" }}
          />
        );
      case "Stock Study":
        return (
          <BallotIcon
            sx={{ color: isMenuOpen ? "black" : "#F9F6EE", fontSize: "20px" }}
          />
        );
      case "Overview":
        return (
          <HomeIcon
            sx={{ color: isMenuOpen ? "black" : "#F9F6EE", fontSize: "20px" }}
          />
        );
      case "Trading":
        return (
          <PollIcon
            sx={{ color: isMenuOpen ? "black" : "#F9F6EE", fontSize: "20px" }}
          />
        );
      case "Masters":
        return (
          <GridViewIcon
            sx={{ color: isMenuOpen ? "black" : "#F9F6EE", fontSize: "20px" }}
          />
        );
      case "Revenue Details":
        return (
          <LibraryBooksIcon
            sx={{ color: isMenuOpen ? "black" : "#F9F6EE", fontSize: "20px" }}
          />
        );
      case "RMS":
        return (
          <SwitchAccountIcon
            sx={{ color: isMenuOpen ? "black" : "#F9F6EE", fontSize: "20px" }}
          />
        );
      case "Client Details":
        return (
          <SwitchAccountIcon
            sx={{ color: isMenuOpen ? "black" : "#F9F6EE", fontSize: "20px" }}
          />
        );
      case "e-KYC Link":
        return (
          <DomainVerificationIcon
            sx={{ color: isMenuOpen ? "black" : "#F9F6EE", fontSize: "20px" }}
          />
        );
      case "Live Contest":
        return (
          <PollIcon
            sx={{ color: isMenuOpen ? "black" : "#F9F6EE", fontSize: "20px" }}
          />
        );
      case "Marketing Materials":
        return (
          <AddBusinessIcon
            sx={{ color: isMenuOpen ? "black" : "#F9F6EE", fontSize: "20px" }}
          />
        );
      case "Referal Lead":
        return (
          <CampaignIcon
            sx={{ color: isMenuOpen ? "black" : "#F9F6EE", fontSize: "20px" }}
          />
        );
      case "Kyc Dashboard":
        return (
          <StackedBarChartIcon
            sx={{ color: isMenuOpen ? "black" : "#F9F6EE", fontSize: "20px" }}
          />
        );
      case "Registration Details":
        return (
          <HowToRegIcon
            sx={{ color: isMenuOpen ? "black" : "#F9F6EE", fontSize: "20px" }}
          />
        );
      case "Stack Study":
        return (
          <StackedBarChartIcon
            sx={{ color: isMenuOpen ? "black" : "#F9F6EE", fontSize: "20px" }}
          />
        );
      case "Reports":
        return (
          <PostAddIcon
            sx={{ color: isMenuOpen ? "black" : "#F9F6EE", fontSize: "20px" }}
          />
        );
      case "Regulatory Announcement":
        return (
          <AutoStoriesIcon
            sx={{ color: isMenuOpen ? "black" : "#F9F6EE", fontSize: "20px" }}
          />
        );
      case "EKYC":
        return (
          <LinkIcon
            sx={{ color: isMenuOpen ? "black" : "#F9F6EE", fontSize: "20px" }}
          />
        );
      case "Other Details":
        return (
          <DetailsIcon
            sx={{ color: isMenuOpen ? "black" : "#F9F6EE", fontSize: "20px" }}
          />
        );
      default:
        return (
          <ChevronRightIcon
            sx={{ color: isMenuOpen ? "black" : "#F9F6EE", fontSize: "20px" }}
          />
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
          primaryTypographyProps={{
            fontSize: "15px",
            fontFamily: "Public Sans",
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
                    fontSize: "12px",
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
