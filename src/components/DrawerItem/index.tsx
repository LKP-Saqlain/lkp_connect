import React, { useState } from "react";
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
import HomeWorkRoundedIcon from "@mui/icons-material/HomeWorkRounded";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import List from "@mui/material/List";
import { MenuItems } from "../../types/index";
import StoreIcon from "@mui/icons-material/Store";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import DvrIcon from "@mui/icons-material/Dvr";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import LinkIcon from "@mui/icons-material/Link";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import ReceiptRoundedIcon from "@mui/icons-material/ReceiptRounded";
import { FaFileInvoice } from "react-icons/fa";
import LocalPoliceIcon from "@mui/icons-material/LocalPolice";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import StarBurst from "../../assets/images/starburst.png";
// import StarBurst1 from "../../assets/images/starburst1.png";
// import StarBurst2 from "../../assets/images/starburst2.png";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import TroubleshootIcon from "@mui/icons-material/Troubleshoot";
import Lottie from "react-lottie-player";
import newIcon from "../../assets/images/new.json";

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
  visible?: boolean;
};

const DrawerItem: React.FC<DrawerItemProps> = ({
  title,
  subItems,
  open,
  handleClick,
  activeMenu,
  handleSubItemClick,
  // visible,
}) => {
  const [activeSubItem, setActiveSubItem] = useState<string | null>(null);
  const isMenuOpen = activeMenu === title;
  // const images = [StarBurst2];
  // const [currentIndex, setCurrentIndex] = useState(0);

  // useEffect(() => {
  //   if (!visible) return;

  //   const interval = setInterval(() => {
  //     setCurrentIndex((prev) => (prev + 1) % images.length);
  //   }, 600);

  //   return () => clearInterval(interval);
  // }, [visible]);

  const iconMap: Record<string, JSX.Element> = {
    Account: <ReceiptRoundedIcon />,
    "Zone Overview": <StoreIcon />,
    "My Performance": <SupervisedUserCircleIcon />,
    Compliance: <ReceiptLongIcon />,
    DashBoard: <DvrIcon />,
    "Stock Study": <BallotIcon />,
    Overview: <HomeIcon />,
    Trading: <PollIcon />,
    Masters: <GridViewIcon />,
    "Revenue Details": <LibraryBooksIcon />,
    RMS: <SwitchAccountIcon />,
    "Client Details": <SwitchAccountIcon />,
    "e-KYC Link": <DomainVerificationIcon />,
    "Live Contest": <PollIcon />,
    "Marketing Materials": <AddBusinessIcon />,
    "Referal Lead": <CampaignIcon />,
    "KYC Dashboard": <StackedBarChartIcon />,
    "Registration Details": <HowToRegIcon />,
    "Stack Study": <StackedBarChartIcon />,
    Reports: <PostAddIcon />,
    "Regulatory Announcement": <AutoStoriesIcon />,
    EKYC: <LinkIcon />,
    "Back Office Report": <HomeWorkRoundedIcon />,
    IVR: <PublishedWithChangesIcon />,
    SPIP: <AnalyticsIcon />,
    "TPD Report": <FaFileInvoice size={17} />,
    "Employee Target": <LocalPoliceIcon />,
    "Employee Target-Q4": <LocalPoliceIcon />,
    "Partner Contest": <LocalPoliceIcon />,
    "SPIP Dashboard": <SpaceDashboardIcon />,
    "Client Request": <PublishedWithChangesIcon />,
    "Mutual Fund": <AttachMoneyIcon />,
    "DP AMC Contest": <AssignmentTurnedInIcon />,
    "DP AMC Contest-Q4": <AssignmentTurnedInIcon />,
    "Research Calls": <TroubleshootIcon />,
    "Partner Contest-Q4": <LocalPoliceIcon />,
  };

  const getIcon = (title: string) => {
    const icon = iconMap[title] || <ChevronRightIcon />;
    return (
      <span
        style={{ color: isMenuOpen ? "black" : "#F9F6EE", fontSize: "20px" }}
      >
        {React.cloneElement(icon, {
          sx: {
            color: isMenuOpen ? "black" : "#F9F6EE",
            fontSize: "20px",
          },
        })}
      </span>
    );
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
          backgroundColor: isMenuOpen ? "#ffffff" : "transparent",
          borderRadius: "10px",
          margin: "5px",
          boxShadow: isMenuOpen ? "0px 2px 6px rgba(0,0,0,0.1)" : "none",
          border: isMenuOpen ? "1px solid #ccc" : "none",
          transition:
            "background-color 0.2s ease, box-shadow 0.2s ease, color 0.2s ease",
          "&:hover": {
            backgroundColor: "#ffffff",
            boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
            "& .MuiListItemText-root, & .MuiSvgIcon-root": {
              color: "black",
              transition: "color 0.2s ease",
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
        {subItems &&
          subItems.length > 0 &&
          (isMenuOpen ? (
            <ExpandMoreIcon
              sx={{
                color: "black",
                fontSize: "18px",
                marginLeft: "auto",
              }}
            />
          ) : (
            <ChevronRightIcon
              sx={{
                color: "#F9F6EE",
                fontSize: "18px",
                marginLeft: "auto",
              }}
            />
          ))}

        {(title === "Zone Overview" ||
          title === "Account" ||
          title === "Mutual Fund" ||
          title === "Partner Contest" ||
          title === "Partner Contest-Q4" ||
          title === "DP AMC Contest" ||
          title === "Research Calls") && (
          <div className="starburst-bg">
            <Lottie
              loop
              play
              animationData={newIcon}
              style={{ width: 30, height: 30 }}
            />
            {/* <div className="starburst-bg">
            <img src={StarBurst} height={"30px"} alt="" />
          </div> */}
          </div>
        )}
        {/* {subItems && (isMenuOpen ? <ExpandLess /> : <ExpandMore />)} */}
      </ListItemButton>
      {subItems && (
        <Collapse in={isMenuOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {subItems.map((subItem, index) => (
              <ListItemButton
                key={index}
                onClick={() => handleSubItemSelection(subItem.mn)}
                sx={{
                  justifyContent: open ? "initial" : "center",

                  pl: 4,
                  margin: "5px",
                  backgroundColor:
                    activeSubItem === subItem.mn ? "#708090" : "transparent",
                  borderRadius: "10px",
                  boxShadow:
                    activeSubItem === subItem.mn
                      ? "0px 2px 6px rgba(0,0,0,0.1)"
                      : "none",
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    backgroundColor: "#708090",
                    borderRadius: "10px",
                    boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
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
                  <ArrowRightIcon
                    sx={{
                      color: activeSubItem === subItem.mn ? "black" : "#F9F6EE",
                      fontSize: "20px",
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={subItem.mn}
                  sx={{
                    opacity: open ? 1 : 0,
                    color: activeSubItem === subItem.mn ? "black" : "#F9F6EE",
                    transition: "color 0.5s",
                  }}
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
