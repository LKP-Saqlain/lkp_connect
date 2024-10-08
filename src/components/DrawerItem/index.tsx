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
import HomeIcon from "@mui/icons-material/Home";
import List from "@mui/material/List";
// import "./style.css";

type DrawerItemProps = {
  title: string;
  // subItems?: string[];
  activeMenu: string | null;
  open: boolean;
  handleDrawerOpen: () => void;
  handleClick: () => void;
  isMobile: boolean;
  handleSubItemClick: (data: any) => void;
};

const DrawerItem: React.FC<DrawerItemProps> = ({
  title,
  // subItems,
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

  return (
    <>
      <ListItem disablePadding sx={{ display: "block" }}>
        <ListItemButton
          onClick={handleSubMenuToggle}
          sx={{
            minHeight: 48,
            justifyContent: open ? "initial" : "center",
            px: 2.5,
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 1 : "auto",
              justifyContent: "center",
            }}
          >
            <HomeIcon onClick={handleDrawerOpen} sx={{ color: "#fff" }} />
          </ListItemIcon>
          <ListItemText
            primary={title}
            sx={{
              opacity: open ? 1 : 0,
              color: "#fff",
              fontFamily: "Public Sans, sans-serif",
              fontSize: "13px",
              fontWeight: 400,
            }}
            onClick={handleDrawerOpen}
            primaryTypographyProps={{
              fontSize: "13px",
            }}
          />
        </ListItemButton>
      </ListItem>
    </>
  );
};

export default DrawerItem;
