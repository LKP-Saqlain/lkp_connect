import { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";

import IndirectChannel from "./indirectChannel";
import IndirectChannelTarget from "./IndirectTarget";

const Index = ({ activeSubItem }: any) => {
  const [tabValue, setTabValue] = useState(0);

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs
        value={tabValue}
        onChange={(_, v) => setTabValue(v)}
        TabIndicatorProps={{ style: { display: "none" } }}
        sx={{
          marginTop: "1rem",
          marginLeft: ".7rem",
          marginBottom: "-6px",
          backgroundColor: "white",
          borderRadius: "11px",
          width: "fit-content",
          minHeight: 0,
          // border: "1.5px solid #11395C",
        }}
      >
        <Tab
          label="Summary"
          sx={{
            textTransform: "none",
            fontWeight: 400,
            borderRadius: "10px",
            px: 3,
            minHeight: 10,
            backgroundColor: tabValue === 0 ? "#11395C" : "white",
            color: tabValue === 0 ? "white" : "#11395C",
            "&.Mui-selected": {
              color: "white !important",
            },
            "& .MuiTab-wrapper": {
              color: tabValue === 0 ? "white" : "#11395C",
            },
          }}
        />

        <Tab
          label="Quarterly Performance"
          sx={{
            textTransform: "none",
            fontWeight: 400,
            borderRadius: "10px",
            px: 3,
            minHeight: 10,
            backgroundColor: tabValue === 1 ? "#11395C" : "white",
            color: tabValue === 1 ? "white" : "#11395C",
            "&.Mui-selected": {
              color: "white !important",
            },
            "& .MuiTab-wrapper": {
              color: tabValue === 1 ? "white" : "#11395C",
            },
          }}
        />
      </Tabs>

      <Box>
        {tabValue === 0 && <IndirectChannel activeSubItem={activeSubItem} />}
        {tabValue === 1 && (
          <IndirectChannelTarget activeSubItem={activeSubItem} />
        )}
      </Box>
    </Box>
  );
};

export default Index;
