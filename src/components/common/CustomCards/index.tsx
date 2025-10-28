import React from "react";
import { Tabs, Tab, Box, Button } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

interface ResearchTabsProps {
  value: number;
  TabClick?: (value: number) => void;
  handleRefreshClicked?: () => void;
}

const ResearchTabs = ({
  value,
  TabClick,
  handleRefreshClicked,
}: ResearchTabsProps) => {
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log("event", event?.target);

    TabClick?.(newValue);
  };

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "transparent",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="inherit"
        TabIndicatorProps={{ style: { display: "none" } }}
        sx={{
          minHeight: "40px",
          "& .MuiTab-root": {
            minHeight: "20px",
            minWidth: "80px",
            textTransform: "none",
            fontSize: "12px",
            fontWeight: 500,
            color: "#666",
            borderRadius: "6px",
            padding: "6px 12px",
            backgroundColor: "#e0e0e0",
            marginRight: "8px",
            transition: "background-color 0.2s",
            "&.Mui-selected": {
              backgroundColor: "#11395C",
              color: "#fff",
              fontWeight: 600,
            },
          },
        }}
      >
        <Tab label="All" />
        <Tab label="Equity" />
        <Tab label="F&O" />
        <Tab label="Commodity" />
        {/* <Tab label="Fundamental" /> */}
      </Tabs>

      <Button
        size="small"
        variant="outlined"
        sx={{
          textTransform: "none",
          borderRadius: "16px",
          fontSize: "0.8rem",
          padding: "2px 8px",
          color: "#11395C",
        }}
        onClick={handleRefreshClicked}
      >
        Refresh <RefreshIcon sx={{ fontSize: "1.1rem" }} />
      </Button>
    </Box>
  );
};

export default ResearchTabs;
