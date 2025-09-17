import React, { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
interface customTabs {
  TabClick?: (value: any) => void;
}

const CustomTabs = ({ TabClick }: customTabs) => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    TabClick?.(newValue);
    console.log(event);
  };

  return (
    <Box sx={{ width: "100%", bgcolor: "transparent" }}>
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="inherit"
        TabIndicatorProps={{ style: { display: "none" } }} // remove default underline
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
            // marginBottom: "2rem",
            padding: "6px 12px",
            backgroundColor: "#e0e0e0",
            marginRight: "8px",

            "&.Mui-selected": {
              backgroundColor: "#11395C",
              color: "#fff",
              fontWeight: 600,
            },
          },
        }}
      >
        {/* <Typography sx={{ fontWeight: 600, mr: 2 }}>Reasearch</Typography> */}
        <Tab label="All" />
        <Tab label="Equity" />
        <Tab label="F&O" />
        <Tab label="Commodity" />
        <Tab label="Currency" />
      </Tabs>
    </Box>
  );
};

export default CustomTabs;
